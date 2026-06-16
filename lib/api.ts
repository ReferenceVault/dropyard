const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const ACCESS_TOKEN_KEY  = 'dy_access_token';
const REFRESH_TOKEN_KEY = 'dy_refresh_token';
const CSRF_COOKIE_NAME  = 'dy_csrf';

// BUG-063 — wipe every per-user localStorage key on session-end paths so the
// next user on the same device doesn't inherit stale state (Seller Mode
// label, saved email, etc.). Keep in sync with AuthContext.clearUserStorage().
function clearUserStorage(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem('dropyard:mode');
  localStorage.removeItem('dropyard_email');
}

// Auth-attempt endpoints — a 401 here means "wrong credentials", NOT
// "session expired", so we must not blow away tokens or redirect.
const AUTH_ATTEMPT_PATHS = new Set([
  '/api/auth/signin',
  '/api/auth/signup',
  '/api/auth/google',
  '/api/auth/refresh',
]);

// Methods that mutate state and therefore need a CSRF token attached.
const MUTATING_METHODS = new Set(['POST', 'PATCH', 'PUT', 'DELETE']);

// Route the "session expired" redirect to the admin login when the user is
// already inside the admin area, otherwise to the public /join page.
function sessionExpiredRedirect(): string {
  if (typeof window === 'undefined') return '/join';
  return window.location.pathname.startsWith('/admin') ? '/admin/login' : '/join';
}

interface ApiOptions extends RequestInit {
  token?: string;
  _isRetry?: boolean; // internal flag — prevent infinite retry loop
}

// ─── CSRF token cache ───────────────────────────────────────────────────────
// The backend's dy_csrf cookie is readable (not httpOnly) so we mirror it
// into the X-CSRF-Token header on every mutating request. We read directly
// from document.cookie (no network call needed) — the cookie is set on
// signin/signup/refresh and persists for the refresh-token lifetime.
//
// If the cookie is missing (fresh browser, anonymous visitor), we bootstrap
// via GET /api/auth/csrf which sets it. Result is memoized for the page life.
let csrfBootstrap: Promise<string | null> | null = null;
async function getCsrfToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  const fromCookie = readCookie(CSRF_COOKIE_NAME);
  if (fromCookie) return fromCookie;
  if (csrfBootstrap) return csrfBootstrap;
  csrfBootstrap = fetch(`${BASE_URL}/api/auth/csrf`, { credentials: 'include' })
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => (j && typeof j.csrfToken === 'string' ? j.csrfToken : readCookie(CSRF_COOKIE_NAME)))
    .catch(() => null)
    .finally(() => { csrfBootstrap = null; });
  return csrfBootstrap;
}
function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/[.$?*|{}()[\]\\/+^]/g, '\\$&') + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
}

async function doFetch(path: string, options: ApiOptions): Promise<Response> {
  const { token, _isRetry: _, headers, method, ...rest } = options;
  const effectiveMethod = (method || 'GET').toUpperCase();

  // Attach CSRF header on mutating browser requests. Bypassed when an explicit
  // Bearer token is present (server-to-server/mobile — backend's csrfProtection
  // middleware skips Bearer-authenticated calls anyway).
  let csrfHeader: Record<string, string> = {};
  if (MUTATING_METHODS.has(effectiveMethod) && !token) {
    const csrf = await getCsrfToken();
    if (csrf) csrfHeader = { 'X-CSRF-Token': csrf };
  }

  return fetch(`${BASE_URL}${path}`, {
    ...rest,
    method: effectiveMethod,
    // BUG-058 — send cookies on every request so the httpOnly session cookie
    // travels cross-site (frontend on dropyard.app, backend on api.dropyard.app).
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...csrfHeader,
      ...headers,
    },
  });
}

export async function apiRequest<T = unknown>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  // BUG-059 — auth ride-along: cookies are the canonical auth surface. We
  // intentionally do NOT auto-attach a Bearer header from localStorage. If a
  // caller explicitly hands us options.token (curl-style server callers,
  // tests), we honor it. Otherwise the httpOnly cookie does the work.
  // Dual-sending Bearer + cookie made tampering with localStorage look like
  // it worked (because cookie silently took over). Removing the auto-Bearer
  // makes the behavior obvious: the only thing that authenticates is the
  // httpOnly cookie an attacker can't touch from JS.

  let res = await doFetch(path, options);

  const isAuthAttempt = AUTH_ATTEMPT_PATHS.has(path);

  // 401 handling — branch on the backend's error code (BUG-059):
  //   TOKEN_EXPIRED → silent refresh + retry (normal flow)
  //   TOKEN_INVALID / NO_TOKEN / no code → straight to /join (don't gift a
  //     fresh session to a tamper attempt)
  //   isAuthAttempt → leave it to the form handler (wrong credentials)
  if (res.status === 401 && !options._isRetry && !isAuthAttempt) {
    // Peek at the body to read the code without consuming the stream for
    // downstream callers. clone() so we can still re-read in the error path.
    const peek = await res.clone().json().catch(() => ({} as { code?: string }));
    const code = (peek as { code?: string }).code;

    if (code === 'TOKEN_EXPIRED') {
      try {
        const refreshRes = await fetch(`${BASE_URL}/api/auth/refresh`, {
          method:      'POST',
          credentials: 'include',
          headers:     { 'Content-Type': 'application/json' },
          body:        '{}',
        });
        if (refreshRes.ok) {
          res = await doFetch(path, { ...options, _isRetry: true });
        } else {
          // Refresh itself failed (cookie missing/expired/tampered) — wipe
          // any legacy localStorage tokens and bounce to login.
          clearUserStorage();
          if (typeof window !== 'undefined') window.location.href = sessionExpiredRedirect();
          throw new Error('Session expired. Please sign in again.');
        }
      } catch (err) {
        if (err instanceof Error && err.message === 'Session expired. Please sign in again.') throw err;
        // Network blip during refresh — fall through; the original 401
        // surfaces below as "Authentication required" to the caller.
      }
    } else {
      // TOKEN_INVALID / NO_TOKEN / unrecognized — DON'T try refresh. The
      // session is either gone or being tampered with; either way the
      // user goes back to /join. Backend already cleared the cookies.
      clearUserStorage();
      if (typeof window !== 'undefined') window.location.href = sessionExpiredRedirect();
      throw new Error('Session expired. Please sign in again.');
    }
  }

  const data = await res.json().catch(() => ({} as Record<string, unknown>));

  if (!res.ok) {
    if (res.status === 401 && isAuthAttempt) {
      throw new Error((data as { error?: string }).error || 'Invalid email or password.');
    }
    if (res.status === 401 && typeof window !== 'undefined') {
      clearUserStorage();
      window.location.href = sessionExpiredRedirect();
      throw new Error('Session expired. Please sign in again.');
    }
    throw new Error((data as { error?: string }).error || 'Something went wrong');
  }

  return data as T;
}

// ─── S3 photo upload helper ─────────────────────────────────────────────────
// Multipart upload doesn't go through apiRequest (different content-type),
// so it gets its own auth + CSRF wiring. Cookies travel automatically via
// credentials:'include'; the legacy token path is preserved as a fallback.
async function doUpload(file: File, token: string | null, csrfToken: string | null): Promise<Response> {
  const form = new FormData();
  form.append('file', file);
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (csrfToken && !token) headers['X-CSRF-Token'] = csrfToken;
  return fetch(`${BASE_URL}/api/uploads/s3`, {
    method:      'POST',
    credentials: 'include',
    headers,
    body:        form,
  });
}

export async function uploadItemPhoto(
  file: File
): Promise<{ key: string; publicUrl: string; maxFilesPerItem: number }> {
  // BUG-059 — same cookie-only posture as apiRequest. No automatic Bearer
  // attach; cookies handle auth. Only refresh on TOKEN_EXPIRED.
  const csrfToken = await getCsrfToken();
  let res = await doUpload(file, null, csrfToken);

  if (res.status === 401 && typeof window !== 'undefined') {
    const peek = await res.clone().json().catch(() => ({} as { code?: string }));
    const code = (peek as { code?: string }).code;

    if (code === 'TOKEN_EXPIRED') {
      const refreshRes = await fetch(`${BASE_URL}/api/auth/refresh`, {
        method:      'POST',
        credentials: 'include',
        headers:     { 'Content-Type': 'application/json' },
        body:        '{}',
      });
      if (refreshRes.ok) {
        res = await doUpload(file, null, await getCsrfToken());
      } else {
        clearUserStorage();
        window.location.href = sessionExpiredRedirect();
        throw new Error('Session expired. Please sign in again.');
      }
    } else {
      clearUserStorage();
      window.location.href = sessionExpiredRedirect();
      throw new Error('Session expired. Please sign in again.');
    }
  }

  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) {
    throw new Error(typeof data.error === 'string' ? data.error : 'Upload failed');
  }
  return data as { key: string; publicUrl: string; maxFilesPerItem: number };
}

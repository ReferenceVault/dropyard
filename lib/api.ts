const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const ACCESS_TOKEN_KEY  = 'dy_access_token';
const REFRESH_TOKEN_KEY = 'dy_refresh_token';

// Auth-attempt endpoints — a 401 here means "wrong credentials", NOT
// "session expired", so we must not blow away tokens or redirect.
const AUTH_ATTEMPT_PATHS = new Set([
  '/api/auth/signin',
  '/api/auth/signup',
  '/api/auth/google',
  '/api/auth/refresh',
]);

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

async function doFetch(path: string, options: ApiOptions): Promise<Response> {
  const { token, _isRetry: _, headers, ...rest } = options;
  return fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });
}

export async function apiRequest<T = unknown>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  // Always use the freshest token from localStorage, falling back to whatever was passed in
  if (typeof window !== 'undefined') {
    const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (storedToken) options = { ...options, token: storedToken };
  }

  let res = await doFetch(path, options);

  const isAuthAttempt = AUTH_ATTEMPT_PATHS.has(path);

  // Auto-refresh on 401 (token expired) — one retry only. Skip for auth-attempt
  // endpoints where 401 means "bad credentials", not "session expired".
  if (res.status === 401 && !options._isRetry && !isAuthAttempt) {
    const refreshToken = typeof window !== 'undefined'
      ? localStorage.getItem(REFRESH_TOKEN_KEY)
      : null;

    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${BASE_URL}/api/auth/refresh`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ refreshToken }),
        });

        if (refreshRes.ok) {
          const { accessToken, refreshToken: newRefreshToken } = await refreshRes.json();
          localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
          localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);

          // Retry original request with fresh token
          res = await doFetch(path, { ...options, token: accessToken, _isRetry: true });
        } else {
          // Refresh token itself is expired — clear session
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          localStorage.removeItem(REFRESH_TOKEN_KEY);
          window.location.href = sessionExpiredRedirect();
          throw new Error('Session expired. Please sign in again.');
        }
      } catch (err) {
        if (err instanceof Error && err.message === 'Session expired. Please sign in again.') throw err;
        // Network error during refresh — fall through to original error
      }
    }
  }

  const data = await res.json();

  if (!res.ok) {
    // 401 from an auth attempt (signin/signup/google) — surface the server
    // message to the form. Do NOT clear tokens or redirect.
    if (res.status === 401 && isAuthAttempt) {
      throw new Error(data.error || 'Invalid email or password.');
    }
    // 401 from an authenticated endpoint after refresh failed — session is gone.
    if (res.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      window.location.href = sessionExpiredRedirect();
      throw new Error('Session expired. Please sign in again.');
    }
    throw new Error(data.error || 'Something went wrong');
  }

  return data as T;
}

// Internal one-shot S3 upload — used by `uploadItemPhoto` below. Separated so
// the auto-refresh path can call this twice (original attempt + retry after
// refresh) without copy-pasting the FormData/headers code.
async function doUpload(file: File, token: string | null): Promise<Response> {
  const form = new FormData();
  form.append('file', file);
  return fetch(`${BASE_URL}/api/uploads/s3`, {
    method:  'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body:    form,
  });
}

export async function uploadItemPhoto(
  file: File
): Promise<{ key: string; publicUrl: string; maxFilesPerItem: number }> {
  let token = typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;
  let res = await doUpload(file, token);

  // Mirror apiRequest's auto-refresh path so a long-form item creation flow
  // doesn't fail just because the 15-minute access token expired while the
  // seller was typing. On 401: try /api/auth/refresh once. On success, retry
  // the upload with the fresh token. On failure, clear the session and
  // redirect to the sign-in page the same way apiRequest does — otherwise
  // the user gets the raw "Token expired or invalid" surface on the form.
  if (res.status === 401 && typeof window !== 'undefined') {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${BASE_URL}/api/auth/refresh`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ refreshToken }),
        });
        if (refreshRes.ok) {
          const refreshed = await refreshRes.json() as { accessToken: string; refreshToken: string };
          localStorage.setItem(ACCESS_TOKEN_KEY, refreshed.accessToken);
          localStorage.setItem(REFRESH_TOKEN_KEY, refreshed.refreshToken);
          token = refreshed.accessToken;
          res   = await doUpload(file, token);
        } else {
          // Refresh token gone too — wipe session and bounce the user.
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          localStorage.removeItem(REFRESH_TOKEN_KEY);
          window.location.href = sessionExpiredRedirect();
          throw new Error('Session expired. Please sign in again.');
        }
      } catch (err) {
        if (err instanceof Error && err.message === 'Session expired. Please sign in again.') throw err;
        // Network blip during refresh — fall through; res is still the 401.
      }
    }
    // No refresh token (or refresh failed silently) and we still have a 401
    // — same "session is gone" treatment as apiRequest.
    if (res.status === 401) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
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

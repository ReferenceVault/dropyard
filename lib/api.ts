const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const ACCESS_TOKEN_KEY  = 'dy_access_token';
const REFRESH_TOKEN_KEY = 'dy_refresh_token';

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

  // Auto-refresh on 401 (token expired) — one retry only
  if (res.status === 401 && !options._isRetry) {
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
          window.location.href = '/join';
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
    // If still 401 after refresh attempt, session is gone — redirect to sign in
    if (res.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      window.location.href = '/join';
      throw new Error('Session expired. Please sign in again.');
    }
    throw new Error(data.error || 'Something went wrong');
  }

  return data as T;
}

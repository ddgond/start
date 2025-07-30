import { getAccessToken, setAccessToken } from "./tokenStore";

const API_ENDPOINT = "/api";

export async function jsonFetchWithAuth<T>(
  path: string,
  options: RequestInit & { skipRefresh?: boolean } = {}
): Promise<T> {
  return await jsonFetch(path, { ...options, skipAuth: false });
}

export async function jsonFetchWithoutAuth<T>(
  path: string,
  options: RequestInit & { skipRefresh?: boolean } = {}
): Promise<T> {
  return await jsonFetch(path, { ...options, skipAuth: true });
}

async function jsonFetch<T>(
  path: string,
  options: RequestInit & { skipAuth?: boolean; skipRefresh?: boolean } = {}
): Promise<T> {
  if (!getAccessToken() && !options.skipAuth) {
    // Necessary for initial access token loading
    const ok = await refreshTokens();
    if (!ok) {
      throw new Error("No access token");
    }
  }

  const res = await fetch(API_ENDPOINT + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(getAccessToken() && !options.skipAuth
        ? { Authorization: `Bearer ${getAccessToken()}` }
        : {}),
    },
    credentials: "include",
  });

  if (res.ok) return res.json();

  if (res.status === 403 && !options.skipAuth && !options.skipRefresh) {
    const ok = await refreshTokens();
    if (ok) return jsonFetch<T>(path, options);
  }

  throw new Error(`${res.status} ${res.statusText}`);
}

/* ---- refresh helper --------------------------------------------- */

async function refreshTokens(): Promise<boolean> {
  try {
    const res = await fetch(API_ENDPOINT + "/refresh-tokens", {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return false;

    const { accessToken }: { accessToken: string } = await res.json();
    setAccessToken(accessToken);
    return true;
  } catch {
    setAccessToken(null);
    return false;
  }
}

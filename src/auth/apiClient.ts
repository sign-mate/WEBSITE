import type { ApiEnvelope } from "./types";

export class ApiError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api/v1";

interface RequestOptions {
  auth?: boolean;
}

export async function apiPost<T>(
  path: string,
  body: unknown,
  options: RequestOptions = {}
): Promise<T> {
  return apiRequest<T>(path, "POST", body, options);
}

export async function apiGet<T>(path: string, options: RequestOptions = {}): Promise<T> {
  return apiRequest<T>(path, "GET", undefined, options);
}

export async function apiPut<T>(
  path: string,
  body: unknown,
  options: RequestOptions = {}
): Promise<T> {
  return apiRequest<T>(path, "PUT", body, options);
}

async function apiRequest<T>(
  path: string,
  method: string,
  body: unknown,
  options: RequestOptions
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (options.auth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json: ApiEnvelope<T> = await res.json();

  if (!json.success) {
    const err = json.error;
    throw new ApiError(err?.code ?? "UNKNOWN", err?.message ?? "요청에 실패했습니다.");
  }

  return json.data as T;
}

const ACCESS_TOKEN_KEY = "signmate_access_token";
const REFRESH_TOKEN_KEY = "signmate_refresh_token";

export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

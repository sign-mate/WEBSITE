import type { ApiEnvelope } from "./types";

/**
 * 백엔드 응답 형태: { success, data?, error?: { code, message } }
 * (com.signmate.backend.global.response.ApiResponse)
 */
export class ApiError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

// 백엔드 CORS/포트 설정에 맞춰 .env에서 오버라이드하세요 (예: VITE_API_BASE_URL=https://api.signmate.team/api/v1)
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api/v1";

interface RequestOptions {
  auth?: boolean; // true면 Authorization 헤더 부착
}

export async function apiPost<T>(
  path: string,
  body: unknown,
  options: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (options.auth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const json: ApiEnvelope<T> = await res.json();

  if (!json.success) {
    const err = json.error;
    throw new ApiError(err?.code ?? "UNKNOWN", err?.message ?? "요청에 실패했습니다.");
  }

  return json.data as T;
}

// ---- 토큰 저장 (백엔드가 JWT를 발급하므로 여기서 관리) --------------------------

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

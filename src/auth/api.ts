import { apiPost } from "./apiClient";
import type {
  FindEmailResponse,
  GoogleLoginResponse,
  GoogleSignupPayload,
  SignupPayload,
  TokenResponse,
} from "./types";

/**
 * SERVER 저장소(com.signmate.backend)의 실제 컨트롤러에 맞춘 API 함수입니다.
 * 백엔드는 SMS 인증 상태를 phone 기준으로 서버에서 직접 추적하므로(10분 TTL),
 * 프론트는 verifyToken 같은 걸 따로 들고 있을 필요 없이 phone만 그대로 넘기면 됩니다.
 */

// ---- SMS 인증 (SmsController) ---------------------------------------------

export async function sendSmsCode(phone: string): Promise<void> {
  await apiPost<void>("/sms/send", { phone });
}

export async function verifySmsCode(phone: string, code: string): Promise<void> {
  await apiPost<void>("/sms/verify", { phone, code });
}

// ---- 회원가입 / 로그인 (AuthController) -------------------------------------

/** 일반 회원가입. 이름+전화번호 중복 시 USER-006/USER-007 에러가 던져집니다. */
export async function signup(payload: SignupPayload): Promise<TokenResponse> {
  return apiPost<TokenResponse>("/auth/signup", payload);
}

export async function login(email: string, password: string): Promise<TokenResponse> {
  return apiPost<TokenResponse>("/auth/login", { email, password });
}

/** idToken으로 기존 구글 계정 여부 확인. registered=false면 email/name을 회원가입 폼에 채워 넣으세요. */
export async function googleLogin(idToken: string): Promise<GoogleLoginResponse> {
  return apiPost<GoogleLoginResponse>("/auth/google", { idToken });
}

/** 구글 회원가입. 비밀번호 필드 없음 — 구글 계정은 비밀번호를 갖지 않습니다. */
export async function googleSignup(payload: GoogleSignupPayload): Promise<TokenResponse> {
  return apiPost<TokenResponse>("/auth/google/signup", payload);
}

export async function refreshTokens(refreshToken: string): Promise<TokenResponse> {
  return apiPost<TokenResponse>("/auth/refresh", { refreshToken });
}

// ---- 아이디 / 비밀번호 찾기 --------------------------------------------------

export async function findEmail(name: string, phone: string): Promise<FindEmailResponse> {
  return apiPost<FindEmailResponse>("/auth/find-email", { name, phone });
}

/** 구글 계정으로 시도하면 USER-009(GOOGLE_ACCOUNT_NO_PASSWORD) 에러가 던져집니다. */
export async function resetPassword(
  email: string,
  name: string,
  phone: string,
  newPassword: string
): Promise<void> {
  await apiPost<void>("/auth/reset-password", { email, name, phone, newPassword });
}

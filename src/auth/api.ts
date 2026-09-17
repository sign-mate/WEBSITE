import { apiPost } from "./apiClient";
import type {
  FindEmailResponse,
  GoogleLoginResponse,
  GoogleSignupPayload,
  SignupPayload,
  TokenResponse,
} from "./types";

export async function sendSmsCode(phone: string): Promise<void> {
  await apiPost<void>("/sms/send", { phone });
}

export async function verifySmsCode(phone: string, code: string): Promise<void> {
  await apiPost<void>("/sms/verify", { phone, code });
}

export async function signup(payload: SignupPayload): Promise<TokenResponse> {
  return apiPost<TokenResponse>("/auth/signup", payload);
}

export async function login(email: string, password: string): Promise<TokenResponse> {
  return apiPost<TokenResponse>("/auth/login", { email, password });
}

export async function googleLogin(idToken: string): Promise<GoogleLoginResponse> {
  return apiPost<GoogleLoginResponse>("/auth/google", { idToken });
}

export async function googleSignup(payload: GoogleSignupPayload): Promise<TokenResponse> {
  return apiPost<TokenResponse>("/auth/google/signup", payload);
}

export async function refreshTokens(refreshToken: string): Promise<TokenResponse> {
  return apiPost<TokenResponse>("/auth/refresh", { refreshToken });
}

export async function findEmail(name: string, phone: string): Promise<FindEmailResponse> {
  return apiPost<FindEmailResponse>("/auth/find-email", { name, phone });
}

export async function resetPassword(
  email: string,
  name: string,
  phone: string,
  newPassword: string
): Promise<void> {
  await apiPost<void>("/auth/reset-password", { email, name, phone, newPassword });
}

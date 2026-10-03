import { apiDelete, apiGet, apiPost, apiPut } from "./apiClient";
import { KAKAO_REDIRECT_URI } from "./kakaoAuth";
import type {
  BillingCardPayload,
  ChangePaymentMethodResponse,
  FindEmailResponse,
  SocialLoginResponse,
  GoogleSignupPayload,
  KakaoSignupPayload,
  MyPageInfo,
  PaymentHistoryItem,
  SignupPayload,
  SubscribeResponse,
  SubscriptionInfo,
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

export async function googleLogin(idToken: string): Promise<SocialLoginResponse> {
  return apiPost<SocialLoginResponse>("/auth/google", { idToken });
}

export async function googleSignup(payload: GoogleSignupPayload): Promise<TokenResponse> {
  return apiPost<TokenResponse>("/auth/google/signup", payload);
}

export async function kakaoLogin(code: string): Promise<SocialLoginResponse> {
  return apiPost<SocialLoginResponse>("/auth/kakao", { code, redirectUri: KAKAO_REDIRECT_URI });
}

export async function kakaoSignup(payload: KakaoSignupPayload): Promise<TokenResponse> {
  return apiPost<TokenResponse>("/auth/kakao/signup", payload);
}

export async function refreshTokens(refreshToken: string): Promise<TokenResponse> {
  return apiPost<TokenResponse>("/auth/refresh", { refreshToken });
}

export async function logout(refreshToken: string): Promise<void> {
  await apiPost<void>("/auth/logout", { refreshToken });
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

export async function getMyInfo(): Promise<MyPageInfo> {
  return apiGet<MyPageInfo>("/users/me", { auth: true });
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await apiPut<void>("/users/me/password", { currentPassword, newPassword }, { auth: true });
}

export async function withdrawAccount(): Promise<void> {
  await apiDelete<void>("/users/me", { auth: true });
}

export async function getMySubscription(): Promise<SubscriptionInfo> {
  return apiGet<SubscriptionInfo>("/subscriptions/me", { auth: true });
}

export async function cancelSubscription(): Promise<void> {
  await apiPost<void>("/subscriptions/cancel", undefined, { auth: true });
}

export async function revokeCancellation(): Promise<void> {
  await apiPost<void>("/subscriptions/cancel/revoke", undefined, { auth: true });
}

export async function changePaymentMethod(
  payload: BillingCardPayload
): Promise<ChangePaymentMethodResponse> {
  return apiPut<ChangePaymentMethodResponse>("/subscriptions/payment-method", payload, { auth: true });
}

export async function getPaymentHistory(): Promise<PaymentHistoryItem[]> {
  return apiGet<PaymentHistoryItem[]>("/payments", { auth: true });
}

export async function subscribeBilling(payload: BillingCardPayload): Promise<SubscribeResponse> {
  return apiPost<SubscribeResponse>("/payments/billing-key", payload, { auth: true });
}
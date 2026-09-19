export type Provider = "LOCAL" | "GOOGLE" | "KAKAO";

export interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface SocialLoginResponse {
  registered: boolean;
  accessToken?: string;
  refreshToken?: string;
  email?: string;
  name?: string;
  // Kakao only, present when registered=false: forward to /auth/kakao/signup.
  kakaoAccessToken?: string;
}

export interface FindEmailResponse {
  email: string;
  provider: Provider;
}

export interface SignupPayload {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface GoogleSignupPayload {
  idToken: string;
  name: string;
  phone: string;
}

export interface KakaoSignupPayload {
  accessToken: string;
  name: string;
  phone: string;
}

export interface MyPageInfo {
  name: string;
  email: string;
  phone: string;
  provider: Provider;
}

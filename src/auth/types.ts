export type Provider = "LOCAL" | "GOOGLE";

export interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface GoogleLoginResponse {
  registered: boolean;
  accessToken?: string;
  refreshToken?: string;
  email?: string;
  name?: string;
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

export interface MyPageInfo {
  name: string;
  email: string;
  phone: string;
}

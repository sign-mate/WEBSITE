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
  code: string;
  redirectUri: string;
  name: string;
  phone: string;
}

export interface MyPageInfo {
  name: string;
  email: string;
  phone: string;
  provider: Provider;
}

export type Plan = "FREE" | "PRO";

export type SubscriptionStatus = "PENDING" | "ACTIVE" | "CANCELED" | "EXPIRED" | null;

export type PaymentStatus = "REQUESTED" | "PAID" | "FAILED" | "CANCELED";

export type SubscriptionSource = "WEB" | "GOOGLE_PLAY" | null;

export interface SubscriptionUsage {
  used: number;
  limit: number | null;
}

export interface SubscriptionInfo {
  plan: Plan;
  status: SubscriptionStatus;
  nextBillingAt: string | null;
  expiresAt: string | null;
  canceled: boolean;
  paymentFailed: boolean;
  cardName: string | null;
  usage: SubscriptionUsage | null;
  source: SubscriptionSource;
}

export interface BillingCardPayload {
  cardNo: string;
  expYear: string;
  expMonth: string;
  idNo: string;
  cardPw: string;
}

export interface ChangePaymentMethodResponse {
  cardName: string;
}

export interface PaymentHistoryItem {
  orderId: string;
  amount: number;
  status: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
}

export interface SubscribeResponse {
  cardName: string;
  amount: number;
  paidAt: string;
  nextBillingAt: string;
}
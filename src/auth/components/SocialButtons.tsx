import { useState } from "react";
import { getGoogleIdToken } from "../googleAuth";
import { googleLogin } from "../api";
import { ApiError } from "../apiClient";
import type { GoogleLoginResponse } from "../types";

interface Props {
  onResult: (result: GoogleLoginResponse & { idToken: string }) => void;
  onError: (message: string) => void;
  disabled?: boolean;
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.3-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.7 28.18c-.44-1.32-.69-2.72-.69-4.18s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.36-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.36 5.7c1.72-5.2 6.57-9.07 12.3-9.07z"
      />
    </svg>
  );
}

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="#191600"
        d="M12 1.6C5.93 1.6 1 5.46 1 10.22c0 3.03 2 5.7 5.03 7.24l-1.02 3.72a.55.55 0 0 0 .83.6l4.5-2.95c.55.06 1.1.09 1.66.09 6.07 0 11-3.86 11-8.7 0-4.76-4.93-8.62-11-8.62z"
      />
    </svg>
  );
}

export default function SocialButtons({ onResult, onError, disabled }: Props) {
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const idToken = await getGoogleIdToken();
      const res = await googleLogin(idToken);
      onResult({ ...res, idToken });
    } catch (e) {
      onError(e instanceof ApiError ? e.message : e instanceof Error ? e.message : "구글 인증에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="social-row">
      <button type="button" className="btn-social kakao" disabled aria-label="카카오로 계속하기 (준비 중)">
        <KakaoIcon />
        카카오로 계속하기
        <span className="social-soon">준비 중</span>
      </button>

      <button type="button" className="btn-social google" disabled={disabled || loading} onClick={handleGoogle}>
        <GoogleIcon />
        {loading ? "확인 중..." : "Google로 계속하기"}
      </button>
    </div>
  );
}

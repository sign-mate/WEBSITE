import { useEffect, useRef, useState } from "react";
import { clearGoogleCredentialHandler, isGoogleAuthConfigured, renderGoogleButton } from "../googleAuth";
import { getKakaoAuthCode } from "../kakaoAuth";
import { googleLogin, kakaoLogin } from "../api";
import { ApiError } from "../apiClient";
import type { SocialLoginResponse } from "../types";

export type SocialResult = SocialLoginResponse & { idToken?: string };

interface Props {
  onResult: (provider: "GOOGLE" | "KAKAO", result: SocialResult) => void;
  onError: (message: string) => void;
  disabled?: boolean;
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
  const [loadingProvider, setLoadingProvider] = useState<"GOOGLE" | "KAKAO" | null>(null);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const googleContainerRef = useRef<HTMLDivElement | null>(null);
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    if (!isGoogleAuthConfigured()) {
      setGoogleError("Google 로그인이 설정되지 않았습니다. 관리자에게 문의해주세요.");
      return;
    }

    const container = googleContainerRef.current;
    if (!container) return;

    const handleCredential = async (idToken: string) => {
      setLoadingProvider("GOOGLE");
      try {
        const res = await googleLogin(idToken);
        onResultRef.current("GOOGLE", { ...res, idToken });
      } catch (e) {
        onErrorRef.current(e instanceof ApiError ? e.message : e instanceof Error ? e.message : "구글 인증에 실패했습니다.");
      } finally {
        setLoadingProvider(null);
      }
    };

    let cancelled = false;
    renderGoogleButton(container, handleCredential, {
      width: Math.min(container.offsetWidth || 400, 400),
    }).catch((e) => {
      if (!cancelled) {
        setGoogleError(e instanceof Error ? e.message : "Google 로그인 버튼을 불러오지 못했습니다.");
      }
    });

    return () => {
      cancelled = true;
      clearGoogleCredentialHandler(handleCredential);
      container.innerHTML = "";
    };
  }, []);

  const handleKakao = async () => {
    setLoadingProvider("KAKAO");
    try {
      const code = await getKakaoAuthCode();
      const res = await kakaoLogin(code);
      onResult("KAKAO", res);
    } catch (e) {
      onError(e instanceof ApiError ? e.message : e instanceof Error ? e.message : "카카오 인증에 실패했습니다.");
    } finally {
      setLoadingProvider(null);
    }
  };

  const googleBusy = disabled || loadingProvider !== null;

  return (
    <div className="social-row">
      <button
        type="button"
        className="btn-social kakao"
        disabled={disabled || loadingProvider !== null}
        onClick={handleKakao}
      >
        <KakaoIcon />
        {loadingProvider === "KAKAO" ? "확인 중..." : "카카오로 계속하기"}
      </button>

      {googleError ? (
        <p className="field-error google-btn-error">{googleError}</p>
      ) : (
        <div className={`google-btn-slot${googleBusy ? " is-busy" : ""}`}>
          <div ref={googleContainerRef} className="google-btn-container" />
          {loadingProvider === "GOOGLE" && <span className="google-btn-overlay">확인 중...</span>}
        </div>
      )}
    </div>
  );
}
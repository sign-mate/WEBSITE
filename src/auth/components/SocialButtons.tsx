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

/**
 * 카카오는 백엔드(SERVER)에 아직 구현되어 있지 않아 버튼을 넣지 않았습니다.
 * 백엔드에 /auth/kakao, /auth/kakao/signup이 추가되면 이 컴포넌트에 동일한 패턴으로 추가하세요.
 */
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
      <button type="button" className="btn-social google" disabled={disabled || loading} onClick={handleGoogle}>
        {loading ? "확인 중..." : "Google로 계속하기"}
      </button>
    </div>
  );
}

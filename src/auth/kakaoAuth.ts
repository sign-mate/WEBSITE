const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY as string | undefined;

export const KAKAO_REDIRECT_URI = `${window.location.origin}/oauth/kakao/callback`;

interface KakaoOauthMessage {
  source: "kakao-oauth";
  code?: string;
  error?: string;
}

function isKakaoOauthMessage(data: unknown): data is KakaoOauthMessage {
  return !!data && typeof data === "object" && (data as { source?: unknown }).source === "kakao-oauth";
}

export async function getKakaoAuthCode(): Promise<string> {
  if (!REST_API_KEY) {
    throw new Error("VITE_KAKAO_REST_API_KEY가 설정되지 않았습니다. .env를 확인해주세요.");
  }

  const authorizeUrl =
    `https://kauth.kakao.com/oauth/authorize?client_id=${encodeURIComponent(REST_API_KEY)}` +
    `&redirect_uri=${encodeURIComponent(KAKAO_REDIRECT_URI)}&response_type=code`;

  const popup = window.open(authorizeUrl, "kakao-login", "width=480,height=640");
  if (!popup) {
    throw new Error("팝업이 차단되었습니다. 브라우저 팝업 차단을 해제해주세요.");
  }

  return new Promise<string>((resolve, reject) => {
    const closeCheck = window.setInterval(() => {
      if (popup.closed) {
        cleanup();
        reject(new Error("카카오 로그인이 취소되었습니다."));
      }
    }, 500);

    function cleanup() {
      window.clearInterval(closeCheck);
      window.removeEventListener("message", onMessage);
    }

    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin || !isKakaoOauthMessage(event.data)) return;
      cleanup();
      popup?.close();
      if (event.data.code) {
        resolve(event.data.code);
      } else {
        reject(new Error(event.data.error ?? "카카오 인증에 실패했습니다."));
      }
    }

    window.addEventListener("message", onMessage);
  });
}
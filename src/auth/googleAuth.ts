/**
 * Google Identity Services(GIS)를 이용해 idToken을 발급받는 래퍼입니다.
 * 백엔드 GoogleTokenVerifier가 이 idToken을 검증하므로, 반드시 실제
 * Google Cloud Console에서 발급받은 OAuth 2.0 Client ID가 필요합니다.
 *
 * 설정 방법:
 * 1. https://console.cloud.google.com/apis/credentials 에서 OAuth 2.0 클라이언트 ID 생성
 *    (애플리케이션 유형: 웹 애플리케이션, 승인된 자바스크립트 원본에 배포 도메인 추가)
 * 2. .env에 VITE_GOOGLE_CLIENT_ID=발급받은_클라이언트_ID 추가
 * 3. index.html <head>에 아래 스크립트 태그 추가:
 *    <script src="https://accounts.google.com/gsi/client" async defer></script>
 */

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          prompt: () => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

/**
 * Google 로그인 팝업을 띄우고 idToken(=credential)을 반환합니다.
 * 버튼 클릭 등 사용자 제스처 안에서 호출하세요.
 */
export function getGoogleIdToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!CLIENT_ID) {
      reject(new Error("VITE_GOOGLE_CLIENT_ID가 설정되지 않았습니다. .env를 확인해주세요."));
      return;
    }
    if (!window.google) {
      reject(new Error("Google 로그인 스크립트가 로드되지 않았습니다. index.html을 확인해주세요."));
      return;
    }

    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: (response) => resolve(response.credential),
    });
    window.google.accounts.id.prompt();
  });
}

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

/** index.html의 GIS 스크립트가 async라, 페이지가 뜬 직후 누르면 아직 로드 중일 수 있다 */
const SCRIPT_WAIT_MS = 2000;
const POLL_INTERVAL_MS = 100;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** window.google이 생길 때까지 짧게 기다린다. 시간 안에 안 생기면 undefined를 돌려준다. */
async function waitForGoogleScript() {
  const deadline = Date.now() + SCRIPT_WAIT_MS;
  while (!window.google && Date.now() < deadline) {
    await sleep(POLL_INTERVAL_MS);
  }
  return window.google;
}

/**
 * Google 로그인 팝업을 띄우고 idToken(=credential)을 반환합니다.
 * 버튼 클릭 등 사용자 제스처 안에서 호출하세요.
 */
export async function getGoogleIdToken(): Promise<string> {
  if (!CLIENT_ID) {
    throw new Error("VITE_GOOGLE_CLIENT_ID가 설정되지 않았습니다. .env를 확인해주세요.");
  }

  const google = await waitForGoogleScript();
  if (!google) {
    throw new Error("Google 로그인 스크립트가 로드되지 않았습니다. index.html을 확인해주세요.");
  }

  return new Promise<string>((resolve) => {
    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: (response) => resolve(response.credential),
    });
    google.accounts.id.prompt();
  });
}

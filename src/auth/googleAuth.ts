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

const SCRIPT_WAIT_MS = 2000;
const POLL_INTERVAL_MS = 100;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForGoogleScript() {
  const deadline = Date.now() + SCRIPT_WAIT_MS;
  while (!window.google && Date.now() < deadline) {
    await sleep(POLL_INTERVAL_MS);
  }
  return window.google;
}

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

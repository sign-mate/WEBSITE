import { getAccessToken } from "./apiClient";
import type { MyPageInfo } from "./types";

/**
 * ⚠️ 백엔드(SERVER) 저장소에 마이페이지 관련 컨트롤러가 아직 없습니다
 * (GET /me, PATCH /me/password 같은 엔드포인트가 존재하지 않음 — auth/sms/subscription
 * 도메인만 구현돼 있고 user 도메인은 엔티티/레포지토리만 있음).
 *
 * 백엔드에 아래 두 엔드포인트가 추가되면 이 파일의 함수 내부만 apiClient의
 * apiPost/apiGet 호출로 교체하면 됩니다. 지금은 로그인 시 저장된 accessToken이
 * 있다는 것만 확인하고, 나머지는 화면 개발용 목업으로 동작합니다.
 */

const FAKE_DELAY = 400;
const wait = (ms = FAKE_DELAY) => new Promise((r) => setTimeout(r, ms));

export async function getMyInfo(): Promise<MyPageInfo> {
  if (!getAccessToken()) throw new Error("로그인이 필요합니다.");
  await wait();
  // TODO: GET /api/v1/users/me (백엔드 미구현)
  return { name: "홍길동", email: "example@signmate.team", phone: "010-1234-5678" };
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  if (!getAccessToken()) throw new Error("로그인이 필요합니다.");
  await wait();
  // TODO: PATCH /api/v1/users/me/password (백엔드 미구현)
  if (currentPassword.length < 4) throw new Error("현재 비밀번호가 일치하지 않습니다.");
  console.log("[mock] 비밀번호 변경 완료", `(새 비밀번호 길이 ${newPassword.length})`);
}

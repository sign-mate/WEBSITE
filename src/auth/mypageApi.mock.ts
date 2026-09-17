import { getAccessToken } from "./apiClient";
import type { MyPageInfo } from "./types";

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

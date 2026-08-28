import { useState } from "react";

/**
 * 백엔드 회원가입 정규식과 같은 규칙:
 * 8자 이상 + 영문자 1개 이상 + 숫자 1개 이상.
 * 프런트에서 미리 걸러도 최종 판정은 서버가 하므로, 규칙이 바뀌면 서버와 함께 고쳐야 한다.
 */
export const PASSWORD_RULE_MESSAGE = "비밀번호는 영문과 숫자를 포함해 8자 이상이어야 합니다.";

export function isValidPassword(password: string) {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

interface Props {
  password: string;
  onPasswordChange: (v: string) => void;
  confirm: string;
  onConfirmChange: (v: string) => void;
  label?: string;
}

export default function PasswordFields({
  password,
  onPasswordChange,
  confirm,
  onConfirmChange,
  label = "비밀번호",
}: Props) {
  // 입력 중에 빨간 글씨가 따라다니지 않도록, 각 칸을 한 번 벗어난 뒤부터 검사 결과를 보여준다
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  const ruleBroken = passwordTouched && password.length > 0 && !isValidPassword(password);
  const mismatch = confirmTouched && confirm.length > 0 && password !== confirm;

  return (
    <>
      <div className="field">
        <label className="field-label">{label}</label>
        <input
          className="field-input"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          onBlur={() => setPasswordTouched(true)}
          placeholder="영문·숫자 포함 8자 이상"
        />
        {ruleBroken && <p className="field-error">{PASSWORD_RULE_MESSAGE}</p>}
      </div>
      <div className="field">
        <label className="field-label">{label} 확인</label>
        <input
          className="field-input"
          type="password"
          value={confirm}
          onChange={(e) => onConfirmChange(e.target.value)}
          onBlur={() => setConfirmTouched(true)}
          placeholder="다시 입력"
        />
        {mismatch && <p className="field-error">비밀번호가 일치하지 않습니다.</p>}
      </div>
    </>
  );
}

/** 부모 폼에서 제출 전 검증용으로 재사용 */
export function passwordsMatch(password: string, confirm: string) {
  return password.length > 0 && password === confirm;
}

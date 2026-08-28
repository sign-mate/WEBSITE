import { useState } from "react";

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
  const [touched, setTouched] = useState(false);
  const mismatch = touched && confirm.length > 0 && password !== confirm;

  return (
    <>
      <div className="field">
        <label className="field-label">{label}</label>
        <input
          className="field-input"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="8자 이상"
        />
      </div>
      <div className="field">
        <label className="field-label">{label} 확인</label>
        <input
          className="field-input"
          type="password"
          value={confirm}
          onChange={(e) => onConfirmChange(e.target.value)}
          onBlur={() => setTouched(true)}
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

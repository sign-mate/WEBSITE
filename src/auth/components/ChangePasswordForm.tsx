import { useState } from "react";
import { changePassword } from "../api";
import PasswordFields, { passwordsMatch } from "./PasswordFields";

interface Props {
  onBack: () => void;
}

export default function ChangePasswordForm({ onBack }: Props) {
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!passwordsMatch(password, confirm)) return;
    setError(null);
    setSubmitting(true);
    try {
      await changePassword(current, password);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "현재 비밀번호가 일치하지 않습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="auth-card">
        <h2 className="auth-title">비밀번호 변경 완료</h2>
        <button type="button" className="btn-outline auth-submit" onClick={onBack}>
          내 정보로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <h2 className="auth-title">비밀번호 변경</h2>

      <div className="field">
        <label className="field-label">현재 비밀번호</label>
        <input className="field-input" type="password" value={current} onChange={(e) => setCurrent(e.target.value)} />
      </div>

      <PasswordFields
        password={password}
        onPasswordChange={setPassword}
        confirm={confirm}
        onConfirmChange={setConfirm}
        label="새 비밀번호"
      />

      {error && <p className="field-error">{error}</p>}

      <button
        type="button"
        className="btn-solid-coral auth-submit"
        disabled={!current || !passwordsMatch(password, confirm) || submitting}
        onClick={handleSubmit}
      >
        {submitting ? "변경 중..." : "비밀번호 변경"}
      </button>

      <button type="button" className="link-btn" style={{ marginTop: 14 }} onClick={onBack}>
        ← 취소
      </button>
    </div>
  );
}
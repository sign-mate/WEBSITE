import { useState } from "react";
import { resetPassword } from "../api";
import { ApiError } from "../apiClient";
import SmsVerification from "./SmsVerification";
import PasswordFields, { passwordsMatch } from "./PasswordFields";

interface Props {
  onBack: () => void;
  onDone: () => void;
}

export default function ResetPasswordForm({ onBack, onDone }: Props) {
  const [step, setStep] = useState<1 | 2>(1);

  // 1단계: 본인 인증
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [verified, setVerified] = useState(false);

  // 2단계: 새 비밀번호
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!passwordsMatch(password, confirm)) return;
    setError(null);
    setSubmitting(true);
    try {
      await resetPassword(email, name, phone, password);
      setDone(true);
    } catch (e) {
      // USER-009(GOOGLE_ACCOUNT_NO_PASSWORD) 포함 — 백엔드 메시지 그대로 노출
      setError(e instanceof ApiError ? e.message : "비밀번호 재설정에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="auth-card">
        <h2 className="auth-title">비밀번호 재설정 완료</h2>
        <p className="result-box">새 비밀번호로 로그인해주세요.</p>
        <button type="button" className="btn-solid-coral auth-submit" onClick={onDone}>
          로그인하러 가기
        </button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="auth-card">
        <h2 className="auth-title">새 비밀번호 설정</h2>
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
          disabled={!passwordsMatch(password, confirm) || submitting}
          onClick={handleSubmit}
        >
          {submitting ? "변경 중..." : "비밀번호 재설정"}
        </button>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <h2 className="auth-title">비밀번호 찾기</h2>

      <div className="field">
        <label className="field-label">이름</label>
        <input className="field-input" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="field">
        <label className="field-label">아이디(이메일)</label>
        <input className="field-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <SmsVerification
        phone={phone}
        onPhoneChange={setPhone}
        verified={verified}
        onVerified={() => setVerified(true)}
      />

      <button
        type="button"
        className="btn-solid-coral auth-submit"
        disabled={!verified || !name || !email}
        onClick={() => setStep(2)}
      >
        다음
      </button>

      <button type="button" className="link-btn" style={{ marginTop: 14 }} onClick={onBack}>
        ← 로그인으로 돌아가기
      </button>
    </div>
  );
}

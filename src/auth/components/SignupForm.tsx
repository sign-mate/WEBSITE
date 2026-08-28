import { useState } from "react";
import type { Provider } from "../types";
import { googleSignup, signup } from "../api";
import { ApiError, setTokens } from "../apiClient";
import SmsVerification from "./SmsVerification";
import PasswordFields, { isValidPassword, passwordsMatch } from "./PasswordFields";
import DuplicateAccountModal from "./DuplicateAccountModal";

interface Prefill {
  email?: string;
  name?: string;
  /** provider === "GOOGLE"일 때 필수: 로그인 단계에서 받은 idToken을 그대로 다시 제출해야 함 */
  idToken?: string;
}

interface Props {
  provider: Provider;
  prefill?: Prefill;
  onDone: () => void;
  onGoToLogin: () => void;
}

export default function SignupForm({ provider, prefill, onDone, onGoToLogin }: Props) {
  const isGoogle = provider === "GOOGLE";

  const [name, setName] = useState(prefill?.name ?? "");
  const [email, setEmail] = useState(prefill?.email ?? "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [phone, setPhone] = useState("");
  const [verified, setVerified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duplicate, setDuplicate] = useState<{ message: string } | null>(null);

  // 구글 가입은 비밀번호가 필요 없으므로(서버가 받지도 않음) 비밀번호 검증에서 제외
  const canSubmit =
    name.trim().length > 0 &&
    (isGoogle || (email.trim().length > 0 && isValidPassword(password) && passwordsMatch(password, confirm))) &&
    verified;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      if (isGoogle) {
        if (!prefill?.idToken) {
          setError("구글 인증 정보가 없습니다. 로그인 화면에서 다시 시도해주세요.");
          return;
        }
        const { accessToken, refreshToken } = await googleSignup({
          idToken: prefill.idToken,
          name,
          phone,
        });
        setTokens(accessToken, refreshToken);
      } else {
        const { accessToken, refreshToken } = await signup({ email, password, name, phone });
        setTokens(accessToken, refreshToken);
      }
      onDone();
    } catch (e) {
      if (e instanceof ApiError && (e.code === "USER-006" || e.code === "USER-007")) {
        // 이름+전화번호 기준 다른 방식으로 이미 가입된 계정 존재
        setDuplicate({ message: e.message });
        return;
      }
      setError(e instanceof ApiError ? e.message : "회원가입에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">{isGoogle ? "간편 회원가입" : "회원가입"}</h2>

      <div className="field">
        <label className="field-label">이름</label>
        <input
          className="field-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isGoogle && !!prefill?.name}
        />
      </div>

      {!isGoogle && (
        <>
          <div className="field">
            <label className="field-label">이메일</label>
            <input className="field-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <PasswordFields
            password={password}
            onPasswordChange={setPassword}
            confirm={confirm}
            onConfirmChange={setConfirm}
          />
        </>
      )}

      {isGoogle && email && (
        <div className="field">
          <label className="field-label">이메일</label>
          <input className="field-input" value={email} disabled />
        </div>
      )}

      <SmsVerification
        phone={phone}
        onPhoneChange={setPhone}
        verified={verified}
        onVerified={() => setVerified(true)}
      />

      {error && <p className="field-error">{error}</p>}

      <button type="button" className="btn-solid-coral auth-submit" disabled={!canSubmit || submitting} onClick={handleSubmit}>
        {submitting ? "가입 중..." : "가입 완료"}
      </button>

      <button type="button" className="link-btn" style={{ marginTop: 14 }} onClick={onGoToLogin}>
        ← 로그인으로 돌아가기
      </button>

      {duplicate && (
        <DuplicateAccountModal
          message={duplicate.message}
          suggestion="로그인 화면에서 이용해주세요."
          onClose={() => setDuplicate(null)}
          onGoToLogin={onGoToLogin}
        />
      )}
    </div>
  );
}

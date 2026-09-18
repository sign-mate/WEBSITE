import { useState } from "react";
import type { Provider } from "../types";
import { googleSignup, kakaoSignup, signup } from "../api";
import { ApiError, setTokens } from "../apiClient";
import SmsVerification from "./SmsVerification";
import PasswordFields, { isValidPassword, passwordsMatch } from "./PasswordFields";
import DuplicateAccountModal from "./DuplicateAccountModal";

interface Prefill {
  email?: string;
  name?: string;
  idToken?: string;
  accessToken?: string;
}

interface Props {
  provider: Provider;
  prefill?: Prefill;
  onDone: () => void;
  onGoToLogin: () => void;
}

export default function SignupForm({ provider, prefill, onDone, onGoToLogin }: Props) {
  const isGoogle = provider === "GOOGLE";
  const isKakao = provider === "KAKAO";
  const isSocial = isGoogle || isKakao;

  const [name, setName] = useState(prefill?.name ?? "");
  const [email, setEmail] = useState(prefill?.email ?? "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [phone, setPhone] = useState("");
  const [verified, setVerified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duplicate, setDuplicate] = useState<{ message: string } | null>(null);

  const canSubmit =
    name.trim().length > 0 &&
    (isSocial || (email.trim().length > 0 && isValidPassword(password) && passwordsMatch(password, confirm))) &&
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
      } else if (isKakao) {
        if (!prefill?.accessToken) {
          setError("카카오 인증 정보가 없습니다. 로그인 화면에서 다시 시도해주세요.");
          return;
        }
        const { accessToken, refreshToken } = await kakaoSignup({
          accessToken: prefill.accessToken,
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
      if (e instanceof ApiError && (e.code === "USER-006" || e.code === "USER-007" || e.code === "USER-012")) {
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
      <h2 className="auth-title">{isSocial ? "간편 회원가입" : "회원가입"}</h2>

      <div className="field">
        <label className="field-label">이름</label>
        <input
          className="field-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSocial && !!prefill?.name}
        />
      </div>

      {!isSocial && (
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

      {isSocial && email && (
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

import { useState } from "react";
import { findEmail } from "../api";
import { ApiError } from "../apiClient";
import SmsVerification from "./SmsVerification";

interface Props {
  onBack: () => void;
}

const PROVIDER_LABEL = { LOCAL: "일반", GOOGLE: "구글" } as const;

export default function FindIdForm({ onBack }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [verified, setVerified] = useState(false);
  const [result, setResult] = useState<{ email: string; provider: "LOCAL" | "GOOGLE" } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!verified || !name) return;
    setError(null);
    setLoading(true);
    try {
      const res = await findEmail(name, phone);
      setResult(res);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "아이디를 찾을 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="auth-card">
        <h2 className="auth-title">아이디 찾기</h2>
        <p className="result-box">
          회원님의 아이디는 <b>{result.email}</b> 입니다.
          <br />
          ({PROVIDER_LABEL[result.provider]} 계정)
        </p>
        <button type="button" className="btn-outline auth-submit" onClick={onBack}>
          로그인으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <h2 className="auth-title">아이디 찾기</h2>

      <div className="field">
        <label className="field-label">이름</label>
        <input className="field-input" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <SmsVerification
        phone={phone}
        onPhoneChange={setPhone}
        verified={verified}
        onVerified={() => setVerified(true)}
      />

      {error && <p className="field-error">{error}</p>}

      <button
        type="button"
        className="btn-solid-coral auth-submit"
        disabled={!verified || !name || loading}
        onClick={handleSubmit}
      >
        {loading ? "확인 중..." : "아이디 확인"}
      </button>

      <button type="button" className="link-btn" style={{ marginTop: 14 }} onClick={onBack}>
        ← 로그인으로 돌아가기
      </button>
    </div>
  );
}

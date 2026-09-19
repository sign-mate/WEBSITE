import { useState } from "react";
import { login } from "../api";
import { ApiError, setTokens } from "../apiClient";
import SocialButtons from "./SocialButtons";
import type { Provider } from "../types";

interface Props {
  onLoginSuccess: () => void;
  onNeedSignup: (
    provider: Provider,
    prefill?: { email?: string; name?: string; idToken?: string }
  ) => void;
  onGoFindId: () => void;
  onGoResetPassword: () => void;
}

export default function LoginForm({ onLoginSuccess, onNeedSignup, onGoFindId, onGoResetPassword }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const { accessToken, refreshToken } = await login(email, password);
      setTokens(accessToken, refreshToken);
      onLoginSuccess();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">로그인</h2>

      <div className="field">
        <label className="field-label">이메일</label>
        <input className="field-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="field">
        <label className="field-label">비밀번호</label>
        <input className="field-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>

      {error && <p className="field-error">{error}</p>}

      <button type="button" className="btn-solid-coral auth-submit" disabled={loading} onClick={handleSubmit}>
        {loading ? "로그인 중..." : "로그인"}
      </button>

      <div className="auth-links">
        <button type="button" className="link-btn" onClick={onGoFindId}>아이디 찾기</button>
        <span className="dot">·</span>
        <button type="button" className="link-btn" onClick={onGoResetPassword}>비밀번호 찾기</button>
        <span className="dot">·</span>
        <button type="button" className="link-btn" onClick={() => onNeedSignup("LOCAL")}>회원가입</button>
      </div>

      <div className="divider"><span>또는</span></div>

      <SocialButtons
        onError={setError}
        onResult={(provider, res) => {
          if (res.registered && res.accessToken && res.refreshToken) {
            setTokens(res.accessToken, res.refreshToken);
            onLoginSuccess();
            return;
          }
          if (provider === "GOOGLE") {
            onNeedSignup("GOOGLE", { email: res.email, name: res.name, idToken: res.idToken });
          } else {
            onNeedSignup("KAKAO", { email: res.email, name: res.name });
          }
        }}
      />
    </div>
  );
}
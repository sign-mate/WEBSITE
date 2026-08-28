import { useState } from "react";
import { sendSmsCode, verifySmsCode } from "../api";
import { ApiError } from "../apiClient";
import { useCountdown } from "../hooks/useCountdown";

const CODE_TTL_MS = 3 * 60 * 1000; // 3분
const RESEND_COOLDOWN_MS = 30 * 1000; // 30초
const MAX_RESEND = 5;

interface Props {
  phone: string;
  onPhoneChange: (value: string) => void;
  /** 인증 성공 시 호출. 백엔드가 phone 기준으로 서버에서 10분간 인증 상태를 들고 있으므로 토큰은 필요 없음. */
  onVerified: () => void;
  verified: boolean;
  disabled?: boolean;
}

export default function SmsVerification({
  phone,
  onPhoneChange,
  onVerified,
  verified,
  disabled,
}: Props) {
  const [sentAt, setSentAt] = useState<number | null>(null);
  const [resendCount, setResendCount] = useState(0);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const expiresIn = useCountdown(sentAt ? sentAt + CODE_TTL_MS : null);
  const cooldownIn = useCountdown(sentAt ? sentAt + RESEND_COOLDOWN_MS : null);

  const expired = sentAt !== null && expiresIn === 0;
  const cooldownActive = sentAt !== null && cooldownIn > 0;

  const handleSend = async () => {
    if (!phone) {
      setError("전화번호를 입력해주세요.");
      return;
    }
    if (resendCount >= MAX_RESEND) {
      setError("인증코드 발송 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    // 쿨다운 중에는 버튼을 눌러도 발송하지 않는다. 버튼을 disabled로 잠가 두면
    // 왜 안 되는지 알기 어려워서, 누를 수는 있게 두고 남은 시간을 알려준다.
    if (cooldownActive) {
      setError(`${cooldownIn}초 후에 다시 시도해주세요.`);
      return;
    }
    setError(null);
    setSending(true);
    try {
      await sendSmsCode(phone);
      setSentAt(Date.now());
      setResendCount((c) => c + 1);
      setCode("");
    } catch (e) {
      // SMS-003 TOO_MANY_SEND_REQUESTS / SMS-004 DAILY_SEND_LIMIT_EXCEEDED / SMS-002 SMS_SEND_FAILED
      setError(e instanceof ApiError ? e.message : "인증코드 발송에 실패했습니다.");
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async () => {
    if (expired) {
      setError("인증 시간이 만료됐어요. 코드를 다시 받아주세요.");
      return;
    }
    setError(null);
    setVerifying(true);
    try {
      await verifySmsCode(phone, code);
      onVerified();
    } catch (e) {
      // SMS-001 INVALID_VERIFICATION_CODE
      setError(e instanceof ApiError ? e.message : "인증에 실패했습니다.");
    } finally {
      setVerifying(false);
    }
  };

  const mm = String(Math.floor(expiresIn / 60)).padStart(2, "0");
  const ss = String(expiresIn % 60).padStart(2, "0");

  return (
    <div className="sms-field">
      <label className="field-label">전화번호</label>
      <div className="sms-row">
        <input
          className="field-input"
          type="tel"
          placeholder="01000000000"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value.replace(/\D/g, ""))}
          disabled={disabled || verified}
        />
        <button
          type="button"
          className="btn-outline sms-send-btn"
          onClick={handleSend}
          disabled={disabled || verified || sending}
        >
          {sentAt === null ? "인증코드 발송" : "재발송"}
          {sentAt !== null && cooldownIn > 0 ? ` (${cooldownIn}s)` : ""}
        </button>
      </div>

      {sentAt !== null && !verified && (
        <div className="sms-row" style={{ marginTop: 10 }}>
          <input
            className="field-input"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="인증코드 6자리"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            disabled={disabled || expired}
          />
          <span className="sms-timer">{expired ? "만료됨" : `${mm}:${ss}`}</span>
          <button
            type="button"
            className="btn-solid-coral sms-verify-btn"
            onClick={handleVerify}
            disabled={disabled || verifying || code.length !== 6 || expired}
          >
            확인
          </button>
        </div>
      )}

      {verified && <p className="sms-verified">✓ 인증 완료</p>}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

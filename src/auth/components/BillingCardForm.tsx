import { useState } from "react";
import { ApiError } from "../apiClient";
import type { BillingCardPayload } from "../types";

interface Props {
  submitLabel: string;
  submittingLabel: string;
  onSubmit: (payload: BillingCardPayload) => Promise<void>;
  onCancel?: () => void;
  onError?: (error: ApiError) => boolean;
}

const CARD_NO_RE = /^\d{15,16}$/;
const EXP_YEAR_RE = /^\d{2}$/;
const EXP_MONTH_RE = /^(0[1-9]|1[0-2])$/;
const ID_NO_RE = /^(\d{6}|\d{10})$/;
const CARD_PW_RE = /^\d{2}$/;

const PAY_ERROR_MESSAGES: Record<string, string> = {
  "PAY-002": "카드 등록에 실패했습니다. 카드 정보를 확인해주세요.",
  "PAY-003": "결제가 거절되었습니다. 카드 상태를 확인해주세요.",
  "PAY-004": "결제 결과를 확인할 수 없습니다. 잠시 후 다시 시도해주세요.",
};

const onlyDigits = (value: string) => value.replace(/\D/g, "");

export default function BillingCardForm({
  submitLabel,
  submittingLabel,
  onSubmit,
  onCancel,
  onError,
}: Props) {
  const [cardNo, setCardNo] = useState("");
  const [expYear, setExpYear] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [idNo, setIdNo] = useState("");
  const [cardPw, setCardPw] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardNoValid = CARD_NO_RE.test(cardNo);
  const expYearValid = EXP_YEAR_RE.test(expYear);
  const expMonthValid = EXP_MONTH_RE.test(expMonth);
  const idNoValid = ID_NO_RE.test(idNo);
  const cardPwValid = CARD_PW_RE.test(cardPw);

  const canSubmit = cardNoValid && expYearValid && expMonthValid && idNoValid && cardPwValid;

  const markTouched = (field: string) => setTouched((t) => ({ ...t, [field]: true }));

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({ cardNo, expYear, expMonth, idNo, cardPw });
    } catch (e) {
      if (e instanceof ApiError) {
        if (onError?.(e)) return;
        setError(PAY_ERROR_MESSAGES[e.code] ?? e.message);
        return;
      }
      setError(e instanceof Error ? e.message : "카드 등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="field">
        <label className="field-label">카드번호</label>
        <input
          className="field-input"
          inputMode="numeric"
          autoComplete="off"
          maxLength={16}
          value={cardNo}
          onChange={(e) => setCardNo(onlyDigits(e.target.value))}
          onBlur={() => markTouched("cardNo")}
          placeholder="숫자 15~16자리"
        />
        {touched.cardNo && !cardNoValid && (
          <p className="field-error">카드번호는 숫자 15~16자리입니다.</p>
        )}
      </div>

      <div className="field" style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label className="field-label">유효기간(년, YY)</label>
          <input
            className="field-input"
            inputMode="numeric"
            autoComplete="off"
            maxLength={2}
            value={expYear}
            onChange={(e) => setExpYear(onlyDigits(e.target.value))}
            onBlur={() => markTouched("expYear")}
            placeholder="YY"
          />
          {touched.expYear && !expYearValid && (
            <p className="field-error">유효기간(년)은 YY 형식입니다.</p>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <label className="field-label">유효기간(월, MM)</label>
          <input
            className="field-input"
            inputMode="numeric"
            autoComplete="off"
            maxLength={2}
            value={expMonth}
            onChange={(e) => setExpMonth(onlyDigits(e.target.value))}
            onBlur={() => markTouched("expMonth")}
            placeholder="MM"
          />
          {touched.expMonth && !expMonthValid && (
            <p className="field-error">유효기간(월)은 MM 형식입니다.</p>
          )}
        </div>
      </div>

      <div className="field">
        <label className="field-label">생년월일(6자리) 또는 사업자번호(10자리)</label>
        <input
          className="field-input"
          inputMode="numeric"
          autoComplete="off"
          maxLength={10}
          value={idNo}
          onChange={(e) => setIdNo(onlyDigits(e.target.value))}
          onBlur={() => markTouched("idNo")}
          placeholder="YYMMDD 또는 사업자번호 10자리"
        />
        {touched.idNo && !idNoValid && (
          <p className="field-error">생년월일 6자리 또는 사업자번호 10자리를 입력해주세요.</p>
        )}
      </div>

      <div className="field">
        <label className="field-label">카드 비밀번호 앞 2자리</label>
        <input
          className="field-input"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          maxLength={2}
          value={cardPw}
          onChange={(e) => setCardPw(onlyDigits(e.target.value))}
          onBlur={() => markTouched("cardPw")}
          placeholder="●●"
        />
        {touched.cardPw && !cardPwValid && (
          <p className="field-error">카드 비밀번호 앞 2자리를 입력해주세요.</p>
        )}
      </div>

      {error && <p className="field-error">{error}</p>}

      <button
        type="button"
        className="btn-solid-coral auth-submit"
        disabled={!canSubmit || submitting}
        onClick={handleSubmit}
      >
        {submitting ? submittingLabel : submitLabel}
      </button>

      {onCancel && (
        <button type="button" className="link-btn" style={{ marginTop: 14 }} onClick={onCancel}>
          ← 취소
        </button>
      )}
    </>
  );
}

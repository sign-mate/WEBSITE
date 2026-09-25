import { useState } from "react";
import { subscribeBilling } from "../api";
import type { ApiError } from "../apiClient";
import BillingCardForm from "./BillingCardForm";

interface Props {
  onDone: () => void;
  onBack: () => void;
}

export default function SubscribeForm({ onDone, onBack }: Props) {
  const [result, setResult] = useState<{ amount: number; nextBillingAt: string } | null>(null);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);

  if (alreadySubscribed) {
    return (
      <div className="auth-card">
        <h2 className="auth-title">이미 구독 중입니다</h2>
        <p>이미 이용 중인 Pro 구독이 있습니다.</p>
        <button type="button" className="btn-outline auth-submit" onClick={onDone}>
          내 구독으로 이동
        </button>
      </div>
    );
  }

  if (result) {
    return (
      <div className="auth-card">
        <h2 className="auth-title">결제가 완료되었습니다</h2>
        <dl className="info-list">
          <div className="info-row">
            <dt>결제 금액</dt>
            <dd>{result.amount.toLocaleString()}원</dd>
          </div>
          <div className="info-row">
            <dt>다음 결제일</dt>
            <dd>{result.nextBillingAt.slice(0, 10)}</dd>
          </div>
        </dl>
        <button type="button" className="btn-solid-coral auth-submit" onClick={onDone}>
          내 구독으로 이동
        </button>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <h2 className="auth-title">Pro 구독 신청</h2>
      <p style={{ marginBottom: 16 }}>월 4,900원, 카드 등록과 동시에 첫 결제가 진행됩니다.</p>
      <BillingCardForm
        submitLabel="결제하고 구독하기"
        submittingLabel="결제 중..."
        onCancel={onBack}
        onError={(e: ApiError) => {
          if (e.code === "PAY-001") {
            setAlreadySubscribed(true);
            return true;
          }
          return false;
        }}
        onSubmit={async (payload) => {
          const res = await subscribeBilling(payload);
          setResult({ amount: res.amount, nextBillingAt: res.nextBillingAt });
        }}
      />
      <p className="modal-sub" style={{ marginTop: 12 }}>
        결제에 실패하면 카드 정보를 다시 확인한 뒤 재시도하거나 다른 카드로 변경해주세요.
      </p>
    </div>
  );
}

import { useState } from "react";
import { changePaymentMethod } from "../api";
import BillingCardForm from "./BillingCardForm";

interface Props {
  onDone: () => void;
  onBack: () => void;
}

export default function ChangePaymentMethodForm({ onDone, onBack }: Props) {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="auth-card">
        <h2 className="auth-title">결제 수단 변경 완료</h2>
        <button type="button" className="btn-outline auth-submit" onClick={onDone}>
          내 구독으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <h2 className="auth-title">결제 수단 변경</h2>
      <BillingCardForm
        submitLabel="변경하기"
        submittingLabel="변경 중..."
        onCancel={onBack}
        onSubmit={async (payload) => {
          await changePaymentMethod(payload);
          setDone(true);
        }}
      />
    </div>
  );
}

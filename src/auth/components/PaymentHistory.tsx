import { useEffect, useState } from "react";
import { getPaymentHistory } from "../api";
import type { PaymentHistoryItem } from "../types";

interface Props {
  onBack: () => void;
}

const STATUS_LABEL: Record<string, string> = {
  REQUESTED: "요청됨",
  PAID: "성공",
  FAILED: "실패",
  CANCELED: "취소됨",
};

function formatDateTime(iso: string): string {
  return iso.slice(0, 19).replace("T", " ");
}

export default function PaymentHistory({ onBack }: Props) {
  const [items, setItems] = useState<PaymentHistoryItem[] | null>(null);

  useEffect(() => {
    getPaymentHistory().then(setItems);
  }, []);

  return (
    <div className="auth-card">
      <h2 className="auth-title">결제 내역</h2>

      {!items && <p>불러오는 중...</p>}

      {items && items.length === 0 && <p>결제 내역이 없습니다.</p>}

      {items && items.length > 0 && (
        <div className="payment-table-wrap">
          <table className="payment-table">
            <thead>
              <tr>
                <th>주문번호</th>
                <th>금액</th>
                <th>상태</th>
                <th>결제일시</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.orderId}>
                  <td>{item.orderId}</td>
                  <td>{item.amount.toLocaleString()}원</td>
                  <td>{STATUS_LABEL[item.status] ?? item.status}</td>
                  <td>{formatDateTime(item.paidAt ?? item.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button type="button" className="link-btn" style={{ marginTop: 14 }} onClick={onBack}>
        ← 내 구독으로 돌아가기
      </button>
    </div>
  );
}

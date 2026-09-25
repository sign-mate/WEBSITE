interface Props {
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CancelSubscriptionModal({ loading, onClose, onConfirm }: Props) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <p className="modal-message">구독을 취소하시겠어요?</p>
        <p className="modal-sub">
          지금 취소하셔도 이번 결제 주기(다음 결제일까지)는 Pro를 계속 이용하실 수 있어요. 다음
          결제일부터 Free로 전환됩니다.
        </p>
        <div className="modal-actions">
          <button type="button" className="btn-outline" onClick={onClose} disabled={loading}>
            닫기
          </button>
          <button type="button" className="btn-solid-coral" onClick={onConfirm} disabled={loading}>
            {loading ? "취소 중..." : "구독 취소"}
          </button>
        </div>
      </div>
    </div>
  );
}

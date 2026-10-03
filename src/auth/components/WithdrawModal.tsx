import { useState } from "react";

interface Props {
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function WithdrawModal({ loading, error, onClose, onConfirm }: Props) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card modal-card-withdraw">
        <p className="modal-message">회원 탈퇴 전에 확인해 주세요</p>
        <ul className="modal-notice-list">
          <li>탈퇴하면 기존 계정의 정보를 더 이상 이용할 수 없어요.</li>
          <li>Pro 구독 중이라면 구독이 즉시 종료되고, 남은 이용 기간은 사용할 수 없어요.</li>
          <li>
            결제 후 7일 이내라면 탈퇴 전에 고객센터로 청약철회를 요청해 주세요. 7일이 지났다면
            남은 기간은 환불되지 않으니, 남은 기간을 이용하고 싶다면 구독 관리에서 구독을 먼저
            취소하고 기간이 끝난 뒤에 탈퇴해 주세요.
          </li>
          <li>법령에 따라 보관이 필요한 결제 기록은 정해진 기간 동안 보관한 뒤 파기돼요.</li>
        </ul>

        <label className="modal-checkbox-row">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            disabled={loading}
          />
          위 내용을 확인했습니다
        </label>

        {error && <p className="field-error">{error}</p>}

        <div className="modal-actions">
          <button type="button" className="btn-outline" onClick={onClose} disabled={loading}>
            닫기
          </button>
          <button
            type="button"
            className="btn-solid-coral"
            onClick={onConfirm}
            disabled={loading || !confirmed}
          >
            {loading ? "탈퇴 중..." : "회원 탈퇴"}
          </button>
        </div>
      </div>
    </div>
  );
}

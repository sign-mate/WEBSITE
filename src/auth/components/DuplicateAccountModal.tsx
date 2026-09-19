interface Props {
  message: string;
  suggestion: string;
  onClose: () => void;
  onGoToLogin: () => void;
}

export default function DuplicateAccountModal({ message, suggestion, onClose, onGoToLogin }: Props) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <p className="modal-message">{message}</p>
        <p className="modal-sub">{suggestion}</p>
        <div className="modal-actions">
          <button type="button" className="btn-outline" onClick={onClose}>
            닫기
          </button>
          <button type="button" className="btn-solid-coral" onClick={onGoToLogin}>
            로그인하러 가기
          </button>
        </div>
      </div>
    </div>
  );
}
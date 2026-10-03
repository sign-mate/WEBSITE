import { useEffect, useState } from "react";
import { getMyInfo, withdrawAccount } from "../api";
import { ApiError } from "../apiClient";
import type { MyPageInfo as MyPageInfoT } from "../types";
import WithdrawModal from "./WithdrawModal";

interface Props {
  onGoChangePassword: () => void;
  onGoSubscription: () => void;
  onWithdrawSuccess: (notice: string) => void;
}

export default function MyPageInfo({ onGoChangePassword, onGoSubscription, onWithdrawSuccess }: Props) {
  const [info, setInfo] = useState<MyPageInfoT | null>(null);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  useEffect(() => {
    getMyInfo().then(setInfo);
  }, []);

  if (!info) return <div className="auth-card">불러오는 중...</div>;

  const handleWithdraw = async () => {
    setWithdrawLoading(true);
    setWithdrawError(null);
    try {
      await withdrawAccount();
      onWithdrawSuccess("탈퇴가 완료되었어요");
    } catch (e) {
      if (e instanceof ApiError && e.code === "USER-003") {
        onWithdrawSuccess("이미 탈퇴한 계정이에요");
        return;
      }
      setWithdrawError(
        e instanceof ApiError || e instanceof Error ? e.message : "탈퇴 처리에 실패했습니다."
      );
    } finally {
      setWithdrawLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">내 정보</h2>

      <dl className="info-list">
        <div className="info-row">
          <dt>이름</dt>
          <dd>{info.name}</dd>
        </div>
        <div className="info-row">
          <dt>이메일(아이디)</dt>
          <dd>{info.email}</dd>
        </div>
        <div className="info-row">
          <dt>전화번호</dt>
          <dd>{info.phone}</dd>
        </div>
      </dl>

      <button type="button" className="btn-outline auth-submit" onClick={onGoChangePassword}>
        비밀번호 변경
      </button>

      <button
        type="button"
        className="btn-outline auth-submit"
        style={{ marginTop: 10 }}
        onClick={onGoSubscription}
      >
        구독 관리
      </button>

      <button
        type="button"
        className="link-btn-subtle"
        style={{ marginTop: 18, display: "block", marginLeft: "auto", marginRight: "auto" }}
        onClick={() => setShowWithdraw(true)}
      >
        회원 탈퇴
      </button>

      {showWithdraw && (
        <WithdrawModal
          loading={withdrawLoading}
          error={withdrawError}
          onClose={() => setShowWithdraw(false)}
          onConfirm={handleWithdraw}
        />
      )}
    </div>
  );
}
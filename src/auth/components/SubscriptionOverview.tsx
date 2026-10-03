import { useEffect, useState } from "react";
import { cancelSubscription, getMySubscription, revokeCancellation } from "../api";
import type { SubscriptionInfo } from "../types";
import CancelSubscriptionModal from "./CancelSubscriptionModal";

interface Props {
  onBack: () => void;
  onGoSubscribe: () => void;
  onGoChangePayment: () => void;
  onGoPaymentHistory: () => void;
}

function formatDate(iso: string | null): string {
  if (!iso) return "-";
  return iso.slice(0, 10);
}

export default function SubscriptionOverview({
  onBack,
  onGoSubscribe,
  onGoChangePayment,
  onGoPaymentHistory,
}: Props) {
  const [info, setInfo] = useState<SubscriptionInfo | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    getMySubscription().then(setInfo);
  };

  useEffect(() => {
    load();
  }, []);

  if (!info) return <div className="auth-card">불러오는 중...</div>;

  const handleCancel = async () => {
    setActionLoading(true);
    setError(null);
    try {
      await cancelSubscription();
      setShowCancelConfirm(false);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "구독 취소에 실패했습니다.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevoke = async () => {
    setActionLoading(true);
    setError(null);
    try {
      await revokeCancellation();
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "해지 철회에 실패했습니다.");
    } finally {
      setActionLoading(false);
    }
  };

  const isPro = info.plan === "PRO";
  const isActiveNotCanceled = isPro && info.status === "ACTIVE" && !info.canceled;
  const isCanceled = isPro && info.canceled;
  const isPending = isPro && !isActiveNotCanceled && !isCanceled;
  const isGooglePlay = info.source === "GOOGLE_PLAY";

  const googlePlayGuidance = (
    <p className="modal-sub">
      앱에서 Google Play로 결제한 구독이에요. 해지와 결제 수단 변경은 Google Play 구독 메뉴에서 할 수
      있어요.{" "}
      <a href="https://play.google.com/store/account/subscriptions" target="_blank" rel="noopener noreferrer">
        Google Play 구독 관리
      </a>
    </p>
  );

  return (
    <div className="auth-card">
      <h2 className="auth-title">내 구독</h2>

      {info.paymentFailed && (
        <p className="field-error" style={{ marginBottom: 16 }}>
          {isGooglePlay ? "결제에 실패했습니다." : "결제에 실패했습니다. 결제 수단을 확인하고 변경해주세요."}
        </p>
      )}

      {!isPro && (
        <>
          <dl className="info-list">
            <div className="info-row">
              <dt>플랜</dt>
              <dd>무료 플랜</dd>
            </div>
            {info.usage && (
              <div className="info-row">
                <dt>오늘 사용량</dt>
                <dd>
                  {info.usage.used}/{info.usage.limit}회
                </dd>
              </div>
            )}
          </dl>
          <button type="button" className="btn-solid-coral auth-submit" onClick={onGoSubscribe}>
            Pro 구독하기
          </button>
        </>
      )}

      {isActiveNotCanceled && (
        <>
          <dl className="info-list">
            <div className="info-row">
              <dt>플랜</dt>
              <dd>Pro</dd>
            </div>
            <div className="info-row">
              <dt>다음 결제일</dt>
              <dd>{formatDate(info.nextBillingAt)}</dd>
            </div>
            {!isGooglePlay && (
              <div className="info-row">
                <dt>결제 카드</dt>
                <dd>{info.cardName ?? "-"}</dd>
              </div>
            )}
          </dl>
          {isGooglePlay ? (
            googlePlayGuidance
          ) : (
            <>
              <button type="button" className="btn-outline auth-submit" onClick={onGoChangePayment}>
                결제 수단 변경
              </button>
              <button
                type="button"
                className="link-btn"
                style={{ marginTop: 14 }}
                onClick={() => setShowCancelConfirm(true)}
              >
                구독 취소
              </button>
            </>
          )}
        </>
      )}

      {isCanceled && (
        <>
          <dl className="info-list">
            <div className="info-row">
              <dt>플랜</dt>
              <dd>Pro (해지 예약)</dd>
            </div>
            <div className="info-row">
              <dt>이용 가능 기간</dt>
              <dd>{formatDate(info.expiresAt)}까지</dd>
            </div>
          </dl>
          <p className="modal-sub">다음 결제일부터 Free로 전환될 예정입니다.</p>
          {isGooglePlay ? (
            googlePlayGuidance
          ) : (
            <button
              type="button"
              className="btn-solid-coral auth-submit"
              disabled={actionLoading}
              onClick={handleRevoke}
            >
              {actionLoading ? "처리 중..." : "해지 철회"}
            </button>
          )}
        </>
      )}

      {isPending && <p>구독 상태를 확인하고 있습니다. 잠시 후 다시 확인해주세요.</p>}

      {error && <p className="field-error">{error}</p>}

      <button type="button" className="link-btn" style={{ marginTop: 14 }} onClick={onGoPaymentHistory}>
        결제 내역 보기
      </button>
      <br />
      <button type="button" className="link-btn" style={{ marginTop: 14 }} onClick={onBack}>
        ← 내 정보로 돌아가기
      </button>

      {showCancelConfirm && (
        <CancelSubscriptionModal
          loading={actionLoading}
          onClose={() => setShowCancelConfirm(false)}
          onConfirm={handleCancel}
        />
      )}
    </div>
  );
}

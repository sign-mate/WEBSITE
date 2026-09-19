import { useReveal } from "../hooks/useReveal";

const PLAN_FEATURES = [
  "웹페이지 텍스트 → 한국수어 실시간 변환",
  "3D 아바타 기반 수어 표현",
  "무제한 변환 이용",
  "모든 웹사이트에서 사용 가능",
];

function handleSubscribe() {
  window.alert("결제 기능은 현재 준비 중입니다. 빠른 시일 내에 만나보실 수 있도록 준비하고 있어요!");
}

export default function PricingPage() {
  const head = useReveal<HTMLDivElement>();

  return (
    <section className="wrap" id="pricing">
      <div className="mesh mesh-features" />
      <div className={`section-head ${head.className}`} ref={head.ref}>
        <h2>요금제</h2>
        <p>청각장애인(농인)을 위한 무제한 한국수어 변환, 부담 없는 가격으로 시작하세요.</p>
      </div>

      <div className="pricing-grid">
        <div className="pricing-card glass-rim">
          <span className="mono pricing-badge">Pro</span>
          <div className="pricing-price">
            <strong>4,900</strong>
            <span>원 / 월</span>
          </div>
          <p className="pricing-desc">
            웹페이지의 텍스트를 3D 아바타가 한국수어로 실시간 변환해주는 크롬 익스텐션
            서비스입니다. 청각장애인(농인)을 위한 무제한 수어 변환을 이용할 수 있습니다.
          </p>
          <ul className="pricing-features">
            {PLAN_FEATURES.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <button type="button" className="btn-primary pricing-btn" onClick={handleSubscribe}>
            구독하기
          </button>
        </div>
      </div>
    </section>
  );
}
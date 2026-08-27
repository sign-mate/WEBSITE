import { useEffect, useRef, useState } from "react";
import demoVideo from "../assets/demo.webm";
import { useReveal } from "../hooks/useReveal";
import type { OnboardingStep } from "../types";

const TABS: { title: string; body: string }[] = [
  { title: "문장을 드래그하세요", body: "아무 웹페이지에서나 텍스트를 마우스로 선택하면 자동으로 인식해요." },
  { title: "수어 영상을 확인하세요", body: "선택한 문장이 카드에 표시되고 곧바로 수어 영상이 재생돼요." },
  { title: "편한 대로 조정하세요", body: "카드 위치와 크기를 원하는 대로 맞추고 필요하면 확대해서 보세요." },
];

const MESSAGES = [
  "페이지 어디서든 문장을 선택해보세요",
  "곧바로 수어 영상이 재생돼요",
  "카드를 끌거나 늘려서 편하게 두세요",
];

const AUTO_ADVANCE_MS = 4200;

export default function Onboarding() {
  const head = useReveal<HTMLDivElement>();
  const card = useReveal<HTMLDivElement>();
  const [step, setStep] = useState<OnboardingStep>(0);
  const timerRef = useRef<number | undefined>(undefined);

  const restartAuto = () => {
    window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setStep((prev) => ((prev + 1) % TABS.length) as OnboardingStep);
    }, AUTO_ADVANCE_MS);
  };

  useEffect(() => {
    restartAuto();
    return () => window.clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectStep = (i: OnboardingStep) => {
    setStep(i);
    restartAuto();
  };

  return (
    <section className="wrap" id="how">
      <div className="mesh mesh-onboarding" />
      <div className={`section-head ${head.className}`} ref={head.ref}>
        <h2>처음 써보신다면, 이렇게 시작하세요</h2>
        <p>왼쪽 단계를 눌러보면 오른쪽 카드가 그 순간을 그대로 보여줘요.</p>
      </div>

      <div className={`onboarding glass-rim ${card.className}`} ref={card.ref}>
        <div className="ob-tabs">
          {TABS.map((tab, i) => (
            <button
              key={tab.title}
              type="button"
              className={`ob-tab${step === i ? " active" : ""}`}
              onClick={() => selectStep(i as OnboardingStep)}
            >
              <span className="num mono">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <h4>{tab.title}</h4>
                <p>{tab.body}</p>
              </span>
            </button>
          ))}
        </div>

        <div className="onboarding-preview">
          <div className="ob-card">
            {step === 0 && (
              <div className="ob-visual">
                <div className="mv-drag" style={{ width: 150, height: 110 }}>
                  <div className="mv-drag-inner">
                    <div className="ghost" />
                    <div className="card" />
                    <span className="arrow">↗</span>
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="ob-visual ob-visual-1">
                <div className="demo-sentence" style={{ width: 92, flexShrink: 0 }}>
                  다음 주 수요일부터 새로운 정책이 적용됩니다.
                </div>
                <div className="demo-video ob-video-box">
                  <video src={demoVideo} autoPlay muted loop playsInline />
                  <div className="demo-play">▶</div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="ob-visual">
                <div className="mv-resize" style={{ width: 150, height: 110 }}>
                  <div className="box">
                    <div className="handle" />
                  </div>
                  <div className="grow" />
                </div>
              </div>
            )}

            <p className="ob-msg">{MESSAGES[step]}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
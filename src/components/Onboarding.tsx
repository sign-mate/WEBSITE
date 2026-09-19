import { useEffect, useRef, useState } from "react";
import { useReveal } from "../hooks/useReveal";
import type { OnboardingStep } from "../types";
import { CursorIcon, IllusLines } from "./Illus";

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

const OB_LINE_WIDTHS = [92, 84, 52, 88, 76, 90, 64, 86, 72, 60];

function DragSelectVisual() {
  return (
    <div className="illus-stage ob-illus-stage" aria-hidden="true">
      <IllusLines widths={OB_LINE_WIDTHS} className="illus-lines--ob" />
      <div className="ob-highlight ob-highlight--anim" />
      <CursorIcon className="ob-highlight-cursor ob-highlight-cursor--anim" />
    </div>
  );
}

function VideoRevealVisual() {
  return (
    <div className="illus-stage ob-illus-stage" aria-hidden="true">
      <IllusLines widths={OB_LINE_WIDTHS} className="illus-lines--ob" />
      <div className="ob-highlight" />
      <div className="illus-overlay illus-overlay--ob-2">
        <img src="/onboarding/overlay.png" alt="" />
      </div>
    </div>
  );
}

function AdjustVisual() {
  return (
    <div className="illus-stage ob-illus-stage" aria-hidden="true">
      <IllusLines widths={OB_LINE_WIDTHS} className="illus-lines--ob" />
      <div className="illus-target illus-target--ob-3" />
      <div className="illus-overlay illus-overlay--ob-3">
        <img src="/onboarding/overlay.png" alt="" />
        <CursorIcon />
      </div>
    </div>
  );
}

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
            <div className="ob-visual">
              {step === 0 && <DragSelectVisual key={0} />}
              {step === 1 && <VideoRevealVisual key={1} />}
              {step === 2 && <AdjustVisual key={2} />}
            </div>
            <div className="ob-caption">
              <p className="ob-msg">{MESSAGES[step]}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useReveal } from "../hooks/useReveal";
import { CursorIcon, IllusLines } from "./Illus";

function PinchIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
      <path d="M1 1L2.8 2.8M1 1V2.3M1 1H2.3" stroke="#fff" strokeWidth="1" strokeLinecap="round" />
      <path d="M7 7L5.2 5.2M7 7V5.7M7 7H5.7" stroke="#fff" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

const LINE_WIDTHS = [88, 64, 92, 58, 80, 70, 86, 60, 76, 92, 66, 82];

function DragVisual() {
  return (
    <div className="illus-stage" aria-hidden="true">
      <IllusLines widths={LINE_WIDTHS} />
      <div className="illus-target illus-drag-target" />
      <div className="illus-overlay illus-overlay--drag">
        <img src="/onboarding/overlay.png" alt="" />
        <CursorIcon />
      </div>
    </div>
  );
}

function ResizeVisual() {
  return (
    <div className="illus-stage" aria-hidden="true">
      <IllusLines widths={LINE_WIDTHS} />
      <div className="illus-resize-anchor">
        <div className="illus-target illus-resize-target" />
        <div className="illus-overlay illus-overlay--resize">
          <img src="/onboarding/overlay.png" alt="" />
          <CursorIcon />
        </div>
      </div>
    </div>
  );
}

function ZoomVisual() {
  return (
    <div className="illus-stage" aria-hidden="true">
      <IllusLines widths={LINE_WIDTHS} />
      <div className="illus-overlay illus-overlay--zoom">
        <img src="/onboarding/overlay.png" alt="" />
        <div className="illus-video-mask">
          <div className="illus-video-zoom">
            <img src="/onboarding/avatar.jpg" alt="" />
          </div>
          <div className="illus-zoom-chip">
            <PinchIcon />
            <span>×2.4</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    label: "01 · POSITION",
    title: "원하는 자리로",
    body: ["헤더를 잡고 끌면 페이지 어디든 옮길 수 있습니다.", "위치는 저장되어 다음에도 그대로예요."],
    Visual: DragVisual,
  },
  {
    label: "02 · SIZE",
    title: "원하는 크기로",
    body: ["모서리를 잡고 늘리면 영상도 함께 커집니다.", "작은 노트북 화면에서도, 큰 모니터에서도 편하게."],
    Visual: ResizeVisual,
  },
  {
    label: "03 · DETAIL",
    title: "손끝까지 정확하게",
    body: ["트랙패드로 확대해서 손모양을 자세히 볼 수 있습니다.", "놓치기 쉬운 미묘한 동작까지."],
    Visual: ZoomVisual,
  },
] as const;

export default function Features() {
  const head = useReveal<HTMLDivElement>();

  return (
    <section className="wrap" id="features">
      <div className="mesh mesh-features" />
      <div className={`section-head ${head.className}`} ref={head.ref}>
        <h2>화면을 대신 차지하지 않습니다</h2>
        <p>고정된 패널이 아니라 필요한 곳에 필요한 만큼만 떠 있는 카드입니다.</p>
      </div>

      <div className="features">
        {FEATURES.map(({ label, title, body, Visual }) => (
          <div className="feature glass-rim" key={label}>
            <div className="feature-visual">
              <Visual />
            </div>
            <span className="mono">{label}</span>
            <h3>{title}</h3>
            <p>
              {body.map((line, i) => (
                <span key={line}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
import { useReveal } from "../hooks/useReveal";

function DragVisual() {
  return (
    <div className="mv-drag">
      <div className="mv-drag-inner">
        <div className="ghost" />
        <div className="card" />
        <span className="arrow">↗</span>
      </div>
    </div>
  );
}

function ResizeVisual() {
  return (
    <div className="mv-resize">
      <div className="box">
        <div className="handle" />
      </div>
      <div className="grow" />
    </div>
  );
}

function ZoomVisual() {
  return (
    <div className="mv-zoom">
      <div className="ring2" />
      <div className="ring1" />
      <span className="hand">🤟</span>
    </div>
  );
}

const FEATURES = [
  {
    label: "01 · POSITION",
    title: "원하는 자리로",
    body: "헤더를 잡고 끌면 페이지 어디든 옮길 수 있습니다. 위치는 저장되어 다음에도 그대로예요.",
    Visual: DragVisual,
  },
  {
    label: "02 · SIZE",
    title: "원하는 크기로",
    body: "모서리를 잡고 늘리면 영상도 함께 커집니다. 작은 노트북 화면에서도, 큰 모니터에서도 편하게.",
    Visual: ResizeVisual,
  },
  {
    label: "03 · DETAIL",
    title: "손끝까지 정확하게",
    body: "트랙패드로 확대해서 손모양을 자세히 볼 수 있습니다. 놓치기 쉬운 미묘한 동작까지.",
    Visual: ZoomVisual,
  },
] as const;

export default function Features() {
  const head = useReveal<HTMLDivElement>();

  return (
    <section className="wrap" id="features">
      <div className={`section-head ${head.className}`} ref={head.ref}>
        <h2>화면을 대신 차지하지 않습니다</h2>
        <p>고정된 패널이 아니라 필요한 곳에 필요한 만큼만 떠 있는 카드입니다.</p>
      </div>

      <div className="features">
        {FEATURES.map(({ label, title, body, Visual }) => (
          <div className="feature" key={label}>
            <div className="feature-visual">
              <Visual />
            </div>
            <span className="mono">{label}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
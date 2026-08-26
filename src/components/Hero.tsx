import { useEffect, useRef, useState } from "react";
import logo from "../assets/logo.png";
import demoVideo from "../assets/demo.webm";

export default function Hero() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const idleTimer = useRef<number | undefined>(undefined);
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    const stage = stageRef.current;
    if (!card || !stage) return;

    const startIdle = () => {
      idleTimer.current = window.setTimeout(() => setIdle(true), 900);
    };
    const stopIdle = () => {
      setIdle(false);
      window.clearTimeout(idleTimer.current);
    };

    const onPointerDown = (e: PointerEvent) => {
      stopIdle();
      const target = e.target as HTMLElement;
      if (target.closest("button")) return;
      // only the header should initiate dragging
      if (!target.closest(".demo-card-head")) return;
      dragging.current = true;
      const r = card.getBoundingClientRect();
      dragOffset.current = { x: e.clientX - r.left, y: e.clientY - r.top };
      card.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const sr = stage.getBoundingClientRect();
      let x = e.clientX - sr.left - dragOffset.current.x;
      let y = e.clientY - sr.top - dragOffset.current.y;
      x = Math.max(8, Math.min(x, sr.width - card.offsetWidth - 8));
      y = Math.max(8, Math.min(y, sr.height - card.offsetHeight - 8));
      card.style.left = `${x}px`;
      card.style.top = `${y}px`;
      card.style.right = "auto";
    };

    const onPointerUp = () => {
      dragging.current = false;
      startIdle();
    };

    card.addEventListener("pointerdown", onPointerDown);
    card.addEventListener("pointermove", onPointerMove);
    card.addEventListener("pointerup", onPointerUp);
    card.addEventListener("pointercancel", onPointerUp);
    startIdle();

    return () => {
      card.removeEventListener("pointerdown", onPointerDown);
      card.removeEventListener("pointermove", onPointerMove);
      card.removeEventListener("pointerup", onPointerUp);
      card.removeEventListener("pointercancel", onPointerUp);
      window.clearTimeout(idleTimer.current);
    };
  }, []);

  return (
    <header className="wrap hero">
      <div className="mesh mesh-hero" />
      <div>
        <h1>
          웹 어디서든
          <br />
          문장을 <em>드래그</em>하면
          <br />
          수어가 됩니다
        </h1>
        <p className="lede">
          기사를 읽다가, 공지를 확인하다가
          <br />
          어느 페이지에서든 문장을 선택하면
          <br />
          그 자리에서 한국수어 영상으로 바로 보여줍니다.
        </p>
        <div className="cta-row">
          <a className="btn-primary" href="#install">
            Chrome에 추가하기
          </a>
          <a className="btn-secondary" href="#how">
            작동 방식 보기
          </a>
        </div>
        <p className="hero-note">
          오른쪽 카드를 <b>직접 끌어서</b> 옮겨보세요. 실제 카드와 똑같이 움직입니다.
        </p>
      </div>

      <div className="stage" ref={stageRef}>
        <div className="browser">
          <div className="browser-bar">
            <span />
            <span />
            <span />
          </div>
          <div className="browser-body">
            <h4>오늘의 공지사항</h4>
            <p>
              <span className="drag-target">다음 주 수요일부터 새로운 정책이 적용됩니다.</span>
            </p>
            <p>자세한 내용은 아래 첨부파일을 참고해주세요.</p>
            <p>문의사항은 담당자에게 연락 바랍니다.</p>
          </div>
          <div className="hint-tag mono">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M12 3v14m0 0l-4-4m4 4l4-4" />
              <rect x="4" y="19" width="16" height="2" rx="1" />
            </svg>
            drag any sentence
          </div>
        </div>

        <div className={`demo-card${idle ? " idle" : ""}`} ref={cardRef}>
          <div className="demo-card-head">
            <div className="demo-card-brand">
              <img src={logo} alt="" />
              Signmate
            </div>
            <button aria-hidden="true">✕</button>
          </div>
          <div className="demo-sentence">다음 주 수요일부터 새로운 정책이 적용됩니다.</div>
          <div className="demo-video">
            <video src={demoVideo} autoPlay muted loop playsInline />
            <div className="demo-play">▶</div>
          </div>
          <p className="demo-hint">카드를 끌어서 원하는 곳에 두세요</p>
        </div>
      </div>
    </header>
  );
}
import { useState } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Onboarding from "./components/Onboarding";
import Closer from "./components/Closer";
import Footer from "./components/Footer";
import AuthFlow from "./auth/AuthFlow";

export default function App() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <Nav onLoginClick={() => setAuthOpen(true)} />
      <Hero />
      <Features />
      <Onboarding />
      <Closer />
      <Footer />

      {authOpen && (
        <div className="auth-modal-backdrop" onClick={() => setAuthOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", width: 420 }}>
            {/*
              dim이 없어져 뒤 페이지가 밝게 비치므로 흰 ✕는 보이지 않는다.
              카드와 같은 유리질 칩을 깔고 글자색을 잉크로 바꿔 어떤 콘텐츠 위에서도 읽히게 한다.
            */}
            <button
              type="button"
              onClick={() => setAuthOpen(false)}
              className="auth-modal-close"
              aria-label="닫기"
            >
              ✕
            </button>
            <AuthFlow />
          </div>
        </div>
      )}
    </>
  );
}
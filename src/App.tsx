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
        <div className="modal-backdrop" onClick={() => setAuthOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setAuthOpen(false)}
              style={{
                position: "absolute",
                top: -36,
                right: 0,
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: 20,
                cursor: "pointer",
              }}
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
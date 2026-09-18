import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import PricingPage from "./pages/PricingPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import RefundPolicyPage from "./pages/RefundPolicyPage";
import AuthFlow from "./auth/AuthFlow";
import KakaoCallback from "./auth/KakaoCallback";

export default function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const openAuth = () => setAuthOpen(true);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Layout onLoginClick={openAuth}>
              <Landing />
            </Layout>
          }
        />
        <Route
          path="/pricing"
          element={
            <Layout onLoginClick={openAuth}>
              <PricingPage />
            </Layout>
          }
        />
        <Route
          path="/terms"
          element={
            <Layout onLoginClick={openAuth}>
              <TermsPage />
            </Layout>
          }
        />
        <Route
          path="/privacy"
          element={
            <Layout onLoginClick={openAuth}>
              <PrivacyPage />
            </Layout>
          }
        />
        <Route
          path="/refund-policy"
          element={
            <Layout onLoginClick={openAuth}>
              <RefundPolicyPage />
            </Layout>
          }
        />
        <Route path="/oauth/kakao/callback" element={<KakaoCallback />} />
      </Routes>

      {authOpen && (
        <div className="auth-modal-backdrop" onClick={() => setAuthOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", width: 420 }}>
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

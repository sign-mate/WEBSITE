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
import { clearTokens, getAccessToken } from "./auth/apiClient";

export default function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authView, setAuthView] = useState<"login" | "mypage">("login");
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getAccessToken());

  const openLogin = () => {
    setAuthView("login");
    setAuthOpen(true);
  };
  const openMyPage = () => {
    setAuthView("mypage");
    setAuthOpen(true);
  };
  const handleLogout = () => {
    clearTokens();
    setIsLoggedIn(false);
  };

  const layoutProps = {
    isLoggedIn,
    onLoginClick: openLogin,
    onMyPageClick: openMyPage,
    onLogout: handleLogout,
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Layout {...layoutProps}>
              <Landing />
            </Layout>
          }
        />
        <Route
          path="/pricing"
          element={
            <Layout {...layoutProps}>
              <PricingPage />
            </Layout>
          }
        />
        <Route
          path="/terms"
          element={
            <Layout {...layoutProps}>
              <TermsPage />
            </Layout>
          }
        />
        <Route
          path="/privacy"
          element={
            <Layout {...layoutProps}>
              <PrivacyPage />
            </Layout>
          }
        />
        <Route
          path="/refund-policy"
          element={
            <Layout {...layoutProps}>
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
            <AuthFlow initialView={authView} onAuthSuccess={() => setIsLoggedIn(true)} />
          </div>
        </div>
      )}
    </>
  );
}

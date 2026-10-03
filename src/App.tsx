import { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import PricingPage from "./pages/PricingPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import RefundPolicyPage from "./pages/RefundPolicyPage";
import AccountDeletionPage from "./pages/AccountDeletionPage";
import AuthFlow from "./auth/AuthFlow";
import KakaoCallback from "./auth/KakaoCallback";
import { clearTokens, getAccessToken } from "./auth/apiClient";

type AuthModalView =
  | { name: "login" }
  | { name: "mypage" }
  | { name: "subscription"; subView?: "overview" | "subscribe" };

export default function App() {
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const [authView, setAuthView] = useState<AuthModalView>({ name: "login" });
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getAccessToken());
  const [notice, setNotice] = useState<string | null>(null);

  const openLogin = () => {
    setAuthView({ name: "login" });
    setAuthOpen(true);
  };
  const openMyPage = () => {
    setAuthView({ name: "mypage" });
    setAuthOpen(true);
  };
  const openSubscribe = () => {
    if (!isLoggedIn) {
      openLogin();
      return;
    }
    setAuthView({ name: "subscription", subView: "subscribe" });
    setAuthOpen(true);
  };
  const handleLogout = () => {
    clearTokens();
    setIsLoggedIn(false);
  };
  const handleWithdrawSuccess = (message: string) => {
    handleLogout();
    setAuthOpen(false);
    navigate("/");
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2500);
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
              <PricingPage onSubscribeClick={openSubscribe} />
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
        <Route
          path="/account-deletion"
          element={
            <Layout {...layoutProps}>
              <AccountDeletionPage />
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
            <AuthFlow
              initialView={authView}
              onAuthSuccess={() => setIsLoggedIn(true)}
              onWithdrawSuccess={handleWithdrawSuccess}
            />
          </div>
        </div>
      )}

      {notice && <div className="app-notice">{notice}</div>}
    </>
  );
}
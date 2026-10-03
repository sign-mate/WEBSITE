import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useScrolled } from "../hooks/useScrolled";
import SignPreview from "./SignPreview";

interface Props {
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onMyPageClick: () => void;
  onLogout: () => void;
}

export default function Nav({ isLoggedIn, onLoginClick, onMyPageClick, onLogout }: Props) {
  const scrolled = useScrolled();

  return (
    <nav className={`wrap${scrolled ? " scrolled" : ""}`}>
      <Link to="/" className="brand">
        <img src={logo} alt="Signmate" />
        Signmate
      </Link>
      <div className="nav-actions">
        <SignPreview src="/sign/pricing.mp4">
          <Link className="nav-login" to="/pricing">
            요금제
          </Link>
        </SignPreview>
        {isLoggedIn ? (
          <>
            <SignPreview src="/sign/mypage.mp4">
              <a
                className="nav-login"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onMyPageClick();
                }}
              >
                마이페이지
              </a>
            </SignPreview>
            <a
              className="nav-login"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onLogout();
              }}
            >
              로그아웃
            </a>
          </>
        ) : (
          <SignPreview src="/sign/login.mp4">
            <a
              className="nav-login"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onLoginClick();
              }}
            >
              로그인
            </a>
          </SignPreview>
        )}
        <SignPreview src="/sign/install.mp4">
          <a className="nav-cta" href="/#install">
            확장 프로그램 설치 →
          </a>
        </SignPreview>
      </div>
    </nav>
  );
}
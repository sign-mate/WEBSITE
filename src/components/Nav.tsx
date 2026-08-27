import logo from "../assets/logo.png";
import { useScrolled } from "../hooks/useScrolled";

export default function Nav() {
  const scrolled = useScrolled();

  return (
    <nav className={`wrap${scrolled ? " scrolled" : ""}`}>
      <div className="brand">
        <img src={logo} alt="Signmate" />
        Signmate
      </div>
      <div className="nav-actions">
        {/* 클릭 동작(모달/페이지 이동)은 추후 별도 작업 */}
        <a className="nav-login" href="#">
          로그인
        </a>
        <a className="nav-cta" href="#install">
          확장 프로그램 설치 →
        </a>
      </div>
    </nav>
  );
}

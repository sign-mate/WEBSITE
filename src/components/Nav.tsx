import logo from "../assets/logo.png";
import { useScrolled } from "../hooks/useScrolled";

interface Props {
  onLoginClick: () => void;
}

export default function Nav({ onLoginClick }: Props) {
  const scrolled = useScrolled();

  return (
    <nav className={`wrap${scrolled ? " scrolled" : ""}`}>
      <div className="brand">
        <img src={logo} alt="Signmate" />
        Signmate
      </div>
      <div className="nav-actions">
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
        <a className="nav-cta" href="#install">
          확장 프로그램 설치 →
        </a>
      </div>
    </nav>
  );
}
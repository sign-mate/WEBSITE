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
      <a className="nav-cta" href="#install">
        확장 프로그램 설치 →
      </a>
    </nav>
  );
}

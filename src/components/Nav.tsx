import logo from "../assets/logo.png";

export default function Nav() {
  return (
    <nav className="wrap">
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
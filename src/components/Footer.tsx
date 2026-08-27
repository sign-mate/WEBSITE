export default function Footer() {
  return (
    <footer className="wrap">
      <div className="footer-cols">
        <div className="footer-info">
          <div className="brand mono">Signmate</div>
          <div>한국수어 변환 크롬 익스텐션 · 갭이어 프로젝트</div>
          <a className="footer-mail" href="mailto:contact@signmate.team">
            contact@signmate.team
          </a>
          <div className="footer-credit">© 2026. Signmate. All rights reserved.</div>
        </div>
        <nav className="footer-links" aria-label="사이트 링크">
          <a href="#features">서비스 소개</a>
          <a href="#how">작동 방식</a>
          <a href="#install">설치하기</a>
          <a href="https://github.com/sign-mate">GitHub</a>
        </nav>
      </div>
    </footer>
  );
}

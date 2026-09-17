import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="wrap">
      <div className="footer-cols">
        <div className="footer-info">
          <div className="footer-brand-group">
            <div className="brand mono">Signmate</div>
            <div className="footer-tagline">한국수어 변환 크롬 익스텐션</div>
          </div>
          <div className="footer-biz">
            <p>상호명: Signmate(사인메이트)</p>
            <p>대표자: 임정원 (공동사업자: 윤혜린, 이현택)</p>
            <p>사업자등록번호: 313-10-65174</p>
            <p>사업장 주소: 경기도 부천시 원미구 소향로 11, A동 2602호(상동, 코오롱파크뷰)</p>
            <p>통신판매업신고번호: 준비 중 (추후 업데이트 예정)</p>
            <p>고객센터: doole0009@gmail.com</p>
          </div>
          <div className="footer-credit">© 2026. Signmate. All rights reserved.</div>
        </div>
        <nav className="footer-links" aria-label="사이트 링크">
          <a href="/#features">서비스 소개</a>
          <Link to="/pricing">요금제</Link>
          <Link to="/terms">이용약관</Link>
          <Link to="/privacy">개인정보처리방침</Link>
          <Link to="/refund-policy">환불정책</Link>
          <a href="https://github.com/sign-mate">GitHub</a>
        </nav>
      </div>
    </footer>
  );
}

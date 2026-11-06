import './HomeFooter.css'

function SocialIcon({ type }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
    {type === 'instagram' ? <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" /></> : type === 'youtube' ? <><rect x="2" y="5" width="20" height="14" rx="5" /><path d="m10 9 5 3-5 3Z" /></> : <><path d="M21 11c0 5-4 8-9 8H9l-5 3 1-5a8 8 0 0 1-2-6c0-5 4-8 9-8s9 3 9 8Z" /><path d="M8 11h.1m4 0h.1m4 0h.1" strokeLinecap="round" strokeWidth="2.5" /></>}
  </svg>
}

export default function HomeFooter() {
  return <footer className="mellow-footer">
    <div className="mellow-footer-top">
      <div className="mellow-footer-brand">
        <a className="mellow-footer-title" href="#home">MELLOW BAKE</a>
        <p>일상 속 달콤한 쉼표, 멜로우 베이크</p>
        <p>좋은 재료와 정성을 담아 달콤한 순간을 전합니다.</p>
      </div>
      <nav className="mellow-footer-column" aria-label="INFORMATION">
        <h2>INFORMATION</h2>
        <a href="#our-story">About Us</a>
        <a href="#visit">Store Location</a>
        <button type="button" disabled>Contact Us</button>
      </nav>
      <nav className="mellow-footer-column" aria-label="CUSTOMER">
        <h2>CUSTOMER</h2>
        <button type="button" disabled>FAQ</button>
        <button type="button" disabled>Delivery Guide</button>
        <button type="button" disabled>1:1 Inquiry</button>
      </nav>
      <nav className="mellow-footer-column mellow-footer-social" aria-label="FOLLOW US">
        <h2>FOLLOW US</h2>
        <button type="button" disabled><SocialIcon type="instagram" />Instagram</button>
        <button type="button" disabled><SocialIcon type="youtube" />YouTube</button>
        <button type="button" disabled><SocialIcon type="chat" />Kakao Talk</button>
      </nav>
    </div>
    <div className="mellow-footer-bottom">
      <span>© 2026 MELLOW BAKE. All Rights Reserved.</span>
      <nav aria-label="푸터 정책 및 바로가기">
        <a href="#best-menu">MENU</a>
        <a href="#home">BACK TO TOP ↑</a>
        <button type="button" disabled>이용약관</button>
        <button type="button" disabled>개인정보처리방침</button>
      </nav>
    </div>
  </footer>
}

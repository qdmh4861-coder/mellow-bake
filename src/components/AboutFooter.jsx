function SocialIcon({ type }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">{type === 'Instagram' ? <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" /></> : type === 'YouTube' ? <><rect x="2" y="5" width="20" height="14" rx="5" /><path d="m10 9 5 3-5 3Z" /></> : <><path d="M21 11c0 5-4 8-9 8H9l-5 3 1-5a8 8 0 0 1-2-6c0-5 4-8 9-8s9 3 9 8Z" /><path d="M8 11h.1m4 0h.1m4 0h.1" strokeLinecap="round" strokeWidth="2.5" /></>}</svg>
}
// Existing STORE portfolio information; this page does not claim a live shop.
export default function AboutFooter() {
  return <footer className="about-footer"><div className="about-footer-columns">
    <section><h2><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M6 15a5 5 0 1 1 2-9 5 5 0 0 1 8 0 5 5 0 1 1 2 9v6H6v-6Z" /><path d="M6 17h12" /></svg> MELLOW BAKE</h2><p>일상 속 달콤한 쉼표, 멜로우 베이크</p><div className="about-footer-socials" aria-label="소셜 채널">{['Instagram', 'YouTube', 'Kakao Talk'].map(type => <button key={type} type="button" disabled title={`${type} 연결 준비 중`} aria-label={`${type} 연결 준비 중`}><SocialIcon type={type} /></button>)}</div></section>
    <section><h3>고객센터</h3><p>010-1234-5678<br />매일 10:00 ~ 21:00</p><a href="/mypage/inquiry">1:1 문의하기</a></section>
    <section><h3>매장 안내</h3><p>서울특별시 관악구 남부순환로 1820,<br />101동 203호<br />매일 10:00 ~ 21:00</p><small>포트폴리오용 예시 매장 정보입니다.</small></section>
    <nav aria-label="브랜드 소개 푸터 바로가기"><h3>바로가기</h3><div><a href="/mypage/notices">공지사항</a><a href="/mypage/faq">자주 묻는 질문(FAQ)</a><button type="button" disabled>이용약관</button><button type="button" disabled>개인정보처리방침</button></div><a href="/menu">MENU</a><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>BACK TO TOP ↑</button></nav>
  </div><div className="about-footer-copyright">© 2026 MELLOW BAKE. All Rights Reserved.</div></footer>
}

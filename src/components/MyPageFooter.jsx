import { assetHref, appHref } from '../appRouting'
import './MyPageFooter.css'

import wishlistDecorAssets from './wishlistDecorAssets.json'

function FooterIcon({ type }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{type === 'hat' ? <><path d="M6 15a5 5 0 1 1 2-9 5 5 0 0 1 8 0 5 5 0 1 1 2 9v6H6v-6Z" /><path d="M6 17h12m-8-6v3m4-3v3" /></> : type === 'instagram' ? <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" /></> : type === 'youtube' ? <><rect x="2" y="5" width="20" height="14" rx="5" /><path d="m10 9 5 3-5 3Z" /></> : type === 'chat' ? <><path d="M21 11c0 5-4 8-9 8H9l-5 3 1-5a8 8 0 0 1-2-6c0-5 4-8 9-8s9 3 9 8Z" /><path d="M7 11h.1m5 0h.1m5 0h.1" /></> : type === 'support' ? <><path d="M4 14v-3a8 8 0 0 1 16 0v3M4 12H2v7h5v-7H4Zm16 0h2v7h-5v-7h3ZM17 21h-5" /></> : type === 'store' ? <><path d="M3 10V4h18v6M5 13v9h14v-9M9 22v-7h6v7M2 10h20M7 4l-1 6m6-6v6m5-6 1 6" /></> : <path d="M12 21S2 15 2 8c0-6 8-7 10-1 2-6 10-5 10 1 0 7-10 13-10 13Z" />}</svg>
}
// Original-reference decorations edited into separate alpha assets.
// Bounds trim transparent padding only; the footer copy and controls remain JSX.
function ReferenceArt({ part, className = '', orange = false }) {
  const assets = {
    logo: [1942, 809, '225 49 1484 711'],
    left: [1642, 958, '63 78 1498 810'],
    right: [1774, 887, '138 82 1501 719'],
    bow: [1983, 793, '207 100 1568 620'],
  }
  const [width, height, box] = assets[part]
  const recolored = orange && wishlistDecorAssets[part]
  if (recolored) return <svg className={`mypage-footer-reference-art ${className}`} viewBox={recolored.box} preserveAspectRatio="xMidYMid meet" aria-hidden="true"><image href={assetHref(recolored.src)} width={recolored.width} height={recolored.height} /></svg>
  return <svg className={`mypage-footer-reference-art ${className}`} viewBox={box} preserveAspectRatio="xMidYMid meet" aria-hidden="true"><image href={assetHref(`/images/member-footer-${part}.png`)} width={width} height={height} /></svg>
}
const columns = [
  { title: 'INFORMATION', icon: 'store', links: [['About Us', '/#our-story'], ['Store Location', '/store'], ['Contact Us', '/mypage/inquiry']] },
  { title: 'CUSTOMER', icon: 'support', links: [['FAQ', '/mypage/faq'], ['Delivery Guide', '/mypage/orders'], ['1:1 Inquiry', '/mypage/inquiry']] },
  { title: 'FOLLOW US', icon: 'heart', links: [['Instagram', null, 'instagram'], ['YouTube', null, 'youtube'], ['Kakao Talk', null, 'chat']] },
]
export default function MyPageFooter({ orange = false }) {
  return <footer className={`mypage-footer${orange ? ' mypage-footer--wishlist' : ''}`} aria-label="MELLOW BAKE 마이페이지 푸터">
    <div className="mypage-footer-awning" aria-hidden="true">{Array.from({ length: 32 }, (_, index) => <span key={index} />)}</div>
    <div className="mypage-footer-inner">
      <div className="mypage-footer-columns">
        <section className="mypage-footer-brand"><a className="mypage-footer-logo" href={appHref("/")} aria-label="MELLOW BAKE 홈"><ReferenceArt orange={orange} part="logo" /></a><p>일상 속 달콤한 쉼표, 멜로우 베이크</p><p>좋은 재료와 정성을 담아 달콤한 순간을 전합니다.</p></section>
        {columns.map(column => <nav className="mypage-footer-column" aria-label={`마이페이지 푸터 ${column.title}`} key={column.title}><h2><FooterIcon type={column.icon} />{column.title}</h2>{column.links.map(([label, href, icon]) => href ? <a href={appHref(href)} key={label}>{icon && <FooterIcon type={icon} />}<span>{label}</span><b aria-hidden="true">›</b></a> : <span className="mypage-footer-unlinked" key={label}><FooterIcon type={icon} /><span>{label}</span><b aria-hidden="true">›</b></span>)}</nav>)}
      </div>
      <div className="mypage-footer-art" aria-hidden="true"><ReferenceArt orange={orange} part="left" className="mypage-footer-left-art" /><ReferenceArt orange={orange} part="bow" className="mypage-footer-center-art" /><ReferenceArt orange={orange} part="right" className="mypage-footer-right-art" /></div>
    </div>
    <div className="mypage-footer-bottom"><div><span>© 2025 MELLOW BAKE. All rights reserved.</span><nav aria-label="마이페이지 푸터 정책 및 바로가기"><a href={appHref("/menu")}>MENU</a><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>BACK TO TOP ↑</button><span className="mypage-footer-policy" title="아직 연결된 약관 페이지가 없습니다.">이용약관 <small>준비 중</small></span><span className="mypage-footer-policy" title="아직 연결된 개인정보처리방침 페이지가 없습니다.">개인정보처리방침 <small>준비 중</small></span></nav></div></div>
  </footer>
}



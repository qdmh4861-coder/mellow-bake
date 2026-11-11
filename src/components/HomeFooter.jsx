import { appLocation, assetHref, appHref } from '../appRouting'
import './HomeFooter.css'

import AboutFooter from './AboutFooter'

function backToTop(event) {
  event.preventDefault()
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
}

function SocialIcon({ type }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
    {type === 'instagram' ? <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" /></> : type === 'youtube' ? <><rect x="2" y="5" width="20" height="14" rx="5" /><path d="m10 9 5 3-5 3Z" /></> : <><path d="M21 11c0 5-4 8-9 8H9l-5 3 1-5a8 8 0 0 1-2-6c0-5 4-8 9-8s9 3 9 8Z" /><path d="M8 11h.1m4 0h.1m4 0h.1" strokeLinecap="round" strokeWidth="2.5" /></>}
  </svg>
}

export default function HomeFooter({ artwork = null, referenceImage = null, variant = 'default' }) {
  if (variant === 'about') return <AboutFooter />
  if (referenceImage) {
    return <footer className="mellow-footer-reference" aria-label="MELLOW BAKE 푸터">
      <svg viewBox="0 135 2172 589" role="img" aria-label="MELLOW BAKE — 일상 속 달콤한 쉼표, 멜로우 베이크. 좋은 재료와 정성을 담아 달콤한 순간을 전합니다. INFORMATION, CUSTOMER, FOLLOW US. © 2026 MELLOW BAKE. All Rights Reserved.">
        <image href={assetHref(referenceImage)} width="2172" height="724" />
      </svg>
      <nav aria-label="푸터 바로가기">
        <a className="footer-reference-link footer-reference-about" href={appHref("/about")} aria-label="About Us" />
        <a className="footer-reference-link footer-reference-store" href={appHref("/store")} aria-label="Store Location" />
        <a className="footer-reference-link footer-reference-menu" href={appHref("/menu")} aria-label="MENU" />
        <a className="footer-reference-link footer-reference-top" href={appHref("#")} onClick={backToTop} aria-label="BACK TO TOP" />
      </nav>
    </footer>
  }
  const content = <div className="mellow-footer-top">
      <div className="mellow-footer-brand">
        <a className="mellow-footer-title" href={appHref("/")}>MELLOW BAKE</a>
        <p>일상 속 달콤한 쉼표, 멜로우 베이크</p>
        <p>좋은 재료와 정성을 담아 달콤한 순간을 전합니다.</p>
      </div>
      <nav className="mellow-footer-column" aria-label="INFORMATION">
        <h2>INFORMATION</h2>
        <a href={appHref("/about")}>About Us</a>
        <a href={appHref("/store")}>Store Location</a>
        <button type="button" onClick={() => appLocation.assign('/mypage/inquiry')}>Contact Us</button>
      </nav>
      <nav className="mellow-footer-column" aria-label="CUSTOMER">
        <h2>CUSTOMER</h2>
        <button type="button" onClick={() => appLocation.assign('/mypage/faq')}>FAQ</button>
        <button type="button" onClick={() => appLocation.assign('/mypage/orders')}>Delivery Guide</button>
        <button type="button" onClick={() => appLocation.assign('/mypage/inquiry')}>1:1 Inquiry</button>
      </nav>
      <nav className="mellow-footer-column mellow-footer-social" aria-label="FOLLOW US">
        <h2>FOLLOW US</h2>
        <button type="button" disabled><SocialIcon type="instagram" />Instagram</button>
        <button type="button" disabled><SocialIcon type="youtube" />YouTube</button>
        <button type="button" disabled><SocialIcon type="chat" />Kakao Talk</button>
      </nav>
    </div>
  return <footer className="mellow-footer">
    {artwork ? <div className="mellow-footer-main">{artwork}{content}</div> : content}
    <div className="mellow-footer-bottom">
      <span>© 2026 MELLOW BAKE. All Rights Reserved.</span>
      <nav aria-label="푸터 정책 및 바로가기">
        <a href={appHref("/menu")}>MENU</a>
        <a href={appHref("#")} onClick={backToTop}>BACK TO TOP ↑</a>
        <button type="button" disabled>이용약관</button>
        <button type="button" disabled>개인정보처리방침</button>
      </nav>
    </div>
  </footer>
}

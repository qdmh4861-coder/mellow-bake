import { appHref } from '../appRouting'
import './ProductDetailFooter.css'

function Icon({ type }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {type === 'hat' ? <><path d="M6 15a5 5 0 1 1 2-9 5 5 0 0 1 8 0 5 5 0 1 1 2 9v6H6Z" /><path d="M6 17h12m-8-7v3m4-3v3" /></> : type === 'instagram' ? <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="18" cy="6" r=".7" /></> : type === 'youtube' ? <><rect x="2" y="5" width="20" height="14" rx="5" /><path d="m10 9 5 3-5 3Z" /></> : type === 'chat' ? <><path d="M21 11c0 5-4 8-9 8H9l-5 3 1-5a8 8 0 0 1-2-6c0-5 4-8 9-8s9 3 9 8Z" /><path d="M7 11h.1m5 0h.1m5 0h.1" /></> : type === 'support' ? <><path d="M4 13v-2a8 8 0 0 1 16 0v2M3 12h4v8H3Zm14 0h4v8h-4Zm0 9h-5" /></> : <path d="M12 21S2 15 2 8c0-6 8-7 10-1 2-6 10-5 10 1 0 7-10 13-10 13Z" />}
  </svg>
}

const groups = [
  { title: 'INFORMATION', icon: 'hat', links: [['About Us', '/about'], ['Store Location', '/store'], ['Contact Us', '/mypage/inquiry']] },
  { title: 'CUSTOMER', icon: 'support', links: [['FAQ', '/mypage/faq'], ['Delivery Guide', '/mypage/orders'], ['1:1 Inquiry', '/mypage/inquiry']] },
  { title: 'FOLLOW US', icon: 'heart', links: [['Instagram', null, 'instagram'], ['YouTube', null, 'youtube'], ['Kakao Talk', null, 'chat']] },
]

export default function ProductDetailFooter() {
  return <footer className="product-detail-footer" aria-label="상품 상세페이지 푸터">
    <div className="product-detail-footer-wave" aria-hidden="true"><svg viewBox="0 0 1440 64" preserveAspectRatio="none"><path fill="#FFF8EF" d="M0 0H1440V28Q1380 62 1320 28T1080 28T840 28T600 28T360 28T120 28Q60 62 0 28Z" /><path fill="none" stroke="#cfacb5" strokeWidth="1.5" strokeDasharray="6 6" d="M0 19Q60 53 120 19T360 19T600 19T840 19T1080 19T1320 19Q1380 53 1440 19" /></svg></div>
    <div className="product-detail-footer-inner">
      <section className="product-detail-footer-brand">
        <a href={appHref("/")} className="product-detail-footer-logo"><Icon type="hat" /><span>MELLOW BAKE <b aria-hidden="true">♡</b></span></a>
        <p>일상 속 달콤한 쉼표, 멜로우 베이크</p>
        <p>좋은 재료와 정성을 담아 달콤한 순간을 전합니다.</p>
      </section>
      {groups.map(group => <nav className="product-detail-footer-column" aria-label={`상품 푸터 ${group.title}`} key={group.title}>
        <h2><Icon type={group.icon} />{group.title}</h2>
        {group.links.map(([label, href, icon]) => href ? <a href={appHref(href)} key={label}>{label}</a> : <span className="product-detail-footer-unlinked" key={label}>{icon && <Icon type={icon} />}<span>{label}<small>연결 준비 중</small></span></span>)}
      </nav>)}
    </div>
    <div className="product-detail-footer-bottom"><div>
      <span>© 2026 MELLOW BAKE. All Rights Reserved.</span>
      <nav aria-label="상품 푸터 정책 및 바로가기"><a href={appHref("/menu")}>MENU</a><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>BACK TO TOP ↑</button><span>이용약관 <small>준비 중</small></span><span>개인정보처리방침 <small>준비 중</small></span></nav>
    </div></div>
  </footer>
}

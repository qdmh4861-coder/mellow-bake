import { assetHref, appHref } from '../appRouting'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import artAssets from './aboutArt.json'
import './About.css'

function Art({ name, className = '' }) {
  const asset = artAssets[name]
  return asset ? <svg className={`about-art ${className}`} viewBox={asset.box} preserveAspectRatio="xMidYMid meet" aria-hidden="true"><image href={assetHref(asset.src)} width={asset.width} height={asset.height} /></svg> : null
}
function Bow({ className = '' }) {
  return <svg className={`about-bow ${className}`} viewBox="0 0 120 48" aria-hidden="true"><path d="M59 26C30-6 5 8 23 25c10 9 26 7 36 1Zm2 0C90-6 115 8 97 25c-10 9-26 7-36 1Z" fill="#f6a8b7" stroke="#a71936" strokeWidth="3" /><path d="m54 30-16 15 18-5 4-9 4 9 18 5-16-15" fill="#ce4662" stroke="#a71936" strokeWidth="2" /><rect x="54" y="20" width="12" height="13" rx="5" fill="#c63754" stroke="#790f24" strokeWidth="2" /></svg>
}
function BrandMark({ small = false }) {
  return <div className={`about-brand-mark${small ? ' about-brand-mark--small' : ''}`}><svg className="about-chef-hat" viewBox="0 0 80 60" fill="#fff8ef" stroke="#790f24" strokeWidth="3" aria-hidden="true"><path d="M17 39C-2 38 1 12 22 13 24-4 54-3 58 13c21-4 26 25 5 27v17H17V39Z" /><path d="M18 46h44M31 27v10m17-10v10" /></svg><strong>MELLOW BAKE</strong><span className="about-mark-leaves" aria-hidden="true">❧　　　❧</span><Bow /></div>
}
function Divider() { return <div className="about-divider" aria-hidden="true"><Bow /></div> }
function ClosingMark() {
  return <div className="about-closing-mark">
    <svg viewBox="0 0 440 152" role="img" aria-label="MELLOW BAKE">
      <g fill="#fff8ef" stroke="#790f24" strokeWidth="3" strokeLinejoin="round">
        <path d="M327 83c-12-13-9-31 0-39l10-29c5-15 20-11 17 3l-6 23 14 5 15-27c8-13 21-5 14 8l-14 27c15 15 14 36 0 49l-21 10Z" />
        <path d="m338 20-7 25m51-20-13 23" stroke="#ee9aa5" strokeWidth="6" strokeLinecap="round" />
      </g>
      <g fill="#790f24"><ellipse cx="343" cy="65" rx="3" ry="4" /><ellipse cx="363" cy="70" rx="3" ry="4" /></g>
      <path d="m349 75 4 3 4-1m-5 2c-1 5-6 5-8 1m8 0c0 5 5 7 8 3" fill="none" stroke="#790f24" strokeWidth="2" strokeLinecap="round" />
      <g fill="#f3a2b1"><ellipse cx="332" cy="75" rx="7" ry="4" /><ellipse cx="372" cy="81" rx="7" ry="4" /></g>
      <g fill="none" stroke="#c72b50" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M311 31c-21-9-11-26-2-16 7-16 22-3 2 16ZM401 67c-20-6-15-23-4-15 3-17 20-8 4 15Z" />
        <path d="m49 45-10-12m25 5-5-18M39 63l-16-4" />
      </g>
      <path d="M69 67c-24-9-46 6-46 27-1 24 25 38 49 31 14 16 42 16 61 6 20 15 48 12 65 4 22 12 48 9 62-2 26 12 53 5 62-10 26 4 43-11 41-31-2-23-22-33-43-28-14-18-43-21-61-10-17-16-49-16-66-4-22-15-48-9-60 4-24-9-48-1-64 13Z" fill="#fff8ef" stroke="#a71936" strokeWidth="3" />
      <path d="M78 73c-23-8-46 2-47 21-1 20 22 32 44 24 17 16 39 15 59 6 18 15 47 11 64 4 21 12 47 10 62-2 24 10 48 6 60-12 24 6 38-9 35-23-3-17-21-25-40-19-17-20-40-20-57-11-19-15-44-15-64-3-20-14-44-8-58 4-24-9-47-3-58 11Z" fill="none" stroke="#edb1b7" strokeWidth="1.5" />
      <path d="M160 53c-20-1-20-26-3-28 0-18 26-23 34-7 20-7 32 17 15 27l-1 14-44-1Z" fill="#fff8ef" stroke="#790f24" strokeWidth="3" />
      <path d="M163 50q20 6 40 0m-32-16 2 8m17-9-1 10" fill="none" stroke="#e8a6ab" strokeWidth="2" strokeLinecap="round" />
      <text x="192" y="106" textAnchor="middle" fill="#790f24" fontSize="34" fontWeight="900" fontFamily="inherit" letterSpacing="-1.2">MELLOW BAKE</text>
      <path d="M344 106c9-12 20-6 17 3m-30-2c-2-7 7-11 12-6" fill="#fff8ef" stroke="#790f24" strokeWidth="3" strokeLinecap="round" />
    </svg>
    <Bow />
  </div>
}
function SectionLabel({ children, id }) { return <h2 className="about-section-label" id={id}>{children}</h2> }
const bakeryLinks = [
  ['빵', '/menu/bread', '/images/member-cutouts/coupon-croissant.png'],
  ['샌드위치', '/menu/sandwich', '/images/wishlist-products/sandwich-1.png'],
  ['케이크', '/menu/cake', '/images/about/hero-desserts-v2.png'],
  ['음료', '/menu/drink', '/images/member-product-vanilla-latte.png'],
]

export default function About() {
  return <div className="about-page">
    <HomeHeader />
    <main className="about-main">
      <section className="about-hero" aria-labelledby="about-hero-title">
        <div className="about-hero-awning" aria-hidden="true">{Array.from({ length: 24 }, (_, i) => <span key={i} />)}</div>
        <div className="about-hero-inner"><Art name="hero-rabbit" /><div className="about-hero-copy"><BrandMark /><h1 id="about-hero-title">일상 속 달콤한 쉼표,<br /><span>MELLOW BAKE</span></h1></div><Art name="hero-desserts" /></div>
      </section>
      <div className="about-content">
        <div className="about-page-title"><span aria-hidden="true">♡</span><h2>브랜드 소개</h2><span aria-hidden="true">♡</span></div>
        <section className="about-story about-split" aria-labelledby="about-story-title"><Art name="story" /><div className="about-section-copy"><SectionLabel id="about-story-title">01. BRAND STORY</SectionLabel><h3>일상 속 달콤한 쉼표, MELLOW BAKE</h3><p>멜로우 베이크는 바쁜 일상 속에서도<br />작은 달콤함과 따뜻한 여유를 전하는 베이커리입니다.<br />갓 구운 빵의 향기처럼, 당신의 하루에 부드럽고 행복한 순간을 더하고자 합니다.</p></div></section>
        <Divider />
        <section className="about-philosophy" aria-labelledby="about-philosophy-title"><SectionLabel id="about-philosophy-title">02. OUR PHILOSOPHY</SectionLabel><div className="about-values">
          <article><Art name="ingredients" /><h3>좋은 재료</h3><p>신선하고 믿을 수 있는<br />재료만을 사용합니다.</p></article>
          <article><Art name="tools" /><h3>정성스러운 베이킹</h3><p>한결같은 마음으로<br />매일 정성껏 굽습니다.</p></article>
          <article><svg className="about-value-heart" viewBox="-4 -12 168 114" fill="none" aria-hidden="true"><path d="M80 85S26 52 29 27c3-29 40-28 51-5 11-23 48-24 51 5 3 25-51 58-51 58Z" stroke="#a71936" strokeWidth="4" /><path d="m128 6 8-11m3 22 14-5M20 62 9 69m16 4-5 11" stroke="#ce4662" strokeWidth="4" strokeLinecap="round" /></svg><h3>일상의 작은 행복</h3><p>달콤한 빵으로<br />일상에 특별한 순간을<br />선물합니다.</p></article>
        </div></section>
        <Divider />
        <section className="about-friends" aria-labelledby="about-friends-title"><SectionLabel id="about-friends-title">03. MELLOW FRIENDS</SectionLabel><div className="about-split"><div className="about-friends-cloud"><Art name="friends" /></div><div className="about-section-copy"><h3>멜로우 베이크의 마스코트, 토끼 제빵사 멜로우!</h3><p>빵을 사랑하는 귀여운 토끼 제빵사 '멜로우'와 함께<br />멜로우 베이크의 달콤한 이야기를 만들어가요.</p></div></div></section>
        <Divider />
        <section className="about-bakery" aria-labelledby="about-bakery-title"><SectionLabel id="about-bakery-title">04. OUR BAKERY</SectionLabel><div className="about-split"><Art name="bakery" /><div className="about-section-copy"><h3>멜로우 베이크의 대표 메뉴를 만나보세요!</h3><p>소금빵부터 시나몬롤, 케이크, 샌드위치까지<br />멜로우 베이크의 다양한 베이커리를 확인해보세요.</p><nav className="about-bakery-links" aria-label="대표 메뉴 바로가기">{bakeryLinks.map(([name, href, image]) => <a href={appHref(href)} key={name}><img src={assetHref(image)} alt="" /><span>{name}</span><b aria-hidden="true">›</b></a>)}</nav></div></div></section>
      </div>
      <section className="about-closing" aria-label="멜로우 베이크의 인사"><div className="about-closing-brand"><ClosingMark /></div><p><span aria-hidden="true">♥</span>“오늘도 당신의 하루가 조금 더 달콤해지길”<span aria-hidden="true">♥</span></p></section>
    </main>
    <HomeFooter variant="about" />
  </div>
}


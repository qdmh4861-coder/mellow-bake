import { useState } from 'react'
import './Home.css'
import HomeHeader from '../components/HomeHeader'
import HomeHero from '../components/HomeHero'
import BestMenu from '../components/BestMenu'
import NewMenu from '../components/NewMenu'
import WaveDivider from '../components/WaveDivider'
import SeasonalSpecial from '../components/SeasonalSpecial'
import NewArrivals from '../components/NewArrivals'
import OurStory from '../components/OurStory'
import HomeFooter from '../components/HomeFooter'
import footerReference from '../assets/6f75bae9-33f5-4119-96db-8ed342966903.png'
import FindYourSweet from '../components/FindYourSweet'
import matchaReview from '../assets/reviews/matcha-strawberry-roll.png'
import chocolateReview from '../assets/best-menu/chocolate-cake.png'
import strawberryReview from '../assets/reviews/strawberry-shortcake.png'
import peachReview from '../assets/reviews/peach-yogurt.png'
import storePhoto from '../assets/33d8952e-332b-433a-b667-64e49cd48144.png'
import storeReference from '../assets/a7e6ce60-d89a-43a1-ad52-723d90f7a14d.png'
import '../components/ReviewCards.css'
import reviewHeadingImage from '../assets/9025c738-0a99-4405-9733-74f6b116486c.png'


// Review copy, masked authors and dates are transcribed from the supplied design.
const customerReviews = [
  { id: 'matcha-strawberry-roll', product: '말차 딸기 롤케이크', text: '말차 향이 진하면서도 많이 쓰지 않아요! 안에 들어간 딸기도 상큼하고 크림이 부드러워서 정말 맛있었어요.', author: 'soo***', date: '2026-10-16' },
  { id: 'chocolate-cake', product: '초콜릿 케이크', text: '초콜릿 맛이 진하고 크림도 부드러워요! 너무 달지 않고 시트도 촉촉해서 집에서 커피랑 맛있게 먹었어요.', author: 'dsd***', date: '2026-10-12' },
  { id: 'strawberry-shortcake', product: '딸기 생크림 케이크', text: '생크림이 정말 부드럽고 많이 달지 않아요! 딸기도 신선하고 케이크 시트도 촉촉해서 집에서 커피랑 똑같이 먹었어요!', author: 'min***', date: '2026-10-08' },
  { id: 'peach-yogurt', product: '복숭아 요거트', text: '복숭아가 신선하고 상큼해서 맛있어요! 요거트 소스도 부드럽고 많이 달지 않아 집에서 디저트로 먹기 딱 좋았어요.', author: 'jiye***', date: '2026-10-04' },
]
const reviewImages = {
  'matcha-strawberry-roll': matchaReview,
  'chocolate-cake': chocolateReview,
  'strawberry-shortcake': strawberryReview,
  'peach-yogurt': peachReview,
}
function ReviewPhoto({ review }) {
  const [status, setStatus] = useState('loading')
  const source = reviewImages[review.id]

  return <div className="home-review-photo-area">
    <img className="home-review-photo" src={source} alt={review.product} loading="lazy" style={{ visibility: status === 'loaded' ? 'visible' : 'hidden' }} onLoad={() => setStatus('loaded')} onError={() => setStatus('error')} />
    {status !== 'loaded' && <div className="home-review-photo-placeholder" role="img" aria-label={`${review.product} 리뷰 사진 준비 중`}><svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="5" y="7" width="38" height="34" rx="6" /><circle cx="17" cy="18" r="4" /><path d="m6 35 12-11 8 8 7-7 9 10" /></svg><span>리뷰 사진 준비 중</span></div>}
  </div>
}
const storeDetails = { photoSrc: storePhoto, mapUrl: null, address: '서울특별시 관악구 남부순환로 1820', addressDetail: '101동 203호', hours: '매일 10:00 ~ 21:00', lastOrder: '20:30', closedDays: '연중무휴', phone: '010-1234-5678' }

function StorePhoto() {
  const [status, setStatus] = useState('loading')
  return <div className="visit-store-photo">
    {storeDetails.photoSrc && <img src={storeDetails.photoSrc} alt="MELLOW BAKE 매장 내부" loading="lazy" style={{ visibility: status === 'loaded' ? 'visible' : 'hidden' }} onLoad={() => setStatus('loaded')} onError={() => setStatus('error')} />}
    {(!storeDetails.photoSrc || status !== 'loaded') && <span>매장 사진 준비 중</span>}
  </div>
}

function StoreIcon({ type }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {type === 'pin' && <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>}
    {type === 'clock' && <><circle cx="12" cy="12" r="9" /><path d="M12 6v6l4 2" /></>}
    {type === 'phone' && <path d="m5 3 4 4-2 3c2 4 3 5 7 7l3-2 4 4-3 3C10 22 2 14 2 6l3-3Z" />}
  </svg>
}

function StoreOrnament({ type }) {
  return <svg className={`visit-store-ornament visit-store-ornament--${type}`} viewBox="0 0 80 80" fill="none" aria-hidden="true" strokeLinecap="round" strokeLinejoin="round">
    {type === 'heart' && <><path d="M40 67S7 46 11 25c4-19 24-15 29 0 11-19 34-13 30 7-3 17-30 35-30 35Z" fill="#ffb6d4" stroke="#fffaf5" strokeWidth="9" /><path d="M40 67S7 46 11 25c4-19 24-15 29 0 11-19 34-13 30 7-3 17-30 35-30 35Z" stroke="#f66b9d" strokeWidth="3" /><path d="m23 26-1 9" stroke="#fff" strokeWidth="5" /></>}
    {type === 'flower' && <><path d="M33 24C7 3 7 33 24 36 2 51 24 69 36 52c-2 26 28 22 20 0 24 7 26-24 3-25C72 4 40 1 33 24Z" fill="#fff7e7" stroke="#dca66d" strokeWidth="2.5" /><circle cx="42" cy="37" r="8" fill="#ffe077" /></>}
    {type === 'bunny' && <><path d="M21 33C0 3 22-7 29 21l8 11C38-2 64 0 58 25l-2 10c29 17 15 44-13 42C4 78-3 49 21 33Z" fill="#fff9f1" stroke="#ba906e" strokeWidth="3" /><path d="m19 13 6 17m25-15-3 15" stroke="#ffc2d5" strokeWidth="6" /><circle cx="25" cy="49" r="3" fill="#816047" /><circle cx="49" cy="49" r="3" fill="#816047" /><path d="m33 57 5 4 5-4" stroke="#816047" strokeWidth="3" /><ellipse cx="16" cy="58" rx="6" ry="4" fill="#ffbfd3" /><ellipse cx="59" cy="58" rx="6" ry="4" fill="#ffbfd3" /></>}
    {type === 'ribbon' && <><path d="M39 35C4-7 1 48 31 44L17 67l18-4 7-19 15 20 14-4-25-20C82 26 57-2 39 35Z" fill="#ffc4db" stroke="#b67a83" strokeWidth="2.5" /><path d="m22 27 14 12m17-16-9 15" stroke="#fff7f0" strokeWidth="3" /><circle cx="40" cy="39" r="7" fill="#ff9cbd" stroke="#b67a83" strokeWidth="2" /></>}
    {type === 'sparkle' && <><path d="M39 7c1 20-8 26-25 33 18 3 24 12 26 31 5-22 12-27 28-32C49 34 45 23 39 7Z" fill="#fff8af" stroke="#fff" strokeWidth="4" /><circle cx="10" cy="12" r="3" fill="#fff" /><circle cx="71" cy="69" r="3" fill="#fff" /></>}
    {type === 'curve' && <path d="M5 54C19 18 43 25 33 51 22 73 12 34 42 16c23-13 42 5 24 17-16 11-11-28 9-22" stroke="#ff9dc4" strokeWidth="4" />}
    {type === 'cherries' && <><path d="M24 44c23-10 22-22 25-36 6 19 13 26 13 41M49 8c14-5 23-1 22 10-12 3-18-2-22-10Z" stroke="#91a765" strokeWidth="3" fill="#c3d58a" /><circle cx="21" cy="53" r="14" fill="#f89eb4" stroke="#c9848e" strokeWidth="2" /><circle cx="59" cy="57" r="14" fill="#ffb8c9" stroke="#c9848e" strokeWidth="2" /><path d="m15 47-2 5m41 0-1 5" stroke="#fff5e9" strokeWidth="3" /></>}
    {type === 'bear' && <><circle cx="18" cy="24" r="13" fill="#fff4e4" stroke="#be946d" strokeWidth="3" /><circle cx="63" cy="24" r="13" fill="#fff4e4" stroke="#be946d" strokeWidth="3" /><ellipse cx="40" cy="46" rx="32" ry="27" fill="#fff8ed" stroke="#be946d" strokeWidth="3" /><circle cx="28" cy="42" r="3" fill="#805c45" /><circle cx="52" cy="42" r="3" fill="#805c45" /><path d="m36 51 4 3 4-3m-4 3v5" stroke="#805c45" strokeWidth="3" /><ellipse cx="19" cy="52" rx="6" ry="4" fill="#ffc4cc" /><ellipse cx="61" cy="52" rx="6" ry="4" fill="#ffc4cc" /></>}
  </svg>
}

function StoreDecorations({ side }) {
  const ornaments = side === 'left' ? ['heart', 'flower', 'bunny', 'ribbon', 'curve', 'sparkle'] : ['heart', 'ribbon', 'cherries', 'bear', 'flower', 'sparkle']
  return <div className={`visit-store-decorations visit-store-decorations--${side}`} aria-hidden="true">{ornaments.map(type => <StoreOrnament key={type} type={type} />)}</div>
}
function ImageSlot({ label, className = '' }) {
  return (
    <div className={`home-image-slot ${className}`} role="img" aria-label={`${label} 원본 이미지 필요`}>
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="6" y="8" width="36" height="32" rx="5" /><circle cx="17" cy="19" r="4" /><path d="m8 34 11-10 8 7 7-7 7 10" /></svg>
      <span>{label}</span><small>원본 이미지 필요</small>
    </div>
  )
}

function Decorations({ variant = '' }) {
  return <div className={`home-decorations ${variant}`} aria-hidden="true"><span>♡</span><span>✧</span><span>✿</span><span>♡</span><span>✧</span></div>
}

function SectionTitle({ eyebrow, children }) {
  return <div className="home-section-title"><span className="home-eyebrow">{eyebrow}</span><h2><span aria-hidden="true">♡</span> {children} <span aria-hidden="true">✧</span></h2><div className="home-title-scribble" aria-hidden="true" /></div>
}

function ProductSection({ id, title, eyebrow, theme, next }) {
  const backgrounds = { peach: '#ffb193', pink: '#ff83ad', yellow: '#fff4a9' }
  return (
    <section id={id} className={`home-section home-products home-products--${theme}`} aria-labelledby={`${id}-title`}>
      {id === 'best-menu' ? <BestMenu /> : id === 'new-menu' ? <NewMenu /> : id === 'new-arrivals' ? <NewArrivals /> : <>
      <Decorations />
      <div className="home-container">
        <div id={`${id}-title`}><SectionTitle eyebrow={eyebrow}>{title}</SectionTitle></div>
        <div className="home-product-grid">
          {[1, 2, 3, 4].map(number => <article className="home-product-card" key={number}>
            <span className="home-card-tag">{title === 'BEST MENU' ? `BEST ${String(number).padStart(2, '0')}` : 'NEW'}</span>
            <ImageSlot label={`${title} 상품 ${number}`} />
            <div className="home-product-copy"><h3>상품명 입력 예정</h3><p>상품 설명 원본 필요</p><span>가격 정보 입력 예정</span></div>
          </article>)}
        </div>
      </div>
      </>}
      <WaveDivider fromColor={backgrounds[theme]} toColor={next} />
    </section>
  )
}

export default function Home() {
  return (
    <div className="mellow-home" id="home">
      <HomeHeader />

      <main>
        <HomeHero />
        <FindYourSweet />

        <ProductSection id="best-menu" title="BEST MENU" eyebrow="OUR SWEET FAVORITES" theme="peach" next="#ff83ad" />
        <ProductSection id="new-menu" title="NEW MENU" eyebrow="SOMETHING NEW, SOMETHING SWEET" theme="pink" next="#a477c4" />

        <section className="home-section home-promo seasonal-special" aria-labelledby="home-promo-title">
          <SeasonalSpecial />
          <WaveDivider fromColor="#a477c4" toColor="#fff4a9" />
        </section>

        <ProductSection id="new-arrivals" title="NEW ARRIVALS" eyebrow="FRESH FROM MELLOW BAKE" theme="yellow" next="#ffc4ac" />

        <section id="our-story" className="home-section home-story" aria-labelledby="home-story-title">
          <OurStory />
          <WaveDivider fromColor="#ffc4ac" toColor="#ffa4cb" />
        </section>

        <section id="reviews" className="home-section home-reviews" aria-labelledby="home-review-title">
          <div className="home-container">
            <div className="home-review-heading">
              <h2 id="home-review-title" className="home-review-heading-art">
                <img src={reviewHeadingImage} width="2172" height="724" alt="CUSTOMER REVIEW — SWEET MOMENTS, HAPPY CUSTOMERS" />
              </h2>
            </div>
            <div className="home-review-grid">{customerReviews.map(review => {
              return <article className="home-review-card" key={review.id}>
                <ReviewPhoto review={review} />
                <div className="home-review-body"><div className="home-review-rating" aria-label="5점 만점에 5점"><svg viewBox="0 0 115 22" aria-hidden="true">{[0, 1, 2, 3, 4].map(star => <path key={star} transform={`translate(${star * 23} 0)`} d="m11 1 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z" fill="#ffc02e" />)}</svg><span>5.0</span></div><h3>{review.product}</h3><p>{review.text}</p><footer className="home-review-meta"><span><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="7" r="4" /><path d="M4 22v-2a8 8 0 0 1 16 0v2" /></svg>{review.author}</span><time dateTime={review.date}>{review.date.replaceAll('-', '.')}</time></footer></div>
              </article>
            })}</div>
          </div>
          <WaveDivider fromColor="#ffa4cb" toColor="#a2edec" />
        </section>

        <section id="visit" className="home-section home-visit" aria-labelledby="home-visit-title">
          <div className="visit-store-reference">
            <h2 id="home-visit-title" className="visit-store-reference-title">
              <img src={storeReference} width="1711" height="919" alt="VISIT OUR STORE — MELLOW BAKE. 달콤한 쉼표가 있는 공간. 향긋한 커피와 갓 구운 디저트가 있는 곳, 멜로우 베이크에서 달콤한 여유를 즐겨보세요." />
            </h2>
            <p className="visit-store-sr-only">{storeDetails.address}, {storeDetails.addressDetail}. 영업시간: {storeDetails.hours}. 라스트 오더: {storeDetails.lastOrder}. 휴무일: {storeDetails.closedDays}. 전화번호: {storeDetails.phone}.</p>
            {storeDetails.mapUrl
              ? <a className="visit-store-reference-map" href={storeDetails.mapUrl} aria-label="VIEW MAP — 지도 보기" />
              : <button className="visit-store-reference-map" type="button" disabled aria-label="VIEW MAP — 지도 정보 준비 중" />}
          </div>
          <WaveDivider fromColor="#adf3ef" toColor="#9a76c8" />
        </section>
      </main>

      <HomeFooter referenceImage={footerReference} />
    </div>
  )
}















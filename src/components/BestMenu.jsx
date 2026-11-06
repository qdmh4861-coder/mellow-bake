import { useState } from 'react'
import './BestMenu.css'

const originalPhotos = import.meta.glob('../assets/best-menu/*.{png,jpg,jpeg,webp}', {
  eager: true, query: '?url', import: 'default',
})
const products = [
  { id: 'strawberry-shortcake', badge: 'BEST', name: 'Strawberry Shortcake', koreanName: '딸기 생크림 케이크', description: '신선한 생딸기와 부드러운 생크림이 어우러진 클래식한 케이크', price: '7,500원' },
  { id: 'chocolate-cake', badge: 'BEST', name: 'Chocolate Cake', koreanName: '초콜릿 케이크', description: '진한 초콜릿과 부드러운 크림의 달콤한 조화', price: '6,900원' },
  { id: 'matcha-cake', badge: 'NEW', name: 'Matcha Cake', koreanName: '말차 케이크', description: '깊고 풍부한 말차와 부드러운 크림이 어우러진 케이크', price: '6,800원' },
  { id: 'strawberry-roll-cake', badge: 'BEST', name: 'Strawberry Roll Cake', koreanName: '딸기 롤케이크', description: '폭신한 시트에 부드러운 생크림과 달콤한 딸기를 가득 넣은 롤케이크', price: '6,300원' },
]

function Heart({ filled = false, className = '' }) {
  return <svg className={className} viewBox="0 0 40 40" fill={filled ? 'currentColor' : 'none'} aria-hidden="true"><path d="M20 34S3 23 3 13C3 3 16 2 20 11 24 2 37 3 37 13c0 10-17 21-17 21Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" /></svg>
}

function Crown() {
  return <svg className="best-menu-crown" viewBox="0 0 110 100" fill="none" aria-hidden="true"><path d="m20 79-7-45 30 18L56 15l17 35 28-20-10 50Z" fill="#ff946a" stroke="#fff" strokeWidth="11" strokeLinejoin="round" /><path d="m20 79-7-45 30 18L56 15l17 35 28-20-10 50Z" stroke="#82442b" strokeWidth="4" strokeLinejoin="round" /><g fill="#ffcdb0" stroke="#82442b" strokeWidth="3"><circle cx="12" cy="29" r="6" /><circle cx="56" cy="12" r="6" /><circle cx="103" cy="24" r="6" /></g></svg>
}

function BestMenuHeading() {
  return <div className="best-menu-heading">
    <p className="best-menu-eyebrow">OUR SWEET FAVORITES</p>
    <div className="best-menu-title-group"><Crown /><h2 id="best-menu-title">BEST MENU</h2><Heart className="best-menu-title-heart" filled /><span className="best-menu-title-sparkle" aria-hidden="true">✧</span><svg className="best-menu-scribble" viewBox="0 0 150 65" fill="none" aria-hidden="true"><path d="M3 52C30-5 72 16 58 51 44 78 28 15 83 7c39-8 51 18 34 27-23 9 7-51 30-10" stroke="#ff4c9a" strokeWidth="5" strokeLinecap="round" /></svg></div>
    <p className="best-menu-caption">지금 가장 사랑받는 메뉴예요!</p>
  </div>
}

function ProductPhoto({ product }) {
  const photo = Object.entries(originalPhotos).find(([path]) => path.split('/').pop().split('.')[0] === product.id)?.[1]
  return <div className="best-menu-photo">
    {photo ? <img src={photo} alt={product.koreanName} loading="lazy" /> : <div className="best-menu-photo-missing" role="img" aria-label={`${product.koreanName} 원본 이미지 필요`}><svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="5" y="7" width="38" height="34" rx="6" /><circle cx="17" cy="18" r="4" /><path d="m6 35 12-11 8 8 7-7 9 10" /></svg><span>원본 이미지 필요</span><small>{product.id}.png</small></div>}
  </div>
}

export default function BestMenu() {
  const [favorites, setFavorites] = useState([])
  function toggleFavorite(id) {
    setFavorites(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])
  }
  return <>
    <div className="best-menu-decorations" aria-hidden="true"><Heart className="best-menu-float-heart" /><span className="best-menu-float-sparkle">✧</span><span className="best-menu-float-flower">✿</span><Heart className="best-menu-bottom-heart" /></div>
    <div className="home-container best-menu-content">
      <BestMenuHeading />
      <div className="best-menu-grid">{products.map(product => <article className="best-menu-card" key={product.id}>
        <span className={`best-menu-badge${product.badge === 'NEW' ? ' best-menu-badge--new' : ''}`}>
          <svg viewBox="0 0 100 100" aria-hidden="true"><polygon points="50,3 62,12 78,8 83,24 97,30 91,47 98,60 83,70 82,87 64,88 51,98 37,89 21,94 17,77 3,69 9,52 3,38 18,27 20,12 37,13" /></svg>
          <span>{product.badge}</span>
        </span>
        <ProductPhoto product={product} />
        <div className="best-menu-card-copy"><h3>{product.name}</h3><p className="best-menu-korean-name">{product.koreanName}</p><p className="best-menu-description">{product.description}</p><div className="best-menu-card-bottom"><strong>{product.price}</strong><button type="button" aria-label={`${product.koreanName} 찜`} aria-pressed={favorites.includes(product.id)} onClick={() => toggleFavorite(product.id)}><Heart filled={favorites.includes(product.id)} /></button></div></div>
      </article>)}</div>
    </div>
  </>
}

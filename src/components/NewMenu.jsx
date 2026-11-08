import './NewMenu.css'
import headingImage from '../assets/d8b8cd4a-65eb-4e3a-b50e-66912d8dcbcf.png'

import { useState } from 'react'

const photos = import.meta.glob('../assets/new-menu/*.{png,jpg,jpeg,webp}', {
  eager: true, query: '?url', import: 'default',
})
const products = [
  { id: 'blueberry-cheesecake', badge: 'BEST', name: 'Blueberry Cheesecake', korean: '블루베리 치즈 케이크', description: '상큼한 블루베리와 고소한 크림치즈가 어우러진 케이크', price: '6,500원' },
  { id: 'tiramisu', badge: 'BEST', name: 'Tiramisu', korean: '티라미수', description: '진한 커피향과 부드러운 마스카포네 크림이 어우러진 디저트', price: '6,800원' },
  { id: 'lemon-tart', badge: 'NEW', name: 'Lemon Tart', korean: '레몬 타르트', description: '상큼한 레몬 크림과 바삭한 타르트가 어우러진 청량한 디저트', price: '6,500원' },
  { id: 'fruit-tart', badge: 'NEW', name: 'Fruit Tart', korean: '생과일 타르트', description: '신선한 제철 과일과 부드러운 크림을 가득 올린 상큼한 타르트', price: '7,200원' },
]

function Heading() {
  return <div className="new-menu-heading">
    <h2 id="new-menu-title" className="new-menu-heading-art">
      <img src={headingImage} width="2172" height="724" alt="NEW MENU — 오늘의 달콤한 신메뉴를 만나보세요!" />
    </h2>
  </div>
}
function Badge({ label }) {
  return <span className={`new-menu-badge${label === 'NEW' ? ' new-menu-badge--blue' : ''}`}><svg viewBox="0 0 100 100" aria-hidden="true"><polygon points="50,3 62,12 78,8 83,24 97,30 91,47 98,60 83,70 82,87 64,88 51,98 37,89 21,94 17,77 3,69 9,52 3,38 18,27 20,12 37,13" fill="currentColor" stroke="var(--badge-edge)" strokeWidth="3" strokeLinejoin="round" /></svg><svg className="new-menu-badge-ornament" viewBox="0 0 32 26" aria-hidden="true">{label === 'BEST' ? <><path d="m3 5 7 6 6-9 6 9 7-6-4 17H7Z" fill="#ffbd34" stroke="#ec9025" strokeWidth="1.5" /><path d="M8 18h16" fill="none" stroke="#fff6c7" strokeWidth="2" /></> : <path d="M16 1q1 10 12 12-11 1-12 12Q14 14 4 13 14 11 16 1Z" fill="#06a4d6" stroke="#fff" strokeWidth="1.5" />}</svg><span>{label}</span></span>
}

function RibbonDivider() {
  return <div className="new-menu-ribbon-divider" aria-hidden="true"><span /><svg viewBox="0 0 64 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M30 17C7-8 0 8 8 18c5 6 14 4 22-1Zm4 0C57-8 64 8 56 18c-5 6-14 4-22-1ZM30 20 18 35m16-15 12 15" /><ellipse cx="32" cy="18" rx="4" ry="5" /></svg><span /></div>
}

function Photo({ product }) {
  const source = Object.entries(photos).find(([path]) => path.split('/').pop().split('.')[0] === product.id)?.[1]
  return <div className="new-menu-photo">{source ? <img src={source} alt={product.korean} loading="lazy" /> : <div className="new-menu-photo-missing" role="img" aria-label={`${product.korean} 원본 이미지 필요`}><svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="5" y="7" width="38" height="34" rx="6" /><circle cx="17" cy="18" r="4" /><path d="m6 35 12-11 8 8 7-7 9 10" /></svg><span>원본 이미지 필요</span><small>{product.id}.png</small></div>}</div>
}

export default function NewMenu() {
  const [favorites, setFavorites] = useState([])
  function toggleFavorite(id) {
    setFavorites(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])
  }
  return <div className="home-container new-menu-content">
    <Heading />
    <div className="new-menu-grid">{products.map(product => <article className="new-menu-card" key={product.id}><Badge label={product.badge} /><Photo product={product} /><div className="new-menu-card-copy"><h3>{product.name}</h3><p className="new-menu-korean">{product.korean}</p><p className="new-menu-description">{product.description}</p><RibbonDivider /><div className="new-menu-card-bottom"><strong className="new-menu-price">{product.price}</strong><button className="new-menu-favorite" type="button" aria-label={`${product.korean} 찜`} aria-pressed={favorites.includes(product.id)} onClick={event => { event.stopPropagation(); toggleFavorite(product.id) }}><svg viewBox="0 0 40 40" fill={favorites.includes(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="3" strokeLinejoin="round" aria-hidden="true"><path d="M20 34S3 23 3 13C3 3 16 2 20 11 24 2 37 3 37 13c0 10-17 21-17 21Z" /></svg></button></div></div></article>)}</div>
  </div>
}


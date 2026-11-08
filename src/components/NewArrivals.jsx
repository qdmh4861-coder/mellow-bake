import './NewArrivals.css'
import headingImage from '../assets/new-arrivals-heading-transparent.png'

import { useState } from 'react'

const originalPhotos = import.meta.glob('../assets/new-arrivals/*.{png,jpg,jpeg,webp}', {
  eager: true, query: '?url', import: 'default',
})
const products = [
  { id: 'salted-caramel-financier', name: 'Salted Caramel Financier', korean: '솔티드 카라멜 휘낭시에', description: '고소한 버터 풍미에 달콤한 카라멜과 은은한 소금이 어우러진 휘낭시에', price: '3,800원' },
  { id: 'earl-grey-scone', name: 'Earl Grey Scone', korean: '얼그레이 스콘', description: '향긋한 얼그레이 향과 바삭한 식감이 어우러진 스콘', price: '3,500원' },
  { id: 'pistachio-cream-croissant', name: 'Pistachio Cream Croissant', korean: '피스타치오 크림 크루아상', description: '바삭한 크루아상에 고소한 피스타치오 크림을 가득 채운 디저트', price: '4,800원' },
  { id: 'peach-yogurt-mousse', name: 'Peach Yogurt Mousse', korean: '복숭아 요거트 무스', description: '상큼한 복숭아와 부드러운 요거트 무스가 어우러진 디저트', price: '4,500원' },
]

function Photo({ product }) {
  const source = Object.entries(originalPhotos).find(([path]) => path.split('/').pop().split('.')[0] === product.id)?.[1]
  return <div className="arrivals-photo">{source ? <img src={source} alt={product.korean} loading="lazy" /> : <div className="arrivals-photo-missing" role="img" aria-label={`${product.korean} 원본 이미지 필요`}><svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="5" y="7" width="38" height="34" rx="6" /><circle cx="17" cy="18" r="4" /><path d="m6 35 12-11 8 8 7-7 9 10" /></svg><span>원본 이미지 필요</span><small>{product.id}.png</small></div>}</div>
}

function Badge({ warm }) {
  return <span className={`arrivals-badge${warm ? ' arrivals-badge--warm' : ''}`}><svg viewBox="0 0 100 100" aria-hidden="true"><polygon points="50,3 62,12 78,8 83,24 97,30 91,47 98,60 83,70 82,87 64,88 51,98 37,89 21,94 17,77 3,69 9,52 3,38 18,27 20,12 37,13" fill="currentColor" stroke="var(--arrivals-badge-edge)" strokeWidth="3" strokeLinejoin="round" /></svg><span>NEW</span></span>
}

export default function NewArrivals() {
  const [favorites, setFavorites] = useState([])
  function toggleFavorite(id) {
    setFavorites(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])
  }
  return <div className="home-container arrivals-content">
    <div className="arrivals-heading arrivals-heading--image">
      <img id="new-arrivals-title" className="arrivals-heading-image" src={headingImage} width="2172" height="724" alt="NEW ARRIVALS — 새로운 시즌, 디저트를 만나보세요!" />
    </div>
    <div className="arrivals-grid">{products.map((product, index) => <article className="arrivals-card" key={product.id}><Badge warm={index === 3} /><Photo product={product} /><div className="arrivals-card-copy"><h3>{product.name}</h3><p className="arrivals-korean">{product.korean}</p><p className="arrivals-description">{product.description}</p><div className="arrivals-card-divider" aria-hidden="true"><span /><svg viewBox="0 0 64 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M30 17C7-8 0 8 8 18c5 6 14 4 22-1Zm4 0C57-8 64 8 56 18c-5 6-14 4-22-1ZM30 20 18 35m16-15 12 15" /><ellipse cx="32" cy="18" rx="4" ry="5" /></svg><span /></div><div className="arrivals-card-bottom"><strong className="arrivals-price">{product.price}</strong><button className="arrivals-favorite" type="button" aria-label={`${product.korean} 찜`} aria-pressed={favorites.includes(product.id)} onClick={event => { event.stopPropagation(); toggleFavorite(product.id) }}><svg viewBox="0 0 40 40" fill={favorites.includes(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="3" strokeLinejoin="round" aria-hidden="true"><path d="M20 34S3 23 3 13C3 3 16 2 20 11 24 2 37 3 37 13c0 10-17 21-17 21Z" /></svg></button></div></div></article>)}</div>
  </div>
}


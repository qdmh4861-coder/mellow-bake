import './NewArrivals.css'

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
  return <div className="home-container arrivals-content">
    <div className="arrivals-heading"><div className="arrivals-title-group"><svg className="arrivals-ribbon" viewBox="0 0 150 70" fill="none" aria-hidden="true"><path d="M4 55C35-5 82 13 57 58 33 92 28 18 83 7c57-8 51 48 23 33-23-15 10-48 41-15" stroke="#fffdf5" strokeWidth="11" strokeLinecap="round" /><path d="M4 55C35-5 82 13 57 58 33 92 28 18 83 7c57-8 51 48 23 33-23-15 10-48 41-15" stroke="#ff4c9a" strokeWidth="5" strokeLinecap="round" /></svg><svg className="arrivals-star" viewBox="0 0 50 50" fill="none" aria-hidden="true"><path d="m25 4 6 13 14 3-10 11 1 14-13-7-13 5 3-14L4 18l15-2Z" fill="#ffe56a" stroke="#fffdf5" strokeWidth="8" strokeLinejoin="round" /><path d="m25 4 6 13 14 3-10 11 1 14-13-7-13 5 3-14L4 18l15-2Z" stroke="#885136" strokeWidth="2.5" strokeLinejoin="round" /></svg><h2 id="new-arrivals-title">NEW ARRIVALS</h2><svg className="arrivals-heart" viewBox="0 0 45 48" fill="none" aria-hidden="true"><path d="M22 41S2 28 4 15C6 3 18 6 22 15 27 4 42 4 41 17 40 28 22 41 22 41Z" fill="#ff8ac0" stroke="#fffdf5" strokeWidth="8" strokeLinejoin="round" /><path d="M22 41S2 28 4 15C6 3 18 6 22 15 27 4 42 4 41 17 40 28 22 41 22 41Z" stroke="#f34b9d" strokeWidth="3" strokeLinejoin="round" /><path d="M11 13q-3 3-2 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></svg><svg className="arrivals-sparkle" viewBox="0 0 45 55" fill="none" aria-hidden="true"><path d="M22 5c0 13-4 19-16 23 12 2 16 8 16 21 3-13 6-19 17-21C28 24 25 18 22 5Z" fill="#fff0ce" stroke="#fffdf5" strokeWidth="8" strokeLinejoin="round" /><path d="M22 5c0 13-4 19-16 23 12 2 16 8 16 21 3-13 6-19 17-21C28 24 25 18 22 5Z" stroke="#ef78aa" strokeWidth="2.5" strokeLinejoin="round" /></svg></div><p className="arrivals-caption">새로운 시즌, 디저트를 만나보세요!</p></div>
    <div className="arrivals-grid">{products.map((product, index) => <article className="arrivals-card" key={product.id}><Badge warm={index === 3} /><Photo product={product} /><div className="arrivals-card-copy"><h3>{product.name}</h3><p className="arrivals-korean">{product.korean}</p><p className="arrivals-description">{product.description}</p><strong className="arrivals-price">{product.price}</strong></div></article>)}</div>
  </div>
}


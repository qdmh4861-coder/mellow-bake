import './NewMenu.css'

const photos = import.meta.glob('../assets/new-menu/*.{png,jpg,jpeg,webp}', {
  eager: true, query: '?url', import: 'default',
})
const products = [
  { id: 'blueberry-cheesecake', badge: 'BEST', name: 'Blueberry Cheesecake', korean: '블루베리 치즈 케이크', description: '상큼한 블루베리와 고소한 크림치즈가 어우러진 케이크', price: '6,500원' },
  { id: 'tiramisu', badge: 'BEST', name: 'Tiramisu', korean: '티라미수', description: '진한 커피향과 부드러운 마스카포네 크림이 어우러진 디저트', price: '6,800원' },
  { id: 'lemon-tart', badge: 'NEW', name: 'Lemon Tart', korean: '레몬 타르트', description: '상큼한 레몬 크림과 바삭한 타르트가 어우러진 청량한 디저트', price: '6,500원' },
  { id: 'fruit-tart', badge: 'NEW', name: 'Fruit Tart', korean: '생과일 타르트', description: '신선한 제철 과일과 부드러운 크림을 가득 올린 상큼한 타르트', price: '7,200원' },
]

function Heart({ className }) {
  return <svg className={className} viewBox="0 0 85 90" fill="none" aria-hidden="true"><path d="M40 78S-1 42 11 20C22 0 38 18 40 26c9-21 29-24 33-5 7 25-33 57-33 57Z" fill="#ff7cbb" stroke="#fff" strokeWidth="13" strokeLinejoin="round" /><path d="M40 78S-1 42 11 20C22 0 38 18 40 26c9-21 29-24 33-5 7 25-33 57-33 57Z" stroke="#f03999" strokeWidth="5" strokeLinejoin="round" /><path d="M20 24q-5 5-3 10" stroke="#fff" strokeWidth="5" strokeLinecap="round" /></svg>
}

function Heading() {
  return <div className="new-menu-heading">
    <div className="new-menu-title-group">
      <svg className="new-menu-scribble" viewBox="0 0 150 70" fill="none" aria-hidden="true"><path d="M4 55C35-5 82 13 57 58 33 92 28 18 83 7c57-8 51 48 23 33-23-15 10-48 41-15" stroke="#fff" strokeWidth="12" strokeLinecap="round" /><path d="M4 55C35-5 82 13 57 58 33 92 28 18 83 7c57-8 51 48 23 33-23-15 10-48 41-15" stroke="#f449a5" strokeWidth="5" strokeLinecap="round" /></svg>
      <h2 id="new-menu-title">NEW MENU</h2>
      <Heart className="new-menu-heart new-menu-heart--large" /><Heart className="new-menu-heart new-menu-heart--small" />
      <span className="new-menu-star" aria-hidden="true">✦</span><span className="new-menu-flower" aria-hidden="true">✿</span><span className="new-menu-sparkle" aria-hidden="true">✧</span>
    </div>
    <p className="new-menu-caption">새롭게 업데이트 되었어요!</p>
  </div>
}

function Badge({ label }) {
  return <span className={`new-menu-badge${label === 'NEW' ? ' new-menu-badge--blue' : ''}`}><svg viewBox="0 0 100 100" aria-hidden="true"><polygon points="50,3 62,12 78,8 83,24 97,30 91,47 98,60 83,70 82,87 64,88 51,98 37,89 21,94 17,77 3,69 9,52 3,38 18,27 20,12 37,13" fill="currentColor" stroke="var(--badge-edge)" strokeWidth="3" strokeLinejoin="round" /></svg><span>{label}</span></span>
}

function Photo({ product }) {
  const source = Object.entries(photos).find(([path]) => path.split('/').pop().split('.')[0] === product.id)?.[1]
  return <div className="new-menu-photo">{source ? <img src={source} alt={product.korean} loading="lazy" /> : <div className="new-menu-photo-missing" role="img" aria-label={`${product.korean} 원본 이미지 필요`}><svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="5" y="7" width="38" height="34" rx="6" /><circle cx="17" cy="18" r="4" /><path d="m6 35 12-11 8 8 7-7 9 10" /></svg><span>원본 이미지 필요</span><small>{product.id}.png</small></div>}</div>
}

export default function NewMenu() {
  return <div className="home-container new-menu-content">
    <Heading />
    <div className="new-menu-grid">{products.map(product => <article className="new-menu-card" key={product.id}><Badge label={product.badge} /><Photo product={product} /><div className="new-menu-card-copy"><h3>{product.name}</h3><p className="new-menu-korean">{product.korean}</p><p className="new-menu-description">{product.description}</p><strong className="new-menu-price">{product.price}</strong></div></article>)}</div>
  </div>
}


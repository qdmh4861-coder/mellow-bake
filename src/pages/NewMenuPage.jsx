import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import NewMenuProductImage from '../components/NewMenuProductImage'
import { seasonalProducts, newMenuReference } from '../newMenuCatalog'
import './NewMenuPage.css'

// Listing-only bounds around the available product photos, excluding reference labels.
// Individual originals can replace these via imageSrc without changing card layout.
const cardPhotoBoxes = [
  '210 389 225 104', '535 394 208 100', '855 395 230 99', '1220 389 205 105',
  '218 585 205 106', '535 597 210 94', '859 593 221 98', '1220 595 205 96',
  '208 790 224 98', '534 791 215 97', '926 791 168 97', '1225 789 201 99',
]

export default function NewMenuPage() {
  return <div className="seasonal-menu-page"><HomeHeader /><main className="seasonal-menu-main">
    <section className="seasonal-menu-banner" aria-labelledby="seasonal-banner-title"><div><span>NEW MENU</span><h1 id="seasonal-banner-title">New Menu</h1><p>멜로우베이크의 새로운 맛,<br />지금 만나보세요! ♡</p></div><svg viewBox="720 90 720 202" aria-hidden="true"><image href={newMenuReference} width="1584" height="993" /></svg></section>
    <header className="seasonal-menu-heading"><h2>✦ MELLOW BAKE NEW MENU <span>(신메뉴)</span> ✦</h2><p>이번에 새롭게 선보이는 멜로우베이크의 신메뉴를 소개합니다.</p></header>
    <div className="seasonal-menu-grid">{seasonalProducts.map((product, index) => <a className="seasonal-menu-card" href={product.detailHref} key={product.id} data-new-product-id={product.id}><span className="seasonal-menu-badge">NEW</span><div className="seasonal-menu-photo"><NewMenuProductImage product={product} photoBox={cardPhotoBoxes[index]} coverBadge={false} decorative /></div><div className="seasonal-menu-copy"><span>{product.categoryLabel}</span><h3>{product.koreanName}</h3><p>{product.description}</p><strong>₩ {product.price.toLocaleString('ko-KR')}</strong></div></a>)}</div>
  </main><HomeFooter /></div>
}

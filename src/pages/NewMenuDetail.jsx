import { useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import ProductHero from '../components/ProductHero'
import ProductDetailBody from '../components/ProductDetailBody'
import NewMenuProductImage from '../components/NewMenuProductImage'
import { seasonalProducts } from '../newMenuCatalog'
import { cartAddMessage } from '../cartStore'
import { useWishlist, toggleWishlist } from '../wishlistStore'
import './NewMenuPage.css'

const anchors = { introduction: '#product-introduction', ingredients: '#product-ingredients', storage: '#product-storage', reviews: '#product-reviews', related: '#product-recommendations', shipping: '#product-shipping' }
const renderPhoto = product => <NewMenuProductImage product={product} />
export default function NewMenuDetail({ id }) {
  const product = seasonalProducts.find(item => item.id === id)
  const [quantity, setQuantity] = useState(1)
  const [notice, setNotice] = useState('')
  const wishlist = useWishlist()
  if (!product) return <div className="seasonal-menu-page"><HomeHeader /><main className="seasonal-detail-main"><h1>상품을 찾을 수 없습니다</h1><a href="/new-menu">신메뉴 목록으로</a></main><HomeFooter /></div>
  const favorite = wishlist.some(item => item.id === product.id)
  function toggle() {
    try { toggleWishlist(product); setNotice(favorite ? '찜 목록에서 해제했습니다.' : '찜 목록에 추가했습니다.') }
    catch { setNotice('찜 목록을 저장하지 못했습니다. 브라우저 저장 공간을 확인해 주세요.') }
  }
  return <div className="seasonal-menu-page seasonal-detail-page"><HomeHeader /><main className="seasonal-detail-main"><a className="seasonal-detail-back" href="/new-menu">← NEW MENU 전체 보기</a>
    <ProductHero key={product.id} product={product} price={product.price} images={[{ id: product.id, label: product.koreanName, image: renderPhoto(product) }]} quantity={quantity} onQuantityChange={setQuantity} onCart={() => setNotice(cartAddMessage(product, quantity))} onBuy={() => setNotice('주문·결제 서비스 연결 준비 중입니다. 실제 주문이나 결제는 진행되지 않았습니다.')} notice={notice} anchors={anchors} options={<button className="seasonal-detail-favorite" type="button" aria-pressed={favorite} onClick={toggle}>{favorite ? '♥' : '♡'} {favorite ? '찜 해제' : '찜하기'}</button>} />
    <ProductDetailBody product={product} price={product.price} products={seasonalProducts} renderPhoto={renderPhoto} />
  </main><HomeFooter /></div>
}

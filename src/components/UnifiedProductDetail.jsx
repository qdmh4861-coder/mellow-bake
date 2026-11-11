import { appHref } from '../appRouting'
import { useState } from 'react'
import HomeHeader from './HomeHeader'
import ProductDetailFooter from './ProductDetailFooter'
import ProductHero from './ProductHero'
import ProductStoryBody from './ProductStoryBody'
import CatalogProductImage from './CatalogProductImage'
import { cartAddMessage, buyNow } from '../cartStore'
import { toggleWishlist, useWishlist } from '../wishlistStore'
import { useReviewUpdates } from '../reviewData'
import { galleryFor } from '../productArtwork'
import { detailImageArtwork } from '../productDetailImages'
import './UnifiedProductDetail.css'

const anchors = { introduction: '#product-introduction', ingredients: '#product-ingredients', storage: '#product-storage', reviews: '#product-reviews', related: '#product-recommendations', shipping: '#product-shipping' }
export default function UnifiedProductDetail({ product: source, products, options }) {
  const product = { ...source, koreanName: source.koreanName || source.korean, price: typeof source.price === 'number' ? source.price : Number(source.price.replace(/\D/g, '')) }
  const [quantity, setQuantity] = useState(1), [notice, setNotice] = useState('')
  const wishlist = useWishlist()
  useReviewUpdates()
  const favorite = wishlist.some(item => item.id === product.id)
  const gallery = galleryFor(product).map(item => ({ ...item, art: item.art || detailImageArtwork(product.id, ['feature','charm-1','charm-2','enjoy-1'][item.slot - 2]) }))
  const images = gallery.map(({ slot, art }) => ({ id: `${product.id}-${slot}`, label: `${product.koreanName} ${slot === 1 ? '대표 이미지' : `추가 이미지 ${slot}${art ? '' : ' 준비 중'}`}`, image: art?.generated ? <span className="unified-generated-gallery-art"><CatalogProductImage product={product} slot={slot} artwork={art} /></span> : <CatalogProductImage product={product} slot={slot} artwork={art} /> }))
  function toggle() {
    try { toggleWishlist(product); setNotice(favorite ? '찜 목록에서 해제했습니다.' : '찜 목록에 추가했습니다.') }
    catch { setNotice('찜 목록을 저장하지 못했습니다. 브라우저 저장 공간을 확인해 주세요.') }
  }
  return <div className="unified-detail-page" data-product-id={product.id}>
    <HomeHeader />
    <main className="unified-detail-main">
      <a className="unified-detail-back" href={appHref(product.id.startsWith('new-') ? '/new-menu' : '/menu')}>← 전체 메뉴</a>
      <ProductHero key={product.id} product={product} price={product.price} images={images} quantity={quantity} onQuantityChange={setQuantity} containImages
        onCart={() => setNotice(cartAddMessage(product, quantity, product.price))}
        onBuy={() => setNotice(buyNow(product, quantity, product.price))}
        notice={notice} anchors={anchors} options={<>{options}<button className="unified-detail-favorite" type="button" onClick={toggle} aria-pressed={favorite}>{favorite ? '♥ 찜 해제' : '♡ 찜하기'}</button></>} />
      <ProductStoryBody product={product} products={products} />
      <a className="unified-detail-back unified-detail-bottom-back" href={appHref(product.id.startsWith('new-') ? '/new-menu' : '/menu')}>전체 메뉴로 돌아가기</a>
    </main>
    <ProductDetailFooter />
  </div>
}

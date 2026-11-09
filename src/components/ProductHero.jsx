import { useId, useLayoutEffect, useRef, useState } from 'react'
import './ProductHero.css'
import { getProductReviews, reviewStats } from '../reviewData'

function FeatureIcon({ index }) {
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {index === 0 ? <><path d="M10 27 22 5M15 19C2 16 4 7 13 11c5 3 2 8 2 8Zm4-7c-5-9 3-15 6-7 2 5-6 7-6 7Zm-9 15C0 25 1 17 8 20c5 2 2 7 2 7Z" /></> : index === 1 ? <path d="M16 27S2 18 3 10c1-7 10-8 13-1 3-7 12-6 13 1 1 8-13 17-13 17Z" /> : <><path d="m4 10 12-7 12 7v13l-12 7-12-7V10Zm0 0 12 7 12-7M16 17v13M10 6l12 7v6" /></>}
  </svg>
}

// This component renders product photographs only; the reference screenshot is never rendered.
export default function ProductHero({ product, images, placeholder, price, quantity, onQuantityChange, onCart, onBuy, notice, options, anchors, emptyThumbnailSlots = false }) {
  const [selected, setSelected] = useState(0)
  const galleryRef = useRef(null)
  const dialogRef = useRef(null)
  const headingId = useId()
  const available = images.filter((item, index, all) => all.findIndex(other => other.id === item.id) === index).slice(0, 5)
  useLayoutEffect(() => {
    galleryRef.current?.querySelectorAll('svg[viewBox]').forEach(svg => svg.setAttribute('preserveAspectRatio', 'xMidYMid slice'))
  }, [images, selected])
  const stats = reviewStats(getProductReviews(product.id))
  const rating = stats.total ? stats.average : product.rating
  const reviewCount = stats.total ? stats.total : product.reviewCount
  const verifiedRating = typeof rating === 'number' && Number.isFinite(rating) && rating >= 0 && rating <= 5
  const features = [[anchors.introduction, '상품 소개'], [anchors.storage, '보관 안내'], [anchors.related, '추천 상품']]
  return <div className="catalog-product-header">
    <section className="catalog-product-header-grid" aria-labelledby={headingId}>
      <div className="catalog-product-gallery" ref={galleryRef}>
        <div className="catalog-product-thumbnails" role="group" aria-label={emptyThumbnailSlots ? '상품 이미지 준비 중' : '상품 이미지 선택'}>{emptyThumbnailSlots ? <div className="catalog-empty-thumbnail-slots" aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <span key={index} />)}</div> : available.map((item, index) => <button type="button" key={item.id} aria-label={item.label} aria-pressed={selected === index} onClick={() => setSelected(index)}>{item.image}</button>)}</div>
        <div className="catalog-product-main-image" aria-live="polite">{available[selected]?.image || available[0]?.image || placeholder}</div>
      </div>
      <div className="catalog-product-summary">
        <h1 id={headingId}>{product.koreanName}</h1>
        <p className="catalog-product-english">{product.name}</p>
        <p className="catalog-product-rating">{verifiedRating ? <><span>★ {rating.toFixed(1)}</span>{Number.isInteger(reviewCount) && reviewCount >= 0 && <> · 리뷰 {reviewCount.toLocaleString('ko-KR')}개</>}</> : '아직 등록된 평가가 없습니다'}</p>
        <p className="catalog-product-price">{price.toLocaleString('ko-KR')}원</p>
        <p className="catalog-product-description">{product.description}</p>
        {options && <div className="catalog-product-options">{options}</div>}
        <div className="catalog-product-quantity" role="group" aria-label="상품 수량">
          <button type="button" aria-label="수량 늘리기" disabled={quantity >= 99} onClick={() => onQuantityChange(quantity + 1)}>+</button>
          <output aria-live="polite">{quantity}</output>
          <button type="button" aria-label="수량 줄이기" disabled={quantity <= 1} onClick={() => onQuantityChange(quantity - 1)}>−</button>
        </div>
        <div className="catalog-product-actions"><button type="button" onClick={onCart}>장바구니 담기</button><button type="button" onClick={onBuy}>바로 구매하기</button></div>
        {notice && <p className="catalog-product-notice" role="status">{notice}</p>}
        <nav className="catalog-product-features" aria-label="상품 특징 안내">{features.map(([href, label], index) => <a href={href} key={href}><FeatureIcon index={index} /><span>{label}</span></a>)}</nav>
      </div>
    </section>
    <nav className="catalog-product-tabs" aria-label="상품 상세 메뉴"><a href={anchors.introduction}>상품정보</a><a href={anchors.ingredients}>원재료 및 영양정보</a><a href={anchors.reviews}>리뷰</a><button type="button" aria-haspopup="dialog" onClick={() => dialogRef.current?.showModal()}>Q&amp;A</button></nav>
    <dialog className="catalog-product-qa" ref={dialogRef} aria-label="상품 Q&A"><h2>상품 Q&amp;A</h2><p>아직 제공된 상품 문의 자료가 없습니다.<br />문의 등록 기능은 준비 중입니다.</p>{anchors.shipping && <a href={anchors.shipping} onClick={() => dialogRef.current?.close()}>상품 및 배송 안내 보기</a>}<form method="dialog"><button type="submit">닫기</button></form></dialog>
  </div>
}

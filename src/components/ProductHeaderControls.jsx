import { useRef } from 'react'
import './ProductHeaderControls.css'

export function ProductHeaderRating({ rating, reviewCount }) {
  const verified = typeof rating === 'number' && Number.isFinite(rating) && rating >= 0 && rating <= 5
  return <p className="detail-header-rating">{verified ? <><span className="detail-header-rating-value">★ {rating.toFixed(1)}</span>{Number.isInteger(reviewCount) && reviewCount >= 0 && <span> · 리뷰 {reviewCount.toLocaleString('ko-KR')}개</span>}</> : '아직 등록된 평가가 없습니다'}</p>
}

export default function ProductHeaderTabs({ introduction, ingredients, reviews, shipping }) {
  const dialogRef = useRef(null)
  return <div className="detail-header-controls">
    <nav className="detail-header-tabs" aria-label="상품 상세 메뉴">
      <a href={introduction}>상품정보</a><a href={ingredients}>원재료 및 영양정보</a><a href={reviews}>리뷰</a><button type="button" aria-haspopup="dialog" onClick={() => dialogRef.current?.showModal()}>Q&amp;A</button>
    </nav>
    <dialog ref={dialogRef} className="detail-header-qa" aria-label="상품 Q&A">
      <h2>상품 Q&amp;A</h2><p>아직 제공된 상품 문의 자료가 없습니다.<br />문의 등록 기능은 준비 중입니다.</p>
      {shipping && <a href={shipping} onClick={() => dialogRef.current?.close()}>상품 및 배송 안내 보기</a>}
      <form method="dialog"><button type="submit">닫기</button></form>
    </dialog>
  </div>
}

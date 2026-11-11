import MemberProductImage from '../components/MemberProductImage'
import { useLayoutEffect, useRef } from 'react'
import { MenuProductImage } from './OurMenu'
import { findReviewProduct } from '../reviewProducts'
import NewMenuProductImage from '../components/NewMenuProductImage'
import MyReviews from './MyReviews'
import PublicReviewCards from './PublicReviewCards'
import './Reviews.css'
const photos = import.meta.glob('../assets/{best-menu,new-menu,new-arrivals}/*.{png,jpg,jpeg,webp}', { eager:true, query:'?url', import:'default' })
const productFor = review => findReviewProduct(review.productId)
const productName = review => { const product = productFor(review); return product?.koreanName || product?.korean || '상품 정보 확인 중' }
function Stars({ rating }) {
  return <span className="reviews-stars" role="img" aria-label={rating === null ? '등록된 평가 없음' : `5점 만점에 ${rating.toFixed(1)}점`}><span aria-hidden="true">★★★★★</span><span className="reviews-stars-fill" aria-hidden="true" style={{ width: `${rating === null ? 0 : rating / 5 * 100}%` }}>★★★★★</span></span>
}
function ReviewProductPhoto({ review, contain = false }) {
  const ref = useRef(null)
  const product = productFor(review)
  const photo = Object.entries(photos).find(([path]) => path.split('/').at(-1).split('.')[0] === review.productId)?.[1]
  useLayoutEffect(() => { ref.current?.querySelectorAll('svg').forEach(svg => svg.setAttribute('preserveAspectRatio', contain ? 'xMidYMid meet' : 'xMidYMid slice')) }, [review.productId, contain])
  if (window.location.pathname === '/mypage/reviews') return <div className="reviews-product-photo"><MemberProductImage item={{ ...product, productId: review.productId }} /></div>
  return <div className="reviews-product-photo" ref={ref}>{product?.id.startsWith('new-') ? <NewMenuProductImage product={product} /> : photo ? <img src={photo} alt={productName(review)} loading="lazy" /> : product ? <MenuProductImage product={product} /> : <span>상품 사진 준비 중</span>}</div>
}


export default function Reviews(props) {
 return props.own ? <MyReviews Photo={ReviewProductPhoto} Stars={Stars} submissionResult={props.submissionResult} /> : <PublicReviewCards />
}

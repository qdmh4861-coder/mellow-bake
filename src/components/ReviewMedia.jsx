import { assetHref } from '../appRouting'
import { useState } from 'react'
import { findReviewProduct } from '../reviewProducts'
import { detailImageArtwork } from '../productDetailImages'
import { artworkFor } from '../productArtwork'
import CatalogProductImage from './CatalogProductImage'

export default function ReviewMedia({ review }) {
  const [failed, setFailed] = useState([])
  const excluded = Array.isArray(failed) ? failed : [failed]
  const photo = Array.isArray(review.photos) ? review.photos.find(src => typeof src === 'string' && src && !excluded.includes(src)) : null
  if (photo) return <img src={assetHref(photo)} alt={`${findReviewProduct(review.productId)?.koreanName || '상품'} ${review.isExample ? '시연용 예시 이미지' : '리뷰 첨부 사진'}`} style={{display:'block',width:'100%',height:'100%',minHeight:0,objectFit:'contain',aspectRatio:'auto'}} loading="lazy" onError={() => setFailed(previous => [...(Array.isArray(previous) ? previous : []),photo])} />
  const product = findReviewProduct(review.productId)
  if (!product) return <span>상품 이미지 확인이 필요합니다.</span>
  const basqueBoxes = ['89 812 123 77','231 900 132 82','88 994 127 84','58 369 205 88']
  const index = Math.max(0,['enjoy-1','enjoy-2','enjoy-3','charm-1'].indexOf(review.artPurpose))
  const box = basqueBoxes[index]
  const illustration = review.productId === 'cake-2' ? {kind:'region',src:'/images/바스크치즈.png',width:444,height:2046.15441176471,box,clip:box.split(' ').map(Number)} : detailImageArtwork(product.id,review.artPurpose || 'enjoy-1') || artworkFor(product)
  return <CatalogProductImage product={product} artwork={illustration} />
}

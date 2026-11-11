import { assetHref, appHref } from '../appRouting'
import { useId, useState } from 'react'
import { storyImageSlots } from '../productStoryContent'
import { customerContent } from '../productCustomerContent'
import { getDisplayProductReviews, reviewsHref, useReviewUpdates } from '../reviewData'
import ReviewMedia from './ReviewMedia'
import { productHref, productSlug } from '../pages/productLinks'
import CatalogProductImage from './CatalogProductImage'
import cakeArtwork from '../pages/cakeListArt.json'
import { detailImageArtwork } from '../productDetailImages'
import './ProductStoryBody.css'

function StoryImage({ product, purpose }) {
  const clipId = useId()
  const [failed, setFailed] = useState(null)
  const slot = storyImageSlots.find(([key]) => key === purpose)
  const artwork = detailImageArtwork(product.id, purpose)
  const source = artwork?.src
  return <div className="product-story-image" style={{ '--story-image-ratio': `${slot[2]} / ${slot[3]}` }} data-story-purpose={purpose} data-story-product={product.id}>
    {source && source !== failed ? artwork.kind === 'region' ? <svg viewBox={artwork.box} preserveAspectRatio="xMidYMid meet" role="img" aria-label={`${product.koreanName} ${slot[1]} 일러스트`}><defs><clipPath id={clipId}><rect x={artwork.clip[0]} y={artwork.clip[1]} width={artwork.clip[2]} height={artwork.clip[3]} /></clipPath></defs><image href={assetHref(source)} width={artwork.width} height={artwork.height} clipPath={`url(#${clipId})`} onError={() => setFailed(source)} /></svg> : <img src={assetHref(source)} alt={`${product.koreanName} ${slot[1]}`} loading="lazy" onError={() => setFailed(source)} /> : <div className="product-story-image-pending" role="img" aria-label={`${product.koreanName} ${slot[1]} 이미지 준비 중`}><svg viewBox="0 0 48 36" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><rect x="2" y="2" width="44" height="32" rx="6" /><circle cx="15" cy="12" r="4" /><path d="m3 28 12-11 10 9 7-7 13 13" /></svg><span>{slot[1]} 이미지 준비 중</span><small>이미지를 불러올 수 없습니다.</small></div>}
  </div>
}
function Title({ number, children }) {
  return <div className="product-story-title"><span>{number}</span><h2>{children}</h2></div>
}
export default function ProductStoryBody({ product, products }) {
  useReviewUpdates()
  const content = customerContent(product)
  const reviews = getDisplayProductReviews(product.id)
  const candidates = products.filter(p => productSlug(p.id) !== productSlug(product.id))
  const related = [...candidates.filter(p=>p.category===product.category), ...candidates.filter(p=>p.category!==product.category)].slice(0,4)
  return <div className="product-story-body">
    <section id="product-introduction" className="product-story-signature"><div><span className="product-story-wordmark">Mellow Bake ♡</span><h2>{content.signatureTitle}</h2><p>{content.signatureText}</p></div><StoryImage product={product} purpose="signature" /></section>
    <section className="product-story-feature"><StoryImage product={product} purpose="feature" /><div><Title number="01">{content.featureTitle}</Title><p>{content.featureText}</p></div></section>
    <section className="product-story-panel product-story-materials"><div><Title number="02">{content.materialsTitle}</Title><p>{content.materialsText}</p>{content.ingredients.length>0 && <ul>{content.ingredients.map(name=><li key={name}>{name}</li>)}</ul>}</div><StoryImage product={product} purpose="ingredients" /></section>
    <section id="product-process" className="product-story-panel"><Title number="03">{content.processTitle}</Title><div className="product-story-three">{content.process.map((step,i)=><article key={step.image}><StoryImage product={product} purpose={step.image} /><h3><span>0{i+1}</span> {step.title}</h3><p>{step.text}</p></article>)}</div></section>
    <section id="product-enjoy" className="product-story-panel"><Title number="04">더 맛있게 즐기는 방법</Title><div className="product-story-three">{content.enjoy.map((item,i)=><article key={item.title}><StoryImage product={product} purpose={`enjoy-${i+1}`} /><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>
    <section className="product-story-panel product-story-charms"><Title number="05">{product.koreanName}의 특별한 매력</Title>{content.charms.map((item,i)=><article className={i%2?'is-reverse':''} key={item.title}><StoryImage product={product} purpose={`charm-${i+1}`} /><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</section>
    <section id="product-ingredients" className="product-story-panel"><Title number="06">{product.koreanName}에 담긴 맛의 요소</Title><p>{content.materialsText}</p><StoryImage product={product} purpose="materials" /><div className="product-story-info"><h3>원재료 및 알레르기 안내</h3><dl><div><dt>원재료 / 함량</dt><dd>원재료명과 함량은 상품 표시사항을 확인해 주세요.</dd></div><div><dt>알레르기</dt><dd>알레르기가 있다면 상품 표시사항을 구매 전에 확인해 주세요.</dd></div><div><dt>영양정보</dt><dd>상품에 표시된 영양정보를 참고해 주세요.</dd></div></dl></div></section>
    <section id="product-storage" className="product-story-panel"><h2>보관 방법과 섭취 안내</h2><div className="product-story-three">{content.storage.map(([title,text],index)=><article className="product-story-storage-card" key={title}><StoryImage product={product} purpose={`storage-${index+1}`} /><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section id="product-shipping" className="product-story-panel"><h2>상품 정보 및 배송 안내</h2><div className="product-story-info-columns"><dl>{[['상품명',product.koreanName],['판매 가격',`${product.price.toLocaleString('ko-KR')}원`],['판매 단위 / 중량','상품 구성을 참고해 주세요.'],['소비기한','상품에 표시된 소비기한을 확인해 주세요.']].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><dl>{['배송 방법','배송 일정','배송비','교환 / 환불'].map(label=><div key={label}><dt>{label}</dt><dd>상품 문의로 안내받으실 수 있습니다.</dd></div>)}</dl></div></section>
    <section id="product-reviews" className="product-story-reviews"><div className="product-story-review-heading"><h2>상품 리뷰</h2><a href={appHref(reviewsHref(product.id))}>리뷰 {reviews.length}개 보기 →</a></div><p className="product-story-note">{reviews.some(review=>review.isExample)?'화면 시연용 예시 리뷰입니다. 실제 구매 후기가 아닙니다.':reviews.length?'이 상품에 등록된 공개 리뷰입니다.':'등록된 리뷰가 없습니다. 실제 후기가 등록되면 이곳에 표시합니다.'}</p><div className="product-story-four">{Array.from({length:4},(_,i)=>{const review=reviews[i];return <a key={review?.id||i} data-review-product={review?.productId} href={appHref(review?productHref(review.productId):undefined)}><span className="product-story-stars" aria-label={review?`${review.rating}점`:'등록된 평가 없음'}>{review?'★'.repeat(review.rating)+'☆'.repeat(5-review.rating):'☆☆☆☆☆'}</span><h3>{review?.title||'첫 리뷰를 기다리고 있어요'}</h3><p>{review?.body||'아직 작성된 구매 후기가 없습니다.'}</p>{review && <div style={{display:"block",height:130}}><ReviewMedia review={review} /></div>}<small>{review?.createdAt?.slice(0,10)||'리뷰 대기'}</small></a>})}</div></section>
    <section id="product-recommendations" className="product-story-related"><h2>함께 보면 좋은 상품</h2><div className="product-story-four">{related.map(item=><a href={appHref(productHref(item.id))} key={item.id}><div className="product-story-related-image"><CatalogProductImage product={item} artwork={item.id === 'cake-2' ? cakeArtwork['cake-2'] : undefined} /></div><h3>{item.koreanName}</h3><p>{item.price.toLocaleString('ko-KR')}원</p></a>)}</div></section>
  </div>
}

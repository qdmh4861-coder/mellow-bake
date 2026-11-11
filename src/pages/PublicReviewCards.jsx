import { appLocation, appHistory, appHref } from '../appRouting'
import { useRef, useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import ReviewMedia from '../components/ReviewMedia'
import { getDisplayPublicReviews, useReviewUpdates } from '../reviewData'
import { reviewProducts, findReviewProduct } from '../reviewProducts'
import { productHref, productSlug } from './productLinks'
import './PublicReviewCards.css'

const hasPhotos = review => Array.isArray(review.photos) && review.photos.some(src => typeof src === 'string' && src)
const timestamp = review => Date.parse(review.createdAt) || 0

export default function PublicReviewCards() {
  useReviewUpdates()
  const [productId,setProductId] = useState(()=>productSlug(new URLSearchParams(appLocation.search).get('productId') || ''))
  const [type,setType] = useState('all')
  const [sort,setSort] = useState('newest')
  const [page,setPage] = useState(1)
  const list = useRef(null)
  const source = getDisplayPublicReviews().filter(review=>!productId || productSlug(review.productId)===productId)
  const photoCount=source.filter(hasPhotos).length
  const filtered = source.filter(review=>type==='all' || (type==='photo'?hasPhotos(review):!hasPhotos(review))).sort((a,b)=>sort==='high'?b.rating-a.rating || timestamp(b)-timestamp(a):sort==='low'?a.rating-b.rating || timestamp(b)-timestamp(a):timestamp(b)-timestamp(a))
  const pages = Math.ceil(filtered.length/12), currentPage=Math.min(page,Math.max(1,pages))
  function selectProduct(value) {
    setProductId(value);setPage(1)
    const url=new URL(appLocation.href)
    if(value)url.searchParams.set('productId',value);else url.searchParams.delete('productId')
    appHistory.replaceState(null,'',url)
  }
  return <div className="reviews-page reviews-catalog-page"><HomeHeader /><main className="reviews-catalog-main">
    <header className="reviews-catalog-heading"><span>MELLOW BAKE</span><h1>REVIEW</h1><p>멜로우베이크의 달콤한 이야기를 만나보세요.</p></header>
    <p className="reviews-catalog-demo-note">‘시연용 예시’ 카드는 포트폴리오용 예시이며 실제 고객의 구매 후기가 아닙니다. 상품 연출 이미지가 포함될 수 있습니다. 작성한 리뷰는 기존 브라우저 저장 데이터를 사용합니다.</p>
    <div className="reviews-catalog-controls"><div role="group" aria-label="리뷰 종류">{[['all',`전체리뷰 (${source.length})`],['photo',`포토리뷰 (${photoCount})`],['text',`일반 리뷰 (${source.length-photoCount})`]].map(([id,label])=><button key={id} type="button" aria-pressed={type===id} onClick={()=>{setType(id);setPage(1)}}>{label}</button>)}</div><div className="reviews-catalog-selects"><label>상품<select aria-label="상품별 리뷰 필터" value={productId} onChange={e=>selectProduct(e.target.value)}><option value="">전체 상품</option>{reviewProducts.map(product=><option key={product.id} value={productSlug(product.id)}>{product.koreanName || product.korean}</option>)}</select></label><label>정렬<select aria-label="리뷰 정렬" value={sort} onChange={e=>{setSort(e.target.value);setPage(1)}}><option value="newest">최신순</option><option value="high">별점 높은순</option><option value="low">별점 낮은순</option></select></label></div></div>
    <p className="reviews-catalog-count" role="status">리뷰 {filtered.length}개{filtered.some(review=>review.isExample)?' · 시연용 예시 포함':''}</p>
    <section ref={list} aria-label="상품별 리뷰 목록">{filtered.length?<div className="reviews-catalog-grid">{filtered.slice((currentPage-1)*12,currentPage*12).map(review=>{
      const product=findReviewProduct(review.productId)
      const content=<><div className="reviews-catalog-photo"><ReviewMedia review={review} /></div><div className="reviews-catalog-card-body"><small className="reviews-catalog-badge">{review.isExample?'시연용 예시 · 상품 연출 이미지':review.isDemo?(hasPhotos(review)?'브라우저 데모 리뷰':'브라우저 데모 리뷰 · 상품 이미지'):(hasPhotos(review)?'작성한 리뷰':'작성한 리뷰 · 상품 이미지')}</small><span className="reviews-catalog-stars" role="img" aria-label={`5점 만점에 ${review.rating}점`}>{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}<small aria-hidden="true"> {review.rating}</small></span><p className="reviews-catalog-body">{review.body}</p><div className="reviews-catalog-meta"><strong>{review.nickname || '작성자'}</strong><time dateTime={review.createdAt}>{review.createdAt?.slice(0,10).replaceAll('-','.')}</time><span>{product?.koreanName || product?.korean || '상품 정보 확인 중'}</span></div></div></>
      return <article className="reviews-catalog-card" key={review.id} data-review-id={review.id} data-product-id={review.productId} data-rating={review.rating} data-date={review.createdAt}>{product?<a href={appHref(productHref(product.id))} aria-label={`${product.koreanName || product.korean} 상세페이지, ${review.nickname || '작성자'} 리뷰`}>{content}</a>:<div>{content}</div>}</article>
    })}</div>:<div className="reviews-catalog-empty">해당 조건의 리뷰가 없습니다.</div>}</section>
    {pages>0&&<nav className="reviews-catalog-pagination" aria-label="리뷰 페이지"><button type="button" disabled={currentPage===1} onClick={()=>{setPage(currentPage-1);list.current?.scrollIntoView({block:'start'})}}>이전</button>{Array.from({length:pages},(_,i)=>i+1).filter(n=>n===1||n===pages||Math.abs(n-currentPage)<=2).map((n,i,all)=><span key={n}>{i>0&&n-all[i-1]>1&&<span aria-hidden="true">…</span>}<button type="button" aria-current={n===currentPage?'page':undefined} onClick={()=>{setPage(n);list.current?.scrollIntoView({block:'start'})}}>{n}</button></span>)}<button type="button" disabled={currentPage===pages} onClick={()=>{setPage(currentPage+1);list.current?.scrollIntoView({block:'start'})}}>다음</button></nav>}
  </main><HomeFooter /></div>
}

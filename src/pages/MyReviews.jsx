import { assetHref, appHref } from '../appRouting'
import MemberCutout from '../components/MemberCutout'
import MemberDecoration from '../components/MemberDecoration'
import { useEffect, useRef, useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import MyPageSidebar from '../components/MyPageSidebar'
import ReviewSuccessDialog from '../components/ReviewSuccessDialog'
import { deleteDemoReview, getMyReviews, useReviewUpdates } from '../reviewData'
import { findReviewProduct } from '../reviewProducts'
import { productHref } from './productLinks'
import './MyReviews.css'

const images = review => Array.isArray(review.photos) ? review.photos.filter(src => typeof src === 'string' && src) : []
const name = review => { const p = findReviewProduct(review.productId); return p?.koreanName || p?.korean || '상품 정보 확인 중' }
const date = review => review.createdAt?.slice(0, 10).replaceAll('-', '.')
// Only decorative regions of the reference are used. Review/product photographs come from saved data.
function Art({ box, className = '' }) {
  const names = {
  "355 0 245 163": "review-bunny",
  "405 0 195 163": "review-bunny",
  "1280 15 160 150": "review-cupcake"
}
  return <MemberCutout name={names[box]} className={"my-reviews-art " + className} />
}
function Photo({ src, alt }) {
  const [broken, setBroken] = useState(false)
  return broken ? <span className="my-reviews-missing">사진을 불러올 수 없습니다</span> : <img src={assetHref(src)} alt={alt} onError={() => setBroken(true)} />
}
export default function MyReviews({ Photo: ProductPhoto, Stars, submissionResult }) {
  useReviewUpdates()
  const reviews = getMyReviews()
  const [filter, setFilter] = useState('all'), [sort, setSort] = useState('newest'), [page, setPage] = useState(1)
  const [detail, setDetail] = useState(null), [selectedPhoto, setSelectedPhoto] = useState(null), [deleting, setDeleting] = useState(null), [notice, setNotice] = useState('')
  const detailDialog = useRef(null), deleteDialog = useRef(null), feed = useRef(null)
  useEffect(() => { const element = deleting ? deleteDialog.current : detail ? detailDialog.current : null; if (!element) return; element.showModal(); const previous = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { element.close(); document.body.style.overflow = previous } }, [detail, deleting])
  const photoCount = reviews.filter(r => images(r).length).length
  const filtered = reviews.filter(r => filter === 'all' || (filter === 'photo' ? images(r).length > 0 : !images(r).length)).sort((a, b) => {
    const difference = (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0)
    return sort === 'oldest' ? -difference : sort === 'high' ? b.rating - a.rating || difference : sort === 'low' ? a.rating - b.rating || difference : difference
  })
  const pages = Math.ceil(filtered.length / 5), current = Math.min(page, Math.max(1, pages))
  const open = (review, src = null) => { setSelectedPhoto(src); setDetail(review) }
  const close = () => { setDetail(null); setSelectedPhoto(null) }
  function remove() {
    try { deleteDemoReview(deleting.id); if (detail?.id === deleting.id) close(); setDeleting(null); setNotice('리뷰를 삭제했습니다.') }
    catch (error) { setNotice(error.message); setDeleting(null) }
  }
  return <div className="mypage-page reviews-page my-reviews-page"><HomeHeader /><main className="mypage-layout"><MyPageSidebar /><div className="mypage-content my-reviews-content">
    <header className="my-reviews-banner"><Art box="355 0 245 163" /><div><span className="my-reviews-banner-stars" aria-hidden="true">★★★★★</span><h1>작성한 리뷰</h1><p>내가 작성한 상품 후기를 확인해 보세요.</p></div><Art box="1280 15 160 150" /></header>
    <div className="my-reviews-toolbar"><p>브라우저 저장 데모입니다. 실제 로그인 회원 서비스와 연동되지 않습니다.</p><a href={appHref("/reviews/write")}>✎ 리뷰 작성</a></div>
    <section className="my-reviews-feed" ref={feed} aria-label="내가 작성한 리뷰 목록"><div className="my-reviews-controls"><div role="group" aria-label="리뷰 종류">{[['all', `전체리뷰 (${reviews.length})`], ['photo', `포토리뷰 (${photoCount})`], ['text', `일반 리뷰 (${reviews.length - photoCount})`]].map(([id, text]) => <button type="button" key={id} aria-pressed={filter === id} onClick={() => { setFilter(id); setPage(1) }}>{text}</button>)}</div><select aria-label="리뷰 정렬" value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}><option value="newest">최신순</option><option value="oldest">오래된순</option><option value="high">별점 높은순</option><option value="low">별점 낮은순</option></select></div>
      <p role="status" className="my-reviews-notice">{notice}</p>
      <div className="my-reviews-cards">{filtered.slice((current - 1) * 5, current * 5).map(review => <article className="my-review-card" key={review.id} data-review-id={review.id}>
        <div className="my-review-product">{findReviewProduct(review.productId) ? <a href={appHref(productHref(review.productId))} aria-label={`${name(review)} 상품 상세`}><ProductPhoto review={review} contain /></a> : <ProductPhoto review={review} contain />}<div><strong>{name(review)}{Number.isFinite(review.quantity) && review.quantity > 0 ? ` (${review.quantity}개)` : ''}</strong><div className="my-review-rating"><Stars rating={review.rating} /><b>{review.rating.toFixed(1)}</b></div><time dateTime={review.createdAt}>{date(review)}</time></div></div>
        <button type="button" className="my-review-copy" onClick={() => open(review)} aria-label={`${review.title} 리뷰 상세보기`}><h2>{review.title}</h2><p>{review.body}</p></button>
        <div className="my-review-photos">{images(review).slice(0, images(review).length > 2 ? 2 : 3).map((src, i) => <button type="button" key={i} onClick={() => open(review, src)} aria-label={`첨부 사진 ${i + 1} 확대`}><Photo src={assetHref(src)} alt={`리뷰 첨부 사진 ${i + 1}`} /></button>)}{images(review).length > 2 && <button type="button" onClick={() => open(review, images(review)[2])} aria-label={`추가 사진 ${images(review).length - 2}개 보기`}>+{images(review).length - 2}</button>}</div>
        <div className="my-review-actions"><a href={appHref(`/reviews/write?reviewId=${encodeURIComponent(review.id)}`)}>✎ 수정</a><button type="button" onClick={() => setDeleting(review)}><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7" /></svg> 삭제</button></div>
      </article>)}</div>
      {!filtered.length && <div className="my-reviews-empty"><Art box="405 0 195 163" /><h2>{reviews.length ? '해당하는 리뷰가 없습니다' : '아직 작성한 리뷰가 없어요!'}</h2><p>맛있게 드신 상품의 후기를 남겨 주세요.</p><a href={appHref("/reviews/write")}>리뷰 작성하기</a></div>}
      {pages > 0 && <nav className="my-reviews-pagination" aria-label="리뷰 페이지">{[['prev', '‹', current - 1], ...Array.from({ length: pages }, (_, i) => [i + 1, i + 1, i + 1]), ['next', '›', current + 1]].map(([key, label, target]) => <button type="button" key={key} disabled={target < 1 || target > pages} aria-label={key === 'prev' ? '이전 페이지' : key === 'next' ? '다음 페이지' : `${label}페이지`} aria-current={key === current ? 'page' : undefined} onClick={() => { setPage(target); feed.current?.scrollIntoView({ block: 'start' }) }}>{label}</button>)}</nav>}
    </section>
    <MemberDecoration variant="reviews" />
  </div></main>
    <dialog className="my-reviews-dialog" ref={detailDialog} onCancel={e => { e.preventDefault(); close() }} aria-label="리뷰 상세보기"><button className="my-reviews-close" type="button" onClick={close} aria-label="닫기">×</button>{detail && <><div className="my-review-detail-product"><ProductPhoto review={detail} contain /><div><h2>{name(detail)}</h2><Stars rating={detail.rating} /> {detail.rating.toFixed(1)}<p>{date(detail)}</p></div></div><h3>{detail.title}</h3><p className="my-review-full-body">{detail.body}</p>{selectedPhoto && <div className="my-review-enlarged"><Photo key={selectedPhoto} src={assetHref(selectedPhoto)} alt="선택한 리뷰 사진 확대" /></div>}<div className="my-review-detail-photos">{images(detail).map((src, i) => <button key={i} type="button" onClick={() => setSelectedPhoto(src)} aria-label={`첨부 사진 ${i + 1} 확대`}><Photo src={assetHref(src)} alt={`첨부 사진 ${i + 1}`} /></button>)}</div><p>{detail.tags?.join(' · ')}</p><div className="my-review-actions"><a href={appHref(`/reviews/write?reviewId=${encodeURIComponent(detail.id)}`)}>수정</a><button type="button" onClick={() => setDeleting(detail)}>삭제</button><button type="button" onClick={close}>목록으로</button></div></>}</dialog>
    <dialog className="my-reviews-dialog my-reviews-delete" ref={deleteDialog} onCancel={e => { e.preventDefault(); setDeleting(null) }} aria-labelledby="my-review-delete-title"><h2 id="my-review-delete-title">리뷰를 삭제하시겠습니까?</h2><p>삭제한 리뷰는 복구할 수 없습니다.</p><div className="my-review-actions"><button type="button" onClick={() => setDeleting(null)}>취소</button><button type="button" onClick={remove}>삭제하기</button></div></dialog>
    <ReviewSuccessDialog result={submissionResult} /><HomeFooter /></div>
}

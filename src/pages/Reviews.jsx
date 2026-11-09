import { useLayoutEffect, useRef, useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import MyPageSidebar from '../components/MyPageSidebar'
import ReviewSuccessDialog from '../components/ReviewSuccessDialog'
import { MenuProductImage } from './OurMenu'
import { bestProducts } from '../components/BestMenu'
import { newMenuProducts } from '../components/NewMenu'
import { newArrivalProducts } from '../components/NewArrivals'
import { productHref } from './productLinks'
import { getPublicReviews, getProductReviews, getMyReviews, getCurrentReviewUser, reviewStats } from '../reviewData'
import './MyPage.css'
import './Reviews.css'
import { useReviewUpdates, deleteDemoReview } from '../reviewData'
import { findReviewProduct } from '../reviewProducts'
import NewMenuProductImage from '../components/NewMenuProductImage'

const photos = import.meta.glob('../assets/{best-menu,new-menu,new-arrivals}/*.{png,jpg,jpeg,webp}', { eager: true, query: '?url', import: 'default' })
const examplePhoto = name => Object.entries(photos).find(([path]) => path.split('/').at(-1).split('.')[0] === name)?.[1]
// Portfolio examples for this public screen only; never saved as member reviews.
const exampleReviews = [
  ['strawberry-shortcake', '달콤한하루', '딸기와 크림이 잘 어울려요. 부드러운 케이크와 함께 기분 좋은 티타임을 즐겼어요.', '상큼해요'],
  ['chocolate-cake', '초코좋아', '진한 초콜릿 맛이 커피와 잘 어울려요. 촉촉한 식감도 마음에 들어요.', '커피와 잘 어울려요'],
  ['matcha-cake', '초록티타임', '말차의 향과 부드러운 크림의 조화가 좋아요. 차와 함께 즐기기 좋은 메뉴예요.', '부드러워요'],
  ['strawberry-roll-cake', '빵순이', '폭신한 시트에 크림이 부드러워요. 딸기와 함께 먹으니 더 맛있었어요.', '폭신해요'],
  ['fruit-tart', '오늘도디저트', '과일이 올라간 타르트라 보기에도 예뻐요. 달콤한 디저트가 생각날 때 좋아요.', '달콤해요'],
  ['tiramisu', '커피한잔', '커피 향과 크림의 조화가 마음에 들어요. 여유로운 오후에 즐기기 좋았어요.', '커피와 잘 어울려요'],
  ['strawberry-shortcake', '베리베리', '딸기 케이크로 달콤한 시간을 보냈어요. 다음에도 다시 즐기고 싶은 메뉴예요.', '또 먹고 싶어요'],
  ['chocolate-cake', '디저트산책', '초콜릿의 풍미가 느껴지는 케이크예요. 한 조각으로도 기분 좋은 디저트 시간이었어요.', '진한 맛이에요'],
  ['matcha-cake', '녹차라떼', '말차 디저트를 좋아해서 골랐어요. 부드러운 크림과 함께 먹기 좋았어요.', '부드러워요'],
  ['strawberry-roll-cake', '달콤한쉼표', '가볍게 즐기기 좋은 롤케이크예요. 딸기와 크림이 잘 어울렸어요.', '폭신해요'],
].map(([productId, nickname, body, tag], index) => ({
  id: `example-review-${index + 1}`, productId, authorId: `example-author-${index + 1}`,
  nickname, body, tags: [tag], rating: index === 9 ? 4 : 5,
  createdAt: `2026-11-${String(9 - Math.floor(index / 2)).padStart(2, '0')}`,
  photos: index < 6 && examplePhoto(productId) ? [examplePhoto(productId)] : [], isExample: true,
}))
const photoUrls = review => Array.isArray(review.photos) ? review.photos.filter(url => typeof url === 'string' && url.length) : []
const productFor = review => findReviewProduct(review.productId)
const productName = review => { const product = productFor(review); return product?.koreanName || product?.korean || '상품 정보 확인 중' }
function Stars({ rating }) {
  return <span className="reviews-stars" role="img" aria-label={rating === null ? '등록된 평가 없음' : `5점 만점에 ${rating.toFixed(1)}점`}><span aria-hidden="true">★★★★★</span><span className="reviews-stars-fill" aria-hidden="true" style={{ width: `${rating === null ? 0 : rating / 5 * 100}%` }}>★★★★★</span></span>
}
function ReviewProductPhoto({ review }) {
  const ref = useRef(null)
  const product = productFor(review)
  const photo = Object.entries(photos).find(([path]) => path.split('/').at(-1).split('.')[0] === review.productId)?.[1]
  useLayoutEffect(() => { ref.current?.querySelectorAll('svg').forEach(svg => svg.setAttribute('preserveAspectRatio', 'xMidYMid slice')) }, [review.productId])
  return <div className="reviews-product-photo" ref={ref}>{product?.id.startsWith('new-') ? <NewMenuProductImage product={product} /> : photo ? <img src={photo} alt={productName(review)} loading="lazy" /> : product ? <MenuProductImage product={product} /> : <span>상품 사진 준비 중</span>}</div>
}

function ReviewFeed({ reviews, own, onOpen }) {
  const deleteDialog = useRef(null)
  const [toDelete, setToDelete] = useState(null)
  function requestDelete(review) { setToDelete(review); deleteDialog.current?.showModal() }
  function confirmDelete() {
    try { deleteDemoReview(toDelete.id); deleteDialog.current?.close(); setToDelete(null); setNotice('리뷰를 삭제했습니다.') }
    catch (error) { setNotice(`삭제하지 못했습니다. ${error.message}`); deleteDialog.current?.close() }
  }
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState('')
  const listRef = useRef(null)
  const user = getCurrentReviewUser()
  const photoCount = reviews.filter(review => photoUrls(review).length > 0).length
  const filtered = reviews.filter(review => filter === 'all' || (filter === 'photo' ? photoUrls(review).length > 0 : photoUrls(review).length === 0)).sort((a, b) => {
    const date = (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0)
    return sort === 'high' ? b.rating - a.rating || date : sort === 'low' ? a.rating - b.rating || date : date
  })
  const pageCount = Math.ceil(filtered.length / 5)
  const currentPage = Math.min(page, Math.max(1, pageCount))
  function go(next) {
    if (next < 1 || next > pageCount) return
    setPage(next)
    listRef.current?.scrollIntoView({ block: 'start' })
  }
  return <section className="reviews-feed" ref={listRef} aria-label={own ? '내가 작성한 리뷰 목록' : '전체 고객 리뷰 목록'}>
    <div className="reviews-feed-controls"><div className="reviews-filter-tabs" role="group" aria-label="리뷰 종류">{[['all', `전체리뷰 (${reviews.length})`], ['photo', `포토리뷰 (${photoCount})`], ['text', `일반 리뷰 (${reviews.length - photoCount})`]].map(([id, label]) => <button type="button" key={id} aria-pressed={filter === id} onClick={() => { setFilter(id); setPage(1) }}>{label}</button>)}</div><select aria-label="리뷰 정렬" value={sort} onChange={event => { setSort(event.target.value); setPage(1) }}><option value="newest">최신순</option><option value="high">별점 높은순</option><option value="low">별점 낮은순</option></select></div>
    <p className="reviews-notice" role="status">{notice}</p>
    {filtered.length ? <div>{filtered.slice((currentPage - 1) * 5, currentPage * 5).map(review => <article className="reviews-row" key={review.id} data-review-id={review.id}><div className="reviews-avatar" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="8" r="4" /><path d="M4 22v-2a8 8 0 0 1 16 0v2" /></svg></div><div className="reviews-row-content"><div className="reviews-author"><strong>{review.nickname || '작성자'}</strong><Stars rating={review.rating} /><time dateTime={review.createdAt}>{review.createdAt?.slice(0, 10).replaceAll('-', '.')}</time></div><h3 className="reviews-row-title">{review.title}</h3><p className="reviews-body">{review.body}</p><div className="reviews-row-photos">{!review.isExample && photoUrls(review).map((src, index) => <button type="button" key={index} aria-label={`첨부 사진 ${index + 1} 확대`} onClick={() => onOpen(review, src)}><img src={src} alt={`리뷰 사진 ${index + 1}`} loading="lazy" /></button>)}</div><div className="reviews-tags">{[productName(review), ...(Array.isArray(review.tags) ? review.tags : [])].map((tag, index) => <span key={`${tag}-${index}`}>{tag}</span>)}</div><div className="reviews-row-actions">{own && user?.id === review.authorId ? <><button type="button" onClick={() => onOpen(review)}>상세보기</button><a href={`/reviews/write?reviewId=${encodeURIComponent(review.id)}`}>수정</a><button type="button" onClick={() => requestDelete(review)}>삭제</button></> : <button type="button" onClick={() => setNotice('도움이 돼요 기능은 준비 중입니다.')}>도움이 돼요 ♧</button>}</div></div><div className="reviews-product">{productFor(review) ? <a href={productHref(review.productId)}><ReviewProductPhoto review={review} /><span>{productName(review)}</span></a> : <ReviewProductPhoto review={review} />}</div></article>)}</div> : <div className="reviews-empty"><p>{own ? '아직 작성한 리뷰가 없습니다' : '아직 등록된 리뷰가 없습니다'}</p></div>}
    {pageCount > 0 && <nav className="reviews-pagination" aria-label="리뷰 페이지"><button type="button" aria-label="이전 페이지" disabled={currentPage === 1} onClick={() => go(currentPage - 1)}>‹</button>{Array.from({ length: pageCount }, (_, index) => <button type="button" key={index} aria-label={`${index + 1}페이지`} aria-current={currentPage === index + 1 ? 'page' : undefined} onClick={() => go(index + 1)}>{index + 1}</button>)}<button type="button" aria-label="다음 페이지" disabled={currentPage === pageCount} onClick={() => go(currentPage + 1)}>›</button></nav>}
    <dialog className="reviews-delete-dialog" ref={deleteDialog} aria-labelledby="review-delete-title"><h2 id="review-delete-title">리뷰를 삭제하시겠습니까?</h2><p>삭제한 리뷰는 되돌릴 수 없습니다.</p><div><button type="button" onClick={() => deleteDialog.current?.close()}>취소</button><button type="button" onClick={confirmDelete}>삭제</button></div></dialog>
  </section>
}

export default function Reviews({ own = false, submissionResult = null }) {
  useReviewUpdates()
  const productId = new URLSearchParams(window.location.search).get('productId')
  const actualReviews = own ? getMyReviews() : productId ? getProductReviews(productId) : getPublicReviews()
  const showExamples = !own && actualReviews.length === 0
  const reviews = showExamples ? exampleReviews.filter(review => !productId || review.productId === productId) : actualReviews
  const summary = reviewStats(reviews)
  const photoReviews = reviews.flatMap(review => photoUrls(review).map(src => ({ review, src })))
  const dialog = useRef(null)
  const [opened, setOpened] = useState(null)
  function open(review, src = photoUrls(review)[0]) { setOpened({ review, src }); dialog.current?.showModal() }
  return <div className={`reviews-page${own ? ' mypage-page reviews-own-page' : ''}`}>
    <HomeHeader />
    <main className={own ? 'mypage-layout' : 'reviews-main'}>
      {own && <MyPageSidebar />}
      <div className={own ? 'mypage-content reviews-own-content' : 'reviews-content'}>
        <header className="reviews-heading"><span>MELLOW BAKE</span><h1>{own ? '작성한 리뷰' : 'REVIEW'}</h1><p>{own ? '내가 작성한 상품 후기를 확인해 보세요' : '멜로우베이크를 경험한 고객들의 달콤한 이야기'}</p></header>
        {(own || actualReviews.some(review => review.isDemo)) && <div className="reviews-own-toolbar"><p>브라우저 저장 데모입니다. 실제 로그인 회원 서비스와 연동되지 않습니다.</p>{own && <a href="/reviews/write">리뷰 작성</a>}</div>}
        {showExamples && <p style={{ textAlign: 'center', fontSize: 12, color: '#a46e5b', marginTop: 20 }}>디자인 확인용 예시 리뷰입니다. 실제 고객 후기가 아닙니다.</p>}
        {!own && <><section className="reviews-summary" aria-label="전체 리뷰 평점 요약"><div className="reviews-average"><h2>전체 평점</h2><strong>{summary.average === null ? '—' : summary.average.toFixed(1)}</strong><Stars rating={summary.average} /><p>전체 리뷰 {summary.total}개</p></div><div className="reviews-distribution">{summary.distribution.map(item => <div key={item.rating}><span>{item.rating}점</span><meter min="0" max="100" value={item.percent} aria-label={`${item.rating}점 ${item.count}개, ${Math.round(item.percent)}퍼센트`} /><span>{Math.round(item.percent)}%</span><small>{item.count}개</small></div>)}</div><div className="reviews-summary-photos"><h2>고객 포토 리뷰</h2>{photoReviews.length ? <div>{photoReviews.slice(0, 4).map(({ review, src }, index) => <button type="button" key={`${review.id}-${index}`} onClick={() => open(review, src)} aria-label={`${productName(review)} 리뷰 사진 확대`}><img src={src} alt={`${productName(review)} 고객 리뷰 사진`} loading="lazy" /></button>)}</div> : <p>등록된 포토 리뷰가 없습니다</p>}</div></section><section className="reviews-photo-section" aria-labelledby="reviews-photo-title"><div><h2 id="reviews-photo-title">고객 포토 리뷰</h2>{photoReviews.length > 6 && <button type="button" onClick={() => document.querySelector('.reviews-feed')?.scrollIntoView({ block: 'start' })}>더보기 &gt;</button>}</div>{photoReviews.length ? <div className="reviews-photo-strip">{photoReviews.slice(0, 6).map(({ review, src }, index) => <button type="button" key={`${review.id}-${index}`} onClick={() => open(review, src)} aria-label={`${productName(review)} 리뷰 사진 확대`}><img src={src} alt={`${productName(review)} 고객 리뷰 사진`} loading="lazy" /></button>)}</div> : <div className="reviews-photo-empty">아직 등록된 고객 사진이 없습니다</div>}</section></>}
        <ReviewFeed key={`${own}-${productId || ''}`} reviews={reviews} own={own} onOpen={open} />
      </div>
    </main>
    <dialog className="reviews-photo-dialog" ref={dialog} aria-label="리뷰 상세 보기"><button className="reviews-dialog-close" type="button" aria-label="리뷰 상세 닫기" onClick={() => dialog.current?.close()}>×</button>{opened && <>{opened.src && <img src={opened.src} alt={`${productName(opened.review)} 리뷰 사진 확대`} />}<Stars rating={opened.review.rating} /><h3>{opened.review.title}</h3><p>{opened.review.body}</p>{productFor(opened.review) && <a href={productHref(opened.review.productId)}>{productName(opened.review)} 상세 보기</a>}</>}</dialog>
    <ReviewSuccessDialog result={submissionResult} />
    <HomeFooter />
  </div>
}

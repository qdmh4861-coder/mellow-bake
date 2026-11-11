import WishlistProductImage from '../components/WishlistProductImage'
import { useEffect, useRef, useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import WishlistCartSuccess from '../components/WishlistCartSuccess'
import wishlistBannerLeft from '../assets/wishlist-banner-left.png'
import wishlistBannerRight from '../assets/wishlist-banner-right.png'
import { menuCategories } from './OurMenu'
import { productHref, productSlug } from './productLinks'
import { useWishlist, toggleWishlist, removeWishlistItems } from '../wishlistStore'
import { addToCart } from '../cartStore'
import './Wishlist.css'
import { registeredProducts } from '../productCatalog'

const PAGE_SIZE = 12
const products = menuCategories.flatMap(category => category.products)
const catalog = registeredProducts
const money = value => `${value.toLocaleString('ko-KR')}원`
function priceNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) && value >= 0 ? value : null
  if (typeof value !== 'string' || !/\d/.test(value)) return null
  const price = Number(value.replace(/[^\d.]/g, ''))
  return Number.isFinite(price) && price >= 0 ? price : null
}
function resolveWishlistItem(saved) {
  const product = catalog.find(item => item.id === saved.id) || catalog.find(item => productSlug(item.id) === saved.id)
  const price = priceNumber(product?.price ?? saved.price)
  return {
    ...saved,
    catalogId: product?.id || saved.id,
    name: product?.name || saved.name,
    koreanName: product?.koreanName || product?.korean || saved.koreanName || saved.korean || '상품 정보 확인 중',
    description: product?.description || saved.description || '기존 상품 정보를 확인 중입니다.',
    price,
    canOrder: price !== null && Boolean(product || saved.koreanName || saved.korean),
    href: product ? productHref(product.id) : null,
  }
}

function WishlistPhoto({ item }) { return <WishlistProductImage item={item} /> }
function Heart({ filled = true }) { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21S2 14.5 2 7.5C2 1 10 1 12 6c2-5 10-5 10 1.5C22 14.5 12 21 12 21Z" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" /></svg> }

export default function Wishlist() {
  const savedItems = useWishlist()
  const previewSetting = new URLSearchParams(window.location.search).get('preview')
  const [preview] = useState(() => previewSetting === '1' || (previewSetting !== '0' && savedItems.length === 0))
  const [dismissedExamples, setDismissedExamples] = useState([])
  const items = (preview ? products.slice(0, PAGE_SIZE).filter(item => !dismissedExamples.includes(item.id)) : savedItems).map(resolveWishlistItem)
  const [selectedIds, setSelectedIds] = useState([])
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState('')
  const [cartSuccess, setCartSuccess] = useState(false)
  const cartBusy = useRef(false)
  const allCheckbox = useRef(null)
  const selected = items.filter(item => selectedIds.includes(item.id))
  const pageCount = Math.ceil(items.length / PAGE_SIZE)
  const currentPage = Math.min(page, Math.max(1, pageCount))
  const visibleItems = items.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  useEffect(() => {
    if (allCheckbox.current) allCheckbox.current.indeterminate = false
  }, [selected.length, items.length])
  function act(action, message = '') {
    try { action(); setNotice(message) }
    catch { setNotice('변경 내용을 저장하지 못했습니다. 브라우저 저장 공간 설정을 확인해 주세요.') }
  }
  function select(id, checked) { setSelectedIds(ids => checked ? [...new Set([...ids, id])] : ids.filter(value => value !== id)) }
  function changePage(next) {
    if (next < 1 || next > pageCount) return
    setPage(next)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  function addSelectedToCart() {
    if (selected.some(item => !item.canOrder)) { setNotice('상품 정보가 확인되지 않은 항목이 있습니다. 해당 상품을 선택 해제한 뒤 다시 시도해 주세요.'); return }
    act(() => { selected.forEach(item => addToCart({ ...item, id: item.catalogId }, 1)); setSelectedIds([]) }, `선택한 상품 ${selected.length}종을 장바구니에 담았습니다.`)
  }
  function isFavorite(item) { return savedItems.some(saved => saved.id === item.id || saved.id === item.catalogId) }
  function addCardToCart(item) {
    if (cartBusy.current) return
    cartBusy.current = true
    try {
      if (!item.canOrder || !catalog.some(product => product.id === item.catalogId)) throw new Error('Unknown product')
      addToCart({ ...item, id: item.catalogId }, 1)
      setNotice('')
      setCartSuccess(true)
    } catch {
      cartBusy.current = false
      setNotice('장바구니에 담지 못했습니다. 상품 정보와 브라우저 저장 공간 설정을 확인해 주세요.')
    }
  }
  function closeCartSuccess() {
    setCartSuccess(false)
    cartBusy.current = false
  }
  function toggleHeart(item) {
    const saved = savedItems.find(saved => saved.id === item.id || saved.id === item.catalogId)
    act(() => toggleWishlist({ ...item, id: saved?.id || item.catalogId }), `${item.koreanName}을 찜 목록에 ${saved ? '해제' : '추가'}했습니다.`)
  }
  function deleteSelected() {
    act(() => {
      removeWishlistItems(selected.map(item => item.id))
      if (preview) setDismissedExamples(ids => [...new Set([...ids, ...selected.map(item => item.id)])])
      setSelectedIds([])
    }, '선택한 상품을 찜 목록에서 삭제했습니다.')
  }
  function buy(item) {
    act(() => {
      addToCart({ ...item, id: item.catalogId }, 1)
      window.location.assign('/cart')
    })
  }
  return <div className="wishlist-page">
    <HomeHeader />
    <main className="wishlist-main">
      <section className="wishlist-banner" aria-labelledby="wishlist-heading">
        <svg className="wishlist-banner-bow" viewBox="0 0 100 40" fill="none" aria-hidden="true"><path d="M49 22C24-3 13 8 24 20c7 7 17 6 25 2Zm2 0C76-3 87 8 76 20c-7 7-17 6-25 2Z" fill="#fb923c" stroke="#ea580c" strokeWidth="2" /><path d="m47 25-12 11m18-11 12 11" stroke="#f97316" strokeWidth="5" /><rect x="45" y="17" width="10" height="11" rx="4" fill="#f97316" stroke="#ea580c" strokeWidth="2" /></svg>
        <img className="wishlist-banner-art wishlist-banner-art--left" src={wishlistBannerLeft} alt="" />
        <div className="wishlist-banner-copy"><h1 id="wishlist-heading"><span className="wishlist-banner-heart" aria-hidden="true"><Heart filled={false} /></span>{preview ? '찜 목록 미리보기' : '찜 목록'}<span className="wishlist-banner-heart" aria-hidden="true"><Heart filled={false} /></span></h1>
          <svg className="wishlist-banner-underline" viewBox="0 0 400 22" fill="none" aria-hidden="true"><path d="M10 16Q160-5 390 13M23 20Q190 4 370 16" stroke="#F97316" strokeWidth="5" strokeLinecap="round" /></svg>
          <p className="wishlist-intro">{preview ? '하트를 눌러 찜하고, 장바구니에 상품을 담아보세요.' : '마음에 드는 상품을 한눈에 확인해 보세요'}</p>
        </div>
        <img className="wishlist-banner-art wishlist-banner-art--right" src={wishlistBannerRight} alt="" />
      </section>
      <div className="wishlist-toolbar"><h2>{preview ? '전체상품' : '찜한 상품'}({items.length}개)</h2><div><button type="button" disabled={!selected.length} onClick={deleteSelected}>선택 삭제</button><button type="button" disabled={!selected.length} onClick={addSelectedToCart}>장바구니 담기</button><label><input ref={allCheckbox} type="checkbox" disabled={!items.length} checked={items.length > 0 && selected.length === items.length} onChange={event => setSelectedIds(event.target.checked ? items.map(item => item.id) : [])} />전체 선택</label></div></div>
      <p className="wishlist-notice" role="status">{notice}</p>
      {items.length ? <div className="wishlist-grid">{visibleItems.map(item => <article className="wishlist-card" key={item.id} data-wishlist-id={item.id}>
        <div className="wishlist-card-selection"><input className="wishlist-item-select" type="checkbox" aria-label={`${item.koreanName} 선택`} checked={selectedIds.includes(item.id)} onChange={event => select(item.id, event.target.checked)} /></div>
        <div className="wishlist-image-wrap">{item.href ? <a href={item.href} aria-label={`${item.koreanName} 상세 보기`}><WishlistPhoto item={item} /></a> : <WishlistPhoto item={item} />}</div>
        <p className="wishlist-english-name">{item.href ? <a href={item.href}>{item.name}</a> : item.name}</p>
        <div className="wishlist-card-title"><h3>{item.href ? <a href={item.href}>{item.koreanName}</a> : item.koreanName}</h3><button className="wishlist-heart" type="button" aria-pressed={isFavorite(item)} aria-label={`${item.koreanName} 찜 ${isFavorite(item) ? '해제' : '추가'}`} onClick={() => toggleHeart(item)}><Heart filled={isFavorite(item)} /></button></div>
        <strong className="wishlist-price">{item.price === null ? '가격 확인 중' : money(item.price)}</strong><p className="wishlist-description">{item.description}</p>
        <div className="wishlist-card-actions"><button type="button" disabled={!item.canOrder} onClick={() => addCardToCart(item)}>장바구니 담기</button><button type="button" disabled={!item.canOrder} onClick={() => buy(item)}>바로 구매</button></div>
      </article>)}</div> : <section className="wishlist-empty"><Heart /><h2>아직 찜한 상품이 없습니다</h2><p>상품의 하트를 눌러 마음에 드는 메뉴를 모아 보세요.</p><a href="/">상품 둘러보기</a></section>}
      {pageCount > 0 && <nav className="wishlist-pagination" aria-label="찜 목록 페이지"><button type="button" aria-label="이전 페이지" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>‹</button>{Array.from({ length: pageCount }, (_, index) => <button type="button" key={index + 1} aria-label={`${index + 1}페이지`} aria-current={currentPage === index + 1 ? 'page' : undefined} onClick={() => changePage(index + 1)}>{index + 1}</button>)}<button type="button" aria-label="다음 페이지" disabled={currentPage === pageCount} onClick={() => changePage(currentPage + 1)}>›</button></nav>}
      <div className="wishlist-bottom-slot" />
    </main>
    <HomeFooter />
    <WishlistCartSuccess open={cartSuccess} onClose={closeCartSuccess} />
  </div>
}




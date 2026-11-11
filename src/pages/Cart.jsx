import { appLocation, assetHref, appHref } from '../appRouting'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import { menuCategories, MenuProductImage } from './OurMenu'
import { productHref } from './productLinks'
import { useCart, initializeCartOnce, setCartQuantity, selectCartItem, selectAllCartItems, removeCartItems, clearCart } from '../cartStore'
import './Cart.css'
import { seasonalProducts } from '../newMenuCatalog'
import NewMenuProductImage from '../components/NewMenuProductImage'
import CatalogProductImage from '../components/CatalogProductImage'
import { artworkFor, protectedProductIds } from '../productArtwork'
import { createPortfolioOrderPreview } from '../portfolioOrderPreview'
import { orderDetailHref } from '../orderData'

const products = menuCategories.flatMap(category => category.products)
const initialItems = [['bread-1', 2], ['bread-7', 1], ['sandwich-5', 1]].map(([id, quantity]) => ({ product: products.find(item => item.id === id), quantity })).filter(item => item.product)
const recommendations = ['cake-1', 'bread-6', 'bread-7', 'drink-3'].map(id => products.find(item => item.id === id)).filter(Boolean)
const photos = import.meta.glob('../assets/{best-menu,new-menu,new-arrivals}/*.png', { eager: true, query: '?url', import: 'default' })
const money = value => `${value.toLocaleString('ko-KR')}원`

function CartPhoto({ item }) {
  const photoRef = useRef(null)
  useLayoutEffect(() => {
    photoRef.current?.querySelectorAll('svg').forEach(svg => {
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
      const box = svg.viewBox.baseVal
      if (box.width > 0 && box.height > 0) svg.style.setProperty('--cart-art-ratio', `${box.width} / ${box.height}`)
    })
  }, [item.id])
  const registered = products.find(product => product.id === item.id)
  const photo = Object.entries(photos).find(([path]) => path.split('/').at(-1) === `${item.id}.png`)?.[1]
  if (!protectedProductIds.has(item.id) && artworkFor(item)) return <div className="cart-product-image" ref={photoRef}><CatalogProductImage product={item} /></div>
  return <div className="cart-product-image" ref={photoRef}>{seasonalProducts.some(product => product.id === item.id) ? <NewMenuProductImage product={seasonalProducts.find(product => product.id === item.id)} /> : registered ? <MenuProductImage product={registered} /> : photo ? <img src={assetHref(photo)} alt={item.koreanName} /> : <span className="cart-photo-pending">상품 이미지 준비 중</span>}</div>
}

function CartBow() {
  return <svg className="cart-bow" viewBox="0 0 120 48" fill="none" aria-hidden="true"><path d="M58 25C30-5 5 7 21 24c10 10 26 8 37 1Zm4 0C90-5 115 7 99 24c-10 10-26 8-37 1Z" fill="#FF93BF" stroke="#F50070" strokeWidth="3" /><path d="m55 30-17 15 20-6 2-9 2 9 20 6-17-15" fill="#FF69A5" stroke="#F50070" strokeWidth="2" /><rect x="54" y="19" width="12" height="15" rx="5" fill="#FF69A5" stroke="#F50070" strokeWidth="3" /></svg>
}

export default function Cart() {
  const items = useCart()
  const [notice, setNotice] = useState('')
  const [deletion, setDeletion] = useState(null)
  const deleteDialog = useRef(null)
  const allCheckbox = useRef(null)
  const selected = items.filter(item => item.selected)
  const subtotal = selected.reduce((sum, item) => sum + item.price * item.quantity, 0)
  useEffect(() => {
    try { initializeCartOnce(initialItems) }
    catch { setNotice('초기 상품을 저장하지 못했습니다. 브라우저 저장 공간 설정을 확인해 주세요.') }
  }, [])
  useEffect(() => {
    if (allCheckbox.current) allCheckbox.current.indeterminate = false
  }, [selected.length, items.length])
  useEffect(() => {
    if (!deletion) return
    const dialog = deleteDialog.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog?.showModal()
    return () => { dialog?.close(); document.body.style.overflow = previousOverflow }
  }, [deletion])

  function act(action, message = '') {
    try { action(); setNotice(message) }
    catch { setNotice('변경 내용을 저장하지 못했습니다. 브라우저 저장 공간 설정을 확인해 주세요.') }
  }

  function previewOrder() {
    if (!selected.length) { setNotice('주문할 상품을 먼저 선택해 주세요.'); return }
    try { appLocation.assign(orderDetailHref(createPortfolioOrderPreview(selected))) }
    catch { setNotice('시연용 주문 확인을 준비하지 못했습니다. 상품 정보와 브라우저 저장 공간을 확인해 주세요.') }
  }

  return <div className="cart-page">
    <HomeHeader />
    <section className="cart-banner" aria-labelledby="cart-title">
      <div className="cart-banner-inner">
        <div className="cart-banner-copy"><p className="cart-breadcrumb"><a href={appHref("/")}>Home</a> &gt; Cart</p><div className="cart-title-wrap"><span className="cart-title-heart" aria-hidden="true">♡</span><h1 id="cart-title"><svg className="cart-title-hat" viewBox="-4 -4 88 66" aria-hidden="true"><path d="M17 39C-2 38 1 12 22 13 24-4 54-3 58 13c21-4 26 25 5 27v17H17V39Z" fill="#FFFDF8" stroke="#713B2A" strokeWidth="3" /><path d="M18 46h44" stroke="#FF69A5" strokeWidth="4" /></svg>Cart</h1><span className="cart-title-heart" aria-hidden="true">♡</span><CartBow /></div><p className="cart-banner-caption">좋아하는 빵을 담아, 더 달콤한 하루를 만들어보세요♡</p></div>
        <svg className="cart-banner-art" viewBox="1255 235 355 190" preserveAspectRatio="xMaxYMax meet" aria-hidden="true"><defs><clipPath id="cart-banner-character" clipPathUnits="userSpaceOnUse"><rect x="1255" y="235" width="355" height="190" /></clipPath></defs><image href={assetHref("/images/장바구니.png")} width="1632" height="2155" clipPath="url(#cart-banner-character)" /></svg>
      </div>
    </section>
    <main className="cart-main">
      <div className="cart-layout">
        <section className="cart-items" aria-label="장바구니 상품 목록">
          <div className="cart-list-toolbar">
            <label><input ref={allCheckbox} type="checkbox" checked={items.length > 0 && selected.length === items.length} disabled={!items.length} onChange={event => act(() => selectAllCartItems(event.target.checked))} />전체 선택 ({selected.length}/{items.length})</label>
            <div><button disabled={!selected.length} onClick={() => setDeletion({ all:false, ids:selected.map(item => item.id) })}>선택 삭제</button><button disabled={!items.length} onClick={() => setDeletion({ all:true, ids:items.map(item => item.id) })}>전체 삭제</button></div>
          </div>
          {items.length ? <>
            <div className="cart-column-head" aria-hidden="true"><span>상품 정보</span><span>가격</span><span>수량</span><span>합계</span></div>
            <ul className="cart-product-list">{items.map(item => <li className="cart-row" key={item.id} data-cart-id={item.id}>
              <input type="checkbox" aria-label={`${item.koreanName} 선택`} checked={item.selected} onChange={event => act(() => selectCartItem(item.id, event.target.checked))} />
              <a className="cart-row-product" href={appHref(productHref(item.id))}><div className="cart-row-photo"><CartPhoto item={item} /></div><div><h2>{item.koreanName}</h2><p>{item.description}</p><span>기본 구성</span></div></a>
              <strong className="cart-unit-price">{money(item.price)}</strong>
              <div className="cart-quantity" role="group" aria-label={`${item.koreanName} 수량`}><button aria-label={`${item.koreanName} 수량 줄이기`} disabled={item.quantity <= 1} onClick={() => act(() => setCartQuantity(item.id, item.quantity - 1))}>−</button><output aria-live="polite">{item.quantity}</output><button aria-label={`${item.koreanName} 수량 늘리기`} onClick={() => act(() => setCartQuantity(item.id, item.quantity + 1))}>+</button></div>
              <strong className="cart-line-total">{money(item.price * item.quantity)}</strong>
              <button className="cart-remove" aria-label={`${item.koreanName} 삭제`} onClick={() => act(() => removeCartItems([item.id]), `${item.koreanName}을 삭제했습니다.`)}>×</button>
            </li>)}</ul>
          </> : <div className="cart-empty"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 8h6l5 24h23l4-17H13M18 33l-2 6h23" /><circle cx="20" cy="43" r="2" /><circle cx="36" cy="43" r="2" /></svg><h2>장바구니가 비어 있어요</h2><p>좋아하는 빵을 담아 달콤한 순간을 준비해 보세요.</p><a href={appHref("/menu")}>메뉴 둘러보기</a></div>}
        </section>
        <aside className="cart-summary" aria-labelledby="cart-summary-title">
          <h2 id="cart-summary-title"><CartBow /><span aria-hidden="true">♡</span> 주문 금액 <span aria-hidden="true">♡</span></h2>
          <dl><div><dt>선택 상품 금액</dt><dd data-cart-subtotal>{money(subtotal)}</dd></div><div><dt>배송비</dt><dd>정책 확인 필요</dd></div></dl>
          <dl className="cart-discounts"><div><dt>쿠폰 할인</dt><dd>준비 중</dd></div><div><dt>적립 예정 포인트</dt><dd>정책 확인 중</dd></div></dl>
          <div className="cart-total"><span>상품 기준 예상 금액</span><strong>{money(subtotal)}</strong></div>
          <p className="cart-policy-note">배송비와 할인은 미포함입니다. 운영 정책 확인 후 최종 결제 금액을 안내합니다.</p>
          <button className="cart-order" onClick={previewOrder}><span aria-hidden="true">✦</span><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M2 5h5l4 17h15l3-12H8M12 22l-1 4h15" /><circle cx="13" cy="29" r="1" /><circle cx="25" cy="29" r="1" /></svg>주문하기 ›<span aria-hidden="true">✦</span></button>
          <a className="cart-continue" href={appHref("/menu")}>계속 쇼핑하기</a>
        </aside>
      </div>
      <p className="cart-notice" role="status">{notice}</p>
      <section className="cart-recommendations" aria-labelledby="cart-related-title"><div className="cart-related-heading"><h2 id="cart-related-title">함께 보면 좋은 메뉴</h2><p>멜로우 베이크가 추천하는 달콤한 메뉴를 만나보세요.</p><span aria-hidden="true">♡ ✧</span></div><div className="cart-related-grid">{recommendations.map(item => <a className="cart-related-card" key={item.id} href={appHref(productHref(item.id))} data-recommended-id={item.id}><div><CartPhoto item={item} /></div><h3>{item.koreanName}</h3><strong>{money(item.price)}</strong></a>)}</div></section>
      <section className="cart-events" aria-labelledby="cart-event-title"><div><span>MELLOW BAKE EVENT</span><h2 id="cart-event-title">달콤한 혜택을 담아가세요!</h2><p>쿠폰과 이벤트는 준비 중입니다.</p></div><div className="cart-coupon"><span>WELCOME COUPON</span><strong>10% OFF</strong><p>첫 구매 할인 쿠폰</p><small>MELLOW BAKE</small></div><div className="cart-coupon cart-coupon-shipping"><span>DELIVERY EVENT</span><strong>FREE</strong><p>무료배송 쿠폰</p><small>MELLOW BAKE</small></div></section>
    </main>
    {deletion && <dialog ref={deleteDialog} className="cart-delete-dialog" aria-labelledby="cart-delete-title" onCancel={() => setDeletion(null)} onClick={event => { const rect=event.currentTarget.getBoundingClientRect(); if (event.target === event.currentTarget && (event.clientX<rect.left || event.clientX>rect.right || event.clientY<rect.top || event.clientY>rect.bottom)) setDeletion(null) }}><CartBow /><h2 id="cart-delete-title">{deletion.all ? '장바구니를 비우시겠습니까?' : '선택한 상품을 삭제하시겠습니까?'}</h2><p>{deletion.all ? '장바구니의 모든 상품이 삭제됩니다.' : `${deletion.ids.length}개의 상품이 삭제됩니다.`}</p><div><button autoFocus onClick={() => setDeletion(null)}>취소</button><button onClick={() => { act(() => deletion.all ? clearCart() : removeCartItems(deletion.ids), deletion.all ? '장바구니를 비웠습니다.' : '선택 상품을 삭제했습니다.'); setDeletion(null) }}>삭제하기</button></div></dialog>}
    <HomeFooter />
  </div>
}

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import { menuCategories, MenuProductImage } from './OurMenu'
import { productHref } from './productLinks'
import { useCart, initializeCartOnce, setCartQuantity, selectCartItem, selectAllCartItems, removeCartItems, clearCart } from '../cartStore'
import './Cart.css'
import { seasonalProducts } from '../newMenuCatalog'
import NewMenuProductImage from '../components/NewMenuProductImage'

const products = menuCategories.flatMap(category => category.products)
const initialItems = [['bread-1', 2], ['bread-7', 1], ['sandwich-5', 1]].map(([id, quantity]) => ({ product: products.find(item => item.id === id), quantity })).filter(item => item.product)
const recommendations = ['cake-1', 'bread-6', 'bread-7', 'drink-3'].map(id => products.find(item => item.id === id)).filter(Boolean)
const photos = import.meta.glob('../assets/{best-menu,new-menu,new-arrivals}/*.png', { eager: true, query: '?url', import: 'default' })
const money = value => `${value.toLocaleString('ko-KR')}원`

function CartPhoto({ item }) {
  const photoRef = useRef(null)
  useLayoutEffect(() => {
    photoRef.current?.querySelectorAll('svg').forEach(svg => svg.setAttribute('preserveAspectRatio', 'xMidYMid slice'))
  }, [item.id])
  const registered = products.find(product => product.id === item.id)
  const photo = Object.entries(photos).find(([path]) => path.split('/').at(-1) === `${item.id}.png`)?.[1]
  return <div className="cart-product-image" ref={photoRef}>{seasonalProducts.some(product => product.id === item.id) ? <NewMenuProductImage product={seasonalProducts.find(product => product.id === item.id)} /> : registered ? <MenuProductImage product={registered} /> : photo ? <img src={photo} alt={item.koreanName} /> : <span className="cart-photo-pending">상품 이미지 준비 중</span>}</div>
}

export default function Cart() {
  const items = useCart()
  const [notice, setNotice] = useState('')
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

  function act(action, message = '') {
    try { action(); setNotice(message) }
    catch { setNotice('변경 내용을 저장하지 못했습니다. 브라우저 저장 공간 설정을 확인해 주세요.') }
  }

  return <div className="cart-page">
    <HomeHeader />
    <section className="cart-banner" aria-labelledby="cart-title">
      <div className="cart-banner-inner">
        <div><p className="cart-breadcrumb"><a href="/">Home</a> &gt; Cart</p><h1 id="cart-title">Cart</h1><p>좋아하는 빵을 담아, 더 달콤한 하루를 만들어보세요</p></div>
        <svg className="cart-banner-art" viewBox="1060 235 550 190" aria-hidden="true"><image href="/images/장바구니.png" width="1632" height="2155" /></svg>
      </div>
    </section>
    <main className="cart-main">
      <div className="cart-layout">
        <section className="cart-items" aria-label="장바구니 상품 목록">
          <div className="cart-list-toolbar">
            <label><input ref={allCheckbox} type="checkbox" checked={items.length > 0 && selected.length === items.length} disabled={!items.length} onChange={event => act(() => selectAllCartItems(event.target.checked))} />전체 선택 ({selected.length}/{items.length})</label>
            <div><button disabled={!selected.length} onClick={() => act(() => removeCartItems(selected.map(item => item.id)), '선택 상품을 삭제했습니다.')}>선택 삭제</button><button disabled={!items.length} onClick={() => act(clearCart, '장바구니를 비웠습니다.')}>전체 삭제</button></div>
          </div>
          {items.length ? <>
            <div className="cart-column-head" aria-hidden="true"><span>상품 정보</span><span>가격</span><span>수량</span><span>합계</span></div>
            <ul className="cart-product-list">{items.map(item => <li className="cart-row" key={item.id} data-cart-id={item.id}>
              <input type="checkbox" aria-label={`${item.koreanName} 선택`} checked={item.selected} onChange={event => act(() => selectCartItem(item.id, event.target.checked))} />
              <a className="cart-row-product" href={productHref(item.id)}><div className="cart-row-photo"><CartPhoto item={item} /></div><div><h2>{item.koreanName}</h2><p>{item.description}</p><span>기본 구성</span></div></a>
              <strong className="cart-unit-price">{money(item.price)}</strong>
              <div className="cart-quantity" role="group" aria-label={`${item.koreanName} 수량`}><button aria-label={`${item.koreanName} 수량 줄이기`} disabled={item.quantity <= 1} onClick={() => act(() => setCartQuantity(item.id, item.quantity - 1))}>−</button><output aria-live="polite">{item.quantity}</output><button aria-label={`${item.koreanName} 수량 늘리기`} onClick={() => act(() => setCartQuantity(item.id, item.quantity + 1))}>+</button></div>
              <strong className="cart-line-total">{money(item.price * item.quantity)}</strong>
              <button className="cart-remove" aria-label={`${item.koreanName} 삭제`} onClick={() => act(() => removeCartItems([item.id]), `${item.koreanName}을 삭제했습니다.`)}>×</button>
            </li>)}</ul>
          </> : <div className="cart-empty"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 8h6l5 24h23l4-17H13M18 33l-2 6h23" /><circle cx="20" cy="43" r="2" /><circle cx="36" cy="43" r="2" /></svg><h2>장바구니가 비어 있어요</h2><p>좋아하는 빵을 담아 달콤한 순간을 준비해 보세요.</p><a href="/menu">메뉴 둘러보기</a></div>}
        </section>
        <aside className="cart-summary" aria-labelledby="cart-summary-title">
          <h2 id="cart-summary-title">주문 금액</h2>
          <dl><div><dt>선택 상품 금액</dt><dd data-cart-subtotal>{money(subtotal)}</dd></div><div><dt>배송비</dt><dd>정책 확인 필요</dd></div></dl>
          <dl className="cart-discounts"><div><dt>쿠폰 할인</dt><dd>준비 중</dd></div><div><dt>적립 예정 포인트</dt><dd>정책 확인 중</dd></div></dl>
          <div className="cart-total"><span>상품 기준 예상 금액</span><strong>{money(subtotal)}</strong></div>
          <p className="cart-policy-note">배송비와 할인은 미포함입니다. 운영 정책 확인 후 최종 결제 금액을 안내합니다.</p>
          <button className="cart-order" disabled={!selected.length} onClick={() => setNotice(`선택한 상품 ${selected.length}종 · ${money(subtotal)}. 주문 기능 준비 중입니다. 결제는 진행되지 않았습니다.`)}>주문하기 &gt;</button>
          <a className="cart-continue" href="/menu">계속 쇼핑하기</a>
        </aside>
      </div>
      <p className="cart-notice" role="status">{notice}</p>
      <section className="cart-recommendations" aria-labelledby="cart-related-title"><h2 id="cart-related-title">함께 보면 좋은 메뉴</h2><p>멜로우 베이크가 추천하는 달콤한 메뉴를 만나보세요.</p><div className="cart-related-grid">{recommendations.map(item => <a className="cart-related-card" key={item.id} href={productHref(item.id)} data-recommended-id={item.id}><div><CartPhoto item={item} /></div><h3>{item.koreanName}</h3><strong>{money(item.price)}</strong></a>)}</div></section>
      <section className="cart-events" aria-labelledby="cart-event-title"><div><span>MELLOW BAKE EVENT</span><h2 id="cart-event-title">달콤한 혜택을 담아가세요!</h2><p>쿠폰과 이벤트는 준비 중입니다.</p></div><div className="cart-coupon"><span>WELCOME COUPON</span><strong>COUPON</strong><p>할인 혜택 준비 중</p><small>MELLOW BAKE</small></div><div className="cart-coupon cart-coupon-shipping"><span>DELIVERY EVENT</span><strong>DELIVERY</strong><p>배송 혜택 준비 중</p><small>MELLOW BAKE</small></div></section>
    </main>
    <HomeFooter />
  </div>
}

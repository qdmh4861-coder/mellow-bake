import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import './WishlistCartSuccess.css'

export default function WishlistCartSuccess({ open, onClose }) {
  const dialog = useRef(null)
  useEffect(() => {
    if (!open) return
    const modal = dialog.current, opener = document.activeElement
    const bodyOverflow = document.body.style.overflow, rootOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    modal.showModal()
    return () => {
      modal.close()
      document.body.style.overflow = bodyOverflow
      document.documentElement.style.overflow = rootOverflow
      if (opener?.isConnected) opener.focus({ preventScroll: true })
    }
  }, [open])
  if (!open) return null
  return createPortal(<dialog ref={dialog} className="wishlist-cart-success" aria-modal="true" aria-labelledby="wishlist-cart-success-title" aria-describedby="wishlist-cart-success-description" onCancel={event => { event.preventDefault(); onClose() }} onClick={event => {
    if (event.target !== event.currentTarget) return
    const box = event.currentTarget.getBoundingClientRect()
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onClose()
  }}>
    <button type="button" className="wishlist-cart-success-close" aria-label="장바구니 완료 팝업 닫기" onClick={onClose} autoFocus>×</button>
    <svg className="wishlist-cart-success-art" viewBox="402 144 946 604" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><image href="/images/wishlist-cart-success-rabbit.png" width="1774" height="887" /></svg>
    <h2 id="wishlist-cart-success-title">장바구니에 담겼습니다!</h2>
    <p id="wishlist-cart-success-description">선택하신 상품이 장바구니에 정상적으로 담겼어요.</p>
    <div className="wishlist-cart-success-actions">
      <button type="button" onClick={onClose}>계속 쇼핑하기</button>
      <a href="/cart" onClick={onClose}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M2 3h3l3 13h11l3-10H6M9 20h.01M18 20h.01" strokeLinecap="round" strokeLinejoin="round" /></svg>장바구니 확인하기</a>
    </div>
    <svg className="wishlist-cart-success-decoration" viewBox="0 0 560 64" preserveAspectRatio="none" aria-hidden="true"><path d="M0 30Q35 8 70 30T140 30T210 30T280 30T350 30T420 30T490 30T560 30V64H0Z" fill="#ffe1eb" /><path d="M0 38Q35 16 70 38T140 38T210 38T280 38T350 38T420 38T490 38T560 38" fill="none" stroke="#ffb7cc" strokeWidth="2" strokeDasharray="7 6" /><g fill="none" stroke="#f699b5" strokeWidth="3" strokeLinejoin="round"><path d="M280 35C248 5 244 43 278 35C312 5 316 43 282 35M278 38l-14 15m18-15 14 15M67 15c-15-15-22 6 0 15 22-9 15-30 0-15m426 0c-15-15-22 6 0 15 22-9 15-30 0-15" /></g></svg>
  </dialog>, document.body)
}

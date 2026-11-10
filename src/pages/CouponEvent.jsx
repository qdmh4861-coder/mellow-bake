import MemberCutout from '../components/MemberCutout'
import MemberDecoration from '../components/MemberDecoration'
import { useEffect, useRef, useState } from 'react'
import { couponOffers, getCoupons, requestCoupon, useCouponUpdates } from '../benefitData'
import './CouponEvent.css'

// Decorative portions only. The awning, signs, tickets, copy and buttons are JSX/CSS.
function Art({ box, className = '' }) {
  const names = {
  "315 25 390 212": "coupon-bunny",
  "1250 65 360 162": "event-desserts",
  "325 365 132 135": "coupon-gift",
  "770 375 135 115": "coupon-truck",
  "1222 375 140 128": "coupon-basket",
  "393 616 305 147": "cake-bunny"
}
  return <MemberCutout name={names[box]} className={"coupon-event-art " + className} />
}
const artwork = { welcome: '325 365 132 135', delivery: '770 375 135 115', 'first-order': '1222 375 140 128' }
const labels = { welcome: 'WELCOME', delivery: 'FREE SHIPPING', 'first-order': 'FIRST ORDER' }
const captions = { welcome: '회원가입 즉시 발급', delivery: '다른 할인쿠폰과 중복 사용 불가', 'first-order': '첫 구매 시 1회 사용 가능' }
export default function CouponEvent() {
  useCouponUpdates()
  const coupons = getCoupons(), dialog = useRef(null), inFlight = useRef(false)
  const [offer, setOffer] = useState(null), [result, setResult] = useState(null), [busy, setBusy] = useState(false)
  useEffect(() => {
    if (!offer) return
    const element = dialog.current
    element.showModal()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { element.close(); document.body.style.overflow = previous }
  }, [offer])
  function open(item) { setResult(null); setOffer(item) }
  function close() { if (!inFlight.current) setOffer(null) }
  async function receive() {
    if (inFlight.current || !offer || result?.success) return
    inFlight.current = true; setBusy(true)
    try { setResult(await requestCoupon(offer.id)) }
    catch { setResult({ success: false, reason: 'storage', message: '쿠폰을 저장하지 못했습니다. 브라우저 저장 공간과 기존 데이터 형식을 확인해 주세요. 쿠폰은 발급되지 않았습니다.' }) }
    finally { inFlight.current = false; setBusy(false) }
  }
  return <div className="coupon-event-content">
    <header className="coupon-event-banner"><div className="coupon-event-awning" aria-hidden="true" /><Art box="315 25 390 212" className="coupon-event-banner-rabbit" /><div className="coupon-event-sign"><span aria-hidden="true">⋈</span><h1>쿠폰 이벤트</h1><p>지금 받을 수 있는 다양한 쿠폰과 특별한 혜택을 확인해 보세요!</p></div><Art box="1250 65 360 162" className="coupon-event-banner-desserts" /></header>
    <div className="coupon-event-section-heading"><h2><span aria-hidden="true">♧</span> 진행 중인 쿠폰 혜택 <span aria-hidden="true">✨</span></h2><a href="/mypage/coupons">전체 쿠폰 보기 ›</a></div>
    <section className="coupon-event-cards" aria-label="받을 수 있는 데모 쿠폰">{couponOffers.map(item => {
      const issued = coupons.some(coupon => coupon.offerId === item.id)
      return <article className="coupon-event-card" key={item.id} data-offer-id={item.id}><span className="coupon-event-label">{labels[item.id]}</span><div className="coupon-event-ticket-main"><Art box={artwork[item.id]} /><div><h3>{item.title}</h3><strong>{item.benefit}</strong><p>{captions[item.id]}</p></div></div><button type="button" disabled={issued} onClick={() => open(item)}>{issued ? '발급 완료' : '쿠폰 받기'}</button></article>
    })}</section>
    <p className="coupon-event-policy"><span aria-hidden="true">ⓘ</span> 이벤트 혜택은 제공된 디자인의 안내 문구입니다. 실제 발급·사용 정책은 확인 중입니다.</p>
    <p className="coupon-event-demo">브라우저 저장 데모입니다. 신규 회원·첫 구매 조건은 실제 회원·주문 서비스에서 검증되지 않으며, 실제 결제에는 적용되지 않습니다.</p>
    <section className="coupon-event-usage"><div><h2><span aria-hidden="true">▤</span> 쿠폰 이용 안내</h2><Art box="393 616 305 147" /></div><ul><li>쿠폰별 적용 상품과 최소 주문 금액을 확인해 주세요.</li><li>중복 사용과 발급 횟수는 쿠폰별 정책 확인이 필요합니다.</li><li>데모 환경에서 발급을 체험할 수 있으며 실제 결제에는 적용되지 않습니다.</li></ul></section>
    <MemberDecoration variant="event" />
    <dialog className="coupon-event-dialog" ref={dialog} onCancel={event => { event.preventDefault(); close() }} onClick={event => { if (event.target === event.currentTarget) { const r = event.currentTarget.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) close() } }} aria-labelledby="coupon-event-dialog-title"><button className="coupon-event-close" type="button" aria-label="쿠폰 팝업 닫기" disabled={busy} onClick={close}>×</button>{offer && <><Art box={artwork[offer.id]} /><h2 id="coupon-event-dialog-title">{result?.success ? '쿠폰이 발급되었습니다!' : result?.reason === 'duplicate' ? '이미 발급받은 쿠폰입니다' : result ? '쿠폰 발급 안내' : '쿠폰을 받으시겠어요?'}</h2><h3>{offer.benefit}</h3><p>{result ? result.message : offer.conditions}</p><p className="coupon-event-dialog-note">브라우저 데모 쿠폰이며 실제 결제에는 적용되지 않습니다. 유효기간은 정책 확인 중입니다.</p><div className="coupon-event-dialog-actions">{result?.success || result?.reason === 'duplicate' ? <a href="/mypage/coupons">쿠폰함 확인하기</a> : !result ? <button type="button" disabled={busy} onClick={receive}>{busy ? '저장 중…' : '받기'}</button> : result.reason === 'login' ? <a href="/login">로그인하기</a> : <button type="button" disabled={busy} onClick={() => setResult(null)}>다시 확인</button>}<button type="button" disabled={busy} onClick={close}>{result ? '닫기' : '취소'}</button></div></>}</dialog>
  </div>
}

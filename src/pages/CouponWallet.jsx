import { assetHref, appHref } from '../appRouting'
import MemberCutout from '../components/MemberCutout'
import MemberDecoration from '../components/MemberDecoration'
import { useState } from 'react'
import { couponStatus, getCoupons, useCouponUpdates } from '../benefitData'
import './CouponWallet.css'

const statuses = { available: '사용 가능', used: '사용 완료', expired: '기간 만료' }
// Explicit, unsaved design preview. Dates are deliberately not fabricated.
const examples = [
  { id: 'wallet-preview-welcome', title: '신규 가입 쿠폰', conditions: '전 메뉴 10% 할인', benefit: '10% 할인', illustration: 'gift' },
  { id: 'wallet-preview-birthday', title: '생일 축하 쿠폰', conditions: '전 메뉴 20% 할인', benefit: '20% 할인', illustration: 'cake' },
  { id: 'wallet-preview-thanks', title: '재방문 감사 쿠폰', conditions: '10,000원 이상 구매 시 3,000원 할인', benefit: '3,000원 할인', illustration: 'croissant' },
]
function Art({ box, className = '' }) {
  const names = {
  "389 0 370 182": "coupon-bunny",
  "1330 40 400 142": "wallet-desserts",
  "1555 609 205 188": "benefit-bear-left",
  "350 393 150 105": "coupon-gift",
  "350 513 150 103": "coupon-cake",
  "350 636 150 98": "coupon-croissant",
  "770 375 135 115": "coupon-truck",
  "1222 375 140 128": "coupon-basket"
}
  return <MemberCutout name={names[box]} className={"coupon-wallet-art " + className} />
}
function CouponArt({ coupon }) {
  if (coupon.offerId === 'delivery' || coupon.offerId === 'first-order') return <Art src={assetHref("이벤.png")} width={1649} height={954} box={coupon.offerId === 'delivery' ? '770 375 135 115' : '1222 375 140 128'} />
  const illustration = coupon.illustration || (coupon.offerId === 'welcome' ? 'gift' : null)
  const box = ({ gift: '350 393 150 105', cake: '350 513 150 103', croissant: '350 636 150 98' })[illustration]
  return box ? <Art box={box} /> : <span className="coupon-wallet-ticket-icon" aria-hidden="true">♧</span>
}
function expiry(coupon) {
  const value = typeof coupon.expiresAt === 'string' ? coupon.expiresAt : ''
  return value && Number.isFinite(Date.parse(value.replaceAll('.', '-'))) ? `${value.slice(0, 10).replaceAll('-', '.')}까지` : '유효기간 확인 필요'
}
function benefitOrder(coupon) {
  const value = String(coupon.benefit || '').replaceAll(',', '')
  const amount = value.match(/(\d+(?:\.\d+)?)\s*원/), percent = value.match(/(\d+(?:\.\d+)?)\s*%/)
  return amount ? [2, Number(amount[1])] : percent ? [1, Number(percent[1])] : [0, 0]
}
export default function CouponWallet() {
  useCouponUpdates()
  const saved = getCoupons()
  const [preview, setPreview] = useState(() => getCoupons().length === 0), [filter, setFilter] = useState('all'), [sort, setSort] = useState('newest'), [code, setCode] = useState(''), [notice, setNotice] = useState('')
  const coupons = preview ? examples : saved
  const visible = coupons.filter(coupon => filter === 'all' || couponStatus(coupon) === filter).sort((a, b) => {
    const recent = (Date.parse(b.issuedAt) || 0) - (Date.parse(a.issuedAt) || 0)
    if (sort === 'expiry') {
      const expiryTime = c => { const value = typeof c.expiresAt === 'string' ? Date.parse(c.expiresAt.replaceAll('.', '-')) : NaN; return Number.isFinite(value) ? value : Infinity }
      return expiryTime(a) - expiryTime(b) || recent
    }
    if (sort === 'benefit') { const x = benefitOrder(a), y = benefitOrder(b); return y[0] - x[0] || y[1] - x[1] || recent }
    return recent
  })
  function register(event) {
    event.preventDefault()
    setNotice(code.trim() ? '쿠폰 번호 검증·등록 서비스가 준비 중입니다. 입력한 번호는 등록되지 않았습니다.' : '쿠폰 번호를 입력해 주세요.')
  }
  return <div className="coupon-wallet-content">
    <header className="coupon-wallet-banner"><div className="coupon-wallet-awning" aria-hidden="true" /><Art className="coupon-wallet-banner-rabbit" box="389 0 370 182" /><div className="coupon-wallet-sign"><h1>전체 쿠폰 보기</h1><p>보유 중인 모든 쿠폰을 확인하고, 사용해 보세요!</p></div><Art className="coupon-wallet-banner-sweets" box="1330 40 400 142" /></header>
    <div className="coupon-wallet-mode"><p>{preview ? '디자인 미리보기 · 실제 보유 쿠폰이 아니며 저장되지 않습니다.' : '브라우저 데모 쿠폰입니다. 실제 회원·결제 서비스와 연동되지 않습니다.'}</p><button type="button" aria-pressed={preview} onClick={() => { setPreview(!preview); setFilter('all'); setNotice('') }}>{preview ? '내 쿠폰 보기' : '디자인 예시 보기'}</button></div>
    <div className="coupon-wallet-tabs" role="group" aria-label="쿠폰 상태">{[['all', '전체', '♧'], ['available', '사용 가능', '✓'], ['used', '사용 완료', '▣'], ['expired', '기간 만료', '⊗']].map(([id, text, icon]) => <button type="button" key={id} aria-pressed={filter === id} onClick={() => { setFilter(id); setNotice('') }}><span aria-hidden="true">{icon}</span> {text} ({id === 'all' ? coupons.length : coupons.filter(c => couponStatus(c) === id).length})</button>)}</div>
    <div className="coupon-wallet-layout"><section className="coupon-wallet-list" aria-label="보유 쿠폰 목록"><header><h2><span aria-hidden="true">♧</span> 보유 쿠폰 <em>{coupons.length}개</em></h2><select aria-label="쿠폰 정렬" value={sort} onChange={event => setSort(event.target.value)}><option value="newest">최신순</option><option value="expiry">유효기간 임박순</option><option value="benefit">할인 혜택순</option></select></header>
      {sort === 'benefit' && <p className="coupon-wallet-sort-note">정액 → 정률 → 무료배송 순, 같은 유형은 할인 수치가 큰 순입니다. 실제 할인액은 주문 조건에 따라 달라집니다.</p>}
      <div className="coupon-wallet-cards">{visible.map(coupon => <article className="coupon-wallet-card" key={coupon.id} data-coupon-id={coupon.id}><div className="coupon-wallet-illustration"><CouponArt coupon={coupon} /></div><div className="coupon-wallet-info"><h3>{coupon.title}</h3><p>{coupon.conditions || '사용 조건 확인 필요'}</p><span className={`coupon-wallet-status coupon-wallet-status--${couponStatus(coupon)}`}>{statuses[couponStatus(coupon)]}</span></div><div className="coupon-wallet-value"><strong>{coupon.benefit || '혜택 확인 필요'}</strong><small>{expiry(coupon)}</small></div><button type="button" disabled={couponStatus(coupon) !== 'available'} onClick={() => setNotice(preview ? '디자인 예시 쿠폰입니다. 실제로 사용할 수 없습니다.' : '쿠폰 사용은 결제 서비스 연동 후 가능합니다. 쿠폰은 사용 완료 처리되지 않았습니다.')}>{couponStatus(coupon) === 'available' ? '사용하기' : statuses[couponStatus(coupon)]}</button></article>)}</div>
      {!visible.length && <div className="coupon-wallet-empty"><span aria-hidden="true">♧</span><h3>{filter === 'all' ? '보유한 쿠폰이 없습니다' : `${statuses[filter]} 쿠폰이 없습니다`}</h3><p>쿠폰 이벤트에서 받을 수 있는 혜택을 확인해 보세요.</p><a href={appHref("/mypage/coupon-events")}>쿠폰 이벤트 보기</a></div>}
    </section><aside className="coupon-wallet-aside"><form className="coupon-wallet-register" onSubmit={register}><h2><span aria-hidden="true">♧</span> 쿠폰 등록</h2><div><input aria-label="쿠폰 번호" maxLength={100} placeholder="쿠폰 번호를 입력해 주세요." value={code} onChange={event => setCode(event.target.value)} /><button type="submit">등록</button></div></form><section className="coupon-wallet-guide"><h2><span aria-hidden="true">▤</span> 쿠폰 이용 안내</h2><ul><li>쿠폰별 적용 상품과 최소 주문 금액을 확인해 주세요.</li><li>중복 사용과 발급 횟수는 쿠폰별 정책 확인이 필요합니다.</li><li>데모 발급은 브라우저에 저장되며 실제 쿠폰 사용은 결제 서비스 연동 후 가능합니다.</li></ul><Art box="1555 609 205 188" /></section></aside></div>
    <p className="coupon-wallet-notice" role="status">{notice}</p>
    <MemberDecoration variant="wallet" />
  </div>
}

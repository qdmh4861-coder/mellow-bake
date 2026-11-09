import { useId, useRef, useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import MyPageSidebar from '../components/MyPageSidebar'
import { couponOffers, getCoupons, getPointLedger, couponStatus, benefitSummary, requestCoupon } from '../benefitData'
import './MyPage.css'
import './Benefits.css'

const pointText = value => `${value.toLocaleString('ko-KR')}P`
const day = value => value ? value.slice(0, 10).replaceAll('-', '.') : '확인 필요'
const statuses = { available: '사용 가능', used: '사용 완료', expired: '기간 만료' }
// Figma display examples only. Never written into member accounts or checkout.
const exampleCoupons = [
  { id: 'example-welcome', title: '신규 가입 쿠폰', benefit: '10% 할인', conditions: '전 메뉴 10% 할인', expiresAt: '2025-12-31', example: true },
  { id: 'example-birthday', title: '생일 축하 쿠폰', benefit: '20% 할인', conditions: '전 메뉴 20% 할인', expiresAt: '2025-12-31', example: true },
  { id: 'example-thanks', title: '재방문 감사 쿠폰', benefit: '3,000원 할인', conditions: '10,000원 이상 구매 시 3,000원 할인', expiresAt: '2025-12-31', example: true },
]
const examplePoints = [
  { id: 'example-point-1', occurredAt: '2026-10-30', kind: 'earn', amount: 500, description: '주문완료 포인트 적립 (주문번호 MB103045)', example: true },
  { id: 'example-point-2', occurredAt: '2026-10-25', kind: 'use', amount: -1000, description: '주문결제 시 포인트 사용 (주문번호 MB102978)', example: true },
  { id: 'example-point-3', occurredAt: '2026-10-20', kind: 'earn', amount: 300, description: '리뷰 작성 포인트 적립', example: true },
  { id: 'example-point-4', occurredAt: '2026-10-05', kind: 'expire', amount: -500, description: '유효기간 만료로 포인트 소멸', example: true },
]
const displayCoupons = () => getCoupons().length ? getCoupons() : exampleCoupons
const displayPoints = () => getPointLedger().length ? getPointLedger() : examplePoints
const displayCouponStatus = coupon => coupon.example ? 'available' : couponStatus(coupon)
const displaySummary = () => getCoupons().length ? benefitSummary() : { ...benefitSummary(), availableCoupons: 3, couponCount: 3 }
function ExampleNote() { return <p className="benefit-example-note">디자인 예시 · 실제 보유 쿠폰이나 포인트가 아닙니다.</p> }
function Art({ src = '이벤트.png', box, width = 1632, height = 2530, className = '' }) {
  const id = useId()
  const [x, y, w, h] = box.split(' ').map(Number)
  return <svg className={`benefit-art ${className}`} viewBox={box} aria-hidden="true"><defs><clipPath id={id}><rect x={x} y={y} width={w} height={h} /></clipPath></defs><image href={`/images/${src}`} width={width} height={height} clipPath={`url(#${id})`} /></svg>
}
function UsageNote({ points = false }) {
  return <section className="benefit-usage"><h2>{points ? '포인트 이용 안내' : '쿠폰 이용 안내'}</h2><ul>{(points ? ['적립률과 적립 조건은 운영 정책 확인 후 안내합니다.', '최소 사용 포인트와 사용 한도는 아직 확정되지 않았습니다.', '유효기간과 소멸 기준은 실제 포인트 정보에 따라 안내합니다.'] : ['쿠폰별 적용 상품과 최소 주문 금액을 확인해 주세요.', '중복 사용과 발급 횟수는 쿠폰별 정책 확인이 필요합니다.', '쿠폰 발급·사용 기능은 회원 및 결제 서비스 연동 후 제공됩니다.']).map(text => <li key={text}>{text}</li>)}</ul></section>
}
function EventPage() {
  const dialog = useRef(null)
  const [offer, setOffer] = useState(null)
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)
  const inFlight = useRef(false)
  function open(item) { setOffer(item); setResult(null); dialog.current?.showModal() }
  async function receive() {
    if (inFlight.current || !offer || result?.success) return
    inFlight.current = true; setBusy(true)
    try {
      const response = await requestCoupon(offer.id)
      setResult(response.success && response.coupon?.id ? response : { ...response, success: false })
    } catch { setResult({ success: false, reason: 'error', message: '쿠폰 발급 요청에 실패했습니다. 잠시 후 다시 확인해 주세요.' }) }
    finally { inFlight.current = false; setBusy(false) }
  }
  return <>
    <section className="benefit-event-banner"><div><span>COUPON</span><h1>EVENT</h1><p>달콤한 혜택을 만나보세요! ♡</p></div><Art box="875 155 750 490" /></section>
    <div className="benefit-event-tickets">{couponOffers.map(item => <article className="benefit-event-ticket" key={item.id}><div className="benefit-ticket-illustration"><span className="mypage-sr-only">{item.caption}</span><Art box={({ welcome: "405 805 225 240", delivery: "400 1150 235 230", "first-order": "405 1510 230 240" })[item.id] || item.art} /></div><div className="benefit-ticket-body"><strong>{item.label}</strong><h2>{item.title}</h2><p>{item.benefit}</p><small>{item.conditions}</small></div><div className="benefit-ticket-download"><span>{item.tag}</span><button type="button" onClick={() => open(item)}>쿠폰 받기 ›</button></div></article>)}</div>
    <p className="benefit-policy-note">이벤트 혜택은 제공된 디자인의 안내 문구입니다. 실제 발급·사용 정책은 확인 중입니다.</p>
    <UsageNote />
    <dialog className="benefit-coupon-dialog" ref={dialog} aria-labelledby="benefit-coupon-dialog-title" onCancel={event => { if (busy) event.preventDefault() }}><button className="benefit-dialog-close" type="button" aria-label="쿠폰 팝업 닫기" disabled={busy} onClick={() => dialog.current?.close()}>×</button><Art src="쿠폰 팝업창.png" box="760 1140 125 110" />
      <h2 id="benefit-coupon-dialog-title">{result?.success ? '쿠폰이 발급되었어요!' : result?.reason === 'duplicate' ? '이미 발급받은 쿠폰이에요!' : result?.reason === 'conditions' ? '쿠폰 사용 조건을 확인해 주세요!' : result ? '쿠폰 발급 안내' : '쿠폰을 받으시겠어요?'}</h2>
      {!result && offer && <><h3>{offer.label}</h3><strong className="benefit-dialog-discount">{offer.benefit}</strong><p>{offer.conditions}</p></>}
      {result && <p role="status">{result.success ? '쿠폰이 정상적으로 발급되었습니다.' : result.message || '쿠폰 발급 결과를 확인할 수 없습니다. 쿠폰함을 확인해 주세요.'}</p>}
      <div className="benefit-dialog-actions">{result?.success || result?.reason === 'duplicate' ? <a href="/mypage/coupons">{result.success ? '쿠폰 확인하기' : '내 쿠폰 확인하기'}</a> : result?.reason === 'conditions' ? <button type="button" onClick={() => setResult(null)}>쿠폰 조건 확인하기</button> : !result ? <button type="button" disabled={busy} onClick={receive}>{busy ? '확인 중…' : '받기'}</button> : <a href="/login">로그인하기</a>}<button type="button" disabled={busy} onClick={() => dialog.current?.close()}>{result ? '닫기' : '취소'}</button></div>
    </dialog>
  </>
}
function CouponPage() {
  const coupons = displayCoupons()
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('newest')
  const [code, setCode] = useState('')
  const [notice, setNotice] = useState('')
  const visible = coupons.filter(coupon => filter === 'all' || displayCouponStatus(coupon) === filter).sort((a, b) => sort === 'expiry' ? (Date.parse(a.expiresAt) || Infinity) - (Date.parse(b.expiresAt) || Infinity) : (Date.parse(b.issuedAt) || 0) - (Date.parse(a.issuedAt) || 0))
  return <>
    <header className="benefit-page-heading"><Art src="전체 쿠폰.png" height={1560} box="420 185 150 140" /><div><h1>전체 쿠폰 보기</h1><p>보유 중인 모든 쿠폰을 확인하고, 사용해 보세요!</p></div></header>
    {!getCoupons().length && <ExampleNote />}<div className="benefit-pill-tabs" role="group" aria-label="쿠폰 상태">{[['all', '전체'], ...Object.entries(statuses)].map(([id, label]) => <button type="button" aria-pressed={filter === id} key={id} onClick={() => setFilter(id)}>{label} ({id === 'all' ? coupons.length : coupons.filter(coupon => displayCouponStatus(coupon) === id).length})</button>)}</div>
    <div className="benefit-coupon-layout"><section className="benefit-coupon-list"><header><h2>보유 쿠폰 <em>{coupons.filter(coupon => displayCouponStatus(coupon) === 'available').length}개</em></h2><select aria-label="쿠폰 정렬" value={sort} onChange={event => setSort(event.target.value)}><option value="newest">최신순</option><option value="expiry">만료 임박순</option></select></header>{visible.length ? visible.map(coupon => <article className="benefit-owned-coupon" key={coupon.id} data-coupon-id={coupon.id}><div className="benefit-owned-art">♔<br />MELLOW<br />BAKE</div><div><h3>{coupon.title}</h3><p>{coupon.conditions || '사용 조건 확인 필요'}</p><span>{statuses[displayCouponStatus(coupon)]}</span></div><div className="benefit-owned-value"><strong>{coupon.benefit}</strong><small>유효기간<br />{day(coupon.expiresAt)}까지</small></div><button type="button" disabled={displayCouponStatus(coupon) !== 'available'} onClick={() => setNotice('쿠폰 적용은 주문·결제 서비스 연동 준비 중입니다. 쿠폰은 사용되지 않았습니다.')}>{displayCouponStatus(coupon) === 'available' ? '사용하기' : statuses[displayCouponStatus(coupon)]}</button></article>) : <div className="benefit-empty">해당하는 보유 쿠폰이 없습니다</div>}</section><aside><form className="benefit-code-register" onSubmit={event => { event.preventDefault(); setNotice(code.trim() ? '쿠폰 등록 서비스는 준비 중입니다. 입력한 번호는 전송되지 않았습니다.' : '쿠폰 번호를 입력해 주세요.') }}><h2>쿠폰 등록</h2><div><input aria-label="쿠폰 번호" placeholder="쿠폰 번호를 입력해 주세요." value={code} onChange={event => setCode(event.target.value)} /><button type="submit">등록</button></div></form><UsageNote /></aside></div><p className="benefit-status" role="status">{notice}</p>
  </>
}
function PointsPage() {
  const [referenceDate] = useState(() => new Date())
  const summary = displaySummary()
  const [kind, setKind] = useState('all')
  const [period, setPeriod] = useState('all')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [dates, setDates] = useState({ start: '', end: '' })
  const [notice, setNotice] = useState('')
  const ledger = displayPoints().filter(row => {
    const date = row.occurredAt?.slice(0, 10).replaceAll('.', '-') || ''
    const threshold = new Date(referenceDate.getTime()); threshold.setMonth(threshold.getMonth() - Number(period))
    return (kind === 'all' || row.kind === kind) && (period === 'all' || (Date.parse(row.occurredAt) || 0) >= threshold.getTime()) && (!dates.start || date >= dates.start) && (!dates.end || date <= dates.end)
  }).sort((a, b) => (Date.parse(b.occurredAt) || 0) - (Date.parse(a.occurredAt) || 0))
  return <>
    <header className="benefit-page-heading"><div><h1>전체 포인트 내역</h1><p>적립, 사용한 포인트 내역을 한눈에 확인할 수 있습니다.</p></div></header>
    {!getPointLedger().length && <ExampleNote />}<div className="benefit-points-layout"><div><section className="benefit-point-balance"><Art src="전체 포인트 내역.png" height={1560} box="270 455 140 105" className="benefit-coins" /><div><h2>보유 포인트</h2><strong>{pointText(summary.points)}</strong></div><dl><div><dt>적립 예정 포인트</dt><dd>{pointText(summary.pendingPoints)}</dd></div><div><dt>소멸 예정 포인트</dt><dd>{pointText(summary.expiringPoints)}</dd></div></dl></section><div className="benefit-point-filters"><div role="group" aria-label="포인트 상태">{[['all', '전체'], ['earn', '적립'], ['use', '사용'], ['expire', '소멸']].map(([id, label]) => <button type="button" key={id} aria-pressed={kind === id} onClick={() => setKind(id)}>{label}</button>)}</div><select aria-label="포인트 조회 기간" value={period} onChange={event => setPeriod(event.target.value)}><option value="all">기간 선택</option><option value="1">최근 1개월</option><option value="3">최근 3개월</option><option value="6">최근 6개월</option><option value="12">최근 1년</option></select></div><form className="benefit-date-filter" onSubmit={event => { event.preventDefault(); if (start && end && start > end) { setNotice('시작일은 종료일보다 늦을 수 없습니다.'); return } setDates({ start, end }); setNotice('') }}><input type="date" aria-label="포인트 조회 시작일" value={start} onChange={event => setStart(event.target.value)} /><span>~</span><input type="date" aria-label="포인트 조회 종료일" value={end} onChange={event => setEnd(event.target.value)} /><button type="submit">조회</button></form><PointTable rows={ledger} /><p className="benefit-status" role="status">{notice}</p></div><aside><Art src="전체 포인트 내역.png" height={1560} box="1150 440 180 132" /><UsageNote points /></aside></div>
  </>
}
function PointTable({ rows, compact = false }) {
  const chronological = [...displayPoints()].sort((a, b) => (Date.parse(a.occurredAt) || 0) - (Date.parse(b.occurredAt) || 0))
  const accumulated = chronological.reduce((state, row) => {
    const balance = state.balance + (row.kind !== 'pending' && Number.isFinite(row.amount) ? row.amount : 0)
    return { balance, rows: [...state.rows, [row.id, balance]] }
  }, { balance: 0, rows: [] })
  const balances = new Map(accumulated.rows)
  return <div className="benefit-table"><table><caption className="mypage-sr-only">포인트 적립 및 사용 내역</caption><thead><tr>{(compact ? ['일자', '내용', '포인트', '잔여 포인트'] : ['일자', '구분', '내용', '포인트']).map(label => <th key={label} scope="col">{label}</th>)}</tr></thead><tbody>{rows.length ? rows.map(row => <tr key={row.id} data-point-id={row.id}><td>{day(row.occurredAt)}</td>{!compact && <td><span className={`benefit-point-kind benefit-point-kind--${row.kind}`}>{({ earn: '적립', use: '사용', expire: '소멸', pending: '적립 예정' })[row.kind] || '확인 필요'}</span></td>}<td>{row.description}</td><td className={row.amount >= 0 ? 'benefit-positive' : 'benefit-negative'}>{row.amount > 0 ? '+' : ''}{pointText(row.amount)}</td>{compact && <td>{row.example ? '\u2014' : pointText(balances.get(row.id) || 0)}</td>}</tr>) : <tr><td className="benefit-empty" colSpan={4}>포인트 내역이 없습니다</td></tr>}</tbody></table></div>
}
function OverviewPage() {
  const summary = displaySummary()
  const coupons = [...displayCoupons()].sort((a, b) => (Date.parse(b.issuedAt) || 0) - (Date.parse(a.issuedAt) || 0)).slice(0, 3)
  const ledger = [...displayPoints()].sort((a, b) => (Date.parse(b.occurredAt) || 0) - (Date.parse(a.occurredAt) || 0)).slice(0, 3)
  return <>
    <header className="benefit-page-heading benefit-overview-heading"><div><h1>COUPON &amp; POINT</h1><p>쿠폰 및 포인트</p></div></header>
    {(!getCoupons().length || !getPointLedger().length) && <ExampleNote />}<div className="benefit-overview-totals"><div><Art src="쿠폰&포인트.png" height={1691} box="340 330 190 160" /><a href="/mypage/coupons"><span aria-hidden="true">♧</span><div><h2>보유 쿠폰</h2><strong>{summary.availableCoupons}장</strong></div><span aria-hidden="true">›</span></a></div><div><Art src="쿠폰&포인트.png" height={1691} box="1125 330 230 160" /><a href="/mypage/points"><span aria-hidden="true">Ⓟ</span><div><h2>보유 포인트</h2><strong>{pointText(summary.points)}</strong></div><span aria-hidden="true">›</span></a></div></div>
    <div className="benefit-overview-panels"><section><header><h2>내 쿠폰 ({summary.couponCount})</h2><a href="/mypage/coupons">전체 쿠폰 보기 ›</a></header>{coupons.length ? coupons.map(coupon => <a className="benefit-mini-coupon" href="/mypage/coupons" key={coupon.id}><strong>{coupon.benefit}</strong><div><h3>{coupon.title}</h3><p>{coupon.conditions || '사용 조건 확인 필요'}</p><small>{day(coupon.expiresAt)}까지 · {statuses[displayCouponStatus(coupon)]}</small></div></a>) : <div className="benefit-empty">보유한 쿠폰이 없습니다</div>}</section><section><header><h2>포인트 내역</h2><a href="/mypage/points">전체 내역 보기 ›</a></header><PointTable rows={ledger} compact /></section></div><UsageNote />
  </>
}
export default function Benefits({ page }) {
  return <div className="mypage-page benefits-page"><HomeHeader /><main className="mypage-layout"><MyPageSidebar /><div className="mypage-content benefits-content">{page === 'events' ? <EventPage /> : page === 'coupons' ? <CouponPage /> : page === 'points' ? <PointsPage /> : <OverviewPage />}</div></main><HomeFooter /></div>
}

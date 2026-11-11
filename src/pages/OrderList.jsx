import { appLocation, appHistory, appHref } from '../appRouting'
import { useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import MyPageSidebar from '../components/MyPageSidebar'
import OrderProductImage from '../components/OrderProductImage'
import MemberArtwork from '../components/MemberArtwork'
import MemberIcon from '../components/MemberIcon'
import { orderDetailHref, orderDeliveryHref, orderMoney } from '../orderData'
import { displayOrders, isOrderPreview, orderSummaryItems } from '../orderPreview'
import { orderPhase } from '../mypageData'
import './MyPage.css'
import './OrderList.css'

const periods = [['all', '전체'], ['1', '최근 1개월'], ['3', '최근 3개월'], ['6', '최근 6개월'], ['12', '최근 1년']]
function todayKey() {
  const parts = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date())
  return ['year', 'month', 'day'].map(type => parts.find(part => part.type === type).value).join('-')
}
function monthsAgo(day, count) {
  const date = new Date(`${day}T00:00:00Z`)
  const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() - count, 1))
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate()
  target.setUTCDate(Math.min(date.getUTCDate(), lastDay))
  return target.toISOString().slice(0, 10)
}
function validDay(value) { return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value }
function initialFilter() {
  const params = new URLSearchParams(appLocation.search)
  const range = params.get('range') || (isOrderPreview() ? 'all' : '3')
  if (range === 'all') return { range, start: '', end: '' }
  if (range === 'custom') {
    const start = params.get('start') || '', end = params.get('end') || ''
    if ((!start || validDay(start)) && (!end || validDay(end)) && (!start || !end || start <= end)) return { range, start, end }
  }
  const safeRange = ['1', '3', '6', '12'].includes(range) ? range : '3'
  const end = todayKey()
  return { range: safeRange, start: monthsAgo(end, Number(safeRange)), end }
}
function orderDay(value) { return typeof value === 'string' ? value.slice(0, 10).replaceAll('.', '-').replaceAll('/', '-') : '' }
function SearchIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="10" cy="10" r="6.5" /><path d="m15 15 6 6" /></svg> }
function OrderPhoto({ item }) {
  const [failed, setFailed] = useState(false)
  return <div className="order-list-photo" onErrorCapture={() => setFailed(true)}>{failed ? <span className="order-list-photo-fallback" role="img" aria-label={`${item.koreanName} 이미지 준비 중`}><MemberIcon type="box" /><small>이미지 준비 중</small></span> : <OrderProductImage item={item} />}</div>
}
function ShipmentBadge({ order }) {
  const label = order.shipment?.statusLabel || order.statusLabel || '정보 없음'
  const value = label.replaceAll(' ', '')
  const state = value.includes('취소') ? 'cancel' : value.includes('반품') ? 'return' : value.includes('교환') ? 'exchange' : value.includes('배송완료') ? 'delivered' : value.includes('배송중') || value.includes('배송예정') ? 'shipping' : value.includes('준비') ? 'preparing' : value.includes('결제') ? 'paid' : value.includes('접수') ? 'received' : 'unknown'
  return <span className={`order-list-status order-list-status--${state}`}><MemberIcon type={({ shipping: 'truck', delivered: 'gift', preparing: 'box', paid: 'card', received: 'list', cancel: 'list', return: 'box', exchange: 'box' })[state] || 'box'} />{label}</span>
}

export default function OrderList() {
  const [filter, setFilter] = useState(initialFilter)
  const [draft, setDraft] = useState(initialFilter)
  const [error, setError] = useState('')
  const status = new URLSearchParams(appLocation.search).get('status')
  const orders = displayOrders().filter(order => {
    const day = orderDay(order.orderedAt)
    return (!filter.start || day >= filter.start) && (!filter.end || day <= filter.end) && (!status || orderPhase(order) === status)
  }).sort((a, b) => orderDay(b.orderedAt).localeCompare(orderDay(a.orderedAt)))
  function apply(next) {
    setFilter(next); setDraft(next); setError('')
    const url = new URL(appLocation.href)
    const realOnly = url.searchParams.get('preview') === '0'
    url.search = ''
    if (realOnly) url.searchParams.set('preview', '0')
    if (status) url.searchParams.set('status', status)
    url.searchParams.set('range', next.range)
    if (next.range === 'custom') {
      if (next.start) url.searchParams.set('start', next.start)
      if (next.end) url.searchParams.set('end', next.end)
    }
    appHistory.replaceState(null, '', url)
  }
  function choosePeriod(range) {
    const end = todayKey()
    apply(range === 'all' ? { range, start: '', end: '' } : { range, start: monthsAgo(end, Number(range)), end })
  }
  function search(event) {
    event.preventDefault()
    if ((draft.start && !validDay(draft.start)) || (draft.end && !validDay(draft.end))) { setError('올바른 날짜를 선택해 주세요.'); return }
    if (draft.start && draft.end && draft.start > draft.end) { setError('시작일은 종료일보다 늦을 수 없습니다.'); return }
    apply({ ...draft, range: 'custom' })
  }
  return <div className="mypage-page order-list-page">
    <HomeHeader />
    <main className="mypage-layout"><MyPageSidebar /><div className="mypage-content order-list-content">
      <header className="order-list-banner"><MemberArtwork cutout part="rabbit" /><div><span className="order-list-banner-brand">MELLOW BAKE</span><h1>주문 내역 / 배송 조회</h1><p>기간별 주문 내역과 배송 상태를 확인하실 수 있습니다.</p></div><MemberArtwork cutout part="treats" /><span className="order-list-banner-sparkle" aria-hidden="true">✧ ♡</span></header>
      {status && <p className="order-list-intro">{status} 상태의 주문입니다. <a href={appHref("/mypage/orders/list?preview=0")}>전체 주문 보기 ›</a></p>}
      <section className="order-list-filters" aria-label="주문 내역 검색">
        <div className="order-list-periods" role="group" aria-label="주문 조회 기간">{periods.map(([range, label]) => <button type="button" key={range} aria-pressed={draft.range === range} onClick={() => choosePeriod(range)}>{label}</button>)}</div>
        <form className="order-list-date-filter" onSubmit={search}><label><span className="mypage-sr-only">시작 날짜</span><input type="date" aria-label="주문 조회 시작일" value={draft.start} aria-invalid={Boolean(error)} aria-describedby="order-list-filter-error" onChange={event => { setDraft({ ...draft, range: 'custom', start: event.target.value }); setError('') }} /></label><span aria-hidden="true">~</span><label><span className="mypage-sr-only">종료 날짜</span><input type="date" aria-label="주문 조회 종료일" value={draft.end} aria-invalid={Boolean(error)} aria-describedby="order-list-filter-error" onChange={event => { setDraft({ ...draft, range: 'custom', end: event.target.value }); setError('') }} /></label><button type="submit"><SearchIcon />조회</button></form>
        <p className="order-list-filter-error" id="order-list-filter-error" role="alert">{error}</p>
      </section>
      <div className="order-list-table-card"><table><caption className="mypage-sr-only">기간별 주문 내역</caption><colgroup><col className="order-list-date-col" /><col className="order-list-product-col" /><col className="order-list-money-col" /><col className="order-list-state-col" /><col className="order-list-actions-col" /></colgroup><thead><tr>{['주문일자', '상품정보', '결제금액', '배송상태', '주문관리'].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead><tbody>{orders.length ? orders.map(order => <tr key={order.id} data-order-id={order.id}><td className="order-list-date" data-label="주문일자"><time dateTime={orderDay(order.orderedAt)}>{orderDay(order.orderedAt).replaceAll('-', '.')}</time></td><td className="order-list-product-cell" data-label="상품정보"><div className="order-list-products">{orderSummaryItems(order).map((item, index) => <a className="order-list-product" href={appHref(orderDetailHref(order.id))} key={`${item.id}-${index}`}><OrderPhoto item={item} /><div><h2>{item.koreanName}</h2><p>{item.option || item.description || '기본 구성'} · {item.quantity}개</p></div></a>)}</div></td><td className="order-list-paid" data-label="결제금액">{orderMoney(order.payment?.total)}</td><td className="order-list-state-cell" data-label="배송상태"><ShipmentBadge order={order} /></td><td className="order-list-actions-cell" data-label="주문관리"><div className="order-list-management"><a href={appHref(orderDetailHref(order.id))}>주문 상세 <span aria-hidden="true">›</span></a><a href={appHref(orderDeliveryHref(order.id))}>배송 조회 <span aria-hidden="true">›</span></a></div></td></tr>) : <tr><td className="order-list-empty" colSpan={5}><MemberArtwork cutout part="box" /><strong>조회된 주문 내역이 없습니다.</strong><p>다른 기간을 선택하거나 검색 조건을 변경해 보세요.</p></td></tr>}</tbody></table></div>
    </div></main>
    <HomeFooter />
  </div>
}

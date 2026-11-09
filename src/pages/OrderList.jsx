import { useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import MyPageSidebar from '../components/MyPageSidebar'
import OrderProductImage from '../components/OrderProductImage'
import { orderDetailHref, orderDeliveryHref, orderMoney } from '../orderData'
import { displayOrders, isOrderPreview, orderSummaryItems } from '../orderPreview'
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
  const params = new URLSearchParams(window.location.search)
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

export default function OrderList() {
  const [filter, setFilter] = useState(initialFilter)
  const [draft, setDraft] = useState(initialFilter)
  const [error, setError] = useState('')
  const orders = displayOrders().filter(order => {
    const day = orderDay(order.orderedAt)
    return (!filter.start || day >= filter.start) && (!filter.end || day <= filter.end)
  }).sort((a, b) => orderDay(b.orderedAt).localeCompare(orderDay(a.orderedAt)))
  function apply(next) {
    setFilter(next); setDraft(next); setError('')
    const url = new URL(window.location.href)
    const realOnly = url.searchParams.get('preview') === '0'
    url.search = ''
    if (realOnly) url.searchParams.set('preview', '0')
    url.searchParams.set('range', next.range)
    if (next.range === 'custom') {
      if (next.start) url.searchParams.set('start', next.start)
      if (next.end) url.searchParams.set('end', next.end)
    }
    window.history.replaceState(null, '', url)
  }
  function choosePeriod(range) {
    const end = todayKey()
    apply(range === 'all' ? { range, start: '', end: '' } : { range, start: monthsAgo(end, Number(range)), end })
  }
  function search(event) {
    event.preventDefault()
    if (draft.start && draft.end && draft.start > draft.end) { setError('시작일은 종료일보다 늦을 수 없습니다.'); return }
    apply({ ...draft, range: 'custom' })
  }
  return <div className="mypage-page order-list-page">
    <HomeHeader />
    <main className="mypage-layout"><MyPageSidebar /><div className="mypage-content order-list-content">
      <h1>주문 내역 / 배송 조회</h1>
      <p className="order-list-intro">기간별 주문 내역과 배송 상태를 확인하실 수 있습니다.</p>
      <div className="order-list-periods" role="group" aria-label="주문 조회 기간">{periods.map(([range, label]) => <button type="button" key={range} aria-pressed={draft.range === range} onClick={() => choosePeriod(range)}>{label}</button>)}</div>
      <form className="order-list-date-filter" onSubmit={search}><input type="date" aria-label="주문 조회 시작일" value={draft.start} onChange={event => setDraft({ ...draft, range: 'custom', start: event.target.value })} /><span aria-hidden="true">~</span><input type="date" aria-label="주문 조회 종료일" value={draft.end} onChange={event => setDraft({ ...draft, range: 'custom', end: event.target.value })} /><button type="submit">조회</button></form>
      <p className="order-list-filter-error" role="alert">{error}</p>
      <div className="order-list-table-card"><table><caption className="mypage-sr-only">기간별 주문 내역</caption><colgroup><col className="order-list-date-col" /><col className="order-list-product-col" /><col /><col /><col /></colgroup><thead><tr>{['주문일자', '상품정보', '결제금액', '배송상태', '주문관리'].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead><tbody>{orders.length ? orders.map(order => <tr key={order.id} data-order-id={order.id}><td><time>{orderDay(order.orderedAt).replaceAll('-', '.')}</time></td><td><div className="order-list-products">{orderSummaryItems(order).map((item, index) => <a className="order-list-product" href={orderDetailHref(order.id)} key={`${item.id}-${index}`}><div className="order-list-photo"><OrderProductImage item={item} /></div><div><h2>{item.koreanName}</h2><p>{item.option || item.description || '기본 구성'} · {item.quantity}개</p></div></a>)}</div></td><td className="order-list-paid">{orderMoney(order.payment?.total)}</td><td><span className="order-list-status">{order.shipment?.statusLabel || '정보 없음'}</span></td><td><div className="order-list-management"><a href={orderDetailHref(order.id)}>주문 상세</a><a href={orderDeliveryHref(order.id)}>배송 조회</a></div></td></tr>) : <tr><td className="order-list-empty" colSpan={5}>조회 기간 내 주문 내역이 없습니다</td></tr>}</tbody></table></div>
    </div></main>
    <HomeFooter />
  </div>
}

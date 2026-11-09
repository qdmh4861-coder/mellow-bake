import { useRef, useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import MyPageSidebar from '../components/MyPageSidebar'
import OrderProductImage from '../components/OrderProductImage'
import bunny from '../assets/our-story/bunny.png'
import { paymentHistory, refundHistory } from '../paymentData'
import { orderDetailHref, orderMoney } from '../orderData'
import './MyPage.css'
import './Claims.css'
import './PaymentHistory.css'

function periodDates(months) {
  const parts = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date())
  const end = ['year', 'month', 'day'].map(type => parts.find(part => part.type === type).value).join('-')
  const date = new Date(`${end}T00:00:00Z`), start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() - months, 1))
  start.setUTCDate(Math.min(date.getUTCDate(), new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0)).getUTCDate()))
  return { start: start.toISOString().slice(0, 10), end }
}
function validDay(value) { return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value }
function PaymentCake() { return <svg viewBox="0 0 80 80" aria-hidden="true"><ellipse cx="40" cy="65" rx="33" ry="8" fill="#ffe9c4" stroke="#a96e35" strokeWidth="2" /><path d="M15 31h50v31H15Z" fill="#fff5da" stroke="#8e4139" strokeWidth="3" /><path d="M15 43h50m-50 9h50" stroke="#ff91b3" strokeWidth="6" /><ellipse cx="40" cy="30" rx="25" ry="8" fill="#fffaf3" stroke="#8e4139" strokeWidth="3" /><path d="M31 24c-3-11 9-24 12-19 13 13 9 23 0 23-5 0-9-1-12-4Z" fill="#ff6e99" stroke="#8e4139" strokeWidth="2" /></svg> }
export default function PaymentHistory() {
  const [tab, setTab] = useState('payments')
  const [period, setPeriod] = useState('3')
  const [draft, setDraft] = useState(() => periodDates(3))
  const [range, setRange] = useState(() => periodDates(3))
  const [page, setPage] = useState(1)
  const [error, setError] = useState('')
  const list = useRef(null)
  const refund = tab === 'refunds'
  const rows = refund ? refundHistory() : paymentHistory()
  const filtered = rows.filter(row => row.date && row.date >= range.start && row.date <= range.end).sort((a, b) => b.date.localeCompare(a.date))
  const pageCount = Math.ceil(filtered.length / 5), currentPage = Math.min(page, Math.max(1, pageCount))
  function search(event) {
    event.preventDefault()
    if (!validDay(draft.start) || !validDay(draft.end)) { setError('시작일과 종료일을 올바르게 선택해 주세요.'); return }
    if (draft.start > draft.end) { setError('시작일은 종료일보다 늦을 수 없습니다.'); return }
    setRange(draft); setPage(1); setError('')
  }
  function go(next) { if (next < 1 || next > pageCount) return; setPage(next); list.current?.scrollIntoView({ block: 'start' }) }
  return <div className="mypage-page claims-page payments-page"><HomeHeader /><header className="claims-banner"><img src={bunny} alt="" /><span aria-hidden="true">♡ ✧</span><div><h1>마이페이지</h1><p>My Page</p></div><span aria-hidden="true">♡</span><PaymentCake /></header><main className="mypage-layout claims-layout"><MyPageSidebar /><div className="mypage-content"><section className="claims-card"><header className="claims-heading"><div><h2><span aria-hidden="true">▤</span> 환불 / 결제 내역</h2><p>결제하신 주문의 결제 정보와 환불 처리 내역을 확인하실 수 있습니다.</p></div><div className="payments-card-art" aria-hidden="true">▰<span>₩</span></div></header>
    {paymentHistory().some(row => row.isPreview) && <p className="claims-demo-note">결제 내역은 포트폴리오 시연용 예시입니다. 실제 결제나 환불을 실행하지 않으며, 예시 금액은 현재 상품 판매 가격과 별도입니다.</p>}
    <div className="claims-tabs payments-tabs" role="group" aria-label="내역 구분">{[['payments', '결제 내역'], ['refunds', '환불 내역']].map(([value, label]) => <button type="button" key={value} aria-pressed={tab === value} onClick={() => { setTab(value); setPage(1) }}>{label}</button>)}</div>
    <form className="claims-search" onSubmit={search} noValidate><label className="mypage-sr-only" htmlFor="payments-period">조회 기간</label><select id="payments-period" value={period} onChange={event => { setPeriod(event.target.value); if (event.target.value !== 'custom') setDraft(periodDates(Number(event.target.value))) }}>{[['1', '최근 1개월'], ['3', '최근 3개월'], ['6', '최근 6개월'], ['custom', '직접 선택']].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><label className="mypage-sr-only" htmlFor="payments-start">시작일</label><input id="payments-start" type="date" value={draft.start} onChange={event => { setPeriod('custom'); setDraft(old => ({ ...old, start: event.target.value })) }} /><span>~</span><label className="mypage-sr-only" htmlFor="payments-end">종료일</label><input id="payments-end" type="date" value={draft.end} onChange={event => { setPeriod('custom'); setDraft(old => ({ ...old, end: event.target.value })) }} /><button type="submit">⌕ 조회</button></form><p className="claims-error" role="alert">{error}</p>
    <div className="claims-table-wrap" ref={list}><table className="claims-table payments-table"><caption className="mypage-sr-only">{refund ? '환불 내역' : '결제 내역'}</caption><thead><tr>{[refund ? '환불 신청일' : '주문일자', '주문번호', '상품정보', refund ? '환불금액' : '결제금액', refund ? '환불수단' : '결제수단', refund ? '환불상태' : '결제상태', '상세보기'].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead><tbody>{filtered.length ? filtered.slice((currentPage - 1) * 5, currentPage * 5).map(row => <tr key={row.id} data-payment-id={row.id}><td data-label={refund ? '환불 신청일' : '주문일자'}><time dateTime={row.date}>{row.date.replaceAll('-', '.')}</time></td><td data-label="주문번호">{row.number}</td><td data-label="상품정보"><div className="claims-product"><div className="claims-photo payments-photo">{row.items[0] && <OrderProductImage item={row.items[0]} />}</div><strong>{row.items[0]?.koreanName || '상품 정보 없음'}{row.items.length > 1 ? ` 외 ${row.items.length - 1}종` : row.items[0] ? ` (${row.items[0].quantity}개)` : ''}</strong></div></td><td data-label={refund ? '환불금액' : '결제금액'}><strong>{orderMoney(row.amount)}</strong></td><td data-label={refund ? '환불수단' : '결제수단'}>{row.method === '네이버페이' && <span className="payments-naver" aria-hidden="true">N</span>}{row.method}</td><td data-label={refund ? '환불상태' : '결제상태'}><span className="payments-status">{row.status}</span></td><td><a className="claims-detail-button" href={`${orderDetailHref(row.orderId)}${refund ? `&refundId=${encodeURIComponent(row.id)}` : ''}`}>상세보기 ›</a></td></tr>) : <tr><td colSpan={7} className="claims-empty">{refund && !rows.length ? '환불 내역이 없습니다.' : '조회된 내역이 없습니다.'}</td></tr>}</tbody></table></div>
    {pageCount > 0 && <nav className="claims-pagination" aria-label="결제 환불 내역 페이지"><button type="button" disabled={currentPage === 1} aria-label="이전 페이지" onClick={() => go(currentPage - 1)}>‹</button>{Array.from({ length: pageCount }, (_, index) => <button type="button" key={index} aria-current={currentPage === index + 1 ? 'page' : undefined} onClick={() => go(index + 1)}>{index + 1}</button>)}<button type="button" disabled={currentPage === pageCount} aria-label="다음 페이지" onClick={() => go(currentPage + 1)}>›</button></nav>}<div className="claims-bottom-art" aria-hidden="true">♡ ✧ <img src={bunny} alt="" /></div>
    </section></div></main><HomeFooter /></div>
}

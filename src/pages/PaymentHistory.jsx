import MemberCutout from '../components/MemberCutout'
import MemberDecoration from '../components/MemberDecoration'
import { useEffect, useRef, useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import MyPageSidebar from '../components/MyPageSidebar'
import OrderProductImage from '../components/OrderProductImage'
import { paymentHistory, refundHistory, paymentExampleOrder } from '../paymentData'
import { getOrder, orderDetailHref, orderMoney } from '../orderData'
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
function PaymentPhoto({ item }) {
  const [failed, setFailed] = useState(false)
  const missing = !item
  return <div className="claims-photo payments-photo" onErrorCapture={() => setFailed(true)}>{missing || failed ? <span className="payment-history-photo-placeholder" role="img" aria-label={`${item?.koreanName || '상품'} 원본 이미지 준비 중`}><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M5 11h19v10a8 8 0 0 1-8 8h-3a8 8 0 0 1-8-8V11Zm19 2h3c6 0 5 9-3 9M10 7V3m6 4V2m6 5V3" /></svg><small>원본 필요</small></span> : <OrderProductImage item={item} />}</div>
}
function SearchIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="10" cy="10" r="6.5" /><path d="m15 15 6 6" /></svg> }
const knownMoney = value => Number.isFinite(value) ? orderMoney(value) : '정보 없음'
function statusClass(value = '') { return value.includes('환불') ? 'refund' : value.includes('취소') ? 'cancelled' : value.includes('대기') ? 'pending' : 'paid' }
export default function PaymentHistory() {
  const [tab, setTab] = useState('payments')
  const [period, setPeriod] = useState('3')
  const [draft, setDraft] = useState(() => periodDates(3))
  const [range, setRange] = useState(() => periodDates(3))
  const [page, setPage] = useState(1)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const detail = useRef(null)
  useEffect(() => {
    if (!selected) return
    const element = detail.current, old = document.body.style.overflow
    element.showModal(); document.body.style.overflow = 'hidden'
    return () => { element.close(); document.body.style.overflow = old }
  }, [selected])
  const list = useRef(null)
  const refund = tab === 'refunds'
  const rows = refund ? refundHistory() : paymentHistory()
  const filtered = rows.filter(row => row.date && row.date >= range.start && row.date <= range.end).sort((a, b) => b.date.localeCompare(a.date))
  const pageCount = Math.ceil(filtered.length / 5), currentPage = Math.min(page, Math.max(1, pageCount))
  const selectedOrder = selected ? getOrder(selected.row.orderId) || (selected.row.isPreview ? paymentExampleOrder(selected.row.orderId) : null) : null
  const selectedRefund = selected?.refund ? selectedOrder?.refunds?.find(item => item.id === selected.row.id) : null
  const confirmedRefund = selectedRefund?.confirmedAmount ?? (selected?.row.status.includes('완료') ? selected.row.amount : undefined)
  function openDetail(event, row) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault(); setSelected({ row, refund })
  }
  function search(event) {
    event.preventDefault()
    if (!validDay(draft.start) || !validDay(draft.end)) { setError('시작일과 종료일을 올바르게 선택해 주세요.'); return }
    if (draft.start > draft.end) { setError('시작일은 종료일보다 늦을 수 없습니다.'); return }
    setRange(draft); setPage(1); setError('')
  }
  function go(next) { if (next < 1 || next > pageCount) return; setPage(next); list.current?.scrollIntoView({ block: 'start' }) }
  return <div className="mypage-page claims-page payments-page payment-history-final"><HomeHeader /><main className="mypage-layout claims-layout"><MyPageSidebar /><div className="mypage-content"><section className="claims-card"><header className="payment-history-banner"><MemberCutout name="paymentRabbit" className="payment-history-art" /><div><h1>환불 / 결제 내역</h1><p>결제하신 주문의 결제 정보와 환불 처리 내역을 확인하실 수 있습니다.</p></div><MemberCutout name="paymentSymbols" className="payment-history-art" /><span aria-hidden="true">✧ ♡</span></header>
    {paymentHistory().some(row => row.isPreview) && <p className="claims-demo-note">결제 내역은 포트폴리오 시연용 예시입니다. 실제 결제나 환불을 실행하지 않으며, 예시 금액은 현재 상품 판매 가격과 별도입니다.</p>}
    <div className="claims-tabs payments-tabs" role="group" aria-label="내역 구분">{[['payments', '결제 내역'], ['refunds', '환불 내역']].map(([value, label]) => <button type="button" key={value} aria-pressed={tab === value} onClick={() => { setTab(value); setPage(1) }}>{label}</button>)}</div>
    <form className="claims-search" onSubmit={search} noValidate><label className="mypage-sr-only" htmlFor="payments-period">조회 기간</label><select id="payments-period" value={period} onChange={event => { setPeriod(event.target.value); if (event.target.value !== 'custom') setDraft(periodDates(Number(event.target.value))) }}>{[['1', '최근 1개월'], ['3', '최근 3개월'], ['6', '최근 6개월'], ['custom', '직접 선택']].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><label className="mypage-sr-only" htmlFor="payments-start">시작일</label><input id="payments-start" type="date" value={draft.start} onChange={event => { setPeriod('custom'); setDraft(old => ({ ...old, start: event.target.value })) }} /><span>~</span><label className="mypage-sr-only" htmlFor="payments-end">종료일</label><input id="payments-end" type="date" value={draft.end} onChange={event => { setPeriod('custom'); setDraft(old => ({ ...old, end: event.target.value })) }} /><button type="submit"><SearchIcon />조회</button></form><p className="claims-error" role="alert">{error}</p>
    <div className="claims-table-wrap" ref={list}><table className="claims-table payments-table"><caption className="mypage-sr-only">{refund ? '환불 내역' : '결제 내역'}</caption><thead><tr>{[refund ? '환불 신청일' : '주문일자', '주문번호', '상품정보', refund ? '환불금액' : '결제금액', refund ? '환불수단' : '결제수단', refund ? '환불상태' : '결제상태', '상세보기'].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead><tbody>{filtered.length ? filtered.slice((currentPage - 1) * 5, currentPage * 5).map(row => <tr key={row.id} data-payment-id={row.id}><td data-label={refund ? '환불 신청일' : '주문일자'}><time dateTime={row.date}>{row.date.replaceAll('-', '.')}</time></td><td data-label="주문번호">{row.number}</td><td data-label="상품정보"><div className="claims-product"><PaymentPhoto item={row.items[0]} /><strong>{row.items[0]?.koreanName || '상품 정보 없음'}{row.items.length > 1 ? ` 외 ${row.items.length - 1}종` : row.items[0] ? ` (${row.items[0].quantity}개)` : ''}</strong></div></td><td data-label={refund ? '환불금액' : '결제금액'}><strong>{orderMoney(row.amount)}</strong></td><td data-label={refund ? '환불수단' : '결제수단'}><span className="payment-history-method">{row.method === '네이버페이' && <span className="payments-naver" aria-hidden="true">N</span>}{row.method}</span></td><td data-label={refund ? '환불상태' : '결제상태'}><span className={`payments-status payments-status--${statusClass(row.status)}`}>{row.status}</span></td><td><a className="claims-detail-button" href={`${orderDetailHref(row.orderId)}${refund ? `&refundId=${encodeURIComponent(row.id)}` : ''}`} onClick={event => openDetail(event, row)}>상세보기 ›</a></td></tr>) : <tr><td colSpan={7} className="claims-empty"><span className="payment-history-empty-heart" aria-hidden="true">♡</span><strong>{refund ? '환불 내역이 없습니다.' : '조회된 내역이 없습니다.'}</strong><p>{refund ? '선택한 기간에 해당하는 환불 내역이 없습니다.' : '다른 기간을 선택하거나 검색 조건을 변경해 보세요.'}</p></td></tr>}</tbody></table></div>
    {pageCount > 0 && <nav className="claims-pagination" aria-label="결제 환불 내역 페이지"><button type="button" disabled={currentPage === 1} aria-label="이전 페이지" onClick={() => go(currentPage - 1)}>‹</button>{Array.from({ length: pageCount }, (_, index) => <button type="button" key={index} aria-label={`${index + 1}페이지`} aria-current={currentPage === index + 1 ? 'page' : undefined} onClick={() => go(index + 1)}>{index + 1}</button>)}<button type="button" disabled={currentPage === pageCount} aria-label="다음 페이지" onClick={() => go(currentPage + 1)}>›</button></nav>}<MemberDecoration variant="payments" />
    </section></div></main><HomeFooter />
    <dialog className="payment-history-dialog" ref={detail} aria-labelledby="payment-history-detail-title" onCancel={event => { event.preventDefault(); setSelected(null) }}><button type="button" className="payment-history-close" aria-label="내역 상세 닫기" onClick={() => setSelected(null)}>×</button>{selected && <><h2 id="payment-history-detail-title">{selected.refund ? '환불' : '결제'} 상세</h2><p className="payment-history-detail-note">{selected.row.isPreview ? '포트폴리오 시연용 결제 내역입니다.' : '기존 주문에 저장된 내역입니다.'} 실제 결제나 환불을 실행하지 않습니다.</p><dl className="payment-history-detail-meta">{[['주문번호', selected.row.number], ['주문일자', selectedOrder?.orderedAt || selected.row.date], [selected.refund ? '환불상태' : '결제상태', selected.row.status]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || '정보 없음'}</dd></div>)}</dl><section className="payment-history-detail-items" aria-label="주문 상품">{selected.row.items.map((item, index) => <article key={`${item.id}-${index}`}><PaymentPhoto item={item} /><div><h3>{item.koreanName || '상품 정보 없음'}</h3><p>{item.option || item.description || '옵션 정보 없음'}</p><p>수량 {item.quantity ?? '정보 없음'}개 · 상품금액 {knownMoney(Number.isFinite(item.unitPrice) && Number.isFinite(item.quantity) ? item.unitPrice * item.quantity : undefined)}</p></div></article>)}</section><dl className="payment-history-detail-values">{(selected.refund ? [['환불 신청일', selectedRefund?.requestedAt || selected.row.date], ['환불 사유', selectedRefund?.reason], ['환불 신청금액', knownMoney(selectedRefund?.requestedAmount)], ['환불 확정금액', knownMoney(confirmedRefund)], ['환불수단', selected.row.method], ['환불상태', selected.row.status], ['환불 완료일', selectedRefund?.completedAt], ['처리 진행 내용', selectedRefund?.progress || selectedRefund?.note]] : [['상품금액', knownMoney(selectedOrder?.payment?.subtotal)], ['할인금액', knownMoney(selectedOrder?.payment?.discount)], ['배송비', knownMoney(selectedOrder?.payment?.shippingFee)], ['최종 결제금액', knownMoney(selected.row.amount)], ['결제수단', selected.row.method], ['결제상태', selected.row.status], ['결제일시', selectedOrder?.payment?.paidAt || selected.row.date]]).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || '정보 없음'}</dd></div>)}</dl><div className="payment-history-dialog-actions"><button type="button" onClick={() => setSelected(null)}>목록으로 돌아가기</button><a href={`${orderDetailHref(selected.row.orderId)}${selected.refund ? `&refundId=${encodeURIComponent(selected.row.id)}` : ''}`}>주문 상세보기 ›</a></div></>}</dialog>
    </div>
}


import MemberProductImage from '../components/MemberProductImage'
import MemberCutout from '../components/MemberCutout'
import MemberDecoration from '../components/MemberDecoration'
import { useEffect, useRef, useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import MyPageSidebar from '../components/MyPageSidebar'
import blueberry from '../assets/new-menu/blueberry-cheesecake.png'
import './MyPage.css'
import './Claims.css'

// Isolated portfolio examples. Not member orders, refunds, or claim processing records.
const examples = [
  { id: 'example-cancel', orderId: 'MB251105-0034', date: '2026-11-05', name: '초코 롤케이크', price: 8500, quantity: 1, type: '취소', status: '처리완료', image: null, photoBox: '673 412 84 78', requestedImage: '/images/claims/chocolate-roll-cake.png', progress: '예시 취소 신청 내역의 표시 상태는 처리완료입니다. 실제 주문 취소나 환불은 실행되지 않았습니다.' },
  { id: 'example-return', orderId: 'MB251028-0019', date: '2026-10-28', name: '딸기 타르트', price: 9200, quantity: 1, type: '반품', status: '반품 진행중', image: null, photoBox: '673 506 84 78', requestedImage: '/images/claims/strawberry-tart.png', progress: '예시 반품 신청 내역의 표시 상태는 반품 진행중입니다. 실제 수거·반품·환불은 실행되지 않았습니다.' },
  { id: 'example-exchange', orderId: 'MB251020-0067', date: '2026-10-20', name: '블루베리 치즈케이크', price: 8900, quantity: 1, type: '교환', status: '교환완료', image: blueberry, progress: '예시 교환 신청 내역의 표시 상태는 교환완료입니다. 실제 교환 출고나 배송은 실행되지 않았습니다.' },
]
const types = ['전체', '취소', '반품', '교환']
const money = value => `${value.toLocaleString('ko-KR')}원`
function today() {
  const parts = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date())
  return ['year', 'month', 'day'].map(key => parts.find(part => part.type === key).value).join('-')
}
function rangeFor(months) {
  const end = today(), date = new Date(`${end}T00:00:00Z`)
  const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() - months, 1))
  const lastDay = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0)).getUTCDate()
  start.setUTCDate(Math.min(date.getUTCDate(), lastDay))
  return { start: start.toISOString().slice(0, 10), end }
}
function validDate(value) { return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value }
function ClaimPhoto({ item }) { return <div className="claims-photo"><MemberProductImage item={{ koreanName: item.name }} /></div> }
function SearchIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="10" cy="10" r="6.5" /><path d="m15 15 6 6" /></svg> }
export default function Claims() {
  const [type, setType] = useState('전체')
  const [period, setPeriod] = useState('3')
  const [draft, setDraft] = useState(() => rangeFor(3))
  const [range, setRange] = useState(() => rangeFor(3))
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)
  const dialog = useRef(null)
  const list = useRef(null)
  useEffect(() => {
    if (!selected) return
    const element = dialog.current, old = document.body.style.overflow
    element.showModal(); document.body.style.overflow = 'hidden'
    return () => { element.close(); document.body.style.overflow = old }
  }, [selected])
  const filtered = examples.filter(item => (type === '전체' || item.type === type) && (!range.start || item.date >= range.start) && (!range.end || item.date <= range.end)).sort((a, b) => b.date.localeCompare(a.date))
  const pageCount = Math.ceil(filtered.length / 5)
  const currentPage = Math.min(page, Math.max(1, pageCount))
  function search(event) {
    event.preventDefault()
    if (!validDate(draft.start) || !validDate(draft.end)) { setError('시작일과 종료일을 올바르게 선택해 주세요.'); return }
    if (draft.start > draft.end) { setError('시작일은 종료일보다 늦을 수 없습니다.'); return }
    setRange(draft); setPage(1); setError('')
  }
  function go(next) { if (next < 1 || next > pageCount) return; setPage(next); list.current?.scrollIntoView({ block: 'start' }) }
  return <div className="mypage-page claims-page claims-final-page"><HomeHeader /><main className="mypage-layout claims-layout"><MyPageSidebar /><div className="mypage-content claims-content"><section className="claims-card"><header className="claims-final-banner"><MemberCutout name="rabbit" className="member-art" /><div><h1>취소 / 반품 / 교환 내역</h1><p>주문하신 상품의 취소, 반품, 교환 신청 내역을 확인하실 수 있습니다.</p></div><MemberCutout name="desserts" className="member-art" /><span aria-hidden="true">✧ ♡</span></header>
    <p className="claims-demo-note">포트폴리오 시연용 예시 내역입니다. 실제 주문·결제·환불 정보가 아닙니다.</p>
    <div className="claims-tabs" role="group" aria-label="신청 유형">{types.map(label => <button type="button" key={label} aria-pressed={type === label} onClick={() => { setType(label); setPage(1) }}>{label}</button>)}</div>
    <form className="claims-search" onSubmit={search} noValidate><label className="mypage-sr-only" htmlFor="claims-period">조회 기간</label><select id="claims-period" value={period} onChange={event => { const value = event.target.value; setPeriod(value); if (value !== 'custom') setDraft(rangeFor(Number(value))) }}>{[['1', '최근 1개월'], ['3', '최근 3개월'], ['6', '최근 6개월'], ['custom', '직접 선택']].map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select><label className="mypage-sr-only" htmlFor="claims-start">시작일</label><input id="claims-start" type="date" required value={draft.start} onChange={event => { setPeriod('custom'); setDraft(old => ({ ...old, start: event.target.value })) }} /><span>~</span><label className="mypage-sr-only" htmlFor="claims-end">종료일</label><input id="claims-end" type="date" required value={draft.end} onChange={event => { setPeriod('custom'); setDraft(old => ({ ...old, end: event.target.value })) }} /><button type="submit"><SearchIcon />조회</button></form><p className="claims-error" role="alert">{error}</p>
    <div ref={list} className="claims-table-wrap"><table className="claims-table"><caption className="mypage-sr-only">취소 반품 교환 예시 신청 목록</caption><thead><tr>{['신청일자', '주문번호', '상품정보', '신청유형', '처리상태', '상세보기'].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead><tbody>{filtered.length ? filtered.slice((currentPage - 1) * 5, currentPage * 5).map(item => <tr key={item.id} data-claim-id={item.id}><td data-label="신청일자"><time dateTime={item.date}>{item.date.replaceAll('-', '.')}</time></td><td data-label="주문번호">{item.orderId}</td><td data-label="상품정보"><div className="claims-product"><ClaimPhoto item={item} /><div><strong>{item.name} ({item.quantity}개)</strong><p>{money(item.price)}</p></div></div></td><td data-label="신청유형"><span className={`claims-type claims-type--${types.indexOf(item.type)}`}>{item.type}</span></td><td data-label="처리상태"><span className={`claims-status${item.type === '반품' ? ' claims-status--pending' : ''}`}>{item.status}</span></td><td><button className="claims-detail-button" type="button" onClick={() => setSelected(item)}>상세보기 ›</button></td></tr>) : <tr><td className="claims-empty" colSpan={6}>조회된 내역이 없습니다.</td></tr>}</tbody></table></div>
    {pageCount > 0 && <nav className="claims-pagination" aria-label="내역 페이지"><button type="button" aria-label="이전 페이지" disabled={currentPage === 1} onClick={() => go(currentPage - 1)}>‹</button>{Array.from({ length: pageCount }, (_, index) => <button type="button" key={index} aria-label={`${index + 1}페이지`} aria-current={currentPage === index + 1 ? 'page' : undefined} onClick={() => go(index + 1)}>{index + 1}</button>)}<button type="button" aria-label="다음 페이지" disabled={currentPage === pageCount} onClick={() => go(currentPage + 1)}>›</button></nav>}<MemberDecoration variant="claims" />
  </section></div></main><HomeFooter /><dialog className="claims-detail-dialog" ref={dialog} aria-labelledby="claim-detail-title" onClose={() => setSelected(null)}><button type="button" className="claims-dialog-close" aria-label="신청 상세 닫기" onClick={() => setSelected(null)}>×</button>{selected && <><h2 id="claim-detail-title">{selected.type} 신청 상세</h2><p className="claims-demo-note">포트폴리오 시연용 예시</p><div className="claims-product"><ClaimPhoto item={selected} /><strong>{selected.name}</strong></div><dl>{[['주문번호', selected.orderId], ['수량', `${selected.quantity}개`], ['상품 가격', money(selected.price)], ['상품 합계', money(selected.price * selected.quantity)], ['신청 유형', selected.type], ['신청일', selected.date.replaceAll('-', '.')], ['처리 상태', selected.status], ['처리 진행 내용', selected.progress]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><button className="claims-dialog-confirm" type="button" onClick={() => setSelected(null)}>확인</button></>}</dialog></div>
}



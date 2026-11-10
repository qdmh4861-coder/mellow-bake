import MemberCutout from '../components/MemberCutout'
import MemberDecoration from '../components/MemberDecoration'
import { useEffect, useRef, useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import MyPageSidebar from '../components/MyPageSidebar'
import OrderProductImage from '../components/OrderProductImage'
import { getInquiries, inquiryTypes } from '../inquiryData'
import './MyPage.css'
import './Claims.css'
import './InquiryHistory.css'

// Display-only examples. Never inserted into the user's stored inquiries.
const examples = [
  { id: 'example-delivery', number: 'Q-000345', type: '배송 문의', title: '주문한 상품의 배송 일정이 궁금해요.', createdAt: '2026-11-08T03:00:00.000Z', status: '답변 완료', body: '주문한 상품의 배송 일정이 궁금해요.', reply: '안녕하세요, MELLOW BAKE입니다. 문의하신 주문의 배송 일정은 주문 상세페이지에서 확인하실 수 있습니다. 실제 배송 일정은 주문 상태에 따라 달라질 수 있습니다.', photos: [], isExample: true },
  { id: 'example-product', number: 'Q-000344', type: '상품 문의', title: '소금빵 보관 방법이 궁금합니다.', createdAt: '2026-11-05T03:00:00.000Z', status: '답변 완료', body: '소금빵을 구매했는데, 남은 후에 어떻게 보관하는 게 가장 맛있게 먹을 수 있는지 궁금해요! 냉장 보관해도 되는지, 권장 보관 기간도 알려주세요.', reply: '안녕하세요, MELLOW BAKE입니다. 😊\n소금빵은 구매 후 가급적 당일 섭취를 권장드리며, 보관이 필요한 경우 아래 방법을 추천드립니다.\n\n실온 보관: 당일 섭취 시 밀봉하여 서늘한 곳에 보관\n냉동 보관: 개별 포장 후 냉동 보관, 가급적 1~2일 이내 섭취 권장\n섭취 방법: 냉동된 소금빵은 자연 해동 후 오븐이나 에어프라이어에 3~5분 정도 데워 드시면 더욱 맛있게 즐기실 수 있습니다.\n\n더 궁금한 점이 있으시면 언제든지 다시 문의해 주세요!\n항상 MELLOW BAKE를 이용해 주셔서 감사합니다. 💗\n\n위 내용은 디자이너가 제공한 시연용 예시 답변입니다. 실제 상품의 보관 안내를 우선 확인해 주세요.', photos: [], productPhoto: true, isExample: true },
  { id: 'example-cancel', number: 'Q-000343', type: '취소 / 반품 / 교환 문의', displayType: '취소 / 교환 문의', title: '주문 취소 가능한지 문의드려요.', createdAt: '2026-10-30T03:00:00.000Z', status: '답변 완료', body: '주문 취소 가능한지 문의드려요.', reply: '안녕하세요, MELLOW BAKE입니다. 주문 취소 가능 여부는 상품의 준비 및 배송 상태에 따라 달라집니다. 주문 상세페이지에서 현재 상태를 확인해 주세요.', photos: [], isExample: true },
  { id: 'example-coupon', number: 'Q-000342', type: '쿠폰 / 포인트 문의', title: '쿠폰 사용 조건이 어떻게 되나요?', createdAt: '2026-10-27T03:00:00.000Z', body: '보유한 쿠폰의 사용 조건과 유효기간은 어디서 확인할 수 있나요?', photos: [], isExample: true },
  { id: 'example-profile', number: 'Q-000341', type: '회원정보 문의', title: '회원정보(이메일)를 변경하고 싶어요.', createdAt: '2026-10-24T03:00:00.000Z', body: '회원정보의 이메일을 변경하는 방법이 궁금합니다.', reply: '안녕하세요, MELLOW BAKE입니다. 마이페이지의 회원정보 변경에서 입력 화면을 확인할 수 있습니다. 현재는 프론트엔드 데모로, 실제 회원 서버의 이메일 변경은 지원하지 않습니다.', photos: [], isExample: true },
]
function dateKey(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const parts = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date)
  return ['year', 'month', 'day'].map(type => parts.find(part => part.type === type).value).join('-')
}
function Status({ value }) { return <span className={`inquiry-history-status${value === '답변 완료' ? ' is-answered' : ''}`}>{value || '답변 대기'}</span> }
function TypeIcon({ type }) {
  return <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{type === '배송 문의' ? <><path d="M2 20V6h15v14M17 10h5l4 5v5h-5M7 20h9" /><circle cx="6" cy="21" r="3" /><circle cx="20" cy="21" r="3" /></> : type.includes('취소') ? <><path d="M5 10a10 10 0 0 1 17-4l3 4M3 8l2 4 5-1M23 18A10 10 0 0 1 6 22l-3-4m22 2-2-4-5 1" /></> : <><path d="m3 8 11-6 11 6v13l-11 6-11-6V8Zm0 0 11 6 11-6M14 14v13M8 5l11 6v6" /></>}</svg>
}
function Attachments({ inquiry }) {
  const [urls, setUrls] = useState([])
  const [expanded, setExpanded] = useState(null)
  const viewer = useRef(null)
  useEffect(() => { if (!expanded) return; viewer.current?.showModal(); const old = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = old } }, [expanded])
  useEffect(() => {
    const images = (inquiry.photos || []).filter(photo => photo.blob instanceof Blob).map(photo => ({ url: URL.createObjectURL(photo.blob), name: photo.name }))
    setUrls(images)
    return () => images.forEach(image => URL.revokeObjectURL(image.url))
  }, [inquiry])
  return <><div className="inquiry-history-photos">{inquiry.productPhoto && <button type="button" aria-label="소금빵 사진 확대" className="inquiry-history-example-photo" onClick={() => setExpanded({ product: true })}><OrderProductImage fit="contain" item={{ id: 'bread-1', koreanName: '소금빵' }} /></button>}{urls.map((image, index) => <button type="button" onClick={() => setExpanded(image)} key={index} aria-label={`첨부 사진 ${index + 1} 원본 보기`}><img src={image.url} alt={image.name || `첨부 사진 ${index + 1}`} /></button>)}</div><dialog ref={viewer} className="inquiry-history-viewer" onClose={() => setExpanded(null)} onClick={event => { if (event.target === event.currentTarget) { viewer.current.close(); setExpanded(null) } }}><button type="button" aria-label="닫기" onClick={() => { viewer.current.close(); setExpanded(null) }}>&times;</button>{expanded?.product ? <OrderProductImage fit="contain" item={{ id: "bread-1", koreanName: "소금빵" }} /> : expanded && <img src={expanded.url} alt={expanded.name || "첨부 사진"} />}</dialog></>
}
export default function InquiryHistory() {
  const [stored, setStored] = useState(null), [loadError, setLoadError] = useState('')
  const [type, setType] = useState(''), [start, setStart] = useState(''), [end, setEnd] = useState('')
  const [range, setRange] = useState({ start: '', end: '', type: '' }), [filterError, setFilterError] = useState('')
  const [page, setPage] = useState(1), [selectedId, setSelectedId] = useState(() => new URLSearchParams(window.location.search).get('inquiryId'))
  const detail = useRef(null), list = useRef(null)
  useEffect(() => {
    let active = true, request = 0
    async function load() { const current = ++request; try { const records = await getInquiries(); if (active && current === request) { setStored(records); setLoadError('') } } catch { if (active && current === request) { setStored(null); setLoadError('문의 내역을 불러오지 못했습니다. 브라우저 저장소 접근 설정을 확인한 뒤 새로고침해 주세요.') } } }
    load(); window.addEventListener('focus', load); window.addEventListener('mellow-bake:inquiries-changed', load)
    return () => { active = false; window.removeEventListener('focus', load); window.removeEventListener('mellow-bake:inquiries-changed', load) }
  }, [])
  const usingExamples = stored !== null && stored.length === 0
  const rows = stored === null ? [] : [...stored, ...examples.filter(item => !stored.some(record => record.id === item.id))].map(item => ({ ...item, status: item.reply?.trim() ? "답변 완료" : "답변 대기" }))
  const filtered = rows.filter(item => (!range.type || item.type === range.type) && (!range.start || dateKey(item.createdAt) >= range.start) && (!range.end || dateKey(item.createdAt) <= range.end)).sort((a, b) => (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0))
  const selectedIndex = filtered.findIndex(item => item.id === selectedId)
  const pageCount = Math.ceil(filtered.length / 5), currentPage = Math.min(selectedIndex >= 0 ? Math.floor(selectedIndex / 5) + 1 : page, Math.max(1, pageCount))
  const visible = filtered.slice((currentPage - 1) * 5, currentPage * 5)
  const selected = visible.find(item => item.id === selectedId) || visible.find(item => item.id === 'example-product') || visible[0] || null
  function search(event) {
    event.preventDefault()
    if ((start && dateKey(`${start}T12:00:00Z`) !== start) || (end && dateKey(`${end}T12:00:00Z`) !== end)) { setFilterError('날짜를 올바르게 선택해 주세요.'); return }
    if (start && end && start > end) { setFilterError('시작일은 종료일보다 늦을 수 없습니다.'); return }
    setRange({ start, end, type }); setFilterError(''); setPage(1); setSelectedId(null)
  }
  function select(item) { setSelectedId(item.id); window.history.replaceState(null, '', `/mypage/inquiries?inquiryId=${encodeURIComponent(item.id)}`); detail.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }) }
  function go(next) { if (next < 1 || next > pageCount) return; setPage(next); setSelectedId(null); list.current?.scrollIntoView({ block: 'start' }) }
  return <div className="mypage-page claims-page inquiry-history-page"><HomeHeader /><main className="mypage-layout claims-layout"><MyPageSidebar /><div className="mypage-content"><section className="claims-card inquiry-history-content"><header className="inquiry-history-final-banner"><span className="inquiry-history-awning" aria-hidden="true" /><MemberCutout name="coupon-bunny" /><div><h1><span aria-hidden="true">♡</span> 문의 내역 <span aria-hidden="true">♡</span></h1><p>내가 작성한 1:1 문의와 답변 내용을 확인할 수 있습니다.</p></div><MemberCutout name="wallet-desserts" /></header><div className="inquiry-history-toolbar"><p className="claims-demo-note">{usingExamples ? '프론트엔드 시연용 예시 문의·답변입니다. 실제 고객 상담 기록이 아닙니다.' : '브라우저 저장 문의와 시연용 예시를 구분해 표시합니다. 운영자에게 전송되지 않습니다.'}</p><a href="/mypage/inquiry">+ 1:1 문의하기</a></div><form className="inquiry-history-search" onSubmit={search} noValidate><label className="mypage-sr-only" htmlFor="inquiry-history-type">문의 유형</label><select id="inquiry-history-type" value={type} onChange={event => { setType(event.target.value) }}><option value="">전체 문의</option>{inquiryTypes.filter(label => label !== "환불 문의").map(label => <option key={label}>{label}</option>)}</select><label className="mypage-sr-only" htmlFor="inquiry-history-start">시작일</label><input type="date" id="inquiry-history-start" value={start} onChange={event => { setStart(event.target.value); setPage(1) }} /><span>~</span><label className="mypage-sr-only" htmlFor="inquiry-history-end">종료일</label><input type="date" id="inquiry-history-end" value={end} onChange={event => { setEnd(event.target.value); setPage(1) }} /><button type="submit">⌕ 조회</button></form><p className="inquiry-history-error" role="alert">{filterError || loadError}</p>
    <div className="inquiry-history-table-wrap" ref={list}><table className="inquiry-history-table"><caption className="mypage-sr-only">내 문의 목록</caption><thead><tr>{['문의번호', '문의 유형', '제목', '작성일', '답변 상태', ''].map((label, index) => <th scope="col" key={index}>{label || <span className="mypage-sr-only">상세보기</span>}</th>)}</tr></thead><tbody>{visible.length ? visible.map(item => <tr key={item.id} data-inquiry-id={item.id} className={selected?.id === item.id ? 'is-selected' : ''}><td data-label="문의번호">{item.number}<small className="inquiry-record-source">{item.isExample ? "시연용 예시" : "브라우저 저장"}</small></td><td data-label="문의 유형"><span className="inquiry-history-category"><TypeIcon type={item.type} />{item.displayType || item.type}</span></td><td data-label="제목"><button type="button" onClick={() => select(item)}>{item.title}</button></td><td data-label="작성일"><time dateTime={item.createdAt}>{dateKey(item.createdAt).replaceAll('-', '.')}</time></td><td data-label="답변 상태"><Status value={item.status} /></td><td><button className="inquiry-history-arrow" type="button" aria-label={`${item.number} 상세보기`} onClick={() => select(item)}>›</button></td></tr>) : <tr><td colSpan={6} className="inquiry-history-empty">{loadError ? '저장소 연결을 확인해 주세요.' : stored === null ? '문의 내역을 불러오는 중입니다.' : '조회된 문의 내역이 없습니다.'}</td></tr>}</tbody></table></div>
    {pageCount > 0 && <nav className="claims-pagination" aria-label="문의 내역 페이지"><button type="button" disabled={currentPage === 1} aria-label="이전 페이지" onClick={() => go(currentPage - 1)}>‹</button>{Array.from({ length: pageCount }, (_, index) => <button type="button" key={index} aria-current={currentPage === index + 1 ? 'page' : undefined} onClick={() => go(index + 1)}>{index + 1}</button>)}<button type="button" disabled={currentPage === pageCount} aria-label="다음 페이지" onClick={() => go(currentPage + 1)}>›</button></nav>}
    {selected && <article className="inquiry-history-detail" ref={detail} aria-label="선택한 문의 상세" data-selected-inquiry={selected.id}><header><span className="inquiry-history-number">{selected.number}</span><span className="inquiry-history-type">{selected.displayType || selected.type}</span><Status value={selected.status} /><time dateTime={selected.createdAt}>작성일　{dateKey(selected.createdAt).replaceAll('-', '.')}</time></header><h3>{selected.title}</h3><div className="inquiry-history-body"><p>{selected.body}</p><Attachments key={selected.id} inquiry={selected} /><MemberCutout name="review-bunny" className="inquiry-history-detail-art" /></div><section className="inquiry-history-answer" aria-label="문의 답변">{selected.status === '답변 완료' && selected.reply ? <><h4>{selected.isExample ? '고객센터 답변 (시연용 예시)' : '등록된 답변'}</h4><p>{selected.reply}</p></> : <p>아직 등록된 답변이 없습니다. 답변이 등록되면 이곳에서 확인하실 수 있습니다.</p>}</section></article>}
    <MemberDecoration variant="inquiries" /></section></div></main><HomeFooter /></div>
}

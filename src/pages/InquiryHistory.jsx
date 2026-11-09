import { useEffect, useId, useRef, useState } from 'react'
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
  { id: 'example-product', number: 'Q-000344', type: '상품 문의', title: '소금빵 보관 방법이 궁금합니다.', createdAt: '2026-11-05T03:00:00.000Z', status: '답변 대기', body: '소금빵을 구매했는데, 남은 후에 어떻게 보관하는 게 가장 맛있게 먹을 수 있는지 궁금해요! 냉장 보관해도 되는지, 권장 보관 기간도 알려주세요.', photos: [], productPhoto: true, isExample: true },
  { id: 'example-cancel', number: 'Q-000343', type: '취소 / 반품 / 교환 문의', displayType: '취소 / 교환 문의', title: '주문 취소 가능한지 문의드려요.', createdAt: '2026-10-30T03:00:00.000Z', status: '답변 완료', body: '주문 취소 가능한지 문의드려요.', reply: '안녕하세요, MELLOW BAKE입니다. 주문 취소 가능 여부는 상품의 준비 및 배송 상태에 따라 달라집니다. 주문 상세페이지에서 현재 상태를 확인해 주세요.', photos: [], isExample: true },
]
function Art({ box, className = '' }) {
  const clip = useId(), [x, y, width, height] = box.split(' ').map(Number)
  return <svg className={className} viewBox={box} aria-hidden="true"><defs><clipPath id={clip}><rect x={x} y={y} width={width} height={height} /></clipPath></defs><image href="/images/문의내역.png" width="1536" height="1024" clipPath={`url(#${clip})`} /></svg>
}
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
  useEffect(() => {
    const images = (inquiry.photos || []).filter(photo => photo.blob instanceof Blob).map(photo => ({ url: URL.createObjectURL(photo.blob), name: photo.name }))
    setUrls(images)
    return () => images.forEach(image => URL.revokeObjectURL(image.url))
  }, [inquiry])
  return <div className="inquiry-history-photos">{inquiry.productPhoto && <div className="inquiry-history-example-photo"><OrderProductImage item={{ id: 'bread-1', koreanName: '소금빵' }} /></div>}{urls.map((image, index) => <a href={image.url} target="_blank" rel="noopener noreferrer" key={index} aria-label={`첨부 사진 ${index + 1} 원본 보기`}><img src={image.url} alt={image.name || `첨부 사진 ${index + 1}`} /></a>)}</div>
}
export default function InquiryHistory() {
  const [stored, setStored] = useState(null), [loadError, setLoadError] = useState('')
  const [type, setType] = useState(''), [start, setStart] = useState(''), [end, setEnd] = useState('')
  const [range, setRange] = useState({ start: '', end: '' }), [filterError, setFilterError] = useState('')
  const [page, setPage] = useState(1), [selectedId, setSelectedId] = useState(() => new URLSearchParams(window.location.search).get('inquiryId'))
  const detail = useRef(null), list = useRef(null)
  useEffect(() => {
    let active = true, request = 0
    async function load() { const current = ++request; try { const records = await getInquiries(); if (active && current === request) { setStored(records); setLoadError('') } } catch { if (active && current === request) { setStored(null); setLoadError('문의 내역을 불러오지 못했습니다. 브라우저 저장소 접근 설정을 확인한 뒤 새로고침해 주세요.') } } }
    load(); window.addEventListener('focus', load); window.addEventListener('mellow-bake:inquiries-changed', load)
    return () => { active = false; window.removeEventListener('focus', load); window.removeEventListener('mellow-bake:inquiries-changed', load) }
  }, [])
  const usingExamples = stored !== null && stored.length === 0
  const rows = stored === null ? [] : usingExamples ? examples : stored
  const filtered = rows.filter(item => (!type || item.type === type) && (!range.start || dateKey(item.createdAt) >= range.start) && (!range.end || dateKey(item.createdAt) <= range.end)).sort((a, b) => (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0))
  const pageCount = Math.ceil(filtered.length / 5), currentPage = Math.min(page, Math.max(1, pageCount))
  const visible = filtered.slice((currentPage - 1) * 5, currentPage * 5)
  const selected = visible.find(item => item.id === selectedId) || (usingExamples ? visible.find(item => item.id === 'example-product') : null) || visible[0] || null
  function search(event) {
    event.preventDefault()
    if ((start && dateKey(`${start}T12:00:00Z`) !== start) || (end && dateKey(`${end}T12:00:00Z`) !== end)) { setFilterError('날짜를 올바르게 선택해 주세요.'); return }
    if (start && end && start > end) { setFilterError('시작일은 종료일보다 늦을 수 없습니다.'); return }
    setRange({ start, end }); setFilterError(''); setPage(1); setSelectedId(null)
  }
  function select(item) { setSelectedId(item.id); window.history.replaceState(null, '', `/mypage/inquiries?inquiryId=${encodeURIComponent(item.id)}`); detail.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }) }
  function go(next) { if (next < 1 || next > pageCount) return; setPage(next); setSelectedId(null); list.current?.scrollIntoView({ block: 'start' }) }
  return <div className="mypage-page claims-page inquiry-history-page"><HomeHeader /><header className="claims-banner inquiry-history-banner"><Art box="337 84 177 151" /><span aria-hidden="true">♡ ✧</span><div><h1>마이페이지</h1><p>My Page</p></div><span aria-hidden="true">♡</span><Art box="1120 120 143 113" /></header><main className="mypage-layout claims-layout"><MyPageSidebar /><div className="mypage-content"><section className="claims-card inquiry-history-content"><header className="inquiry-history-heading"><span aria-hidden="true">•••</span><div><h2>문의 내역</h2><p>내가 작성한 1:1 문의와 답변 내용을 확인할 수 있습니다.</p></div><a href="/mypage/inquiry">＋ 1:1 문의하기</a></header><p className="claims-demo-note">{usingExamples ? '포트폴리오 시연용 예시 문의·답변입니다. 실제 고객 상담 기록이 아닙니다.' : '프론트엔드 데모 · 이 브라우저에 저장된 문의입니다. 실제 운영자에게 전송되지 않습니다.'}</p>
    <form className="inquiry-history-search" onSubmit={search} noValidate><label className="mypage-sr-only" htmlFor="inquiry-history-type">문의 유형</label><select id="inquiry-history-type" value={type} onChange={event => { setType(event.target.value); setPage(1); setSelectedId(null) }}><option value="">전체 문의</option>{inquiryTypes.map(label => <option key={label}>{label}</option>)}</select><label className="mypage-sr-only" htmlFor="inquiry-history-start">시작일</label><input type="date" id="inquiry-history-start" value={start} onChange={event => { setStart(event.target.value); setPage(1) }} /><span>~</span><label className="mypage-sr-only" htmlFor="inquiry-history-end">종료일</label><input type="date" id="inquiry-history-end" value={end} onChange={event => { setEnd(event.target.value); setPage(1) }} /><button type="submit">⌕ 조회</button></form><p className="inquiry-history-error" role="alert">{filterError || loadError}</p>
    <div className="inquiry-history-table-wrap" ref={list}><table className="inquiry-history-table"><caption className="mypage-sr-only">내 문의 목록</caption><thead><tr>{['문의번호', '문의 유형', '제목', '작성일', '답변 상태', ''].map((label, index) => <th scope="col" key={index}>{label || <span className="mypage-sr-only">상세보기</span>}</th>)}</tr></thead><tbody>{visible.length ? visible.map(item => <tr key={item.id} data-inquiry-id={item.id} className={selected?.id === item.id ? 'is-selected' : ''}><td data-label="문의번호">{item.number}</td><td data-label="문의 유형"><span className="inquiry-history-category"><TypeIcon type={item.type} />{item.displayType || item.type}</span></td><td data-label="제목"><button type="button" onClick={() => select(item)}>{item.title}</button></td><td data-label="작성일"><time dateTime={item.createdAt}>{dateKey(item.createdAt).replaceAll('-', '.')}</time></td><td data-label="답변 상태"><Status value={item.status} /></td><td><button className="inquiry-history-arrow" type="button" aria-label={`${item.number} 상세보기`} onClick={() => select(item)}>›</button></td></tr>) : <tr><td colSpan={6} className="inquiry-history-empty">{loadError ? '저장소 연결을 확인해 주세요.' : stored === null ? '문의 내역을 불러오는 중입니다.' : '조회된 문의 내역이 없습니다.'}</td></tr>}</tbody></table></div>
    {pageCount > 0 && <nav className="claims-pagination" aria-label="문의 내역 페이지"><button type="button" disabled={currentPage === 1} aria-label="이전 페이지" onClick={() => go(currentPage - 1)}>‹</button>{Array.from({ length: pageCount }, (_, index) => <button type="button" key={index} aria-current={currentPage === index + 1 ? 'page' : undefined} onClick={() => go(index + 1)}>{index + 1}</button>)}<button type="button" disabled={currentPage === pageCount} aria-label="다음 페이지" onClick={() => go(currentPage + 1)}>›</button></nav>}
    {selected && <article className="inquiry-history-detail" ref={detail} aria-label="선택한 문의 상세" data-selected-inquiry={selected.id}><header><span className="inquiry-history-number">{selected.number}</span><span className="inquiry-history-type">{selected.displayType || selected.type}</span><Status value={selected.status} /><time dateTime={selected.createdAt}>작성일　{dateKey(selected.createdAt).replaceAll('-', '.')}</time></header><h3>{selected.title}</h3><div className="inquiry-history-body"><p>{selected.body}</p><Attachments key={selected.id} inquiry={selected} /><Art className="inquiry-history-detail-art" box="1340 753 104 110" /></div><section className="inquiry-history-answer" aria-label="문의 답변">{selected.status === '답변 완료' && selected.reply ? <><h4>{selected.isExample ? '고객센터 답변 (시연용 예시)' : '등록된 답변'}</h4><p>{selected.reply}</p></> : <p>아직 등록된 답변이 없습니다. 답변이 등록되면 이곳에서 확인하실 수 있습니다.</p>}</section></article>}
    <div className="inquiry-history-bottom" aria-hidden="true"><span>♡</span><Art box="412 930 132 83" /><span>✧</span><Art box="1310 908 190 115" /></div></section></div></main><HomeFooter /></div>
}

import { appHref } from '../appRouting'
import MemberCutout from '../components/MemberCutout'
import MemberDecoration from '../components/MemberDecoration'
import { useState } from 'react'
import { benefitSummary, getPointLedger } from '../benefitData'
import './PointsLedger.css'

const labels = { earn: '적립', use: '사용', expire: '소멸', pending: '적립 예정' }
const points = value => `${value.toLocaleString('ko-KR')}P`
function calendarDay(value) {
  if (!value) return ''
  const normalized = String(value).replace(/^(\d{4})\.(\d{2})\.(\d{2})/, '$1-$2-$3')
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return normalized
  const parsed = new Date(normalized)
  return Number.isFinite(parsed.getTime()) ? new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(parsed) : ''
}
function monthsBefore(day, months) {
  const [year, month, date] = day.split('-').map(Number)
  const target = new Date(Date.UTC(year, month - 1 - months, 1))
  const last = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate()
  target.setUTCDate(Math.min(date, last))
  return target.toISOString().slice(0, 10)
}
// Only isolated decoration regions; banner, balance, controls and table are real HTML.
function Art({ box, className = '' }) {
  const names = {
  "350 0 390 199": "coin-bunny",
  "1355 57 345 133": "coin-cake",
  "330 265 170 95": "coins",
  "1450 220 250 160": "coin-bunny"
}
  return <MemberCutout name={names[box]} className={"points-ledger-art " + className} />
}
export default function PointsLedger({ exampleRows }) {
  const actual = getPointLedger()
  const summary = benefitSummary()
  const [preview, setPreview] = useState(() => getPointLedger().length === 0)
  const showExamples = preview && actual.length === 0
  const rows = (showExamples ? exampleRows : actual).filter(row => row && Number.isFinite(row.amount))
  const [kind, setKind] = useState('all'), [period, setPeriod] = useState('all')
  const [start, setStart] = useState(''), [end, setEnd] = useState(''), [range, setRange] = useState({ start: '', end: '' })
  const [notice, setNotice] = useState(''), [page, setPage] = useState(1)
  const filtered = rows.filter(row => {
    const date = calendarDay(row.occurredAt)
    return (kind === 'all' || row.kind === kind) && (!range.start || date >= range.start) && (!range.end || (date && date <= range.end))
  }).sort((a, b) => calendarDay(b.occurredAt).localeCompare(calendarDay(a.occurredAt)))
  const pageCount = Math.ceil(filtered.length / 5), current = Math.min(page, Math.max(1, pageCount))
  function selectPeriod(value) {
    setPeriod(value)
    if (value === 'all') { setStart(''); setEnd(''); return }
    if (value === 'custom') return
    const today = calendarDay(new Date().toISOString())
    setStart(monthsBefore(today, Number(value))); setEnd(today)
  }
  function search(event) {
    event.preventDefault()
    if (start && end && start > end) { setNotice('시작일은 종료일보다 늦을 수 없습니다.'); return }
    setRange({ start, end }); setPage(1); setNotice('')
  }
  return <div className="points-ledger-content">
    <header className="points-ledger-banner"><div className="points-ledger-awning" aria-hidden="true" /><Art box="350 0 390 199" className="points-ledger-banner-rabbit" /><div className="points-ledger-sign"><span aria-hidden="true">⋈</span><h1>전체 포인트 내역</h1><p>적립, 사용한 포인트 내역을 한눈에 확인할 수 있습니다.</p></div><Art box="1355 57 345 133" className="points-ledger-banner-desserts" /></header>
    <div className="points-ledger-mode"><p>{showExamples ? '디자인 예시 거래 내역입니다. 아래 보유·예정 포인트는 실제 조회값이며, 예시 내역은 잔액에 합산되거나 저장되지 않습니다.' : '프런트엔드 데모 화면입니다. 실제 회원·결제·포인트 서비스는 연결되지 않았습니다.'}</p>{actual.length === 0 && <button type="button" aria-pressed={showExamples} onClick={() => { setPreview(!preview); setPage(1) }}>{showExamples ? '실제 내역 보기' : '디자인 예시 보기'}</button>}</div>
    <div className="points-ledger-layout"><div className="points-ledger-main">
      <section className="points-ledger-balance" aria-label="보유 포인트 현황"><Art box="330 265 170 95" /><div><h2>보유 포인트</h2><strong>{points(summary.points)}</strong></div><dl><div><dt><span aria-hidden="true">♧</span> 적립 예정 포인트</dt><dd>{points(summary.pendingPoints)}</dd></div><div><dt><span aria-hidden="true">▣</span> 소멸 예정 포인트</dt><dd>{points(summary.expiringPoints)}</dd></div></dl></section>
      <div className="points-ledger-controls"><div className="points-ledger-tabs" role="group" aria-label="포인트 유형">{[['all', '전체', '♧'], ['earn', '적립', '♔'], ['use', '사용', '▱'], ['expire', '소멸', '◷']].map(([id, label, icon]) => <button type="button" key={id} aria-pressed={kind === id} onClick={() => { setKind(id); setPage(1) }}><span aria-hidden="true">{icon}</span> {label}</button>)}</div><select aria-label="포인트 조회 기간" value={period} onChange={event => selectPeriod(event.target.value)}><option value="all">전체</option><option value="1">최근 1개월</option><option value="3">최근 3개월</option><option value="6">최근 6개월</option><option value="12">최근 1년</option><option value="custom">직접 선택</option></select></div>
      <form className="points-ledger-date" onSubmit={search}><input type="date" aria-label="포인트 조회 시작일" value={start} onChange={event => { setStart(event.target.value); setPeriod('custom') }} /><span>~</span><input type="date" aria-label="포인트 조회 종료일" value={end} onChange={event => { setEnd(event.target.value); setPeriod('custom') }} /><button type="submit">조회</button></form><p className="points-ledger-date-hint">기간을 선택한 후 조회 버튼을 눌러 주세요.</p><p className="points-ledger-notice" role="status">{notice}</p>
      <div className="points-ledger-table"><table><caption className="mypage-sr-only">{showExamples ? '디자인 예시 포인트 내역' : '포인트 적립 및 사용 내역'}</caption><thead><tr><th scope="col">일자</th><th scope="col">구분</th><th scope="col">내용</th><th scope="col">포인트</th></tr></thead><tbody>{filtered.slice((current - 1) * 5, current * 5).map(row => <tr key={row.id} data-point-id={row.id}><td>{calendarDay(row.occurredAt).replaceAll('-', '.') || '확인 필요'}</td><td><span className={`points-ledger-kind points-ledger-kind--${row.kind}`}>{labels[row.kind] || '확인 필요'}</span></td><td>{row.description || '내역 확인 필요'}</td><td className={`points-ledger-amount points-ledger-amount--${row.kind}`}>{row.amount > 0 ? '+' : ''}{points(row.amount)}</td></tr>)}{!filtered.length && <tr><td colSpan={4}><div className="points-ledger-empty"><Art box="330 265 170 95" /><h3>조회된 포인트 내역이 없습니다</h3><p>조회 기간이나 유형을 변경해 보세요.</p></div></td></tr>}</tbody></table></div>
      {pageCount > 0 && <nav className="points-ledger-pagination" aria-label="포인트 내역 페이지">{[['prev', '‹', current - 1], ...Array.from({ length: pageCount }, (_, i) => [i + 1, i + 1, i + 1]), ['next', '›', current + 1]].map(([key, label, target]) => <button type="button" key={key} disabled={target < 1 || target > pageCount} aria-label={key === 'prev' ? '이전 페이지' : key === 'next' ? '다음 페이지' : `${label}페이지`} aria-current={key === current ? 'page' : undefined} onClick={() => setPage(target)}>{label}</button>)}</nav>}
    </div><aside className="points-ledger-aside"><Art box="1450 220 250 160" /><section className="points-ledger-guide"><h2><span aria-hidden="true">▤</span> 포인트 이용 안내</h2><ul><li>적립률과 적립 조건은 운영 정책 확인 후 안내합니다.</li><li>최소 사용 포인트와 사용 한도는 아직 확정되지 않았습니다.</li><li>유효기간과 소멸 기준은 실제 포인트 정보에 따라 안내합니다.</li></ul><a href={appHref("/mypage/benefits")}>쿠폰·포인트 현황 보기 ›</a></section></aside></div>
    <MemberDecoration variant="points" />
  </div>
}

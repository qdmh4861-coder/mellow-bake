import MemberCutout from '../components/MemberCutout'
import MemberDecoration from '../components/MemberDecoration'
import { useId, useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import MyPageSidebar from '../components/MyPageSidebar'
import './MyPage.css'
import './Claims.css'
import './Faq.css'

const categories = ['전체', '주문 / 결제', '배송', '취소 / 반품 / 교환', '환불', '상품', '회원 / 기타']
// Site-function examples, not live payment, shipping, refund, or food-storage policies.
import { questions } from '../faqQuestions'
function Art({ box, className = '' }) {
  const names = {
  "336 84 180 151": "rabbit",
  "1120 120 145 115": "desserts"
}
  return <MemberCutout name={names[box]} className={" " + className} />
}
function CategoryIcon({ index }) {
  if (!index) return null
  return <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{index === 1 ? <><path d="M4 9h20v17H4ZM9 9V6a5 5 0 0 1 10 0v3" /></> : index === 2 ? <><path d="M2 20V5h15v15M17 10h5l4 5v5h-5M7 20h9" /><circle cx="6" cy="21" r="3" /><circle cx="20" cy="21" r="3" /></> : index === 3 ? <><path d="M5 10a10 10 0 0 1 17-4l3 4M3 8l2 4 5-1M23 18A10 10 0 0 1 6 22l-3-4m22 2-2-4-5 1" /></> : index === 4 ? <><path d="M3 10h22v6H3Zm3 6v11h16V16M14 10v17M14 10C0-5 3-3 11 3l3 7c12-17 17-7 0 0Z" /></> : index === 5 ? <><path d="M4 13h20v13H4ZM4 13l16-9 4 9M4 19h20M18 5V1" /></> : <><circle cx="14" cy="8" r="5" /><path d="M4 26v-3a10 10 0 0 1 20 0v3ZM3 20h22" /></>}</svg>
}
export default function Faq() {
  const [category, setCategory] = useState('전체')
  const [draft, setDraft] = useState(''), [query, setQuery] = useState('')
  const [opened, setOpened] = useState(questions[0].id)
  const prefix = useId()
  const normalized = query.trim().toLocaleLowerCase()
  const filtered = questions.filter(item => (category === '전체' || item.category === category) && `${item.question} ${item.answer} ${item.note || ''}`.toLocaleLowerCase().includes(normalized))
  function search(event) { event.preventDefault(); setQuery(draft); setOpened(null) }
  return <div className="mypage-page claims-page faq-page"><HomeHeader /><header className="claims-banner faq-banner"><Art box="336 84 180 151" /><span aria-hidden="true">♡ ✧</span><div><h1>마이페이지</h1><p>My Page</p></div><span aria-hidden="true">♡</span><Art box="1120 120 145 115" /></header><main className="mypage-layout claims-layout"><MyPageSidebar /><div className="mypage-content"><section className="claims-card faq-content"><header className="faq-heading"><span aria-hidden="true">?</span><div><h2>자주 묻는 질문 (FAQ)</h2><p>고객님들께서 자주 궁금해하시는 내용을 모아 답변해드립니다.</p></div></header>
    <div className="faq-categories" role="group" aria-label="FAQ 카테고리">{categories.map((label, index) => <button key={label} type="button" aria-pressed={category === label} onClick={() => { setCategory(label); setOpened(null) }}><CategoryIcon index={index} />{label}</button>)}</div>
    <form className="faq-search" role="search" onSubmit={search}><label className="mypage-sr-only" htmlFor="faq-search-input">질문 또는 답변 검색</label><div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="10" cy="10" r="7" /><path d="m15 15 6 6" /></svg><input type="search" id="faq-search-input" value={draft} placeholder="궁금한 내용을 검색해보세요." onChange={event => setDraft(event.target.value)} /></div><button type="submit">검색</button></form>
    <div className="faq-list" aria-live="polite">{filtered.length ? filtered.map(item => <article className={`faq-item${opened === item.id ? ' is-open' : ''}`} key={item.id} data-faq-id={item.id}><h3><button type="button" id={`${prefix}-${item.id}-question`} aria-expanded={opened === item.id} aria-controls={`${prefix}-${item.id}-answer`} onClick={() => setOpened(old => old === item.id ? null : item.id)}><span className="faq-q" aria-hidden="true">Q</span><span>{item.question}</span><svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="m4 8 8 8 8-8" /></svg></button></h3><div className="faq-answer" id={`${prefix}-${item.id}-answer`} role="region" aria-labelledby={`${prefix}-${item.id}-question`} hidden={opened !== item.id}><span className="faq-a" aria-hidden="true">A</span><div><p>{item.answer}</p>{item.note && <p className="faq-note">{item.note}</p>}<div className="faq-related-links">{item.links.map(([label, href]) => <a href={href} key={href}>{label} ›</a>)}</div></div></div></article>) : <div className="faq-empty"><h3>검색 결과가 없습니다.</h3><p>원하는 답변을 찾지 못하셨다면 1:1 문의하기를 이용해 주세요.</p><a href="/mypage/inquiry">1:1 문의하기</a></div>}</div>
    <section className="faq-contact"><div><h3>궁금한 점이 해결되지 않으셨나요?</h3><p>1:1 문의하기를 통해 궁금한 내용을 남겨주세요.</p></div><a href="/mypage/inquiry">1:1 문의하기 ›</a></section><MemberDecoration variant="faq" /></section></div></main><HomeFooter /></div>
}

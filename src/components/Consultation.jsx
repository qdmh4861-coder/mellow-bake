import { assetHref, appHref } from '../appRouting'
import { useEffect, useRef, useState } from 'react'
import { consultationLinks, consultationReply } from '../consultationReplies'
import './Consultation.css'

const quick = ['인기 메뉴가 뭐예요?', '배송은 얼마나 걸리나요?', '쿠폰은 어디서 받나요?']
export default function Consultation() {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState([])
  const launcher = useRef(null), input = useRef(null), log = useRef(null)
  const close = () => { setOpen(false); requestAnimationFrame(() => launcher.current?.focus()) }
  useEffect(() => {
    if (!open) return
    input.current?.focus()
    const escape = e => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', escape)
    return () => window.removeEventListener('keydown', escape)
  }, [open])
  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight }, [messages, open])
  function send(text) {
    const value = text.trim()
    if (!value) return
    setMessages(previous => [...previous, { user: true, text: value }, consultationReply(value)])
    setDraft('')
  }
  return <aside className="mb-consultation" aria-label="멜로우 상담">
    {!open ? <button ref={launcher} className="mb-consultation-launcher" aria-label="AI 상담 열기 — 자동응답 데모" aria-expanded="false" aria-controls="mb-consultation-panel" onClick={() => setOpen(true)}><img src={assetHref("/images/ai-consultation/button-transparent.png")} alt="멜로우에게 물어봐! AI 상담" /></button> :
      <section id="mb-consultation-panel" className="mb-consultation-panel" role="dialog" aria-modal="false" aria-labelledby="mb-consultation-title">
        <header className="mb-consultation-header"><h2 id="mb-consultation-title">MELLOW AI 상담 ♡</h2><button aria-label="상담창 닫기" onClick={close}>×</button></header>
        <div className="mb-consultation-scroll" ref={log}>
          <div className="mb-consultation-welcome"><p>안녕하세요!<br />멜로우 베이크 안내 도우미예요.<br />궁금한 점을 물어보세요! ♡</p><svg viewBox="750 230 330 320" role="img" aria-label="하트를 든 멜로우 토끼"><image href={assetHref("/images/ai-consultation/reference.png")} width="1199" height="1312" /></svg></div>
          <p className="mb-consultation-demo">사이트 안내 자동응답 데모 · 실제 AI/상담원 연결 아님</p>
          <nav className="mb-consultation-links" aria-label="상담 메뉴">{consultationLinks.map(([label, href]) => <a key={href} href={appHref(href)}>{label}</a>)}</nav>
          <h3>✧ 자주 찾는 질문 ✧</h3>
          <div className="mb-consultation-quick">{quick.map(q => <button key={q} onClick={() => send(q)}>{q}</button>)}</div>
          <div className="mb-consultation-messages" role="log" aria-live="polite" aria-label="상담 대화">{messages.map((message, index) => <div key={index} className={message.user ? 'mb-consultation-message is-user' : 'mb-consultation-message'}><small>{message.user ? '나' : '멜로우 안내'}</small><p>{message.text}</p>{message.links?.map(([label, href]) => <a key={href} href={appHref(href)}>{label} →</a>)}</div>)}</div>
        </div>
        <form className="mb-consultation-form" onSubmit={e => { e.preventDefault(); send(draft) }}><input ref={input} aria-label="상담 메시지" placeholder="궁금한 내용을 입력해 주세요…" value={draft} maxLength={1000} onChange={e => setDraft(e.target.value)} /><button aria-label="메시지 전송" disabled={!draft.trim()}>➤</button></form>
      </section>}
  </aside>
}

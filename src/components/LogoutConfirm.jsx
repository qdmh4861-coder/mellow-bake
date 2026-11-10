import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import MemberCutout from './MemberCutout'
import { logoutDemo } from '../demoAuth'
import './LogoutConfirm.css'

export default function LogoutConfirm({ open, onClose }) {
  const dialog = useRef(null)
  const [notice, setNotice] = useState('')
  const busy = useRef(false)
  useEffect(() => {
    if (!open) return
    const modal = dialog.current, opener = document.activeElement
    const bodyOverflow = document.body.style.overflow, rootOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'; document.documentElement.style.overflow = 'hidden'
    modal.showModal()
    return () => {
      modal.close()
      document.body.style.overflow = bodyOverflow; document.documentElement.style.overflow = rootOverflow
      if (opener?.isConnected) opener.focus({ preventScroll: true })
    }
  }, [open])
  if (!open) return null
  function confirm() {
    if (busy.current) return
    busy.current = true
    try { logoutDemo('/') }
    catch { busy.current = false; setNotice('로그아웃하지 못했습니다. 브라우저 세션 접근 설정을 확인한 뒤 다시 시도해 주세요.') }
  }
  return createPortal(<dialog className="logout-confirm-dialog" ref={dialog} aria-labelledby="logout-confirm-title" aria-describedby="logout-confirm-description" onCancel={event => { event.preventDefault(); onClose() }} onClick={event => {
    if (event.target !== event.currentTarget) return
    const box = event.currentTarget.getBoundingClientRect()
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onClose()
  }}>
    <span className="logout-confirm-awning" aria-hidden="true" />
    <div className="logout-confirm-brand">MELLOW BAKE</div>
    <button className="logout-confirm-close" type="button" aria-label="로그아웃 팝업 닫기" onClick={onClose} autoFocus><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button>
    <div className="logout-confirm-art" aria-hidden="true"><span>♡</span><MemberCutout name="rabbit" /><MemberCutout name="wallet-desserts" /><span>♡</span></div>
    <h2 id="logout-confirm-title">로그아웃 하시겠어요?</h2>
    <p id="logout-confirm-description">지금 로그아웃하면 로그인 상태가 종료되고<br className="logout-confirm-linebreak" /> 홈으로 이동합니다.</p>
    <div className="logout-confirm-ribbon" aria-hidden="true"><span>⋈</span></div>
    <div className="logout-confirm-actions"><button type="button" onClick={onClose}>취소</button><button type="button" onClick={confirm}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M10 3H4v18h6m5-14 5 5-5 5M8 12h12" /></svg>로그아웃</button></div>
    {notice && <p className="logout-confirm-error" role="alert">{notice}</p>}
  </dialog>, document.body)
}

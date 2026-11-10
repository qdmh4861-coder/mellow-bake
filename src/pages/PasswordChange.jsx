import { useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import MyPageSidebar from '../components/MyPageSidebar'
import MemberCutout from '../components/MemberCutout'
import MemberDecoration from '../components/MemberDecoration'
import { validateSignupField } from './signupValidation'
import './MyPage.css'
import './PasswordChange.css'

const fields = [
  ['current', '현재 비밀번호', '현재 비밀번호를 입력해 주세요', 'current-password'],
  ['password', '새 비밀번호', '새 비밀번호를 입력해 주세요', 'new-password'],
  ['confirm', '새 비밀번호 확인', '새 비밀번호를 다시 입력해 주세요', 'new-password'],
]

function SecurityIcon({ shield = false, current = false }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shield ? <><path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4Z" /><path d="m8 12 3 3 5-6" /></> : current ? <><circle cx="16" cy="8" r="5" /><path d="m12 12-9 9H1v-4l9-9M5 17l2 2" /></> : <><rect x="5" y="10" width="14" height="12" rx="2" /><path d="M8 10V6a4 4 0 0 1 8 0v4M12 15v3" /></>}</svg>
}

export default function PasswordChange() {
  // Passwords stay in form memory only. Demo verification exists, but password mutation does not.
  const [values, setValues] = useState({ current: '', password: '', confirm: '' })
  const [visible, setVisible] = useState({})
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState('')
  function change(name, value) {
    setValues(old => ({ ...old, [name]: value }))
    setErrors(old => ({ ...old, [name]: '', ...(name === 'password' ? { confirm: '' } : {}) }))
    setNotice('')
  }
  function submit(event) {
    event.preventDefault()
    const next = {
      current: values.current ? '' : '현재 비밀번호를 입력해 주세요.',
      password: validateSignupField('password', values),
      confirm: values.confirm ? validateSignupField('confirm', values) : '새 비밀번호 확인을 입력해 주세요.',
    }
    if (values.current && values.password === values.current) next.password = '현재 비밀번호와 다른 새 비밀번호를 입력해 주세요.'
    setErrors(next)
    setNotice('')
    const invalid = fields.find(([name]) => next[name])
    if (invalid) { document.getElementById(`password-change-${invalid[0]}`)?.focus(); return }
    // Never show success without a confirmed server-side password change.
    setNotice('현재 데모 로그인은 개발용 설정으로 비밀번호를 검증합니다. 이 화면에서는 현재 비밀번호 재확인 및 비밀번호 변경을 지원하지 않습니다. 입력한 비밀번호는 전송·저장되지 않았으며, 기존 비밀번호는 변경되지 않았습니다.')
    setValues({ current: '', password: '', confirm: '' })
    setVisible({})
  }
  return <div className="mypage-page password-change-page"><HomeHeader /><main className="mypage-layout"><MyPageSidebar /><div className="mypage-content password-change-content">
    <header className="password-change-heading password-final-banner"><span className="password-final-awning" aria-hidden="true" /><div className="password-final-rabbit" aria-hidden="true"><MemberCutout name="rabbit" /><SecurityIcon /></div><div className="password-final-title"><h1><span aria-hidden="true">♡</span> 비밀번호 변경 <span aria-hidden="true">♡</span></h1><p>계정의 안전한 이용을 위해 비밀번호를 변경해 주세요.</p></div><MemberCutout name="wallet-desserts" /></header>
    <form className="password-change-card" onSubmit={submit} noValidate>
      <h2><SecurityIcon />비밀번호 변경</h2>
      <div className="password-security-guide"><SecurityIcon shield /><p>보다 안전한 계정 관리를 위해 주기적으로 비밀번호를 변경하는 것을 권장합니다.</p></div>
      <p className="password-demo-limit">프론트엔드 데모 · 입력 검사만 제공하며 현재 비밀번호 확인과 실제 변경은 지원하지 않습니다. 비밀번호는 저장하거나 전송하지 않습니다.</p>
      <div className="password-change-fields">{fields.map(([name, label, placeholder, autoComplete]) => <div className="password-change-row" key={name}><label htmlFor={`password-change-${name}`}><SecurityIcon current={name === 'current'} />{label} <em>*</em></label><div><div className="password-change-input"><input id={`password-change-${name}`} name={name} type={visible[name] ? 'text' : 'password'} autoComplete={autoComplete} placeholder={placeholder} required value={values[name]} aria-invalid={Boolean(errors[name])} aria-describedby={`password-change-${name}-help`} onChange={event => change(name, event.target.value)} /><button type="button" aria-label={`${label} ${visible[name] ? '숨기기' : '표시'}`} aria-pressed={Boolean(visible[name])} onClick={() => setVisible(old => ({ ...old, [name]: !old[name] }))}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" />{!visible[name] && <path d="m3 3 18 18" />}</svg></button></div><p className={`password-change-help${errors[name] ? ' password-change-error' : ''}`} id={`password-change-${name}-help`} aria-live="polite">{errors[name] || (name === 'password' ? 'ⓘ 영문, 숫자, 특수문자를 포함한 8자 이상 입력해 주세요' : name === 'confirm' ? 'ⓘ 비밀번호가 일치하는지 확인해 주세요' : '')}</p></div></div>)}</div>
      <div className="password-change-actions"><a href="/mypage/profile">취소</a><button type="submit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="m4 12 5 5L20 5" /></svg>변경하기</button></div>
      {notice && <div className="password-change-notice" role="status"><p>{notice}</p><a href="/login">로그인 페이지로 이동</a></div>}
    </form><MemberDecoration variant="wallet" />
  </div></main><HomeFooter /></div>
}


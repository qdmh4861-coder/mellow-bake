import { useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import MyPageSidebar from '../components/MyPageSidebar'
import { validateSignupField } from './signupValidation'
import './MyPage.css'
import './PasswordChange.css'

const fields = [
  ['current', '현재 비밀번호', '현재 비밀번호를 입력해 주세요', 'current-password'],
  ['password', '새 비밀번호', '새 비밀번호를 입력해 주세요', 'new-password'],
  ['confirm', '새 비밀번호 확인', '새 비밀번호를 다시 입력해 주세요', 'new-password'],
]

export default function PasswordChange() {
  // Passwords stay in this form's memory only; there is no authentication API yet.
  const [values, setValues] = useState({ current: '', password: '', confirm: '' })
  const [visible, setVisible] = useState({})
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState('')
  function change(name, value) {
    setValues(old => ({ ...old, [name]: value }))
    setErrors({})
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
    setNotice('현재 로그인 인증 및 비밀번호 변경 서비스가 연결되지 않았습니다. 입력한 비밀번호는 전송·저장되지 않았으며, 비밀번호는 변경되지 않았습니다.')
    setValues({ current: '', password: '', confirm: '' })
    setVisible({})
  }
  return <div className="mypage-page password-change-page"><HomeHeader /><main className="mypage-layout"><MyPageSidebar /><div className="mypage-content password-change-content">
    <header className="password-change-heading"><h1>비밀번호 변경</h1><p>안전한 계정 관리를 위해 비밀번호를 변경해 주세요</p></header>
    <form className="password-change-card" onSubmit={submit} noValidate>
      <h2>비밀번호 변경</h2>
      <div className="password-change-fields">{fields.map(([name, label, placeholder, autoComplete]) => <div className="password-change-row" key={name}><label htmlFor={`password-change-${name}`}>{label}</label><div><div className="password-change-input"><input id={`password-change-${name}`} name={name} type={visible[name] ? 'text' : 'password'} autoComplete={autoComplete} placeholder={placeholder} required value={values[name]} aria-invalid={Boolean(errors[name])} aria-describedby={`password-change-${name}-help`} onChange={event => change(name, event.target.value)} /><button type="button" aria-label={`${label} ${visible[name] ? '숨기기' : '표시'}`} aria-pressed={Boolean(visible[name])} onClick={() => setVisible(old => ({ ...old, [name]: !old[name] }))}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" />{!visible[name] && <path d="m3 3 18 18" />}</svg></button></div><p className={`password-change-help${errors[name] ? ' password-change-error' : ''}`} id={`password-change-${name}-help`} aria-live="polite">{errors[name] || (name === 'password' ? 'ⓘ 영문, 숫자, 특수문자를 포함한 8자 이상 입력해 주세요' : name === 'confirm' ? 'ⓘ 비밀번호가 일치하는지 확인해 주세요' : '')}</p></div></div>)}</div>
      <div className="password-change-actions"><a href="/mypage">취소</a><button type="submit">변경하기</button></div>
      {notice && <div className="password-change-notice" role="status"><p>{notice}</p><a href="/login">로그인 페이지로 이동</a></div>}
    </form>
  </div></main><HomeFooter /></div>
}

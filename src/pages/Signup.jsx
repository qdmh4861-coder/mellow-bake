import { useRef, useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import dog from '../images/signup-dog.png'
import cat from '../images/signup-cat.png'
import { initialSignupValues, validateSignup, validateSignupField, validateSignupAgreements } from './signupValidation'
import './Signup.css'

function SignupIcon({ type = 'cupcake' }) {
  return <svg viewBox="0 0 32 34" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {type === 'cupcake' && <><path d="m7 20 3 11h12l3-11M13 22l1 7m5-7-1 7M7 20C0 20 2 11 8 12c-1-6 7-9 10-5 6-2 10 3 8 7 5 3 2 8-3 6Z" /><path d="M15 6c-1-4 5-5 5-1" /></>}
    {type === 'user' && <><circle cx="16" cy="10" r="6" /><path d="M4 30v-3c0-12 24-12 24 0v3Z" /></>}
    {type === 'mail' && <><rect x="3" y="7" width="26" height="20" rx="3" /><path d="m4 9 12 10L28 9" /></>}
    {type === 'lock' && <><rect x="6" y="15" width="20" height="16" rx="3" /><path d="M10 15V9a6 6 0 0 1 12 0v6m-6 7v3" /></>}
    {type === 'phone' && <><rect x="8" y="2" width="16" height="30" rx="4" /><path d="M14 27h4" /></>}
  </svg>
}

function SignupError({ children }) {
  return <><svg className="signup-error-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="8" cy="8" r="6.2" /><path d="M8 4.5v4.2" /><circle cx="8" cy="11.3" r=".7" fill="currentColor" stroke="none" /></svg><span>{children}</span></>
}

const fields = [
  ['name', '이름', '이름을 입력하세요', 'user', 'name'],
  ['email', '이메일', '이메일을 입력하세요', 'mail', 'email'],
  ['password', '비밀번호', '8자 이상, 영문·숫자·특수문자', 'lock', 'new-password'],
  ['confirm', '비밀번호 확인', '비밀번호를 한 번 더 입력하세요', 'lock', 'new-password'],
  ['nickname', '닉네임', '닉네임을 입력하세요', 'user', 'nickname'],
  ['phone', '휴대폰 번호 (선택)', '숫자만 입력하세요', 'phone', 'tel'],
]

export default function Signup() {
  const [values, setValues] = useState(initialSignupValues)
  const [touched, setTouched] = useState({})
  const [errors, setErrors] = useState({})
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [agreements, setAgreements] = useState({ terms: false, privacy: false })
  const [allAgreed, setAllAgreed] = useState(false)
  const [visible, setVisible] = useState({})
  const [message, setMessage] = useState('')
  const [emailNotice, setEmailNotice] = useState('')
  const [document, setDocument] = useState('')
  const dialog = useRef(null)
  const agreementError = (touched.agreements || submitAttempted) && errors.agreements

  function blurField(name) {
    if (values[name] === '') return
    setTouched(old => ({ ...old, [name]: true }))
    setErrors(old => ({ ...old, [name]: validateSignupField(name, values) }))
  }

  function changeAgreements(next) {
    setAgreements(next)
    setTouched(old => ({ ...old, agreements: true }))
    setErrors(old => ({ ...old, agreements: validateSignupAgreements(next) }))
  }

  function changeField(name, value) {
    const nextValues = { ...values, [name]: value }
    setValues(nextValues)
    setMessage('')
    if (name === 'email') setEmailNotice('')
    if (value === '') setTouched(old => ({ ...old, [name]: false }))
    setErrors(old => {
      const next = { ...old }
      if (value === '') delete next[name]
      else if (touched[name] || old[name]) next[name] = validateSignupField(name, nextValues)
      if (name === 'password' && values.confirm && (touched.confirm || old.confirm)) next.confirm = validateSignupField('confirm', nextValues)
      return next
    })
  }

  function submit(event) {
    event.preventDefault()
    setSubmitAttempted(true)
    const submissionErrors = validateSignup(values, agreements)
    setErrors(submissionErrors)
    if (Object.keys(submissionErrors).length) {
      setMessage('입력 내용과 필수 약관 동의를 확인해 주세요.')
      const first = Object.keys(submissionErrors)[0]
      event.currentTarget.elements.namedItem(first === 'agreements' ? 'terms' : first)?.focus()
      return
    }
    setMessage('입력 형식 확인을 마쳤습니다. 회원가입 서버와 이메일 중복 확인 API가 연결되지 않아 계정을 생성하지 않았습니다. 입력 정보는 전송·저장되지 않습니다.')
  }

  function showTerms(title) {
    setDocument(title)
    dialog.current.showModal()
  }

  return <div className="signup-page" id="home">
    <HomeHeader />
    <main className="signup-main">
      <div className="signup-awning" aria-hidden="true">{Array.from({ length: 18 }, (_, i) => <i key={i} />)}</div>
      <div className="signup-scenery" aria-hidden="true">
        <div className="signup-leaves signup-leaves--left">{Array.from({ length: 8 }, (_, i) => <i key={i} />)}</div>
        <div className="signup-leaves signup-leaves--right">{Array.from({ length: 8 }, (_, i) => <i key={i} />)}</div>
        <div className="signup-pendant" />
        <div className="signup-window"><svg viewBox="0 0 130 150" fill="none" stroke="currentColor" strokeWidth="4"><path d="M65 0v150M0 65h130M0 130h130" opacity=".5" /><path d="M30 91h70v40H30Zm0 15q8-12 17 0t18 0t18 0t17 0M25 132h80M35 90q0-18 15-12 8-17 17-3 18-10 24 15" /><path d="M65 60c-25-16-10-29 0-17 10-12 25 1 0 17Z" /></svg></div>
        <div className="signup-sign">SIGN UP ♡</div>
        <div className="signup-display">{['cake', 'cupcakes', 'macarons'].map(kind => <div className={`signup-display-row signup-display-row--${kind}`} key={kind}><i /><i /><i /></div>)}</div>
        <span className="signup-spark signup-spark--one">✦</span><span className="signup-spark signup-spark--two">✦</span><span className="signup-spark signup-spark--three">✧</span>
        <div className="signup-floor" />
      </div>
      <div className="signup-masthead" aria-label="BAKERY & DESSERT MELLOW BAKE"><span>BAKERY &amp; DESSERT</span><SignupIcon /><strong>MELLOW BAKE</strong></div>
      <div className="signup-stage">
        <img className="signup-character signup-character--dog" src={dog} alt="딸기 케이크를 만드는 강아지 파티시에" />
        <section className="signup-card" aria-labelledby="signup-title">
          <h1 id="signup-title">회원가입</h1>
          <p className="signup-welcome">MELLOW BAKE와 함께 달콤한 이야기를 시작해요!</p>
          <form noValidate onSubmit={submit}>
            {fields.map(([name, label, placeholder, icon, autoComplete]) => {
              const password = name === 'password' || name === 'confirm'
              const error = (touched[name] || submitAttempted) && errors[name]
              return <div className="signup-group" key={name}>
                <label htmlFor={`signup-${name}`}>{label}{name !== 'phone' && <span aria-hidden="true"> *</span>}</label>
                <div className={`signup-input-row${error ? ' signup-input-row--error' : ''}`}>
                  <SignupIcon type={icon} />
                  <input id={`signup-${name}`} name={name} type={password ? (visible[name] ? 'text' : 'password') : name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'text'} autoComplete={autoComplete} inputMode={name === 'phone' ? 'numeric' : undefined} required={name !== 'phone'} placeholder={placeholder} value={values[name]} aria-invalid={Boolean(error)} aria-describedby={`signup-${name}-help`} onBlur={() => blurField(name)} onChange={event => changeField(name, event.target.value)} />
                  {password && <button className="signup-eye" type="button" aria-label={`${label} ${visible[name] ? '숨기기' : '표시'}`} aria-pressed={Boolean(visible[name])} onClick={() => setVisible(old => ({ ...old, [name]: !old[name] }))}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" />{!visible[name] && <path d="m3 3 18 18" />}</svg></button>}
                  {name === 'email' && <button className="signup-check-email" type="button" onClick={() => { blurField('email'); setEmailNotice(validateSignupField('email', values) ? '' : '중복 확인 API 연결 전입니다. 사용 가능 여부는 확인되지 않았습니다.') }}>중복 확인</button>}
                </div>
                <p className={`signup-help${error ? ' signup-help--error' : ''}`} id={`signup-${name}-help`} aria-live="polite">{error ? <SignupError>{error}</SignupError> : (name === 'email' ? emailNotice : name === 'password' ? '8자 이상 · 영문, 숫자, 특수문자 포함' : name === 'phone' ? '선택 입력이며, 휴대폰 인증 서비스는 연결되지 않았습니다.' : '')}</p>
              </div>
            })}
            <fieldset className="signup-agreements" aria-describedby="signup-agreements-error" aria-invalid={Boolean(agreementError)}>
              <legend className="signup-sr-only">약관 동의</legend>
              <label className="signup-agree-all"><input type="checkbox" checked={allAgreed} onChange={event => { setAllAgreed(event.target.checked); changeAgreements({ terms: event.target.checked, privacy: event.target.checked }) }} />전체 동의</label>
              {[['terms', '이용약관'], ['privacy', '개인정보 수집 및 이용']].map(([key, title]) => <div className="signup-agree-row" key={key}><label><input name={key} type="checkbox" required checked={agreements[key]} onChange={event => { if (!event.target.checked) setAllAgreed(false); changeAgreements({ ...agreements, [key]: event.target.checked }) }} />{title} 동의 <span>(필수)</span></label><button type="button" onClick={() => showTerms(title)}>약관 보기</button></div>)}
              <p className={`signup-help${agreementError ? ' signup-help--error' : ''}`} id="signup-agreements-error" aria-live="polite">{agreementError && <SignupError>{agreementError}</SignupError>}</p>
            </fieldset>
            <button className="signup-submit" type="submit"><SignupIcon />회원가입</button>
            <p className="signup-status" role="status" aria-live="polite">{message || '현재 회원가입 서비스 연결 준비 중입니다.'}</p>
          </form>
          <p className="signup-login">이미 계정이 있으신가요? <a href="/login">로그인</a></p>
        </section>
        <img className="signup-character signup-character--cat" src={cat} alt="하트 쿠키를 들고 웃는 아기 고양이 파티시에" />
      </div>
      <dialog className="signup-dialog" ref={dialog} aria-labelledby="signup-document-title" onClick={event => { if (event.target === event.currentTarget) dialog.current.close() }}>
        <h2 id="signup-document-title">{document}</h2>
        <p>확정된 약관 원문이 아직 제공되지 않았습니다. 실제 서비스 이용 조건과 개인정보 처리 내용을 확인할 수 있도록 정식 문서 연결이 필요합니다.</p>
        <p>현재 체크박스는 화면 동작 확인용이며, 가입이나 개인정보 수집은 이루어지지 않습니다.</p>
        <form method="dialog"><button autoFocus>닫기</button></form>
      </dialog>
    </main>
    <div className="signup-footer"><HomeFooter /></div>
  </div>
}

import { assetHref, appHref } from '../appRouting'
import { useEffect, useRef, useState } from 'react'
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
  const [agreements, setAgreements] = useState({ terms: false, privacy: false, events: false })
  const allAgreed = Object.values(agreements).every(Boolean)
  const [verificationCode, setVerificationCode] = useState('')
  const [phoneNotice, setPhoneNotice] = useState('')
  const verificationInput = useRef(null)
  const [visible, setVisible] = useState({})
  const [message, setMessage] = useState('')
  const [emailNotice, setEmailNotice] = useState('')
  const [demoCheckedEmail, setDemoCheckedEmail] = useState('')
  const [completionOpen, setCompletionOpen] = useState(false)
  const completionDialog = useRef(null)
  const [document, setDocument] = useState('')
  const dialog = useRef(null)
  const agreementError = (touched.agreements || submitAttempted) && errors.agreements

  useEffect(() => {
    if (!completionOpen) return
    const body = window.document.body
    const root = window.document.documentElement
    const previousBodyOverflow = body.style.overflow
    const previousRootOverflow = root.style.overflow
    const popup = completionDialog.current
    body.style.overflow = 'hidden'
    root.style.overflow = 'hidden'
    popup.showModal()
    return () => {
      body.style.overflow = previousBodyOverflow
      root.style.overflow = previousRootOverflow
      popup.close()
    }
  }, [completionOpen])

  function checkDemoEmail() {
    const error = validateSignupField('email', values)
    setTouched(old => ({ ...old, email: true }))
    setErrors(old => ({ ...old, email: error }))
    setDemoCheckedEmail(error ? '' : values.email.trim())
    setEmailNotice(error ? '' : '개발용 시연: 이메일 확인 단계를 진행했습니다. 중복 확인 API 연결 전이므로 실제 사용 가능 여부는 확인되지 않았습니다.')
  }

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
    if (name === 'email') {
      setEmailNotice('')
      setDemoCheckedEmail('')
    }
    if (name === 'phone') {
      setPhoneNotice('')
      setVerificationCode('')
    }
    if (value === '') setTouched(old => ({ ...old, [name]: false }))
    setErrors(old => {
      const next = { ...old }
      if (value === '') delete next[name]
      else if (touched[name] || old[name]) next[name] = validateSignupField(name, nextValues)
      if (name === 'password' && values.confirm && (touched.confirm || old.confirm)) next.confirm = validateSignupField('confirm', nextValues)
      return next
    })
  }

  function requestPhoneCode() {
    const error = values.phone ? validateSignupField('phone', values) : '휴대폰 번호를 입력해 주세요.'
    setTouched(old => ({ ...old, phone: true }))
    setErrors(old => ({ ...old, phone: error }))
    if (error) {
      window.document.getElementById('signup-phone')?.focus()
      return
    }
    setPhoneNotice('현재 문자 인증 서비스가 연결되지 않아 인증번호를 발송할 수 없습니다.')
    verificationInput.current?.focus()
  }

  function confirmPhoneCode() {
    setPhoneNotice(/^\d{6}$/.test(verificationCode)
      ? '현재 문자 인증 서비스가 연결되지 않아 인증번호를 확인할 수 없습니다.'
      : '인증번호 6자리를 입력해 주세요.')
    verificationInput.current?.focus()
  }

  function submit(event) {
    event.preventDefault()
    setSubmitAttempted(true)
    const submissionErrors = validateSignup(values, agreements)
    if (!submissionErrors.email && demoCheckedEmail !== values.email.trim()) {
      submissionErrors.email = '이메일 중복 확인 버튼을 눌러 주세요. 현재는 개발용 시연으로 진행됩니다.'
    }
    if (values.phone && !submissionErrors.phone) {
      submissionErrors.phone = '휴대폰 인증이 필요합니다. 현재 인증 서비스가 연결되지 않아 확인할 수 없습니다. 시연은 선택 항목인 휴대폰 번호를 비우고 진행해 주세요.'
    }
    setErrors(submissionErrors)
    if (Object.keys(submissionErrors).length) {
      setMessage('입력 내용과 필수 약관 동의를 확인해 주세요.')
      const first = Object.keys(submissionErrors)[0]
      event.currentTarget.elements.namedItem(first === 'agreements' ? 'terms' : first)?.focus()
      return
    }
    setMessage('입력 형식 확인을 마쳤습니다. 회원가입 서버와 이메일 중복 확인 API가 연결되지 않아 계정을 생성하지 않았습니다. 입력 정보는 전송·저장되지 않습니다.')
    setCompletionOpen(true)
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
        <img className="signup-character signup-character--dog" src={assetHref(dog)} alt="딸기 케이크를 만드는 강아지 파티시에" />
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
                  {name === 'email' && <button className="signup-check-email" type="button" onClick={checkDemoEmail}>중복 확인</button>}
                </div>
                <p className={`signup-help${error ? ' signup-help--error' : ''}`} id={`signup-${name}-help`} aria-live="polite">{error ? <SignupError>{error}</SignupError> : (name === 'email' ? emailNotice : name === 'password' ? '8자 이상 · 영문, 숫자, 특수문자 포함' : name === 'phone' ? phoneNotice : '')}</p>
                {name === 'phone' && <>
                  <button className="signup-phone-button signup-phone-request" type="button" onClick={requestPhoneCode}>인증번호 받기</button>
                  <div className="signup-verification-row">
                    <div className="signup-input-row"><input ref={verificationInput} aria-label="인증번호 6자리" aria-describedby="signup-phone-help" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="인증번호 6자리" value={verificationCode} onChange={event => setVerificationCode(event.target.value.replace(/\D/g, ''))} /></div>
                    <button className="signup-phone-button" type="button" onClick={confirmPhoneCode}>인증 확인</button>
                  </div>
                </>}
              </div>
            })}
            <fieldset className="signup-agreements" aria-describedby="signup-agreements-error" aria-invalid={Boolean(agreementError)}>
              <legend className="signup-sr-only">약관 동의</legend>
              <label className="signup-agree-all"><input type="checkbox" checked={allAgreed} onChange={event => { changeAgreements({ terms: event.target.checked, privacy: event.target.checked, events: event.target.checked }) }} />전체 동의</label>
              {[['terms', '이용약관'], ['privacy', '개인정보 수집 및 이용'], ['events', '이벤트 및 혜택 정보 수신']].map(([key, title]) => <div className="signup-agree-row" key={key}><label><input name={key} type="checkbox" required={key !== 'events'} checked={agreements[key]} onChange={event => { changeAgreements({ ...agreements, [key]: event.target.checked }) }} />{title} 동의 <span>({key === 'events' ? '선택' : '필수'})</span></label><button type="button" onClick={() => showTerms(title)}>약관 보기</button></div>)}
              <p className={`signup-help${agreementError ? ' signup-help--error' : ''}`} id="signup-agreements-error" aria-live="polite">{agreementError && <SignupError>{agreementError}</SignupError>}</p>
            </fieldset>
            <button className="signup-submit" type="submit"><SignupIcon />회원가입</button>
            <p className="signup-status" role="status" aria-live="polite">{message || '현재 회원가입 서비스 연결 준비 중입니다.'}</p>
          </form>
          <p className="signup-login">이미 계정이 있으신가요? <a href={appHref("/login")}>로그인</a></p>
        </section>
        <img className="signup-character signup-character--cat" src={assetHref(cat)} alt="하트 쿠키를 들고 웃는 아기 고양이 파티시에" />
      </div>
      <dialog className={`signup-dialog${document === '이용약관' ? ' signup-terms-dialog' : document === '개인정보 수집 및 이용' ? ' signup-privacy-dialog' : document === '이벤트 및 혜택 정보 수신' ? ' signup-events-dialog' : ''}`} ref={dialog} aria-labelledby="signup-document-title" onClick={event => { if (event.target === event.currentTarget) dialog.current.close() }}>
        {document === '이용약관' ? <>
          <header className="signup-terms-header">
            <h2 id="signup-document-title">이용약관 안내</h2>
            <button className="signup-terms-close" type="button" aria-label="이용약관 닫기" onClick={() => dialog.current.close()} autoFocus>×</button>
          </header>
          <div className="signup-terms-body" tabIndex={0} role="region" aria-label="이용약관 본문">
            <p className="signup-terms-notice">디자인 확인용 예시 약관입니다. 확정된 약관 원문이 아니며 실제 서비스에 적용되지 않습니다.</p>
            {[
              ['제1조 (목적)', '본 예시는 MELLOW BAKE 온라인 쇼핑 서비스의 이용 조건과 회원의 권리 및 의무를 안내하는 약관 화면의 구성을 보여주기 위해 작성되었습니다.'],
              ['제2조 (회원가입)', '이용자는 회원가입 시 필요한 정보를 입력하고 약관 동의 절차를 진행하는 화면을 확인할 수 있습니다. 실제 가입 조건과 승인 절차는 정식 약관에서 별도로 안내할 예정입니다.'],
              ['제3조 (서비스 이용)', '서비스는 상품 조회, 주문 내역 확인 등의 기능으로 구성될 수 있습니다. 실제 제공 범위와 이용 시간, 서비스 변경에 관한 사항은 정식 서비스 공개 시 안내할 예정입니다.'],
              ['제4조 (상품 주문 및 결제)', '이용자는 상품 정보와 주문 내용을 확인한 뒤 제공되는 결제 수단을 선택하는 절차를 거칠 수 있습니다. 주문 성립 시점과 결제 조건은 확정된 정책에 따라 별도로 안내할 예정입니다.'],
              ['제5조 (배송 및 수령)', '배송 가능 지역, 배송비, 배송 일정 및 상품 수령 시 유의 사항을 안내하는 영역의 예시입니다. 실제 조건은 상품 안내와 정식 운영 정책을 통해 확인할 수 있도록 할 예정입니다.'],
              ['제6조 (주문 취소 및 교환·환불)', '주문 취소, 교환 및 환불 신청 방법과 처리 절차를 안내하는 영역의 예시입니다. 구체적인 기준과 제한 사항은 정식 약관 및 상품별 안내에서 제공할 예정입니다.'],
              ['제7조 (회원의 의무)', '정확한 정보 입력, 계정 관리 및 서비스 이용 시 유의 사항을 안내하는 영역의 예시입니다. 회원의 구체적인 권리와 의무는 정식 약관에서 확인할 수 있도록 할 예정입니다.'],
              ['제8조 (문의 및 분쟁 처리)', '서비스 이용 관련 문의 접수 방법과 처리 절차를 안내하는 영역의 예시입니다. 정식 서비스의 문의처 및 분쟁 처리 기준은 추후 확정된 문서로 제공할 예정입니다.'],
            ].map(([title, content]) => <section key={title}><h3>{title}</h3><p>{content}</p></section>)}
          </div>
          <footer className="signup-terms-footer"><button type="button" onClick={() => dialog.current.close()}>확인</button></footer>
        </> : document === '개인정보 수집 및 이용' ? <>
          <header className="signup-privacy-header">
            <h2 id="signup-document-title">개인정보 수집 및 이용 동의</h2>
            <button className="signup-privacy-close" type="button" aria-label="개인정보 수집 및 이용 동의 닫기" onClick={() => dialog.current.close()} autoFocus>×</button>
          </header>
          <div className="signup-privacy-body" tabIndex={0} role="region" aria-label="개인정보 수집 및 이용 동의 본문">
            <p className="signup-privacy-notice">디자인 테스트용 예시 문구입니다. 실제 운영용으로 확정된 개인정보 처리 문서가 아니며, 이 예시를 근거로 개인정보를 수집하거나 제공하지 않습니다.</p>
            <section>
              <h3>1. 개인정보 수집 및 이용 목적</h3>
              <p>회원가입 및 회원 관리, 상품 주문 처리, 배송 안내, 고객 문의 응대 등 서비스 제공 목적을 안내하는 예시입니다. 실제 수집·이용 목적은 정식 문서에서 확정하여 안내할 예정입니다.</p>
            </section>
            <section>
              <h3>2. 수집하는 개인정보 항목</h3>
              <p>서비스 단계별로 수집 항목을 구분하여 표시하는 예시입니다. 실제 수집 항목과 필수·선택 여부는 운영 정책 확정 후 안내할 예정입니다.</p>
              <ul>
                <li>회원가입 예시: 이름, 이메일, 비밀번호, 닉네임, 휴대폰 번호</li>
                <li>상품 주문 및 배송 예시: 수령인 이름, 배송지 주소, 연락처</li>
                <li>서비스 이용 예시: 주문 내역, 결제 및 서비스 이용 기록</li>
              </ul>
            </section>
            <section>
              <h3>3. 개인정보 보유 및 이용 기간</h3>
              <p>정보별 보유 목적과 기간, 이용 종료 후 처리 방법을 안내하는 영역입니다. 실제 보유 기간과 별도 보관 기준은 아직 확정되지 않았으며, 정식 문서에서 구체적으로 안내할 예정입니다.</p>
            </section>
            <section>
              <h3>4. 개인정보 제3자 제공</h3>
              <p>제3자 제공이 필요한 경우 제공받는 자, 제공 목적, 제공 항목 및 보유·이용 기간을 구분하여 안내하는 영역입니다. 현재 이 예시에 확정된 제공 대상이나 조건은 없으며, 실제 제공 여부와 필요한 동의 절차는 정식 문서에서 안내할 예정입니다.</p>
            </section>
            <section>
              <h3>5. 개인정보 수집 및 이용 동의 거부</h3>
              <p>이용자는 개인정보 수집 및 이용에 대한 동의를 거부할 수 있습니다. 다만 회원가입에 필요한 필수 정보의 수집 및 이용에 동의하지 않을 경우 회원가입이 제한될 수 있습니다.</p>
            </section>
            <section>
              <h3>6. 개인정보 처리 위탁</h3>
              <p>MELLOW BAKE는 원활한 서비스 제공을 위해 상품 배송, 결제 처리 등 일부 업무를 외부 전문 업체에 위탁할 수 있습니다. 위탁하는 경우 관련 법령에 따라 개인정보가 안전하게 처리되도록 관리/감독합니다.</p>
            </section>
            <section>
              <h3>7. 개인정보 보호 및 문의</h3>
              <p>MELLOW BAKE는 이용자의 개인정보를 안전하게 보호하기 위해 필요한 보안 조치를 시행합니다. 개인정보의 열람, 정정, 삭제 및 처리에 관한 문의는 고객센터를 통해 접수할 수 있습니다.</p>
            </section>
          </div>
          <footer className="signup-privacy-footer"><button type="button" onClick={() => dialog.current.close()}>확인</button></footer>
        </> : document === '이벤트 및 혜택 정보 수신' ? <>
          <header className="signup-events-header">
            <h2 id="signup-document-title">이벤트 및 혜택 정보 수신 동의</h2>
            <button className="signup-events-close" type="button" aria-label="이벤트 및 혜택 정보 수신 동의 닫기" onClick={() => dialog.current.close()} autoFocus>×</button>
          </header>
          <p className="signup-events-notice">디자인 구현용 예시이며 실제 운영용으로 확정된 문구가 아닙니다. 운영 시 확정된 마케팅 수신 동의 문구로 교체할 예정입니다. 수신 동의는 선택 사항으로, 동의하지 않아도 회원가입을 진행할 수 있습니다.</p>
          <div className="signup-events-body" tabIndex={0} role="region" aria-label="이벤트 및 혜택 정보 수신 동의 본문">
            {[
              ['1. 이벤트 및 혜택 정보 수신 목적', 'MELLOW BAKE는 신제품 출시, 할인 행사, 시즌 한정 상품 및 다양한 이벤트 정보를 회원에게 안내하기 위해 마케팅 정보를 발송할 수 있습니다.'],
              ['2. 수신하는 정보의 종류', '신제품 출시 소식, 할인 쿠폰, 특별 프로모션, 회원 전용 혜택 및 이벤트 참여 안내 등의 정보를 제공합니다.'],
              ['3. 정보 발송 방법', '이벤트 및 혜택 정보는 이메일, 문자메시지(SMS) 등 회원이 동의한 수신 방법을 통해 발송됩니다.'],
              ['4. 개인정보 이용 항목', '마케팅 정보 발송을 위해 회원이 제공한 이메일 주소와 휴대폰 번호를 이용할 수 있습니다.'],
              ['5. 개인정보 보유 및 이용 기간', '마케팅 정보 수신 동의 철회 또는 회원 탈퇴 시까지 관련 정보를 이용하며, 법령에 따라 보관이 필요한 경우에는 해당 규정을 따릅니다.'],
              ['6. 수신 동의 변경 및 철회', '회원은 언제든지 마케팅 정보 수신 동의를 변경하거나 철회할 수 있으며, 동의 철회 후에는 관련 광고성 정보 발송이 중단됩니다.'],
              ['7. 동의 거부에 대한 안내', '이벤트 및 혜택 정보 수신 동의는 선택 사항입니다. 동의하지 않더라도 회원가입과 기본 쇼핑몰 서비스 이용에는 제한이 없습니다.'],
            ].map(([title, content]) => <section key={title}><h3>{title}</h3><p>{content}</p></section>)}
          </div>
          <footer className="signup-events-footer"><button type="button" onClick={() => dialog.current.close()}>확인</button></footer>
        </> : <>
        <h2 id="signup-document-title">{document}</h2>
        <p>확정된 약관 원문이 아직 제공되지 않았습니다. 실제 서비스 이용 조건과 개인정보 처리 내용을 확인할 수 있도록 정식 문서 연결이 필요합니다.</p>
        <p>현재 체크박스는 화면 동작 확인용이며, 가입이나 개인정보 수집은 이루어지지 않습니다.</p>
        <form method="dialog"><button autoFocus>닫기</button></form>
        </>}
      </dialog>
    </main>
    <dialog className="signup-completion-dialog" ref={completionDialog} aria-labelledby="signup-completion-title" aria-describedby="signup-completion-demo signup-completion-description" onCancel={() => setCompletionOpen(false)} onClose={() => setCompletionOpen(false)} onClick={event => {
      if (event.target !== event.currentTarget) return
      const rect = event.currentTarget.getBoundingClientRect()
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) setCompletionOpen(false)
    }}>
      <button className="signup-completion-close" type="button" aria-label="회원가입 완료 시연 닫기" onClick={() => setCompletionOpen(false)} autoFocus>×</button>
      <svg className="signup-completion-check" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><circle cx="24" cy="24" r="20" /><path d="m14 24 7 7 13-14" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <p className="signup-completion-demo" id="signup-completion-demo">개발용 시연 · 실제 계정은 생성되지 않았습니다.</p>
      <h2 id="signup-completion-title">회원가입 입력 확인이 완료되었습니다.</h2>
      <p id="signup-completion-description">서버 연동 전으로 실제 계정은 생성되지 않았습니다.</p>
      <p className="signup-completion-invitation">로그인은 별도로 설정한 데모 계정을 이용해 주세요.</p>
      <a className="signup-completion-login" href={appHref("/login")} onClick={() => { setCompletionOpen(false); window.scrollTo({ top:0, left:0, behavior:'instant' }) }}>로그인하러 가기</a>
    </dialog>
    <div className="signup-footer"><HomeFooter /></div>
  </div>
}

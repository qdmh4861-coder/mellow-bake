import { useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import loginBear from '../images/login-bear.png'
import loginCat from '../images/login-cat.png'
import './Login.css'
import { DEMO_EMAIL, loginDemo, requiresDemoLogin } from '../demoAuth'

const savedEmailKey = 'mellow-bake.saved-email'

function readSavedEmail() {
  try { return window.localStorage.getItem(savedEmailKey) || '' } catch { return '' }
}

function LoginIcon({ type, ...props }) {
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    {type === 'cupcake' && <><path d="m7 19 3 11h12l3-11M13 21l1 7m5-7-1 7M7 19C0 19 2 10 8 11c-1-6 7-9 10-5 6-2 10 3 8 7 5 3 2 8-3 6Z" /><path d="M15 5c-1-4 5-5 5-1M9 14h1m7-3h1m4 5h1" /></>}
    {type === 'email' && <><rect x="3" y="6" width="26" height="20" rx="3" /><path d="m4 8 12 10L28 8" /></>}
    {type === 'lock' && <><rect x="6" y="14" width="20" height="15" rx="3" /><path d="M10 14V9a6 6 0 0 1 12 0v5m-6 6v3" /></>}
    {(type === 'eye' || type === 'eye-off') && <><path d="M2 16S7 7 16 7s14 9 14 9-5 9-14 9S2 16 2 16Z" /><circle cx="16" cy="16" r="4" />{type === 'eye-off' && <path d="m4 3 24 26" />}</>}
  </svg>
}

function LoginArtwork() {
  return <div className="login-artwork" aria-hidden="true">
    <div className="login-neon-sign">MELLOW<br />BAKE <span>♡</span></div>
    <div className="login-pendant login-pendant--left" /><div className="login-pendant login-pendant--right" />
    <div className="login-neon-cupcake"><LoginIcon type="cupcake" /></div>
    <div className="login-shelves">{[0, 1].map(row => <div className="login-shelf" key={row}><span className="login-display-cake"><i /><b /><i /></span></div>)}</div>
    <div className="login-counter" /><span className="login-tablecloth" />
    <svg className="login-sparkles" viewBox="0 0 1632 720" preserveAspectRatio="none" focusable="false">
      <g fill="#fff8ff" stroke="#ffc7fa" strokeWidth="2">
        {[ [430, 100, 13], [1210, 260, 10], [390, 480, 9], [1280, 540, 12], [70, 370, 9], [1500, 120, 10] ].map(([x, y, r]) => <path key={`${x}-${y}`} d={`M${x} ${y-r}q0 ${r} ${r} ${r}q-${r} 0 -${r} ${r}q0 -${r} -${r} -${r}q${r} 0 ${r} -${r}Z`} />)}
      </g>
    </svg>
    <img className="login-character login-character--bear" src={loginBear} alt="" />
    <img className="login-character login-character--cat" src={loginCat} alt="" />
  </div>
}

export default function Login() {
  const [email, setEmail] = useState(readSavedEmail)
  const [remember, setRemember] = useState(() => Boolean(readSavedEmail()))
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState(() => new URLSearchParams(window.location.search).has('required') ? '로그인이 필요한 페이지입니다. 데모 계정으로 로그인해 주세요.' : new URLSearchParams(window.location.search).has('loggedOut') ? '로그아웃되었습니다.' : '')
  const [submitting, setSubmitting] = useState(false)

  function saveEmail(nextEmail, nextRemember) {
    try {
      if (nextRemember && nextEmail.trim()) window.localStorage.setItem(savedEmailKey, nextEmail.trim())
      else window.localStorage.removeItem(savedEmailKey)
    } catch {
      // The form remains usable when browser storage is unavailable.
      if (nextRemember) setMessage('브라우저 저장소를 사용할 수 없어 아이디를 저장하지 못했습니다.')
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      await loginDemo(email, password)
      setPassword('')
      const next = new URLSearchParams(window.location.search).get('next')
      let destination = '/mypage'
      if (next) {
        try {
          const target = new URL(next, window.location.origin)
          if (target.origin === window.location.origin && requiresDemoLogin(target.pathname)) destination = target.pathname + target.search
        } catch { /* An invalid return address must not prevent a valid login. */ }
      }
      window.location.assign(destination)
    } catch (error) {
      setPassword('')
      setMessage(error.message || '데모 로그인에 실패했습니다. 브라우저 설정을 확인해 주세요.')
      setSubmitting(false)
    }
  }

  return <div className="login-page" id="home">
    <HomeHeader />
    <main className="login-main">
      <LoginArtwork />
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-brand"><LoginIcon type="cupcake" /></div>
        <h1 id="login-title">로그인</h1>
        <p className="login-welcome">MELLOW BAKE에 오신 것을 환영합니다!</p>
        <p className="login-service-note">프론트엔드 데모 로그인 · {DEMO_EMAIL}<br />실제 회원 인증이 아닙니다. 비밀번호는 개발용 설정에서 지정합니다.</p>
        <form onSubmit={handleSubmit}>
          <label className="login-field">
            <span className="login-sr-only">이메일(아이디)</span>
            <LoginIcon type="email" />
            <input name="email" type="email" autoComplete="username" placeholder="아이디(이메일)" required
              value={email} onChange={event => { setEmail(event.target.value); setMessage(''); saveEmail(event.target.value, remember) }} />
          </label>
          <label className="login-field login-field--password">
            <span className="login-sr-only">비밀번호</span>
            <LoginIcon type="lock" />
            <input name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="비밀번호" required
              value={password} onChange={event => { setPassword(event.target.value); setMessage('') }} />
          </label>
          <button className="login-password-toggle" type="button" aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
            aria-pressed={showPassword} onClick={() => setShowPassword(value => !value)}>
            <LoginIcon type={showPassword ? 'eye-off' : 'eye'} />
          </button>
          <div className="login-options">
            <label className="login-remember"><input type="checkbox" checked={remember} onChange={event => { setRemember(event.target.checked); saveEmail(email, event.target.checked) }} />아이디 저장</label>
          </div>
          <button className="login-submit" type="submit" disabled={submitting}>{submitting ? '확인 중…' : '로그인'}</button>
        </form>
            <div className="login-recovery">
              <button type="button" onClick={() => setMessage('아이디 찾기 서비스는 준비 중입니다.')}>아이디 찾기</button>
              <span aria-hidden="true">|</span>
              <button type="button" onClick={() => setMessage('비밀번호 찾기 서비스는 준비 중입니다.')}>비밀번호 찾기</button>
            </div>
        <div className="login-social-heading"><span>또는</span></div>
        <div className="login-social" aria-describedby="login-social-note">
          <button className="login-provider login-provider--kakao" type="button" disabled><svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="5" fill="#fee500" /><path d="M5 10c0-6 14-6 14 0 0 4-6 6-9 4l-3 2 1-3c-2 0-3-2-3-3Z" fill="#38201d" /></svg>카카오 로그인</button>
          <button className="login-provider login-provider--naver" type="button" disabled><span className="login-naver-mark" aria-hidden="true">N</span>네이버 로그인</button>
          <button className="login-provider login-provider--google" type="button" disabled><span className="login-google-mark" aria-hidden="true">G</span>구글 로그인</button>
        </div>
        <p id="login-social-note" className="login-service-note">간편 로그인은 연동 준비 중입니다.</p>
       <p className="login-signup">아직 계정이 없으신가요? <button type="button" onClick={() => { window.location.href = '/mellow-bake/signup' }}>회원가입</button></p>
        <p className="login-status" role="status" aria-live="polite">{message}</p>
      </section>
    </main>
    <div className="login-footer">
      <HomeFooter />
    </div>
  </div>
}

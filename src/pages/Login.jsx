import { useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import cakeArtwork from '../images/back.png'
import './Login.css'

const savedEmailKey = 'mellow-bake.saved-email'

function readSavedEmail() {
  try { return window.localStorage.getItem(savedEmailKey) || '' } catch { return '' }
}

function LoginIcon({ type, ...props }) {
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    {type === 'hat' && <><path d="M8 21C-1 21 0 9 8 10c3-9 14-9 17 0 8-1 9 11 0 11v7H8Z" /><path d="M9 24h15" /></>}
    {type === 'email' && <><rect x="3" y="6" width="26" height="20" rx="3" /><path d="m4 8 12 10L28 8" /></>}
    {type === 'lock' && <><rect x="6" y="14" width="20" height="15" rx="3" /><path d="M10 14V9a6 6 0 0 1 12 0v5m-6 6v3" /></>}
    {(type === 'eye' || type === 'eye-off') && <><path d="M2 16S7 7 16 7s14 9 14 9-5 9-14 9S2 16 2 16Z" /><circle cx="16" cy="16" r="4" />{type === 'eye-off' && <path d="m4 3 24 26" />}</>}
  </svg>
}

function LoginArtwork() {
  return <div className="login-artwork" aria-hidden="true">
    {['left', 'right'].flatMap(side => ['top', 'bottom'].map(position => {
      const bottom = position === 'bottom'
      return <svg key={`${side}-${position}`} className={`login-art login-art--${side} login-art--${position}`}
        viewBox={`${side === 'right' ? 1143 : 0} ${bottom ? 800 : 0} 492 ${bottom ? 616 : 800}`}
        preserveAspectRatio={`${side === 'right' ? 'xMax' : 'xMin'}${bottom ? 'YMax' : 'YMin'} meet`} focusable="false">
        <image href={cakeArtwork} width="1635" height="1416" />
      </svg>
    }))}
    <span className="login-checks login-checks--left" /><span className="login-checks login-checks--right" />
    <svg className="login-neon-cake" viewBox="0 0 120 110" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" focusable="false">
      <path d="m19 49 64-23 21 23-64 25Zm0 0v34l21 17 64-24V49M40 74v26M20 65q11 12 16 2t13 5q10-4 9-13t12 5q9-4 9-13t12 4l12-5" />
      <path d="M64 26c-15 1-16-16-4-17 0-12 20-11 20 0 13 1 13 16-1 17Z" />
    </svg>
    <svg className="login-sparkles" viewBox="0 0 1632 720" preserveAspectRatio="none" focusable="false">
      <g fill="#fff8ff" stroke="#ffc7fa" strokeWidth="2">
        {[ [430, 100, 13], [1210, 260, 10], [390, 480, 9], [1280, 540, 12], [70, 370, 9], [1500, 120, 10] ].map(([x, y, r]) => <path key={`${x}-${y}`} d={`M${x} ${y-r}q0 ${r} ${r} ${r}q-${r} 0 -${r} ${r}q0 -${r} -${r} -${r}q${r} 0 ${r} -${r}Z`} />)}
      </g>
    </svg>
  </div>
}

export default function Login() {
  const [email, setEmail] = useState(readSavedEmail)
  const [remember, setRemember] = useState(() => Boolean(readSavedEmail()))
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')

  function saveEmail(nextEmail, nextRemember) {
    try {
      if (nextRemember && nextEmail.trim()) window.localStorage.setItem(savedEmailKey, nextEmail.trim())
      else window.localStorage.removeItem(savedEmailKey)
    } catch {
      // The form remains usable when browser storage is unavailable.
      if (nextRemember) setMessage('브라우저 저장소를 사용할 수 없어 아이디를 저장하지 못했습니다.')
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    setMessage('로그인 서비스 연결 준비 중입니다. 현재 입력하신 정보는 전송되지 않습니다.')
  }

  return <div className="login-page" id="home">
    <HomeHeader />
    <main className="login-main">
      <LoginArtwork />
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-brand"><LoginIcon type="hat" /><span>Mellow Bake</span></div>
        <h1 id="login-title">LOGIN</h1>
        <p className="login-welcome">멜로우 베이커리에 오신 것을 환영합니다!</p>
        <form onSubmit={handleSubmit}>
          <label className="login-field">
            <span className="login-sr-only">이메일(아이디)</span>
            <LoginIcon type="email" />
            <input name="email" type="email" autoComplete="username" placeholder="이메일(아이디)을 입력해 주세요" required
              value={email} onChange={event => { setEmail(event.target.value); setMessage(''); saveEmail(event.target.value, remember) }} />
          </label>
          <label className="login-field login-field--password">
            <span className="login-sr-only">비밀번호</span>
            <LoginIcon type="lock" />
            <input name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="비밀번호를 입력해 주세요" required
              value={password} onChange={event => { setPassword(event.target.value); setMessage('') }} />
          </label>
          <button className="login-password-toggle" type="button" aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
            aria-pressed={showPassword} onClick={() => setShowPassword(value => !value)}>
            <LoginIcon type={showPassword ? 'eye-off' : 'eye'} />
          </button>
          <div className="login-options">
            <label className="login-remember"><input type="checkbox" checked={remember} onChange={event => { setRemember(event.target.checked); saveEmail(email, event.target.checked) }} />아이디 저장</label>
            <div className="login-recovery">
              <button type="button" onClick={() => setMessage('아이디 찾기 서비스는 준비 중입니다.')}>아이디 찾기</button>
              <span aria-hidden="true">|</span>
              <button type="button" onClick={() => setMessage('비밀번호 찾기 서비스는 준비 중입니다.')}>비밀번호 찾기</button>
            </div>
          </div>
          <button className="login-submit" type="submit">로그인 <span aria-hidden="true">›</span></button>
        </form>
        <div className="login-social-heading"><span>또는 간편 로그인</span></div>
        <div className="login-social" aria-describedby="login-social-note">
          <button className="login-provider login-provider--kakao" type="button" disabled><svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="5" fill="#fee500" /><path d="M5 10c0-6 14-6 14 0 0 4-6 6-9 4l-3 2 1-3c-2 0-3-2-3-3Z" fill="#38201d" /></svg>카카오 로그인</button>
          <button className="login-provider login-provider--naver" type="button" disabled><span className="login-naver-mark" aria-hidden="true">N</span>네이버 로그인</button>
          <button className="login-provider login-provider--google" type="button" disabled><span className="login-google-mark" aria-hidden="true">G</span>구글 로그인</button>
        </div>
        <p id="login-social-note" className="login-service-note">간편 로그인은 연동 준비 중입니다.</p>
        <p className="login-signup">아직 회원이 아니신가요? <button type="button" onClick={() => setMessage('회원가입 페이지는 준비 중입니다.')}>회원가입하기 ›</button></p>
        <p className="login-status" role="status" aria-live="polite">{message}</p>
      </section>
    </main>
    <div className="login-footer">
      <HomeFooter />
    </div>
  </div>
}

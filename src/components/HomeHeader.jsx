import './HomeHeader.css'

import { useEffect, useId, useRef, useState } from 'react'
import { logoutDemo, useDemoUser } from '../demoAuth'

const mainLinks = [
  ['HOME', '/'],
  ['MENU', '/menu'],
  ['ABOUT', '/about'],
  ['STORE', '/store'],
]

function HeaderIcon({ type }) {
  return (
    <svg className={`home-header__glyph home-header__glyph--${type}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {type === 'search' && <><path d="m15 15 6 6" stroke="#865043" strokeWidth="5" /><path d="m15 15 6 6" stroke="#ff9abc" strokeWidth="2.5" /><circle cx="10" cy="10" r="6.8" fill="#ffd9e7" stroke="#865043" /><circle cx="10" cy="10" r="4.7" fill="#fff9fa" stroke="#ffb2cf" /><path d="M3 2 1 1m7 0V.5" stroke="#ff77a3" /></>}
      {type === 'cart' && <><path d="M2 3h3l3 13h12l2-10H6" fill="#fff0d6" stroke="#865043" /><path d="M8 19h12" stroke="#865043" /><circle cx="9" cy="21" r="1.7" fill="#ff91b5" stroke="#865043" /><circle cx="19" cy="21" r="1.7" fill="#ff91b5" stroke="#865043" /><path d="M14 13s-4-2.5-4-5a2.2 2.2 0 0 1 4-1 2.2 2.2 0 0 1 4 1c0 2.5-4 5-4 5Z" fill="#ff9abb" stroke="#af5c66" strokeWidth="1" /></>}
      {type === 'user' && <><path d="M6.5 12C3 3 6-1 9 3l2 8m2 0 2-8c3-4 6 0 2.5 9" fill="#fff9ef" stroke="#865043" /><path d="M6 11c-7 4-5 12 6 12s13-8 6-12" fill="#fffaf2" stroke="#865043" /><path d="m7 4 1.5 5M17 4l-1.5 5" stroke="#ffb6d0" /><ellipse cx="8.4" cy="16" rx=".9" ry="1.2" fill="#713d35" stroke="none" /><ellipse cx="15.6" cy="16" rx=".9" ry="1.2" fill="#713d35" stroke="none" /><path d="m10.5 18 1.5 1 1.5-1" stroke="#713d35" strokeWidth="1" /><path d="M5 18h2m10 0h2" stroke="#ffa9c6" strokeWidth="2.4" /></>}
      {type === 'menu' && <g fill="#ffa0bd" stroke="#9b5f57" strokeWidth="1.2"><rect x="2" y="4" width="20" height="3.4" rx="1.7" /><rect x="2" y="10.3" width="20" height="3.4" rx="1.7" /><rect x="2" y="16.6" width="20" height="3.4" rx="1.7" /></g>}
    </svg>
  )
}

function HeaderTrim() {
  const wave = 'M0 16q60-14 120 0' + Array(11).fill('t120 0').join(' ')
  return <div className="home-header__trim" aria-hidden="true">{['wide', 'mobile'].map(size => <svg key={size} className={`home-header__wave home-header__wave--${size}`} viewBox={`0 0 ${size === 'mobile' ? 480 : 1440} 38`} preserveAspectRatio="none"><path d={`${wave}V0H0Z`} fill="white" /><path d={wave} fill="none" stroke="#ffd2e1" strokeWidth="8" /><path d={wave} fill="none" stroke="#f990b5" strokeWidth="1.2" strokeDasharray="5 4" /></svg>)}<svg className="home-header__trim-bow" viewBox="0 0 120 48" fill="none"><path d="M57 26C11 42 22-5 47 13l13 13m3 0c46 16 35-31 10-13L60 26" fill="#ffb5cc" stroke="#ed7d9c" strokeWidth="2.5" /><path d="m56 29-14 13m22-13 14 13" stroke="#f39ab6" strokeWidth="6" /><rect x="55" y="21" width="10" height="10" rx="4" fill="#f387ab" /></svg><span className="home-header__trim-hearts home-header__trim-hearts--left">♡ ♡</span><span className="home-header__trim-hearts home-header__trim-hearts--right">♡ ♡</span></div>
}
export default function HomeHeader() {
  const user = useDemoUser()
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const updateHash = () => setHash(window.location.hash)
    window.addEventListener('hashchange', updateHash)
    return () => window.removeEventListener('hashchange', updateHash)
  }, [])
  function isCurrent(href) {
    if (href === '/#our-story') return pathname === '/' && hash === '#our-story'
    if (href === '/') return pathname === '/' && hash !== '#our-story'
    return pathname === href || (href === '/menu' && pathname.startsWith('/menu/'))
  }
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef(null)
  const accountButton = useRef(null)
  const accountMenuId = useId()
  const [cartOpen, setCartOpen] = useState(false)
  const cartRef = useRef(null)
  const cartLink = useRef(null)
  const cartMenuId = useId()

  useEffect(() => {
    if (!cartOpen) return
    function outsideClick(event) {
      if (!cartRef.current?.contains(event.target)) setCartOpen(false)
    }
    function escapeKey(event) {
      if (event.key !== 'Escape') return
      if (cartRef.current?.contains(window.document.activeElement)) cartLink.current?.focus()
      setCartOpen(false)
    }
    window.document.addEventListener('pointerdown', outsideClick)
    window.document.addEventListener('keydown', escapeKey)
    return () => {
      window.document.removeEventListener('pointerdown', outsideClick)
      window.document.removeEventListener('keydown', escapeKey)
    }
  }, [cartOpen])

  useEffect(() => {
    if (!accountOpen) return
    function outsideClick(event) {
      if (!accountRef.current?.contains(event.target)) setAccountOpen(false)
    }
    function escapeKey(event) {
      if (event.key !== 'Escape') return
      setAccountOpen(false)
      if (accountRef.current?.contains(window.document.activeElement)) accountButton.current?.focus()
    }
    window.document.addEventListener('pointerdown', outsideClick)
    window.document.addEventListener('keydown', escapeKey)
    return () => {
      window.document.removeEventListener('pointerdown', outsideClick)
      window.document.removeEventListener('keydown', escapeKey)
    }
  }, [accountOpen])

  return (
    <header className="home-header">
      <div className="home-header__inner">
        <a className="home-header__logo" href="/" aria-label="MELLOW BAKE 홈">
          <svg className="home-header__brand-art" viewBox="89 74 1995 557" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><image href="/images/header-bakery-logo.png" width="2172" height="724" /></svg>
        </a>
        <nav className="home-header__nav" aria-label="메인 메뉴">
          {mainLinks.map(([label, href]) => <a key={label} href={href} aria-current={isCurrent(href) ? 'page' : undefined}>{label}</a>)}
        </nav>
        <div className="home-header__actions">
          <button className="home-header__icon" type="button" disabled aria-label="검색 (준비 중)" title="검색 기능 준비 중"><HeaderIcon type="search" /></button>
          <div className="home-header__account" ref={cartRef}
            onPointerEnter={event => { if (event.pointerType === 'mouse') setCartOpen(true) }}
            onPointerLeave={event => { if (event.pointerType === 'mouse' && !event.currentTarget.contains(window.document.activeElement)) setCartOpen(false) }}
            onFocus={() => setCartOpen(true)}
            onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setCartOpen(false) }}>
            <a className="home-header__icon" ref={cartLink} href="/cart" aria-label="장바구니" title="장바구니" aria-expanded={cartOpen} aria-controls={cartMenuId}><HeaderIcon type="cart" /></a>
            <nav className="home-header__account-dropdown" id={cartMenuId} aria-label="장바구니 및 찜 메뉴" hidden={!cartOpen}>
              <a href="/cart" onClick={() => setCartOpen(false)}>장바구니</a>
              <a href="/wishlist" onClick={() => setCartOpen(false)}>찜</a>
            </nav>
          </div>
          <div className="home-header__account" ref={accountRef}
            onPointerEnter={event => { if (event.pointerType === 'mouse') setAccountOpen(true) }}
            onPointerLeave={event => { if (event.pointerType === 'mouse' && !event.currentTarget.contains(window.document.activeElement)) setAccountOpen(false) }}
            onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setAccountOpen(false) }}>
            <button className="home-header__icon" type="button" ref={accountButton} aria-label="회원 메뉴" title="로그인 및 회원가입" aria-expanded={accountOpen} aria-controls={accountMenuId} onClick={() => setAccountOpen(open => !open)}><HeaderIcon type="user" /></button>
            <nav className="home-header__account-dropdown" id={accountMenuId} aria-label="회원 메뉴" hidden={!accountOpen}>
              {!user && <a href="/login" onClick={() => setAccountOpen(false)}>로그인</a>}
              {!user && <a href="/signup" onClick={() => setAccountOpen(false)}>회원가입</a>}
              <a href="/mypage" onClick={() => setAccountOpen(false)}>마이페이지</a>
              {user && <a href="/login?loggedOut=1" onClick={event => { event.preventDefault(); logoutDemo() }}>로그아웃</a>}
            </nav>
          </div>
          <details className="home-header__menu">
            <summary className="home-header__icon" aria-label="전체 메뉴"><HeaderIcon type="menu" /></summary>
            <nav className="home-header__dropdown" aria-label="전체 메뉴">
              {mainLinks.map(([label, href]) => <a key={label} href={href} aria-current={isCurrent(href) ? 'page' : undefined} onClick={event => event.currentTarget.closest('details').removeAttribute('open')}>{label}</a>)}
              <a href="/new-menu" onClick={event => event.currentTarget.closest('details').removeAttribute('open')}>NEW MENU</a>
              <a href="/reviews" onClick={event => event.currentTarget.closest('details').removeAttribute('open')}>REVIEW</a>
            </nav>
          </details>
        </div>
      </div>
      <HeaderTrim />
    </header>
  )
}



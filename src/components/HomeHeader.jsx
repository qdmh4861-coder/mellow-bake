import './HomeHeader.css'

import { useEffect, useId, useRef, useState } from 'react'
import { logoutDemo, useDemoUser } from '../demoAuth'

const mainLinks = [
  ['HOME', '/'],
  ['MENU', '/menu'],
  ['ABOUT', '/#our-story'],
  ['STORE', '/store'],
]

function HeaderIcon({ type }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {type === 'search' && <><circle cx="10.5" cy="10.5" r="6" /><path d="m15 15 5 5" /></>}
      {type === 'cart' && <><path d="M2 3h3l2.5 12h11L21 7H6M8 15l-1 3h12" /><circle cx="9" cy="21" r="1" /><circle cx="18" cy="21" r="1" /></>}
      {type === 'user' && <><circle cx="12" cy="8" r="3.5" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" /></>}
      {type === 'menu' && <path d="M4 5h16M4 12h16M4 19h16" />}
    </svg>
  )
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
          <svg viewBox="0 0 30 34" fill="none" aria-hidden="true"><path d="M5 11h20l-2 19H7L5 11Z" fill="#ff75a3" /><path d="M5 15h20M6 21h18M7 27h16" stroke="#fff" strokeWidth="2" /><path d="M10 10c-5-2-3-8 1-7 1-4 7-3 7 1 5-2 9 5 3 7" fill="#ffb3cd" /><path d="M14 2v8" stroke="#ff4d92" strokeWidth="2" /></svg>
          <span>MELLOW BAKE</span>
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
    </header>
  )
}

import './HomeHeader.css'

const mainLinks = [
  ['HOME', '#home'],
  ['MENU', '#best-menu'],
  ['ABOUT', '#our-story'],
  ['STORE', '#visit'],
]

function HeaderIcon({ type }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {type === 'search' && <><circle cx="10.5" cy="10.5" r="6" /><path d="m15 15 5 5" /></>}
      {type === 'user' && <><circle cx="12" cy="8" r="3.5" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" /></>}
      {type === 'menu' && <path d="M4 5h16M4 12h16M4 19h16" />}
    </svg>
  )
}

export default function HomeHeader() {
  return (
    <header className="home-header">
      <div className="home-header__inner">
        <a className="home-header__logo" href="#home" aria-label="MELLOW BAKE 홈">
          <svg viewBox="0 0 30 34" fill="none" aria-hidden="true"><path d="M5 11h20l-2 19H7L5 11Z" fill="#ff75a3" /><path d="M5 15h20M6 21h18M7 27h16" stroke="#fff" strokeWidth="2" /><path d="M10 10c-5-2-3-8 1-7 1-4 7-3 7 1 5-2 9 5 3 7" fill="#ffb3cd" /><path d="M14 2v8" stroke="#ff4d92" strokeWidth="2" /></svg>
          <span>MELLOW BAKE</span>
        </a>
        <nav className="home-header__nav" aria-label="메인 메뉴">
          {mainLinks.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
        </nav>
        <div className="home-header__actions">
          <button className="home-header__icon" type="button" disabled aria-label="검색 (준비 중)" title="검색 기능 준비 중"><HeaderIcon type="search" /></button>
          <button className="home-header__icon" type="button" disabled aria-label="마이페이지 (준비 중)" title="마이페이지 준비 중"><HeaderIcon type="user" /></button>
          <details className="home-header__menu">
            <summary className="home-header__icon" aria-label="전체 메뉴"><HeaderIcon type="menu" /></summary>
            <nav className="home-header__dropdown" aria-label="전체 메뉴">
              {mainLinks.map(([label, href]) => <a key={label} href={href} onClick={event => event.currentTarget.closest('details').removeAttribute('open')}>{label}</a>)}
              <a href="#new-menu" onClick={event => event.currentTarget.closest('details').removeAttribute('open')}>NEW MENU</a>
              <a href="#new-arrivals" onClick={event => event.currentTarget.closest('details').removeAttribute('open')}>NEW ARRIVALS</a>
              <a href="#reviews" onClick={event => event.currentTarget.closest('details').removeAttribute('open')}>REVIEW</a>
            </nav>
          </details>
        </div>
      </div>
    </header>
  )
}

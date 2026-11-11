import { assetHref, appHref } from '../appRouting'
import { useId } from 'react'
import WaveDivider from './WaveDivider'
import artwork from '../assets/find-your-sweet-illustrations.png'
import './FindYourSweet.css'

const categories = [
  { id:'bread', label:'빵', col:2, row:0 },
  { id:'cake', label:'케이크', col:3, row:0 },
  { id:'sandwich', label:'샌드위치', col:0, row:1 },
  { id:'drink', label:'음료', col:1, row:1 },
  { id:'all', label:'전체', col:2, row:1 },
]

function Illustration({ col, row, className = '' }) {
  const clipId = useId()
  return <svg className={`find-sweet-art ${className}`} viewBox="0 0 1 1" aria-hidden="true" focusable="false">
    <defs><clipPath id={clipId}><rect width="1" height="1" /></clipPath></defs>
    <image href={assetHref(artwork)} x={-col} y={-row} width="4" height="2" preserveAspectRatio="none" clipPath={`url(#${clipId})`} />
  </svg>
}

function Heart() {
  return <svg viewBox="0 0 52 48" aria-hidden="true" fill="none"><path d="M26 42S4 30 4 16C4 2 21 0 26 13 32 0 48 3 48 16c0 14-22 26-22 26Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" /></svg>
}

export default function FindYourSweet() {
  return <section className="find-sweet-section" aria-labelledby="find-sweet-title">
    <div className="find-sweet-inner">
      <div className="find-sweet-heading-row">
        <div className="find-sweet-character find-sweet-character--rabbit"><Illustration col={0} row={0} /><span className="find-sweet-character-rays" aria-hidden="true"><i /><i /><i /></span></div>
        <div className="find-sweet-heading">
          <p className="find-sweet-eyebrow"><Heart /><span>FIND YOUR SWEET</span><Heart /></p>
          <h2 id="find-sweet-title">오늘은 어떤 디저트가 끌려요?</h2>
          <p className="find-sweet-description">취향에 맞는 메뉴를 골라보세요 ♡</p>
        </div>
        <div className="find-sweet-character find-sweet-character--cat"><Illustration col={1} row={0} /><span className="find-sweet-floating-heart"><Heart /></span></div>
      </div>
      <nav className="find-sweet-cards" aria-label="디저트 카테고리">
        {categories.map(category => <a className="find-sweet-card" key={category.id} href={appHref(`/menu/${category.id}`)}>
          <Illustration col={category.col} row={category.row} />
          <span className="find-sweet-card-label">{category.label}</span>
          <span className="find-sweet-card-rays" aria-hidden="true"><i /><i /><i /></span>
        </a>)}
      </nav>
      <svg className="find-sweet-spark find-sweet-spark--left" viewBox="0 0 60 60" aria-hidden="true"><path d="M30 2Q31 28 57 30 31 32 30 58 28 32 3 30 28 28 30 2Z" fill="currentColor" /></svg>
      <svg className="find-sweet-spark find-sweet-spark--right" viewBox="0 0 60 60" aria-hidden="true"><path d="M30 2Q31 28 57 30 31 32 30 58 28 32 3 30 28 28 30 2Z" fill="currentColor" /></svg>
    </div>
    <WaveDivider fromColor="#fff7ed" toColor="#ffb193" />
  </section>
}

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { registeredProducts } from '../productCatalog'
import cakeArtwork from '../pages/cakeListArt.json'
import CatalogProductImage from './CatalogProductImage'
import './ProductSearch.css'

const categories = [['all','전체'],['bread','빵'],['cake','케이크'],['sandwich','샌드위치'],['drink','음료']]
const normalize = value => value.normalize('NFKC').toLocaleLowerCase().replace(/\s+/g, '')

function CategoryIcon({ category }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {category === 'bread' ? <><path d="M5 9C1 9 1 3 7 4c2-3 8-3 10 0 6-1 6 5 2 5v11H5Z" /><path d="m9 9 1 5m4-5 1 5" /></> : category === 'cake' ? <><path d="M3 11h18v10H3Zm0 4h18M12 4v7" /><path d="M12 2c-4 4 4 4 0 0Z" /></> : category === 'sandwich' ? <><path d="M2 9 12 3l10 6-10 6Zm0 5 10 6 10-6M2 18l10 5 10-5" /></> : category === 'drink' ? <><path d="M5 6h13l-2 16H7ZM3 6h17M13 6l2-5h5" /></> : <><path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" /></>}
  </svg>
}

export default function ProductSearch({ onClose }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const input = useRef(null)
  const dialog = useRef(null)
  const matches = useMemo(() => {
    const needle = normalize(query.trim())
    return registeredProducts.filter(product => (category === 'all' || product.category === category) && normalize(`${product.koreanName} ${product.name}`).includes(needle))
  }, [query, category])

  useEffect(() => {
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    input.current?.focus({ preventScroll: true })
    function keyboard(event) {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return }
      if (event.key !== 'Tab') return
      const items = [...dialog.current.querySelectorAll('a[href],button,input')].filter(el => !el.disabled && el.getClientRects().length)
      const first = items[0], last = items.at(-1)
      if (event.shiftKey && (document.activeElement === first || !dialog.current.contains(document.activeElement))) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && (document.activeElement === last || !dialog.current.contains(document.activeElement))) { event.preventDefault(); first?.focus() }
    }
    function keepFocus(event) { if (!dialog.current?.contains(event.target)) input.current?.focus({ preventScroll: true }) }
    document.addEventListener('keydown', keyboard)
    document.addEventListener('focusin', keepFocus)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', keyboard)
      document.removeEventListener('focusin', keepFocus)
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
    }
  }, [onClose])

  return createPortal(<div className="mb-search-overlay" onClick={event => { if (event.target === event.currentTarget) onClose() }}>
    <section className="mb-search" role="dialog" aria-modal="true" aria-labelledby="mb-search-title" ref={dialog}>
      <button className="mb-search-close" type="button" onClick={onClose} aria-label="검색 닫기">×</button>
      <div className="mb-search-top">
        <p className="mb-search-eyebrow">✦ MELLOW BAKE · DISCOVER</p>
        <div className="mb-search-heading">
          <img className="mb-search-rabbit" src="/images/member-cutouts/review-bunny.png" alt="" />
          <span className="mb-search-crown" aria-hidden="true">♔</span>
          <h2 id="mb-search-title">Find your sweet</h2>
          <p>오늘 마음에 드는 디저트를 찾아봐요.</p>
          <img className="mb-search-cupcake" src="/images/member-cutouts/review-cupcake.png" alt="" />
        </div>
        <form className="mb-search-field" role="search" onSubmit={event => event.preventDefault()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="10" cy="10" r="6.5" /><path d="m15 15 6 6" /></svg>
          <label className="mb-search-visually-hidden" htmlFor="mb-product-query">상품 검색</label>
          <input id="mb-product-query" ref={input} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="어떤 디저트를 찾으세요?" autoComplete="off" />
          {query && <button type="button" onClick={() => { setQuery(''); input.current?.focus() }} aria-label="검색어 초기화">×</button>}
        </form>
        <p className="mb-search-tagline">✧ 달콤한 취향을 발견하는 순간 ✧</p>
      </div>
      <svg className="mb-search-wave" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 20Q125-15 250 20T500 20T750 20T1000 20V40H0Z" /></svg>
      <div className="mb-search-results">
        <div className="mb-search-result-heading"><div><h3>오늘의 달콤한 발견 ♡</h3><p>작은 행복을 하나씩 골라봐요 ♡</p></div><span role="status" aria-live="polite">✦ {matches.length}개의 디저트</span></div>
        <div className="mb-search-categories" role="group" aria-label="상품 카테고리">{categories.map(([id,label]) => <button type="button" key={id} aria-pressed={category === id} onClick={() => setCategory(id)}><CategoryIcon category={id} /> {label}</button>)}</div>
        {matches.length ? <div className="mb-search-grid">{matches.map(product => <a className={`mb-search-card mb-search-card--${product.category}`} key={product.id} href={product.detailHref} data-search-product={product.id} onClick={onClose}>
          <div className="mb-search-card-copy"><span className="mb-search-card-spark" aria-hidden="true">✦ ♡</span><h4>{product.koreanName}</h4><p className="mb-search-english">{product.name}</p><p className="mb-search-description">{product.description}</p><span className="mb-search-discover">DISCOVER ✧ <span>→</span></span></div>
          <div className="mb-search-product-art"><CatalogProductImage product={product} artwork={product.id === 'cake-2' ? cakeArtwork['cake-2'] : undefined} /></div>
        </a>)}</div> : <div className="mb-search-empty"><span aria-hidden="true">✧ ♡ ✧</span><h4>앗! 찾는 디저트가 없어요 ♡</h4><p>다른 이름으로 다시 찾아볼까요?</p><button type="button" onClick={() => { setQuery(''); setCategory('all'); input.current?.focus() }}>검색어와 카테고리 초기화</button></div>}
      </div>
    </section>
  </div>, document.body)
}

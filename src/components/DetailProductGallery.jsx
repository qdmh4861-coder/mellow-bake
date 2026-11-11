import { appHref } from '../appRouting'
import { useLayoutEffect, useRef, useState } from 'react'
import './DetailProductGallery.css'

export default function DetailProductGallery({ children, images }) {
  const galleryRef = useRef(null)
  const [selected, setSelected] = useState(0)
  const available = images === undefined ? undefined : images.filter((item, index, all) => all.findIndex(other => other.id === item.id) === index).slice(0, 5)
  useLayoutEffect(() => {
    // Crop composite artwork to its product viewBox inside this gallery only.
    galleryRef.current?.querySelectorAll('svg[viewBox]').forEach(svg => svg.setAttribute('preserveAspectRatio', 'xMidYMid slice'))
  }, [children, available, selected])
  if (available !== undefined) return <div className="reference-product-gallery" ref={galleryRef}>
    <div className="reference-product-thumbnails detail-header-thumbnails" role="group" aria-label="상품 이미지 선택">{available.map((item, index) => <button type="button" key={item.id} aria-label={item.label} aria-pressed={selected === index} onClick={() => setSelected(index)}>{item.image}</button>)}</div>
    <div className="reference-product-photo" aria-live="polite">{available[selected]?.image || available[0]?.image || children}</div>
  </div>
  return <div className="reference-product-gallery" ref={galleryRef}>
    <div className="reference-product-thumbnails" aria-hidden="true"><div>{children}</div></div>
    <div className="reference-product-photo">{children}</div>
  </div>
}

export function DetailQuickLinks({ links }) {
  return <nav className="reference-product-quick-links" aria-label="상품 안내 바로가기">{links.map(([href, label], index) => <a href={appHref(href)} key={href}>
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {index === 0 ? <><path d="M10 27 22 5M15 19C2 16 4 7 13 11c5 3 2 8 2 8Zm4-7c-5-9 3-15 6-7 2 5-6 7-6 7Zm-9 15C0 25 1 17 8 20c5 2 2 7 2 7Z" /></> : index === 1 ? <path d="M16 27S2 18 3 10c1-7 10-8 13-1 3-7 12-6 13 1 1 8-13 17-13 17Z" /> : <><path d="m4 10 12-7 12 7v13l-12 7-12-7V10Zm0 0 12 7 12-7M16 17v13M10 6l12 7v6" /></>}
    </svg><span>{label}</span>
  </a>)}</nav>
}

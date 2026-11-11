import { assetHref } from '../appRouting'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import './MemberBottomLayout.css'
import wishlistDecorAssets from './wishlistDecorAssets.json'

function Bow() {
  return <svg className="member-common-bow" viewBox="0 0 240 65" fill="none" aria-hidden="true">
    <path d="M4 51C30 28 50 36 75 45c18 8 34 10 45-2 11 12 27 10 45 2 25-9 45-17 71 6" stroke="#ec247d" strokeWidth="4.2" strokeLinecap="round" />
    <path d="M120 40C99 7 72 5 78 25c4 14 25 19 42 15Zm0 0c21-33 48-35 42-15-4 14-25 19-42 15Z" fill="#ff8cbb" stroke="#e92378" strokeWidth="2.8" strokeLinejoin="round" />
    <path d="M84 19c7-6 19 6 27 14m45-14c-7-6-19 6-27 14" stroke="#ffe6f1" strokeWidth="3" strokeLinecap="round" />
    <path d="M79 28c5 16 24 20 38 12m44-12c-5 16-24 20-38 12" stroke="#f53b8a" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="114" y="31" width="12" height="12" rx="5" fill="#f74794" stroke="#df1b70" strokeWidth="2" />
  </svg>
}
// Final reference artwork edited as isolated transparent decorative assets.
function BottomArt({ name, className = '', orange = false }) {
  const assets = {
    desserts: [1536, 1024, '68 57 1436 926'],
    rabbit: [1304, 1206, '97 83 1110 1019'],
  }
  const [width, height, box] = assets[name]
  const recolored = orange && wishlistDecorAssets[name]
  if (recolored) return <svg className={`member-bottom-final-art ${className}`} viewBox={recolored.box} preserveAspectRatio="xMidYMid meet" aria-hidden="true"><image href={assetHref(recolored.src)} width={recolored.width} height={recolored.height} /></svg>
  return <svg className={`member-bottom-final-art ${className}`} viewBox={box} preserveAspectRatio="xMidYMid meet" aria-hidden="true"><image href={assetHref(`/images/member-bottom-final-${name}.png`)} width={width} height={height} /></svg>
}
export function MemberSidebarDecoration() {
  return <div className="member-sidebar-bottom" aria-hidden="true"><BottomArt name="rabbit" /></div>
}
function DessertDisplay({ orange = false }) {
  return <div className="member-shared-bottom" aria-hidden="true"><Bow /><div className="member-shared-desserts"><BottomArt name="desserts" orange={orange} /></div></div>
}
export default function MemberBottomLayout({ rootRef }) {
  const [target, setTarget] = useState(null)
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    function locate() {
      const next = root.querySelector('.mypage-layout > .mypage-content') || root.querySelector('.wishlist-bottom-slot') || root.querySelector('.wishlist-main')
      setTarget(previous => previous === next ? previous : next)
    }
    locate()
    const observer = new MutationObserver(locate)
    observer.observe(root, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [rootRef])
  return target ? createPortal(<DessertDisplay orange={Boolean(target.closest('.wishlist-page'))} />, target) : null
}



import { appLocation } from '../appRouting'
import './MemberTheme.css'
import './MemberVisualPolish.css'
import MyPageFooter from './MyPageFooter'
import { useRef } from 'react'
import MemberBottomLayout from './MemberBottomLayout'

export default function MemberTheme({ children }) {
  const rootRef = useRef(null)
  const path = appLocation.pathname
  return path === '/mypage' || path.startsWith('/mypage/') || path === '/wishlist'
    ? <div className="member-theme member-bottom-layout" ref={rootRef}>{children}<MemberBottomLayout rootRef={rootRef} /><MyPageFooter orange={path === '/wishlist'} /></div> : children
}

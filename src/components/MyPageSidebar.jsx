import { appLocation, appHref } from '../appRouting'
import { useEffect, useRef, useState } from 'react'
import MemberArtwork from './MemberArtwork'
import MemberIcon from './MemberIcon'

import LogoutConfirm from './LogoutConfirm'
import { MemberSidebarDecoration } from './MemberBottomLayout'

const menuGroups = [
  ['쇼핑정보', ['주문내역', '배송조회', '취소 / 반품 / 교환 내역', '환불 / 결제 내역', '배송지 관리']],
  ['나의 활동', ['찜한 상품', '최근 본 상품', '작성한 리뷰']],
  ['혜택관리', ['쿠폰 이벤트', '쿠폰함', '적립금 내역', '쿠폰·포인트 현황']],
  ['고객센터', ['공지사항', '1:1 문의하기', '문의 내역', '자주 묻는 질문']],
  ['회원정보', ['회원정보 변경', '비밀번호 변경', '로그아웃']],
]

export default function MyPageSidebar() {
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [expanded, setExpanded] = useState(() => window.innerWidth > 760)
  useEffect(() => {
    const query = window.matchMedia('(min-width: 761px)')
    const change = () => setExpanded(query.matches)
    query.addEventListener('change', change)
    return () => query.removeEventListener('change', change)
  }, [])
  const dialog = useRef(null)
  const [feature, setFeature] = useState('')
  const pathname = appLocation.pathname.replace(/\/+$/, '') || '/'
  const menuLinks = { '주문내역': '/mypage/orders/list', '배송조회': '/mypage/orders', '찜한 상품': '/wishlist', '회원정보 변경': '/mypage/profile', '작성한 리뷰': '/mypage/reviews', '쿠폰 이벤트': '/mypage/coupon-events', '쿠폰함': '/mypage/coupons', '적립금 내역': '/mypage/points', '쿠폰·포인트 현황': '/mypage/benefits' }
  menuLinks['공지사항'] = '/mypage/notices'
  menuLinks['비밀번호 변경'] = '/mypage/password'
  menuLinks['취소 / 반품 / 교환 내역'] = '/mypage/claims'
  menuLinks['환불 / 결제 내역'] = '/mypage/payments'
  menuLinks['배송지 관리'] = '/mypage/addresses'
  menuLinks['1:1 문의하기'] = '/mypage/inquiry'
  menuLinks['문의 내역'] = '/mypage/inquiries'
  menuLinks['자주 묻는 질문'] = '/mypage/faq'
  const activeMenu = Object.entries(menuLinks).find(([, href]) => href === pathname)?.[0] || (pathname.startsWith('/mypage/notices/') ? '공지사항' : pathname === '/mypage/orders/detail' ? '주문내역' : null)
  const pendingMessage = feature === '로그아웃'
    ? '현재 로그인 서비스가 연동되지 않아 로그인된 계정이 없습니다. 로그아웃 기능은 회원 서비스 연동 후 제공됩니다.'
    : feature === '쿠폰함'
        ? '현재 표시할 쿠폰 데이터가 없습니다. 쿠폰함 서비스는 준비 중입니다.'
        : `${feature} 서비스는 준비 중입니다. 현재 연결된 회원 데이터나 페이지가 없습니다.`
  function showPending(label) {
    if (label === '로그아웃') { setLogoutOpen(true); return }
    setFeature(label)
    dialog.current?.showModal()
  }
  return <>
    <details className="mypage-navigation" open={expanded} onToggle={event => setExpanded(event.currentTarget.open)}>
      <summary>마이페이지 전체 메뉴 <span aria-hidden="true">⌄</span></summary>
      <aside className="mypage-sidebar" aria-label="마이페이지 메뉴">
        <a className="member-sidebar-brand" href={appHref("/mypage")} aria-current={pathname === '/mypage' ? 'page' : undefined}><MemberArtwork part="badge" /><strong>마이페이지</strong><span>My Page</span></a>
        {menuGroups.map(([group, entries], index) => <section key={group}><h2><MemberIcon type={['bag', 'heart', 'gift', 'support', 'user'][index]} />{group}</h2><ul>{entries.map(label => <li key={label}>{menuLinks[label] ? <a href={appHref(menuLinks[label])} aria-current={activeMenu === label ? 'page' : undefined}>{label}<span className="member-menu-arrow" aria-hidden="true">›</span></a> : <button type="button" onClick={() => showPending(label)}>{label}<span className="member-menu-arrow" aria-hidden="true">›</span></button>}</li>)}</ul></section>)}
        <MemberSidebarDecoration />
      </aside>
    </details>
    <dialog className="mypage-pending" ref={dialog} aria-label={feature || '메뉴 안내'}><h2>{feature}</h2><p>{pendingMessage}</p><form method="dialog"><button type="submit">확인</button></form></dialog>
    <LogoutConfirm open={logoutOpen} onClose={() => setLogoutOpen(false)} />
  </>
}

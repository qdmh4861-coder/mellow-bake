import { useRef, useState } from 'react'

import { logoutDemo } from '../demoAuth'

const menuGroups = [
  ['쇼핑정보', ['주문내역', '배송조회', '취소 / 반품 / 교환 내역', '환불 / 결제 내역', '배송지 관리']],
  ['나의 활동', ['찜한 상품', '최근 본 상품', '작성한 리뷰']],
  ['혜택관리', ['쿠폰 이벤트', '쿠폰함', '적립금 내역', '쿠폰·포인트 현황']],
  ['고객센터', ['공지사항', '1:1 문의하기', '문의 내역', '자주 묻는 질문']],
  ['회원정보', ['회원정보 변경', '비밀번호 변경', '로그아웃']],
]

export default function MyPageSidebar() {
  const dialog = useRef(null)
  const [feature, setFeature] = useState('')
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
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
    if (label === '로그아웃') { logoutDemo(); return }
    setFeature(label)
    dialog.current?.showModal()
  }
  return <>
    <aside className="mypage-sidebar" aria-label="마이페이지 메뉴">
      {menuGroups.map(([group, entries]) => <section key={group}><h2>{group}</h2><ul>{entries.map(label => <li key={label}>{menuLinks[label] ? <a href={menuLinks[label]} aria-current={activeMenu === label ? 'page' : undefined}>{label}</a> : <button type="button" onClick={() => showPending(label)}>{label}</button>}</li>)}</ul></section>)}
    </aside>
    <dialog className="mypage-pending" ref={dialog} aria-label={feature || '메뉴 안내'}><h2>{feature}</h2><p>{pendingMessage}</p><form method="dialog"><button type="submit">확인</button></form></dialog>
  </>
}

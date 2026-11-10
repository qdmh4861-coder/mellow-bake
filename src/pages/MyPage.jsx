import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import './MyPage.css'
import MyPageSidebar from '../components/MyPageSidebar'
import { useWishlist } from '../wishlistStore'
import { benefitSummary } from '../benefitData'
import { useDemoUser } from '../demoAuth'
import MemberArtwork from '../components/MemberArtwork'
import MemberIcon from '../components/MemberIcon'
import { getOrders, orderDetailHref, orderMoney } from '../orderData'
import { memberOrderSteps, orderPhase, recentMemberOrders } from '../mypageData'

// Member, order and coupon services are not connected; wishlist counts use browser data.
export default function MyPage() {
  const user = useDemoUser()
  const wishlist = useWishlist()
  const benefits = benefitSummary()
  const orders = getOrders()
  const recent = recentMemberOrders(orders)
  const count = phase => recent.filter(order => orderPhase(order) === phase).length
  return <div className="mypage-page member-dashboard">
    <HomeHeader />
    <main className="mypage-layout">
      <MyPageSidebar />
      <div className="mypage-content">
        <h1 className="mypage-sr-only">MY PAGE</h1>
        <section className="mypage-welcome" aria-labelledby="mypage-welcome-title">
          <span className="member-banner-ribbon">MELLOW BAKE</span>
          <MemberArtwork cutout part="rabbit" /><MemberArtwork cutout part="treats" />
          <div className="member-welcome-copy"><h2 id="mypage-welcome-title">MELLOW BAKE에<br />오신 것을 환영합니다 ♡</h2><p><strong>{user?.nickname || '데모 회원'}님, 환영합니다!</strong><br />달콤한 디저트와 함께 특별한 시간을 보내세요.</p></div>
          <span className="member-sparkle member-sparkle--one" aria-hidden="true">✧</span><span className="member-sparkle member-sparkle--two" aria-hidden="true">♡</span>
        </section>
        <p className="member-demo-note">프론트엔드 데모 로그인 · 기존 브라우저 데이터를 사용하며 실제 회원 서버와 연동되지 않습니다.</p>
        <div className="mypage-summary">{[['쿠폰', `${benefits.availableCoupons}장`, '/mypage/coupons', 'coupon'], ['주문 내역', `${orders.length}건`, '/mypage/orders/list?preview=0', 'bag'], ['찜한 상품', `${wishlist.length}개`, '/wishlist', 'heart']].map(([label, value, href, icon]) => <a key={label} href={href}><span className="member-card-bow" aria-hidden="true">⋈</span><MemberIcon type={icon} /><div><strong>{label}</strong><span>{value}</span></div><b aria-hidden="true">›</b></a>)}</div>
        <section className="mypage-order-status" aria-labelledby="mypage-status-title">
          <h2 id="mypage-status-title"><MemberIcon type="cake" />나의 주문 처리 현황 <span>(최근 3개월 기준)</span></h2>
          <div className="mypage-status-card"><ol>{memberOrderSteps.map((step, index) => <li key={step}><a href={`/mypage/orders/list?preview=0&range=3&status=${encodeURIComponent(step)}`} aria-label={`${step} ${count(step)}건`}><div className="member-status-cloud"><MemberIcon type={['list', 'card', 'box', 'truck', 'gift'][index]} /><strong>{count(step)}</strong></div><span>{step}</span></a></li>)}</ol><dl>{['취소', '교환', '반품'].map(label => <div key={label}><dt><a href={`/mypage/orders/list?preview=0&range=3&status=${encodeURIComponent(label)}`}>{label}</a></dt><dd>{count(label)}</dd></div>)}</dl></div>
        </section>
        <section className="mypage-orders" id="my-recent-orders" aria-labelledby="mypage-orders-title">
          <h2 id="mypage-orders-title"><MemberIcon type="bag" />최근 주문 정보 <span>(최근 3개월 기준)</span></h2>
          <div className="mypage-orders-card"><table><caption className="mypage-sr-only">최근 3개월 주문 정보</caption><thead><tr>{['주문일자', '주문번호', '상품정보', '결제금액', '주문상태'].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead><tbody>{recent.length ? recent.slice(0, 5).map(order => <tr key={order.id}><td>{order.orderedAt}</td><td><a href={orderDetailHref(order.id)}>{order.number || order.id}<small>상세보기 ›</small></a></td><td>{order.items?.map(item => `${item.koreanName} ${item.quantity}개`).join(', ')}</td><td>{orderMoney(order.payment?.total)}</td><td>{orderPhase(order)}</td></tr>) : <tr><td colSpan={5}><MemberArtwork cutout part="box" /><p>최근 3개월간 주문 내역이 없습니다.</p></td></tr>}</tbody></table></div>
        </section>
      </div>
      <div className="member-bottom-decoration" aria-hidden="true"><span>♡ ✧ · ♡</span><MemberArtwork cutout part="treats" /></div>
    </main>
    <HomeFooter />
  </div>
}

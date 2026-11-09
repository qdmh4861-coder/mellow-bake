import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import './MyPage.css'
import MyPageSidebar from '../components/MyPageSidebar'
import { useWishlist } from '../wishlistStore'
import { benefitSummary } from '../benefitData'
import { useDemoUser } from '../demoAuth'

const orderSteps = ['주문접수', '결제완료', '상품준비중', '배송중', '배송완료']

// Member, order and coupon services are not connected; wishlist counts use browser data.
export default function MyPage() {
  const user = useDemoUser()
  const wishlist = useWishlist()
  const benefits = benefitSummary()
  return <div className="mypage-page">
    <HomeHeader />
    <main className="mypage-layout">
      <MyPageSidebar />
      <div className="mypage-content">
        <h1>MY PAGE</h1>
        <section className="mypage-welcome" aria-labelledby="mypage-welcome-title">
          <h2 id="mypage-welcome-title">MELLOW BAKE에 오신 것을 환영합니다</h2>
          <p>{user?.nickname}님, 환영합니다. 프론트엔드 데모 로그인 중이며, 데이터는 이 브라우저에만 보관됩니다.</p>
          <div className="mypage-summary"><a href="/mypage/coupons"><strong>쿠폰</strong><span>{benefits.availableCoupons}장</span></a><a href="#my-recent-orders"><strong>주문 내역</strong><span>0건</span></a><a href="/wishlist"><strong>찜한 상품</strong><span>{wishlist.length}개</span></a></div>
        </section>
        <section className="mypage-order-status" aria-labelledby="mypage-status-title">
          <h2 id="mypage-status-title">나의 주문 처리 현황 <span>(최근 3개월 기준)</span></h2>
          <div className="mypage-status-card"><ol>{orderSteps.map(step => <li key={step}><a href="#my-recent-orders" aria-label={`${step} 0건`}><strong>0</strong><span>{step}</span></a></li>)}</ol><dl>{['취소', '교환', '반품'].map(label => <div key={label}><dt>{label}</dt><dd>0</dd></div>)}</dl></div>
        </section>
        <section className="mypage-orders" id="my-recent-orders" aria-labelledby="mypage-orders-title">
          <h2 id="mypage-orders-title">최근 주문 정보 <span>(최근 3개월 기준)</span></h2>
          <div className="mypage-orders-card"><table><caption className="mypage-sr-only">최근 3개월 주문 정보</caption><thead><tr>{['주문일자', '주문번호', '상품정보', '결제금액', '주문상태'].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead><tbody><tr><td colSpan={5}>최근 3개월간 주문 내역이 없습니다</td></tr></tbody></table></div>
        </section>
      </div>
    </main>
    <HomeFooter />
  </div>
}

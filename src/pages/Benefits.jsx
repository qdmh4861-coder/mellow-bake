import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import MyPageSidebar from '../components/MyPageSidebar'
import './MyPage.css'
import './Benefits.css'
import EventPage from './CouponEvent'
import CouponPage from './CouponWallet'
import PointsPage from './PointsLedger'
import OverviewPage from './BenefitOverview'

// Read-only design examples; not stored or included in balances.
const examplePoints = [
  { id: 'example-point-1', occurredAt: '2026-10-30', kind: 'earn', amount: 500, description: '주문완료 포인트 적립 (주문번호 MB103045)', example: true },
  { id: 'example-point-2', occurredAt: '2026-10-25', kind: 'use', amount: -1000, description: '주문결제 시 포인트 사용 (주문번호 MB102978)', example: true },
  { id: 'example-point-3', occurredAt: '2026-10-20', kind: 'earn', amount: 300, description: '리뷰 작성 포인트 적립', example: true },
  { id: 'example-point-4', occurredAt: '2026-10-05', kind: 'expire', amount: -500, description: '유효기간 만료로 포인트 소멸', example: true },
]
export default function Benefits({ page }) {
  return <div className="mypage-page benefits-page"><HomeHeader /><main className="mypage-layout"><MyPageSidebar /><div className={`mypage-content benefits-content${page === 'events' ? ' coupon-event-page' : ''}`}>{page === 'events' ? <EventPage /> : page === 'coupons' ? <CouponPage /> : page === 'points' ? <PointsPage exampleRows={examplePoints} /> : <OverviewPage examplePoints={examplePoints} />}</div></main><HomeFooter /></div>
}

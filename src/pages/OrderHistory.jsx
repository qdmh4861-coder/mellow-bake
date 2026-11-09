import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import MyPageSidebar from '../components/MyPageSidebar'
import OrderProductImage from '../components/OrderProductImage'
import { orderDetailHref, orderMoney } from '../orderData'
import { displayOrders, displayOrder, orderSummaryItems } from '../orderPreview'
import './MyPage.css'
import './OrderHistory.css'

const deliverySteps = ['주문접수', '상품 준비중', '배송중', '배송 예정', '배송 완료']
function DeliveryIcon({ step }) {
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {step === 0 ? <><rect x="7" y="5" width="14" height="21" rx="2" /><path d="M21 10h5v18H12v-2M11 10h6m-6 5h6m-6 5h6" /></> : step === 1 ? <><path d="m5 10 11-6 11 6v13l-11 6-11-6V10Zm0 0 11 6 11-6M16 16v13M10 7l11 6v5" /></> : step === 2 ? <><path d="M3 7h16v17H3V7Zm16 6h6l4 5v6H19" /><circle cx="9" cy="25" r="3" /><circle cx="24" cy="25" r="3" /></> : step === 3 ? <><path d="M5 14 16 4l11 10v14H5V14Z" /><path d="M12 28V17h8v11" /></> : <><circle cx="16" cy="16" r="11" /><path d="m10 16 4 4 8-9" /></>}
  </svg>
}

// Orders and delivery tracking are not connected. Never treat cart items as orders.
export default function OrderHistory() {
  const orders = displayOrders()
  const requestedId = new URLSearchParams(window.location.search).get('orderId')
  const order = requestedId ? displayOrder(requestedId) : orders[0] || null
  const shipment = order?.shipment
  return <div className="mypage-page order-history-page">
    <HomeHeader />
    <main className="mypage-layout">
      <MyPageSidebar />
      <div className="mypage-content order-history-content">
        <h1>배송 조회</h1>
        <dl className="order-history-meta"><div><dt>주문번호</dt><dd>{order?.number || order?.id || '—'}</dd></div><div><dt>주문일자</dt><dd>{order?.orderedAt || '—'}</dd></div></dl>
        {order ? <>{orderSummaryItems(order).map((item, index) => <section className="order-history-product" key={`${item.id}-${index}`} aria-label={item.koreanName}><div className="order-history-photo-empty"><OrderProductImage item={item} /></div><div className="order-history-product-copy"><h2>{item.koreanName}</h2><p>{item.option || item.description} · {item.quantity}개</p><a href={orderDetailHref(order.id)}>주문 상세보기 &gt;</a></div><span className="order-history-amount">{orderMoney(item.unitPrice * item.quantity)}</span><span className="order-history-badge">{shipment?.statusLabel || '정보 없음'}</span></section>)}</> : <section className="order-history-product" aria-labelledby="order-history-empty-title">
          <div className="order-history-photo-empty" aria-label="주문 상품 없음"><DeliveryIcon step={1} /></div>
          <div className="order-history-product-copy"><h2 id="order-history-empty-title">{requestedId ? '주문을 찾을 수 없습니다' : '주문 내역이 없습니다'}</h2><p>주문 후 상품 옵션과 수량을 확인할 수 있습니다.</p></div>
          <span className="order-history-amount" aria-label="결제 금액 정보 없음">—</span>
          <span className="order-history-badge">정보 없음</span>
        </section>}
        <section className="order-history-progress" aria-labelledby="delivery-progress-title" data-has-shipment={Number.isInteger(shipment?.stage) && shipment.stage >= 0 && shipment.stage <= 4 ? 'true' : undefined}>
          <h2 id="delivery-progress-title">배송진행 현황</h2>
          <ol>{deliverySteps.map((step, index) => <li key={step} data-current={shipment?.stage === index ? 'true' : undefined} data-completed={Number.isInteger(shipment?.stage) && shipment.stage > index ? 'true' : undefined}><span className="order-history-step-icon"><DeliveryIcon step={index} /></span><strong>{step}</strong><span className="order-history-step-date">{shipment?.events?.find(event => event.stage === index)?.at || '—'}</span></li>)}</ol>
          {(!shipment?.carrier || !shipment?.trackingNumber) && <p className={!order ? 'mypage-sr-only' : undefined}>{order ? '배송 정보가 아직 등록되지 않았습니다' : '주문 및 배송 상태가 연결되면 진행 현황을 확인할 수 있습니다.'}</p>}
        </section>
        <section className="order-history-delivery" aria-labelledby="delivery-information-title"><h2 id="delivery-information-title">배송 정보</h2><dl>{[['받는 사람', shipment?.recipient], ['연락처', shipment?.phone], ['배송지', shipment?.address]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || '—'}</dd></div>)}</dl></section>
      </div>
    </main>
    <HomeFooter />
  </div>
}

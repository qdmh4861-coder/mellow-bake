import { useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import MyPageSidebar from '../components/MyPageSidebar'
import OrderProductImage from '../components/OrderProductImage'
import MemberArtwork from '../components/MemberArtwork'
import MemberIcon from '../components/MemberIcon'
import { useDemoUser } from '../demoAuth'
import { orderDetailHref, orderMoney } from '../orderData'
import { displayOrders, displayOrder, orderSummaryItems } from '../orderPreview'
import './MyPage.css'
import './OrderHistory.css'
import './OrderList.css'

const deliverySteps = ['주문접수', '상품 준비중', '배송중', '배송 예정', '배송 완료']
function DeliveryIcon({ step }) {
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {step === 0 ? <><rect x="7" y="5" width="14" height="21" rx="2" /><path d="M21 10h5v18H12v-2M11 10h6m-6 5h6m-6 5h6" /></> : step === 1 ? <><path d="m5 10 11-6 11 6v13l-11 6-11-6V10Zm0 0 11 6 11-6M16 16v13M10 7l11 6v5" /></> : step === 2 ? <><path d="M3 7h16v17H3V7Zm16 6h6l4 5v6H19" /><circle cx="9" cy="25" r="3" /><circle cx="24" cy="25" r="3" /></> : step === 3 ? <><path d="M5 14 16 4l11 10v14H5V14Z" /><path d="M12 28V17h8v11" /></> : <><circle cx="16" cy="16" r="11" /><path d="m10 16 4 4 8-9" /></>}
  </svg>
}

function accessibleOrder(order, user) {
  if (!order || !user) return false
  if (order.isPreview === true) return true // Existing isolated portfolio examples.
  const owner = order.userId || order.memberId || order.customerId || order.customer?.id
  // Never expose unowned real records. A backend must enforce this independently.
  return Boolean(owner) && (owner === user.id || owner === user.email)
}
function deliveryStage(shipment) {
  if (!shipment || /취소|반품|교환/.test(shipment.statusLabel || '')) return null
  const index = deliverySteps.findIndex(label => label.replaceAll(' ', '') === shipment.statusLabel?.replaceAll(' ', ''))
  if (index >= 0) return index
  return Number.isInteger(shipment.stage) && shipment.stage >= 0 && shipment.stage <= 4 ? shipment.stage : null
}
function DeliveryPhoto({ item }) {
  const [failed, setFailed] = useState(false)
  return <div className="order-history-photo-empty" onErrorCapture={() => setFailed(true)}>{failed ? <span className="order-history-image-fallback"><DeliveryIcon step={1} /><small>이미지 준비 중</small></span> : <OrderProductImage item={item} />}</div>
}

// Read existing browser/demo data only. No external carrier tracking is simulated.
export default function OrderHistory() {
  const user = useDemoUser()
  const params = new URLSearchParams(window.location.search)
  const listHref = params.get('preview') === '0' ? '/mypage/orders/list?preview=0' : '/mypage/orders/list'
  const requestedId = params.get('orderId')
  const orders = displayOrders().filter(item => accessibleOrder(item, user))
  const candidate = requestedId ? displayOrder(requestedId) : null
  const order = accessibleOrder(candidate, user) ? candidate : null
  const [selectedId, setSelectedId] = useState(order?.id || '')
  const [notice, setNotice] = useState('')
  const [, reread] = useState(0)
  const shipment = order?.shipment
  const stage = deliveryStage(shipment)
  const status = shipment?.statusLabel || (stage !== null ? deliverySteps[stage] : '정보 없음')
  const selection = order && !orders.some(item => item.id === order.id) ? [...orders, order] : orders
  function refresh() {
    reread(value => value + 1)
    setNotice('연결된 주문 정보를 다시 불러왔습니다. 실시간 택배 조회 API는 아직 연결되지 않았습니다.')
  }
  return <div className="mypage-page order-history-page">
    <HomeHeader />
    <main className="mypage-layout">
      <MyPageSidebar />
      <div className="mypage-content order-history-content order-list-content">
        <header className="order-list-banner"><MemberArtwork cutout part="rabbit" /><div><span className="order-list-banner-brand">MELLOW BAKE</span><h1><DeliveryIcon step={2} />배송 조회</h1><p>주문하신 상품의 배송 진행 상태를 확인하실 수 있습니다.</p></div><MemberArtwork cutout part="treats" /><span className="order-list-banner-sparkle" aria-hidden="true">✧ ♡</span></header>
        <form className="order-history-selector" action="/mypage/orders" method="get"><label htmlFor="delivery-order-choice">조회할 주문</label><select id="delivery-order-choice" name="orderId" value={selectedId} onChange={event => setSelectedId(event.target.value)} required><option value="">주문을 선택해 주세요</option>{selection.map(item => <option key={item.id} value={item.id}>{item.number || item.id} · {item.orderedAt || '주문일 정보 없음'}{item.isPreview ? ' (시연용)' : ''}</option>)}</select>{params.get('preview') === '0' && <input type="hidden" name="preview" value="0" />}<button type="submit" disabled={!selectedId}>조회</button></form>
        <dl className="order-history-meta"><div><dt>주문번호</dt><dd>{order?.number || order?.id || '—'}</dd></div><div><dt>주문일자</dt><dd>{order?.orderedAt || '—'}</dd></div></dl>
        {order ? <>
        {order.isPreview && <p className="order-history-demo-note">기존 포트폴리오 예시 주문입니다. 실제 고객 주문이나 실시간 배송 정보가 아닙니다.</p>}
        <section className="order-history-product" aria-label="선택한 주문 상품"><div className="order-history-product-items">{orderSummaryItems(order).map((item, index) => <div className="order-history-product-row" key={`${order.id}-${item.id}-${index}`}><DeliveryPhoto key={`${order.id}-${item.id}`} item={item} /><div className="order-history-product-copy"><h2>{item.koreanName}</h2><p>{item.option || item.description || '기본 구성'} · {item.quantity}개</p><a href={orderDetailHref(order.id)}>주문 상세보기 &gt;</a></div></div>)}</div><div className="order-history-amount"><small>주문 결제금액</small><strong>{orderMoney(order.payment?.total)}</strong></div><span className={`order-history-badge${stage === 4 ? ' is-delivered' : stage === 2 || stage === 3 ? ' is-shipping' : ''}`}><DeliveryIcon step={stage ?? 1} />{status}</span></section>
        <section className="order-history-progress" aria-labelledby="delivery-progress-title" data-has-shipment={stage !== null ? 'true' : undefined}>
          <h2 id="delivery-progress-title"><DeliveryIcon step={2} />배송진행 현황</h2>
          <ol>{deliverySteps.map((step, index) => <li key={step} aria-current={stage === index ? 'step' : undefined} data-current={stage === index ? 'true' : undefined} data-completed={stage !== null && stage > index ? 'true' : undefined}><span className="order-history-step-icon"><DeliveryIcon step={index} /></span><strong>{step}</strong><span className="order-history-step-date">{(Array.isArray(shipment?.events) ? shipment.events : []).find(event => event.stage === index)?.at || '—'}</span></li>)}</ol>
          <p className="order-history-tracking-note">{!shipment?.carrier || !shipment?.trackingNumber ? '배송 정보가 아직 등록되지 않았습니다. ' : ''}외부 택배사 실시간 조회 API는 연결되지 않았습니다.</p>
        </section>
        <section className="order-history-delivery" aria-labelledby="delivery-information-title"><h2 id="delivery-information-title"><MemberIcon type="gift" />배송 정보</h2><dl>{[['받는 사람', shipment?.recipient], ['연락처', shipment?.phone], ['배송지', shipment?.address], ['택배사', shipment?.carrier], ['운송장번호', shipment?.trackingNumber || '아직 등록되지 않았습니다.'], ['배송 요청사항', shipment?.deliveryRequest || shipment?.request || shipment?.message]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || '—'}</dd></div>)}</dl></section>
        <nav className="order-history-actions" aria-label="배송 조회 관련 메뉴"><a href={listHref}>주문 내역으로</a><a href={orderDetailHref(order.id)}>주문 상세보기</a><button type="button" onClick={refresh}>배송 정보 새로고침</button><a href="/mypage/inquiry">배송 관련 문의</a></nav><p className="order-history-notice" role="status">{notice}</p>
        </> : <section className="order-history-selection-empty" aria-labelledby="order-history-empty-title">
          <MemberArtwork cutout part="box" /><h2 id="order-history-empty-title">{requestedId ? '주문을 찾을 수 없거나 조회 권한이 없습니다.' : orders.length ? '배송 조회할 주문을 선택해 주세요.' : '조회할 주문 내역이 없습니다.'}</h2><p>{requestedId ? '주문번호를 확인하거나 주문 내역에서 조회할 주문을 다시 선택해 주세요.' : orders.length ? '상단에서 주문을 선택한 뒤 조회 버튼을 눌러 주세요.' : '주문이 연결되면 배송 진행 상태를 확인할 수 있습니다.'}</p><a href={listHref}>주문 내역으로 돌아가기 ›</a>
        </section>}
      </div>
    </main>
    <HomeFooter />
  </div>
}

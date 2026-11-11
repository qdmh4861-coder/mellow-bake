import { appLocation, appHref } from '../appRouting'
import { useRef, useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import MyPageSidebar from '../components/MyPageSidebar'
import OrderProductImage from '../components/OrderProductImage'
import CatalogProductImage from '../components/CatalogProductImage'
import { orderDeliveryHref, orderMoney } from '../orderData'
import { displayOrder, displayOrders } from '../orderPreview'
import { refundHistory } from '../paymentData'
import './MyPage.css'
import './OrderDetail.css'

export default function OrderDetail() {
  const requestedId = new URLSearchParams(appLocation.search).get('orderId')
  const order = requestedId ? displayOrder(requestedId) : displayOrders()[0] || null
  const shipment = order?.shipment
  const payment = order?.payment
  const refund = refundHistory().find(row => row.orderId === order?.id && row.id === new URLSearchParams(appLocation.search).get('refundId'))
  const confirmDialog = useRef(null)
  const [notice, setNotice] = useState('')
  const lateShipment = Number.isInteger(shipment?.stage) && shipment.stage >= 2
  function confirmCancellation() {
    confirmDialog.current?.close()
    setNotice(order?.isPreview ? '디자인 미리보기 주문입니다. 실제 주문 취소는 실행되지 않았습니다.' : lateShipment
      ? '배송이 진행된 주문은 취소 가능 여부를 확인해야 합니다. 주문 취소 기능 준비 중입니다.'
      : '주문 취소 기능 준비 중입니다. 실제 주문 상태와 결제 내역은 변경되지 않았습니다.')
  }
  return <div className="mypage-page order-detail-page">
    <HomeHeader />
    <main className="mypage-layout">
      <MyPageSidebar />
      <div className="mypage-content order-detail-content">
        <h1>{order?.isPortfolioPreview ? '시연용 주문 확인' : '주문 상세'}</h1>
        {order?.isPortfolioPreview && <p className="order-detail-notice">포트폴리오 시연용 상품 확인입니다. 실제 주문·결제·배송 요청은 생성되지 않았습니다. 표시 금액은 배송비와 할인을 제외한 상품 합계이며 개인정보를 입력받거나 전송하지 않습니다.</p>}
        {order?.id.startsWith('payment-example-') && <p className="order-detail-notice">포트폴리오 시연용 예시 결제 내역입니다. 실제 주문이나 결제가 아닙니다.</p>}
        <section className="order-detail-products" aria-label="주문 정보 및 상품 목록">
          <dl className="order-detail-meta"><div><dt>주문번호</dt><dd>{order?.number || order?.id || '—'}</dd></div><div><dt>주문일자</dt><dd>{order?.orderedAt || '—'}</dd></div><div><dt>주문 상태</dt><dd>{order?.statusLabel || '정보 없음'}</dd></div><div><dt>배송 상태</dt><dd><span className="order-detail-status">{shipment?.statusLabel || '정보 없음'}</span></dd></div></dl>
          {order?.items?.length ? <ul>{order.items.map((item, index) => <li key={`${item.id}-${index}`} className="order-detail-item"><div className="order-detail-photo">{order.isPortfolioPreview ? <CatalogProductImage product={item} /> : <OrderProductImage item={item} />}</div><div className="order-detail-item-info"><h2>{item.koreanName}</h2><p>{item.option || item.description}</p><strong>{orderMoney(item.unitPrice)}</strong></div><div className="order-detail-item-quantity"><span>수량</span><strong>{item.quantity}개</strong></div><div className="order-detail-line-total"><span>합계</span><strong>{orderMoney(item.unitPrice * item.quantity)}</strong></div></li>)}</ul> : <div className="order-detail-empty" role="status"><h2>{requestedId ? '주문을 찾을 수 없습니다' : '주문 내역이 없습니다'}</h2><p>{requestedId ? '해당 주문번호의 정보가 없거나 아직 주문 서비스가 연결되지 않았습니다.' : '주문이 연결되면 상품, 수량, 결제 금액을 이곳에서 확인할 수 있습니다.'}</p></div>}
        </section>
        <div className="order-detail-cards">
          <section className="order-detail-shipping" aria-labelledby="order-detail-shipping-title"><h2 id="order-detail-shipping-title">배송 정보</h2><dl>{[['받는 사람', shipment?.recipient], ['연락처', shipment?.phone], ['배송지', shipment?.address], ['택배사', shipment?.carrier], ['운송장 번호', shipment?.trackingNumber]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || '—'}</dd></div>)}</dl>{(!shipment?.carrier || !shipment?.trackingNumber) && <p className="order-detail-shipping-note">배송 정보가 아직 등록되지 않았습니다</p>}<a className="order-detail-tracking" href={appHref(orderDeliveryHref(order?.id || requestedId))}>배송 조회하기 &gt;</a></section>
          <section className="order-detail-payment" aria-labelledby="order-detail-payment-title"><h2 id="order-detail-payment-title">결제 정보</h2><dl>{payment?.method && <div><dt>결제수단</dt><dd>{payment.method}</dd></div>}<div><dt>상품 금액</dt><dd>{orderMoney(payment?.subtotal)}</dd></div><div><dt>배송비</dt><dd>{orderMoney(payment?.shippingFee)}</dd></div><div className="order-detail-discount"><dt>쿠폰 할인</dt><dd>{typeof payment?.discount === 'number' ? `-${orderMoney(payment.discount)}` : '—'}</dd></div><div className="order-detail-payment-total"><dt>{order?.isPortfolioPreview ? '상품 기준 예상 금액' : '최종 결제 금액'}</dt><dd>{orderMoney(payment?.total)}</dd></div>{refund && <><div><dt>환불 상태</dt><dd>{refund.status}</dd></div><div><dt>환불 금액</dt><dd>{orderMoney(refund.amount)}</dd></div><div><dt>환불 수단</dt><dd>{refund.method}</dd></div></>}</dl></section>
        </div>
        <div className="order-detail-actions"><button type="button" onClick={() => confirmDialog.current?.showModal()}>주문 취소하기</button><a href={appHref("/mypage/orders/list")}>주문 내역으로</a></div>
        <p className="order-detail-notice" role="status">{notice}</p>
      </div>
    </main>
    <dialog className="order-detail-confirm" ref={confirmDialog} aria-labelledby="order-cancel-title" aria-describedby="order-cancel-description">
      <button className="order-detail-confirm-close" type="button" aria-label="주문 취소 팝업 닫기" onClick={() => confirmDialog.current?.close()}><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" /></svg></button>
      <h2 id="order-cancel-title">주문을 취소하시겠습니까?</h2>
      <p id="order-cancel-description">취소한 주문은 다시 되돌릴 수 없습니다.</p>
      {lateShipment && <p className="order-detail-cancel-reason">이미 배송이 진행된 주문입니다. 취소 가능 여부를 먼저 확인해야 합니다.</p>}
      <div className="order-detail-confirm-actions"><button type="button" autoFocus onClick={() => confirmDialog.current?.close()}>돌아가기</button><button type="button" onClick={confirmCancellation}>주문 취소</button></div>
    </dialog>
    <HomeFooter />
  </div>
}

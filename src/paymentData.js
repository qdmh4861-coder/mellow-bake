import { getOrders } from './orderData'

// Portfolio payment snapshots, not catalog prices or actual payment transactions.
const demoOrders = [
  ['salt', 'MB251108-0041', '2026-11-08', 'bread-1', '소금빵', 2, 7600, '카드결제'],
  ['strawberry', 'MB251103-0038', '2026-11-03', 'cake-1', '딸기 생크림 케이크', 1, 8900, '네이버페이'],
  ['vanilla', 'MB251027-0032', '2026-10-27', 'payment-example-vanilla-latte', '바닐라 라떼', 2, 11600, '카드결제'],
].map(([suffix, number, orderedAt, productId, koreanName, quantity, total, method]) => ({
  id: `payment-example-${suffix}`, number, orderedAt, statusLabel: '결제완료', isPreview: true,
  items: [{ id: productId, koreanName, quantity, unitPrice: total / quantity, option: '포트폴리오 예시 주문 · 현재 판매 가격과 별도', imageSrc: null }],
  shipment: null,
  payment: { subtotal: total, total, method, status: 'paid' },
}))
export function paymentExampleOrder(id) { return demoOrders.find(order => order.id === id) || null }
export function paymentHistory() {
  const orders = getOrders()
  return (orders.length ? orders : demoOrders).filter(order => order.payment?.status ? order.payment.status === 'paid' : order.statusLabel === '결제완료').map(order => ({
    id: `payment-${order.id}`, orderId: order.id, number: order.number || order.id,
    date: order.orderedAt?.slice(0, 10).replaceAll('.', '-'), items: order.items || [],
    amount: order.payment?.total, method: order.payment?.method || '정보 없음', status: '결제완료', isPreview: order.isPreview === true,
  }))
}
export function refundHistory() {
  // Only explicit refund records qualify; cancellation/exchange status is never a refund.
  return getOrders().flatMap(order => (Array.isArray(order.refunds) ? order.refunds : []).filter(refund => refund.id && refund.requestedAt && Number.isFinite(refund.amount)).map(refund => ({
    id: refund.id, orderId: order.id, number: order.number || order.id, date: refund.requestedAt.slice(0, 10).replaceAll('.', '-'),
    items: refund.items || order.items || [], amount: refund.amount, method: refund.method || '정보 없음', status: refund.statusLabel || '정보 확인 중', isPreview: false,
  })))
}

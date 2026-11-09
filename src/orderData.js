// Read-only integration point. No order service exists yet, so no customer records
// are fabricated or copied from the cart. Replace this source when orders are connected.
// Order: { id, number, orderedAt, statusLabel,
//   items: [{ id, koreanName, description, option, imageSrc, unitPrice, quantity }],
//   shipment: { stage: 0..4, recipient, phone, address, carrier, trackingNumber, events: [] },
//   payment: { subtotal, shippingFee, discount, total } }
const orderRecords = []

export function getOrders() { return orderRecords }
export function getOrder(id) { return id ? getOrders().find(order => order.id === id) || null : null }
export function orderDetailHref(id) { return `/mypage/orders/detail${id ? `?orderId=${encodeURIComponent(id)}` : ''}` }
export function orderDeliveryHref(id) { return `/mypage/orders${id ? `?orderId=${encodeURIComponent(id)}` : ''}` }
export function orderMoney(value) { return typeof value === 'number' && Number.isFinite(value) ? `${value.toLocaleString('ko-KR')}원` : '—' }

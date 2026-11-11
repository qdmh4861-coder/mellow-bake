// Figma-only display examples. These are never persisted, paid, or submitted as orders.
import { getOrders } from './orderData'
import { getPortfolioOrderPreview } from './portfolioOrderPreview'
import { paymentExampleOrder } from './paymentData'

const items = [
  { id: 'bread-1', koreanName: '소금빵', description: '버터의 고소함이 가득한 멜로우베이크 시그니처 소금빵', option: '기본 소금빵', unitPrice: 3500, quantity: 2, previewPhoto: '604 416 110 110' },
  { id: 'bread-7', koreanName: '시나몬롤', description: '달콤한 시나몬 향과 부드러운 식감이 어우러진 시나몬롤', option: '기본 시나몬롤', unitPrice: 5500, quantity: 1, previewPhoto: '604 544 110 110' },
  { id: 'sandwich-5', koreanName: '불고기 샌드위치', description: '달콤짭짤한 불고기와 신선한 채소가 어우러진 샌드위치', option: '기본 불고기 샌드위치', unitPrice: 8500, quantity: 1, previewPhoto: '604 673 110 110' },
]
const shipment = {
  recipient: '베르난쥬', phone: '010-1234-5678',
  address: '(08750) 서울특별시 관악구 남부순환로 1820, 101동 203호',
  carrier: 'CJ 대한통운', trackingNumber: '1234-5678-9012',
  stage: 2, statusLabel: '배송중',
  events: [{ stage: 0, at: '10.20 14:30' }, { stage: 1, at: '10.20 18:10' }, { stage: 2, at: '10.22 09:20' }],
}
const previewOrders = [
  { id: 'design-preview-1', number: 'MB20261020-001', orderedAt: '2026.10.20', statusLabel: '결제완료', isPreview: true, items, shipment, payment: { subtotal: 21000, shippingFee: 3000, discount: 2000, total: 22000 } },
  { id: 'design-preview-2', number: 'MB20261018-002', orderedAt: '2026.10.18', statusLabel: '결제완료', isPreview: true, items: [items[1]], shipment: { ...shipment, stage: 4, statusLabel: '배송완료', events: [] }, payment: { subtotal: 5500, shippingFee: 0, discount: 0, total: 5500 } },
  { id: 'design-preview-3', number: 'MB20261015-003', orderedAt: '2026.10.15', statusLabel: '결제완료', isPreview: true, items: [items[2]], shipment: { ...shipment, stage: 4, statusLabel: '배송완료', events: [] }, payment: { subtotal: 8500, shippingFee: 0, discount: 0, total: 8500 } },
]
export function displayOrders() {
  const realOrders = getOrders()
  return realOrders.length || new URLSearchParams(window.location.search).get('preview') === '0' ? realOrders : previewOrders
}
export function displayOrder(id) { return displayOrders().find(order => order.id === id) || (new URLSearchParams(window.location.search).get('preview') !== '0' ? getPortfolioOrderPreview(id) || paymentExampleOrder(id) : null) }
export function isOrderPreview() { return displayOrders().some(order => order.isPreview) }
export function orderSummaryItems(order) {
  return order.isPreview && order.items.length > 1
    ? [{ ...order.items[0], koreanName: `${order.items[0].koreanName} 외 ${order.items.length - 1}종` }]
    : order.items
}

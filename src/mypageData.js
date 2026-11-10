// Real order records only. Design-preview orders are intentionally excluded.
export const memberOrderSteps = ['주문접수', '결제완료', '상품준비중', '배송중', '배송완료']
export function orderPhase(order) {
  const status = order.statusLabel || order.shipment?.statusLabel || ''
  if (/취소|반품|교환/.test(status)) return status.includes('취소') ? '취소' : status.includes('반품') ? '반품' : '교환'
  if (status.includes('완료') && status.includes('배송')) return '배송완료'
  if (status.includes('배송중') || status.includes('배송 중') || status.includes('배송 예정')) return '배송중'
  if (status.includes('준비')) return '상품준비중'
  if (status.includes('결제완료') || status.includes('결제 완료')) return '결제완료'
  if (status.includes('접수')) return '주문접수'
  if (order.shipment?.stage === 4) return '배송완료'
  if ([2, 3].includes(order.shipment?.stage)) return '배송중'
  if (order.shipment?.stage === 1) return '상품준비중'
  if (order.payment?.paidAt || order.payment?.status === 'paid') return '결제완료'
  return '주문접수'
}
export function recentMemberOrders(orders, now = new Date()) {
  const end = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
  const date = new Date(`${end}T00:00:00Z`)
  const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() - 3, 1))
  const last = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0)).getUTCDate()
  start.setUTCDate(Math.min(date.getUTCDate(), last))
  const from = start.toISOString().slice(0, 10)
  return orders.filter(order => {
    const day = String(order.orderedAt || '').slice(0, 10).replaceAll('.', '-').replaceAll('/', '-')
    return day >= from && day <= end
  }).sort((a, b) => String(b.orderedAt).localeCompare(String(a.orderedAt)))
}

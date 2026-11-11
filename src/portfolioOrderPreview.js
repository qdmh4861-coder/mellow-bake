// A session-only product summary, never an order/payment request or customer record.
const KEY = 'mellow-bake.order-preview.v1'

function validItems(items) {
  return Array.isArray(items) && items.length > 0 && items.every(item =>
    typeof item.id === 'string' && item.id.trim() && typeof item.koreanName === 'string' && item.koreanName.trim() &&
    Number.isSafeInteger(item.quantity) && item.quantity > 0 && Number.isFinite(item.unitPrice) && item.unitPrice >= 0 &&
    Number.isSafeInteger(item.unitPrice * item.quantity))
}

export function createPortfolioOrderPreview(rows) {
  const items = rows.map(item => ({ id: item.id, koreanName: item.koreanName, description: item.description || '', option: item.option || '기본 구성', unitPrice: item.price, quantity: item.quantity }))
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  if (!validItems(items) || !Number.isSafeInteger(subtotal)) throw new Error('상품과 수량을 확인해 주세요.')
  const now = new Date()
  const preview = {
    id: `portfolio-${crypto.randomUUID()}`, number: `DEMO-${now.getTime()}`,
    orderedAt: new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(now),
    statusLabel: '시연용 확인 · 미결제', isPreview: true, isPortfolioPreview: true, items,
    shipment: { statusLabel: '배송 요청 없음 (시연)' },
    payment: { subtotal, total: subtotal, method: '결제하지 않음 · 포트폴리오 시연' },
  }
  sessionStorage.setItem(KEY, JSON.stringify(preview))
  return preview.id
}

export function getPortfolioOrderPreview(id) {
  try {
    const preview = JSON.parse(sessionStorage.getItem(KEY) || 'null')
    if (preview?.id !== id || preview.isPortfolioPreview !== true || !validItems(preview.items)) return null
    const subtotal = preview.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    if (!Number.isSafeInteger(subtotal) || subtotal !== preview.payment?.subtotal || subtotal !== preview.payment?.total) return null
    return preview
  } catch { return null }
}

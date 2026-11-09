// Shared member-benefit integration point. No issuance/payment/member service exists.
// These arrays contain actual member records only, never the Figma example balances.
// Coupon: { id, offerId, title, benefit, issuedAt, expiresAt, usedAt, conditions }
// Point: { id, occurredAt, kind: earn|use|expire|pending, amount (signed), description,
//          expiring: boolean, remainingAmount }
const memberCoupons = []
const pointLedger = []

// Display proposals transcribed from Figma, not active issuance or checkout policy.
export const couponOffers = [
  { id: 'welcome', label: 'WELCOME COUPON', caption: '신규 회원', title: '신규 회원가입 시', benefit: '3,000원 할인!', tag: '가입 즉시 발급', conditions: '회원가입 즉시 발급 · 1만원 이상 구매 시 사용 가능', art: '414 875 210 165' },
  { id: 'delivery', label: 'FREE SHIPPING', caption: '구매 혜택', title: '30,000원 이상 구매 시', benefit: '무료배송!', tag: '배송비할인쿠폰', conditions: '다른 할인쿠폰과 중복 사용 불가', art: '410 1205 220 175' },
  { id: 'first-order', label: 'FIRST ORDER', caption: '첫 구매', title: '첫 구매 고객', benefit: '10% 할인!', tag: '첫 주문 한정', conditions: '첫 구매 시 1회 사용 가능 · 다른 쿠폰과 중복 사용 불가', art: '412 1555 220 195' },
]
export function getCoupons() { return memberCoupons }
export function getPointLedger() { return pointLedger }
export function couponStatus(coupon, now = Date.now()) {
  if (coupon.usedAt) return 'used'
  const rawExpiry = typeof coupon.expiresAt === 'string' ? coupon.expiresAt : ''
  const expiry = /^\d{4}[.-]\d{2}[.-]\d{2}$/.test(rawExpiry) ? rawExpiry.replaceAll('.', '-') : rawExpiry
  const expiresAt = /^\d{4}-\d{2}-\d{2}$/.test(expiry) ? Date.parse(`${expiry}T23:59:59.999+09:00`) : Date.parse(expiry)
  if (Number.isFinite(expiresAt) && expiresAt < now) return 'expired'
  return 'available'
}
export function benefitSummary() {
  const coupons = getCoupons()
  const ledger = getPointLedger()
  const settled = ledger.filter(row => row.kind !== 'pending' && Number.isFinite(row.amount))
  return {
    availableCoupons: coupons.filter(coupon => couponStatus(coupon) === 'available').length,
    couponCount: coupons.length,
    points: settled.reduce((sum, row) => sum + row.amount, 0),
    pendingPoints: ledger.filter(row => row.kind === 'pending' && Number.isFinite(row.amount)).reduce((sum, row) => sum + row.amount, 0),
    expiringPoints: ledger.filter(row => row.expiring === true && Number.isFinite(row.remainingAmount)).reduce((sum, row) => sum + row.remainingAmount, 0),
  }
}
export async function requestCoupon(offerId) {
  if (!couponOffers.some(offer => offer.id === offerId)) return { success: false, reason: 'unknown', message: '해당 쿠폰 정보를 찾을 수 없습니다.' }
  if (getCoupons().some(coupon => coupon.offerId === offerId)) return { success: false, reason: 'duplicate', message: '이미 발급받은 쿠폰입니다. 추가 발급 가능 여부는 쿠폰별 정책 확인이 필요합니다.' }
  return { success: false, reason: 'unavailable', message: '로그인 및 쿠폰 발급 서비스가 연동 준비 중입니다. 쿠폰은 발급되지 않았습니다.' }
}

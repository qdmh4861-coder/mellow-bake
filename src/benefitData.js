import { useSyncExternalStore } from 'react'
import { getDemoUser } from './demoAuth'
// Shared integration point. Issuance below is browser-only, never a payment/member service.
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
const COUPON_KEY = 'mellow-bake.coupons.v1'
const COUPON_EVENT = 'mellow-bake:coupons-changed'
function storedCoupons() {
  const records = JSON.parse(localStorage.getItem(COUPON_KEY) || '[]')
  if (!Array.isArray(records)) throw new Error('기존 쿠폰 데이터 형식을 확인해 주세요. 데이터는 변경하지 않았습니다.')
  return records
}
function snapshot() { try { return localStorage.getItem(COUPON_KEY) || '' } catch { return '' } }
function subscribe(listener) {
  const storage = event => { if (!event.key || event.key === COUPON_KEY) listener() }
  window.addEventListener(COUPON_EVENT, listener); window.addEventListener('storage', storage)
  return () => { window.removeEventListener(COUPON_EVENT, listener); window.removeEventListener('storage', storage) }
}
export function useCouponUpdates() { return useSyncExternalStore(subscribe, snapshot) }
export function getCoupons() {
  const user = getDemoUser()
  if (!user) return memberCoupons
  try { return [...memberCoupons, ...storedCoupons().filter(coupon => coupon?.isDemo === true && coupon.authorId === user?.id && typeof coupon.id === 'string' && coupon.offerId)] }
  catch { return memberCoupons }
}
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
  const offer = couponOffers.find(offer => offer.id === offerId)
  if (!offer) return { success: false, reason: 'unknown', message: '해당 쿠폰 정보를 찾을 수 없습니다.' }
  const user = getDemoUser()
  if (!user) return { success: false, reason: 'login', message: '데모 로그인 후 쿠폰을 받아 주세요.' }
  // Read before writing, preserving every existing record, including other demo owners.
  const records = storedCoupons()
  if (getCoupons().some(coupon => coupon.offerId === offerId)) return { success: false, reason: 'duplicate', message: '이미 발급받은 쿠폰입니다. 추가 발급 가능 여부는 쿠폰별 정책 확인이 필요합니다.' }
  const coupon = { id: crypto.randomUUID(), offerId, authorId: user.id, title: `${offer.caption} 쿠폰 (데모)`, benefit: offer.benefit, conditions: `${offer.conditions} · 시연용, 실제 결제 적용 불가`, issuedAt: new Date().toISOString(), expiresAt: null, usedAt: null, isDemo: true }
  localStorage.setItem(COUPON_KEY, JSON.stringify([...records, coupon]))
  window.dispatchEvent(new Event(COUPON_EVENT))
  return { success: true, coupon, message: '쿠폰이 발급되었습니다! 브라우저 데모에 저장되며 실제 결제에는 적용되지 않습니다.' }
}

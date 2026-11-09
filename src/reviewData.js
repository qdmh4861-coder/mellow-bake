import { useSyncExternalStore } from 'react'
import { productSlug } from './pages/productLinks'
import { getDemoUser } from './demoAuth'
// Browser-only demo records; never authenticated customer reviews or Figma samples.
// Review: { id, productId, authorId, nickname, rating: 1..5, createdAt,
//           body, photos: [url], tags: [text], isPublic: true }
const REVIEW_KEY = 'mellow-bake.reviews.v1'
const AUTHOR_KEY = 'mellow-bake.review-author.v1'
const EVENT = 'mellow-bake:reviews-changed'
function rawRecords() {
  const value = JSON.parse(localStorage.getItem(REVIEW_KEY) || '[]')
  if (!Array.isArray(value)) throw new Error('기존 리뷰 저장 형식을 확인할 수 없습니다. 기존 데이터를 보호하기 위해 저장하지 않았습니다.')
  return value
}
function records() { try { return rawRecords().filter(validReview) } catch { return [] } }
function publish(value) { localStorage.setItem(REVIEW_KEY, JSON.stringify(value)); window.dispatchEvent(new Event(EVENT)) }
function snapshot() { try { return `${localStorage.getItem(REVIEW_KEY) || ''}|${localStorage.getItem(AUTHOR_KEY) || ''}` } catch { return '' } }
function subscribe(listener) {
  const storage = event => { if (!event.key || [REVIEW_KEY, AUTHOR_KEY].includes(event.key)) listener() }
  window.addEventListener(EVENT, listener); window.addEventListener('storage', storage)
  return () => { window.removeEventListener(EVENT, listener); window.removeEventListener('storage', storage) }
}
export function useReviewUpdates() { return useSyncExternalStore(subscribe, snapshot) }

function validReview(review) {
  return review && typeof review.id === 'string' && typeof review.productId === 'string' && typeof review.authorId === 'string' && Number.isInteger(review.rating) && review.rating >= 1 && review.rating <= 5 && typeof review.body === 'string'
}
export function getCurrentReviewUser() {
  const user = getDemoUser()
  if (!user) return null
  try { return { ...user, id: localStorage.getItem(AUTHOR_KEY) || user.id } } catch { return user }
}
export function getPublicReviews() { return records().filter(review => review.isPublic === true) }
export function getMyReviews() {
  const user = getCurrentReviewUser()
  return user?.id ? records().filter(review => review.authorId === user.id) : []
}
export function getEditableReview(id) { return getMyReviews().find(review => review.id === id) || null }
export function saveDemoReview(input, id = null) {
  if (!getDemoUser()) throw new Error('데모 로그인이 필요합니다.')
  const all = rawRecords()
  const user = getCurrentReviewUser()
  const existing = id ? all.find(review => review.id === id) : null
  if (id && (!existing || !user || existing.authorId !== user.id)) throw new Error('이 브라우저에서 작성한 리뷰만 수정할 수 있습니다.')
  if (!input.productId || !Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5 || !input.title?.trim() || !input.body?.trim()) throw new Error('별점, 제목, 내용을 확인해 주세요.')
  const photos = input.photos || [], tags = input.tags || []
  if (!Array.isArray(photos) || photos.length > 5 || !photos.every(photo => typeof photo === 'string' && /^(data:image\/(png|jpeg|webp);base64,|https?:\/\/|\/)/.test(photo))) throw new Error('사진 형식 또는 개수를 확인해 주세요.')
  if (!Array.isArray(tags) || tags.length > 3 || tags.some(tag => typeof tag !== 'string')) throw new Error('태그는 최대 3개까지 선택해 주세요.')
  const authorId = user.id
  if (!localStorage.getItem(AUTHOR_KEY)) localStorage.setItem(AUTHOR_KEY, authorId)
  const now = new Date().toISOString()
  const review = { ...existing, id: existing?.id || crypto.randomUUID(), authorId, nickname: existing?.nickname || '브라우저 데모 사용자', productId: existing?.productId || input.productId, rating: input.rating, title: input.title.trim(), body: input.body.trim(), photos, tags, createdAt: existing?.createdAt || now, updatedAt: now, isPublic: true, isDemo: true }
  publish(id ? all.map(item => item.id === id ? review : item) : [...all, review])
  return { success: true, review }
}
export function deleteDemoReview(id) {
  const all = rawRecords(), user = getCurrentReviewUser(), item = all.find(review => review.id === id)
  if (!item || !user || item.authorId !== user.id) throw new Error('이 브라우저에서 작성한 리뷰만 삭제할 수 있습니다.')
  publish(all.filter(review => review.id !== id))
}
export function getProductReviews(productId) { return getPublicReviews().filter(review => productSlug(review.productId) === productSlug(productId)) }
export function reviewStats(reviews) {
  const total = reviews.length
  return { total, average: total ? reviews.reduce((sum, review) => sum + review.rating, 0) / total : null, distribution: [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(review => review.rating === rating).length
    return { rating, count, percent: total ? count / total * 100 : 0 }
  }) }
}
export function reviewsHref(productId) { return `/reviews${productId ? `?productId=${encodeURIComponent(productId)}` : ''}` }

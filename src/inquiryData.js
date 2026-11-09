// Frontend-only demo. Records stay in this browser, never sent to customer support.
import { getDemoUser } from './demoAuth'
export const inquiryTypes = ['상품 문의', '주문 / 결제 문의', '배송 문의', '취소 / 반품 / 교환 문의', '환불 문의', '쿠폰 / 포인트 문의', '회원정보 문의', '기타 문의']
const DB_NAME = 'mellow-bake.inquiries.v1'
const STORE = 'inquiries'
function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) { reject(new Error('이 브라우저에서는 문의 저장소를 사용할 수 없습니다.')); return }
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) {
        const store = request.result.createObjectStore(STORE, { keyPath: 'id' })
        store.createIndex('createdAt', 'createdAt')
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
    request.onblocked = () => reject(new Error('다른 탭이 문의 저장소를 사용 중입니다. 해당 탭을 닫고 다시 시도해 주세요.'))
  })
}
export function validateInquiry(input) {
  const errors = {}
  if (!inquiryTypes.includes(input.type)) errors.type = '문의 유형을 선택해 주세요.'
  if (!input.title?.trim()) errors.title = '문의 제목을 입력해 주세요.'
  else if (input.title.length > 50) errors.title = '문의 제목은 최대 50자입니다.'
  if (!input.body?.trim()) errors.body = '문의 내용을 입력해 주세요.'
  else if (input.body.length > 1000) errors.body = '문의 내용은 최대 1,000자입니다.'
  return errors
}
export function validateInquiryPhotos(files) {
  if (!Array.isArray(files) || files.length > 5) return '사진은 최대 5장까지 첨부할 수 있습니다.'
  if (files.some(file => !(file instanceof Blob) || !['image/jpeg', 'image/png', 'image/gif'].includes(file.type))) return 'JPG, PNG, GIF 사진만 첨부할 수 있습니다.'
  if (files.some(file => file.size > 10 * 1024 * 1024)) return '사진은 파일당 최대 10MB까지 첨부할 수 있습니다.'
  return ''
}
export async function getInquiry(id) {
  const db = await openDatabase()
  try {
    return await new Promise((resolve, reject) => {
      const request = db.transaction(STORE, 'readonly').objectStore(STORE).get(id)
      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  } finally { db.close() }
}
export async function getInquiries() {
  const db = await openDatabase()
  try {
    return await new Promise((resolve, reject) => {
      const request = db.transaction(STORE, 'readonly').objectStore(STORE).getAll()
      request.onsuccess = () => resolve(request.result.sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
      request.onerror = () => reject(request.error)
    })
  } finally { db.close() }
}
export async function saveInquiry(input, submissionId) {
  if (!getDemoUser()) throw new Error('데모 로그인이 필요합니다.')
  if (!submissionId || Object.keys(validateInquiry(input)).length) throw new Error('필수 입력값을 확인해 주세요.')
  const photosError = validateInquiryPhotos(input.photos || [])
  if (photosError) throw new Error(photosError)
  // A stable submission ID makes retries/double clicks idempotent.
  const existing = await getInquiry(submissionId)
  if (existing) return existing
  const now = new Date().toISOString()
  const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()).replaceAll('-', '')
  const record = { id: submissionId, number: `INQ-${date}-${submissionId.replaceAll('-', '').toUpperCase()}`, type: input.type, title: input.title.trim(), body: input.body.trim(), createdAt: now, status: '답변 대기', isDemo: true, photos: (input.photos || []).map(file => ({ name: file.name || '첨부 사진', type: file.type, size: file.size, blob: file })) }
  const db = await openDatabase()
  try {
    await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE, 'readwrite')
      transaction.objectStore(STORE).add(record)
      transaction.oncomplete = resolve
      transaction.onerror = () => reject(transaction.error || new Error('문의 저장에 실패했습니다.'))
      transaction.onabort = () => reject(transaction.error || new Error('문의 저장이 취소되었습니다.'))
    })
    window.dispatchEvent(new Event('mellow-bake:inquiries-changed'))
    return record
  } catch (error) {
    if (error.name === 'ConstraintError') { const saved = await getInquiry(submissionId); if (saved) return saved }
    throw error
  } finally { db.close() }
}

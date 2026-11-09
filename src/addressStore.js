import { useSyncExternalStore } from 'react'

export const ADDRESS_KEY = 'mellow-bake.addresses.v1'
const eventName = 'mellow-bake:addresses-changed'
// Isolated frontend demo, not authenticated member information.
const demoAddresses = [
  { id: 'demo-home', name: '집', recipient: '예시 수령인', postcode: '08820', address: '서울특별시 관악구 신림로 123', detail: '101동 1004호', phone: '010-1234-5678', isDefault: true, isDemo: true },
  { id: 'demo-office', name: '회사', recipient: '예시 수령인', postcode: '06236', address: '서울특별시 강남구 테헤란로 456', detail: '8층', phone: '010-9876-5432', isDefault: false, isDemo: true },
  { id: 'demo-family', name: '부모님 댁', recipient: '예시 수령인', postcode: '13920', address: '경기도 안양시 동안구 평촌로 789', detail: '202동 204호', phone: '010-5555-1122', isDefault: false, isDemo: true },
]
function readAll() {
  const value = JSON.parse(localStorage.getItem(ADDRESS_KEY) || '[]')
  if (!Array.isArray(value)) throw new Error('기존 배송지 저장 형식을 확인할 수 없어 변경하지 않았습니다.')
  return value
}
function isAddress(item) { return item && typeof item.id === 'string' && typeof item.name === 'string' && typeof item.address === 'string' }
function publish(items) { localStorage.setItem(ADDRESS_KEY, JSON.stringify(items)); window.dispatchEvent(new Event(eventName)) }
function snapshot() { try { return localStorage.getItem(ADDRESS_KEY) || '' } catch { return '' } }
function subscribe(listener) {
  const storage = event => { if (!event.key || event.key === ADDRESS_KEY) listener() }
  window.addEventListener(eventName, listener); window.addEventListener('storage', storage)
  return () => { window.removeEventListener(eventName, listener); window.removeEventListener('storage', storage) }
}
export function initializeDemoAddresses() {
  // Presence of the key, including an intentional empty array, prevents reseeding.
  if (localStorage.getItem(ADDRESS_KEY) === null) publish(demoAddresses)
}
export function getAddresses() {
  try { return readAll().filter(isAddress).sort((a, b) => Number(Boolean(b.isDefault)) - Number(Boolean(a.isDefault))) } catch { return [] }
}
export function useAddresses() { useSyncExternalStore(subscribe, snapshot); return getAddresses() }
export function getDefaultAddress() { return getAddresses().find(item => item.isDefault) || null }
export function validateAddress(values) {
  const errors = {}
  for (const [key, label] of [['name', '배송지 이름'], ['recipient', '받는 사람'], ['address', '기본 주소']]) if (!values[key]?.trim()) errors[key] = `${label}을(를) 입력해 주세요.`
  if (!/^\d{5}$/.test(values.postcode || '')) errors.postcode = '우편번호 5자리를 입력해 주세요.'
  if (!/^0\d{8,10}$/.test((values.phone || '').replaceAll('-', ''))) errors.phone = '연락처를 올바르게 입력해 주세요. (숫자 9~11자리)'
  return errors
}
export function saveAddress(values, id = null) {
  if (Object.keys(validateAddress(values)).length) throw new Error('입력 내용을 확인해 주세요.')
  const all = readAll(), valid = all.filter(isAddress), existing = id ? valid.find(item => item.id === id) : null
  if (id && !existing) throw new Error('수정할 배송지를 찾을 수 없습니다.')
  if (existing?.isDefault && !values.isDefault) throw new Error('다른 배송지를 기본으로 지정한 뒤 변경해 주세요.')
  const makeDefault = Boolean(values.isDefault) || !valid.length || !valid.some(item => item.isDefault)
  const item = { ...existing, id: id || crypto.randomUUID(), name: values.name.trim(), recipient: values.recipient.trim(), postcode: values.postcode, address: values.address.trim(), detail: values.detail?.trim() || '', phone: values.phone.trim(), isDefault: makeDefault, isDemo: true }
  const remaining = makeDefault ? all.map(row => isAddress(row) ? { ...row, isDefault: false } : row) : all
  publish(id ? remaining.map(row => row?.id === id ? item : row) : [...remaining, item])
  return item
}
export function setDefaultAddress(id) {
  const all = readAll()
  if (!all.some(item => isAddress(item) && item.id === id)) throw new Error('배송지를 찾을 수 없습니다.')
  publish(all.map(item => isAddress(item) ? { ...item, isDefault: item.id === id } : item))
}
export function deleteAddress(id, replacementId = null) {
  const all = readAll(), item = all.find(row => isAddress(row) && row.id === id)
  if (!item) throw new Error('삭제할 배송지를 찾을 수 없습니다.')
  const remaining = all.filter(row => row?.id !== id), valid = remaining.filter(isAddress)
  if (item.isDefault && valid.length && !valid.some(row => row.id === replacementId)) throw new Error('남은 배송지 중 새 기본 배송지를 선택해 주세요.')
  publish(item.isDefault ? remaining.map(row => isAddress(row) ? { ...row, isDefault: row.id === replacementId } : row) : remaining)
}

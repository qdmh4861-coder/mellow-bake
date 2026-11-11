import { useSyncExternalStore } from 'react'

export const CART_KEY = 'mellow-bake.cart.v1'
const listeners = new Set()

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
    if (!Array.isArray(saved)) return []
    const ids = new Set()
    return saved.filter(item => {
      if (!item || typeof item.id !== 'string' || ids.has(item.id) || !Number.isSafeInteger(item.quantity) || item.quantity < 1 || typeof item.price !== 'number' || !Number.isFinite(item.price) || item.price < 0 || typeof item.koreanName !== 'string') return false
      ids.add(item.id)
      return true
    }).map(item => ({ ...item, selected: item.selected !== false }))
  } catch { return [] }
}

let snapshot = readCart()
function publish(items) {
  // Persist first: a blocked/full browser store must not report a successful save.
  localStorage.setItem(CART_KEY, JSON.stringify(items))
  snapshot = items
  listeners.forEach(listener => listener())
}
function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
window.addEventListener('storage', event => {
  if (event.key === CART_KEY || event.key === null) {
    snapshot = readCart()
    listeners.forEach(listener => listener())
  }
})
export function useCart() { return useSyncExternalStore(subscribe, () => snapshot) }

// Apply the requested starting composition once; clearing the cart stays permanent.
export function initializeCartOnce(initialItems) {
  const initializedKey = 'mellow-bake.cart.initial-products.v1'
  if (localStorage.getItem(initializedKey)) return
  if (readCart().length === 0) {
    publish(initialItems.map(({ product, quantity }) => ({
      id: product.id, koreanName: product.koreanName, name: product.name,
      description: product.description || '', price: product.price,
      quantity, selected: true,
    })))
  }
  localStorage.setItem(initializedKey, 'true')
}

export function addToCart(product, quantity, price = product.price) {
  if (!Number.isSafeInteger(quantity) || quantity < 1 || !Number.isFinite(price) || price < 0) throw new Error('Invalid cart item')
  const current = readCart()
  const existing = current.find(item => item.id === product.id)
  if (existing && !Number.isSafeInteger(existing.quantity + quantity)) throw new Error('Invalid quantity')
  const item = {
    id: product.id, koreanName: product.koreanName || product.korean,
    name: product.name, description: product.description || '', price,
    quantity: quantity + (existing?.quantity || 0), selected: true,
  }
  publish(existing ? current.map(row => row.id === item.id ? item : row) : [...current, item])
}

export function cartAddMessage(product, quantity, price = product.price) {
  try {
    addToCart(product, quantity, price)
    return `${product.koreanName || product.korean} ${quantity}개를 장바구니에 담았습니다.`
  } catch {
    return '장바구니를 저장하지 못했습니다. 브라우저 저장 공간 설정을 확인해 주세요.'
  }
}

export function buyNow(product, quantity, price = product.price) {
  try {
    addToCart(product, quantity, price)
    window.location.assign('/cart')
    return ''
  } catch {
    return '장바구니를 저장하지 못했습니다. 브라우저 저장 공간 설정을 확인해 주세요.'
  }
}

export function setCartQuantity(id, quantity) {
  if (!Number.isSafeInteger(quantity) || quantity < 1) return
  publish(readCart().map(item => item.id === id ? { ...item, quantity } : item))
}
export function selectCartItem(id, selected) {
  publish(readCart().map(item => item.id === id ? { ...item, selected } : item))
}
export function selectAllCartItems(selected) { publish(readCart().map(item => ({ ...item, selected }))) }
export function removeCartItems(ids) { publish(readCart().filter(item => !ids.includes(item.id))) }
export function clearCart() { publish([]) }

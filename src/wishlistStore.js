import { useSyncExternalStore } from 'react'

import { getDemoUser } from './demoAuth'
export const WISHLIST_KEY = 'mellow-bake.wishlist.v1'
const listeners = new Set()
const wishlistChanged = 'mellow-bake:wishlist-changed'
function readWishlist() {
  try {
    const saved = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]')
    if (!Array.isArray(saved)) return []
    const ids = new Set()
    // Keep legacy ID-only entries and partial product snapshots. The wishlist page
    // resolves their current product information without rewriting browser data.
    return saved.flatMap(item => {
      const id = typeof item === 'string' ? item : item?.id
      if (typeof id !== 'string' || !id.trim() || ids.has(id)) return []
      ids.add(id)
      return [typeof item === 'string' ? { id } : { ...item, id }]
    })
  } catch { return [] }
}
let snapshot = readWishlist()
function publish(items) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event(wishlistChanged))
}
function subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener) }
function refreshWishlist() {
  snapshot = readWishlist()
  listeners.forEach(listener => listener())
}
window.addEventListener(wishlistChanged, refreshWishlist)
window.addEventListener('storage', event => {
  if (event.key === WISHLIST_KEY || event.key === null) {
    refreshWishlist()
  }
})
export function useWishlist() { return useSyncExternalStore(subscribe, () => snapshot) }
export function toggleWishlist(product) {
  if (!getDemoUser()) { window.location.assign('/login?required=1'); return }
  const items = readWishlist()
  if (items.some(item => item.id === product.id)) { publish(items.filter(item => item.id !== product.id)); return }
  const price = typeof product.price === 'number' ? product.price : Number(String(product.price).replace(/[^\d.]/g, ''))
  if (!product.id || !Number.isFinite(price) || price < 0 || !(product.koreanName || product.korean)) throw new Error('Invalid wishlist product')
  publish([...items, { id: product.id, name: product.name, koreanName: product.koreanName || product.korean, description: product.description || '', price }])
}
export function removeWishlistItems(ids) {
  if (!getDemoUser()) { window.location.assign('/login?required=1'); return }
  publish(readWishlist().filter(item => !ids.includes(item.id)))
}
export function useFavorites() {
  const items = useWishlist()
  return {
    favorites: items.map(item => item.id),
    toggleFavorite(product) {
      try { toggleWishlist(product) }
      catch { window.alert('찜 목록을 저장하지 못했습니다. 브라우저 저장 공간 설정을 확인해 주세요.') }
    },
  }
}

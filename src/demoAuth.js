import { useEffect, useSyncExternalStore } from 'react'

// UI-only demo: bundled verifier and browser session can be inspected/forged.
// Never use this as server authorization or for real customer accounts.
export const DEMO_EMAIL = 'demo@mellowbake.test'
const KEY = 'mellow-bake.demo-session.v1'
const EVENT = 'mellow-bake:auth-changed'
const TTL = 12 * 60 * 60 * 1000
function snapshot() { try { return sessionStorage.getItem(KEY) || '' } catch { return '' } }
function profileSnapshot() { try { return localStorage.getItem('mellow-bake.profile.v1:mellow-bake-demo') || '' } catch { return '' } }
function subscribe(listener) {
  window.addEventListener(EVENT, listener)
  window.addEventListener('storage', listener)
  window.addEventListener('pageshow', listener)
  return () => { window.removeEventListener(EVENT, listener); window.removeEventListener('storage', listener); window.removeEventListener('pageshow', listener) }
}
export function getDemoUser() {
  try {
    const session = JSON.parse(snapshot())
    if (!(session?.email === DEMO_EMAIL && session.isDemo === true && session.expiresAt > Date.now())) return null
    let nickname = '데모 회원'
    try { const profile = JSON.parse(localStorage.getItem('mellow-bake.profile.v1:mellow-bake-demo') || 'null'); if (typeof profile?.name === 'string' && profile.name.trim()) nickname = profile.name.trim() } catch { /* A profile error must not invalidate an existing login. */ }
    return { id: 'mellow-bake-demo', email: DEMO_EMAIL, nickname, isDemo: true }
  } catch { return null }
}
export function useDemoUser() {
  const raw = useSyncExternalStore(subscribe, snapshot)
  useSyncExternalStore(subscribe, profileSnapshot)
  useEffect(() => {
    let expiresAt
    try { expiresAt = JSON.parse(raw)?.expiresAt } catch { return }
    if (!Number.isFinite(expiresAt)) return
    const timer = setTimeout(() => { sessionStorage.removeItem(KEY); window.dispatchEvent(new Event(EVENT)) }, Math.max(0, expiresAt - Date.now()))
    return () => clearTimeout(timer)
  }, [raw])
  return getDemoUser()
}
export async function loginDemo(email, password) {
  const salt = import.meta.env.VITE_DEMO_AUTH_SALT
  const expected = import.meta.env.VITE_DEMO_AUTH_VERIFIER
  if (!salt || !/^[a-f0-9]{64}$/.test(expected || '')) throw new Error('데모 비밀번호 설정이 필요합니다. 개발 터미널에서 node scripts/setup-demo-auth.mjs를 실행해 주세요.')
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations: 600000, hash: 'SHA-256' }, key, 256)
  const actual = [...new Uint8Array(bits)].map(value => value.toString(16).padStart(2, '0')).join('')
  let difference = 0
  for (let i = 0; i < expected.length; i++) difference |= actual.charCodeAt(i) ^ expected.charCodeAt(i)
  if (email.trim().toLowerCase() !== DEMO_EMAIL || difference) throw new Error('아이디 또는 비밀번호를 확인해 주세요.')
  sessionStorage.setItem(KEY, JSON.stringify({ email: DEMO_EMAIL, isDemo: true, expiresAt: Date.now() + TTL }))
  window.dispatchEvent(new Event(EVENT))
}
export function logoutDemo(destination = '/login?loggedOut=1') {
  sessionStorage.removeItem(KEY)
  // Home navigation mounts with a cleared session; avoid the protected-page guard
  // replacing that destination with /login during this document's teardown.
  if (destination !== '/') window.dispatchEvent(new Event(EVENT))
  window.location.assign(destination)
}
export function requiresDemoLogin(path) {
  return path === '/mypage' || (path.startsWith('/mypage/') && !['/mypage/faq', '/mypage/notices'].some(publicPath => path === publicPath || path.startsWith(`${publicPath}/`))) || path === '/wishlist' || path === '/reviews/write'
}

import { getDemoUser } from './demoAuth'
import { ADDRESS_KEY, getDefaultAddress, saveAddress } from './addressStore'

// Browser-only, account-scoped profile. Passwords and authentication settings never belong here.
export const profileKey = user => `mellow-bake.profile.v1:${user.id}`
export function loadMemberProfile() {
  const user = getDemoUser()
  if (!user) return null
  const raw = localStorage.getItem(profileKey(user))
  const profile = raw ? JSON.parse(raw) : {}
  if (!profile || typeof profile !== 'object' || Array.isArray(profile)) throw new Error('회원정보 저장 형식을 확인할 수 없습니다.')
  const address = getDefaultAddress()
  // Seed examples are never silently promoted to personal member information.
  const actualAddress = address && !(address.id.startsWith('demo-') && address.recipient === '예시 수령인') ? address : null
  return { ...profile, email: user.email, accountId: user.email, addressId: address?.id || null, postcode: actualAddress?.postcode || '', address: actualAddress?.address || '', detail: actualAddress?.detail || '' }
}
export function saveMemberProfile(values) {
  const user = getDemoUser()
  if (!user) throw new Error('로그인이 필요합니다. 다시 로그인해 주세요.')
  const key = profileKey(user), oldProfile = localStorage.getItem(key), oldAddresses = localStorage.getItem(ADDRESS_KEY)
  const address = getDefaultAddress()
  if ((values.addressId || null) !== (address?.id || null)) throw new Error('기본 배송지가 다른 화면에서 변경되었습니다. 새로고침한 뒤 다시 수정해 주세요.')
  const record = { name: values.name.trim(), birth: values.birth, gender: values.gender, phone: values.phone.trim(), email: user.email, isDemo: true }
  try {
    // Keep the current default ID and all other addresses; never touch past orders.
    const updatedAddress = saveAddress({ name: address?.name || '기본 배송지', recipient: record.name, phone: record.phone, postcode: values.postcode, address: values.address, detail: values.detail, isDefault: true }, address?.id || null)
    record.addressId = updatedAddress.id
    localStorage.setItem(key, JSON.stringify(record))
  } catch (error) {
    try {
      if (oldAddresses === null) localStorage.removeItem(ADDRESS_KEY); else localStorage.setItem(ADDRESS_KEY, oldAddresses)
      if (oldProfile === null) localStorage.removeItem(key); else localStorage.setItem(key, oldProfile)
      window.dispatchEvent(new Event('mellow-bake:addresses-changed'))
    } catch { throw new Error('저장 공간 또는 접근 권한을 확인해 주세요. 회원정보와 기본 배송지의 저장 상태를 다시 확인해 주세요.') }
    throw error
  }
  window.dispatchEvent(new Event('mellow-bake:profile-changed'))
  window.dispatchEvent(new Event('mellow-bake:auth-changed'))
  return record
}

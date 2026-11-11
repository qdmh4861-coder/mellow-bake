// Keep logical application paths separate from the GitHub Pages mount path.
// Hash routes request only index.html, so Pages needs no server-side rewrite.
export const appBase = import.meta.env?.BASE_URL || '/mellow-bake/'
const basePath = `/${appBase.split('/').filter(Boolean).join('/')}`.replace(/\/$/, '')

function stripBase(path) {
  while (basePath && basePath !== '/' && (path === basePath || path.startsWith(`${basePath}/`))) path = path.slice(basePath.length) || '/'
  return path
}

export function resolveAppUrl(value) {
  const current = getAppUrl()
  let url = new URL(String(value), current)
  if (url.origin !== window.location.origin) return null
  if (url.hash.startsWith('#/')) url = new URL(url.hash.slice(1), window.location.origin)
  if (url.origin !== window.location.origin) return null
  url.pathname = stripBase(url.pathname)
  return url
}

export function getAppUrl() {
  const physical = window.location
  const url = physical.hash.startsWith('#/')
    ? new URL(physical.hash.slice(1), physical.origin)
    : new URL(stripBase(physical.pathname) + physical.search + physical.hash, physical.origin)
  if (url.origin !== physical.origin) return new URL('/', physical.origin)
  url.pathname = stripBase(url.pathname)
  return url
}

export function assetHref(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return value
  return appBase + stripBase(value).replace(/^\/+/, '')
}

export function appHref(value) {
  if (value == null || value === '') return value
  const raw = String(value)
  // Preserve external services, downloads, data/blob images and telephone links.
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(raw) && !raw.startsWith(window.location.origin + '/')) return value
  const url = resolveAppUrl(raw)
  if (!url) return value
  if (/^\/(?:images|assets)\//.test(url.pathname)) return assetHref(url.pathname + url.search + url.hash)
  return `${appBase}#${url.pathname}${url.search}${url.hash}`
}

export const appLocation = {
  get pathname() { return getAppUrl().pathname },
  get search() { return getAppUrl().search },
  get hash() { return getAppUrl().hash },
  get origin() { return window.location.origin },
  get href() { return getAppUrl().href },
  set href(value) { window.location.assign(appHref(value)) },
  assign(value) { window.location.assign(appHref(value)) },
  replace(value) { window.location.replace(appHref(value)) },
}

export const appHistory = {
  replaceState(data, unused, url) { window.history.replaceState(data, unused, url == null ? url : appHref(url)) },
  pushState(data, unused, url) { window.history.pushState(data, unused, url == null ? url : appHref(url)) },
}

export function initializeAppRouting() {
  const canonical = appHref(getAppUrl().href)
  if (window.location.pathname + window.location.search + window.location.hash !== canonical) window.history.replaceState(window.history.state, '', canonical)
}

export function subscribeToAppRoute(callback) {
  window.addEventListener('hashchange', callback)
  window.addEventListener('popstate', callback)
  return () => {
    window.removeEventListener('hashchange', callback)
    window.removeEventListener('popstate', callback)
  }
}

export const appRouteSnapshot = () => appLocation.pathname + appLocation.search

export function scrollToAppAnchor() {
  const anchor = appLocation.hash.slice(1)
  if (!anchor) return
  let id
  try { id = decodeURIComponent(anchor) } catch { return }
  requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView())
}

// A second click on the current tab does not emit hashchange. Preserve the
// original anchor's ability to scroll back to the same section in that case.
export function repeatAppAnchor(event) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  const link = event.target.closest?.('a[href]')
  if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return
  if (link.href === window.location.href && appLocation.hash) scrollToAppAnchor()
}

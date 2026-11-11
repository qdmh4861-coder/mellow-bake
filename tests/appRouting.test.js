import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { appHref, assetHref, appLocation, appHistory, initializeAppRouting, resolveAppUrl } from '../src/appRouting.js'
import githubPagesFallback from '../scripts/githubPagesFallback.js'

const origin = 'https://qdmh4861-coder.github.io'
function browser(path) {
  const calls = []
  const url = new URL(path, origin)
  globalThis.window = {
    location: { origin, pathname: url.pathname, search: url.search, hash: url.hash,
      assign: url => calls.push(['assign', url]), replace: url => calls.push(['replace', url]) },
    history: { state: null, replaceState: (...args) => calls.push(['replaceState', ...args]), pushState: (...args) => calls.push(['pushState', ...args]) },
  }
  return calls
}

test('all internal URL forms produce one base and one route fragment', () => {
  browser('/mellow-bake/#/cart')
  for (const path of ['/login', '/mellow-bake/login', '/mellow-bake/mellow-bake/login', '/mellow-bake/#/login', '/mellow-bake/#/mellow-bake/login', `${origin}/mellow-bake/#/login`]) assert.equal(appHref(path), '/mellow-bake/#/login')
  assert.equal(appHref('/'), '/mellow-bake/#/')
  assert.equal(appHref('/reviews?productId=cake-2#reviews'), '/mellow-bake/#/reviews?productId=cake-2#reviews')
  assert.equal(appHref('/login?next=%2Fmypage%2Forders%3Fx%3D1'), '/mellow-bake/#/login?next=%2Fmypage%2Forders%3Fx%3D1')
})

test('logical pathname, query and in-page anchors are independent of Pages base', () => {
  browser('/mellow-bake/#/menu/cake-2?option=home#product-reviews')
  assert.equal(appLocation.pathname, '/menu/cake-2')
  assert.equal(appLocation.search, '?option=home')
  assert.equal(appLocation.hash, '#product-reviews')
  assert.equal(appHref('#ingredients'), '/mellow-bake/#/menu/cake-2?option=home#ingredients')
  assert.equal(appHref('?option=menu'), '/mellow-bake/#/menu/cake-2?option=menu')
  assert.equal(appLocation.href, `${origin}/menu/cake-2?option=home#product-reviews`)
})

test('login return URLs accept logical, old prefixed and new hash routes only on this origin', () => {
  browser('/mellow-bake/#/login')
  for (const input of ['/mypage/profile?edit=1', '/mellow-bake/mypage/profile?edit=1', '/mellow-bake/#/mypage/profile?edit=1']) {
    const url = resolveAppUrl(input)
    assert.equal(url.pathname + url.search, '/mypage/profile?edit=1')
  }
  assert.equal(resolveAppUrl('https://example.test/mypage'), null)
  assert.equal(resolveAppUrl('/mellow-bake/#//example.test/mypage'), null)
})

test('images, SVG fragments, external URLs, data and blob URLs remain assets', () => {
  browser('/mellow-bake/#/')
  for (const path of ['/images/바스크.png', '/mellow-bake/images/바스크.png', '/mellow-bake/mellow-bake/images/바스크.png']) assert.equal(assetHref(path), '/mellow-bake/images/바스크.png')
  for (const value of ['#clip', 'data:image/png;base64,abc', 'blob:https://example.test/image', 'https://example.test/photo.png', '//example.test/image', undefined]) assert.equal(assetHref(value), value)
  for (const value of ['https://example.test/shop', 'mailto:shop@example.test', 'tel:01012345678', '//example.test/store', 'data:image/png;base64,abc']) assert.equal(appHref(value), value)
  assert.equal(assetHref('/mellow-bake/assets/sheet.png'), '/mellow-bake/assets/sheet.png')
})

test('assign, replace, href setter and history query updates use the same URL policy', () => {
  const calls = browser('/mellow-bake/#/reviews')
  appLocation.assign('/cart'); appLocation.replace('/login'); appLocation.href = '/signup'
  appHistory.replaceState(null, '', new URL(`${origin}/reviews?productId=cake-2`))
  appHistory.pushState(null, '', '/mypage/inquiries?inquiryId=a%26b')
  assert.deepEqual(calls, [ ['assign', '/mellow-bake/#/cart'], ['replace', '/mellow-bake/#/login'], ['assign', '/mellow-bake/#/signup'], ['replaceState', null, '', '/mellow-bake/#/reviews?productId=cake-2'], ['pushState', null, '', '/mellow-bake/#/mypage/inquiries?inquiryId=a%26b'] ])
})

test('old clean URLs canonicalize without losing queries or section anchors', () => {
  const calls = browser('/mellow-bake/menu/cake-2?option=home#product-reviews')
  initializeAppRouting()
  assert.equal(calls[0][3], '/mellow-bake/#/menu/cake-2?option=home#product-reviews')
  const existing = browser('/mellow-bake/#/cart')
  initializeAppRouting(); assert.equal(existing.length, 0)
})

test('generated 404 recovers shared clean URLs and respects configured base', () => {
  for (const base of ['/mellow-bake/', '/']) {
    const plugin = githubPagesFallback(); plugin.configResolved({base})
    let asset; plugin.generateBundle.call({emitFile(value) {asset=value}})
    assert.equal(asset.fileName, '404.html')
    const script=asset.source.match(/<script>([\s\S]*?)<\/script>/)[1]
    let result
    vm.runInNewContext(script, { location: { pathname: base+'menu/cake-2', search:'?option=home', hash:'#reviews', replace(value) {result=value} } })
    assert.equal(result, base+'#/menu/cake-2?option=home#reviews')
  }
})

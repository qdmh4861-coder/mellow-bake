import { productSlug } from './pages/productLinks'

// Wishlist-only, text-free standalone illustrations. Never fall back to a card
// screenshot or crop a reference sheet. Add original files here when supplied:
// public/images/wishlist-products/bread-2.png (Mont Blanc), bread-1.png, etc.
const supplied = Object.fromEntries(['bread-1', 'bread-2', 'bread-3', 'bread-4', 'bread-5', 'bread-6', 'bread-7', 'bread-8', 'sandwich-1', 'sandwich-2', 'sandwich-3', 'sandwich-4'].map(id => [
  `/images/wishlist-products/${id}.png`, `/images/wishlist-products/${id}.png`,
]))
const originals = import.meta.glob('./assets/{best-menu,new-menu,new-arrivals}/*.png', { eager: true, query: '?url', import: 'default' })
// Only visually verified files without lettering. Other standalone files also
// contain English labels (Strawberry, Blueberry, Tiramisu, etc.), so exclude them.
const textFreeIds = new Set(['chocolate-cake', 'matcha-cake', 'strawberry-roll-cake', 'fruit-tart'])
const textFreeOriginals = Object.fromEntries(Object.entries(originals).filter(([path]) => textFreeIds.has(path.split('/').at(-1).replace(/\.png$/, ''))))
const existing = {
  'chocolate-roll-cake': '/images/member-product-chocolate-roll.png',
  'strawberry-tart': '/images/member-product-strawberry-tart.png',
  'payment-example-vanilla-latte': '/images/member-product-vanilla-latte.png',
}
export function wishlistIllustrationSource(item) {
  const id = item.catalogId || item.id
  const match = entries => Object.entries(entries).find(([path]) => productSlug(path.split('/').at(-1).replace(/\.(png|webp)$/, '')) === productSlug(id))?.[1]
  return match(supplied) || existing[id] || match(textFreeOriginals) || null
}


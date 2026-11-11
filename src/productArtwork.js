import bread from './pages/breadListArt.json'
import cake from './pages/cakeListArt.json'
import sandwich from './pages/sandwichListArt.json'
import drink from './pages/drinkListArt.json'
import { seasonalProducts, newMenuReference } from './newMenuCatalog'

export const protectedProductIds = new Set(['bread-1', 'bread-7', 'sandwich-5'])
const categoryArt = { ...bread, ...cake, ...sandwich, ...drink }
const files = import.meta.glob('./assets/{best-menu,new-menu,new-arrivals}/*.png', { eager: true, query: '?url', import: 'default' })
const details = import.meta.glob('/public/images/product-details/**/[1-5].{png,jpg,jpeg,webp}', { eager: true, query: '?url', import: 'default' })
// These are the project's existing route aliases, not interchangeable products:
// price variants with their own IDs keep their own matching source file.
const aliases = { 'salt-bread': 'bread-1', 'mont-blanc': 'bread-2', 'cinnamon-roll': 'bread-7', 'bulgogi-sandwich': 'sandwich-5', 'strawberry-cream-cake': 'cake-1', 'tiramisu-cake': 'cake-5' }
const basqueGallery = ['115 0 650 600', '10 153 90 90', '10 255 90 90', '10 357 90 90', '10 459 90 90'].map(box => ({
  kind: 'region', src: '/images/Frame 930.png', width: 1216, height: 693,
  box, clip: box.split(' ').map(Number), source: 'basque-supplied-illustration',
}))
function extra(id, slot) {
  const entry = Object.entries(details).find(([path]) => path.match(/\/([^/]+)\/([1-5])\.[^.]+$/)?.slice(1).join('/') === `${id}/${slot}`)
  return entry ? { kind: 'image', src: entry[1], source: 'individual-detail' } : null
}
export function artworkFor(product, slot = 1) {
  const id = product.catalogId || product.id
  const individual = extra(id, slot)
  if (individual) return individual
  if (id === 'cake-2') return basqueGallery[slot - 1] || null
  if (slot !== 1) return null
  const art = categoryArt[id] || categoryArt[aliases[id]]
  if (art) return { ...art, kind: 'region', source: 'category-illustration' }
  const file = Object.entries(files).find(([path]) => path.split('/').at(-1) === `${id}.png`)
  if (file) return { kind: 'image', src: file[1], source: 'home-original' }
  const seasonal = seasonalProducts.find(item => item.id === id)
  if (seasonal?.imageSrc) return { kind: 'image', src: seasonal.imageSrc, source: 'seasonal-original' }
  if (seasonal) {
    const index = seasonalProducts.findIndex(item => item.id === id)
    const clip = [[146, 484, 814, 1146][index % 4], [388, 586, 788][Math.floor(index / 4)], index % 4 === 0 ? 294 : 292, [106, 104, 100][Math.floor(index / 4)]]
    return { kind: 'region', src: newMenuReference, width: 1584, height: 993, box: clip.join(' '), clip, source: 'seasonal-reference-illustration', incompleteOriginal: true }
  }
  return null
}

export function galleryFor(product) {
  return Array.from({ length: 5 }, (_, index) => ({ slot: index + 1, art: artworkFor(product, index + 1) }))
}

import sheets from './productIllustrationSheets.json'

// Detail-only artwork. Match both product ID and purpose; never borrow another
// product's file or turn a menu-card image into a process/ingredient image.
const publicFiles = import.meta.glob('/public/images/product-details/**/*.{png,jpg,jpeg,webp,avif,PNG,JPG,JPEG,WEBP,AVIF}')
const assetFiles = import.meta.glob('/src/assets/product-details/**/*.{png,jpg,jpeg,webp,avif,PNG,JPG,JPEG,WEBP,AVIF}', { eager: true, query: '?url', import: 'default' })
const files = { ...assetFiles, ...Object.fromEntries(Object.keys(publicFiles).map(path => [path, path.replace(/^\/public/, '')])) }

export function detailImageSource(productId, purpose) {
  const matches = Object.entries(files).filter(([path]) => {
    const parts = path.split('/')
    return parts.at(-2) === productId && parts.at(-1).replace(/\.[^.]+$/, '') === purpose
  })
  // Public assets take precedence if both supported folders contain a file.
  matches.sort(([a], [b]) => a.localeCompare(b))
  return matches[0]?.[1] || null
}

const sheetPurposes = ['signature','feature','ingredients','process-1','process-2','process-3','enjoy-1','enjoy-2','enjoy-3','charm-1','charm-2','charm-3','materials','storage-1','storage-2','storage-3']
export function detailImageArtwork(productId, purpose) {
  const individual = detailImageSource(productId, purpose)
  if (individual) return { kind: 'image', src: individual }
  const sheet = sheets[productId]
  const index = sheetPurposes.indexOf(purpose)
  if (!sheet || index < 0) return null
  const w = sheet.width / 4, h = sheet.height / 4
  const clip = [(index % 4) * w, Math.floor(index / 4) * h, w, h]
  return { kind: 'region', src: sheet.src, width: sheet.width, height: sheet.height, box: clip.join(' '), clip, generated: true }
}

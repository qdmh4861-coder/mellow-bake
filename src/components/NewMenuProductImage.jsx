import { useId, useState } from 'react'
import { newMenuReference } from '../newMenuCatalog'

export default function NewMenuProductImage({ product, decorative = false, photoBox = product.photoBox, coverBadge = true }) {
  const [failed, setFailed] = useState(null)
  const clip = useId()
  const [x, y, width, height] = photoBox.split(' ').map(Number)
  return product.imageSrc && failed !== product.imageSrc
    ? <img src={product.imageSrc} alt={decorative ? '' : product.koreanName} onError={() => setFailed(product.imageSrc)} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
    : <svg viewBox={photoBox} role={decorative ? undefined : 'img'} aria-hidden={decorative || undefined} aria-label={decorative ? undefined : product.koreanName} style={{ display: 'block', width: '100%', height: 'auto', maxHeight: '100%', aspectRatio: `${width} / ${height}`, overflow: 'hidden' }}><defs><clipPath id={clip}><rect x={x} y={y} width={width} height={height} /></clipPath></defs><g clipPath={`url(#${clip})`}><image href={newMenuReference} width="1584" height="993" />{coverBadge && <rect x={x} y={y} width="65" height="29" rx="10" fill="#ffdbd3" />}</g></svg>
}

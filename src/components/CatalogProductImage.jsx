import { assetHref } from '../appRouting'
import { useId, useState } from 'react'
import { artworkFor } from '../productArtwork'

export default function CatalogProductImage({ product, slot = 1, artwork }) {
  const clipId = useId()
  const [failed, setFailed] = useState(null)
  const art = artwork || artworkFor(product, slot)
  const name = product.koreanName || product.korean || product.name
  const style = { display: 'block', width: '100%', height: '100%', objectFit: 'contain', minWidth: 0, minHeight: 0 }
  if (!art || failed === art.src) return <span className="catalog-image-awaiting" role="img" aria-label={`${name} ${slot === 1 ? '상품' : `추가 ${slot}`} 이미지 준비 중`} style={{ display: 'grid', placeContent: 'center', width: '100%', height: '100%', padding: 2, fontSize: slot === 1 ? 12 : 10, lineHeight: 1.3, color: '#986b61', textAlign: 'center', boxSizing: 'border-box' }}>{slot === 1 ? '상품 이미지' : `추가 ${slot}`}<small>준비 중</small></span>
  if (art.kind === 'image') return <img src={assetHref(art.src)} alt={`${name} 이미지 ${slot}`} style={style} onError={() => setFailed(art.src)} />
  const [x, y, width, height] = art.clip
  return <svg viewBox={art.box} preserveAspectRatio="xMidYMid meet" role="img" aria-label={`${name} 이미지 ${slot}`} style={style} data-catalog-art={product.catalogId || product.id}><defs><clipPath id={clipId}><rect x={x} y={y} width={width} height={height} /></clipPath></defs><g clipPath={`url(#${clipId})`}><image href={assetHref(art.src)} width={art.width} height={art.height} />{art.coverBadge && <rect x={x} y={y} width="65" height="29" rx="10" fill="#ffdbd3" />}</g></svg>
}

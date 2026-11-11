import { assetHref } from '../appRouting'
import { useState } from 'react'
import { wishlistIllustrationSource } from '../wishlistIllustrations'
import CatalogProductImage from './CatalogProductImage'
import { artworkFor, protectedProductIds } from '../productArtwork'

export default function WishlistProductImage({ item }) {
  const source = wishlistIllustrationSource(item)
  const [failed, setFailed] = useState(null)
  const decorate = /^bread-[1-8]$/.test(item.catalogId || item.id) && source && failed !== source
  if (!protectedProductIds.has(item.catalogId || item.id) && artworkFor(item)) return <div className="wishlist-photo" data-illustration-state="ready"><CatalogProductImage product={item} /></div>
  return <div className={`wishlist-photo${decorate ? ' wishlist-photo--food-accent' : ''}`} data-illustration-state={source && failed !== source ? 'ready' : 'pending'}>
    {source && failed !== source
      ? <img src={assetHref(source)} alt={`${item.koreanName} 일러스트`} onError={() => setFailed(source)} />
      : <span className="wishlist-illustration-pending" role="img" aria-label={`${item.koreanName} 글자 없는 일러스트 준비 중`}><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="6" y="7" width="36" height="34" rx="7" /><path d="m8 33 10-10 8 8 5-5 9 9" /><circle cx="30" cy="18" r="4" /></svg><span>일러스트 준비 중</span></span>}
  </div>
}


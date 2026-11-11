import { appLocation, assetHref } from '../appRouting'
import { useId, useLayoutEffect, useRef } from 'react'
import { menuCategories, MenuProductImage } from '../pages/OurMenu'
import MemberProductImage from './MemberProductImage'

const products = menuCategories.flatMap(category => category.products)
export default function OrderProductImage({ item, fit = 'cover' }) {
  const container = useRef(null)
  const clipId = useId()
  const product = products.find(product => product.id === item.id)
  useLayoutEffect(() => {
    container.current?.querySelectorAll('svg').forEach(svg => svg.setAttribute('preserveAspectRatio', fit === 'contain' ? 'xMidYMid meet' : 'xMidYMid slice'))
  }, [item.id, fit])
  const photoBox = item.previewPhoto?.split(' ').map(Number)
  if (appLocation.pathname.startsWith('/mypage')) return <MemberProductImage item={item} />
  return <div ref={container} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>{photoBox ? <svg viewBox={item.previewPhoto} role="img" aria-label={item.koreanName} style={{ display: 'block', width: '100%', height: '100%' }}><defs><clipPath id={clipId}><rect x={photoBox[0]} y={photoBox[1]} width={photoBox[2]} height={photoBox[3]} /></clipPath></defs><image href={assetHref("/images/주문상세.png")} width="1632" height="1569" clipPath={`url(#${clipId})`} /></svg> : item.imageSrc ? <img src={assetHref(item.imageSrc)} alt={item.koreanName} style={{ width: '100%', height: '100%', objectFit: fit }} /> : product ? <MenuProductImage product={product} /> : <span>상품 이미지 준비 중</span>}</div>
}

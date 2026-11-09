import { useId, useLayoutEffect, useRef } from 'react'
import { menuCategories, MenuProductImage } from '../pages/OurMenu'

const products = menuCategories.flatMap(category => category.products)
export default function OrderProductImage({ item }) {
  const container = useRef(null)
  const clipId = useId()
  const product = products.find(product => product.id === item.id)
  useLayoutEffect(() => {
    container.current?.querySelectorAll('svg').forEach(svg => svg.setAttribute('preserveAspectRatio', 'xMidYMid slice'))
  }, [item.id])
  const photoBox = item.previewPhoto?.split(' ').map(Number)
  return <div ref={container} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>{photoBox ? <svg viewBox={item.previewPhoto} role="img" aria-label={item.koreanName} style={{ display: 'block', width: '100%', height: '100%' }}><defs><clipPath id={clipId}><rect x={photoBox[0]} y={photoBox[1]} width={photoBox[2]} height={photoBox[3]} /></clipPath></defs><image href="/images/주문상세.png" width="1632" height="1569" clipPath={`url(#${clipId})`} /></svg> : item.imageSrc ? <img src={item.imageSrc} alt={item.koreanName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : product ? <MenuProductImage product={product} /> : <span>상품 이미지 준비 중</span>}</div>
}

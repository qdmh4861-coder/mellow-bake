import { assetHref } from '../appRouting'
import { useLayoutEffect, useRef } from 'react'
import { menuCategories, MenuProductImage } from '../pages/OurMenu'
import { reviewProducts } from '../reviewProducts'
import { productSlug } from '../pages/productLinks'
import { seasonalProducts } from '../newMenuCatalog'
import NewMenuProductImage from './NewMenuProductImage'
import './MemberProductImage.css'

const menu = menuCategories.flatMap(category => category.products)
const normalized = name => (name || '').replace(/\s/g, '')
const memberArt = [
  { id: 'chocolate-roll-cake', koreanName: '초코 롤케이크', imageSrc: '/images/member-product-chocolate-roll.png' },
  { id: 'strawberry-tart', koreanName: '딸기 타르트', imageSrc: '/images/member-product-strawberry-tart.png' },
  { id: 'payment-example-vanilla-latte', koreanName: '바닐라 라떼', imageSrc: '/images/member-product-vanilla-latte.png' },
]
// One registry for member product art. Never use order screenshots or uploaded photos.
export function memberIllustrationFor(item = {}) {
  const id = item.catalogId || item.productId || item.id || ''
  const name = item.koreanName || item.korean || item.name || ''
  const additional = memberArt.find(product => product.id === id || normalized(product.koreanName) === normalized(name))
  if (additional) return { kind: 'asset', product: additional }
  const product = menu.find(product => productSlug(product.id) === productSlug(id)) || menu.find(product => normalized(product.koreanName) === normalized(name))
  if (product) return { kind: 'menu', product }
  const seasonal = seasonalProducts.find(product => product.id === id)
  if (seasonal) return { kind: 'seasonal', product: seasonal }
  const existing = reviewProducts.find(product => product.id === id) || reviewProducts.find(product => normalized(product.koreanName || product.korean) === normalized(name))
  if (existing?.imageSrc) return { kind: 'asset', product: existing }
  return null
}
export default function MemberProductImage({ item }) {
  const container = useRef(null), art = memberIllustrationFor(item)
  const name = item.koreanName || item.korean || item.name || art?.product.koreanName || '상품'
  useLayoutEffect(() => {
    container.current?.querySelectorAll('svg').forEach(svg => svg.setAttribute('preserveAspectRatio', 'xMidYMid meet'))
  }, [art?.product.id])
  return <div className="member-product-illustration" ref={container} data-product-art={art?.product.id || 'missing'}>{art?.kind === 'menu' ? <MenuProductImage product={art.product} /> : art?.kind === 'seasonal' ? <NewMenuProductImage product={art.product} /> : art?.kind === 'asset' ? <img src={assetHref(art.product.imageSrc)} alt={name} /> : <span className="member-product-art-missing" role="img" aria-label={`${name} 일러스트 준비 중`}>{name}<small>일러스트 준비 중</small></span>}</div>
}

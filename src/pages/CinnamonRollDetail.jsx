import { assetHref, appHref } from '../appRouting'
import { useId, useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import ProductDetailFooter from '../components/ProductDetailFooter'
import { menuCategories } from './OurMenu'
import './CinnamonRollDetail.css'
import ProductHero from '../components/ProductHero'
import { cartAddMessage, buyNow } from '../cartStore'
import { productHref } from './productLinks'

const reference = '/images/03_시나몬.png'
const product = menuCategories.find(category => category.id === 'bread').products.find(item => item.id === 'bread-7')
const recommendations = ['cake-1', 'bread-6', 'bread-2', 'drink-3'].map(id => menuCategories.flatMap(category => category.products).find(item => item.id === id))
// Source coordinates preserve every pixel of the supplied 1632 × 7521 Figma export.
const artworkSections = [
  ['cinnamon-introduction', 980, 1350, '핑크색 배경의 시나몬롤 소개와 캐릭터'],
  ['cinnamon-texture', 1350, 1680, '겉은 달콤하고 속은 촉촉한 시나몬롤의 특징과 단면 사진'],
  ['cinnamon-craft-ingredients', 1680, 2025, '좋은 재료로 만든 시나몬롤 소개'],
  ['cinnamon-process', 2025, 2455, '정성 가득한 제작 과정: 반죽 숙성, 시나몬 필링 넣기, 굽기'],
  ['cinnamon-serving', 2455, 2865, '시나몬롤을 더 달콤하게 즐기는 방법과 상품 사진'],
  ['cinnamon-features', 2865, 4010, '부드러운 식감, 시나몬 향, 달콤한 아이싱을 소개하는 세 가지 상품 사진과 설명'],
  ['cinnamon-ingredients', 4010, 4840, '밀가루, 버터, 우유, 시나몬 일러스트와 피그마 시안의 원재료·알레르기 확인 안내'],
  ['cinnamon-storage', 4840, 5590, '피그마 원본의 실온 보관, 냉동 보관, 데우기 안내'],
  ['cinnamon-shipping', 5590, 6260, '피그마 원본의 상품 정보 및 배송 안내. 실제 판매 정보는 확인이 필요합니다.'],
  ['cinnamon-reviews', 6260, 6715, '제공된 피그마 시안의 리뷰 카드 네 개. 원본에 명시된 포트폴리오용 가상 후기입니다.'],
  ['cinnamon-related', 6715, 7130, '하단 관련 상품: 딸기 생크림 케이크, 초코 크림빵, 몽블랑, 바닐라 라떼'],
]
const gallery = [
  ['315 286 650 600', '시나몬롤 대표 사진'],
  ['210 1350 600 310', '시나몬롤 단면 사진'],
  ['310 2990 480 310', '부드러운 시나몬롤 사진'],
  ['850 3330 480 310', '시나몬롤 윗면 사진'],
  ['310 3650 480 310', '아이싱을 올린 시나몬롤 사진'],
]

function FigmaRegion({ box, label }) {
  const clipId = useId()
  const [x, y, width, height] = box.split(' ').map(Number)
  return <svg className="cinnamon-figma-region" viewBox={box} role="img" aria-label={label}>
    <defs><clipPath id={clipId}><rect x={x} y={y} width={width} height={height} /></clipPath></defs>
    <image href={assetHref(reference)} width="1632" height="7521" clipPath={`url(#${clipId})`} />
  </svg>
}

export default function CinnamonRollDetail() {
  const [quantity, setQuantity] = useState(1)
  const [notice, setNotice] = useState('')
  const images = gallery.map(([box, label]) => ({ id: box, label, image: <FigmaRegion box={box} label={label} /> }))
  return <div className="cinnamon-detail-page">
    <HomeHeader />
    <main className="cinnamon-detail-main catalog-product-main">
      <ProductHero key={product.id} product={product} price={product.price} images={images}
        quantity={quantity} onQuantityChange={setQuantity}
        onCart={() => setNotice(cartAddMessage(product, quantity))}
        onBuy={() => setNotice(buyNow(product, quantity, product.price))}
        anchors={{ introduction: '#cinnamon-introduction', ingredients: '#cinnamon-ingredients', storage: '#cinnamon-storage', reviews: '#cinnamon-reviews', related: '#cinnamon-related', shipping: '#cinnamon-shipping' }}
      />
      <p className="cinnamon-action-status" role="status">{notice}</p>
      {artworkSections.map(([id, top, bottom, label]) => <section className="cinnamon-art-section" id={id} key={id} aria-label={label} style={id === 'cinnamon-related' ? { position: 'relative' } : undefined}>
        {id === 'cinnamon-reviews' ? <a style={{ display: 'block' }} href={appHref("/reviews?productId=bread-7")} aria-label="시나몬롤 실제 상품 리뷰 보기"><FigmaRegion box={`200 ${top} 1230 ${bottom - top}`} label={label} /></a> : <FigmaRegion box={`200 ${top} 1230 ${bottom - top}`} label={label} />}
        {id === 'cinnamon-related' && recommendations.map((item, index) => <a key={item.id} href={appHref(productHref(item.id))} aria-label={`${item.koreanName} 상세보기`} style={{ position: 'absolute', left: `${index * 25}%`, top: '20%', width: '25%', height: '75%' }} />)}
      </section>)}
      <p className="cinnamon-source-note">재료·보관·배송 안내와 리뷰는 제공된 피그마 시안입니다. 실제 판매 정보는 확인 후 적용됩니다. <a href={appHref(reference)} target="_blank" rel="noreferrer">원본 크게 보기</a></p>
    </main>
    <ProductDetailFooter />
  </div>
}

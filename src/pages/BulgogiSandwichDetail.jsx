import { assetHref, appHref } from '../appRouting'
import { useId, useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import ProductDetailFooter from '../components/ProductDetailFooter'
import { menuCategories, MenuProductImage } from './OurMenu'
import './BulgogiSandwichDetail.css'
import { cartAddMessage, buyNow } from '../cartStore'

const reference = '/images/03_불고기.png'
const product = menuCategories.find(category => category.id === 'sandwich').products.find(item => item.id === 'sandwich-5')
// Source coordinates preserve every pixel of the supplied 1632 × 7491 Figma export.
const artworkSections = [
  ['bulgogi-introduction', 980, 1350, '핑크색 배경의 불고기 샌드위치 소개와 캐릭터'],
  ['bulgogi-texture', 1350, 1680, '겉은 바삭하고 속은 든든한 불고기 샌드위치의 특징과 단면 사진'],
  ['bulgogi-craft-ingredients', 1680, 2025, '좋은 재료로 만든 불고기 샌드위치 소개'],
  ['bulgogi-process', 2025, 2455, '정성 가득한 제작 과정: 불고기 준비, 신선한 재료 채우기, 샌드위치 완성의 3컷 이미지'],
  ['bulgogi-serving', 2455, 2865, '불고기 샌드위치을 더 달콤하게 즐기는 방법과 상품 사진'],
  ['bulgogi-features', 2865, 4010, '불고기와 신선한 채소, 든든한 샌드위치를 소개하는 세 가지 사진과 설명'],
  ['bulgogi-ingredients', 4010, 4840, '불고기, 양상추, 토마토, 치즈 일러스트와 피그마 시안의 원재료·알레르기 확인 안내'],
  ['bulgogi-storage', 4840, 5590, '피그마 원본의 냉장 보관, 빠른 섭취, 따뜻하게 즐기는 방법 안내'],
  ['bulgogi-shipping', 5590, 6260, '피그마 원본의 상품 정보 및 배송 안내. 실제 판매 정보는 확인이 필요합니다.'],
  ['bulgogi-reviews', 6260, 6715, '제공된 피그마 시안의 리뷰 카드 네 개. 원본에 명시된 포트폴리오용 가상 후기입니다.'],
]
const gallery = [
  ['315 286 650 600', '불고기 샌드위치 대표 사진'],
  ['210 1350 600 310', '불고기 샌드위치 단면 사진'],
  ['310 2990 480 310', '부드러운 불고기 샌드위치 사진'],
  ['850 3330 480 310', '불고기 샌드위치의 신선한 채소 사진'],
  ['310 3650 480 310', '불고기 샌드위치 측면 사진'],
]
const registeredProducts = menuCategories.flatMap(category => category.products)
const recommendations = ['cake-1', 'bread-1', 'bread-7', 'drink-3'].map(id => registeredProducts.find(item => item.id === id))
const recommendationPhotos = ['250 6810 250 150', null, '820 6810 250 150', '1105 6810 250 150']

function FigmaRegion({ box, label }) {
  const clipId = useId()
  const [x, y, width, height] = box.split(' ').map(Number)
  return <svg className="bulgogi-figma-region" viewBox={box} role="img" aria-label={label}>
    <defs><clipPath id={clipId}><rect x={x} y={y} width={width} height={height} /></clipPath></defs>
    <image href={assetHref(reference)} width="1632" height="7491" clipPath={`url(#${clipId})`} />
  </svg>
}

export default function BulgogiSandwichDetail() {
  const [quantity, setQuantity] = useState(1)
  const [selected, setSelected] = useState(0)
  const [notice, setNotice] = useState('')
  return <div className="bulgogi-detail-page">
    <HomeHeader />
    <main className="bulgogi-detail-main">
      <section className="bulgogi-hero" aria-labelledby="bulgogi-title">
        <h1 id="bulgogi-title" className="bulgogi-accessible">{product.koreanName}</h1>
        <p className="bulgogi-accessible">{product.name}. {product.description}</p>
        <FigmaRegion box="200 260 1230 720" label="불고기 샌드위치 상품 정보, 대표 사진, 캐릭터와 핑크색 장식" />
        {selected > 0 && <div className="bulgogi-selected-photo"><FigmaRegion box={gallery[selected][0]} label={gallery[selected][1]} /></div>}
        <div className="bulgogi-gallery-controls" aria-label="상품 이미지 선택">{gallery.map(([, label], index) => <button className="bulgogi-thumbnail" type="button" key={label} aria-label={label} aria-pressed={selected === index} onClick={() => setSelected(index)} />)}</div>
        <p className="bulgogi-live-price" aria-label={`판매 가격 ${product.price.toLocaleString('ko-KR')}원`}>{product.price.toLocaleString('ko-KR')}원</p>
        <div className="bulgogi-quantity" role="group" aria-label="상품 수량"><button type="button" aria-label="수량 늘리기" disabled={quantity === 99} onClick={() => setQuantity(value => value + 1)}>+</button><output aria-live="polite">{quantity}</output><button type="button" aria-label="수량 줄이기" disabled={quantity === 1} onClick={() => setQuantity(value => value - 1)}>−</button></div>
        <button className="bulgogi-cart" type="button" onClick={() => setNotice(cartAddMessage(product, quantity))}>장바구니 담기</button>
        <button className="bulgogi-buy" type="button" onClick={() => setNotice(buyNow(product, quantity, product.price))}>바로 구매하기</button>
        <nav className="bulgogi-tabs" aria-label="불고기 샌드위치 상세 메뉴"><a href={appHref("#bulgogi-introduction")} aria-label="상품 정보" /><a href={appHref("#bulgogi-ingredients")} aria-label="원재료 및 영양 정보" /><a href={appHref("#bulgogi-reviews")} aria-label="피그마 시안 리뷰" /><a href={appHref("#bulgogi-shipping")} aria-label="상품 및 배송 안내" /></nav>
      </section>
      <p className="bulgogi-action-status" role="status">{notice}</p>
      {artworkSections.map(([id, top, bottom, label]) => <section className="bulgogi-art-section" id={id} key={id} aria-label={label}>
        {id === 'bulgogi-reviews' ? <a style={{ display: 'block' }} href={appHref("/reviews?productId=sandwich-5")} aria-label="불고기 샌드위치 실제 상품 리뷰 보기"><FigmaRegion box={`200 ${top} 1230 ${bottom - top}`} label={label} /></a> : <FigmaRegion box={`200 ${top} 1230 ${bottom - top}`} label={label} />}
      </section>)}
      <section id="bulgogi-related" className="bulgogi-related" aria-labelledby="bulgogi-related-title">
        <h2 id="bulgogi-related-title">함께 보면 좋은 상품</h2>
        <div className="bulgogi-related-grid">{recommendations.map((item, index) => <a className="bulgogi-related-card" href={appHref(item.detailHref)} key={item.id} data-product-id={item.id}>
          <div className="bulgogi-related-photo">{recommendationPhotos[index] ? <FigmaRegion box={recommendationPhotos[index]} label={item.koreanName} /> : <MenuProductImage product={item} />}</div>
          <h3>{item.koreanName}</h3><p>{item.price.toLocaleString('ko-KR')}원</p>
        </a>)}</div>
      </section>
      <p className="bulgogi-source-note">재료·보관·배송 안내와 리뷰는 제공된 피그마 시안입니다. 실제 판매 정보는 확인 후 적용됩니다. <a href={appHref(reference)} target="_blank" rel="noreferrer">원본 크게 보기</a></p>
    </main>
    <ProductDetailFooter />
  </div>
}

import { useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import reference from '../assets/salt-bread-figma-reference.png'
import './SaltBreadDetail.css'
import { menuCategories } from './OurMenu'
import { cartAddMessage } from '../cartStore'

const product = menuCategories.find(category => category.id === 'bread').products.find(item => item.id === 'bread-1')

// Display regions of the supplied 1632 × 7491 Figma export without inventing assets.
function FigmaRegion({ box, label, className = '' }) {
  return <svg className={`salt-detail-art ${className}`} viewBox={box} role="img" aria-label={label}>
    <image href={reference} width="1632" height="7491" />
  </svg>
}

const gallery = [
  { box:'315 286 650 610', label:'토끼 파티시에와 함께한 소금빵 대표 이미지' },
  { box:'210 1350 600 310', label:'바삭한 겉면과 촉촉한 속살의 소금빵' },
  { box:'310 2990 480 270', label:'버터와 함께 즐기는 소금빵' },
]

export default function SaltBreadDetail() {
  const [quantity, setQuantity] = useState(1)
  const [selected, setSelected] = useState(0)
  const [notice, setNotice] = useState('')
  return <div className="salt-detail-page">
    <HomeHeader />
    <main className="salt-detail-main">
      <section className="salt-detail-hero" aria-labelledby="salt-detail-title">
        <div className="salt-detail-gallery">
          <div className="salt-detail-thumbnails" aria-label="상품 이미지 선택">
            {gallery.map((item, index) => <button type="button" key={item.box} aria-label={item.label} aria-pressed={selected === index} onClick={() => setSelected(index)}><FigmaRegion {...item} /></button>)}
          </div>
          <FigmaRegion {...gallery[selected]} className="salt-detail-main-image" />
        </div>
        <div className="salt-detail-summary">
          <h1 id="salt-detail-title">소금빵</h1>
          <p className="salt-detail-english">Salt Bread</p>
          <p className="salt-detail-price">3,200원</p>
          <p className="salt-detail-description">바삭한 겉면과 촉촉한 속살,<br />고소한 버터와 은은한 소금의 조화</p>
          <div className="salt-detail-quantity" role="group" aria-label="상품 수량">
            <button type="button" disabled={quantity === 1} onClick={() => setQuantity(value => value - 1)} aria-label="수량 줄이기">−</button>
            <output aria-live="polite">{quantity}</output>
            <button type="button" disabled={quantity === 99} onClick={() => setQuantity(value => value + 1)} aria-label="수량 늘리기">+</button>
          </div>
          <div className="salt-detail-actions">
            <button type="button" onClick={() => setNotice(cartAddMessage(product, quantity))}>장바구니 담기</button>
            <button type="button" onClick={() => setNotice('주문·결제 서비스 연결 준비 중입니다. 주문은 생성되지 않았습니다.')}>바로 구매하기</button>
          </div>
          <p className="salt-detail-status" role="status">{notice}</p>
        </div>
      </section>
      <nav className="salt-detail-tabs" aria-label="상품 상세 메뉴">
        <a href="#salt-description">상품설명</a><a href="#salt-shipping">상품 및 배송안내</a><a href="#salt-reviews">상품 리뷰</a><a href="#salt-related">함께 보면 좋은 상품</a>
      </nav>
      <section id="salt-description" aria-label="소금빵 상품 설명">
        <FigmaRegion box="210 1025 1210 3645" label="멜로우베이크의 시그니처 소금빵. 겉은 바삭, 속은 촉촉한 식감. 좋은 재료, 정성 가득한 제작 과정, 소금빵을 즐기는 방법과 밀가루·버터·우유·소금 재료 안내. 상세 문구는 첨부된 피그마 원본 이미지입니다." />
        <FigmaRegion box="210 4670 1210 905" label="소금빵을 더 맛있게 즐기는 방법: 실온 보관, 냉동 보관, 맛있게 데우기. 보관 및 데우기 안내는 피그마 원본을 표시합니다." />
      </section>
      <section id="salt-shipping" aria-label="상품 정보 및 배송 안내">
        <FigmaRegion box="210 5575 1210 665" label="상품 정보 및 배송 안내. 첨부된 피그마 원본의 안내 표입니다. 운영 정보 확인이 필요합니다." />
      </section>
      <section id="salt-reviews" aria-label="상품 리뷰 디자인 시안">
        <a style={{ display: 'block' }} href="/reviews?productId=bread-1" aria-label="소금빵 실제 상품 리뷰 보기"><FigmaRegion box="210 6240 1210 420" label="피그마 디자인에 포함된 예시 상품 리뷰 카드입니다. 실제 구매 후기를 불러온 것이 아닙니다." /></a>
      </section>
      <section id="salt-related" aria-label="함께 보면 좋은 상품 디자인 시안">
        <FigmaRegion box="210 6660 1210 440" label="함께 보면 좋은 상품: 딸기 생크림 케이크, 초코 크림빵, 시나몬롤, 바닐라 크림라떼. 원본 시안 이미지이며 다른 상품 상세페이지는 아직 연결하지 않았습니다." />
      </section>
      <p className="salt-detail-source-note">상세 설명과 리뷰는 제공된 피그마 시안 이미지입니다. <a href={reference} target="_blank" rel="noreferrer">원본 크게 보기</a></p>
      <a className="salt-detail-back" href="/menu">OUR MENU로 돌아가기</a>
    </main>
    <HomeFooter />
  </div>
}

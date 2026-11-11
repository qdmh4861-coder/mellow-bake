import { assetHref, appHref } from '../appRouting'
import { useId, useLayoutEffect, useRef } from 'react'
import chef from '../assets/our-story/bunny.png'
import { productHref, productSlug } from '../pages/productLinks'
import './ProductDetailBody.css'
import { getProductReviews, reviewsHref } from '../reviewData'

const ingredientNames = ['생딸기', '딸기', '우유', '생크림', '크림치즈', '치즈', '버터', '고구마', '팥앙금', '마늘', '초콜릿', '시나몬', '소시지', '햄', '달걀', '치킨', '베이컨', '불고기', '아보카도', '바질', '토마토', '양상추', '말차', '에스프레소', '마스카포네', '코코아', '당근', '호두', '블루베리', '바닐라', '카라멜', '레몬', '복숭아', '홍차', '아몬드', '올리브', '무화과', '감자', '로즈메리', '얼그레이', '사과', '참치', '옥수수', '오이', '버섯', '칠면조', '크랜베리', '새우', '양배추', '연어', '케이퍼', '로스트비프', '루콜라', '머스터드', '가지', '주키니', '모차렐라', '요거트', '흑임자', '망고', '코코넛', '피스타치오', '라즈베리', '꿀', '밤', '캐모마일', '자몽', '청귤', '히비스커스']
const ingredientArtwork = { 버터: '560 4200 250 240', 우유: '835 4200 250 240', 시나몬: '1100 4200 250 240' }

function Ingredient({ name }) {
  const clip = useId()
  const box = ingredientArtwork[name]
  if (!box) return <div className="story-ingredient-symbol" aria-hidden="true"><span>✦</span><b>{name}</b></div>
  const [x, y, width, height] = box.split(' ').map(Number)
  return <svg viewBox={box} className="story-ingredient-art" role="img" aria-label={name}><defs><clipPath id={clip}><rect x={x} y={y} width={width} height={height} /></clipPath></defs><image href={assetHref("/images/03_시나몬.png")} width="1632" height="7521" clipPath={`url(#${clip})`} /></svg>
}

function Title({ number, children }) {
  return <div className="story-title"><span className="story-step">{number}</span><h2>{children}</h2></div>
}

function GuideIcon({ type }) {
  return <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {type === 'temperature' ? <><path d="M34 44V17a8 8 0 0 1 16 0v27a17 17 0 1 1-16 0Z" /><path d="M42 26v31m16-34h8m-8 12h5" /><circle cx="42" cy="59" r="6" fill="currentColor" /></> : type === 'time' ? <><circle cx="40" cy="42" r="25" /><path d="M40 26v18l12 7M31 9h18m-9 0v8" /></> : <><rect x="14" y="20" width="52" height="46" rx="10" /><path d="M14 34h52m-35 9h18m-28 15h38M28 10v6m12-8v8m12-6v6" /></>}
  </svg>
}

export default function ProductDetailBody({ product, price, products, renderPhoto, containImages = false }) {
  const reviews = getProductReviews(product.id)
  const bodyRef = useRef(null)
  useLayoutEffect(() => {
    bodyRef.current?.querySelectorAll('.catalog-story-photo svg, .catalog-story-banner-photo svg, .catalog-story-related-photo svg').forEach(svg => svg.setAttribute('preserveAspectRatio', containImages ? 'xMidYMid meet' : 'xMidYMid slice'))
  }, [product.id, renderPhoto, containImages])
  const known = ingredientNames.filter(name => product.description.includes(name)).filter((name, index, all) => !all.some((other, j) => j !== index && other.length > name.length && other.includes(name)))
  const candidates = products.filter(item => productSlug(item.id) !== productSlug(product.id))
  const related = [...candidates.filter(item => item.category === product.category).slice(0, 2), ...candidates.filter(item => item.category !== product.category).slice(0, 2)]
  const drink = product.category === 'drink'
  const details = [
    [`${product.koreanName}의 매력`, product.description],
    ['상품 설명에 담긴 맛과 재료', known.length ? `${known.join(' · ')}. 기존 상품 설명에 소개된 재료입니다. 전체 원재료와 함량은 확인 후 안내합니다.` : '정확한 원재료와 맛의 특징을 확인하고 있습니다. 확인된 상품 정보를 바탕으로 안내하겠습니다.'],
    [`나를 위한 ${drink ? '한 모금' : '한 입'}의 시간`, `좋아하는 순간에 ${product.koreanName}을 만나보세요.`],
  ]
  return <div className="catalog-story-body" ref={bodyRef}>
    <section id="product-introduction" className="catalog-story-intro" aria-labelledby="catalog-story-intro-title"><div><span className="catalog-story-wordmark" aria-hidden="true">Mellow<br />Bake ♡</span><h2 id="catalog-story-intro-title">{product.koreanName}<br />{drink ? '한 모금의 즐거움' : '한 입의 즐거움'}</h2><p>{product.description}</p></div><div className="catalog-story-banner-photo">{renderPhoto(product)}</div><span className="catalog-story-heart" aria-hidden="true">♡</span></section>

    <section className="catalog-story-feature" aria-label="상품 특징"><div className="catalog-story-photo">{renderPhoto(product)}</div><div><Title number="01">{product.koreanName}의<br />맛있는 순간</Title><p>{product.description}</p></div></section>

    <section className="catalog-story-panel catalog-story-materials" aria-label="상품 설명에 소개된 재료"><img src={assetHref(chef)} alt="" loading="lazy" /><div><Title number="02">상품 설명에 담긴<br />재료를 소개합니다.</Title><p>확인된 상품 설명을 바탕으로 소개합니다.</p></div><div className="catalog-story-small-ingredients">{known.length ? known.slice(0, 3).map(name => <div key={name}><Ingredient name={name} /><h3>{name}</h3></div>) : <p>정확한 재료 정보를 확인 중입니다.</p>}</div></section>

    <section id="product-process" className="catalog-story-panel" aria-labelledby="catalog-story-process-title"><Title number="03"><span id="catalog-story-process-title">정성을 담는<br />제작 과정</span></Title><div className="catalog-story-three-cards">{['준비 과정', '제조 과정', '완성 과정'].map((label, index) => <div className="catalog-story-guide-card" key={label}><div className="catalog-story-photo-pending"><span aria-hidden="true">0{index + 1}</span><p>공정 사진 준비 중</p></div><h3>{label}</h3><p>실제 제조 단계와 설명을<br />확인한 뒤 안내하겠습니다.</p></div>)}</div></section>

    <section id="product-enjoy" className="catalog-story-panel" aria-labelledby="catalog-story-enjoy-title"><Title number="04"><span id="catalog-story-enjoy-title">{product.koreanName}<br />더 맛있게 즐기는 방법</span></Title><div className="catalog-story-three-cards">{[['time', '즐기는 시간'], ['temperature', drink ? '권장 음용 방법' : '권장 섭취 방법'], ['serving', '함께 즐기는 방법']].map(([type, label]) => <div className="catalog-story-guide-card" key={type}><div className="catalog-story-guide-illustration"><GuideIcon type={type} /></div><h3>{label}</h3><p>상품별 권장 방법과 원본 사진을<br />확인 중입니다.</p></div>)}</div></section>

    <section className="catalog-story-panel catalog-story-details" aria-label="상품 상세 소개"><span className="story-step">05</span>{details.map(([title, text], index) => <div className={`catalog-story-detail-row${index % 2 ? ' catalog-story-detail-row--reverse' : ''}`} key={title}><div className="catalog-story-photo">{renderPhoto(product)}</div><div><h3>{title}</h3><p>{text}</p></div></div>)}</section>

    <section id="product-ingredients" className="catalog-story-panel catalog-story-ingredients" aria-labelledby="catalog-story-ingredients-title"><Title number="06"><span id="catalog-story-ingredients-title">{product.koreanName}에 담긴 재료</span></Title><p className="catalog-story-center-note">기존 상품 설명에 소개된 재료입니다.</p><div className="catalog-story-ingredient-grid">{known.length ? known.slice(0, 4).map(name => <div key={name}><Ingredient name={name} /><h3>{name}</h3></div>) : <p>전체 원재료 정보 확인 중</p>}</div><div className="catalog-story-allergens"><h3>원재료 및 알레르기 안내</h3><p><strong>원재료</strong> 전체 원재료와 함량 확인 중</p><p><strong>알레르기</strong> 유발 성분과 교차 접촉 정보 확인 중</p><small>확인되지 않은 원재료나 알레르기 정보는 임의로 안내하지 않습니다.</small></div></section>

    <section id="product-storage" className="catalog-story-panel catalog-story-storage" aria-labelledby="catalog-story-storage-title"><h2 id="catalog-story-storage-title">{product.koreanName}, 더 맛있게 즐기는 방법</h2><p className="catalog-story-center-note">정확한 보관 기준을 확인한 뒤 안내해 드리겠습니다.</p><div className="catalog-story-three-cards">{[['temperature', '보관 온도', '권장 온도와 냉장·냉동 가능 여부를 확인 중입니다.'], ['time', '보관 기간', '소비기한과 개봉 후 섭취 기한을 확인 중입니다.'], ['serving', drink ? '음용 방법' : '맛있게 즐기기', drink ? '음료별 권장 음용 방법을 확인 중입니다.' : '데우기 가능 여부와 시간·온도를 확인 중입니다.']].map(([type, title, text]) => <div className="catalog-story-guide-card" key={type}><div className="catalog-story-guide-illustration"><GuideIcon type={type} /></div><h3>{title}</h3><p>{text}</p></div>)}</div></section>

    <section id="product-shipping" className="catalog-story-panel catalog-story-shipping" aria-labelledby="catalog-story-shipping-title"><h2 id="catalog-story-shipping-title">상품 정보 및 배송 안내</h2><p className="catalog-story-center-note">주문 전 상품별 운영 정보를 확인해 주세요.</p><dl><div><dt>상품명</dt><dd>{product.koreanName}</dd></div><div><dt>판매 가격</dt><dd>{price.toLocaleString('ko-KR')}원</dd></div><div><dt>판매 단위</dt><dd>중량·용량·판매 구성 확인 중</dd></div><div><dt>보관 및 알레르기</dt><dd>상품별 정확한 기준 확인 중</dd></div></dl><dl>{['배송 방법', '배송 일정', '배송비', '교환 / 환불'].map(label => <div key={label}><dt>{label}</dt><dd>운영 기준 확인 후 안내 예정</dd></div>)}</dl></section>

    <section id="product-reviews" className="catalog-story-reviews" aria-labelledby="catalog-story-reviews-title"><div className="catalog-story-review-heading"><h2 id="catalog-story-reviews-title"><a href={appHref(reviewsHref(product.id))}>✿ 상품 리뷰</a></h2><span>{reviews.length ? `구매 후기 ${reviews.length}개` : '구매 후기 준비 중'}</span></div><div className="catalog-story-review-grid">{reviews.length ? reviews.slice(0, 4).map(review => <a className="catalog-story-review-pending" href={appHref(reviewsHref(product.id))} key={review.id}><strong>{review.nickname || '작성자'}</strong><p>{review.body}</p><small>{review.rating}점 · {review.createdAt?.slice(0, 10)}</small></a>) : [1, 2, 3, 4].map(index => <div className="catalog-story-review-pending" key={index}><span aria-hidden="true">♡</span><p>리뷰 준비 중</p><small>제공된 실제 구매 후기가 없습니다.</small></div>)}</div></section>

    <section id="product-recommendations" className="catalog-story-related" aria-labelledby="catalog-story-related-title"><h2 id="catalog-story-related-title">함께 보면 좋은 상품</h2><div className="catalog-story-related-grid">{related.map(item => <a href={appHref(productHref(item.id))} key={item.id} data-product-id={item.id}><div className="catalog-story-related-photo">{renderPhoto(item)}</div><h3>{item.koreanName}</h3><p>{item.price.toLocaleString('ko-KR')}원</p></a>)}</div></section>
  </div>
}

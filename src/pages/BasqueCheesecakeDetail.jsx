import { useId, useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import ProductHero from '../components/ProductHero'
import { cartAddMessage } from '../cartStore'
import { toggleWishlist, useWishlist } from '../wishlistStore'
import { getProductReviews, reviewsHref, useReviewUpdates } from '../reviewData'
import { productHref } from './productLinks'
import cakeArtwork from './cakeListArt.json'
import './BasqueCheesecakeDetail.css'

// Illustration-only regions of the supplied reference. All copy, controls and
// information tables below are HTML. The original PNG remains unchanged.
const artwork = {
  hero: ['85 50 290 262', '멜로우 토끼와 바스크 치즈케이크'],
  whole: ['52 1148 245 75', '바스크 치즈케이크 전체 모습'],
  slice: ['376 360 280 147', '접시에 담긴 바스크 치즈케이크 한 조각'],
  texture: ['0 0 1942 809', '토끼와 함께 보는 촉촉한 치즈 단면'],
  coffee: ['52 1296 260 81', '바스크 치즈케이크와 따뜻한 음료'],
  cheese: ['352 649 91 66', '크림치즈 일러스트'],
  cream: ['465 649 82 66', '생크림 일러스트'],
  egg: ['565 649 91 66', '달걀 일러스트'],
  prepare: ['45 788 164 103', '토끼가 거품기로 치즈 반죽을 섞는 모습'],
  bake: ['252 784 187 104', '토끼와 오븐에서 굽는 치즈케이크'],
  finish: ['475 785 169 103', '완성된 치즈케이크와 토끼'],
  delight: ['418 1220 225 80', '부드러운 치즈케이크 한 조각'],
  chef: ['23 650 62 78', '요리사 토끼'],
  heartRabbit: ['539 1134 98 87', '하트를 든 토끼'],
  happyRabbit: ['24 1226 111 74', '행복한 토끼'],
  restRabbit: ['548 1304 98 70', '휴식하는 토끼'],
}
function BasqueArt({ name, className = '' }) {
  const id = useId()
  const [box, label] = artwork[name]
  const [x, y, width, height] = box.split(' ').map(Number)
  // Exclude only the isolated decorative hearts, preserving the ingredients
  // and leaving the supplied PNG unchanged.
  const heartCutouts = {
    cheese: [[352, 649, 18, 32], [430, 649, 13, 35]],
    cream: [[534, 649, 13, 25]],
    egg: [[637, 649, 19, 24]],
  }[name] || []
  const rectangle = ([left, top, w, h]) => `M${left} ${top}h${w}v${h}h${-w}Z`
  const completed = name === 'texture'
  const artOutline = rectangle([x, y, width, height])
  const outline = [artOutline, ...heartCutouts.map(rectangle)].join(' ')
  return <div className={`basque-art basque-art--${name} ${className}`} style={{ '--basque-art-ratio': `${width} / ${height}` }}><svg viewBox={box} preserveAspectRatio="xMidYMid meet" role="img" aria-label={label}><defs><clipPath id={id}><path d={outline} clipRule="evenodd" fillRule="evenodd" /></clipPath></defs><image href={completed ? '/images/basque-texture-completed.png' : '/images/바스크.png'} width={completed ? 1942 : 683} height={completed ? 809 : 2049} clipPath={`url(#${id})`} /></svg></div>
}
function Title({ number, children }) {
  return <div className="story-title"><span className="story-step">{number}</span><h2>{children}</h2></div>
}
function RelatedPhoto({ product, fallback }) {
  const id = useId()
  const art = cakeArtwork[product.id]
  if (!art) return fallback(product)
  const [x, y, width, height] = art.clip
  return <svg viewBox={art.box} preserveAspectRatio="xMidYMid meet" role="img" aria-label={product.koreanName}><defs><clipPath id={id}><rect x={x} y={y} width={width} height={height} /></clipPath></defs><image href={art.src} width={art.width} height={art.height} clipPath={`url(#${id})`} /></svg>
}
function GuideIcon({ type }) {
  return <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{type === 'temperature' ? <><path d="M34 44V17a8 8 0 0 1 16 0v27a17 17 0 1 1-16 0Z" /><path d="M42 26v31m16-3h8m-8 12h5" /><circle cx="42" cy="59" r="6" fill="currentColor" /></> : type === 'time' ? <><circle cx="40" cy="42" r="25" /><path d="M40 26v18l12 7M31 9h18m-9 0v8" /></> : <><path d="M16 30h43v20a18 18 0 0 1-18 18h-7a18 18 0 0 1-18-18ZM59 35h6a9 9 0 0 1 0 18h-6M28 8v14m12-14v14m12-14v14M10 73h57" /></>}</svg>
}
const ingredients = [['cheese', '크림치즈'], ['cream', '생크림'], ['egg', '달걀']]
const process = [
  ['prepare', '부드러운 치즈 반죽 준비', '크림치즈와 재료를 고르게 섞어 매끄럽고 부드러운 반죽을 준비합니다.'],
  ['bake', '진한 풍미를 위한 굽기', '반죽을 틀에 담고 높은 온도에서 구워 진한 갈색의 윗면을 완성합니다.'],
  ['finish', '촉촉한 치즈케이크 완성', '충분히 식혀 진한 풍미와 부드러운 치즈 속을 완성합니다.'],
]
const enjoyment = [
  ['time', '즐기는 시간', '냉장고에서 꺼내 잠시 두면 더욱 부드러운 치즈의 풍미를 즐길 수 있습니다.'],
  ['temperature', '권장 섭취 방법', '차갑게 즐기면 꾸덕한 식감을, 온도가 조금 올라가면 부드러운 식감을 느낄 수 있습니다.'],
  ['serving', '함께 즐기는 방법', '아메리카노나 따뜻한 차와 함께 즐기면 치즈의 진한 풍미가 더욱 돋보입니다.'],
]
const charms = [
  ['whole', 'heartRabbit', '진하게 구워낸 특별한 풍미', '바스크 치즈케이크 특유의 진한 윗면이 은은한 캐러멜 향과 깊은 풍미를 전합니다.'],
  ['delight', 'happyRabbit', '부드럽고 촉촉한 치즈의 매력', '한 입 베어 물면 부드러운 치즈 속이 입안 가득 퍼지며 진한 치즈의 맛을 느낄 수 있습니다.'],
  ['coffee', 'restRabbit', '나를 위한 달콤한 휴식', '좋아하는 음료와 함께 하루의 작은 여유를 즐겨보세요.'],
]
const storage = [
  ['temperature', '보관 온도', '냉장 보관을 권장합니다. 정확한 온도와 유통 조건은 상품 표시사항을 확인해 주세요.'],
  ['time', '보관 기간', '상품에 표시된 소비기한을 확인하고 기한 내 섭취해 주세요.'],
  ['serving', '맛있게 즐기기', '차갑게 먹으면 꾸덕한 식감을 즐길 수 있고, 잠시 실온에 두면 더욱 부드러운 풍미를 느낄 수 있습니다.'],
]
function GuideCards({ items }) {
  return <div className="catalog-story-three-cards">{items.map(([type, title, text]) => <div className="catalog-story-guide-card" key={title}><div className="catalog-story-guide-illustration"><GuideIcon type={type} /></div><h3>{title}</h3><p>{text}</p></div>)}</div>
}

export default function BasqueCheesecakeDetail({ product, products, renderPhoto }) {
  const [quantity, setQuantity] = useState(1), [notice, setNotice] = useState('')
  const favorites = useWishlist()
  useReviewUpdates()
  const reviews = getProductReviews(product.id)
  const favorite = favorites.some(item => item.id === product.id)
  const images = ['hero', 'whole', 'slice', 'texture', 'coffee'].map(name => ({ id: name, label: artwork[name][1], image: <BasqueArt name={name} /> }))
  const related = products.filter(item => item.category === 'cake' && item.id !== product.id).slice(0, 4)
  const toggle = () => { try { toggleWishlist(product) } catch { setNotice('찜 목록에 저장하지 못했습니다. 브라우저 저장 공간을 확인해 주세요.') } }
  return <div className="product-detail-page basque-detail-page" data-product-id={product.id} style={{ '--product-background': '#fff8ee' }}>
    <HomeHeader />
    <main className="product-detail-main catalog-product-main">
      <a className="product-detail-back" href="/menu">← 전체 메뉴</a>
      <ProductHero product={{ ...product, description: '진하게 구워낸 겉면과 부드럽고 꾸덕한 치즈의 풍미가 어우러진 케이크' }} price={product.price} images={images} quantity={quantity} onQuantityChange={setQuantity}
        onCart={() => setNotice(cartAddMessage(product, quantity, product.price))}
        onBuy={() => setNotice('주문·결제 서비스 연결 준비 중입니다. 주문은 생성되지 않았습니다.')}
        options={<button className="basque-favorite" type="button" onClick={toggle} aria-pressed={favorite}>{favorite ? '♥ 찜 해제' : '♡ 찜하기'}</button>}
        notice={notice} anchors={{ introduction: '#product-introduction', ingredients: '#product-ingredients', storage: '#product-storage', reviews: '#product-reviews', related: '#product-recommendations', shipping: '#product-shipping' }} />
      <div className="catalog-story-body basque-story-body">
        <section id="product-introduction" className="catalog-story-intro"><div><span className="catalog-story-wordmark" aria-hidden="true">Mellow<br />Bake ♡</span><h2>바스크 치즈 케이크,<br />한 입의 즐거움</h2><p>진하게 구워낸 윗면과 부드럽고 촉촉한 치즈 속이 어우러져 한 입마다 깊은 풍미를 전합니다.</p></div><div className="catalog-story-banner-photo"><BasqueArt name="slice" /></div></section>
        <section className="catalog-story-feature" aria-label="상품 특징"><div className="catalog-story-photo"><BasqueArt name="texture" /></div><div><Title number="01">바스크 치즈 케이크의<br />맛있는 순간</Title><p>노릇하게 구워진 윗면과 부드러운 치즈의 조화로 특별한 디저트 시간을 완성합니다.</p></div></section>
        <section className="catalog-story-panel catalog-story-materials"><BasqueArt name="chef" /><div><Title number="02">부드러운 풍미를<br />완성하는 재료</Title><p>진한 치즈의 풍미와 부드러운 식감을 만들어주는 재료를 소개합니다.</p></div><div className="catalog-story-small-ingredients">{ingredients.map(([art, label]) => <div key={art}><div className="basque-ingredient-frame"><BasqueArt name={art} /></div><h3>{label}</h3></div>)}</div><p className="basque-example-note">재료 및 제작 과정은 디자인용 예시입니다. 실제 상품의 원재료·함량·제조 기준은 확인 중입니다.</p></section>
        <section id="product-process" className="catalog-story-panel"><Title number="03">정성을 담는<br />제작 과정</Title><div className="catalog-story-three-cards">{process.map(([art, title, text], index) => <div className="catalog-story-guide-card" key={art}><div className="basque-process-frame"><BasqueArt name={art} /></div><h3><span className="basque-process-step">0{index + 1}</span> {title}</h3><p>{text}</p></div>)}</div><p className="basque-example-note">일반적인 제작 과정을 표현한 시연용 안내입니다.</p></section>
        <section id="product-enjoy" className="catalog-story-panel"><Title number="04">바스크 치즈 케이크,<br />더 맛있게 즐기는 방법</Title><GuideCards items={enjoyment} /><p className="basque-example-note">일반적인 섭취 제안이며 실제 상품의 보관·섭취 지침을 우선 확인해 주세요.</p></section>
        <section className="catalog-story-panel catalog-story-details" aria-label="바스크 치즈케이크의 매력"><Title number="05">바스크 치즈케이크의 매력</Title>{charms.map(([art, rabbit, title, text], index) => <div className={`catalog-story-detail-row${index % 2 ? ' catalog-story-detail-row--reverse' : ''}`} key={art}><div className="catalog-story-photo"><BasqueArt name={art} /></div><div className="basque-charm-copy"><h3>{title}</h3><p>{text}</p><BasqueArt name={rabbit} className="basque-charm-rabbit" /></div></div>)}</section>
        <section id="product-ingredients" className="catalog-story-panel catalog-story-ingredients"><Title number="06">바스크 치즈케이크에 담긴 재료</Title><p className="catalog-story-center-note">진한 치즈 풍미와 부드러운 식감을 완성하는 재료를 소개합니다.</p><div className="catalog-story-ingredient-grid">{ingredients.map(([art, label]) => <div key={art}><div className="basque-ingredient-frame"><BasqueArt name={art} /></div><h3>{label}</h3></div>)}</div><div className="catalog-story-allergens"><h3>원재료 및 알레르기 안내</h3><p><strong>원재료</strong> 전체 원재료·함량 확인 중</p><p><strong>알레르기</strong> 유발 성분과 교차 접촉 정보 확인 중</p><p><strong>영양정보</strong> 확인된 영양성분 자료 없음</p><small>위 일러스트의 크림치즈·생크림·달걀은 디자인용 예시입니다. 구매 전 실제 상품 표시사항을 확인해 주세요.</small></div></section>
        <section id="product-storage" className="catalog-story-panel catalog-story-storage"><h2>바스크 치즈 케이크, 더 맛있게 즐기는 방법</h2><p className="catalog-story-center-note">정확한 보관 온도와 소비기한은 상품별 확인이 필요합니다.</p><GuideCards items={storage} /></section>
        <section id="product-shipping" className="catalog-story-panel catalog-story-shipping"><h2>상품 정보 및 배송 안내</h2><p className="catalog-story-center-note">확인되지 않은 판매·배송 정책은 임의로 안내하지 않습니다.</p><dl>{[['상품명', product.koreanName], ['판매 가격', `${product.price.toLocaleString('ko-KR')}원`], ['판매 단위 / 중량', '확인 중'], ['소비기한', '상품 표시사항 확인 필요']].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><dl>{['배송 방법', '배송 일정', '배송비', '교환 / 환불'].map(label => <div key={label}><dt>{label}</dt><dd>운영 기준 확인 후 안내 예정</dd></div>)}</dl></section>
        <section id="product-reviews" className="catalog-story-reviews" aria-labelledby="basque-reviews-title"><div className="catalog-story-review-heading"><h2 id="basque-reviews-title"><a href={reviewsHref(product.id)}>✿ 상품 리뷰</a></h2><span>{reviews.length ? `등록된 리뷰 ${reviews.length}개` : '등록된 리뷰 없음'}</span></div><p className="basque-review-note">{reviews.length ? '이 상품에 등록된 공개 리뷰입니다.' : '아직 등록된 바스크 치즈케이크 리뷰가 없습니다. 리뷰가 등록되면 이곳에서 확인할 수 있습니다.'}</p><div className="catalog-story-review-grid">{Array.from({ length: 4 }, (_, index) => {
          const review = reviews[index]
          return review ? <a className="catalog-story-review-pending basque-review-card" href={reviewsHref(product.id)} key={review.id}><div className="basque-review-meta"><span className="basque-review-stars" aria-label={`${review.rating}점`}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span><small>{review.createdAt?.slice(0, 10)}</small></div><strong>{review.title || '상품 리뷰'}</strong><p>{review.body}</p><div className="basque-review-photo">{review.photos?.[0] ? <img src={review.photos[0]} alt="리뷰에 첨부된 사진" loading="lazy" /> : <BasqueArt name={['delight', 'texture', 'coffee', 'whole'][index]} />}</div>{!review.photos?.[0] && <small className="basque-review-image-note">상품 이미지</small>}</a> : <div className="catalog-story-review-pending basque-review-card is-empty" key={`empty-${index}`}><div className="basque-review-meta"><span className="basque-review-stars" aria-label="아직 평가 없음">☆☆☆☆☆</span><small>리뷰 대기</small></div><strong>첫 리뷰를 기다리고 있어요</strong><p>아직 등록된 리뷰가 없습니다.</p><div className="basque-review-photo"><BasqueArt name={['delight', 'texture', 'coffee', 'whole'][index]} /></div><small className="basque-review-image-note">상품 이미지 · 구매 후기 아님</small></div>
        })}</div></section>
        <section id="product-recommendations" className="catalog-story-related"><h2>함께 보면 좋은 상품</h2><div className="catalog-story-related-grid">{related.map(item => <a href={productHref(item.id)} key={item.id}><div className="catalog-story-related-photo"><RelatedPhoto product={item} fallback={renderPhoto} /></div><h3>{item.koreanName}</h3><p>{item.price.toLocaleString('ko-KR')}원</p></a>)}</div></section>
      </div>
    </main>
    <HomeFooter />
  </div>
}

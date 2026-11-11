import { useId, useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import ProductDetailFooter from '../components/ProductDetailFooter'
import ProductHero from '../components/ProductHero'
import { cartAddMessage, buyNow } from '../cartStore'
import { toggleWishlist, useWishlist } from '../wishlistStore'
import { getDisplayProductReviews, reviewsHref, useReviewUpdates } from '../reviewData'
import ReviewMedia from '../components/ReviewMedia'
import { productHref } from './productLinks'
import cakeArtwork from './cakeListArt.json'
import './BasqueCheesecakeDetail.css'

// Illustration-only regions of the supplied reference. All copy, controls and
// information tables below are HTML. The original PNG remains unchanged.
const artwork = {
  hero: ['115 0 650 600', '멜로우 토끼와 바스크 치즈케이크'],
  'gallery-1': ['10 51 90 90', '바스크 치즈케이크 전체 모습'],
  'gallery-2': ['10 153 90 90', '접시에 담긴 바스크 치즈케이크'],
  'gallery-3': ['10 255 90 90', '바스크 치즈케이크 단면'],
  'gallery-4': ['10 357 90 90', '베리와 함께 즐기는 바스크 치즈케이크'],
  'gallery-5': ['10 459 90 90', '유산지에 담긴 바스크 치즈케이크'],
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
// Art-only regions from the latest supplied full-page Figma reference.
const refreshedArtwork = {
  signature: ['220 288 155 78', '토끼와 바스크 치즈케이크 시그니처 연출'],
  texture: ['58 369 205 88', '바스크 치즈케이크의 겉면과 부드러운 단면'],
  chef: ['67 475 50 52', '빵을 든 멜로우 토끼'],
  cheese: ['212 470 48 40', '크림치즈'], egg: ['272 470 50 40', '달걀'], cream: ['329 470 54 40', '생크림'],
  prepare: ['152 567 71 57', '크림치즈 재료를 섞는 모습'], bake: ['229 567 72 57', '치즈 반죽을 틀에 담는 모습'], finish: ['305 567 73 57', '오븐에서 바스크 치즈케이크를 굽는 모습'],
  'enjoy-1': ['183 690 61 42', '차갑게 즐기는 바스크 치즈케이크'], 'enjoy-2': ['247 690 61 42', '커피와 함께 즐기는 바스크 치즈케이크'], 'enjoy-3': ['311 690 61 42', '과일과 함께 즐기는 바스크 치즈케이크'],
  whole: ['89 812 123 77', '유산지 위의 바스크 치즈케이크 한 조각'], delight: ['231 900 132 82', '바스크 치즈케이크 전체와 한 조각'], coffee: ['88 994 127 84', '접시에 담긴 바스크 치즈케이크와 베리'],
  'material-cheese': ['86 1144 58 65', '크림치즈 원재료 예시'], 'material-egg': ['159 1144 56 65', '달걀 원재료 예시'], 'material-cream': ['227 1144 62 65', '생크림 원재료 예시'], 'material-sugar': ['296 1144 56 65', '설탕 원재료 예시'],
}
function BasqueArt({ name, className = '' }) {
  const id = useId()
  const refreshed = Boolean(refreshedArtwork[name])
  const [box, label] = refreshedArtwork[name] || artwork[name]
  const [x, y, width, height] = box.split(' ').map(Number)
  // Exclude only the isolated decorative hearts, preserving the ingredients
  // and leaving the supplied PNG unchanged.
  const heartCutouts = {
    cheese: [[352, 649, 18, 32], [430, 649, 13, 35]],
    cream: [[534, 649, 13, 25]],
    egg: [[637, 649, 19, 24]],
  }[refreshed ? '' : name] || []
  const rectangle = ([left, top, w, h]) => `M${left} ${top}h${w}v${h}h${-w}Z`
  const completed = name === 'texture' && !refreshed
  const suppliedFrame = name === 'hero' || name.startsWith('gallery-')
  const artOutline = rectangle([x, y, width, height])
  const outline = [artOutline, ...heartCutouts.map(rectangle)].join(' ')
  return <div className={`basque-art basque-art--${name} ${className}`} data-source={refreshed ? 'basque-v2' : undefined} style={{ '--basque-art-ratio': `${width} / ${height}` }}><svg viewBox={box} preserveAspectRatio="xMidYMid meet" role="img" aria-label={label}><defs><clipPath id={id}><path d={outline} clipRule="evenodd" fillRule="evenodd" /></clipPath></defs><image href={refreshed ? '/images/바스크치즈.png' : completed ? '/images/basque-texture-completed.png' : suppliedFrame ? '/images/Frame 930.png' : '/images/바스크.png'} width={refreshed ? 444 : completed ? 1942 : suppliedFrame ? 1216 : 683} height={refreshed ? 2046.15441176471 : completed ? 809 : suppliedFrame ? 693 : 2049} clipPath={`url(#${id})`} /></svg></div>
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
const ingredients = [['cheese', '크림치즈'], ['egg', '신선한 달걀'], ['cream', '생크림']]
const process = [
  ['prepare', '부드러운 치즈의 풍미', '진한 치즈의 맛과 매끄러운 식감이 어우러지는 한 조각을 만나보세요.'],
  ['bake', '꾸덕한 한 입', '촉촉한 속살과 치즈의 풍미를 천천히 음미해 보세요.'],
  ['finish', '깊은 구움의 매력', '카라멜빛 겉면과 부드러운 속이 이루는 조화를 즐겨보세요.'],
]
const enjoyment = [
  ['time', '차갑게 즐기기', '차갑게 즐기면 꾸덕한 치즈의 식감을 느낄 수 있습니다.', 'enjoy-1'],
  ['temperature', '커피와 함께', '따뜻한 아메리카노와 함께 진한 치즈의 풍미를 즐겨보세요.', 'enjoy-2'],
  ['serving', '디저트로 즐기기', '취향에 맞는 과일을 곁들여 달콤한 한 조각을 즐겨보세요.', 'enjoy-3'],
]
const charms = [
  ['whole', 'heartRabbit', '진하게 구워낸 특별한 풍미', '바스크 치즈케이크 특유의 진한 윗면이 은은한 캐러멜 향과 깊은 풍미를 전합니다.'],
  ['delight', 'happyRabbit', '부드럽고 촉촉한 치즈의 매력', '한 입 베어 물면 부드러운 치즈 속이 입안 가득 퍼지며 진한 치즈의 맛을 느낄 수 있습니다.'],
  ['coffee', 'restRabbit', '나를 위한 달콤한 휴식', '좋아하는 음료와 함께 하루의 작은 여유를 즐겨보세요.'],
]
const storage = [
  ['temperature', '보관 온도', '상품에 표시된 보관 방법을 따라 신선하게 보관해 주세요.'],
  ['time', '보관 기간', '상품에 표시된 소비기한을 확인하고 기한 내 섭취해 주세요.'],
  ['serving', '맛있게 즐기기', '차갑게 먹으면 꾸덕한 식감을 즐길 수 있고, 잠시 실온에 두면 더욱 부드러운 풍미를 느낄 수 있습니다.'],
]
function GuideCards({ items }) {
  return <div className="catalog-story-three-cards">{items.map(([type, title, text, art]) => <div className="catalog-story-guide-card" key={title}><div className="catalog-story-guide-illustration">{art ? <BasqueArt name={art} /> : <GuideIcon type={type} />}</div><h3>{title}</h3><p>{text}</p></div>)}</div>
}

export default function BasqueCheesecakeDetail({ product, products, renderPhoto }) {
  const [quantity, setQuantity] = useState(1), [notice, setNotice] = useState('')
  const favorites = useWishlist()
  useReviewUpdates()
  const reviews = getDisplayProductReviews(product.id)
  const favorite = favorites.some(item => item.id === product.id)
  const images = ['hero', 'gallery-2', 'gallery-3', 'gallery-4', 'gallery-5'].map((name, index) => ({ id: name, label: artwork[name][1], image: <BasqueArt name={name} />, thumbnail: <BasqueArt name={`gallery-${index + 1}`} /> }))
  const related = products.filter(item => item.category === 'cake' && item.id !== product.id).slice(0, 4)
  const toggle = () => { try { toggleWishlist(product) } catch { setNotice('찜 목록에 저장하지 못했습니다. 브라우저 저장 공간을 확인해 주세요.') } }
  return <div className="product-detail-page basque-detail-page" data-product-id={product.id} style={{ '--product-background': '#fff8ee' }}>
    <HomeHeader />
    <main className="product-detail-main catalog-product-main">
      <a className="product-detail-back" href="/menu">← 전체 메뉴</a>
      <ProductHero product={product} price={product.price} images={images} quantity={quantity} onQuantityChange={setQuantity} containImages
        onCart={() => setNotice(cartAddMessage(product, quantity, product.price))}
        onBuy={() => setNotice(buyNow(product, quantity, product.price))}
        options={<button className="basque-favorite" type="button" onClick={toggle} aria-pressed={favorite}>{favorite ? '♥ 찜 해제' : '♡ 찜하기'}</button>}
        notice={notice} anchors={{ introduction: '#product-introduction', ingredients: '#product-ingredients', storage: '#product-storage', reviews: '#product-reviews', related: '#product-recommendations', shipping: '#product-shipping' }} />
      <div className="catalog-story-body basque-story-body">
        <section id="product-introduction" className="basque-supplied-introduction" aria-label="바스크 치즈케이크 소개"><img src="/images/주석 2026-11-11 114841.png" alt="멜로우베이크의 진한 달콤함, 바스크 치즈 케이크. 토끼 셰프와 바스크 치즈케이크를 담은 분홍색 소개 배너" /></section>
        <section className="catalog-story-feature" aria-label="상품 특징"><div className="catalog-story-photo"><BasqueArt name="texture" /></div><div><Title number="01">겉은 진하게,<br />속은 부드럽게</Title><p>노릇하게 구워진 윗면과 부드러운 치즈의 조화로 특별한 디저트 시간을 완성합니다.</p></div></section>
        <section className="catalog-story-panel catalog-story-materials"><BasqueArt name="chef" /><div><Title number="02">좋은 재료가 깊은<br />풍미를 만듭니다.</Title><p>진한 치즈의 풍미와 부드러운 식감을 만들어주는 재료를 소개합니다.</p></div><div className="catalog-story-small-ingredients">{ingredients.map(([art, label]) => <div key={art}><div className="basque-ingredient-frame"><BasqueArt name={art} /></div><h3>{label}</h3></div>)}</div></section>
        <section id="product-process" className="catalog-story-panel"><Title number="03">치즈 케이크의<br />맛있는 순간</Title><div className="catalog-story-three-cards">{process.map(([art, title, text]) => <div className="catalog-story-guide-card" key={art}><div className="basque-process-frame"><BasqueArt name={art} /></div><h3>{title}</h3><p>{text}</p></div>)}</div></section>
        <section id="product-enjoy" className="catalog-story-panel"><Title number="04">바스크 치즈 케이크,<br />더 맛있게 즐기는 방법</Title><GuideCards items={enjoyment} /></section>
        <section className="catalog-story-panel catalog-story-details" aria-label="바스크 치즈케이크의 매력"><Title number="05">바스크 치즈케이크의 매력</Title>{charms.map(([art, , title, text], index) => <div className={`catalog-story-detail-row${index % 2 ? ' catalog-story-detail-row--reverse' : ''}`} key={art}><div className="catalog-story-photo"><BasqueArt name={art} /></div><div className="basque-charm-copy"><h3>{title}</h3><p>{text}</p></div></div>)}</section>
        <section id="product-ingredients" className="catalog-story-panel catalog-story-ingredients"><Title number="06">바스크 치즈케이크에 담긴 재료</Title><p className="catalog-story-center-note">진한 치즈 풍미와 부드러운 식감을 완성하는 재료를 소개합니다.</p><div className="catalog-story-ingredient-grid">{[["material-cheese", "크림치즈"], ["material-egg", "신선한 달걀"], ["material-cream", "생크림"], ["material-sugar", "설탕"]].map(([art, label]) => <div key={art}><div className="basque-ingredient-frame"><BasqueArt name={art} /></div><h3>{label}</h3></div>)}</div><div className="catalog-story-allergens"><h3>원재료 및 알레르기 안내</h3><p><strong>원재료</strong> 원재료명과 함량은 상품 표시사항을 확인해 주세요.</p><p><strong>알레르기</strong> 알레르기가 있다면 구매 전 상품 표시사항을 확인해 주세요.</p><p><strong>영양정보</strong> 상품에 표시된 영양정보를 참고해 주세요.</p><small></small></div></section>
        <section id="product-storage" className="catalog-story-panel catalog-story-storage"><h2>바스크 치즈 케이크, 더 맛있게 즐기는 방법</h2><p className="catalog-story-center-note">신선한 맛을 위해 상품에 표시된 보관 안내를 따라 주세요.</p><GuideCards items={storage} /></section>
        <section id="product-shipping" className="catalog-story-panel catalog-story-shipping"><h2>상품 정보 및 배송 안내</h2><p className="catalog-story-center-note">배송 및 교환 관련 안내는 상품 문의를 이용해 주세요.</p><dl>{[['상품명', product.koreanName], ['판매 가격', `${product.price.toLocaleString('ko-KR')}원`], ['판매 단위 / 중량', '상품 구성을 참고해 주세요.'], ['소비기한', '상품에 표시된 소비기한을 확인해 주세요.']].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><dl>{['배송 방법', '배송 일정', '배송비', '교환 / 환불'].map(label => <div key={label}><dt>{label}</dt><dd>상품 문의로 안내받으실 수 있습니다.</dd></div>)}</dl></section>
        <section id="product-reviews" className="catalog-story-reviews" aria-labelledby="basque-reviews-title"><div className="catalog-story-review-heading"><h2 id="basque-reviews-title"><a href={reviewsHref(product.id)}>✿ 상품 리뷰</a></h2><span>{reviews.some(review=>review.isExample) ? `시연용 예시 리뷰 ${reviews.length}개` : reviews.length ? `등록된 리뷰 ${reviews.length}개` : '등록된 리뷰 없음'}</span></div><p className="basque-review-note">{reviews.some(review=>review.isExample) ? '화면 시연용 예시 리뷰입니다. 실제 구매 후기가 아닙니다.' : reviews.length ? '이 상품에 등록된 공개 리뷰입니다.' : '아직 등록된 바스크 치즈케이크 리뷰가 없습니다. 리뷰가 등록되면 이곳에서 확인할 수 있습니다.'}</p><div className="catalog-story-review-grid">{Array.from({ length: 4 }, (_, index) => {
          const review = reviews[index]
          return review ? <a className="catalog-story-review-pending basque-review-card" href={productHref(review.productId)} key={review.id} data-review-product={review.productId}><div className="basque-review-meta"><span className="basque-review-stars" aria-label={`${review.rating}점`}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span><small>{review.createdAt?.slice(0, 10)}</small></div><strong>{review.title || '상품 리뷰'}</strong><p>{review.body}</p><div className="basque-review-photo"><ReviewMedia review={review} /></div></a> : <div className="catalog-story-review-pending basque-review-card is-empty" key={`empty-${index}`}><div className="basque-review-meta"><span className="basque-review-stars" aria-label="아직 평가 없음">☆☆☆☆☆</span><small>리뷰 대기</small></div><strong>첫 리뷰를 기다리고 있어요</strong><p>아직 등록된 리뷰가 없습니다.</p><small className="basque-review-image-note">등록된 리뷰 사진 없음</small></div>
        })}</div></section>
        <section id="product-recommendations" className="catalog-story-related"><h2>함께 보면 좋은 상품</h2><div className="catalog-story-related-grid">{related.map(item => <a href={productHref(item.id)} key={item.id}><div className="catalog-story-related-photo"><RelatedPhoto product={item} fallback={renderPhoto} /></div><h3>{item.koreanName}</h3><p>{item.price.toLocaleString('ko-KR')}원</p></a>)}</div></section>
      </div>
    </main>
    <ProductDetailFooter />
  </div>
}

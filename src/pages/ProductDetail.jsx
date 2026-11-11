import { useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import ProductDetailFooter from '../components/ProductDetailFooter'
import { bestProducts } from '../components/BestMenu'
import { newMenuProducts } from '../components/NewMenu'
import { newArrivalProducts } from '../components/NewArrivals'
import { menuCategories, MenuProductImage } from './OurMenu'
import { withHomeCategoryProducts } from './homeCategoryProducts'
import { productSlug, productHref } from './productLinks'
import './ProductDetail.css'
import DetailProductGallery, { DetailQuickLinks } from '../components/DetailProductGallery'
import '../components/FrameProductHero.css'
import ProductHeaderTabs, { ProductHeaderRating } from '../components/ProductHeaderControls'
import '../components/SaltAlignedProductHero.css'
import ProductHero from '../components/ProductHero'
import { cartAddMessage, buyNow } from '../cartStore'
import ProductDetailBody from '../components/ProductDetailBody'
import BasqueCheesecakeDetail from './BasqueCheesecakeDetail'
import UnifiedProductDetail from '../components/UnifiedProductDetail'
import { registeredProducts } from '../productCatalog'

const photos = import.meta.glob('../assets/{best-menu,new-menu,new-arrivals}/*.png', { eager: true, query: '?url', import: 'default' })
const catalog = withHomeCategoryProducts(menuCategories).flatMap(category => category.products.map(product => ({ ...product, category: category.id })))
const homeProducts = [...bestProducts, ...newMenuProducts, ...newArrivalProducts].map(product => ({
  ...product,
  koreanName: product.koreanName || product.korean,
  category: /financier|scone|croissant/.test(product.id) ? 'bread' : 'cake',
}))
const pairings = { 'cake-1': 'strawberry-shortcake', 'cake-3': 'chocolate-cake', 'cake-4': 'matcha-cake', 'cake-5': 'tiramisu', 'cake-8': 'blueberry-cheesecake' }
const preservedSlugs = new Set(['cinnamon-roll', 'bulgogi-sandwich'])
const palettes = {
  bread: ['#fff0d5', '#f7e6cf', '#fce7d7', '#fff1c8'],
  sandwich: ['#eaf2da', '#fff1d9', '#e3f0e6', '#f4e6da'],
  cake: ['#ffe7ef', '#f6e6d5', '#eee0d7', '#e5eedb'],
  drink: ['#e5f3ed', '#f2e8d9', '#f9edd3', '#f8e4db'],
}

export function findDetailProduct(slug) {
  return catalog.find(product => productSlug(product.id) === slug)
    || homeProducts.find(product => productSlug(product.id) === slug)
}

function photoFor(product) {
  return Object.entries(photos).find(([path]) => path.split('/').at(-1) === `${product.id}.png`)?.[1]
}

function ProductPhoto({ product }) {
  const photo = photoFor(product)
  const number = Number(product.id.split('-').at(-1))
  const hasMenuPhoto = /^(bread|cake|sandwich|drink)-\d+$/.test(product.id) && (product.category === 'bread' || number <= 8)
  return photo ? <img src={photo} alt={product.koreanName} loading="lazy" />
    : hasMenuPhoto ? <MenuProductImage product={product} />
      : <div className="product-detail-photo-missing">{product.koreanName}<span>상품 사진 준비 중</span></div>
}

function DetailSections({ product, presentation }) {
  const ingredients = ['생딸기', '딸기', '우유', '생크림', '크림치즈', '치즈', '버터', '고구마', '팥앙금', '마늘', '초콜릿', '시나몬', '소시지', '햄', '달걀', '치킨', '베이컨', '불고기', '아보카도', '바질', '토마토', '양상추', '말차', '에스프레소', '마스카포네', '코코아', '당근', '호두', '블루베리', '바닐라', '카라멜', '레몬', '복숭아', '홍차', '아몬드', '올리브', '무화과', '감자', '로즈메리', '얼그레이', '사과', '참치', '옥수수', '오이', '버섯', '칠면조', '크랜베리', '새우', '양배추', '연어', '케이퍼', '로스트비프', '루콜라', '머스터드', '가지', '주키니', '모차렐라', '요거트', '흑임자', '망고', '코코넛', '피스타치오', '라즈베리', '꿀', '밤', '캐모마일', '자몽', '청귤', '히비스커스']
    .filter(ingredient => product.description.includes(ingredient))
    .filter((ingredient, index, all) => !all.some((other, otherIndex) => otherIndex !== index && other.length > ingredient.length && other.includes(ingredient)))
  const candidates = catalog.filter(item => productSlug(item.id) !== productSlug(product.id))
  const related = [...candidates.filter(item => item.category === product.category).slice(0, 2), ...candidates.filter(item => item.category !== product.category).slice(0, 2)]
  return <div className="product-detail-expanded">
    <nav className="product-detail-section-nav" aria-label="상품 상세 메뉴">
      <a href="#product-introduction">상품 소개</a><a href="#product-ingredients">재료</a><a href="#product-storage">보관 방법</a><a href="#product-reviews">리뷰</a><a href="#product-recommendations">추천 상품</a>
    </nav>
    <section id="product-introduction" className={`product-detail-story product-detail-story--${presentation}`} aria-labelledby="product-story-title">
      <div><span className="product-detail-eyebrow">MADE FOR YOUR SWEET MOMENT</span><h2 id="product-story-title">{product.koreanName}</h2><p>{product.description}</p></div>
      <div className="product-detail-intro-photo"><ProductPhoto product={product} /></div>
    </section>
    <section id="product-ingredients" className="product-detail-section" aria-labelledby="product-ingredients-title">
      <span className="product-detail-eyebrow">INGREDIENTS</span><h2 id="product-ingredients-title">맛을 채우는 재료</h2>
      {ingredients.length > 0 && <><p>상품 설명에 소개된 재료입니다.</p><ul className="product-detail-ingredients">{ingredients.map(ingredient => <li key={ingredient}><span aria-hidden="true">✦</span>{ingredient}</li>)}</ul></>}
      <p className="product-detail-pending">{ingredients.length ? '전체 원재료와 함량, 알레르기 정보는 확인 중입니다.' : '정확한 원재료와 함량, 알레르기 정보를 확인한 뒤 안내해 드릴게요.'}</p>
    </section>
    <section id="product-storage" className="product-detail-section product-detail-storage" aria-labelledby="product-storage-title">
      <span className="product-detail-eyebrow">KEEP IT DELICIOUS</span><h2 id="product-storage-title">맛있게 즐기고 보관하기</h2>
      <div className="product-detail-storage-grid"><div><h3>보관 방법</h3><p>권장 보관 온도와 개봉 후 보관 방법을 확인 중입니다.</p></div><div><h3>소비기한</h3><p>제조일 기준 소비기한과 개봉 후 섭취 기한을 확인 중입니다.</p></div><div><h3>즐기는 방법</h3><p>{product.category === 'drink' ? '음료별 권장 음용 시간과 보관 조건을 확인 중입니다.' : '상품별 권장 섭취 방법과 데우기 가능 여부를 확인 중입니다.'}</p></div></div>
    </section>
    <section id="product-reviews" className="product-detail-section" aria-labelledby="product-reviews-title">
      <span className="product-detail-eyebrow">YOUR SWEET MOMENTS</span><h2 id="product-reviews-title">상품 리뷰</h2>
      <div className="product-detail-review-empty"><span aria-hidden="true">♡</span><p>아직 제공된 구매 리뷰가 없습니다.</p><p>실제 구매 후기가 준비되면 이곳에서 만나보실 수 있어요.</p></div>
    </section>
    <section id="product-recommendations" className="product-detail-section" aria-labelledby="product-recommendations-title">
      <span className="product-detail-eyebrow">MORE TO LOVE</span><h2 id="product-recommendations-title">함께 보면 좋은 상품</h2>
      <div className="product-detail-related">{related.map(item => <a href={productHref(item.id)} className="product-detail-related-card" key={item.id}><div className="product-detail-related-photo"><ProductPhoto product={item} /></div><h3>{item.koreanName}</h3><p>{item.price.toLocaleString('ko-KR')}원</p></a>)}</div>
    </section>
  </div>
}

export default function ProductDetail({ slug }) {
  const base = findDetailProduct(slug)
  const best = base && homeProducts.find(product => product.id === pairings[base.id])
  const homeLabel = bestProducts.some(item => item.id === best?.id) ? 'BEST MENU' : 'NEW MENU'
  const [option, setOption] = useState(() => best && ['best', 'home'].includes(new URLSearchParams(window.location.search).get('option')) ? 'best' : 'menu')
  const [quantity, setQuantity] = useState(1)
  const [notice, setNotice] = useState('')
  const product = option === 'best' ? best : base
  const useFrame737 = base?.id !== 'bread-2'
  const useSaltAlignedHero = useFrame737
  const useNativeHero = useFrame737

  if (!product) return <div className="product-detail-page"><HomeHeader /><main className="product-detail-main"><h1>상품을 찾을 수 없습니다</h1><a href="/menu">전체 메뉴 보기</a></main><HomeFooter /></div>

  if (product.id === 'cake-2') return <BasqueCheesecakeDetail product={{ ...product, description: '진하게 구워낸 카라멜빛 겉면과 부드럽고 꾸덕한 치즈의 풍미가 어우러진 바스크 치즈케이크입니다. 한 입 가득 퍼지는 진한 치즈의 맛을 즐겨보세요.' }} products={catalog} renderPhoto={item => <ProductPhoto product={item} />} />

  const category = base.category || 'cake'
  const photoNumber = Number(product.id.split('-').at(-1))
  const hasGalleryPhoto = Boolean(photoFor(product)) || /^(bread|cake|sandwich|drink)-\d+$/.test(product.id) && (category === 'bread' || photoNumber <= 8)
  const galleryImages = hasGalleryPhoto ? [{ id: product.id, label: `${product.koreanName} 대표 이미지`, image: <ProductPhoto product={{ ...product, category }} /> }] : []
  const number = Number(base.id.split('-').at(-1)) || 1
  const price = typeof product.price === 'number' ? product.price : Number(product.price.replace(/\D/g, ''))
  const presentation = /cinnamon/i.test(product.name) ? 'spiral' : /sandwich|panini|bagel/i.test(product.name) ? 'layered' : /drink/.test(category) ? 'tall' : /tart|financier|scone/i.test(product.name) ? 'framed' : ['soft', 'layered', 'framed'][number % 3]
  const background = /matcha|pistachio|avocado|olive/i.test(product.name) ? '#e5eedb' : /chocolate/i.test(product.name) ? '#eee0d7' : /lemon|honey|caramel/i.test(product.name) ? '#fff1c8' : /blueberry|earl grey/i.test(product.name) ? '#ece5f5' : /strawberry|peach|raspberry/i.test(product.name) ? '#ffe7ef' : palettes[category][(number - 1) % 4]

  function selectOption(value) {
    setOption(value)
    setQuantity(1)
    setNotice('')
    const url = new URL(window.location.href)
    if (value === 'best') url.searchParams.set('option', 'best')
    else url.searchParams.delete('option')
    window.history.replaceState(null, '', url)
  }

  if (!['bread-1', 'bread-7', 'sandwich-5'].includes(product.id)) return <UnifiedProductDetail key={product.id} product={{ ...product, category }} products={registeredProducts.filter(item => !item.id.startsWith('new-'))}
    options={best && <label>판매 구성<select value={option} onChange={event => selectOption(event.target.value)}><option value="menu">전체 메뉴 · {base.name} · {base.price.toLocaleString('ko-KR')}원</option><option value="best">{homeLabel} · {best.name} · {best.price}</option></select></label>} />

  return <div className="product-detail-page" style={{ '--product-background': background }} data-product-id={product.id}>
    <HomeHeader />
    <main className={`product-detail-main${useNativeHero ? ' catalog-product-main' : ''}`}>
      <a className="product-detail-back" href="/menu">← 전체 메뉴</a>
      {useNativeHero ? <ProductHero key={product.id} product={product} price={price} images={galleryImages} emptyThumbnailSlots={product.id !== 'bread-4'}
        placeholder={<ProductPhoto product={{ ...product, category }} />}
        quantity={quantity} onQuantityChange={setQuantity}
        onCart={() => setNotice(cartAddMessage(product, quantity, price))}
        onBuy={() => setNotice(buyNow(product, quantity, price))}
        notice={notice}
        options={best && <label>판매 구성<select value={option} onChange={event => selectOption(event.target.value)}><option value="menu">전체 메뉴 · {base.name} · {base.price.toLocaleString('ko-KR')}원</option><option value="best">{homeLabel} · {best.name} · {best.price}</option></select></label>}
        anchors={{ introduction: '#product-introduction', ingredients: '#product-ingredients', storage: '#product-storage', reviews: '#product-reviews', related: '#product-recommendations', shipping: '#product-shipping' }}
      /> : <>
      <section className={`product-detail-hero reference-product-hero${useFrame737 ? ' frame737-hero' : ''}${useSaltAlignedHero ? ' salt-aligned-hero' : ''}`} aria-labelledby="product-detail-title">
        <DetailProductGallery key={product.id} images={useFrame737 ? galleryImages : undefined}><ProductPhoto product={{ ...product, category }} /></DetailProductGallery>
        <div className={`product-detail-summary${useFrame737 ? ' frame737-summary' : ''}`}>
          <h1 id="product-detail-title">{product.koreanName}</h1>
          <p className="product-detail-english">{product.name}</p>
          {useFrame737 && <ProductHeaderRating rating={product.rating} reviewCount={product.reviewCount} />}
          <p className="product-detail-price">{price.toLocaleString('ko-KR')}원</p>
          <p className="product-detail-description">{product.description}</p>
          {best && <label className="product-detail-option">판매 구성<select value={option} onChange={event => selectOption(event.target.value)}><option value="menu">전체 메뉴 · {base.name} · {base.price.toLocaleString('ko-KR')}원</option><option value="best">{homeLabel} · {best.name} · {best.price}</option></select></label>}
          <div className="product-detail-quantity" role="group" aria-label="상품 수량">
            <button type="button" aria-label={useFrame737 ? '수량 늘리기' : '수량 줄이기'} disabled={useFrame737 ? quantity >= 99 : quantity <= 1} onClick={() => setQuantity(value => value + (useFrame737 ? 1 : -1))}>{useFrame737 ? '+' : '−'}</button>
            <output aria-live="polite">{quantity}</output>
            <button type="button" aria-label={useFrame737 ? '수량 줄이기' : '수량 늘리기'} disabled={useFrame737 ? quantity <= 1 : quantity >= 99} onClick={() => setQuantity(value => value + (useFrame737 ? -1 : 1))}>{useFrame737 ? '−' : '+'}</button>
          </div>
          <p className="product-detail-total">합계 <strong>{(price * quantity).toLocaleString('ko-KR')}원</strong></p>
          <div className="reference-product-actions"><button className="product-detail-cart" type="button" onClick={() => setNotice(cartAddMessage(product, quantity, price))}>장바구니 담기</button><button type="button" onClick={() => setNotice(buyNow(product, quantity, price))}>바로 구매하기</button></div>
          <p className="product-detail-status" role="status">{notice}</p>
          <DetailQuickLinks links={[["#product-introduction", '상품 소개'], ["#product-storage", '보관 안내'], ["#product-recommendations", '추천 상품']]} />
        </div>
      </section>
      {useFrame737 && <ProductHeaderTabs introduction="#product-introduction" ingredients="#product-ingredients" reviews="#product-reviews" />}
      </>}
      {useNativeHero ? <ProductDetailBody product={{ ...product, category }} price={price} products={catalog} renderPhoto={item => <ProductPhoto product={item} />} /> : preservedSlugs.has(slug) ? <><section className={`product-detail-story product-detail-story--${presentation}`} aria-labelledby="product-story-title">
        <div><span className="product-detail-eyebrow">TASTE & INGREDIENTS</span><h2 id="product-story-title">{product.koreanName}의 맛과 재료</h2></div>
        <p>{product.description}</p>
      </section>
      <p className="product-detail-info">원재료 전체 목록·알레르기·보관 및 배송 정보는 확인 후 안내 예정입니다.</p></> : <DetailSections product={{ ...product, category }} presentation={presentation} />}
    </main>
    <ProductDetailFooter />
  </div>
}

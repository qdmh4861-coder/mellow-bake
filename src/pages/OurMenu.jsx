import { useState } from 'react'
import { productHref } from './productLinks'
import { withHomeCategoryProducts } from './homeCategoryProducts'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import WaveDivider from '../components/WaveDivider'
import CakeCornerArt from '../components/CakeCornerArt'
import drinkBackground from '../images/Rectangle.png'
import footerBackground from '../images/Rect.png'
import saltBreadReference from '../assets/salt-bread-figma-reference.png'
import './OurMenu.css'
import breadHeadingReference from '../assets/bread-heading-yellow.png'
import sandwichHeadingReference from '../assets/sandwich-heading-pink.png'
import cakeHeadingReference from '../assets/cake-heading-purple.png'
import cakeProductReference from '../assets/c81e80db-00ce-4cb3-a309-9221a0f0bbc1.png'
import cakeProductSecondReference from '../assets/a3605a6a-f29a-43f2-ad35-7661565ea5c8.png'
import drinkProductReference from '../assets/0c4e427e-ee24-42e9-ac97-e57f1daffef3.png'
import coffeeProductReference from '../assets/9554fa9b-6384-4282-9137-d7a00ec28266.png'
import sandwichProductReference from '../assets/9a3db27d-a0ab-4086-be3b-057fe2dfe1da.png'
import sandwichFirstProductReference from '../assets/9e5d1058-e683-49e6-96ba-6f4be964568c.png'
import breadProductReference from '../assets/f4aacce8-79fb-49cb-800b-ae084217a1b6.png'
import breadFirstProductReference from '../assets/cfa249a7-4834-421d-8ffe-13dbc8b41b7a.png'
import addedBreadProductReference from '../assets/04f5bf62-845e-4f31-ad7e-0df23a56ff88.png'
import addedBreadSecondReference from '../assets/bea4ff14-2af0-45c5-87a0-71cdbfb6115a.png'
import drinkHeadingReference from '../assets/ec7f3a07-853a-4023-bf53-ba35bc763b40.png'
import sandwichFlagOrnament from '../assets/sandwich-flag-ornament.png'
import breadLoafOrnament from '../assets/bread-loaf-ornament.png'
import homeBreadBackground from '../assets/home-bread-background-small-ornaments.png'
import homeCakeBackground from '../assets/home-cake-background-smaller-logo.png'
import homeSandwichBackground from '../assets/home-sandwich-background-spaced-ornaments.png'
import homeDrinkBackground from '../assets/home-drink-background-wheat-header.png'
import drinkBottomOrnaments from '../assets/a2356f3d-8e45-4be8-abe5-641e9afd1fe7.png'
import drinkSideOrnaments from '../assets/drink-side-ornaments-transparent.png'
import sandwichRabbitDrink from '../assets/sandwich-rabbit-drink-transparent.png'
import sandwichKitten from '../assets/sandwich-kitten-ornament.png'
import sandwichBottomOrnaments from '../assets/home-sandwich-background-wheat-header.png'
import cakeBottomOrnaments from '../assets/home-cake-background-wheat-header.png'

// Text and prices transcribed from the supplied Figma reference, not a live catalog.
// Set imageSrc to a public URL (for example /images/menu/salt-bread.png) when ready.
// Every listing uses the same product detail URL resolver.
const categoryData = [
  { id: 'bread', title: 'BREAD', description: '매일 갓 구워낸 신선하고 맛있는 빵', items: [
    ['Salt Bread', '소금빵', '바삭한 겉면과 촉촉한 속살, 고소한 버터와 은은한 소금의 조화', 3200],
    ['Mont Blanc Bread', '몽블랑', '겹겹이 쌓인 부드러운 페이스트리에 달콤한 버터 풍미를 더한 빵', 4800],
    ['Sweet Potato Cream Bread', '고구마 크림빵', '달콤한 고구마 크림이 가득 들어간 부드럽고 촉촉한 빵', 3200],
    ['Mammoth Bread', '맘모스빵', '고소한 소보로 빵 사이에 달콤한 크림과 팥앙금, 잼을 가득 채운 빵', 5500],
    ['Garlic Cream Cheese Bread', '육쪽 마늘빵', '진한 마늘버터 향과 부드러운 크림치즈가 어우러진 달콤짭짤한 빵', 4500],
    ['Pain au Chocolat', '뺑오쇼콜라', '바삭한 페이스트리 속에 진한 초콜릿을 넣어 구운 달콤한 빵', 4200],
    ['Cinnamon Roll', '시나몬롤', '향긋한 시나몬과 달콤한 아이싱이 어우러진 폭신한 롤빵', 4500],
    ['Sausage Bread', '소시지빵', '탱글한 소시지와 고소한 치즈, 부드러운 빵이 어우러진 든든한 간식', 3800],
  ] },
  { id: 'sandwich', title: 'SANDWICH', description: '신선한 재료로 만든 든든한 샌드위치', items: [
    ['Ham & Cheese Sandwich', '햄치즈 샌드위치', '풍부한 햄과 고소한 치즈, 신선한 채소가 어우러진 클래식 샌드위치', 5800],
    ['Egg Sandwich', '에그 샌드위치', '부드러운 달걀과 아삭한 채소가 조화로운 담백한 샌드위치', 5500],
    ['Chicken Sandwich', '치킨 샌드위치', '담백한 치킨과 신선한 채소를 듬뿍 담은 든든한 샌드위치', 6500],
    ['BLT Sandwich', 'BLT 샌드위치', '바삭한 베이컨과 신선한 토마토, 아삭한 양상추의 조화', 6800],
    ['Bulgogi Sandwich', '불고기 샌드위치', '달콤한 불고기와 신선한 채소가 가득한 샌드위치', 6500],
    ['Avocado Sandwich', '아보카도 샌드위치', '고소한 아보카도와 신선한 채소를 듬뿍 담은 샌드위치', 6800],
    ['Croissant Sandwich', '크루아상 샌드위치', '바삭한 크루아상에 신선한 재료를 더한 특별한 맛', 6800],
    ['Basil Tomato Sandwich', '바질 토마토 샌드위치', '향긋한 바질과 토마토의 상큼한 조화가 매력적인 샌드위치', 6500],
  ] },
  { id: 'cake', title: 'CAKE', description: '달콤한 순간을 더욱 특별하게 만드는 멜로우 베이크의 케이크', items: [
    ['Strawberry Fresh Cream Cake', '딸기 생크림 케이크', '신선한 생딸기와 부드러운 우유 생크림이 어우러진 달콤한 케이크', 32000],
    ['Basque Burnt Cheesecake', '바스크 치즈 케이크', '진하게 구운 겉면과 부드럽고 꾸덕한 치즈의 풍미가 어우러진 케이크', 29000],
    ['Chocolate Ganache Cake', '초콜릿 가나슈 케이크', '진한 초콜릿 시트에 부드러운 초콜릿 크림과 달콤한 가나슈를 더한 케이크', 34000],
    ['Matcha Cream Cake', '말차 크림 케이크', '진한 말차의 쌉싸름한 풍미와 부드러운 생크림이 조화롭게 어우러진 케이크', 33000],
    ['Tiramisu Cake', '티라미수 케이크', '향긋한 에스프레소와 부드러운 마스카포네 크림, 진한 코코아의 풍미가 어우러진 케이크', 34000],
    ['Red Velvet Cake', '레드벨벳 케이크', '촉촉한 레드벨벳 시트와 부드러운 크림치즈 프로스팅이 어우러진 달콤한 케이크', 35000],
    ['Carrot Cake', '당근 케이크', '촉촉한 당근 시트에 고소한 호두와 부드러운 크림치즈 프로스팅을 더한 케이크', 32000],
    ['Blueberry Cheesecake', '블루베리 치즈케이크', '진한 크림치즈의 부드러운 풍미에 상큼한 블루베리 콤포트를 더한 케이크', 33000],
  ] },
  { id: 'drink', title: 'DRINK', description: '달콤한 디저트와 함께 즐기는 멜로우 베이크의 특별한 음료', items: [
    ['Iced Americano', '아이스 아메리카노', '깊고 진한 에스프레소에 시원한 얼음을 더해 깔끔하게 즐기는 커피', 4500],
    ['Iced Cafe Latte', '아이스 카페라떼', '고소하고 부드러운 우유에 진한 에스프레소를 더한 시원한 라떼', 5000],
    ['Iced Vanilla Latte', '아이스 바닐라 라떼', '향긋한 바닐라 시럽과 고소한 우유, 진한 에스프레소가 어우러진 달콤한 라떼', 5500],
    ['Iced Caramel Macchiato', '아이스 카라멜 마키아토', '부드러운 우유와 진한 에스프레소에 달콤한 카라멜 소스를 더한 라떼', 5500],
    ['Strawberry Latte', '딸기 라떼', '상큼한 생딸기와 달콤한 딸기청에 부드러운 우유를 더한 달콤한 라떼', 5800],
    ['Iced Matcha Latte', '아이스 말차 라떼', '진한 말차의 쌉싸름한 풍미와 고소한 우유가 어우러진 시원한 라떼', 5500],
    ['Lemon Ade', '레몬 에이드', '상큼한 생레몬과 청량한 탄산이 어우러진 시원하고 산뜻한 에이드', 5800],
    ['Peach Iced Tea', '복숭아 아이스티', '달콤한 복숭아의 향긋한 풍미와 은은한 홍차의 맛이 어우러진 시원한 아이스티', 5000],
  ] },
]

export const menuCategories = categoryData.map(({ items, ...category }) => ({
  ...category,
  products: items.map(([name, koreanName, description, price], index) => ({
    id: `${category.id}-${index + 1}`, name, koreanName, description, price,
    imageSrc: null, detailHref: productHref(`${category.id}-${index + 1}`), isTemporary: false,
  })),
}))

const bannerImageSrc = null // Future banner image: /images/menu/our-menu-banner.png

// Visually matched to the reference; original image pixels are unavailable.
const bannerColor = '#ff535f'
const categoryColors = ['#ffe580', '#f9b6d0', '#d8bdf8', '#baf3dc']

function DrinkDecorations() {
  return <div className="our-menu-drink-artwork" aria-hidden="true">
    {['left', 'right'].map(side => <div className={`our-menu-drink-edge our-menu-drink-edge--${side}`} key={side}>
      {[['top', 0, 800, 729], ['bottom', 800, 616, 563]].map(([position, y, sourceHeight, displayHeight]) =>
        <svg key={position} className={`our-menu-drink-corner our-menu-drink-corner--${position}`}
          viewBox={`${side === 'right' ? 1143 : 0} ${y} 492 ${sourceHeight}`}
          style={{ aspectRatio: `492 / ${displayHeight}` }}
          preserveAspectRatio={`${side === 'right' ? 'xMax' : 'xMin'}${position === 'bottom' ? 'YMax' : 'YMin'} meet`}
          focusable="false">
          <image href={drinkBackground} width="1635" height="1416" />
        </svg>)}
    </div>)}
  </div>
}

function MenuFooterArtwork() {
  return <div className="our-menu-footer-artwork" aria-hidden="true">
    {['left', 'right'].map(side => <svg key={side}
      className={`our-menu-footer-edge our-menu-footer-edge--${side}`}
      viewBox={`${side === 'right' ? 1146 : 0} 0 490 628`}
      preserveAspectRatio={`${side === 'right' ? 'xMax' : 'xMin'}YMax meet`} focusable="false">
      <image href={footerBackground} width="1636" height="628" />
    </svg>)}
  </div>
}

function BreadRowDecorations() {
  return <div className="our-menu-bread-row-decorations" aria-hidden="true">
    <svg viewBox="0 1080 270 270" focusable="false">
      <image href="/images/menu/bread/bread-background.png" width="1635" height="1382" />
    </svg>
    <svg viewBox="235 145 75 75" focusable="false">
      <image href="/images/menu/bread/bread-background.png" width="1635" height="1382" />
    </svg>
    <svg viewBox="0 0 80 80" focusable="false">
      <path d="M39 7c1 20-8 26-25 33 18 3 24 12 26 31 5-22 12-27 28-32C49 34 45 23 39 7Z" fill="#fff8af" stroke="#fff" strokeWidth="4" />
    </svg>
  </div>
}

function CategoryWave({ fromColor, toColor }) {
  return <div className="our-menu-wave"><WaveDivider fromColor={fromColor} toColor={toColor} /></div>
}

// Preserve the four original corners while the plain center expands independently.
function BreadDecorations() {
  return <div className="our-menu-bread-artwork" aria-hidden="true">
    {['left', 'right'].map(side => <div className={`our-menu-bread-edge our-menu-bread-edge--${side}`} key={side}>
      {[['top', 0, 780], ['bottom', 780, 602]].map(([position, y, height]) =>
        <svg key={position} className={`our-menu-bread-corner our-menu-bread-corner--${position}`}
          viewBox={`${side === 'left' ? 0 : 1145} ${y} 490 ${height}`}
          style={{ aspectRatio: `490 / ${height}` }} preserveAspectRatio="xMidYMid meet" focusable="false">
          <image href="/images/menu/bread/bread-background.png" width="1635" height="1382" />
        </svg>)}
    </div>)}
    <img className="our-menu-bread-moved-loaf" src={breadLoafOrnament} alt="" />
  </div>
}

const sandwichBackgroundSrc = '/images/menu/sandwich/sandwich-background.png'

function SandwichDecorations() {
  return <div className="our-menu-sandwich-artwork" aria-hidden="true">
    {['left', 'right'].map(side => <div className={`our-menu-sandwich-edge our-menu-sandwich-edge--${side}`} key={side}>
      {[['top', 0, 729], ['bottom', 729, 563]].map(([position, y, height]) =>
        <svg key={position} className={`our-menu-sandwich-corner our-menu-sandwich-corner--${position}`}
          viewBox={`${side === 'left' ? 0 : 1149} ${y} 492 ${height}`}
          style={{ aspectRatio: `492 / ${height}` }} preserveAspectRatio="xMidYMid meet" focusable="false">
          <image href={sandwichBackgroundSrc} width="1641" height="1292" />
        </svg>)}
    </div>)}
    <img className="our-menu-sandwich-flag" src={sandwichFlagOrnament} alt="" />
  </div>
}

function CakeDecorations() {
  return <div className="our-menu-cake-artwork" aria-hidden="true">
    {['left', 'right'].map(side => <div className={'our-menu-cake-edge our-menu-cake-edge--' + side} key={side}>
      {['top', 'bottom'].map(position => <CakeCornerArt key={position} side={side} position={position} />)}
    </div>)}
  </div>
}

// The supplied artwork includes the red background and all decorations, but no text.
function BannerDecorations() {
  return <div className="our-menu-banner-artwork" aria-hidden="true">
    <img className="our-menu-banner-composition" src="/images/Rectangle%20289.png" alt="" decoding="async" fetchPriority="high" />
  </div>
}

function ImagePlaceholder({ banner = false }) {
  return <div className={`our-menu-placeholder${banner ? ' our-menu-placeholder--banner' : ''}`}>
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="6" y="8" width="36" height="32" rx="6" /><circle cx="18" cy="19" r="4" /><path d="m7 35 11-11 9 9 6-6 8 8" /></svg>
    <span>{banner ? '배너 이미지 준비 중' : '상품 이미지 준비 중'}</span>
  </div>
}

function MenuImage({ src, alt, banner = false }) {
  const [failedSrc, setFailedSrc] = useState(null)
  return <div className={banner ? 'our-menu-banner-media' : 'our-menu-product-media'}>
    {src && failedSrc !== src ? <img src={src} alt={alt} loading={banner ? 'eager' : 'lazy'} onError={() => setFailedSrc(src)} /> : <ImagePlaceholder banner={banner} />}
  </div>
}

export function MenuProductImage({ product }) {
  const cakePhotoX = { 'cake-1': 50, 'cake-2': 515, 'cake-3': 985, 'cake-4': 1455 }[product.id]
  const secondCakePhotoX = { 'cake-5': 114, 'cake-6': 545, 'cake-7': 972, 'cake-8': 1406 }[product.id]
  const drinkPhotoX = { 'drink-5': 55, 'drink-6': 499, 'drink-7': 943, 'drink-8': 1391 }[product.id]
  const coffeePhotoX = { 'drink-1': 114, 'drink-2': 573, 'drink-3': 1032, 'drink-4': 1494 }[product.id]
  const sandwichPhotoX = { 'sandwich-5': 102, 'sandwich-6': 500, 'sandwich-7': 898, 'sandwich-8': 1296 }[product.id]
  const firstSandwichPhotoX = { 'sandwich-1': 54, 'sandwich-2': 523, 'sandwich-3': 993, 'sandwich-4': 1463 }[product.id]
  const breadPhotoX = { 'bread-5': 41, 'bread-6': 488, 'bread-7': 932, 'bread-8': 1375 }[product.id]
  const firstBreadPhotoX = { 'bread-1': 31, 'bread-2': 510, 'bread-3': 987, 'bread-4': 1468 }[product.id]
  const addedBreadPhotoX = { 'bread-9': 33, 'bread-10': 512, 'bread-11': 991, 'bread-12': 1470 }[product.id]
  const addedBreadSecondPhotoX = { 'bread-13': 30, 'bread-14': 510, 'bread-15': 990, 'bread-16': 1472 }[product.id]
  return <>
    {addedBreadSecondPhotoX !== undefined
      ? <div className="our-menu-product-media"><svg viewBox={`${addedBreadSecondPhotoX} 24 462 406`} role="img" aria-label={product.koreanName} style={{ display: 'block', width: '100%', height: '100%' }}><image href={addedBreadSecondReference} width="1957" height="804" /></svg></div>
      : addedBreadPhotoX !== undefined
      ? <div className="our-menu-product-media"><svg viewBox={`${addedBreadPhotoX} 26 461 407`} role="img" aria-label={product.koreanName} style={{ display: 'block', width: '100%', height: '100%' }}><image href={addedBreadProductReference} width="1957" height="804" /></svg></div>
      : firstBreadPhotoX !== undefined
      ? <div className="our-menu-product-media"><svg viewBox={`${firstBreadPhotoX} 36 469 406`} role="img" aria-label={product.koreanName} style={{ display: 'block', width: '100%', height: '100%' }}><image href={breadFirstProductReference} width="1956" height="804" /></svg></div>
      : breadPhotoX !== undefined
      ? <div className="our-menu-product-media"><svg viewBox={`${breadPhotoX} 66 430 391`} role="img" aria-label={product.koreanName} style={{ display: 'block', width: '100%', height: '100%' }}><image href={breadProductReference} width="1848" height="851" /></svg></div>
      : firstSandwichPhotoX !== undefined
      ? <div className="our-menu-product-media"><svg viewBox={`${firstSandwichPhotoX} 24 446 400`} role="img" aria-label={product.koreanName} style={{ display: 'block', width: '100%', height: '100%' }}><image href={sandwichFirstProductReference} width="1960" height="802" /></svg></div>
      : sandwichPhotoX !== undefined
      ? <div className="our-menu-product-media"><svg viewBox={`${sandwichPhotoX} 70 380 352`} role="img" aria-label={product.koreanName} style={{ display: 'block', width: '100%', height: '100%' }}><image href={sandwichProductReference} width="1794" height="877" /></svg></div>
      : coffeePhotoX !== undefined
      ? <div className="our-menu-product-media"><svg viewBox={`${coffeePhotoX} 27 435 407`} role="img" aria-label={product.koreanName} style={{ display: 'block', width: '100%', height: '100%' }}><image href={coffeeProductReference} width="1991" height="790" /></svg></div>
      : drinkPhotoX !== undefined
      ? <div className="our-menu-product-media"><svg viewBox={`${drinkPhotoX} 41 418 414`} role="img" aria-label={product.koreanName} style={{ display: 'block', width: '100%', height: '100%' }}><image href={drinkProductReference} width="1858" height="846" /></svg></div>
      : secondCakePhotoX !== undefined
      ? <div className="our-menu-product-media"><svg viewBox={`${secondCakePhotoX} 45 407 391`} role="img" aria-label={product.koreanName} style={{ display: 'block', width: '100%', height: '100%' }}><image href={cakeProductSecondReference} width="1883" height="835" /></svg></div>
      : cakePhotoX !== undefined
      ? <div className="our-menu-product-media"><svg viewBox={`${cakePhotoX} 55 435 396`} role="img" aria-label={product.koreanName} style={{ display: 'block', width: '100%', height: '100%' }}><image href={cakeProductReference} width="1938" height="812" /></svg></div>
      : product.id === 'bread-1' ? <div className="our-menu-product-media"><svg viewBox="315 286 650 610" role="img" aria-label="소금빵" style={{ display:'block', width:'100%', height:'100%' }}><image href={saltBreadReference} width="1632" height="7491" /></svg></div> : <MenuImage src={product.imageSrc} alt={product.koreanName} />}
  </>
}

function ProductCard({ product, detailHref = product.detailHref }) {
  const content = <>
    <MenuProductImage product={product} />
    <div className="our-menu-product-copy">
      {product.isTemporary && <span className="our-menu-temporary">임시 상품 정보</span>}
      <h3>{product.name}</h3>
      <p className="our-menu-korean">{product.koreanName}</p>
      <p className="our-menu-description">{product.description || '상품 설명 준비 중 (임시 데이터)'}</p>
      <p className="our-menu-price">{product.price == null ? '가격 준비 중' : `${product.price.toLocaleString('ko-KR')}원`}</p>
    </div>
  </>
  return <article className="our-menu-product" data-product-id={product.id}>
    {detailHref ? <a className="our-menu-product-link" href={detailHref}>{content}</a> : content}
  </article>
}

export default function OurMenu({ categoryId: routeCategoryId } = {}) {
  const categoryId = routeCategoryId ?? new URLSearchParams(window.location.search).get('category')
  const listingCategories = routeCategoryId ? withHomeCategoryProducts(menuCategories) : menuCategories
  const visibleCategories = listingCategories.filter(category => !listingCategories.some(item => item.id === categoryId) || category.id === categoryId)
  const firstCategoryColor = categoryColors[listingCategories.indexOf(visibleCategories[0])]
  const lastCategory = visibleCategories[visibleCategories.length - 1]
  const listingColor = category => routeCategoryId && category.id === 'bread' ? '#fff0bc' : routeCategoryId && category.id === 'cake' ? '#f2e5fc' : routeCategoryId && category.id === 'sandwich' ? '#ffe2ee' : routeCategoryId && category.id === 'drink' ? '#d9faf1' : categoryColors[listingCategories.indexOf(category)]
  const lastCategoryColor = listingColor(lastCategory)
  return <div className="our-menu-page">
    <HomeHeader />
    <main>
      {!routeCategoryId && <img
        src="/images/b888723f-55a6-4898-b26b-db7c2f6c2b0f.png"
        alt="MELLOW BAKE Our Menu — 매일의 달콤한 순간을 함께하는 멜로우 베이크"
        width="1916" height="697"
        style={{ width: '100%', height: 'auto' }}
        fetchPriority="high"
      />}
      <div className="our-menu-categories">
        {visibleCategories.map((category, index) => <section className={`our-menu-category${routeCategoryId && category.id === 'bread' ? ' our-menu-home-bread-list' : routeCategoryId && category.id === 'cake' ? ' our-menu-home-cake-list' : routeCategoryId && category.id === 'sandwich' ? ' our-menu-home-sandwich-list' : routeCategoryId && category.id === 'drink' ? ' our-menu-home-drink-list' : ''}`} style={{ backgroundColor: listingColor(category), ...(routeCategoryId && category.id === 'bread' ? { '--home-bread-background': `url("${homeBreadBackground}")` } : routeCategoryId && category.id === 'cake' ? { '--home-cake-background': `url("${homeCakeBackground}")` } : routeCategoryId && category.id === 'sandwich' ? { '--home-sandwich-background': `url("${homeSandwichBackground}")` } : routeCategoryId && category.id === 'drink' ? { '--home-drink-background': `url("${homeDrinkBackground}")` } : {}) }} key={category.id} id={`menu-${category.id}`} aria-labelledby={`menu-${category.id}-title`}>
          {index > 0 && <CategoryWave fromColor={listingColor(visibleCategories[index - 1])} toColor={listingColor(category)} />}
          {category.id === 'bread' ? (routeCategoryId ? null : <BreadDecorations />)
            : category.id === 'sandwich' ? (routeCategoryId ? null : <SandwichDecorations />)
            : category.id === 'cake' ? (routeCategoryId ? null : <CakeDecorations />)
            : (routeCategoryId ? null : <DrinkDecorations />)}
          <div className="our-menu-category-inner">
          {category.id === 'bread'
            ? <div className="our-menu-bread-heading"><h2 id="menu-bread-title"><img src={breadHeadingReference} width="2206" height="713" alt="BREAD — 매일 갓 구워낸 신선하고 맛있는 빵" /></h2></div>
            : category.id === 'sandwich'
              ? <div className="our-menu-sandwich-heading"><h2 id="menu-sandwich-title"><img src={sandwichHeadingReference} width="1908" height="824" alt="SANDWICH — 신선한 재료로 만든 든든한 샌드위치" /></h2></div>
              : category.id === 'cake'
                ? <div className="our-menu-cake-heading"><h2 id="menu-cake-title"><img src={cakeHeadingReference} width="2172" height="724" alt="CAKE — 달콤한 순간을 더욱 특별하게 만드는 멜로우 베이크의 케이크" /></h2></div>
                : category.id === 'drink'
                  ? <div className="our-menu-drink-heading"><h2 id="menu-drink-title"><img src={drinkHeadingReference} width="1997" height="788" alt="DRINK — 달콤한 디저트와 함께 즐기는 멜로우 베이크의 특별한 음료" /></h2></div>
                  : <div className="our-menu-category-heading"><h2 id={`menu-${category.id}-title`}>{category.title}</h2><p>{category.description}</p></div>}
          <div className="our-menu-grid">
            {category.products.map(product => <ProductCard key={product.id} product={product} detailHref={!routeCategoryId && product.id === 'bread-2' ? '/menu/mont-blanc' : product.detailHref} />)}
            {category.id === 'bread' && <BreadRowDecorations />}
          </div>
          </div>
          {routeCategoryId && category.id === 'drink' && <div className="our-menu-drink-extra-ornaments" aria-hidden="true">
            {[['lemon', '130 55 380 535'], ['coffee', '750 50 370 540'], ['berry', '120 680 410 510']].map(([name, viewBox]) => <svg key={name} className={`drink-extra-ornament drink-extra-ornament--${name}`} viewBox={viewBox}><image href={drinkSideOrnaments} width="1254" height="1254" /></svg>)}
          </div>}
          {routeCategoryId && category.id === 'drink' && <div className="our-menu-drink-bottom-ornaments" aria-hidden="true">
            <svg className="our-menu-drink-bottom-ornament our-menu-drink-bottom-ornament--left" viewBox="0 980 360 480"><image href={drinkBottomOrnaments} width="1024" height="1536" /></svg>
            <svg className="our-menu-drink-bottom-ornament our-menu-drink-bottom-ornament--right" viewBox="735 1000 289 470"><image href={drinkBottomOrnaments} width="1024" height="1536" /></svg>
          </div>}
          {routeCategoryId && category.id === 'sandwich' && <div className="our-menu-sandwich-extra-ornaments" aria-hidden="true">
            <svg className="sandwich-extra-ornament sandwich-extra-ornament--bear" viewBox="790 770 230 190"><image href={sandwichBottomOrnaments} width="1024" height="1536" /></svg>
            <svg className="sandwich-extra-ornament sandwich-extra-ornament--rabbit" viewBox="65 55 755 785"><image href={sandwichKitten} width="1774" height="887" /></svg>
            <svg className="sandwich-extra-ornament sandwich-extra-ornament--drink" viewBox="1100 95 460 710"><image href={sandwichRabbitDrink} width="1774" height="887" /></svg>
          </div>}
          {routeCategoryId && category.id === 'sandwich' && <div className="our-menu-sandwich-bottom-ornaments" aria-hidden="true">
            <svg className="our-menu-sandwich-bottom-ornament our-menu-sandwich-bottom-ornament--left" viewBox="0 1150 380 300"><image href={sandwichBottomOrnaments} width="1024" height="1536" /></svg>
            <svg className="our-menu-sandwich-bottom-ornament our-menu-sandwich-bottom-ornament--right" viewBox="580 1200 444 270"><image href={sandwichBottomOrnaments} width="1024" height="1536" /></svg>
          </div>}
          {routeCategoryId && category.id === 'cake' && <div className="our-menu-cake-bottom-ornaments" aria-hidden="true">
            <svg className="our-menu-cake-bottom-ornament our-menu-cake-bottom-ornament--left" viewBox="15 1090 175 235"><image href={cakeBottomOrnaments} width="1024" height="1536" /></svg>
            <svg className="our-menu-cake-bottom-ornament our-menu-cake-bottom-ornament--right" viewBox="775 1120 235 215"><image href={cakeBottomOrnaments} width="1024" height="1536" /></svg>
          </div>}
        </section>)}
      </div>
      <CategoryWave fromColor={lastCategoryColor} toColor="#604236" />
    </main>
    <div className="our-menu-footer">
      <HomeFooter artwork={<MenuFooterArtwork />} />
    </div>
  </div>
}

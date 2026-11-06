import { useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import WaveDivider from '../components/WaveDivider'
import CakeCornerArt from '../components/CakeCornerArt'
import drinkBackground from '../images/Rectangle.png'
import footerBackground from '../images/Rect.png'
import './OurMenu.css'

// Text and prices transcribed from the supplied Figma reference, not a live catalog.
// Set imageSrc to a public URL (for example /images/menu/salt-bread.png) when ready.
// detailHref remains null until product detail navigation is implemented.
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
    imageSrc: null, detailHref: null, isTemporary: false,
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

function ProductCard({ product }) {
  const content = <>
    <MenuImage src={product.imageSrc} alt={product.koreanName} />
    <div className="our-menu-product-copy">
      {product.isTemporary && <span className="our-menu-temporary">임시 상품 정보</span>}
      <h3>{product.name}</h3>
      <p className="our-menu-korean">{product.koreanName}</p>
      <p className="our-menu-description">{product.description || '상품 설명 준비 중 (임시 데이터)'}</p>
      <p className="our-menu-price">{product.price == null ? '가격 준비 중' : `${product.price.toLocaleString('ko-KR')}원`}</p>
    </div>
  </>
  return <article className="our-menu-product" data-product-id={product.id}>
    {product.detailHref ? <a className="our-menu-product-link" href={product.detailHref}>{content}</a> : content}
  </article>
}

export default function OurMenu() {
  return <div className="our-menu-page">
    <HomeHeader />
    <main>
      <div className="our-menu-banner-section">
      <BannerDecorations />
      <section className="our-menu-banner" aria-labelledby="our-menu-title">
        {bannerImageSrc && <MenuImage src={bannerImageSrc} alt="멜로우 베이크의 디저트" banner />}
        <div className="our-menu-banner-copy"><h1 id="our-menu-title">OUR MENU</h1><p>매일의 달콤한 순간을 함께하는 멜로우 베이크</p></div>
      </section>
      <div className="our-menu-wave our-menu-banner-wave">
        <WaveDivider fromColor={bannerColor} toColor={categoryColors[0]} fillUpperBackground={false} />
      </div>
      </div>
      <div className="our-menu-categories">
        {menuCategories.map((category, index) => <section className="our-menu-category" style={{ backgroundColor: categoryColors[index] }} key={category.id} id={`menu-${category.id}`} aria-labelledby={`menu-${category.id}-title`}>
          {index > 0 && <CategoryWave fromColor={categoryColors[index - 1]} toColor={categoryColors[index]} />}
          {category.id === 'bread' ? <BreadDecorations />
            : category.id === 'sandwich' ? <SandwichDecorations />
            : category.id === 'cake' ? <CakeDecorations />
            : <DrinkDecorations />}
          <div className="our-menu-category-inner">
          <div className="our-menu-category-heading"><h2 id={`menu-${category.id}-title`}>{category.title}</h2><p>{category.description}</p></div>
          <div className="our-menu-grid">
            {category.products.map(product => <ProductCard key={product.id} product={product} />)}
            {category.id === 'bread' && <BreadRowDecorations />}
          </div>
          </div>
        </section>)}
      </div>
      <CategoryWave fromColor={categoryColors[3]} toColor="#604236" />
    </main>
    <div className="our-menu-footer">
      <HomeFooter artwork={<MenuFooterArtwork />} />
    </div>
  </div>
}

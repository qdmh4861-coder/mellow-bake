import { useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import ProductHero from '../components/ProductHero'
import { cartAddMessage } from '../cartStore'
import ProductDetailBody from '../components/ProductDetailBody'
import { menuCategories, MenuProductImage } from './OurMenu'
import './SweetPotatoDetail.css'

const catalog = menuCategories.flatMap(category => category.products.map(item => ({ ...item, category: category.id })))
const product = catalog.find(item => item.id === 'bread-3')

function EmptyProductImage({ label = '고구마 크림빵 이미지 준비 중' }) {
  return <div className="sweet-image-placeholder" role="img" aria-label={label} />
}

const images = Array.from({ length: 5 }, (_, index) => ({
  id: `sweet-placeholder-${index + 1}`,
  label: `고구마 크림빵 이미지 ${index + 1} 준비 중`,
  image: <EmptyProductImage label={`고구마 크림빵 이미지 ${index + 1} 준비 중`} />,
}))

function renderPhoto(item) {
  return item.id === product.id ? <EmptyProductImage /> : <MenuProductImage product={item} />
}

export default function SweetPotatoDetail() {
  const [quantity, setQuantity] = useState(1)
  const [notice, setNotice] = useState('')
  return <div className="sweet-potato-detail-page">
    <HomeHeader />
    <main className="sweet-potato-detail-main">
      <div className="sweet-potato-detail-breadcrumb"><a href="/menu">OUR MENU</a><span aria-hidden="true">/</span><span>{product.koreanName}</span></div>
      <ProductHero product={product} price={product.price} images={images}
        quantity={quantity} onQuantityChange={setQuantity}
        onCart={() => setNotice(cartAddMessage(product, quantity))}
        onBuy={() => setNotice('주문·결제 서비스 연결 준비 중입니다. 주문은 생성되지 않았습니다.')}
        notice={notice}
        anchors={{ introduction: '#product-introduction', ingredients: '#product-ingredients', storage: '#product-storage', reviews: '#product-reviews', related: '#product-recommendations', shipping: '#product-shipping' }}
      />
      <ProductDetailBody product={product} price={product.price} products={catalog} renderPhoto={renderPhoto} />
    </main>
    <HomeFooter />
  </div>
}

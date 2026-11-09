import { useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import ProductHero from '../components/ProductHero'
import { cartAddMessage } from '../cartStore'
import ProductDetailBody from '../components/ProductDetailBody'
import { menuCategories, MenuProductImage } from './OurMenu'
import montBlancReference from '../assets/cfa249a7-4834-421d-8ffe-13dbc8b41b7a.png'
import './MontBlancDetail.css'

const catalog = menuCategories.flatMap(category => category.products.map(item => ({ ...item, category: category.id })))
const product = catalog.find(item => item.id === 'bread-2')

function MontBlancPhoto() {
  return <div className="mb-montblanc-photo"><svg viewBox="510 36 469 406" preserveAspectRatio="xMidYMid slice" role="img" aria-label="몽블랑 대표 이미지"><image href={montBlancReference} width="1956" height="804" /></svg></div>
}

function renderPhoto(item) {
  return item.id === product.id ? <MontBlancPhoto /> : <MenuProductImage product={item} />
}

const images = [{ id: product.id, label: '몽블랑 대표 이미지', image: <MontBlancPhoto /> }]

export default function MontBlancDetail() {
  const [quantity, setQuantity] = useState(1)
  const [notice, setNotice] = useState('')
  return <div className="mb-page">
    <HomeHeader />
    <main className="mb-main">
      <div className="mb-breadcrumb"><a href="/menu">OUR MENU</a><span aria-hidden="true">/</span><span>{product.koreanName}</span></div>
      <ProductHero product={product} price={product.price} images={images}
        quantity={quantity} onQuantityChange={setQuantity}
        onCart={() => setNotice(cartAddMessage(product, quantity))}
        onBuy={() => setNotice('주문·결제 서비스 연결 준비 중입니다. 주문은 생성되지 않았습니다.')}
        notice={notice}
        anchors={{ introduction: '#product-introduction', ingredients: '#product-ingredients', storage: '#product-storage', reviews: '#product-reviews', related: '#product-recommendations', shipping: '#product-shipping' }}
      />
      <ProductDetailBody product={product} price={product.price} products={catalog} renderPhoto={renderPhoto} />
      <a className="mb-back" href="/menu">← MENU 목록으로 돌아가기</a>
    </main>
    <HomeFooter />
  </div>
}

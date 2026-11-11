import UnifiedProductDetail from '../components/UnifiedProductDetail'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import { registeredProducts } from '../productCatalog'
export default function NewMenuDetail({ id }) {
  const products = registeredProducts.filter(item => item.id.startsWith('new-'))
  const product = products.find(item => item.id === id)
  return product ? <UnifiedProductDetail product={product} products={products} /> : <><HomeHeader /><main><h1>상품을 찾을 수 없습니다</h1><a href="/new-menu">NEW MENU</a></main><HomeFooter /></>
}
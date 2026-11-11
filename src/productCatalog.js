import { menuCategories } from './pages/OurMenu'
import { withHomeCategoryProducts } from './pages/homeCategoryProducts'
import { bestProducts } from './components/BestMenu'
import { newMenuProducts } from './components/NewMenu'
import { newArrivalProducts } from './components/NewArrivals'
import { seasonalProducts } from './newMenuCatalog'
import { productHref } from './pages/productLinks'

const categoryProducts = withHomeCategoryProducts(menuCategories).flatMap(category => category.products.map(product => ({ ...product, category: category.id, registeredIn: 'MENU / HOME 카테고리' })))
const homeProducts = [...bestProducts, ...newMenuProducts, ...newArrivalProducts].map(product => ({ ...product, koreanName: product.koreanName || product.korean, category: /financier|scone|croissant/.test(product.id) ? 'bread' : 'cake', registeredIn: 'HOME BEST / NEW MENU / NEW ARRIVALS' }))
export const registeredProducts = [...new Map([...categoryProducts, ...homeProducts, ...seasonalProducts.map(product => ({ ...product, registeredIn: 'NEW MENU 전용' }))].map(product => [product.id, { ...product,
  description: product.id === 'cake-2' ? '진하게 구워낸 카라멜빛 겉면과 부드럽고 꾸덕한 치즈의 풍미가 어우러진 바스크 치즈케이크입니다. 한 입 가득 퍼지는 진한 치즈의 맛을 즐겨보세요.' : product.description,
  price: typeof product.price === 'number' ? product.price : Number(product.price.replace(/\D/g, '')), detailHref: product.detailHref || productHref(product.id) }])).values()]

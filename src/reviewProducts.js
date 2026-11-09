import { menuCategories } from './pages/OurMenu'
import { withHomeCategoryProducts } from './pages/homeCategoryProducts'
import { bestProducts } from './components/BestMenu'
import { newMenuProducts } from './components/NewMenu'
import { newArrivalProducts } from './components/NewArrivals'
import { seasonalProducts } from './newMenuCatalog'
import { productSlug } from './pages/productLinks'

const photos = import.meta.glob('./assets/{best-menu,new-menu,new-arrivals}/*.png', { eager: true, query: '?url', import: 'default' })
const all = [...withHomeCategoryProducts(menuCategories).flatMap(category => category.products), ...bestProducts, ...newMenuProducts, ...newArrivalProducts, ...seasonalProducts].map(product => ({ ...product, imageSrc: product.imageSrc || Object.entries(photos).find(([path]) => path.split('/').at(-1) === `${product.id}.png`)?.[1] }))
export const reviewProducts = all.filter((product, index) => all.findIndex(other => productSlug(other.id) === productSlug(product.id)) === index)
export const findReviewProduct = id => all.find(product => product.id === id) || all.find(product => productSlug(product.id) === id)

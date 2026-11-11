import UnifiedProductDetail from '../components/UnifiedProductDetail'
import { registeredProducts } from '../productCatalog'
export default function MontBlancDetail() {
  return <UnifiedProductDetail product={registeredProducts.find(item => item.id === 'bread-2')} products={registeredProducts.filter(item => !item.id.startsWith('new-'))} />
}
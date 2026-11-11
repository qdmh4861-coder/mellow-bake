import UnifiedProductDetail from '../components/UnifiedProductDetail'
import { registeredProducts } from '../productCatalog'
export default function SweetPotatoDetail() {
  return <UnifiedProductDetail product={registeredProducts.find(item => item.id === 'bread-3')} products={registeredProducts.filter(item => !item.id.startsWith('new-'))} />
}
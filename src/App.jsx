import LoadingScreen from './components/LoadingScreen'
import { useEffect, useLayoutEffect } from 'react'
import { requiresDemoLogin, useDemoUser } from './demoAuth'
import Home from './pages/Home'
import OurMenu from './pages/OurMenu'
import Login from './pages/Login'
import Signup from './pages/Signup'
import SaltBreadDetail from './pages/SaltBreadDetail'
import ProductDetail from './pages/ProductDetail'
import MontBlancDetail from './pages/MontBlancDetail'
import CinnamonRollDetail from './pages/CinnamonRollDetail'
import BulgogiSandwichDetail from './pages/BulgogiSandwichDetail'
import SweetPotatoDetail from './pages/SweetPotatoDetail'
import Cart from './pages/Cart'
import MyPage from './pages/MyPage'
import OrderHistory from './pages/OrderHistory'
import OrderDetail from './pages/OrderDetail'
import OrderList from './pages/OrderList'
import Wishlist from './pages/Wishlist'
import Profile from './pages/Profile'
import Reviews from './pages/Reviews'
import Benefits from './pages/Benefits'
import Notices from './pages/Notices'
import PasswordChange from './pages/PasswordChange'
import NewMenuPage from './pages/NewMenuPage'
import NewMenuDetail from './pages/NewMenuDetail'
import Store from './pages/Store'
import Claims from './pages/Claims'
import PaymentHistory from './pages/PaymentHistory'
import ReviewWrite from './pages/ReviewWrite'
import AddressBook from './pages/AddressBook'
import InquiryWrite from './pages/InquiryWrite'
import InquiryHistory from './pages/InquiryHistory'
import Faq from './pages/Faq'

function DemoAccess({ children }) {
  const user = useDemoUser()
  const required = requiresDemoLogin(window.location.pathname.replace(/\/+$/, '') || '/')
  const signedIn = Boolean(user)
  useEffect(() => {
    if (required && !signedIn) window.location.replace('/login?required=1')
  }, [required, signedIn])
  return required && !signedIn ? null : children
}

function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
  const menuCategory = pathname.match(/^\/menu\/(bread|cake|sandwich|drink|all)$/)?.[1]
  const productSlug = pathname.match(/^\/menu\/([^/]+)$/)?.[1]
  const benefitPage = ({ '/mypage/coupon-events': 'events', '/mypage/coupons': 'coupons', '/mypage/points': 'points', '/mypage/benefits': 'overview' })[pathname]
  const isNoticesPage = pathname === '/mypage/notices' || pathname.startsWith('/mypage/notices/')
  const page = pathname === '/menu/bread-3' ? <SweetPotatoDetail /> : pathname === '/menu/bulgogi-sandwich' ? <BulgogiSandwichDetail /> : pathname === '/menu/cinnamon-roll' ? <CinnamonRollDetail /> : pathname === '/menu/mont-blanc' || pathname === '/menu/bread-2' ? <MontBlancDetail /> : pathname === '/menu/salt-bread' ? <SaltBreadDetail /> : menuCategory ? <OurMenu categoryId={menuCategory} /> : productSlug ? <ProductDetail key={productSlug} slug={productSlug} /> : pathname === '/menu' ? <OurMenu /> : pathname === '/login' ? <Login /> : pathname === '/signup' ? <Signup /> : <Home />

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  return <LoadingScreen>{pathname === '/mypage/faq' ? <Faq /> : pathname === '/mypage/inquiries' ? <InquiryHistory /> : pathname === '/mypage/inquiry' ? <InquiryWrite /> : pathname === '/mypage/addresses' ? <AddressBook /> : pathname === '/reviews/write' ? <ReviewWrite /> : pathname === '/mypage/payments' ? <PaymentHistory /> : pathname === '/mypage/claims' ? <Claims /> : pathname === '/store' ? <Store /> : pathname === '/new-menu' ? <NewMenuPage /> : pathname.startsWith('/new-menu/') ? <NewMenuDetail key={pathname} id={pathname.slice(10)} /> : pathname === '/mypage/password' ? <PasswordChange /> : isNoticesPage ? <Notices /> : benefitPage ? <Benefits key={benefitPage} page={benefitPage} /> : pathname === '/reviews' ? <Reviews /> : pathname === '/mypage/reviews' ? <Reviews own /> : pathname === '/mypage/profile' ? <Profile /> : pathname === '/wishlist' ? <Wishlist /> : pathname === '/mypage/orders/list' ? <OrderList /> : pathname === '/mypage/orders/detail' ? <OrderDetail /> : pathname === '/mypage/orders' ? <OrderHistory /> : pathname === '/mypage' ? <MyPage /> : pathname === '/cart' ? <Cart /> : page}</LoadingScreen>
}

export default function AuthenticatedApp() { return <DemoAccess><App /></DemoAccess> }

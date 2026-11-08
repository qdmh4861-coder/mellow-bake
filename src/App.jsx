import LoadingScreen from './components/LoadingScreen'
import { useLayoutEffect } from 'react'
import Home from './pages/Home'
import OurMenu from './pages/OurMenu'
import Login from './pages/Login'
import Signup from './pages/Signup'
import SaltBreadDetail from './pages/SaltBreadDetail'

function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
  const menuCategory = pathname.match(/^\/menu\/(bread|cake|sandwich|drink|all)$/)?.[1]
  const page = pathname === '/menu/salt-bread' ? <SaltBreadDetail /> : menuCategory ? <OurMenu categoryId={menuCategory} /> : pathname === '/menu' ? <OurMenu /> : pathname === '/login' ? <Login /> : pathname === '/signup' ? <Signup /> : <Home />

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  return <LoadingScreen>{page}</LoadingScreen>
}

export default App

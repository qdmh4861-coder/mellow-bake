import LoadingScreen from './components/LoadingScreen'
import { useLayoutEffect } from 'react'
import Home from './pages/Home'
import OurMenu from './pages/OurMenu'
import Login from './pages/Login'

function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
  const page = pathname === '/menu' ? <OurMenu /> : pathname === '/login' ? <Login /> : <Home />

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  return <LoadingScreen>{page}</LoadingScreen>
}

export default App

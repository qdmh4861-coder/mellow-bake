import LoadingScreen from './components/LoadingScreen'
import { useLayoutEffect } from 'react'
import Home from './pages/Home'
import OurMenu from './pages/OurMenu'

function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
  const page = pathname === '/menu' ? <OurMenu /> : <Home />

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  return <LoadingScreen>{page}</LoadingScreen>
}

export default App

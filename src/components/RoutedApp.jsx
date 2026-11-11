import { useEffect, useSyncExternalStore } from 'react'
import App from '../App'
import { subscribeToAppRoute, appRouteSnapshot, scrollToAppAnchor, repeatAppAnchor } from '../appRouting'

export default function RoutedApp() {
  const route = useSyncExternalStore(subscribeToAppRoute, appRouteSnapshot)
  useEffect(() => {
    scrollToAppAnchor()
    window.addEventListener('hashchange', scrollToAppAnchor)
    window.addEventListener('click', repeatAppAnchor)
    return () => {
      window.removeEventListener('hashchange', scrollToAppAnchor)
      window.removeEventListener('click', repeatAppAnchor)
    }
  }, [route])
  return <App key={route} />
}

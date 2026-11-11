import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RoutedApp from './components/RoutedApp.jsx'
import Consultation from './components/Consultation.jsx'
import { initializeAppRouting } from './appRouting'

initializeAppRouting()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RoutedApp />
    <Consultation />
  </StrictMode>,
)

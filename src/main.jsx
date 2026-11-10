import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Consultation from './components/Consultation.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Consultation />
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/utils/setRem'
import '@/styles/global.scss'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

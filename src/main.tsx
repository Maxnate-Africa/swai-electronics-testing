import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

// Use the same base path as vite.config.ts
const basename = import.meta.env.BASE_URL

// Handle SPA redirect from 404.html (GitHub Pages)
const spaRedirect = sessionStorage.getItem('spa-redirect')
if (spaRedirect) {
  sessionStorage.removeItem('spa-redirect')
  // Replace current URL with the intended path
  window.history.replaceState(null, '', basename + spaRedirect.replace(/^\//, ''))
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

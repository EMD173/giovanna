import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './design/tokens/index.css'
import App from './App.tsx'
import PractitionerPortal from './features/village/PractitionerPortal.tsx'

// Check if this is a portal access URL (no auth required)
const isPortalAccess = typeof window !== 'undefined' &&
  window.location.pathname.includes('/portal');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isPortalAccess ? <PractitionerPortal /> : <App />}
  </StrictMode>,
)


import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import ParticleBackground from './components/animations/ParticleBackground'
import GrainOverlay from './components/animations/GrainOverlay'
import FloatingSymbols from './components/animations/FloatingSymbols'
import SmoothScroll from './components/animations/SmoothScroll'
import ErrorBoundary from './components/ErrorBoundary'
import AmbientAudio from './components/AmbientAudio'
import AchievementToast from './components/AchievementToast'
import NotificationCenter from './components/NotificationCenter'
import CartDrawer from './components/CartDrawer'
import './i18n'
import './styles/globals.css'

export default function App() {
  return (
    <ErrorBoundary>
      <SmoothScroll>
        {/* Skip to content — a11y */}
        <a href="#main-content" style={{
          position: 'fixed', top: -100, left: 16, zIndex: 10000,
          padding: '12px 24px', background: 'var(--nya-ochre)', color: '#fff',
          borderRadius: 8, fontWeight: 700, fontSize: '0.8rem',
          transition: 'top 0.3s',
        }} onFocus={(e) => { e.currentTarget.style.top = '16px' }}
           onBlur={(e) => { e.currentTarget.style.top = '-100px' }}>
          Aller au contenu principal
        </a>

        {/* Background layers */}
        <ParticleBackground />
        <FloatingSymbols />
        <GrainOverlay />

        {/* Global overlays that DON'T need Router context */}
        <AchievementToast />
        <NotificationCenter />
        <CartDrawer />
        <AmbientAudio />

        {/* App — CommandPalette is inside RootLayout (needs Router context) */}
        <div id="main-content">
          <RouterProvider router={router} />
        </div>

      </SmoothScroll>
    </ErrorBoundary>
  )
}

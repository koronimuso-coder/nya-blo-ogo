import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import ParticleBackground from './components/animations/ParticleBackground'
import GrainOverlay from './components/animations/GrainOverlay'
import FloatingSymbols from './components/animations/FloatingSymbols'
import SmoothScroll from './components/animations/SmoothScroll'
import CookieBanner from './components/CookieBanner'
import BackToTop from './components/BackToTop'
import ErrorBoundary from './components/ErrorBoundary'
import SearchOverlay from './components/SearchOverlay'
import ScrollToTop from './components/ScrollToTop'
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

        {/* App */}
        <div id="main-content">
          <RouterProvider router={router} />
        </div>

        {/* Global overlays */}
        <SearchOverlay />
        <ScrollToTop />
        <BackToTop />
        <CookieBanner />
      </SmoothScroll>
    </ErrorBoundary>
  )
}

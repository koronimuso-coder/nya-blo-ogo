import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'

// Lazy loaded pages
const Landing = lazy(() => import('../pages/Landing'))
const Login = lazy(() => import('../pages/auth/Login'))
const Register = lazy(() => import('../pages/auth/Register'))
const NotFound = lazy(() => import('../pages/NotFound'))
const ComingSoon = lazy(() => import('../pages/placeholder/ComingSoon'))

// Main module pages (exact reference site pages)
const Shop = lazy(() => import('../pages/Shop'))
const Learn = lazy(() => import('../pages/Learn'))
const Vtc = lazy(() => import('../pages/Vtc'))
const ImmobilierPage = lazy(() => import('../pages/Immobilier'))
const Health = lazy(() => import('../pages/Health'))

// Additional module pages
const About = lazy(() => import('../pages/About'))
const ServicesPage = lazy(() => import('../pages/Services'))
const Pricing = lazy(() => import('../pages/Pricing'))
const CvBuilder = lazy(() => import('../pages/CvBuilder'))
const Lab = lazy(() => import('../pages/Lab'))
const MediaPage = lazy(() => import('../pages/Media'))
const Games = lazy(() => import('../pages/Games'))
const MentionsLegales = lazy(() => import('../pages/MentionsLegales'))
const Contact = lazy(() => import('../pages/Contact'))
const Privacy = lazy(() => import('../pages/Privacy'))
const Faq = lazy(() => import('../pages/Faq'))
const SitemapPage = lazy(() => import('../pages/Sitemap'))

// Loader wrapper — "Synchronisation Sirius..." matching reference
function SuspenseWrap({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: 24 }}>
                        <div style={{
                            width: 48, height: 48, margin: '0 auto',
                            border: '2px solid rgba(184,92,46,0.2)', borderTop: '2px solid #B85C2E',
                            borderRadius: '50%', animation: 'spin 1s linear infinite',
                        }} />
                    </div>
                    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                    <p style={{ color: '#B85C2E', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                        Synchronisation Sirius...
                    </p>
                </div>
            </div>
        }>
            {children}
        </Suspense>
    )
}

// Routes that remain as ComingSoon placeholders
const comingSoonPaths = [
    'discover', 'news', 'ai', 'create', 'docs', 'music', 'podcast', 'langue',
    'stream', 'tube', 'play', 'books', 'events', 'live', 'comedy', 'sport',
    'social', 'chat', 'forum', 'network', 'quiz', 'interview',
    'digital', 'streaming-shop', 'fashion', 'electronique', 'crowdfunding', 'digital-market',
    'pharmacie', 'transit', 'jobs', 'agriculture', 'real-estate',
    'fitness', 'food', 'meditation', 'genealogy',
    'tools', 'finance', 'calendar', 'files', 'mail', 'survey', 'affiliate',
    'spiritual', 'fashion-mag', 'travel', 'photography', 'kids',
    'rewards', 'verse', 'startup', 'api-docs', 'status', 'changelog', 'support',
    'profile', 'settings', 'subscription', 'wallet', 'admin',
    'privacy', 'terms', 'legal', 'cookies', 'onboarding',
    'reve', 'dashboard',
]

export const router = createBrowserRouter([
    // ═══ Landing (root page, like reference site) ═══
    { path: '/', element: <SuspenseWrap><Landing /></SuspenseWrap> },
    { path: '/landing', element: <SuspenseWrap><Landing /></SuspenseWrap> },

    // ═══ Auth ═══
    { path: '/login', element: <SuspenseWrap><Login /></SuspenseWrap> },
    { path: '/register', element: <SuspenseWrap><Register /></SuspenseWrap> },

    // ═══ Main 5 module pages (exact reference) ═══
    { path: '/shop', element: <SuspenseWrap><Shop /></SuspenseWrap> },
    { path: '/learn', element: <SuspenseWrap><Learn /></SuspenseWrap> },
    { path: '/vtc', element: <SuspenseWrap><Vtc /></SuspenseWrap> },
    { path: '/immobilier', element: <SuspenseWrap><ImmobilierPage /></SuspenseWrap> },
    { path: '/health', element: <SuspenseWrap><Health /></SuspenseWrap> },

    // ═══ Additional full pages ═══
    { path: '/about', element: <SuspenseWrap><About /></SuspenseWrap> },
    { path: '/services', element: <SuspenseWrap><ServicesPage /></SuspenseWrap> },
    { path: '/pricing', element: <SuspenseWrap><Pricing /></SuspenseWrap> },
    { path: '/cv-builder', element: <SuspenseWrap><CvBuilder /></SuspenseWrap> },
    { path: '/lab', element: <SuspenseWrap><Lab /></SuspenseWrap> },
    { path: '/media', element: <SuspenseWrap><MediaPage /></SuspenseWrap> },
    { path: '/games', element: <SuspenseWrap><Games /></SuspenseWrap> },
    { path: '/mentions-legales', element: <SuspenseWrap><MentionsLegales /></SuspenseWrap> },
    { path: '/contact', element: <SuspenseWrap><Contact /></SuspenseWrap> },
    { path: '/privacy', element: <SuspenseWrap><Privacy /></SuspenseWrap> },
    { path: '/faq', element: <SuspenseWrap><Faq /></SuspenseWrap> },
    { path: '/sitemap', element: <SuspenseWrap><SitemapPage /></SuspenseWrap> },

    // ═══ Remaining module routes (ComingSoon) ═══
    ...comingSoonPaths.map((p) => ({
        path: `/${p}`,
        element: <SuspenseWrap><ComingSoon /></SuspenseWrap>,
    })),

    // ═══ 404 ═══
    { path: '*', element: <SuspenseWrap><NotFound /></SuspenseWrap> },
])

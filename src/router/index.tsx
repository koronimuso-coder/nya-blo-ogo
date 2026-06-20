import { createBrowserRouter, Outlet, useLocation } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SearchOverlay from '../components/SearchOverlay'
import ScrollToTop from '../components/ScrollToTop'
import BackToTop from '../components/BackToTop'
import CookieBanner from '../components/CookieBanner'
import CommandPalette from '../components/CommandPalette'
import OnboardingTour from '../components/OnboardingTour'
import AIAssistant from '../components/AIAssistant'

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
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Achievements = lazy(() => import('../pages/Achievements'))
const MentionsLegales = lazy(() => import('../pages/MentionsLegales'))
const Contact = lazy(() => import('../pages/Contact'))
const Privacy = lazy(() => import('../pages/Privacy'))
const Faq = lazy(() => import('../pages/Faq'))
const SitemapPage = lazy(() => import('../pages/Sitemap'))

// ─── Phase II New Pages ───
const Profile = lazy(() => import('../pages/Profile'))
const Wallet = lazy(() => import('../pages/Wallet'))
const Settings = lazy(() => import('../pages/Settings'))
const Leaderboard = lazy(() => import('../pages/Leaderboard'))
const Chat = lazy(() => import('../pages/Chat'))
const Music = lazy(() => import('../pages/Music'))
const Comedy = lazy(() => import('../pages/Comedy'))
const Pharmacie = lazy(() => import('../pages/Pharmacie'))
const Agriculture = lazy(() => import('../pages/Agriculture'))
const Fashion = lazy(() => import('../pages/Fashion'))
const Books = lazy(() => import('../pages/Books'))
const Reve = lazy(() => import('../pages/Reve'))
const Startup = lazy(() => import('../pages/Startup'))
const Genealogy = lazy(() => import('../pages/Genealogy'))
const Fitness = lazy(() => import('../pages/Fitness'))
const Meditation = lazy(() => import('../pages/Meditation'))
const Crowdfunding = lazy(() => import('../pages/Crowdfunding'))
const Podcast = lazy(() => import('../pages/Podcast'))
const Calendar = lazy(() => import('../pages/Calendar'))
const Quiz = lazy(() => import('../pages/Quiz'))
const MapPage = lazy(() => import('../pages/Map'))
const Awale = lazy(() => import('../pages/Awale'))

// ─── Phase III International Competitors Pages ───
const Food = lazy(() => import('../pages/Food'))
const Finance = lazy(() => import('../pages/Finance'))
const Transit = lazy(() => import('../pages/Transit'))
const Kyc = lazy(() => import('../pages/Kyc'))
const Ussd = lazy(() => import('../pages/Ussd'))

// ─── Phase IV International Upgrade Pages ───
const MiniHub = lazy(() => import('../pages/MiniHub'))
const Tickets = lazy(() => import('../pages/Tickets'))
const Gigs = lazy(() => import('../pages/Gigs'))
const SiriusPass = lazy(() => import('../pages/SiriusPass'))


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

// Routes that remain as ComingSoon placeholders (filtered out new pages)
const comingSoonPaths = [
    'discover', 'news', 'ai', 'create', 'docs', 'langue',
    'stream', 'tube', 'play', 'events', 'live', 'sport',
    'social', 'forum', 'network', 'interview',
    'digital', 'streaming-shop', 'electronique', 'digital-market',
    'jobs', 'real-estate',
    'tools', 'files', 'mail', 'survey', 'affiliate',
    'spiritual', 'fashion-mag', 'travel', 'photography', 'kids',
    'rewards', 'verse', 'api-docs', 'status', 'changelog', 'support',
    'subscription', 'admin',
    'terms', 'legal', 'cookies', 'onboarding',
]

function RootLayout() {
    const location = useLocation()
    return (
        <>
            <AnimatePresence mode="wait">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                    <Outlet />
                </motion.div>
            </AnimatePresence>
            <SearchOverlay />
            <ScrollToTop />
            <BackToTop />
            <CookieBanner />
            <CommandPalette />
            <OnboardingTour />
            <AIAssistant />
        </>
    )
}

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            // ═══ Landing (root page, like reference site) ═══
            { path: '', element: <SuspenseWrap><Landing /></SuspenseWrap> },
            { path: 'landing', element: <SuspenseWrap><Landing /></SuspenseWrap> },

            // ═══ Auth ═══
            { path: 'login', element: <SuspenseWrap><Login /></SuspenseWrap> },
            { path: 'register', element: <SuspenseWrap><Register /></SuspenseWrap> },

            // ═══ Main 5 module pages (exact reference) ═══
            { path: 'shop', element: <SuspenseWrap><Shop /></SuspenseWrap> },
            { path: 'learn', element: <SuspenseWrap><Learn /></SuspenseWrap> },
            { path: 'vtc', element: <SuspenseWrap><Vtc /></SuspenseWrap> },
            { path: 'immobilier', element: <SuspenseWrap><ImmobilierPage /></SuspenseWrap> },
            { path: 'health', element: <SuspenseWrap><Health /></SuspenseWrap> },

            // ═══ Additional full pages ═══
            { path: 'about', element: <SuspenseWrap><About /></SuspenseWrap> },
            { path: 'services', element: <SuspenseWrap><ServicesPage /></SuspenseWrap> },
            { path: 'pricing', element: <SuspenseWrap><Pricing /></SuspenseWrap> },
            { path: 'cv-builder', element: <SuspenseWrap><CvBuilder /></SuspenseWrap> },
            { path: 'lab', element: <SuspenseWrap><Lab /></SuspenseWrap> },
            { path: 'media', element: <SuspenseWrap><MediaPage /></SuspenseWrap> },
            { path: 'games', element: <SuspenseWrap><Games /></SuspenseWrap> },
            { path: 'mentions-legales', element: <SuspenseWrap><MentionsLegales /></SuspenseWrap> },
            { path: 'contact', element: <SuspenseWrap><Contact /></SuspenseWrap> },
            { path: 'privacy', element: <SuspenseWrap><Privacy /></SuspenseWrap> },
            { path: 'faq', element: <SuspenseWrap><Faq /></SuspenseWrap> },
            { path: 'sitemap', element: <SuspenseWrap><SitemapPage /></SuspenseWrap> },
            { path: 'dashboard', element: <SuspenseWrap><Dashboard /></SuspenseWrap> },
            { path: 'achievements', element: <SuspenseWrap><Achievements /></SuspenseWrap> },

            // ═══ Phase II New routes ═══
            { path: 'profile', element: <SuspenseWrap><Profile /></SuspenseWrap> },
            { path: 'wallet', element: <SuspenseWrap><Wallet /></SuspenseWrap> },
            { path: 'settings', element: <SuspenseWrap><Settings /></SuspenseWrap> },
            { path: 'leaderboard', element: <SuspenseWrap><Leaderboard /></SuspenseWrap> },
            { path: 'chat', element: <SuspenseWrap><Chat /></SuspenseWrap> },
            { path: 'music', element: <SuspenseWrap><Music /></SuspenseWrap> },
            { path: 'comedy', element: <SuspenseWrap><Comedy /></SuspenseWrap> },
            { path: 'pharmacie', element: <SuspenseWrap><Pharmacie /></SuspenseWrap> },
            { path: 'agriculture', element: <SuspenseWrap><Agriculture /></SuspenseWrap> },
            { path: 'fashion', element: <SuspenseWrap><Fashion /></SuspenseWrap> },
            { path: 'books', element: <SuspenseWrap><Books /></SuspenseWrap> },
            { path: 'reve', element: <SuspenseWrap><Reve /></SuspenseWrap> },
            { path: 'startup', element: <SuspenseWrap><Startup /></SuspenseWrap> },
            { path: 'genealogy', element: <SuspenseWrap><Genealogy /></SuspenseWrap> },
            { path: 'fitness', element: <SuspenseWrap><Fitness /></SuspenseWrap> },
            { path: 'meditation', element: <SuspenseWrap><Meditation /></SuspenseWrap> },
            { path: 'crowdfunding', element: <SuspenseWrap><Crowdfunding /></SuspenseWrap> },
            { path: 'podcast', element: <SuspenseWrap><Podcast /></SuspenseWrap> },
            { path: 'calendar', element: <SuspenseWrap><Calendar /></SuspenseWrap> },
            { path: 'quiz', element: <SuspenseWrap><Quiz /></SuspenseWrap> },
            { path: 'map', element: <SuspenseWrap><MapPage /></SuspenseWrap> },
            { path: 'games/awale', element: <SuspenseWrap><Awale /></SuspenseWrap> },

            // ═══ Phase III International Competitors routes ═══
            { path: 'food', element: <SuspenseWrap><Food /></SuspenseWrap> },
            { path: 'finance', element: <SuspenseWrap><Finance /></SuspenseWrap> },
            { path: 'transit', element: <SuspenseWrap><Transit /></SuspenseWrap> },
            { path: 'kyc', element: <SuspenseWrap><Kyc /></SuspenseWrap> },
            { path: 'ussd', element: <SuspenseWrap><Ussd /></SuspenseWrap> },

            // ═══ Phase IV International Upgrade routes ═══
            { path: 'minihub', element: <SuspenseWrap><MiniHub /></SuspenseWrap> },
            { path: 'tickets', element: <SuspenseWrap><Tickets /></SuspenseWrap> },
            { path: 'gigs', element: <SuspenseWrap><Gigs /></SuspenseWrap> },
            { path: 'siriuspass', element: <SuspenseWrap><SiriusPass /></SuspenseWrap> },


            // ═══ Remaining module routes (ComingSoon) ═══
            ...comingSoonPaths.map((p) => ({
                path: p,
                element: <SuspenseWrap><ComingSoon /></SuspenseWrap>,
            })),

            // ═══ 404 ═══
            { path: '*', element: <SuspenseWrap><NotFound /></SuspenseWrap> },
        ]
    }
])

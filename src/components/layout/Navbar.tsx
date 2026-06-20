import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useNotificationStore } from '../../stores/notificationStore'
import { useCartStore } from '../../stores/cartStore'
import {
    Store, GraduationCap, Car, Building2, Cross,
    ShoppingCart, Hash, MessageCircle, Sun, Moon,
    Bell, Trophy, Compass
} from 'lucide-react'
import { useThemeStore } from '../../stores/themeStore'
import { useEffect } from 'react'

const navItems = [
    { icon: Store, label: 'MARCHÉ', path: '/shop' },
    { icon: GraduationCap, label: 'ACADÉMIE', path: '/learn' },
    { icon: Car, label: 'VTC', path: '/vtc' },
    { icon: Building2, label: 'IMMOBILIER', path: '/immobilier' },
    { icon: Cross, label: 'SANTÉ', path: '/health' },
    { icon: Compass, label: 'CARTE', path: '/map' },
]

export default function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()
    const { isAuthenticated, trackPageVisit, unlockAchievement } = useAuthStore()
    const { theme, toggleTheme } = useThemeStore()
    const { togglePanel, unreadCount } = useNotificationStore()
    const { toggleCart, totalItems } = useCartStore()

    const notifCount = unreadCount()
    const cartCount = totalItems()

    // Track page visits for "Explorer" achievement
    useEffect(() => {
        trackPageVisit(location.pathname)
    }, [location.pathname, trackPageVisit])

    // Dark mode achievement
    const handleThemeToggle = () => {
        toggleTheme()
        if (theme === 'light') {
            // Switching to dark mode
            unlockAchievement('night-walker')
        }
    }

    return (
        <>
            {/* Top progress bar */}
            <div className="top-progress-bar" />

            {/* Floating navigation */}
            <motion.nav
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                style={{
                    position: 'fixed',
                    top: 16,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 24px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        width: '100%',
                        maxWidth: 1400,
                    }}
                >
                    {/* Logo */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/')}
                        style={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            flexShrink: 0,
                            marginRight: 16,
                        }}
                    >
                        {/* Kanaga icon in circle */}
                        <div style={{
                            width: 40, height: 40, borderRadius: '50%',
                            background: 'var(--text-primary)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                        }}>
                            <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
                                <path d="M20 4 L36 20 L20 36 L4 20 Z" stroke="var(--bg-primary)" strokeWidth="3" fill="none" />
                                <path d="M20 14 L26 20 L20 26 L14 20 Z" fill="var(--bg-primary)" />
                            </svg>
                        </div>
                        <div>
                            <div style={{
                                fontFamily: 'var(--font-display)', fontSize: '1.2rem',
                                fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1, color: 'var(--text-primary)',
                            }}>
                                NYA BLO
                            </div>
                            <div style={{
                                fontFamily: 'var(--font-body)', fontSize: '0.55rem',
                                fontWeight: 700, letterSpacing: '0.15em', color: 'var(--nya-ochre)',
                                textTransform: 'uppercase',
                            }}>
                                ÉCOSYSTÈME SIRIUS
                            </div>
                        </div>
                    </motion.div>

                    {/* Central nav pills */}
                    <div
                        className="floating-nav"
                        style={{
                            position: 'relative',
                            top: 'auto',
                            left: 'auto',
                            transform: 'none',
                            flex: 1,
                            justifyContent: 'center',
                        }}
                    >
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const active = location.pathname === item.path
                            return (
                                <motion.button
                                    key={item.path}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate(item.path)}
                                    className={`nav-link ${active ? 'active' : ''}`}
                                >
                                    <Icon size={14} strokeWidth={2} />
                                    {item.label}
                                </motion.button>
                            )
                        })}
                    </div>

                    {/* Right side actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        {/* Cmd+K search hint */}
                        <div id="nav-search-hint" className="kbd-hint" style={{ cursor: 'pointer' }}
                            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
                        >
                            ⌘K
                        </div>

                        {/* Dashboard / Achievements */}
                        <motion.button
                            id="nav-achievements"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate('/achievements')}
                            style={{
                                width: 40, height: 40, borderRadius: '50%',
                                background: 'var(--bg-elevated)',
                                border: '1px solid var(--border-hover)',
                                color: 'var(--nya-gold)', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                position: 'relative',
                            }}
                            aria-label="Voir les badges"
                        >
                            <Trophy size={16} />
                        </motion.button>

                        {/* Notifications */}
                        <motion.button
                            id="nav-notifications"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={togglePanel}
                            style={{
                                width: 40, height: 40, borderRadius: '50%',
                                background: 'var(--bg-elevated)',
                                border: '1px solid var(--border-hover)',
                                color: 'var(--text-secondary)', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                position: 'relative',
                            }}
                            aria-label="Notifications"
                        >
                            <Bell size={16} />
                            <AnimatePresence>
                                {notifCount > 0 && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        style={{
                                            position: 'absolute', top: -2, right: -2,
                                            width: 18, height: 18, borderRadius: '50%',
                                            background: 'var(--nya-red)',
                                            color: '#fff', fontSize: '0.55rem', fontWeight: 900,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}
                                    >
                                        {notifCount}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        {/* Cart */}
                        <motion.button
                            id="nav-cart"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleCart}
                            style={{
                                width: 40, height: 40, borderRadius: '50%',
                                background: 'var(--bg-elevated)',
                                border: '1px solid var(--border-hover)',
                                color: 'var(--text-secondary)', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                position: 'relative',
                            }}
                            aria-label="Panier d'achat"
                        >
                            <ShoppingCart size={16} />
                            <AnimatePresence>
                                {cartCount > 0 && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        style={{
                                            position: 'absolute', top: -2, right: -2,
                                            width: 18, height: 18, borderRadius: '50%',
                                            background: 'var(--nya-ochre)',
                                            color: '#fff', fontSize: '0.55rem', fontWeight: 900,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}
                                    >
                                        {cartCount}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        {/* Theme toggle with cinematic animation */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9, rotate: 180 }}
                            onClick={handleThemeToggle}
                            style={{
                                width: 40, height: 40, borderRadius: '50%',
                                background: 'var(--bg-elevated)',
                                border: '1px solid var(--border-hover)',
                                color: 'var(--nya-gold)',
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'background 0.5s, border 0.5s, color 0.5s',
                            }}
                            aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={theme}
                                    initial={{ y: -12, opacity: 0, rotate: -90 }}
                                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                                    exit={{ y: 12, opacity: 0, rotate: 90 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                                </motion.div>
                            </AnimatePresence>
                        </motion.button>

                        {/* Nexus Portal */}
                        <motion.button
                            id="nav-nexus-portal"
                            whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(184,92,46,0.4)' }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-nexus"
                            onClick={() => isAuthenticated ? navigate('/dashboard') : navigate('/login')}
                            aria-label="Accéder au Nexus Portal"
                        >
                            <Hash size={14} strokeWidth={3} />
                            NEXUS PORTAL
                        </motion.button>
                    </div>
                </div>
            </motion.nav>

            {/* WhatsApp chat bubble — exact reference */}
            <motion.a
                href="https://wa.me/2250708736871?text=Bonjour%20NYA%20BLO%20%F0%9F%91%8B%20Je%20souhaite%20avoir%20des%20informations."
                target="_blank"
                rel="noopener noreferrer"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.5, type: 'spring' }}
                className="chat-bubble"
            >
                <MessageCircle size={24} />
                <div className="badge">1</div>
            </motion.a>
        </>
    )
}

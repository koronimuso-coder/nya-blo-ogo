import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import {
    Store, GraduationCap, Car, Building2, Cross,
    ShoppingCart, Hash, MessageCircle, Sun, Moon
} from 'lucide-react'
import { useThemeStore } from '../../stores/themeStore'

const navItems = [
    { icon: Store, label: 'MARCHÉ', path: '/shop' },
    { icon: GraduationCap, label: 'ACADÉMIE', path: '/learn' },
    { icon: Car, label: 'VTC', path: '/vtc' },
    { icon: Building2, label: 'IMMOBILIER', path: '/immobilier' },
    { icon: Cross, label: 'SANTÉ', path: '/health' },
]

export default function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()
    const { isAuthenticated } = useAuthStore()
    const { theme, toggleTheme } = useThemeStore()

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

                    {/* Right side: cart + Nexus */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                        {/* Cmd+K search hint */}
                        <div className="kbd-hint" style={{ cursor: 'pointer' }}
                            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
                        >
                            ⌘K
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            style={{
                                width: 44, height: 44, borderRadius: '50%',
                                background: 'var(--bg-elevated)',
                                border: '1px solid var(--border-hover)',
                                color: 'var(--text-secondary)', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                            onClick={() => navigate('/shop')}
                            aria-label="Panier d'achat"
                        >
                            <ShoppingCart size={18} />
                        </motion.button>

                        {/* Theme toggle */}
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleTheme}
                            style={{
                                width: 44, height: 44, borderRadius: '50%',
                                background: theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                                border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                                color: 'var(--nya-ochre)', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'background 0.3s, border 0.3s',
                            }}
                            aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(184,92,46,0.4)' }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-nexus"
                            onClick={() => isAuthenticated ? navigate('/') : navigate('/login')}
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

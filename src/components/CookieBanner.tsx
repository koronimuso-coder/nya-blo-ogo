import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X } from 'lucide-react'
import { Link } from 'react-router-dom'

const COOKIE_KEY = 'nya-cookie-consent'

export default function CookieBanner() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const consent = localStorage.getItem(COOKIE_KEY)
        if (!consent) {
            // Small delay to not overwhelm the user on first load
            const timer = setTimeout(() => setVisible(true), 2500)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem(COOKIE_KEY, 'accepted')
        setVisible(false)
    }

    const handleRefuse = () => {
        localStorage.setItem(COOKIE_KEY, 'refused')
        setVisible(false)
    }

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    style={{
                        position: 'fixed',
                        bottom: 24,
                        left: 24,
                        right: 24,
                        maxWidth: 560,
                        zIndex: 9999,
                        padding: '28px 32px',
                        background: 'var(--bg-nav)',
                        backdropFilter: 'blur(30px)',
                        WebkitBackdropFilter: 'blur(30px)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                    }}
                >
                    {/* Close button */}
                    <button
                        onClick={handleRefuse}
                        aria-label="Fermer la bannière cookies"
                        style={{
                            position: 'absolute', top: 12, right: 12,
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: 'var(--text-faint)', padding: 4,
                        }}
                    >
                        <X size={16} />
                    </button>

                    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                        <Cookie size={24} style={{ color: 'var(--nya-ochre)', flexShrink: 0, marginTop: 2 }} />
                        <div>
                            <div style={{
                                fontFamily: 'var(--font-display)', fontSize: '1.1rem',
                                fontWeight: 900, letterSpacing: '-0.02em',
                                textTransform: 'uppercase', marginBottom: 8,
                                color: 'var(--text-primary)',
                            }}>
                                Cookies & Confidentialité
                            </div>
                            <p style={{
                                color: 'var(--text-muted)', fontSize: '0.82rem',
                                lineHeight: 1.7, marginBottom: 20,
                            }}>
                                NYA BLO utilise des cookies pour améliorer votre expérience et analyser le trafic.
                                En continuant, vous acceptez notre{' '}
                                <Link to="/privacy" style={{ color: 'var(--nya-ochre)', textDecoration: 'underline' }}>
                                    politique de confidentialité
                                </Link>.
                            </p>

                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleAccept}
                                    style={{
                                        padding: '12px 28px',
                                        background: 'var(--nya-ochre)',
                                        color: '#FFFFFF',
                                        border: 'none',
                                        borderRadius: 'var(--radius-pill)',
                                        fontSize: '0.72rem',
                                        fontWeight: 800,
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        cursor: 'pointer',
                                        fontFamily: 'var(--font-body)',
                                    }}
                                >
                                    ACCEPTER TOUT
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleRefuse}
                                    style={{
                                        padding: '12px 28px',
                                        background: 'transparent',
                                        color: 'var(--text-secondary)',
                                        border: '1px solid var(--border-hover)',
                                        borderRadius: 'var(--radius-pill)',
                                        fontSize: '0.72rem',
                                        fontWeight: 800,
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        cursor: 'pointer',
                                        fontFamily: 'var(--font-body)',
                                    }}
                                >
                                    REFUSER
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

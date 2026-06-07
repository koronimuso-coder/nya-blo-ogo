import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { Sparkles } from 'lucide-react'

interface Props {
    pageName?: string
}

export default function ComingSoon({ pageName }: Props) {
    const navigate = useNavigate()
    // Derive a display name from the URL
    const path = typeof window !== 'undefined' ? window.location.pathname.replace('/', '') : ''
    const displayName = pageName || path.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Module'

    return (
        <div>
            <Navbar />

            <section style={{
                minHeight: '100vh', display: 'flex',
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', padding: 'var(--section-gap) var(--page-padding)',
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="cosmo-label" style={{ justifyContent: 'center', marginBottom: 24 }}>
                        MODULE EN PRÉPARATION
                    </div>

                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        style={{ margin: '0 auto 40px', width: 80, height: 80 }}
                    >
                        <Sparkles size={80} style={{ color: 'var(--nya-ochre)', opacity: 0.3 }} />
                    </motion.div>

                    <h1 style={{ marginBottom: 24 }}>
                        {displayName.toUpperCase()}
                    </h1>

                    <p style={{
                        color: 'var(--text-faint)', fontSize: '1rem',
                        lineHeight: 1.8, maxWidth: 500, margin: '0 auto 48px',
                    }}>
                        Ce module est en cours de construction par les Scribes du Nexus.
                        Revenez bientôt pour découvrir cette nouvelle dimension de l'écosystème.
                    </p>

                    {/* Shimmer bar */}
                    <div style={{
                        width: 200, height: 4, borderRadius: 2,
                        margin: '0 auto 48px',
                        background: 'var(--bg-surface)',
                        overflow: 'hidden',
                    }}>
                        <motion.div
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            style={{
                                width: '40%', height: '100%',
                                background: 'linear-gradient(90deg, transparent, var(--nya-ochre), transparent)',
                                borderRadius: 2,
                            }}
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-primary"
                        onClick={() => navigate('/')}
                    >
                        RETOUR À L'ACCUEIL
                    </motion.button>
                </motion.div>
            </section>

            <Footer />
            <div className="grain-overlay" />
        </div>
    )
}

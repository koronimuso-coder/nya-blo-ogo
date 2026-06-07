import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home } from 'lucide-react'

export default function NotFound() {
    const navigate = useNavigate()
    const { t } = useTranslation()

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
                {/* 404 star constellation */}
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} style={{ marginBottom: 32 }}>
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" style={{ margin: '0 auto' }}>
                        {[...Array(30)].map((_, i) => (
                            <circle key={i} cx={60 + Math.cos(i * 0.7) * (20 + i * 1.2)} cy={60 + Math.sin(i * 0.9) * (20 + i * 1.2)} r={Math.random() * 2 + 0.5} fill="#E8F4FF" opacity={0.3 + Math.random() * 0.7} />
                        ))}
                        <text x="60" y="65" textAnchor="middle" fill="url(#g404)" fontSize="32" fontFamily="Cinzel Decorative" fontWeight="900">404</text>
                        <defs><linearGradient id="g404" x1="0" y1="0" x2="120" y2="120"><stop offset="0%" stopColor="#FFD700" /><stop offset="100%" stopColor="#C8641A" /></linearGradient></defs>
                    </svg>
                </motion.div>

                <h1 style={{ fontSize: '2rem', marginBottom: 12 }}>{t('errors.404')}</h1>
                <p style={{ color: 'var(--nya-sand)', maxWidth: 400, margin: '0 auto 32px', lineHeight: 1.6 }}>
                    {t('errors.404desc')}
                </p>

                <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(200,100,26,0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/')}
                    style={{
                        background: 'linear-gradient(135deg, #C8641A, #D4A017)', border: 'none', color: 'white',
                        padding: '14px 32px', borderRadius: 12, fontSize: '1rem', fontWeight: 600,
                        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-body)',
                    }}
                >
                    <Home size={18} /> {t('errors.goBack')}
                </motion.button>
            </motion.div>
        </div>
    )
}

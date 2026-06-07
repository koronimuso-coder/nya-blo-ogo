import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../stores/authStore'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function Login() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { login, loginAsDemo, isLoading } = useAuthStore()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        try {
            await login(email, password)
            navigate('/')
        } catch {
            setError('Identifiants incorrects')
        }
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 24,
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card"
                style={{
                    padding: 48,
                    width: '100%',
                    maxWidth: 440,
                }}
            >
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        <svg width="48" height="48" viewBox="0 0 40 40" fill="none" style={{ margin: '0 auto 16px' }}>
                            <path d="M20 4 L36 20 L20 36 L4 20 Z" stroke="url(#lg)" strokeWidth="2" fill="none" />
                            <path d="M20 14 L26 20 L20 26 L14 20 Z" fill="url(#lg)" />
                            <defs>
                                <linearGradient id="lg" x1="0" y1="0" x2="40" y2="40">
                                    <stop offset="0%" stopColor="#FFD700" />
                                    <stop offset="100%" stopColor="#C8641A" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </motion.div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>NYA BLO</h1>
                    <p style={{ color: 'var(--nya-sand)', fontSize: '0.9rem' }}>{t('auth.login')}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div style={{ marginBottom: 16, position: 'relative' }}>
                        <Mail size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--nya-gold)', opacity: 0.5 }} />
                        <input
                            type="email"
                            placeholder={t('auth.email')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 16px 12px 42px',
                                borderRadius: 12,
                                border: '1px solid rgba(212,160,23,0.15)',
                                background: 'rgba(10,10,20,0.6)',
                                color: 'var(--nya-ivory)',
                                fontSize: '0.9rem',
                                outline: 'none',
                                fontFamily: 'var(--font-body)',
                                transition: 'border-color 0.3s',
                            }}
                            onFocus={(e) => (e.target.style.borderColor = 'rgba(212,160,23,0.5)')}
                            onBlur={(e) => (e.target.style.borderColor = 'rgba(212,160,23,0.15)')}
                        />
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: 8, position: 'relative' }}>
                        <Lock size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--nya-gold)', opacity: 0.5 }} />
                        <input
                            type={showPass ? 'text' : 'password'}
                            placeholder={t('auth.password')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 42px 12px 42px',
                                borderRadius: 12,
                                border: '1px solid rgba(212,160,23,0.15)',
                                background: 'rgba(10,10,20,0.6)',
                                color: 'var(--nya-ivory)',
                                fontSize: '0.9rem',
                                outline: 'none',
                                fontFamily: 'var(--font-body)',
                                transition: 'border-color 0.3s',
                            }}
                            onFocus={(e) => (e.target.style.borderColor = 'rgba(212,160,23,0.5)')}
                            onBlur={(e) => (e.target.style.borderColor = 'rgba(212,160,23,0.15)')}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            style={{
                                position: 'absolute',
                                right: 14,
                                top: 12,
                                background: 'none',
                                border: 'none',
                                color: 'var(--nya-gold)',
                                cursor: 'pointer',
                                opacity: 0.5,
                            }}
                        >
                            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    <div style={{ textAlign: 'right', marginBottom: 24 }}>
                        <a style={{ fontSize: '0.8rem', color: 'var(--nya-gold)', opacity: 0.6 }}>{t('auth.forgotPassword')}</a>
                    </div>

                    {error && (
                        <p style={{ color: 'var(--nya-red)', fontSize: '0.85rem', marginBottom: 16, textAlign: 'center' }}>
                            {error}
                        </p>
                    )}

                    {/* Submit */}
                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(200,100,26,0.3)' }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            borderRadius: 12,
                            border: 'none',
                            background: 'linear-gradient(135deg, #C8641A, #D4A017)',
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: 700,
                            cursor: isLoading ? 'wait' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            fontFamily: 'var(--font-body)',
                            opacity: isLoading ? 0.7 : 1,
                        }}
                    >
                        {isLoading ? 'Connexion...' : t('auth.login')} {!isLoading && <ArrowRight size={18} />}
                    </motion.button>
                </form>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '24px 0' }}>
                    <div style={{ flex: 1, height: 1, background: 'rgba(212,160,23,0.1)' }} />
                    <span style={{ color: 'var(--nya-sand)', fontSize: '0.8rem' }}>ou</span>
                    <div style={{ flex: 1, height: 1, background: 'rgba(212,160,23,0.1)' }} />
                </div>

                {/* Google Login */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: 12,
                        border: '1px solid rgba(212,160,23,0.15)',
                        background: 'rgba(10,10,20,0.6)',
                        color: 'var(--nya-ivory)',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                        marginBottom: 12,
                        fontFamily: 'var(--font-body)',
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    {t('auth.loginWith')} Google
                </motion.button>

                {/* Demo access */}
                <motion.button
                    whileHover={{ scale: 1.02, borderColor: 'rgba(212,160,23,0.3)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { loginAsDemo(); navigate('/') }}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: 12,
                        border: '1px solid rgba(74,158,255,0.2)',
                        background: 'rgba(74,158,255,0.05)',
                        color: 'var(--nya-sirius)',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        fontFamily: 'var(--font-body)',
                    }}
                >
                    🚀 {t('auth.demoAccess')}
                </motion.button>

                {/* Register link */}
                <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--nya-sand)', fontSize: '0.85rem' }}>
                    {t('auth.noAccount')}{' '}
                    <Link to="/register" style={{ color: 'var(--nya-gold)', fontWeight: 600 }}>
                        {t('auth.register')}
                    </Link>
                </p>
            </motion.div>
        </div>
    )
}

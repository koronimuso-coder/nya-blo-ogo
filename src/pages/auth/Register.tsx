import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../stores/authStore'
import { Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react'

export default function Register() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { loginAsDemo } = useAuthStore()
    const [step, setStep] = useState(1)
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        loginAsDemo()
        navigate('/')
    }

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '12px 16px 12px 42px', borderRadius: 12,
        border: '1px solid rgba(212,160,23,0.15)', background: 'rgba(10,10,20,0.6)',
        color: 'var(--nya-ivory)', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-body)',
    }

    const btnPrimary: React.CSSProperties = {
        flex: 1, padding: '14px', borderRadius: 12, border: 'none',
        background: 'linear-gradient(135deg, #C8641A, #D4A017)', color: 'white',
        fontSize: '1rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: 48, width: '100%', maxWidth: 440 }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <svg width="48" height="48" viewBox="0 0 40 40" fill="none" style={{ margin: '0 auto 16px' }}>
                        <path d="M20 4 L36 20 L20 36 L4 20 Z" stroke="url(#lg2)" strokeWidth="2" fill="none" />
                        <path d="M20 14 L26 20 L20 26 L14 20 Z" fill="url(#lg2)" />
                        <defs><linearGradient id="lg2" x1="0" y1="0" x2="40" y2="40"><stop offset="0%" stopColor="#FFD700" /><stop offset="100%" stopColor="#C8641A" /></linearGradient></defs>
                    </svg>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>NYA BLO</h1>
                    <p style={{ color: 'var(--nya-sand)', fontSize: '0.9rem' }}>{t('auth.register')}</p>
                </div>

                <div style={{ display: 'flex', gap: 8, marginBottom: 32, justifyContent: 'center' }}>
                    {[1, 2].map((s) => (
                        <div key={s} style={{ width: s === step ? 32 : 12, height: 4, borderRadius: 2, background: s <= step ? 'linear-gradient(90deg, var(--nya-terracotta), var(--nya-gold))' : 'rgba(212,160,23,0.15)', transition: 'all 0.3s' }} />
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    {step === 1 ? (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <div style={{ marginBottom: 16, position: 'relative' }}>
                                <User size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--nya-gold)', opacity: 0.5 }} />
                                <input placeholder="Nom complet" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
                            </div>
                            <div style={{ marginBottom: 24, position: 'relative' }}>
                                <Mail size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--nya-gold)', opacity: 0.5 }} />
                                <input type="email" placeholder={t('auth.email')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
                            </div>
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={() => setStep(2)} style={{ ...btnPrimary, width: '100%' }}>
                                Suivant <ArrowRight size={18} />
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <div style={{ marginBottom: 16, position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--nya-gold)', opacity: 0.5 }} />
                                <input type="password" placeholder={t('auth.password')} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={inputStyle} />
                            </div>
                            <div style={{ marginBottom: 24, position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--nya-gold)', opacity: 0.5 }} />
                                <input type="password" placeholder="Confirmer" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} style={inputStyle} />
                            </div>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <motion.button whileTap={{ scale: 0.98 }} type="button" onClick={() => setStep(1)} style={{ padding: '14px 20px', borderRadius: 12, border: '1px solid rgba(212,160,23,0.2)', background: 'transparent', color: 'var(--nya-ivory)', cursor: 'pointer' }}>
                                    <ArrowLeft size={18} />
                                </motion.button>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" style={btnPrimary}>{t('auth.register')}</motion.button>
                            </div>
                        </motion.div>
                    )}
                </form>

                <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--nya-sand)', fontSize: '0.85rem' }}>
                    {t('auth.hasAccount')} <Link to="/login" style={{ color: 'var(--nya-gold)', fontWeight: 600 }}>{t('auth.login')}</Link>
                </p>
            </motion.div>
        </div>
    )
}

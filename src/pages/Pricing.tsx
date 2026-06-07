import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { Check } from 'lucide-react'

const plans = [
    {
        name: 'EXPLORER',
        label: 'GRATUIT',
        price: '0',
        period: '/mois',
        desc: "Accès aux fonctionnalités de base de l'écosystème.",
        features: ['Compte NYA BLO', 'Accès Market (navigation)', 'VTC (5 trajets/mois)', 'Académie (1 cours gratuit)', 'Support communauté'],
        color: 'var(--icon-watermark)',
        cta: 'COMMENCER GRATUITEMENT',
        popular: false,
    },
    {
        name: 'SCRIBE',
        label: 'POPULAIRE',
        price: '9 900',
        period: 'FCFA/mois',
        desc: 'Pour les créateurs et entrepreneurs ambitieux.',
        features: ['Tout Explorer +', 'Market (vente illimitée)', 'VTC (trajets illimités)', 'Académie (tous les cours)', 'Lab Nommo IA (50 req/jour)', 'CV Builder illimité', 'Support prioritaire'],
        color: 'var(--nya-ochre)',
        cta: 'DEVENIR SCRIBE',
        popular: true,
    },
    {
        name: 'MAÎTRE',
        label: 'ENTREPRISE',
        price: '49 900',
        period: 'FCFA/mois',
        desc: "L'accès total à la puissance du Nexus Sirius.",
        features: ['Tout Scribe +', 'IA Oracle illimitée', 'Dashboard analytique', 'API Sirius (10K req/jour)', 'Branding IA complet', 'Publicité AI-Optimized', 'Account manager dédié', 'Accès beta features'],
        color: 'var(--nya-gold)',
        cta: 'ACTIVER LE NEXUS',
        popular: false,
    },
]

export default function Pricing() {
    const navigate = useNavigate()

    return (
        <div>
            <Navbar />

            <section className="section-full" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="cosmo-label" style={{ justifyContent: 'center', marginBottom: 24 }}>TARIFICATION SIRIUS</div>
                    <h1 style={{ marginBottom: 32 }}>CHOISISSEZ<br />VOTRE VOIE</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
                        Des plans adaptés à chaque niveau d'initiation dans l'écosystème.
                    </p>
                </motion.div>
            </section>

            <section className="section-full section-dark">
                <div className="max-w-container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, maxWidth: 1100, margin: '0 auto' }}>
                        {plans.map((plan, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                                style={{
                                    padding: 40, borderRadius: 'var(--radius-xl)',
                                    background: plan.popular ? 'rgba(184,92,46,0.08)' : 'var(--bg-surface)',
                                    border: plan.popular ? '2px solid var(--nya-ochre)' : '1px solid var(--border-default)',
                                    position: 'relative',
                                }}>
                                {plan.popular && (
                                    <div style={{
                                        position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                                        padding: '4px 20px', borderRadius: 'var(--radius-pill)',
                                        background: 'var(--nya-ochre)', fontSize: '0.6rem', fontWeight: 800,
                                        letterSpacing: '0.2em', color: 'var(--text-primary)',
                                    }}>★ POPULAIRE</div>
                                )}
                                <div className="accent-label" style={{ marginBottom: 16 }}>{plan.label}</div>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: 8 }}>{plan.name}</div>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 16 }}>
                                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, color: 'var(--nya-ochre)' }}>{plan.price}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{plan.period}</span>
                                </div>
                                <p style={{ color: 'var(--text-faint)', fontSize: '0.85rem', marginBottom: 32, lineHeight: 1.5 }}>{plan.desc}</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                                    {plan.features.map((f, j) => (
                                        <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <Check size={14} style={{ color: 'var(--nya-ochre)', flexShrink: 0 }} />
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{f}</span>
                                        </div>
                                    ))}
                                </div>
                                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                    className={plan.popular ? 'btn-primary' : 'btn-secondary'}
                                    style={{ width: '100%', justifyContent: 'center' }}
                                    onClick={() => navigate('/register')}>
                                    {plan.cta}
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
            <div className="grain-overlay" />
        </div>
    )
}

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import SEOHead from '../components/SEOHead'
import { useNotificationStore } from '../stores/notificationStore'
import { useAuthStore } from '../stores/authStore'
import {
    Crown, Zap, Award, Sparkles, ShieldCheck, ArrowRight
} from 'lucide-react'

export default function SiriusPass() {
    const { addCoins, addScore } = useAuthStore()
    const { push } = useNotificationStore()

    const [plan, setPlan] = useState<'monthly' | 'annual'>('monthly')
    const [subscribing, setSubscribing] = useState(false)
    const [subscribed, setSubscribed] = useState(false)

    const handleSubscribe = () => {
        setSubscribing(true)
        setTimeout(() => {
            setSubscribing(false)
            setSubscribed(true)
            addScore(500)
            addCoins(100)
            push({
                type: 'reward',
                title: 'Abonnement Activé',
                message: 'Vous êtes désormais Initié Premium Sirius Pass ! (+500 Score, +100 Coins).',
                icon: '👑',
                color: '#D4A017'
            })
        }, 2500)
    }

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 100 }}>
            <SEOHead 
                title="Sirius Pass Premium — Super-App NYA BLO OGO" 
                description="Rejoignez le Sirius Pass pour débloquer les livraisons gratuites illimitées, des réductions VTC exclusives et des gains doublés en Nya Coins." 
            />
            <Starfield />
            <CosmicBackground />
            <Navbar />

            <main className="max-w-container" style={{ paddingTop: 120, position: 'relative', zIndex: 2 }}>
                
                {/* Hero */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 60, alignItems: 'center', marginBottom: 80 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div className="cosmo-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Crown size={16} style={{ color: 'var(--nya-gold)' }} />
                            MONÉTISATION PRIVILÉGIÉE
                        </div>
                        <h1 className="text-shimmer" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1.1 }}>
                            SIRIUS PASS<br />PREMIUM
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.8 }}>
                            Débloquez la puissance absolue de la super-app. Économisez sur chaque course, chaque repas et chaque transaction administrative grâce à notre pass exclusif de fidélité.
                        </p>

                        {!subscribed ? (
                            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                                <button
                                    onClick={() => setPlan('monthly')}
                                    style={{
                                        padding: '16px 28px', borderRadius: 16, cursor: 'pointer', textAlign: 'left', flex: 1,
                                        background: plan === 'monthly' ? 'rgba(212,160,23,0.06)' : 'var(--bg-surface)',
                                        border: '1.5px solid ' + (plan === 'monthly' ? 'var(--nya-gold)' : 'var(--border-subtle)'),
                                    }}
                                >
                                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>MENSUEL</span>
                                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 900, color: '#fff', display: 'block', marginTop: 4 }}>4 900 FCFA</span>
                                    <span style={{ fontSize: '0.6rem', color: 'var(--text-faint)' }}>Annulable à tout moment</span>
                                </button>

                                <button
                                    onClick={() => setPlan('annual')}
                                    style={{
                                        padding: '16px 28px', borderRadius: 16, cursor: 'pointer', textAlign: 'left', flex: 1,
                                        background: plan === 'annual' ? 'rgba(212,160,23,0.06)' : 'var(--bg-surface)',
                                        border: '1.5px solid ' + (plan === 'annual' ? 'var(--nya-gold)' : 'var(--border-subtle)'),
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>ANNUEL</span>
                                        <span style={{ fontSize: '0.55rem', fontWeight: 800, color: '#00E5A0', background: 'rgba(0,229,160,0.1)', padding: '2px 6px', borderRadius: 4 }}>ÉCONOMISEZ 25%</span>
                                    </div>
                                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 900, color: '#fff', display: 'block', marginTop: 4 }}>44 000 FCFA</span>
                                    <span style={{ fontSize: '0.6rem', color: 'var(--text-faint)' }}>Équivaut à 3 660 F / mois</span>
                                </button>
                            </div>
                        ) : null}

                        {!subscribed ? (
                            <button
                                onClick={handleSubscribe}
                                disabled={subscribing}
                                style={{
                                    padding: '18px', borderRadius: 'var(--radius-pill)', border: 'none', cursor: 'pointer',
                                    background: 'linear-gradient(135deg, var(--nya-gold), var(--nya-ochre))', color: '#000',
                                    fontWeight: 900, fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                    boxShadow: '0 8px 30px rgba(212,160,23,0.3)', marginTop: 12
                                }}
                            >
                                {subscribing ? (
                                    <>
                                        <div style={{ width: 14, height: 14, border: '2px solid #000', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                        Initié en cours de bénédiction...
                                    </>
                                ) : (
                                    <>ACTIVER MON SIRIUS PASS <ArrowRight size={16} /></>
                                )}
                            </button>
                        ) : (
                            <div className="toguna-glass" style={{ padding: 24, borderRadius: 20, border: '1.5px solid var(--nya-sirius)', display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(0,229,160,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--nya-sirius)' }}>
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 900, color: 'var(--nya-sirius)' }}>SIRIUS PASS ACTIF</h4>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Prochaine facturation automatique le 20 Juillet 2026</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Gold Star / Crown Graphic Emblem */}
                    <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                            style={{ width: 340, height: 340, opacity: 0.15, position: 'absolute' }}
                        >
                            <svg viewBox="0 0 100 100" fill="none">
                                <circle cx="50" cy="50" r="45" stroke="var(--nya-gold)" strokeWidth="0.5" strokeDasharray="3 3" />
                                <polygon points="50,5 63,35 95,35 70,55 80,85 50,70 20,85 30,55 5,35 37,35" stroke="var(--nya-gold)" strokeWidth="0.5" />
                            </svg>
                        </motion.div>
                        <div style={{
                            width: 220, height: 280, borderRadius: 24, background: 'linear-gradient(135deg, #161620, #0a0a0f)',
                            border: '1.5px solid var(--nya-gold)', display: 'flex', flexDirection: 'column', alignItems: 'center',
                            justifyContent: 'center', gap: 20, boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(212,160,23,0.15)'
                        }}>
                            <Crown size={64} style={{ color: 'var(--nya-gold)' }} />
                            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, letterSpacing: '0.1em', color: '#fff' }}>INITIÉ VIP</span>
                            <div style={{ fontSize: '0.55rem', fontWeight: 800, color: 'var(--nya-gold)', background: 'rgba(212,160,23,0.1)', padding: '4px 12px', borderRadius: 8 }}>SIRIUS PRO</div>
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                    {[
                        { icon: Zap, title: 'Livraisons Illimitées Gratuites', desc: 'Frais de livraison à 0 Nya Coin / 0 FCFA pour toutes vos commandes Nya Food de plus de 5 000 FCFA.' },
                        { icon: Award, title: 'Courses VTC Privilégiées', desc: 'Bénéficiez de 10% de réduction automatique et de chauffeurs prioritaires sur tous vos trajets VTC Sirius.' },
                        { icon: Sparkles, title: 'Multiplicateur Nya Coins', desc: 'Doublez vos gains de Nya Coins sur tous vos paiements de factures et demandes de documents au Mini-Hub.' }
                    ].map((benefit, i) => (
                        <div key={i} className="toguna-glass" style={{ padding: 28, borderRadius: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--nya-gold)' }}>
                                <benefit.icon size={20} />
                            </div>
                            <div>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 900, color: '#fff', marginBottom: 8 }}>{benefit.title}</h3>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{benefit.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </main>
            <Footer />
        </div>
    )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { useNotificationStore } from '../stores/notificationStore'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import { Rocket, DollarSign, Award, Bot } from 'lucide-react'

export default function Startup() {
    const { addCoins, addScore } = useAuthStore()
    const { push } = useNotificationStore()

    const [name, setName] = useState('')
    const [sector, setSector] = useState('Agrotech')
    const [desc, setDesc] = useState('')
    const [pitching, setPitching] = useState(false)
    const [result, setResult] = useState<any | null>(null)

    const handlePitch = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name || !desc) return

        setPitching(true)
        setResult(null)

        setTimeout(() => {
            const score = Math.floor(Math.random() * 2) + 4 // 4 or 5 stars for positive feedback
            const funding = score === 5 ? 150 : 80
            
            addCoins(funding)
            addScore(score * 30)

            setResult({
                score,
                funding,
                comment: score === 5 
                    ? "Exceptionnel ! L'analyseur du Conseil de Sirius décèle un immense potentiel d'impact en Afrique de l'Ouest. Financement maximal accordé."
                    : "Projet très solide. La viabilité économique est prouvée. Des ajustements mineurs sur la distribution sont suggérés."
            })
            setPitching(false)

            push({
                type: 'reward',
                title: 'Pitch Réussi',
                message: `Votre startup a levé ${funding} Nya Coins auprès du Conseil.`,
                icon: '🚀',
                color: '#00E5A0'
            })
        }, 3000)
    }

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 100 }}>
            <Starfield />
            <CosmicBackground />
            <Navbar />

            {/* Main content */}
            <main className="max-w-container" style={{ paddingTop: 120, position: 'relative', zIndex: 2 }}>
                
                {/* Hero Header */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginBottom: 48 }}>
                    <div className="cosmo-label">Conseil Sirius {" > "} Incubation</div>
                    <h1 className="text-shimmer" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                        STARTUP INCUBATOR
                    </h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, alignItems: 'center' }}>
                    
                    {/* Pitch Form */}
                    <div style={{
                        background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                        borderRadius: 24, padding: 32, boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
                    }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 900, color: '#fff', marginBottom: 20 }}>
                            SOUMETTRE VOTRE PROJET AU CONSEIL
                        </h3>

                        <form onSubmit={handlePitch} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>NOM DE LA STARTUP</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ex: IvoireSolar"
                                    required
                                    style={{
                                        width: '100%', padding: '12px 16px',
                                        background: 'var(--bg-primary)', border: '1px solid var(--border-default)',
                                        borderRadius: 12, color: 'var(--text-primary)', outline: 'none'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>SECTEUR D'ACTIVITÉ</label>
                                <select
                                    value={sector}
                                    onChange={(e) => setSector(e.target.value)}
                                    style={{
                                        width: '100%', padding: '12px 16px',
                                        background: 'var(--bg-primary)', border: '1px solid var(--border-default)',
                                        borderRadius: 12, color: 'var(--text-primary)', outline: 'none'
                                    }}
                                >
                                    <option value="Agrotech">🌾 Agrotech</option>
                                    <option value="Fintech">💳 Fintech</option>
                                    <option value="Green Energy">☀️ Énergie Solaire</option>
                                    <option value="Edtech">🎓 Éducation / Edtech</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>PITCH / DESCRIPTION</label>
                                <textarea
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)}
                                    placeholder="Décrivez votre produit, votre cible et votre modèle économique..."
                                    required
                                    rows={4}
                                    style={{
                                        width: '100%', padding: '12px 16px',
                                        background: 'var(--bg-primary)', border: '1px solid var(--border-default)',
                                        borderRadius: 12, color: 'var(--text-primary)', outline: 'none',
                                        fontSize: '0.85rem', lineHeight: 1.6, resize: 'none'
                                    }}
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={pitching}
                                style={{
                                    padding: '16px', borderRadius: 12,
                                    background: 'var(--nya-ochre)', border: 'none',
                                    color: '#fff', fontWeight: 800, letterSpacing: '0.1em',
                                    textTransform: 'uppercase', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                                }}
                            >
                                {pitching ? (
                                    <>
                                        <div style={{ width: 14, height: 14, border: '2px solid #fff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                        ANALYSE JURY...
                                    </>
                                ) : (
                                    <>
                                        <Rocket size={16} /> PITCHER AU CONSEIL
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </div>

                    {/* Results panel */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <AnimatePresence mode="wait">
                            {result ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{
                                        background: 'var(--nya-deep)', border: '1px solid rgba(0,229,160,0.3)',
                                        borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column', gap: 20
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 900, color: '#00E5A0' }}>RÉSOLUTION DU JURY</h4>
                                        <div style={{ display: 'flex', gap: 2 }}>
                                            {Array.from({ length: result.score }).map((_, i) => (
                                                <Award key={i} size={16} style={{ color: 'var(--nya-gold)' }} />
                                            ))}
                                        </div>
                                    </div>

                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                        {result.comment}
                                    </p>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(0,229,160,0.08)', padding: '16px 20px', borderRadius: 16 }}>
                                        <DollarSign style={{ color: '#00E5A0' }} />
                                        <div>
                                            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>FINANCEMENT ACCORDÉ</div>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>{result.funding} Nya Coins</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="placeholder"
                                    style={{
                                        background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                                        borderRadius: 24, padding: 32, textAlign: 'center', color: 'var(--text-faint)'
                                    }}
                                >
                                    <Bot size={48} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
                                    <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Jury en attente de pitch</p>
                                    <p style={{ fontSize: '0.7rem', marginTop: 4 }}>
                                        Soumettez votre projet à gauche pour recevoir l'évaluation du Conseil Sirius.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>

            </main>
            <Footer />
        </div>
    )
}

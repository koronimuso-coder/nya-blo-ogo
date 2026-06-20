import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { useNotificationStore } from '../stores/notificationStore'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import { Heart, Check, Users, ArrowUpRight } from 'lucide-react'

interface Project {
    id: string
    title: string
    desc: string
    raised: number
    goal: number
    backers: number
    gradient: string
}

export default function Crowdfunding() {
    const { user, addTransaction } = useAuthStore()
    const { push } = useNotificationStore()

    const [projects, setProjects] = useState<Project[]>([
        { id: '1', title: 'Pompes Solaires Bandiagara', desc: 'Installation de pompes à eau solaires automatisées pour les cultures agricoles des falaises Dogon.', raised: 400, goal: 500, backers: 28, gradient: 'linear-gradient(135deg, #0a2e1a 0%, #00E5A0 100%)' },
        { id: '2', title: 'Tissage Bogolan Abidjan', desc: 'Soutien aux coopératives de femmes artisanes pour la digitalisation de la broderie traditionnelle bogolan.', raised: 135, goal: 300, backers: 14, gradient: 'linear-gradient(135deg, #2e1a0a 0%, #D4A017 100%)' },
        { id: '3', title: 'Écrans Nommo pour Écoles', desc: 'Distribution de tablettes éducatives chargées avec le programme de l\'Académie des Scribes.', raised: 240, goal: 400, backers: 32, gradient: 'linear-gradient(135deg, #0a0a2e 0%, #3b82f6 100%)' }
    ])

    const [supportAmount, setSupportAmount] = useState<Record<string, string>>({})

    const handlePledge = (projectId: string) => {
        const amountStr = supportAmount[projectId]
        const coins = parseInt(amountStr)
        if (!coins || coins <= 0) return

        if ((user?.nyaCoins ?? 0) < coins) {
            push({
                type: 'system',
                title: 'Transaction impossible',
                message: 'Solde de Nya Coins insuffisant.',
                icon: '⚠️',
                color: '#ef4444'
            })
            return
        }

        // Deduct coins and log transaction
        const targetProj = projects.find(p => p.id === projectId)
        if (!targetProj) return

        addTransaction(`Soutien Projet: ${targetProj.title}`, coins, 'debit')

        setProjects(prev => prev.map(p => {
            if (p.id !== projectId) return p
            return {
                ...p,
                raised: Math.min(p.goal, p.raised + coins),
                backers: p.backers + 1
            }
        }))

        setSupportAmount(prev => ({ ...prev, [projectId]: '' }))

        push({
            type: 'reward',
            title: 'Soutien Enregistré',
            message: `Merci pour votre don de ${coins} Nya Coins au projet !`,
            icon: '❤️',
            color: '#00E5A0'
        })
    }

    const formatPrice = (n: number) => n.toLocaleString('fr-FR')

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 100 }}>
            <Starfield />
            <CosmicBackground />
            <Navbar />

            {/* Main content */}
            <main className="max-w-container" style={{ paddingTop: 120, position: 'relative', zIndex: 2 }}>
                
                {/* Hero Header */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginBottom: 48 }}>
                    <div className="cosmo-label">Conseil Sirius {" > "} Projets Communautaires</div>
                    <h1 className="text-shimmer" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                        CROWDFUNDING
                    </h1>
                </div>

                {/* Projects list */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
                    {projects.map((proj) => {
                        const progress = (proj.raised / proj.goal) * 100
                        const isFinished = proj.raised >= proj.goal

                        return (
                            <motion.div
                                key={proj.id}
                                whileHover={{ y: -6 }}
                                style={{
                                    background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                                    borderRadius: 24, padding: 32, display: 'flex', flexDirection: 'column',
                                    justifyContent: 'space-between', minHeight: 450,
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                                }}
                            >
                                <div>
                                    {/* Cover gradient */}
                                    <div style={{
                                        width: '100%', height: 120, borderRadius: 16,
                                        background: proj.gradient, display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        color: '#fff', fontSize: '2.5rem', marginBottom: 20
                                    }}>
                                        <Heart />
                                    </div>

                                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 900, color: '#fff', marginBottom: 12 }}>
                                        {proj.title}
                                    </h3>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
                                        {proj.desc}
                                    </p>
                                </div>

                                {/* Financing progress */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                                            <span>SOLDE FINANCÉ</span>
                                            <span>{Math.floor(progress)}%</span>
                                        </div>
                                        <div style={{ width: '100%', height: 6, background: 'var(--bg-primary)', borderRadius: 3, overflow: 'hidden' }}>
                                            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--nya-gold)', borderRadius: 3 }} />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 8 }}>
                                            <span>{formatPrice(proj.raised)} Coins</span>
                                            <span>Objectif: {formatPrice(proj.goal)} Coins</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-default)', paddingTop: 12 }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={12} /> {proj.backers} Scribes</span>
                                        {isFinished && <span style={{ color: '#00E5A0', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}><Check size={12} /> FINANCÉ</span>}
                                    </div>

                                    {/* Action forms */}
                                    {!isFinished && (
                                        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                            <input
                                                type="number"
                                                value={supportAmount[proj.id] || ''}
                                                onChange={(e) => setSupportAmount(prev => ({ ...prev, [proj.id]: e.target.value }))}
                                                placeholder="Montant"
                                                min="1"
                                                style={{
                                                    width: 90, padding: '10px',
                                                    background: 'var(--bg-primary)', border: '1px solid var(--border-default)',
                                                    borderRadius: 10, color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none'
                                                }}
                                            />
                                            <motion.button
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={() => handlePledge(proj.id)}
                                                style={{
                                                    flex: 1, padding: '10px', borderRadius: 10,
                                                    background: 'var(--nya-ochre)', border: 'none',
                                                    color: '#fff', fontWeight: 800, fontSize: '0.75rem',
                                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4
                                                }}
                                            >
                                                Soutenir <ArrowUpRight size={14} />
                                            </motion.button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

            </main>
            <Footer />
        </div>
    )
}

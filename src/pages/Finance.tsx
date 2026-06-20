import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { useNotificationStore } from '../stores/notificationStore'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import {
    TrendingUp, Award, Plus, Lock, Calendar, Users, CheckCircle
} from 'lucide-react'

interface Tontine {
    id: string
    name: string
    membersCount: number
    contribution: number
    totalPot: number
    cycle: string
    joined: boolean
    roundIndex: number
    roundParticipants: string[]
}

interface KoloGoal {
    id: string
    title: string
    target: number
    current: number
    lockDate: string
}

export default function Finance() {
    const { user, addTransaction } = useAuthStore()
    const { push } = useNotificationStore()

    // ─── Tontine State ───
    const [tontines, setTontines] = useState<Tontine[]>([
        {
            id: 't1',
            name: 'Tontine des Commerçantes de Cocody',
            membersCount: 10,
            contribution: 100,
            totalPot: 1000,
            cycle: 'Mensuelle',
            joined: false,
            roundIndex: 3,
            roundParticipants: ['Fatou Diallo', 'Maman Goli', 'Mariam Touré', 'Vous', 'Awa Diabaté', 'Koffi', 'Saliou', 'Yacouba', 'Aminata', 'Soro']
        },
        {
            id: 't2',
            name: 'Cercle de Confiance des Scribes',
            membersCount: 6,
            contribution: 250,
            totalPot: 1500,
            cycle: 'Hebdomadaire',
            joined: true,
            roundIndex: 1,
            roundParticipants: ['Sultan Kone', 'Vous', 'Awa Diabaté', 'Dr. Niamkey', 'Mariam Touré', 'Kone S.']
        }
    ])

    // ─── Kolo Goals State ───
    const [kolos, setKolos] = useState<KoloGoal[]>([
        { id: 'k1', title: 'Achat Moto VTC Sirius', target: 2000, current: 650, lockDate: '2026-08-15' },
        { id: 'k2', title: 'Frais de Scribe Académie', target: 500, current: 350, lockDate: '2026-07-01' }
    ])

    const [newKoloTitle, setNewKoloTitle] = useState('')
    const [newKoloTarget, setNewKoloTarget] = useState('')
    const [koloDepositId, setKoloDepositId] = useState<string | null>(null)
    const [depositAmount, setDepositAmount] = useState('')

    // ─── Loan State ───
    const [loanState, setLoanState] = useState<'idle' | 'checking' | 'approved' | 'active'>('idle')
    const [selectedLoanTier, setSelectedLoanTier] = useState<1 | 2>(1)
    const [activeLoanAmount, setActiveLoanAmount] = useState(0)

    // Calculate user's credit eligibility
    const creditScore = Math.min(100, Math.floor(((user?.nyaScore ?? 0) / 20) + ((user?.streak ?? 0) * 5)))

    // ─── Tontine Logic ───
    const handleJoinTontine = (id: string) => {
        setTontines(prev => prev.map(t => {
            if (t.id === id) {
                push({
                    type: 'system',
                    title: 'Tontine rejointe !',
                    message: `Vous avez rejoint "${t.name}". Prochaine cotisation bientôt.`,
                    icon: '🤝',
                    color: 'var(--nya-sirius)'
                })
                return { ...t, joined: true }
            }
            return t
        }))
    }

    const handlePayTontine = (t: Tontine) => {
        if ((user?.nyaCoins ?? 0) < t.contribution) {
            push({
                type: 'system',
                title: 'Coins insuffisants',
                message: 'Vous n\'avez pas assez de Nya Coins pour votre cotisation.',
                icon: '⚠️',
                color: 'var(--nya-red)'
            })
            return
        }

        addTransaction(`Cotisation Tontine - ${t.name}`, t.contribution, 'debit')
        push({
            type: 'reward',
            title: 'Cotisation versée',
            message: `Votre cotisation de ${t.contribution} Coins a été enregistrée avec succès.`,
            icon: '🪙',
            color: 'var(--nya-sirius)'
        })
    }

    // ─── Kolo Safe Logic ───
    const handleCreateKolo = (e: React.FormEvent) => {
        e.preventDefault()
        const target = parseInt(newKoloTarget)
        if (!newKoloTitle || isNaN(target) || target <= 0) return

        const newKolo: KoloGoal = {
            id: `k-${Date.now()}`,
            title: newKoloTitle,
            target,
            current: 0,
            lockDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // lock 30 days
        }

        setKolos(prev => [...prev, newKolo])
        setNewKoloTitle('')
        setNewKoloTarget('')
        push({
            type: 'system',
            title: 'Kolo Safe Créé !',
            message: `Votre tirelire "${newKolo.title}" est active.`,
            icon: '🔒',
            color: 'var(--nya-ochre)'
        })
    }

    const handleKoloDepositSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const amount = parseInt(depositAmount)
        if (!koloDepositId || isNaN(amount) || amount <= 0) return

        if ((user?.nyaCoins ?? 0) < amount) {
            push({
                type: 'system',
                title: 'Coins insuffisants',
                message: 'Solde insuffisant pour alimenter votre Kolo.',
                icon: '⚠️',
                color: 'var(--nya-red)'
            })
            return
        }

        addTransaction(`Épargne Kolo Safe`, amount, 'debit')
        setKolos(prev => prev.map(k => {
            if (k.id === koloDepositId) {
                return { ...k, current: k.current + amount }
            }
            return k
        }))

        setKoloDepositId(null)
        setDepositAmount('')
        push({
            type: 'reward',
            title: 'Tirelire Alimentée',
            message: `Vous avez sécurisé ${amount} Nya Coins dans votre Kolo Safe.`,
            icon: '🔒',
            color: 'var(--nya-gold)'
        })
    }

    // ─── Micro-Loan Logic ───
    const handleApplyLoan = (tier: 1 | 2) => {
        if (creditScore < (tier === 1 ? 40 : 70)) {
            push({
                type: 'system',
                title: 'Score insuffisant',
                message: `Votre score d'initié (${creditScore}%) est trop bas pour ce niveau de crédit.`,
                icon: '⚠️',
                color: 'var(--nya-red)'
            })
            return
        }

        setSelectedLoanTier(tier)
        setLoanState('checking')

        setTimeout(() => {
            setLoanState('approved')
        }, 2200)
    }

    const handleConfirmLoan = () => {
        const principal = selectedLoanTier === 1 ? 100 : 500
        setLoanState('active')
        setActiveLoanAmount(principal)
        addTransaction(`Micro-Prêt Sirius accordé`, principal, 'credit')
        push({
            type: 'reward',
            title: 'Fonds débloqués !',
            message: `Le crédit de ${principal} Nya Coins a été versé dans votre portefeuille.`,
            icon: '💸',
            color: 'var(--nya-sirius)'
        })
    }

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 100 }}>
            <Starfield />
            <CosmicBackground />
            <Navbar />

            <main className="max-w-container" style={{ paddingTop: 120, position: 'relative', zIndex: 2 }}>
                
                {/* Header */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
                    <div className="cosmo-label">Écosystème Sirius {" > "} Nya Finance</div>
                    <h1 className="text-shimmer" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                        NYA FINANCE
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 600 }}>
                        Financez vos projets et sécurisez vos avoirs grâce aux tontines communautaires, aux tirelires verrouillées, et aux micro-crédits instantanés validés par l'Oracle.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 40, alignItems: 'start' }}>
                    
                    {/* Left Column: Tontines & Kolo Safe */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
                        
                        {/* ─── TONTINES SECTION ─── */}
                        <div style={{
                            background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                            borderRadius: 24, padding: 24
                        }}>
                            <h3 style={{
                                fontFamily: 'var(--font-display)', fontSize: '1.3rem',
                                fontWeight: 900, color: 'var(--text-primary)', marginBottom: 8,
                                display: 'flex', alignItems: 'center', gap: 10
                            }}>
                                <Users size={20} style={{ color: 'var(--nya-ochre)' }} />
                                TONTINES COSMIQUES (CERCLES D'ÉPARGNE)
                            </h3>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 24 }}>
                                Rejoignez une épargne tournante collective. Chaque cycle, un membre reçoit l'intégralité du pot de cotisation.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {tontines.map(t => (
                                    <div
                                        key={t.id}
                                        className="toguna-glass"
                                        style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                                            <div>
                                                <h4 style={{ fontSize: '0.95rem', color: '#fff' }}>{t.name}</h4>
                                                <span style={{ fontSize: '0.65rem', color: 'var(--nya-gold)', fontWeight: 800 }}>
                                                    {t.cycle.toUpperCase()} • {t.membersCount} MEMBRES
                                                </span>
                                            </div>

                                            {t.joined ? (
                                                <button
                                                    onClick={() => handlePayTontine(t)}
                                                    className="btn-nexus"
                                                    style={{ padding: '8px 16px', fontSize: '0.65rem', background: 'var(--nya-sirius)', color: '#000' }}
                                                >
                                                    COTISER ({t.contribution} Coins)
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleJoinTontine(t.id)}
                                                    className="btn-secondary"
                                                    style={{ padding: '8px 16px', fontSize: '0.65rem' }}
                                                >
                                                    REJOINDRE LE CERCLE
                                                </button>
                                            )}
                                        </div>

                                        {/* Tontine Round Visualizer */}
                                        <div>
                                            <div className="accent-label" style={{ fontSize: '0.55rem', marginBottom: 8 }}>ORDRE DE TOURNÉE DU POT ({t.totalPot} Coins)</div>
                                            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6 }}>
                                                {t.roundParticipants.map((p, idx) => {
                                                    const isSelf = p === 'Vous'
                                                    const isCurrent = idx === t.roundIndex
                                                    const isPast = idx < t.roundIndex
                                                    return (
                                                        <div
                                                            key={idx}
                                                            style={{
                                                                flexShrink: 0, padding: '6px 12px', borderRadius: 8,
                                                                background: isCurrent ? 'rgba(212,160,23,0.12)' : isPast ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
                                                                border: isCurrent ? '1.5px solid var(--nya-gold)' : isSelf ? '1px dashed var(--nya-ochre)' : '1px solid var(--border-default)',
                                                                textAlign: 'center', minWidth: 90
                                                            }}
                                                        >
                                                            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: isCurrent ? 'var(--nya-gold)' : isSelf ? 'var(--nya-ochre)' : '#fff' }}>
                                                                {p}
                                                            </div>
                                                            <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                                                {isCurrent ? '👑 En cours' : isPast ? '✅ Reçu' : `Mois ${idx + 1}`}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ─── KOLO SAFE SECTION ─── */}
                        <div style={{
                            background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                            borderRadius: 24, padding: 24
                        }}>
                            <h3 style={{
                                fontFamily: 'var(--font-display)', fontSize: '1.3rem',
                                fontWeight: 900, color: 'var(--text-primary)', marginBottom: 8,
                                display: 'flex', alignItems: 'center', gap: 10
                            }}>
                                <Lock size={20} style={{ color: 'var(--nya-gold)' }} />
                                KOLO SAFE (TIRELIBRES BLOQUÉES)
                            </h3>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 24 }}>
                                Bloquez des Coins pour un objectif précis. Ils ne pourront pas être dépensés avant la date de libération choisie.
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 24 }}>
                                
                                {/* Kolo Creation */}
                                <form onSubmit={handleCreateKolo} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    <h4 style={{ fontSize: '0.85rem', color: '#fff' }}>FORGER UN NOUVEAU KOLO</h4>
                                    <div>
                                        <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>OBJECTIF DE L'ÉPARGNE</label>
                                        <input
                                            type="text"
                                            value={newKoloTitle}
                                            onChange={(e) => setNewKoloTitle(e.target.value)}
                                            placeholder="Ex: Épargne d'urgence"
                                            required
                                            style={{
                                                width: '100%', padding: '10px 12px', fontSize: '0.75rem',
                                                background: 'var(--bg-primary)', border: '1px solid var(--border-default)',
                                                borderRadius: 10, color: '#fff', outline: 'none'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>CIBLE (NYA COINS)</label>
                                        <input
                                            type="number"
                                            value={newKoloTarget}
                                            onChange={(e) => setNewKoloTarget(e.target.value)}
                                            placeholder="Ex: 1000"
                                            required
                                            min="50"
                                            style={{
                                                width: '100%', padding: '10px 12px', fontSize: '0.75rem',
                                                background: 'var(--bg-primary)', border: '1px solid var(--border-default)',
                                                borderRadius: 10, color: '#fff', outline: 'none'
                                            }}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                        style={{ padding: '10px', fontSize: '0.7rem', borderRadius: 10, display: 'flex', justifyContent: 'center' }}
                                    >
                                        <Plus size={14} /> FORGER LA TIRELIRE
                                    </button>
                                </form>

                                {/* Kolo List */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    <h4 style={{ fontSize: '0.85rem', color: '#fff' }}>VOS TIRELIRES ACTIVES</h4>
                                    {kolos.map(k => {
                                        const progress = Math.min(100, Math.floor((k.current / k.target) * 100))
                                        return (
                                            <div
                                                key={k.id}
                                                className="toguna-glass"
                                                style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fff' }}>{k.title}</span>
                                                    <Lock size={12} style={{ color: 'var(--nya-gold)' }} />
                                                </div>

                                                {/* progress bar */}
                                                <div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                                                        <span>{k.current} / {k.target} Coins</span>
                                                        <span>{progress}%</span>
                                                    </div>
                                                    <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                                                        <div style={{ width: `${progress}%`, height: '100%', background: 'var(--nya-gold)' }} />
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                                                    <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        <Calendar size={10} /> Déblocage : {k.lockDate}
                                                    </span>
                                                    <button
                                                        onClick={() => setKoloDepositId(k.id)}
                                                        className="btn-nexus"
                                                        style={{ padding: '4px 10px', fontSize: '0.6rem' }}
                                                    >
                                                        DÉPOSER
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                            </div>
                        </div>

                    </div>

                    {/* Right Column: Micro-Loans & Credit Score */}
                    <div style={{ position: 'sticky', top: 120, display: 'flex', flexDirection: 'column', gap: 32 }}>
                        
                        {/* Credit score dashboard */}
                        <div style={{
                            background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                            borderRadius: 24, padding: 24
                        }}>
                            <h3 style={{
                                fontFamily: 'var(--font-display)', fontSize: '1.2rem',
                                fontWeight: 900, color: 'var(--text-primary)', marginBottom: 20,
                                display: 'flex', alignItems: 'center', gap: 10
                            }}>
                                <Award size={18} style={{ color: 'var(--nya-gold)' }} />
                                ÉLIGIBILITÉ AU CRÉDIT
                            </h3>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 20 }}>
                                <div style={{
                                    width: 80, height: 80, borderRadius: '50%',
                                    border: '4px solid rgba(212,160,23,0.1)', borderTop: '4px solid var(--nya-gold)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.4rem', fontWeight: 900, color: 'var(--nya-gold)',
                                    fontFamily: 'var(--font-display)'
                                }}>
                                    {creditScore}%
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fff' }}>Score de confiance Sirius</span>
                                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: 1.4, marginTop: 4 }}>
                                        Votre score augmente en validant vos cours de l'Académie, en cotisant aux tontines et en maintenant votre séquence quotidienne.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Loans Portal */}
                        <div style={{
                            background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                            borderRadius: 24, padding: 24
                        }}>
                            <h3 style={{
                                fontFamily: 'var(--font-display)', fontSize: '1.2rem',
                                fontWeight: 900, color: 'var(--text-primary)', marginBottom: 8,
                                display: 'flex', alignItems: 'center', gap: 10
                            }}>
                                <TrendingUp size={18} style={{ color: 'var(--nya-sirius)' }} />
                                MICRO-PRÊTS INSTANTANÉS
                            </h3>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 20 }}>
                                Financement d'urgence de courte durée sans garantie.
                            </p>

                            <AnimatePresence mode="wait">
                                {loanState === 'idle' && (
                                    <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                        {/* Tier 1 Loan */}
                                        <div className="toguna-glass" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>Prêt Éclair (Tier 1)</span>
                                                <span style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--nya-gold)' }}>100 Coins</span>
                                            </div>
                                            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Intérêt : 0% • Remboursement : 14 jours • Score requis : 40%</p>
                                            <button
                                                onClick={() => handleApplyLoan(1)}
                                                className="btn-nexus"
                                                style={{ marginTop: 8, fontSize: '0.65rem', alignSelf: 'flex-start' }}
                                            >
                                                DEMANDER LE PRÊT
                                            </button>
                                        </div>

                                        {/* Tier 2 Loan */}
                                        <div className="toguna-glass" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>Crédit Toguna (Tier 2)</span>
                                                <span style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--nya-gold)' }}>500 Coins</span>
                                            </div>
                                            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Intérêt : 2% • Remboursement : 30 jours • Score requis : 70%</p>
                                            <button
                                                onClick={() => handleApplyLoan(2)}
                                                className="btn-nexus"
                                                style={{ marginTop: 8, fontSize: '0.65rem', alignSelf: 'flex-start' }}
                                            >
                                                DEMANDER LE PRÊT
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {loanState === 'checking' && (
                                    <motion.div key="checking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', padding: '40px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        <div style={{
                                            width: 40, height: 40, margin: '0 auto',
                                            border: '2px solid rgba(0,229,160,0.1)', borderTop: '2px solid var(--nya-sirius)',
                                            borderRadius: '50%', animation: 'spin 1s linear infinite'
                                        }} />
                                        <div>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--nya-sirius)' }}>ANALYSE DE L'ORACLE...</div>
                                            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 4 }}>Vérification des registres de transactions sur le Nexus Sirius.</p>
                                        </div>
                                    </motion.div>
                                )}

                                {loanState === 'approved' && (
                                    <motion.div key="approved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'center' }}>
                                        <div style={{ fontSize: '2.5rem' }}>🎉</div>
                                        <div>
                                            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--nya-sirius)' }}>PRÊT APPROUVÉ !</div>
                                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                                L'Oracle a validé votre demande pour un montant de {selectedLoanTier === 1 ? 100 : 500} Nya Coins.
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 8 }}>
                                            <button onClick={() => setLoanState('idle')} className="btn-secondary" style={{ padding: '8px 20px', fontSize: '0.65rem' }}>
                                                ANNULER
                                            </button>
                                            <button onClick={handleConfirmLoan} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.65rem' }}>
                                                ACCEPTER LES FONDS
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {loanState === 'active' && (
                                    <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="toguna-glass" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12, border: '1px solid var(--nya-sirius)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--nya-sirius)' }}>PRÊT EN COURS</span>
                                            <CheckCircle size={16} style={{ color: 'var(--nya-sirius)' }} />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Montant Dû :</span>
                                            <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--nya-gold)' }}>{activeLoanAmount} Coins</span>
                                        </div>
                                        <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                                            Ce montant sera automatiquement prélevé de votre portefeuille lors de la prochaine synchronisation.
                                        </p>
                                        <button
                                            onClick={() => {
                                                if ((user?.nyaCoins ?? 0) >= activeLoanAmount) {
                                                    addTransaction(`Remboursement Micro-prêt`, activeLoanAmount, 'debit')
                                                    setLoanState('idle')
                                                    setActiveLoanAmount(0)
                                                    push({
                                                        type: 'reward',
                                                        title: 'Prêt Remboursé !',
                                                        message: 'Félicitations, vous avez remboursé votre micro-prêt. Votre score a augmenté !',
                                                        icon: '🛡️',
                                                        color: 'var(--nya-sirius)'
                                                    })
                                                } else {
                                                    push({
                                                        type: 'system',
                                                        title: 'Coins insuffisants',
                                                        message: 'Vous devez disposer de la totalité des coins pour rembourser.',
                                                        icon: '⚠️',
                                                        color: 'var(--nya-red)'
                                                    })
                                                }
                                            }}
                                            className="btn-nexus"
                                            style={{ background: 'var(--nya-sirius)', color: '#000', fontSize: '0.65rem', marginTop: 4 }}
                                        >
                                            REMBOURSER MAINTENANT
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                    </div>

                </div>

            </main>

            {/* Modal deposit to Kolo */}
            <AnimatePresence>
                {koloDepositId && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex',
                        alignItems: 'center', justifyContent: 'center', padding: 20
                    }}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="toguna-glass-strong"
                            style={{ padding: 32, maxWidth: 380, width: '100%', border: '1px solid var(--nya-gold)' }}
                        >
                            <h3 style={{ fontSize: '1.2rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Lock size={16} style={{ color: 'var(--nya-gold)' }} />
                                DÉPÔT KOLO SAFE
                            </h3>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 20 }}>
                                Transférer des coins depuis votre solde principal vers cette tirelire verrouillée.
                            </p>

                            <form onSubmit={handleKoloDepositSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div>
                                    <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>MONTANT A SÉCURISER</label>
                                    <input
                                        type="number"
                                        value={depositAmount}
                                        onChange={(e) => setDepositAmount(e.target.value)}
                                        required
                                        placeholder="0"
                                        min="1"
                                        style={{
                                            width: '100%', padding: '12px 14px', fontSize: '0.8rem',
                                            background: 'var(--bg-primary)', border: '1px solid var(--border-default)',
                                            borderRadius: 12, color: '#fff', outline: 'none'
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                                    <button
                                        type="button"
                                        onClick={() => setKoloDepositId(null)}
                                        className="btn-secondary"
                                        style={{ flex: 1, padding: '12px', fontSize: '0.75rem', borderRadius: 12 }}
                                    >
                                        ANNULER
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                        style={{ flex: 1, padding: '12px', fontSize: '0.75rem', borderRadius: 12 }}
                                    >
                                        SÉCURISER
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    )
}

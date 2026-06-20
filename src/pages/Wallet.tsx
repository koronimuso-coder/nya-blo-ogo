import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { useNotificationStore } from '../stores/notificationStore'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import { ArrowUpRight, ArrowDownLeft, Coins, CreditCard, Send, Search, Activity } from 'lucide-react'

export default function Wallet() {
    const { user, transactions, addTransaction } = useAuthStore()
    const { push } = useNotificationStore()

    const [recipient, setRecipient] = useState('')
    const [amount, setAmount] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [cardFlipped, setCardFlipped] = useState(false)

    // 3D Card Hover Effect Coordinates
    const [rotateX, setRotateX] = useState(0)
    const [rotateY, setRotateY] = useState(0)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2
        // Max tilt degree
        setRotateY((x / (rect.width / 2)) * 15)
        setRotateX(-(y / (rect.height / 2)) * 15)
    }

    const handleMouseLeave = () => {
        setRotateX(0)
        setRotateY(0)
    }

    const formatPrice = (n: number) => n.toLocaleString('fr-FR')

    const handleTransferSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const coins = parseInt(amount)
        if (!coins || coins <= 0) return
        if ((user?.nyaCoins ?? 0) < coins) {
            push({
                type: 'system',
                title: 'Transaction échouée',
                message: 'Solde de Nya Coins insuffisant pour cet échange.',
                icon: '⚠️',
                color: '#ef4444'
            })
            return
        }

        setIsSending(true)

        // Simulate network latency
        setTimeout(() => {
            addTransaction(`Transfert à ${recipient}`, coins, 'debit')
            setIsSending(false)
            setRecipient('')
            setAmount('')
            push({
                type: 'reward',
                title: 'Transfert effectué',
                message: `Vous avez envoyé ${formatPrice(coins)} Nya Coins à ${recipient}.`,
                icon: '💸',
                color: '#00E5A0'
            })
        }, 1800)
    }

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 100 }}>
            <Starfield />
            <CosmicBackground />
            <Navbar />

            {/* Main content */}
            <main className="max-w-container" style={{ paddingTop: 120, position: 'relative', zIndex: 2 }}>
                
                {/* Hero Header */}
                <div style={{
                    display: 'flex', flexDirection: 'column', gap: 32,
                    marginBottom: 48
                }}>
                    <div className="cosmo-label">Portefeuille Sirius {" > "} Finances</div>
                    <h1 className="text-shimmer" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                        PORTEFEUILLE
                    </h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, alignItems: 'start' }}>
                    
                    {/* Left side: Card Display and Stats */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                        
                        {/* 3D Holographic Card Container */}
                        <div style={{ perspective: 1000, width: '100%' }}>
                            <motion.div
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => setCardFlipped(!cardFlipped)}
                                style={{
                                    width: '100%',
                                    aspectRatio: '1.58 / 1',
                                    borderRadius: 24,
                                    background: 'linear-gradient(135deg, rgba(184,92,46,0.1) 0%, rgba(212,160,23,0.05) 50%, rgba(26,26,46,0.8) 100%)',
                                    border: '1px solid rgba(212,160,23,0.3)',
                                    boxShadow: '0 25px 50px rgba(0,0,0,0.6), inset 0 0 20px rgba(212,160,23,0.1)',
                                    backdropFilter: 'blur(15px)',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    transformStyle: 'preserve-3d',
                                    rotateX: cardFlipped ? 180 : rotateX,
                                    rotateY: cardFlipped ? 180 : rotateY,
                                    transition: cardFlipped ? 'transform 0.6s' : 'none',
                                    padding: '28px 32px',
                                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                                }}
                            >
                                {/* Card Front */}
                                {!cardFlipped ? (
                                    <>
                                        {/* Header */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', transform: 'translateZ(30px)' }}>
                                            <div>
                                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>SIRIUS</div>
                                                <div style={{ fontSize: '0.55rem', letterSpacing: '0.15em', color: 'var(--nya-ochre)', fontWeight: 700 }}>NEXUS CARD</div>
                                            </div>
                                            <div style={{ width: 45, height: 35, background: 'linear-gradient(45deg, #FFD700 0%, #D4A017 100%)', borderRadius: 8, opacity: 0.8 }} />
                                        </div>

                                        {/* Chip & Logo */}
                                        <div style={{ display: 'flex', gap: 16, alignItems: 'center', transform: 'translateZ(40px)' }}>
                                            <div style={{ width: 32, height: 26, background: '#C2A888', borderRadius: 6, position: 'relative' }}>
                                                <div style={{ width: '100%', height: '100%', border: '1px solid rgba(0,0,0,0.2)', borderRadius: 6 }} />
                                            </div>
                                            <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
                                                <path d="M20 4 L36 20 L20 36 L4 20 Z" stroke="var(--nya-gold)" strokeWidth="3" fill="none" />
                                                <path d="M20 14 L26 20 L20 26 L14 20 Z" fill="var(--nya-gold)" />
                                            </svg>
                                        </div>

                                        {/* Numbers */}
                                        <div style={{
                                            fontFamily: 'var(--font-mono)', fontSize: '1.4rem',
                                            letterSpacing: '0.15em', wordSpacing: '0.2em',
                                            color: '#fff', transform: 'translateZ(35px)',
                                            margin: '16px 0'
                                        }}>
                                            8888 7777 5555 {user?.id.split('-')[1]?.toUpperCase() || '1206'}
                                        </div>

                                        {/* Card Holder & Expiry */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', transform: 'translateZ(20px)' }}>
                                            <div>
                                                <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Initié</div>
                                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', marginTop: 4 }}>
                                                    {user?.displayName || 'Amadou Dogon'}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', fontWeight: 700 }}>VALIDITÉ</div>
                                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 800, color: '#fff', marginTop: 4 }}>06 / 28</div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    /* Card Back */
                                    <div style={{ transform: 'rotateY(180deg) translateZ(30px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                                        {/* Magnetic stripe */}
                                        <div style={{ background: '#000', height: 45, width: 'calc(100% + 64px)', marginLeft: -32, marginTop: 10 }} />
                                        
                                        {/* CVV panel */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
                                            <div style={{ background: '#fff', height: 36, flex: 1, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 12 }}>
                                                <span style={{ fontFamily: 'var(--font-mono)', color: '#000', fontStyle: 'italic', fontWeight: 800 }}>8888 7777</span>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <span style={{ fontSize: '0.5rem', color: 'var(--text-muted)', display: 'block' }}>CVV</span>
                                                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--nya-gold)', fontWeight: 900 }}>777</span>
                                            </div>
                                        </div>

                                        {/* Legal disclaimer */}
                                        <p style={{ fontSize: '0.5rem', color: 'var(--text-faint)', lineHeight: 1.4, textAlign: 'justify', marginTop: 20 }}>
                                            Cette carte virtuelle est émise par le Conseil de Sirius et régit sous la juridiction numérique du Toguna. Elle confère à son titulaire un accès privilégié aux modules sacrés de l'écosystème NYA BLO.
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        {/* Balance Stats cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div style={{
                                background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                                borderRadius: 16, padding: 20
                            }}>
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                    Solde de Coins
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                                    <Coins style={{ color: 'var(--nya-gold)' }} size={24} />
                                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: '#fff' }}>
                                        {formatPrice(user?.nyaCoins ?? 0)}
                                    </span>
                                </div>
                            </div>
                            <div style={{
                                background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                                borderRadius: 16, padding: 20
                            }}>
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                    Équivalent Fictif
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                                    <CreditCard style={{ color: 'var(--nya-ochre)' }} size={24} />
                                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 900, color: 'var(--nya-ochre)' }}>
                                        {formatPrice((user?.nyaCoins ?? 0) * 100)} FCFA
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Form: Send Coins */}
                        <div style={{
                            background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                            borderRadius: 24, padding: 24
                        }}>
                            <h3 style={{
                                fontFamily: 'var(--font-display)', fontSize: '1.2rem',
                                fontWeight: 900, color: 'var(--text-primary)', marginBottom: 20,
                                display: 'flex', alignItems: 'center', gap: 10
                            }}>
                                <Send size={18} style={{ color: 'var(--nya-ochre)' }} />
                                VIREMENT COSMIQUE
                            </h3>

                            <form onSubmit={handleTransferSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>DESTINATAIRE (PSEUDO)</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            value={recipient}
                                            onChange={(e) => setRecipient(e.target.value)}
                                            placeholder="Ex: SultanKone"
                                            required
                                            style={{
                                                width: '100%', padding: '12px 16px 12px 40px',
                                                background: 'var(--bg-primary)', border: '1px solid var(--border-default)',
                                                borderRadius: 12, color: 'var(--text-primary)', outline: 'none'
                                            }}
                                        />
                                        <Search size={16} style={{ position: 'absolute', left: 14, top: 15, color: 'var(--text-muted)' }} />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>MONTANT (NYA COINS)</label>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0"
                                        required
                                        min="1"
                                        style={{
                                            width: '100%', padding: '12px 16px',
                                            background: 'var(--bg-primary)', border: '1px solid var(--border-default)',
                                            borderRadius: 12, color: 'var(--text-primary)', outline: 'none'
                                        }}
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isSending}
                                    style={{
                                        padding: '16px', borderRadius: 12,
                                        background: 'var(--nya-ochre)', border: 'none',
                                        color: '#fff', fontWeight: 800, letterSpacing: '0.1em',
                                        textTransform: 'uppercase', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                        boxShadow: '0 8px 24px rgba(184,92,46,0.3)'
                                    }}
                                >
                                    {isSending ? (
                                        <>
                                            <div style={{ width: 14, height: 14, border: '2px solid #fff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                            ALIGNEMENT SIRIUS...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={16} /> INITIALISER LE VIREMENT
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </div>

                    </div>

                    {/* Right side: Ledger / Transactions */}
                    <div style={{
                        background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                        borderRadius: 24, padding: 24, height: '100%',
                        display: 'flex', flexDirection: 'column', gap: 24
                    }}>
                        <h3 style={{
                            fontFamily: 'var(--font-display)', fontSize: '1.2rem',
                            fontWeight: 900, color: 'var(--text-primary)',
                            display: 'flex', alignItems: 'center', gap: 10
                        }}>
                            <Activity size={18} style={{ color: 'var(--nya-gold)' }} />
                            REGISTRE DE COMPTES
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto', maxHeight: 520 }}>
                            {transactions.map((tx) => {
                                const isCredit = tx.type === 'credit'
                                return (
                                    <div
                                        key={tx.id}
                                        style={{
                                            background: 'var(--bg-elevated)',
                                            border: '1px solid var(--border-default)',
                                            borderRadius: 16, padding: '16px 20px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{
                                                width: 36, height: 36, borderRadius: '50%',
                                                background: isCredit ? 'rgba(0,229,160,0.1)' : 'rgba(239,68,68,0.1)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: isCredit ? '#00E5A0' : '#ef4444'
                                            }}>
                                                {isCredit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                                    {tx.label}
                                                </div>
                                                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                                    {new Date(tx.date).toLocaleDateString('fr-FR')} {new Date(tx.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{
                                            fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 800,
                                            color: isCredit ? '#00E5A0' : '#ef4444'
                                        }}>
                                            {isCredit ? '+' : '-'}{formatPrice(tx.amount)}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                </div>

            </main>
            <Footer />
        </div>
    )
}

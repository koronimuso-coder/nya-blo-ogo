import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import { Search, Sparkles } from 'lucide-react'

interface ScribeRank {
    id: string
    name: string
    score: number
    coins: number
    title: string
    avatar: string
    gradient: string
}

const MOCK_LEADERBOARD: ScribeRank[] = [
    { id: 'leader-1', name: 'Dr. Amadou Niamkey', score: 3200, coins: 2100, title: 'Grand Prêtre d\'Amma', avatar: '🦁', gradient: 'linear-gradient(135deg, #B85C2E 0%, #D4A017 100%)' },
    { id: 'leader-2', name: 'Sultan Koné', score: 2850, coins: 1840, title: 'Lead Architecte', avatar: '🦉', gradient: 'linear-gradient(135deg, #0a1a2e 0%, #00E5A0 100%)' },
    { id: 'leader-3', name: 'Awa Diabaté', score: 2600, coins: 1450, title: 'Gardien des Masques', avatar: '👑', gradient: 'linear-gradient(135deg, #1a0a2e 0%, #8b5cf6 100%)' },
    { id: 'leader-4', name: 'Fatou Diallo', score: 2200, coins: 1100, title: 'Marchande Initiée', avatar: '🌊', gradient: 'linear-gradient(135deg, #1a0505 0%, #ef4444 100%)' },
    { id: 'leader-5', name: 'Moussa Traoré', score: 1980, coins: 950, title: 'Voyageur de Sirius', avatar: '🦅', gradient: 'linear-gradient(135deg, #050505 0%, #3b82f6 100%)' },
    { id: 'leader-6', name: 'Ibrahima Sanogo', score: 1750, coins: 820, title: 'Bâtisseur du Toguna', avatar: '⚒️', gradient: 'linear-gradient(135deg, #C2A888 0%, #8B4522 100%)' },
    { id: 'leader-7', name: 'Aminata Konaté', score: 1480, coins: 690, title: 'Scribe Apprenti', avatar: '🌾', gradient: 'linear-gradient(135deg, #0a2e1a 0%, #00E5A0 100%)' },
]

const formatPrice = (n: number) => n.toLocaleString('fr-FR')

export default function Leaderboard() {
    const { user } = useAuthStore()
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState<'score' | 'coins'>('score')

    // Mix user into leaderboard list
    const combinedLeaderboard = useMemo(() => {
        const list = [...MOCK_LEADERBOARD]
        if (user) {
            // Remove demo user if already present, then insert updated user stats
            const filtered = list.filter(item => item.id !== 'demo-001' && item.name.toLowerCase() !== user.displayName.toLowerCase())
            const userTitle = user.avatarConfig?.title || 'Initié'
            filtered.push({
                id: 'user-current',
                name: `${user.displayName} (Vous)`,
                score: user.nyaScore,
                coins: user.nyaCoins,
                title: userTitle,
                avatar: user.avatarConfig?.symbol || '✨',
                gradient: user.avatarConfig?.gradient || 'linear-gradient(135deg, #B85C2E 0%, #D4A017 100%)'
            })
            return filtered
        }
        return list
    }, [user])

    const sortedList = useMemo(() => {
        let list = [...combinedLeaderboard]
        
        // Search filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase()
            list = list.filter(item => item.name.toLowerCase().includes(q) || item.title.toLowerCase().includes(q))
        }

        // Sort
        list.sort((a, b) => {
            if (sortBy === 'score') return b.score - a.score
            return b.coins - a.coins
        })

        return list
    }, [combinedLeaderboard, searchQuery, sortBy])

    // Find top 3
    const topThree = useMemo(() => {
        // Sort entire list first by score for podium representation
        const sorted = [...combinedLeaderboard].sort((a, b) => b.score - a.score)
        return {
            first: sorted[0] || null,
            second: sorted[1] || null,
            third: sorted[2] || null
        }
    }, [combinedLeaderboard])

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
                    <div className="cosmo-label">Observatoire {" > "} Tableau d'Honneur</div>
                    <h1 className="text-shimmer" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                        CLASSEMENT
                    </h1>
                </div>

                {/* 3D Podium Display */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.2fr 1fr',
                    gap: 16,
                    alignItems: 'end',
                    maxWidth: 700,
                    margin: '0 auto 60px',
                    padding: '0 20px',
                    textAlign: 'center'
                }}>
                    
                    {/* Second Place Column */}
                    {topThree.second && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{
                                width: 70, height: 70, borderRadius: '50%',
                                background: topThree.second.gradient, display: 'flex',
                                alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem',
                                border: '3px solid #C0C0C0', boxShadow: '0 0 20px rgba(192,192,192,0.3)',
                                marginBottom: 12
                            }}>
                                {topThree.second.avatar}
                            </div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fff', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {topThree.second.name}
                            </div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--nya-gold)', fontWeight: 700, textTransform: 'uppercase', marginTop: 4 }}>
                                {topThree.second.score} PTS
                            </div>
                            {/* Column platform */}
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: 100 }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                style={{
                                    width: '100%', minWidth: 100, background: 'linear-gradient(to top, rgba(255,255,255,0.02), rgba(255,255,255,0.08))',
                                    border: '1px solid rgba(192,192,192,0.3)', borderBottom: 'none',
                                    borderRadius: '16px 16px 0 0', marginTop: 16,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: '#C0C0C0' }}>2</span>
                            </motion.div>
                        </div>
                    )}

                    {/* First Place Column */}
                    {topThree.first && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3 }}>
                            <div style={{ position: 'relative', marginBottom: 12 }}>
                                {/* Golden Crown Crown Badge */}
                                <div style={{
                                    position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--nya-gold)'
                                }}>
                                    <Sparkles size={20} />
                                </div>
                                <div style={{
                                    width: 85, height: 85, borderRadius: '50%',
                                    background: topThree.first.gradient, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', fontSize: '2.6rem',
                                    border: '4px solid var(--nya-gold)', boxShadow: '0 0 30px rgba(212,160,23,0.5)',
                                }}>
                                    {topThree.first.avatar}
                                </div>
                            </div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#fff', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {topThree.first.name}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--nya-gold)', fontWeight: 800, textTransform: 'uppercase', marginTop: 4 }}>
                                {topThree.first.score} PTS
                            </div>
                            {/* Column platform */}
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: 140 }}
                                transition={{ duration: 1.2, ease: 'easeOut' }}
                                style={{
                                    width: '100%', minWidth: 120, background: 'linear-gradient(to top, rgba(212,160,23,0.05), rgba(212,160,23,0.15))',
                                    border: '2px solid var(--nya-gold)', borderBottom: 'none',
                                    borderRadius: '20px 20px 0 0', marginTop: 16,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 0 40px rgba(212,160,23,0.1)'
                                }}
                            >
                                <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, color: 'var(--nya-gold)' }}>1</span>
                            </motion.div>
                        </div>
                    )}

                    {/* Third Place Column */}
                    {topThree.third && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{
                                width: 65, height: 65, borderRadius: '50%',
                                background: topThree.third.gradient, display: 'flex',
                                alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
                                border: '3px solid #CD7F32', boxShadow: '0 0 20px rgba(205,127,50,0.3)',
                                marginBottom: 12
                            }}>
                                {topThree.third.avatar}
                            </div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fff', maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {topThree.third.name}
                            </div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--nya-gold)', fontWeight: 700, textTransform: 'uppercase', marginTop: 4 }}>
                                {topThree.third.score} PTS
                            </div>
                            {/* Column platform */}
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: 70 }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                style={{
                                    width: '100%', minWidth: 90, background: 'linear-gradient(to top, rgba(255,255,255,0.01), rgba(255,255,255,0.05))',
                                    border: '1px solid rgba(205,127,50,0.3)', borderBottom: 'none',
                                    borderRadius: '16px 16px 0 0', marginTop: 16,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 900, color: '#CD7F32' }}>3</span>
                            </motion.div>
                        </div>
                    )}
                </div>

                {/* Filters & Search & Table */}
                <div style={{
                    background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                    borderRadius: 24, padding: 24, boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
                    maxWidth: 800, margin: '0 auto'
                }}>
                    
                    {/* Toolbar */}
                    <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
                        
                        {/* Search Input */}
                        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Rechercher un scribe initié..."
                                style={{
                                    width: '100%', padding: '12px 16px 12px 40px',
                                    background: 'var(--bg-primary)', border: '1px solid var(--border-default)',
                                    borderRadius: 12, color: 'var(--text-primary)', outline: 'none'
                                }}
                            />
                            <Search size={16} style={{ position: 'absolute', left: 14, top: 15, color: 'var(--text-muted)' }} />
                        </div>

                        {/* Sort selector */}
                        <div style={{ display: 'flex', background: 'var(--bg-primary)', padding: 4, borderRadius: 10 }}>
                            <button
                                onClick={() => setSortBy('score')}
                                style={{
                                    padding: '8px 16px', border: 'none', borderRadius: 8,
                                    background: sortBy === 'score' ? 'var(--nya-ochre)' : 'none',
                                    color: '#fff', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer'
                                }}
                            >
                                Nya Score
                            </button>
                            <button
                                onClick={() => setSortBy('coins')}
                                style={{
                                    padding: '8px 16px', border: 'none', borderRadius: 8,
                                    background: sortBy === 'coins' ? 'var(--nya-ochre)' : 'none',
                                    color: '#fff', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer'
                                }}
                            >
                                Nya Coins
                            </button>
                        </div>
                    </div>

                    {/* Ranks list table */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {sortedList.map((item, index) => {
                            const isCurrentUser = item.id === 'user-current'
                            return (
                                <motion.div
                                    key={item.id}
                                    whileHover={{ x: 6 }}
                                    style={{
                                        background: isCurrentUser ? 'rgba(184,92,46,0.1)' : 'var(--bg-elevated)',
                                        border: isCurrentUser ? '1.5px solid var(--nya-ochre)' : '1px solid var(--border-default)',
                                        borderRadius: 16, padding: '16px 20px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        transition: 'background 0.3s, border 0.3s'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                        {/* Rank Number */}
                                        <div style={{
                                            fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 900,
                                            color: index === 0 ? 'var(--nya-gold)' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : 'var(--text-faint)',
                                            width: 24
                                        }}>
                                            {index + 1}
                                        </div>

                                        {/* Avatar bubble */}
                                        <div style={{
                                            width: 40, height: 40, borderRadius: '50%',
                                            background: item.gradient, display: 'flex',
                                            alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem'
                                        }}>
                                            {item.avatar}
                                        </div>

                                        {/* Details */}
                                        <div>
                                            <div style={{
                                                fontSize: '0.85rem', fontWeight: 800,
                                                color: isCurrentUser ? 'var(--nya-gold)' : '#fff'
                                            }}>
                                                {item.name}
                                            </div>
                                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                                {item.title}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', display: 'block' }}>SCORE</span>
                                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 800, color: 'var(--nya-gold)' }}>
                                                {formatPrice(item.score)}
                                            </span>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', display: 'block' }}>COINS</span>
                                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                                {formatPrice(item.coins)}
                                            </span>
                                        </div>
                                    </div>

                                </motion.div>
                            )
                        })}
                    </div>

                </div>

            </main>
            <Footer />
        </div>
    )
}

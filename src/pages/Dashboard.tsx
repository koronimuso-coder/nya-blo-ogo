import { motion } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import ScrollProgress from '../components/animations/ScrollProgress'
import SEOHead from '../components/SEOHead'
import {
    Flame, Coins, Award, Trophy, TrendingUp,
    Gamepad2, Bot, FileText, Store, GraduationCap,
    ArrowUpRight
} from 'lucide-react'

/**
 * Dashboard page — "Observatoire Sirius"
 * Unified view of user stats, achievements, activity, and shortcuts.
 */

const quickLinks = [
    { icon: Store, title: 'MARCHÉ', path: '/shop', color: '#B85C2E' },
    { icon: GraduationCap, title: 'ACADÉMIE', path: '/learn', color: '#00E5A0' },
    { icon: Gamepad2, title: 'JEUX', path: '/games', color: '#a78bfa' },
    { icon: Bot, title: 'NOMMO LAB', path: '/lab', color: '#FFD700' },
    { icon: FileText, title: 'CV BUILDER', path: '/cv-builder', color: '#C2A888' },
    { icon: Trophy, title: 'BADGES', path: '/achievements', color: '#D4A017' },
]

// Fake activity data for SVG chart
const activityData = [
    { day: 'Lun', score: 320 },
    { day: 'Mar', score: 450 },
    { day: 'Mer', score: 280 },
    { day: 'Jeu', score: 600 },
    { day: 'Ven', score: 520 },
    { day: 'Sam', score: 780 },
    { day: 'Dim', score: 650 },
]

const recentActivity = [
    { action: 'Quiz complété', detail: 'Score: 4/5 — Scribes Quiz', time: 'Il y a 2h', color: '#00E5A0' },
    { action: 'Puzzle résolu', detail: 'Puzzle de Bandiagara en 23 coups', time: 'Il y a 5h', color: '#a78bfa' },
    { action: 'Article ajouté', detail: 'Sceau Sirius B — Or Pur 24k', time: 'Hier', color: '#B85C2E' },
    { action: 'Badge débloqué', detail: '🏆 Premier Pas', time: 'Hier', color: '#FFD700' },
    { action: 'CV créé', detail: 'Thème Sirius utilisé', time: 'Il y a 2j', color: '#C2A888' },
]

export default function Dashboard() {
    const navigate = useNavigate()
    const { user, achievements } = useAuthStore()
    const unlockedCount = achievements.filter(a => a.unlocked).length

    // SVG chart dimensions
    const chartW = 500
    const chartH = 200
    const maxScore = Math.max(...activityData.map(d => d.score))
    const points = activityData.map((d, i) => {
        const x = (i / (activityData.length - 1)) * (chartW - 40) + 20
        const y = chartH - 20 - ((d.score / maxScore) * (chartH - 40))
        return { x, y, ...d }
    })
    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
    const areaPath = linePath + ` L${points[points.length - 1].x},${chartH - 20} L${points[0].x},${chartH - 20} Z`

    return (
        <div style={{ position: 'relative' }}>
            <SEOHead />
            <Starfield />
            <CosmicBackground />
            <ScrollProgress />
            <Navbar />

            <section className="section-full nebula-section" style={{ minHeight: '100vh', paddingTop: 120 }}>
                <div className="max-w-container" style={{ position: 'relative', zIndex: 2 }}>
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ marginBottom: 48 }}
                    >
                        <div className="cosmo-label" style={{ marginBottom: 16 }}>OBSERVATOIRE SIRIUS</div>
                        <h2 style={{ marginBottom: 8 }}>
                            TABLEAU DE BORD<br />
                            <span className="text-ochre">{user?.displayName?.toUpperCase() || 'EXPLORATEUR'}</span>
                        </h2>
                    </motion.div>

                    {/* Stats row */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: 16, marginBottom: 32,
                    }}>
                        {[
                            { icon: Flame, value: user?.streak || 0, label: 'JOURS DE SÉRIE', color: '#ef4444', suffix: '' },
                            { icon: Coins, value: user?.nyaCoins || 0, label: 'NYA COINS', color: 'var(--nya-gold)', suffix: '' },
                            { icon: Award, value: user?.nyaScore || 0, label: 'NYA SCORE', color: 'var(--nya-ochre)', suffix: '' },
                            { icon: Trophy, value: unlockedCount, label: 'BADGES', color: '#FFD700', suffix: `/${achievements.length}` },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + i * 0.08 }}
                                whileHover={{ scale: 1.03, borderColor: `${stat.color}40` }}
                                style={{
                                    padding: '24px 20px',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border-default)',
                                    borderRadius: 'var(--radius-lg)',
                                    display: 'flex', alignItems: 'center', gap: 16,
                                    transition: 'all 0.3s',
                                }}
                            >
                                <div style={{
                                    width: 48, height: 48, borderRadius: 12,
                                    background: `${stat.color}15`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <stat.icon size={22} style={{ color: stat.color }} />
                                </div>
                                <div>
                                    <div style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: '1.8rem', fontWeight: 900,
                                        lineHeight: 1, color: 'var(--text-primary)',
                                    }}>
                                        {stat.value.toLocaleString()}{stat.suffix}
                                    </div>
                                    <div className="accent-label" style={{ marginTop: 4 }}>{stat.label}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Main grid: Chart + Activity */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                        gap: 20, marginBottom: 32,
                    }}>
                        {/* SVG Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            style={{
                                padding: '24px',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-default)',
                                borderRadius: 'var(--radius-xl)',
                            }}
                        >
                            <div style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                marginBottom: 20,
                            }}>
                                <div>
                                    <div style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: '1.1rem', fontWeight: 900,
                                        textTransform: 'uppercase', color: 'var(--text-primary)',
                                    }}>
                                        Activité Hebdomadaire
                                    </div>
                                    <div className="accent-label" style={{ color: 'var(--nya-ochre)' }}>
                                        SCORE PAR JOUR
                                    </div>
                                </div>
                                <TrendingUp size={20} style={{ color: 'var(--nya-sirius)' }} />
                            </div>

                            <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: '100%', height: 'auto' }}>
                                {/* Grid lines */}
                                {[0.25, 0.5, 0.75].map(frac => (
                                    <line
                                        key={frac}
                                        x1={20} x2={chartW - 20}
                                        y1={chartH - 20 - frac * (chartH - 40)}
                                        y2={chartH - 20 - frac * (chartH - 40)}
                                        stroke="var(--border-default)" strokeDasharray="4,4"
                                    />
                                ))}

                                {/* Area fill */}
                                <motion.path
                                    d={areaPath}
                                    fill="url(#chartGradient)"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.3 }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                />

                                {/* Line */}
                                <motion.path
                                    d={linePath}
                                    fill="none"
                                    stroke="var(--nya-ochre)"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                />

                                {/* Data points */}
                                {points.map((p, i) => (
                                    <g key={i}>
                                        <motion.circle
                                            cx={p.x} cy={p.y} r={4}
                                            fill="var(--nya-ochre)"
                                            stroke="var(--nya-deep)"
                                            strokeWidth={2}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.5 + i * 0.1 }}
                                        />
                                        <text
                                            x={p.x} y={chartH - 4}
                                            textAnchor="middle"
                                            fill="var(--text-faint)"
                                            fontSize="10"
                                            fontFamily="var(--font-body)"
                                            fontWeight="700"
                                        >
                                            {p.day}
                                        </text>
                                    </g>
                                ))}

                                <defs>
                                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="var(--nya-ochre)" stopOpacity="0.4" />
                                        <stop offset="100%" stopColor="var(--nya-ochre)" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </motion.div>

                        {/* Recent activity */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            style={{
                                padding: '24px',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-default)',
                                borderRadius: 'var(--radius-xl)',
                            }}
                        >
                            <div style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '1.1rem', fontWeight: 900,
                                textTransform: 'uppercase', color: 'var(--text-primary)',
                                marginBottom: 4,
                            }}>
                                Activité Récente
                            </div>
                            <div className="accent-label" style={{ color: 'var(--nya-ochre)', marginBottom: 20 }}>
                                HISTORIQUE DU NEXUS
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                {recentActivity.map((act, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + i * 0.08 }}
                                        style={{
                                            padding: '14px 0',
                                            borderBottom: i < recentActivity.length - 1 ? '1px solid var(--border-default)' : 'none',
                                            display: 'flex', alignItems: 'center', gap: 12,
                                        }}
                                    >
                                        <div style={{
                                            width: 8, height: 8, borderRadius: '50%',
                                            background: act.color, flexShrink: 0,
                                        }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                fontSize: '0.8rem', fontWeight: 700,
                                                color: 'var(--text-primary)',
                                            }}>
                                                {act.action}
                                            </div>
                                            <div style={{
                                                fontSize: '0.7rem', color: 'var(--text-muted)',
                                            }}>
                                                {act.detail}
                                            </div>
                                        </div>
                                        <div style={{
                                            fontSize: '0.6rem', fontWeight: 700,
                                            letterSpacing: '0.1em', color: 'var(--text-faint)',
                                            whiteSpace: 'nowrap',
                                        }}>
                                            {act.time}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Quick links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.1rem', fontWeight: 900,
                            textTransform: 'uppercase', color: 'var(--text-primary)',
                            marginBottom: 16,
                        }}>
                            Accès Rapide
                        </div>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                            gap: 12,
                        }}>
                            {quickLinks.map((link, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.05, borderColor: `${link.color}40` }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate(link.path)}
                                    style={{
                                        padding: '20px 16px',
                                        background: 'var(--bg-card)',
                                        border: '1px solid var(--border-default)',
                                        borderRadius: 'var(--radius-lg)',
                                        cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: 12,
                                        transition: 'all 0.3s',
                                    }}
                                >
                                    <link.icon size={18} style={{ color: link.color }} />
                                    <span style={{
                                        fontSize: '0.7rem', fontWeight: 800,
                                        letterSpacing: '0.1em', textTransform: 'uppercase',
                                        color: 'var(--text-secondary)',
                                    }}>
                                        {link.title}
                                    </span>
                                    <ArrowUpRight size={12} style={{ color: 'var(--text-faint)', marginLeft: 'auto' }} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

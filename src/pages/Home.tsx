import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import {
    Bot, GraduationCap, Film, Music, ShoppingCart, Car,
    Cross, Building2, Flame, Award, Coins,
    TrendingUp, Clock, ArrowUpRight, Star
} from 'lucide-react'

const quickAccess = [
    { icon: Bot, title: 'NYA ORACLE', path: '/ai', color: '#FFD700' },
    { icon: GraduationCap, title: 'ACADÉMIE', path: '/learn', color: '#00E5A0' },
    { icon: Film, title: 'NYA STREAM', path: '/stream', color: '#ef4444' },
    { icon: Music, title: 'NYA MUSIC', path: '/music', color: '#a78bfa' },
    { icon: ShoppingCart, title: 'MARCHÉ', path: '/shop', color: '#B85C2E' },
    { icon: Car, title: 'NYA VTC', path: '/vtc', color: '#D4A017' },
    { icon: Cross, title: 'PHARMACIE', path: '/pharmacie', color: '#4ade80' },
    { icon: Building2, title: 'IMMOBILIER', path: '/immobilier', color: '#00CED1' },
]

const dailyDogon = {
    symbol: '🌀',
    name: 'La Spirale d\'Amma',
    meaning: 'Symbole de la création et de l\'expansion. Aujourd\'hui, laisse ton énergie créatrice se déployer.',
    citation: '"Avant que le grain ne germe, il doit d\'abord mourir dans la terre."',
}

const missions = [
    { title: 'Complète un cours', reward: 100, icon: GraduationCap, done: false },
    { title: 'Publie un post', reward: 50, icon: TrendingUp, done: false },
    { title: 'Envoie un message', reward: 25, icon: Star, done: true },
]

const trending = [
    { title: 'Créer son business en ligne en Afrique', type: 'Cours', icon: GraduationCap, hot: true },
    { title: 'Afrobeats Mix 2026', type: 'Musique', icon: Music, hot: false },
    { title: 'Pharmacies de garde à Cocody', type: 'Santé', icon: Cross, hot: true },
    { title: 'Oracle Dogon du jour', type: 'Spiritual', icon: Star, hot: false },
]

export default function Home() {
    const navigate = useNavigate()
    const { user } = useAuthStore()

    return (
        <div style={{ padding: 'var(--page-padding)', maxWidth: 1400, margin: '0 auto' }}>
            {/* ─── WELCOME ─── */}
            <section style={{ marginBottom: 60 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 32 }}
                >
                    <div>
                        <div className="cosmo-label" style={{ marginBottom: 16 }}>NEXUS DASHBOARD</div>
                        <h2 style={{ marginBottom: 12 }}>
                            SALUT,<br />
                            <span className="text-ochre">{user?.displayName?.toUpperCase() || 'EXPLORATEUR'}</span>
                        </h2>

                        {user && (
                            <div style={{ display: 'flex', gap: 24, marginTop: 20 }}>
                                {[
                                    { icon: Flame, value: user.streak, label: 'JOURS', color: '#ef4444' },
                                    { icon: Coins, value: user.nyaCoins, label: 'COINS', color: 'var(--nya-gold)' },
                                    { icon: Award, value: user.nyaScore, label: 'SCORE', color: 'var(--nya-ochre)' },
                                ].map((s, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <s.icon size={18} style={{ color: s.color }} />
                                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>{s.value}</span>
                                        <span className="accent-label">{s.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Oracle mini card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="toguna-glass"
                        style={{ padding: 28, maxWidth: 360, flex: '1 1 320px' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                            <motion.span animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} style={{ fontSize: '1.8rem' }}>
                                {dailyDogon.symbol}
                            </motion.span>
                            <div>
                                <div className="accent-label" style={{ marginBottom: 4 }}>SYMBOLE DU JOUR</div>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 900 }}>{dailyDogon.name}</div>
                            </div>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 12 }}>
                            {dailyDogon.meaning}
                        </p>
                        <p style={{ fontStyle: 'italic', color: 'var(--nya-ochre)', fontSize: '0.8rem', opacity: 0.6 }}>
                            {dailyDogon.citation}
                        </p>
                    </motion.div>
                </motion.div>
            </section>

            {/* ─── QUICK ACCESS ─── */}
            <section style={{ marginBottom: 60 }}>
                <div className="accent-label" style={{ marginBottom: 20 }}>ACCÈS RAPIDE</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 16 }}>
                    {quickAccess.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + i * 0.05 }}
                            whileHover={{ scale: 1.05, borderColor: 'var(--border-ochre)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(item.path)}
                            style={{
                                padding: 24, textAlign: 'center', cursor: 'pointer',
                                background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                                borderRadius: 'var(--radius-lg)', transition: 'all 0.3s',
                            }}
                        >
                            <item.icon size={28} style={{ color: item.color, marginBottom: 12 }} />
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 900, letterSpacing: '-0.02em' }}>{item.title}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ─── MISSIONS + TRENDING ─── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24, marginBottom: 60 }}>
                {/* Missions */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="toguna-glass" style={{ padding: 32 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <div>
                            <div className="accent-label" style={{ marginBottom: 4 }}>MISSIONS QUOTIDIENNES</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Gagne des Nya Coins</div>
                        </div>
                        <Clock size={20} style={{ color: 'var(--nya-ochre)', opacity: 0.4 }} />
                    </div>

                    {missions.map((m, i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0',
                            borderBottom: i < missions.length - 1 ? '1px solid var(--separator)' : 'none',
                            opacity: m.done ? 0.35 : 1,
                        }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                                background: m.done ? 'rgba(0,229,160,0.08)' : 'rgba(184,92,46,0.08)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <m.icon size={18} style={{ color: m.done ? 'var(--nya-sirius)' : 'var(--nya-ochre)' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 600, textDecoration: m.done ? 'line-through' : 'none' }}>{m.title}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Coins size={14} style={{ color: 'var(--nya-gold)' }} />
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--nya-gold)' }}>+{m.reward}</span>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Trending */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="toguna-glass" style={{ padding: 32 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <div>
                            <div className="accent-label" style={{ marginBottom: 4 }}>TENDANCES</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ce qui buzz sur Nya Blo</div>
                        </div>
                        <TrendingUp size={20} style={{ color: 'var(--nya-ochre)', opacity: 0.4 }} />
                    </div>

                    {trending.map((item, i) => (
                        <motion.div key={i} whileHover={{ x: 4, background: 'var(--bg-surface)' }} style={{
                            display: 'flex', alignItems: 'center', gap: 14, padding: '14px 8px',
                            borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                            borderBottom: i < trending.length - 1 ? '1px solid var(--separator)' : 'none',
                        }}>
                            <item.icon size={18} style={{ color: 'var(--nya-ochre)', flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.title}</div>
                                <div className="accent-label" style={{ marginTop: 2 }}>{item.type}</div>
                            </div>
                            {item.hot && (
                                <span style={{
                                    background: 'rgba(239,68,68,0.12)', color: '#ef4444',
                                    padding: '3px 10px', borderRadius: 'var(--radius-pill)',
                                    fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.1em',
                                }}>HOT</span>
                            )}
                            <ArrowUpRight size={14} style={{ color: 'var(--nya-ochre)', opacity: 0.3 }} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}

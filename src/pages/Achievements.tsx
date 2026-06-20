import { motion } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import ScrollProgress from '../components/animations/ScrollProgress'
import SEOHead from '../components/SEOHead'
import { Lock, CheckCircle } from 'lucide-react'

/**
 * Achievements page — "Initiations Dogon"
 * Grid of all badges — unlocked and locked with 3D flip animation.
 */
export default function Achievements() {
    const { achievements } = useAuthStore()
    const unlocked = achievements.filter(a => a.unlocked).length
    const total = achievements.length
    const progress = (unlocked / total) * 100

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
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ textAlign: 'center', marginBottom: 60 }}
                    >
                        <div className="cosmo-label" style={{ justifyContent: 'center', marginBottom: 24 }}>SYSTÈME D'INITIATION</div>
                        <h1 style={{ marginBottom: 16 }}>
                            INITIATIONS<br />
                            <span className="text-ochre">DOGON</span>
                        </h1>
                        <p style={{
                            fontSize: '1.05rem', color: 'var(--text-muted)',
                            maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.8,
                        }}>
                            Explorez NYA BLO et débloquez des badges sacrés. Chaque initiation vous rapproche du Nexus Sirius.
                        </p>

                        {/* Progress bar */}
                        <div style={{
                            maxWidth: 400, margin: '0 auto',
                            background: 'var(--bg-elevated)', borderRadius: 'var(--radius-pill)',
                            height: 8, overflow: 'hidden', position: 'relative',
                        }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                style={{
                                    height: '100%',
                                    background: 'linear-gradient(90deg, var(--nya-ochre), var(--nya-gold))',
                                    borderRadius: 'var(--radius-pill)',
                                }}
                            />
                        </div>
                        <div style={{
                            fontSize: '0.7rem', fontWeight: 800,
                            letterSpacing: '0.15em', textTransform: 'uppercase',
                            color: 'var(--nya-ochre)', marginTop: 12,
                        }}>
                            {unlocked} / {total} INITIATIONS COMPLÉTÉES
                        </div>
                    </motion.div>

                    {/* Badges grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                        gap: 20,
                    }}>
                        {achievements.map((ach, i) => (
                            <motion.div
                                key={ach.id}
                                initial={{ opacity: 0, y: 30, rotateX: 15 }}
                                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.06, duration: 0.5 }}
                                whileHover={{
                                    scale: 1.05,
                                    rotateY: ach.unlocked ? 5 : 0,
                                    boxShadow: ach.unlocked
                                        ? `0 20px 60px ${ach.color}20, 0 0 30px ${ach.color}10`
                                        : 'none',
                                }}
                                style={{
                                    padding: '32px 24px',
                                    background: ach.unlocked
                                        ? `linear-gradient(135deg, ${ach.color}08, ${ach.color}03)`
                                        : 'var(--bg-card)',
                                    border: `1px solid ${ach.unlocked ? ach.color + '30' : 'var(--border-default)'}`,
                                    borderRadius: 'var(--radius-xl)',
                                    textAlign: 'center',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    cursor: 'default',
                                    transition: 'border-color 0.3s',
                                    perspective: '800px',
                                }}
                            >
                                {/* Lock overlay */}
                                {!ach.unlocked && (
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        background: 'rgba(0,0,0,0.3)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        zIndex: 1, borderRadius: 'var(--radius-xl)',
                                    }}>
                                        <Lock size={24} style={{ color: 'var(--text-faint)' }} />
                                    </div>
                                )}

                                {/* Badge icon */}
                                <motion.div
                                    animate={ach.unlocked ? {
                                        boxShadow: [`0 0 20px ${ach.color}30`, `0 0 40px ${ach.color}50`, `0 0 20px ${ach.color}30`],
                                    } : {}}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    style={{
                                        width: 72, height: 72, borderRadius: '50%',
                                        margin: '0 auto 16px',
                                        background: ach.unlocked
                                            ? `linear-gradient(135deg, ${ach.color}25, ${ach.color}10)`
                                            : 'var(--bg-elevated)',
                                        border: `2px solid ${ach.unlocked ? ach.color + '50' : 'var(--border-default)'}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '2rem',
                                        filter: ach.unlocked ? 'none' : 'grayscale(1) opacity(0.3)',
                                    }}
                                >
                                    {ach.icon}
                                </motion.div>

                                <div style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '1rem', fontWeight: 900,
                                    textTransform: 'uppercase',
                                    letterSpacing: '-0.01em',
                                    color: ach.unlocked ? 'var(--text-primary)' : 'var(--text-faint)',
                                    marginBottom: 4,
                                    filter: ach.unlocked ? 'none' : 'blur(1px)',
                                }}>
                                    {ach.title}
                                </div>

                                <div style={{
                                    fontSize: '0.7rem', color: 'var(--text-muted)',
                                    lineHeight: 1.5, marginBottom: 12,
                                    filter: ach.unlocked ? 'none' : 'blur(2px)',
                                }}>
                                    {ach.description}
                                </div>

                                {ach.unlocked && (
                                    <div style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                        fontSize: '0.6rem', fontWeight: 800,
                                        letterSpacing: '0.15em', textTransform: 'uppercase',
                                        color: ach.color,
                                    }}>
                                        <CheckCircle size={12} />
                                        +{ach.points} POINTS
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

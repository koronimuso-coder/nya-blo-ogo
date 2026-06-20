import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { useEffect } from 'react'
import { X } from 'lucide-react'

/**
 * AchievementToast — Golden toast that appears when a badge is unlocked.
 * Renders globally — mount in App.tsx or RootLayout.
 */
export default function AchievementToast() {
    const { recentUnlock, dismissUnlock } = useAuthStore()

    // Auto-dismiss after 5 seconds
    useEffect(() => {
        if (!recentUnlock) return
        const timer = setTimeout(dismissUnlock, 5000)
        return () => clearTimeout(timer)
    }, [recentUnlock, dismissUnlock])

    return (
        <AnimatePresence>
            {recentUnlock && (
                <motion.div
                    initial={{ y: -100, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -100, opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    style={{
                        position: 'fixed',
                        top: 80,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10001,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        padding: '16px 24px 16px 20px',
                        background: 'linear-gradient(135deg, rgba(212,160,23,0.15), rgba(184,92,46,0.1))',
                        backdropFilter: 'blur(24px)',
                        border: '1px solid rgba(212,160,23,0.3)',
                        borderRadius: 'var(--radius-pill)',
                        boxShadow: '0 16px 60px rgba(212,160,23,0.2), 0 0 40px rgba(212,160,23,0.1)',
                        maxWidth: 420,
                    }}
                >
                    {/* Animated icon */}
                    <motion.div
                        animate={{
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        style={{
                            width: 48, height: 48, borderRadius: '50%',
                            background: `linear-gradient(135deg, ${recentUnlock.color}30, ${recentUnlock.color}10)`,
                            border: `2px solid ${recentUnlock.color}50`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.5rem', flexShrink: 0,
                        }}
                    >
                        {recentUnlock.icon}
                    </motion.div>

                    <div style={{ flex: 1 }}>
                        <div style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.6rem', fontWeight: 800,
                            letterSpacing: '0.2em', textTransform: 'uppercase',
                            color: 'var(--nya-gold)',
                            marginBottom: 2,
                        }}>
                            🏆 BADGE DÉBLOQUÉ
                        </div>
                        <div style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.1rem', fontWeight: 900,
                            letterSpacing: '-0.01em',
                            color: 'var(--text-primary)',
                        }}>
                            {recentUnlock.title}
                        </div>
                        <div style={{
                            fontSize: '0.7rem', color: 'var(--text-muted)',
                            marginTop: 2,
                        }}>
                            +{recentUnlock.points} Nya Coins • +{recentUnlock.points * 2} Score
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={dismissUnlock}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: 'var(--text-muted)', padding: 4,
                        }}
                    >
                        <X size={16} />
                    </motion.button>

                    {/* Sparkle particles */}
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{
                                opacity: 1, scale: 0,
                                x: 0, y: 0,
                            }}
                            animate={{
                                opacity: 0, scale: 1,
                                x: (Math.random() - 0.5) * 120,
                                y: (Math.random() - 0.5) * 80,
                            }}
                            transition={{ duration: 1, delay: 0.1 + i * 0.08 }}
                            style={{
                                position: 'absolute',
                                width: 4, height: 4, borderRadius: '50%',
                                background: recentUnlock.color,
                                pointerEvents: 'none',
                                left: '50%', top: '50%',
                            }}
                        />
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    )
}

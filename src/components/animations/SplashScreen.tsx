import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

/**
 * SplashScreen — Premium opening intro animation for NYA BLO OGO.
 * Displays a glowing rotating ring, draws the sacred Kanaga symbol,
 * and displays a shimmering title before fading out.
 */
export default function SplashScreen() {
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false)
        }, 2600)
        return () => clearTimeout(timer)
    }, [])

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
                    className="no-light-override"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 99999,
                        background: '#1C100B',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                    }}
                >
                    {/* Glowing sacred geometry background ring */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        style={{
                            position: 'absolute',
                            width: 280,
                            height: 280,
                            border: '1px dashed var(--nya-gold)',
                            borderRadius: '50%',
                            opacity: 0.2,
                        }}
                    />

                    {/* Outer glowing ring */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.3 }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        style={{
                            position: 'absolute',
                            width: 320,
                            height: 320,
                            border: '1px solid var(--border-active)',
                            borderRadius: '50%',
                        }}
                    />

                    {/* Central glowing Kanaga symbol */}
                    <motion.div
                        initial={{ scale: 0.3, opacity: 0, rotate: -45 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        style={{ position: 'relative', zIndex: 1, marginBottom: 24 }}
                    >
                        <svg width="100" height="100" viewBox="0 0 40 40" fill="none">
                            <motion.path
                                d="M20 4 L36 20 L20 36 L4 20 Z"
                                stroke="var(--nya-gold)"
                                strokeWidth="2"
                                fill="none"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.2 }}
                            />
                            <motion.path
                                d="M20 14 L26 20 L20 26 L14 20 Z"
                                fill="var(--nya-sirius)"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.8, type: 'spring' }}
                            />
                        </svg>
                    </motion.div>

                    {/* Logo & Subtitle */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        style={{ textAlign: 'center', zIndex: 1 }}
                    >
                        <h1
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '2.8rem',
                                fontWeight: 900,
                                letterSpacing: '0.05em',
                                color: 'var(--text-primary)',
                                margin: 0,
                                textTransform: 'uppercase',
                                textShadow: '0 0 20px rgba(92, 58, 33, 0.3)',
                            }}
                        >
                            NYA BLO OGO
                        </h1>
                        <span
                            style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: '0.65rem',
                                fontWeight: 800,
                                letterSpacing: '0.3em',
                                color: 'var(--nya-ochre)',
                                textTransform: 'uppercase',
                                marginTop: 8,
                                display: 'block',
                            }}
                        >
                            L'ORACLE DE L'ÉCOSYSTÈME SIRIUS
                        </span>
                    </motion.div>

                    {/* Loading progress bar */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '12%',
                            width: 140,
                            height: 2,
                            background: 'var(--border-subtle)',
                            borderRadius: 1,
                            overflow: 'hidden',
                        }}
                    >
                        <motion.div
                            initial={{ left: '-100%' }}
                            animate={{ left: '100%' }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                            style={{
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                width: '50%',
                                background: 'linear-gradient(90deg, transparent, var(--nya-sirius), transparent)',
                            }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { useNotificationStore } from '../stores/notificationStore'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import { Play, Pause, RefreshCw, Volume2 } from 'lucide-react'

export default function Meditation() {
    const { addScore } = useAuthStore()
    const { push } = useNotificationStore()

    const [running, setRunning] = useState(false)
    const [timeLeft, setTimeLeft] = useState(60) // in seconds
    const [breathState, setBreathState] = useState<'inspire' | 'hold' | 'expire'>('inspire')
    const [breathTimer, setBreathTimer] = useState(4)

    const audioCtxRef = useRef<AudioContext | null>(null)
    const gainRef = useRef<GainNode | null>(null)
    const oscillatorsRef = useRef<OscillatorNode[]>([])

    const startAudio = useCallback(() => {
        const ctx = new AudioContext()
        audioCtxRef.current = ctx

        const masterGain = ctx.createGain()
        const savedVol = localStorage.getItem('nya-audio-volume')
        const volPercent = savedVol ? parseInt(savedVol) : 80
        masterGain.gain.value = (volPercent / 100) * 0.05
        masterGain.connect(ctx.destination)
        gainRef.current = masterGain

        // Play 432Hz + 436Hz binaural beat for alpha brainwaves
        const leftOsc = ctx.createOscillator()
        const rightOsc = ctx.createOscillator()

        leftOsc.type = 'sine'
        leftOsc.frequency.value = 432
        
        rightOsc.type = 'sine'
        rightOsc.frequency.value = 436

        // Stereo panning
        const leftPanner = ctx.createStereoPanner ? ctx.createStereoPanner() : null
        const rightPanner = ctx.createStereoPanner ? ctx.createStereoPanner() : null

        if (leftPanner && rightPanner) {
            leftPanner.pan.value = -1
            rightPanner.pan.value = 1

            leftOsc.connect(leftPanner)
            leftPanner.connect(masterGain)

            rightOsc.connect(rightPanner)
            rightPanner.connect(masterGain)
        } else {
            leftOsc.connect(masterGain)
            rightOsc.connect(masterGain)
        }

        leftOsc.start()
        rightOsc.start()
        oscillatorsRef.current = [leftOsc, rightOsc]
    }, [])

    const stopAudio = useCallback(() => {
        oscillatorsRef.current.forEach(osc => { try { osc.stop() } catch {} })
        oscillatorsRef.current = []
        if (audioCtxRef.current) {
            try { audioCtxRef.current.close() } catch {}
            audioCtxRef.current = null
        }
    }, [])

    // Primary Countdown
    useEffect(() => {
        if (!running) return
        if (timeLeft <= 0) {
            setRunning(false)
            stopAudio()
            addScore(25)
            push({
                type: 'reward',
                title: 'Méditation Accomplie',
                message: 'Votre esprit est désormais aligné sur les ondes de Sirius. +25 Nya Score.',
                icon: '🧘',
                color: '#00E5A0'
            })
            return
        }

        const mainTimer = setTimeout(() => {
            setTimeLeft(prev => prev - 1)
        }, 1000)

        return () => clearTimeout(mainTimer)
    }, [running, timeLeft, stopAudio])

    // Breath Cycle (4s inhale, 4s hold, 4s exhale)
    useEffect(() => {
        if (!running) return

        const breathCycle = setTimeout(() => {
            if (breathTimer <= 1) {
                // Switch phase
                if (breathState === 'inspire') {
                    setBreathState('hold')
                    setBreathTimer(4)
                } else if (breathState === 'hold') {
                    setBreathState('expire')
                    setBreathTimer(4)
                } else {
                    setBreathState('inspire')
                    setBreathTimer(4)
                }
            } else {
                setBreathTimer(prev => prev - 1)
            }
        }, 1000)

        return () => clearTimeout(breathCycle)
    }, [running, breathTimer, breathState])

    const handleToggle = () => {
        if (running) {
            stopAudio()
        } else {
            startAudio()
        }
        setRunning(!running)
    }

    const resetSession = () => {
        stopAudio()
        setRunning(false)
        setTimeLeft(60)
        setBreathState('inspire')
        setBreathTimer(4)
    }

    useEffect(() => {
        return () => {
            stopAudio()
        }
    }, [stopAudio])

    // Get expanding / contracting scale based on breathing phase
    const getGeometryScale = () => {
        if (!running) return 1
        if (breathState === 'inspire') {
            // Expand from 0.8 to 1.5
            return 0.8 + ((4 - breathTimer) / 4) * 0.7
        } else if (breathState === 'hold') {
            return 1.5
        } else {
            // Contract from 1.5 to 0.8
            return 1.5 - ((4 - breathTimer) / 4) * 0.7
        }
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
                    <div className="cosmo-label">Soins d'Amma {" > "} Alignement Mental</div>
                    <h1 className="text-shimmer" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                        MÉDITATION NOMMO
                    </h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, alignItems: 'center' }}>
                    
                    {/* Expanding Sacred Geometry Circle */}
                    <div style={{
                        background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                        borderRadius: 24, padding: 40, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', minHeight: 400,
                        boxShadow: '0 25px 50px rgba(0,0,0,0.5)', position: 'relative'
                    }}>
                        {/* Interactive breathing circle */}
                        <motion.div
                            animate={{ scale: getGeometryScale() }}
                            transition={{ duration: 1, ease: 'linear' }}
                            style={{
                                width: 140, height: 140, borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(0,229,160,0.2) 0%, rgba(0,206,209,0.02) 70%)',
                                border: '3px solid var(--nya-gold)',
                                boxShadow: '0 0 40px rgba(0,229,160,0.3)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                        >
                            {/* Inner core */}
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--nya-gold)' }} />
                        </motion.div>

                        <div style={{ marginTop: 40, textAlign: 'center' }}>
                            <h3 style={{
                                fontFamily: 'var(--font-display)', fontSize: '1.6rem',
                                fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em'
                            }}>
                                {running ? (
                                    breathState === 'inspire' ? 'Inspirez...' :
                                    breathState === 'hold' ? 'Bloquez...' : 'Expirez...'
                                ) : 'Prêt pour l\'alignement'}
                            </h3>
                            {running && (
                                <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--nya-gold)', marginTop: 8 }}>
                                    {breathTimer} s
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Timer and Audio controls */}
                    <div style={{
                        background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                        borderRadius: 24, padding: 32, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', gap: 32, boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                                Temps de Session Restant
                            </span>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '3rem', fontWeight: 900, color: '#fff', marginTop: 10 }}>
                                {Math.floor(timeLeft / 60)}:{(timeLeft % 60) < 10 ? '0' : ''}{timeLeft % 60}
                            </div>
                        </div>

                        {/* Details */}
                        <div style={{ display: 'flex', gap: 10, background: 'rgba(0,229,160,0.08)', padding: '16px 20px', borderRadius: 16 }}>
                            <Volume2 style={{ color: '#00E5A0' }} />
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                                <span style={{ fontWeight: 800, display: 'block', color: '#fff' }}>Ondes Binaurales (432Hz)</span>
                                Émet des fréquences apaisantes pour stimuler la concentration et synchroniser les ondes cérébrales.
                            </div>
                        </div>

                        {/* Controls */}
                        <div style={{ display: 'flex', gap: 12, width: '100%' }}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleToggle}
                                style={{
                                    flex: 2, padding: '14px', borderRadius: 12,
                                    background: 'var(--nya-ochre)', border: 'none',
                                    color: '#fff', fontWeight: 800, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                                }}
                            >
                                {running ? <Pause size={16} /> : <Play size={16} />}
                                {running ? 'SUSPENDRE' : 'COMMENCER'}
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={resetSession}
                                style={{
                                    flex: 1, padding: '14px', borderRadius: 12,
                                    background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                                    color: 'var(--text-primary)', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                <RefreshCw size={16} />
                            </motion.button>
                        </div>
                    </div>

                </div>

            </main>
            <Footer />
        </div>
    )
}

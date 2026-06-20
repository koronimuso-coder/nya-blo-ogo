import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { useNotificationStore } from '../stores/notificationStore'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import { Dumbbell, Play, Pause, Activity, Flame, Clock } from 'lucide-react'

interface Routine {
    id: string
    name: string
    desc: string
    steps: string[]
    tempo: string
    duration: number // in seconds
    caloriesPerMin: number
}

const ROUTINES: Routine[] = [
    {
        id: 'zaouli',
        name: 'Échauffement Zaouli',
        desc: 'Inspiré de la danse sacrée Gouro connue pour sa rapidité et son jeu de jambes exceptionnel.',
        steps: [
            '1. Flexion légère des genoux en gardant le dos droit.',
            '2. Battements ultra-rapides des pieds alternés sur place.',
            '3. Balancement doux des bras au rythme du djembé.'
        ],
        tempo: 'Très rapide (140 BPM)',
        duration: 60,
        caloriesPerMin: 15
    },
    {
        id: 'dogon',
        name: 'Pas des Masques Kanaga',
        desc: 'Inspiré de la danse rituelle d\'élévation reliant la Terre au ciel.',
        steps: [
            '1. Grands cercles dessinés avec le torse vers le sol.',
            '2. Sauts légers pieds joints en levant les bras vers le ciel.',
            '3. Stabilisation au sol en position accroupie.'
        ],
        tempo: 'Solennel & cadencé (100 BPM)',
        duration: 90,
        caloriesPerMin: 10
    }
]

export default function Fitness() {
    const { addScore } = useAuthStore()
    const { push } = useNotificationStore()

    const [activeRoutine, setActiveRoutine] = useState(ROUTINES[0])
    const [running, setRunning] = useState(false)
    const [timeLeft, setTimeLeft] = useState(activeRoutine.duration)
    const [caloriesBurned, setCaloriesBurned] = useState(0)

    useEffect(() => {
        setTimeLeft(activeRoutine.duration)
        setCaloriesBurned(0)
        setRunning(false)
    }, [activeRoutine])

    useEffect(() => {
        if (!running) return
        if (timeLeft <= 0) {
            setRunning(false)
            addScore(20)
            push({
                type: 'reward',
                title: 'Entraînement Terminé',
                message: `Bravo ! Vous avez brûlé ${Math.floor(caloriesBurned)} Nya Calories. +20 Nya Score.`,
                icon: '🏋️',
                color: '#00E5A0'
            })
            return
        }

        const timer = setTimeout(() => {
            setTimeLeft(prev => prev - 1)
            setCaloriesBurned(prev => prev + (activeRoutine.caloriesPerMin / 60))
        }, 1000)

        return () => clearTimeout(timer)
    }, [running, timeLeft])

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60)
        const s = secs % 60
        return `${m}:${s < 10 ? '0' : ''}${s}`
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
                    <div className="cosmo-label">Soins d'Amma {" > "} Mouvements & Forme</div>
                    <h1 className="text-shimmer" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                        AMMA FITNESS
                    </h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, alignItems: 'center' }}>
                    
                    {/* Routine selector and Step directions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div style={{
                            background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                            borderRadius: 24, padding: 24
                        }}>
                            <h3 style={{
                                fontFamily: 'var(--font-display)', fontSize: '1rem',
                                fontWeight: 900, color: '#fff', marginBottom: 20,
                                display: 'flex', alignItems: 'center', gap: 8
                            }}>
                                <Dumbbell size={16} style={{ color: 'var(--nya-gold)' }} />
                                RHYTHMES PHYSIQUES
                            </h3>
                            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                                {ROUTINES.map(r => (
                                    <button
                                        key={r.id}
                                        onClick={() => { setActiveRoutine(r); setRunning(false) }}
                                        style={{
                                            padding: '10px 16px', borderRadius: 12,
                                            background: activeRoutine.id === r.id ? 'var(--nya-ochre)' : 'var(--bg-elevated)',
                                            border: activeRoutine.id === r.id ? 'none' : '1px solid var(--border-default)',
                                            color: '#fff', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer'
                                        }}
                                    >
                                        {r.name}
                                    </button>
                                ))}
                            </div>

                            {/* Steps list */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Mouvements à effectuer</span>
                                {activeRoutine.steps.map((step, idx) => (
                                    <div key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, padding: '8px 12px', background: 'var(--bg-primary)', borderRadius: 10 }}>
                                        {step}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Workout progress timer */}
                    <div style={{
                        background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                        borderRadius: 24, padding: 32, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', gap: 32, boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
                    }}>
                        {/* Circular progress rings */}
                        <div style={{
                            width: 200, height: 200, borderRadius: '50%',
                            background: 'radial-gradient(circle, #150f0c 0%, #050302 100%)',
                            border: '4px solid rgba(184,92,46,0.3)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            justifyContent: 'center', relative: 'position'
                        } as any}>
                            <Clock size={24} style={{ color: 'var(--nya-gold)', marginBottom: 8 }} />
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '2.5rem', fontWeight: 900, color: '#fff' }}>
                                {formatTime(timeLeft)}
                            </span>
                            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>
                                {activeRoutine.tempo}
                            </span>
                        </div>

                        {/* Calories details */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, width: '100%' }}>
                            <div style={{ background: 'var(--bg-primary)', padding: 16, borderRadius: 16, textAlign: 'center' }}>
                                <Flame size={18} style={{ color: '#ef4444', margin: '0 auto 6px' }} />
                                <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', display: 'block' }}>CALORIES</span>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                                    {Math.floor(caloriesBurned)}
                                </span>
                            </div>
                            <div style={{ background: 'var(--bg-primary)', padding: 16, borderRadius: 16, textAlign: 'center' }}>
                                <Activity size={18} style={{ color: '#00E5A0', margin: '0 auto 6px' }} />
                                <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', display: 'block' }}>TEMPO</span>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                                    {running ? 'ACTIF' : 'PAUSE'}
                                </span>
                            </div>
                        </div>

                        {/* Start controls */}
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setRunning(!running)}
                            style={{
                                width: '100%', padding: '16px', borderRadius: 12,
                                background: running ? 'rgba(239,68,68,0.1)' : 'var(--nya-ochre)',
                                border: running ? '1px solid #ef4444' : 'none',
                                color: running ? '#ef4444' : '#fff', fontWeight: 800,
                                textTransform: 'uppercase', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                            }}
                        >
                            {running ? (
                                <>
                                    <Pause size={16} /> METTRE EN PAUSE
                                </>
                            ) : (
                                <>
                                    <Play size={16} /> DÉMARRER LA DANSE
                                </>
                            )}
                        </motion.button>
                    </div>

                </div>

            </main>
            <Footer />
        </div>
    )
}

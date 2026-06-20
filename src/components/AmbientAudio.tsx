import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'

/**
 * AmbientAudio — "Sons de Sirius"
 * Generates a cosmic ambient soundscape using Web Audio API oscillators.
 * No external audio files needed — pure synthesis.
 */
export default function AmbientAudio() {
    const [playing, setPlaying] = useState(false)
    const [bars, setBars] = useState<number[]>([0.2, 0.3, 0.5, 0.4, 0.3])
    const audioCtxRef = useRef<AudioContext | null>(null)
    const gainRef = useRef<GainNode | null>(null)
    const oscillatorsRef = useRef<OscillatorNode[]>([])
    const animFrameRef = useRef<number>(0)

    const startAudio = useCallback(() => {
        if (audioCtxRef.current) return

        const ctx = new AudioContext()
        audioCtxRef.current = ctx

        const masterGain = ctx.createGain()
        const savedVol = localStorage.getItem('nya-audio-volume')
        const volPercent = savedVol ? parseInt(savedVol) : 80
        masterGain.gain.value = (volPercent / 100) * 0.08
        masterGain.connect(ctx.destination)
        gainRef.current = masterGain

        // Create a dreamy ambient pad with detuned oscillators
        const frequencies = [110, 164.81, 220, 277.18, 329.63] // Am chord harmonics
        const oscs: OscillatorNode[] = []

        frequencies.forEach((freq, i) => {
            const osc = ctx.createOscillator()
            const oscGain = ctx.createGain()

            osc.type = i < 2 ? 'sine' : 'triangle'
            osc.frequency.value = freq
            osc.detune.value = Math.random() * 8 - 4 // slight detune for richness

            oscGain.gain.value = 0.15 / (i + 1) // softer higher harmonics

            // Slow LFO for movement
            const lfo = ctx.createOscillator()
            const lfoGain = ctx.createGain()
            lfo.frequency.value = 0.05 + Math.random() * 0.1
            lfoGain.gain.value = 3
            lfo.connect(lfoGain)
            lfoGain.connect(osc.frequency)
            lfo.start()

            osc.connect(oscGain)
            oscGain.connect(masterGain)
            osc.start()
            oscs.push(osc)
        })

        oscillatorsRef.current = oscs

        // Animate bars
        const animateBars = () => {
            setBars(prev => prev.map(() => 0.15 + Math.random() * 0.85))
            animFrameRef.current = requestAnimationFrame(() => {
                setTimeout(() => {
                    animFrameRef.current = requestAnimationFrame(animateBars)
                }, 120)
            })
        }
        animateBars()
    }, [])

    const stopAudio = useCallback(() => {
        oscillatorsRef.current.forEach(osc => {
            try { osc.stop() } catch { /* already stopped */ }
        })
        oscillatorsRef.current = []
        if (audioCtxRef.current) {
            audioCtxRef.current.close()
            audioCtxRef.current = null
        }
        cancelAnimationFrame(animFrameRef.current)
        setBars([0.2, 0.3, 0.5, 0.4, 0.3])
    }, [])

    const toggle = () => {
        if (playing) {
            stopAudio()
        } else {
            startAudio()
        }
        setPlaying(!playing)
        localStorage.setItem('nya-ambient', (!playing).toString())
    }

    useEffect(() => {
        const handleVolumeChange = (e: Event) => {
            const vol = (e as CustomEvent).detail
            if (gainRef.current) {
                gainRef.current.gain.value = (vol / 100) * 0.08
            }
        }
        window.addEventListener('nya-volume-change', handleVolumeChange)
        return () => {
            stopAudio()
            window.removeEventListener('nya-volume-change', handleVolumeChange)
        }
    }, [stopAudio])

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
            style={{
                position: 'fixed',
                bottom: 100,
                left: 24,
                zIndex: 998,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
            }}
        >
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggle}
                style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: playing ? 'rgba(184,92,46,0.2)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${playing ? 'rgba(184,92,46,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    color: playing ? 'var(--nya-ochre)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(12px)',
                }}
                aria-label={playing ? 'Couper le son ambiant' : 'Activer le son ambiant'}
            >
                {playing ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </motion.button>

            {/* Mini visualizer */}
            <AnimatePresence>
                {playing && (
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        style={{
                            display: 'flex', alignItems: 'flex-end', gap: 2, height: 24,
                            overflow: 'hidden',
                        }}
                    >
                        {bars.map((h, i) => (
                            <motion.div
                                key={i}
                                animate={{ height: h * 24 }}
                                transition={{ duration: 0.15 }}
                                style={{
                                    width: 3, borderRadius: 2,
                                    background: `linear-gradient(to top, var(--nya-ochre), var(--nya-gold))`,
                                    opacity: 0.8,
                                }}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Label */}
            <AnimatePresence>
                {playing && (
                    <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 0.4, x: 0 }}
                        exit={{ opacity: 0 }}
                        style={{
                            fontSize: '0.55rem', fontWeight: 700,
                            letterSpacing: '0.15em', textTransform: 'uppercase',
                            color: 'var(--nya-ochre)',
                            fontFamily: 'var(--font-body)',
                        }}
                    >
                        SIRIUS FM
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

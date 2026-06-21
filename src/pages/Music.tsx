import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import { Play, Pause, SkipForward, Music as MusicIcon, Radio, Shuffle, Trash2 } from 'lucide-react'
import { useNotificationStore } from '../stores/notificationStore'

interface Track {
    id: string
    title: string
    artist: string
    desc: string
    bg: string
}

const TRACKS: Track[] = [
    { id: '1', title: 'Harpe de Nommo', artist: 'Sages de Bandiagara', desc: 'Cordes de kora synthétiques générées en temps réel aux harmonies douces.', bg: 'linear-gradient(135deg, #B85C2E 0%, #D4A017 100%)' },
    { id: '2', title: 'Vent du Sahel', artist: 'Constellation Sirius', desc: 'Bruits blancs filtrés modulant lentement comme des brises sahariennes.', bg: 'linear-gradient(135deg, #0a1a2e 0%, var(--nya-bright-gold) 100%)' },
    { id: '3', title: 'Écho de Sirius B', artist: 'Oracle Cosmique', desc: 'Pads profonds à modulation de fréquences lointaines.', bg: 'linear-gradient(135deg, #1C100B 0%, var(--nya-ochre) 100%)' },
]

// Drum synthesis engine helpers using Web Audio API
const synthDunun = (ctx: AudioContext, time: number) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(80, time)
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.25)
    
    gain.gain.setValueAtTime(0, time)
    gain.gain.linearRampToValueAtTime(0.5, time + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4)
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(time)
    osc.stop(time + 0.45)
}

const synthDjembe = (ctx: AudioContext, time: number) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(320, time)
    osc.frequency.exponentialRampToValueAtTime(140, time + 0.08)
    
    gain.gain.setValueAtTime(0, time)
    gain.gain.linearRampToValueAtTime(0.4, time + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15)
    
    osc.connect(gain)
    
    // High-pass snap noise for the slap
    try {
        const bufferSize = ctx.sampleRate * 0.03
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
        const data = buffer.getChannelData(0)
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1
        }
        const noise = ctx.createBufferSource()
        noise.buffer = buffer
        const filter = ctx.createBiquadFilter()
        filter.type = 'highpass'
        filter.frequency.value = 1000
        const noiseGain = ctx.createGain()
        noiseGain.gain.setValueAtTime(0.12, time)
        noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.03)
        
        noise.connect(filter)
        filter.connect(noiseGain)
        noiseGain.connect(gain)
        
        noise.start(time)
        noise.stop(time + 0.04)
    } catch (e) {}

    gain.connect(ctx.destination)
    osc.start(time)
    osc.stop(time + 0.16)
}

const synthTama = (ctx: AudioContext, time: number) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(240, time)
    osc.frequency.exponentialRampToValueAtTime(380, time + 0.12)
    
    gain.gain.setValueAtTime(0, time)
    gain.gain.linearRampToValueAtTime(0.35, time + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15)
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(time)
    osc.stop(time + 0.16)
}

const synthShekere = (ctx: AudioContext, time: number) => {
    try {
        const bufferSize = ctx.sampleRate * 0.06
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
        const data = buffer.getChannelData(0)
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1
        }
        const noise = ctx.createBufferSource()
        noise.buffer = buffer
        
        const filter = ctx.createBiquadFilter()
        filter.type = 'bandpass'
        filter.frequency.value = 3500
        filter.Q.value = 3.0
        
        const gain = ctx.createGain()
        gain.gain.setValueAtTime(0, time)
        gain.gain.linearRampToValueAtTime(0.2, time + 0.005)
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05)
        
        noise.connect(filter)
        filter.connect(gain)
        gain.connect(ctx.destination)
        
        noise.start(time)
        noise.stop(time + 0.06)
    } catch (e) {}
}

export default function Music() {
    const { push } = useNotificationStore()
    
    // Background Vinyl Player States
    const [playing, setPlaying] = useState(false)
    const [currentTrack, setCurrentTrack] = useState(TRACKS[0])

    const audioCtxRef = useRef<AudioContext | null>(null)
    const gainRef = useRef<GainNode | null>(null)
    const synthIntervalRef = useRef<any | null>(null)
    const noiseNodeRef = useRef<AudioNode | null>(null)

    // Beat Sequencer States
    const [isPlayingSeq, setIsPlayingSeq] = useState(false)
    const [bpm, setBpm] = useState(115)
    const [currentStep, setCurrentStep] = useState(-1)
    const [grid, setGrid] = useState<boolean[][]>([
        [true, false, false, false, true, false, false, false],  // Dunun
        [false, false, true, false, false, false, true, false],  // Djembe
        [false, true, false, true, false, true, false, true],    // Tama
        [true, true, true, true, true, true, true, true],        // Shekere
    ])

    const seqIntervalRef = useRef<any | null>(null)
    const nextNoteTimeRef = useRef(0)
    const stepRef = useRef(0)

    const gridRef = useRef(grid)
    useEffect(() => {
        gridRef.current = grid
    }, [grid])

    const bpmRef = useRef(bpm)
    useEffect(() => {
        bpmRef.current = bpm
    }, [bpm])

    const startSynth = useCallback((trackId: string) => {
        stopSynth()

        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
        audioCtxRef.current = ctx

        const masterGain = ctx.createGain()
        const savedVol = localStorage.getItem('nya-audio-volume')
        const volPercent = savedVol ? parseInt(savedVol) : 80
        masterGain.gain.value = (volPercent / 100) * 0.08
        masterGain.connect(ctx.destination)
        gainRef.current = masterGain

        if (trackId === '1') {
            const pentatonic = [146.83, 164.81, 196.00, 220.00, 246.94, 293.66, 329.63, 392.00] // D scale
            
            synthIntervalRef.current = setInterval(() => {
                if (ctx.state === 'suspended') return
                const note = pentatonic[Math.floor(Math.random() * pentatonic.length)]
                const osc = ctx.createOscillator()
                const oscGain = ctx.createGain()

                osc.type = 'triangle'
                osc.frequency.value = note

                oscGain.gain.setValueAtTime(0, ctx.currentTime)
                oscGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02)
                oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)

                osc.connect(oscGain)
                oscGain.connect(masterGain)
                osc.start()
                osc.stop(ctx.currentTime + 0.9)
            }, 350)
        } else if (trackId === '2') {
            const bufferSize = ctx.sampleRate * 2
            const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
            const output = noiseBuffer.getChannelData(0)
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1
            }

            const whiteNoise = ctx.createBufferSource()
            whiteNoise.buffer = noiseBuffer
            whiteNoise.loop = true

            const filter = ctx.createBiquadFilter()
            filter.type = 'bandpass'
            filter.frequency.value = 400
            filter.Q.value = 3.0

            const modulator = ctx.createOscillator()
            modulator.frequency.value = 0.08
            const modGain = ctx.createGain()
            modGain.gain.value = 150

            modulator.connect(modGain)
            modGain.connect(filter.frequency)

            whiteNoise.connect(filter)
            filter.connect(masterGain)

            modulator.start()
            whiteNoise.start()
            noiseNodeRef.current = whiteNoise
        } else if (trackId === '3') {
            const frequencies = [110, 220, 330, 440]
            const oscs: OscillatorNode[] = []
            frequencies.forEach((freq, idx) => {
                const osc = ctx.createOscillator()
                const oscGain = ctx.createGain()
                
                osc.type = 'sine'
                osc.frequency.value = freq + (Math.random() * 2 - 1)
                oscGain.gain.value = 0.15 / (idx + 1)

                const lfo = ctx.createOscillator()
                const lfoGain = ctx.createGain()
                lfo.frequency.value = 0.04 + (idx * 0.02)
                lfoGain.gain.value = 0.05
                lfo.connect(lfoGain)
                lfoGain.connect(oscGain.gain)
                
                osc.connect(oscGain)
                oscGain.connect(masterGain)
                
                lfo.start()
                osc.start()
                oscs.push(osc)
            })
            synthIntervalRef.current = {
                stop: () => oscs.forEach(o => { try{o.stop()}catch{} })
            }
        }
    }, [])

    const stopSynth = () => {
        if (synthIntervalRef.current) {
            if (typeof synthIntervalRef.current === 'number') {
                clearInterval(synthIntervalRef.current)
            } else if (synthIntervalRef.current.stop) {
                synthIntervalRef.current.stop()
            }
            synthIntervalRef.current = null
        }
        if (noiseNodeRef.current) {
            try { (noiseNodeRef.current as any).stop() } catch {}
            noiseNodeRef.current = null
        }
        if (audioCtxRef.current && !isPlayingSeq) {
            try { audioCtxRef.current.close() } catch {}
            audioCtxRef.current = null
        }
    }

    const togglePlay = () => {
        if (playing) {
            stopSynth()
        } else {
            if (isPlayingSeq) {
                stopSequencer()
            }
            startSynth(currentTrack.id)
        }
        setPlaying(!playing)
    }

    const selectTrack = (track: Track) => {
        setCurrentTrack(track)
        if (playing) {
            startSynth(track.id)
        }
    }

    const skipNext = () => {
        const nextIdx = (TRACKS.findIndex(t => t.id === currentTrack.id) + 1) % TRACKS.length
        selectTrack(TRACKS[nextIdx])
    }

    // Step Sequencer Logic
    const stopSequencer = useCallback(() => {
        if (seqIntervalRef.current) {
            clearInterval(seqIntervalRef.current)
            seqIntervalRef.current = null
        }
        setIsPlayingSeq(false)
        setCurrentStep(-1)
    }, [])

    const startSequencer = useCallback(() => {
        if (seqIntervalRef.current) {
            clearInterval(seqIntervalRef.current)
        }

        const ctx = audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)()
        audioCtxRef.current = ctx
        if (ctx.state === 'suspended') {
            ctx.resume()
        }

        nextNoteTimeRef.current = ctx.currentTime
        stepRef.current = 0
        setCurrentStep(-1)
        setIsPlayingSeq(true)

        const scheduleNextSteps = () => {
            const lookahead = 0.12
            const secondsPerStep = (60.0 / bpmRef.current) / 2 // 8th notes

            while (nextNoteTimeRef.current < ctx.currentTime + lookahead) {
                const stepIdx = stepRef.current % 8
                
                if (gridRef.current[0][stepIdx]) synthDunun(ctx, nextNoteTimeRef.current)
                if (gridRef.current[1][stepIdx]) synthDjembe(ctx, nextNoteTimeRef.current)
                if (gridRef.current[2][stepIdx]) synthTama(ctx, nextNoteTimeRef.current)
                if (gridRef.current[3][stepIdx]) synthShekere(ctx, nextNoteTimeRef.current)

                const noteTime = nextNoteTimeRef.current
                setTimeout(() => {
                    setCurrentStep(stepIdx)
                }, Math.max(0, (noteTime - ctx.currentTime) * 1000))

                nextNoteTimeRef.current += secondsPerStep
                stepRef.current++
            }
        }

        seqIntervalRef.current = setInterval(scheduleNextSteps, 25)
    }, [])

    const toggleSequencer = () => {
        if (isPlayingSeq) {
            stopSequencer()
        } else {
            if (playing) {
                stopSynth()
                setPlaying(false)
            }
            startSequencer()
        }
    }

    const togglePad = (rowIdx: number, stepIdx: number) => {
        const newGrid = grid.map((row, r) => 
            row.map((val, s) => r === rowIdx && s === stepIdx ? !val : val)
        )
        setGrid(newGrid)
    }

    const applyPreset = (presetName: string) => {
        let newGrid = [
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
        ]

        if (presetName === 'mandingue') {
            newGrid = [
                [true, false, false, false, true, false, false, false],  // Dunun
                [false, false, true, false, false, true, false, true],   // Djembe
                [false, true, false, true, false, true, false, false],   // Tama
                [true, true, true, true, true, true, true, true],        // Shekere
            ]
        } else if (presetName === 'sirius') {
            newGrid = [
                [true, false, false, true, false, false, true, false],   // Dunun
                [false, false, true, false, false, true, false, false],  // Djembe
                [true, true, false, false, true, true, false, true],     // Tama
                [true, false, true, false, true, false, true, false],    // Shekere
            ]
        } else if (presetName === 'transe') {
            newGrid = [
                [true, false, true, false, true, false, true, false],    // Dunun
                [true, true, false, true, true, true, false, true],      // Djembe
                [false, false, true, false, false, false, true, false],  // Tama
                [true, true, true, true, true, true, true, true],        // Shekere
            ]
        }
        setGrid(newGrid)
        push({
            type: 'system',
            title: 'Pattern appliqué',
            message: `Le rythme "${presetName.toUpperCase()}" a été programmé sur la grille.`,
            icon: '🥁',
            color: 'var(--nya-gold)'
        })
    }

    const randomizeGrid = () => {
        const newGrid = grid.map(row => 
            row.map(() => Math.random() > 0.65)
        )
        setGrid(newGrid)
        push({
            type: 'system',
            title: 'Polyrhythme généré',
            message: 'Un arrangement rythmique aléatoire a été tissé.',
            icon: '🎲',
            color: 'var(--nya-ochre)'
        })
    }

    const clearGrid = () => {
        const newGrid = [
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
        ]
        setGrid(newGrid)
    }

    useEffect(() => {
        return () => {
            stopSynth()
            if (seqIntervalRef.current) {
                clearInterval(seqIntervalRef.current)
            }
        }
    }, [stopSequencer])

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 100 }}>
            <Starfield />
            <CosmicBackground />
            <Navbar />

            {/* Main content */}
            <main className="max-w-container" style={{ paddingTop: 120, position: 'relative', zIndex: 2 }}>
                
                {/* Hero Header */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginBottom: 48 }}>
                    <div className="cosmo-label">Toguna Radio {" > "} Flux Ambiant</div>
                    <h1 className="text-shimmer" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                        SIRIUS STREAM
                    </h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, alignItems: 'center', marginBottom: 64 }}>
                    
                    {/* Vinyl player display */}
                    <div style={{
                        background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                        borderRadius: 24, padding: 40, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', gap: 32, boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                        position: 'relative'
                    }}>
                        {/* Turntable plate */}
                        <div style={{
                            width: 280, height: 280, borderRadius: '50%',
                            background: '#111', border: '10px solid #222',
                            boxShadow: '0 15px 35px rgba(0,0,0,0.6), inset 0 0 30px rgba(0,0,0,0.9)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            position: 'relative'
                        }}>
                            {/* Rotating Vinyl */}
                            <motion.div
                                animate={playing ? { rotate: 360 } : {}}
                                transition={playing ? { repeat: Infinity, duration: 8, ease: 'linear' } : {}}
                                style={{
                                    width: 250, height: 250, borderRadius: '50%',
                                    background: 'repeating-radial-gradient(circle, #222, #222 2px, #111 3px, #111 4px)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '2px solid rgba(255,255,255,0.05)', position: 'relative'
                                }}
                            >
                                {/* Center label */}
                                <div style={{
                                    width: 90, height: 90, borderRadius: '50%',
                                    background: currentTrack.bg, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    border: '3px solid #111'
                                }}>
                                    <Radio size={24} color="#fff" />
                                </div>
                            </motion.div>

                            {/* Player arm needle */}
                            <motion.div
                                animate={playing ? { rotate: 22 } : { rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 50 }}
                                style={{
                                    position: 'absolute', top: 0, right: 30,
                                    width: 12, height: 120, background: '#888',
                                    transformOrigin: 'top center', borderRadius: 4,
                                    boxShadow: '2px 2px 5px rgba(0,0,0,0.4)',
                                    zIndex: 5
                                }}
                            />
                        </div>

                        {/* Controls */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%' }}>
                            <div style={{ textAlign: 'center' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{currentTrack.title}</h3>
                                <p style={{ fontSize: '0.75rem', color: 'var(--nya-gold)', textTransform: 'uppercase', marginTop: 4 }}>{currentTrack.artist}</p>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={togglePlay}
                                    style={{
                                        width: 60, height: 60, borderRadius: '50%',
                                        background: 'var(--nya-ochre)', border: 'none',
                                        color: '#fff', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', cursor: 'pointer',
                                        boxShadow: '0 8px 20px rgba(184,92,46,0.3)'
                                    }}
                                >
                                    {playing ? <Pause size={24} /> : <Play size={24} />}
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={skipNext}
                                    style={{
                                        width: 44, height: 44, borderRadius: '50%',
                                        background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                                        color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', cursor: 'pointer'
                                    }}
                                >
                                    <SkipForward size={18} />
                                </motion.button>
                            </div>
                        </div>

                    </div>

                    {/* Playlist Track Selection */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        
                        <div style={{
                            background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                            borderRadius: 24, padding: 24
                        }}>
                            <h3 style={{
                                fontFamily: 'var(--font-display)', fontSize: '1.1rem',
                                fontWeight: 900, color: '#fff', marginBottom: 20,
                                display: 'flex', alignItems: 'center', gap: 10
                            }}>
                                <MusicIcon size={18} style={{ color: 'var(--nya-gold)' }} />
                                CANAUX AMBIANTS
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {TRACKS.map((track) => {
                                    const active = currentTrack.id === track.id
                                    return (
                                        <div
                                            key={track.id}
                                            onClick={() => selectTrack(track)}
                                            style={{
                                                background: active ? 'rgba(184,92,46,0.08)' : 'var(--bg-elevated)',
                                                border: active ? '1px solid var(--nya-ochre)' : '1px solid var(--border-default)',
                                                borderRadius: 16, padding: '16px 20px', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', gap: 16,
                                                transition: 'all 0.3s'
                                            }}
                                        >
                                            <div style={{
                                                width: 36, height: 36, borderRadius: 10,
                                                background: track.bg, display: 'flex',
                                                alignItems: 'center', justifyContent: 'center',
                                                color: '#fff', fontSize: '1.1rem'
                                            }}>
                                                <Radio size={16} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>
                                                    {track.title}
                                                </div>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                                    {track.artist}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Track Lore / Info Card */}
                        <div style={{
                            background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                            borderRadius: 24, padding: 24
                        }}>
                            <span style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--nya-gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Lore de la Fréquence</span>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginTop: 8, color: '#fff' }}>
                                {currentTrack.title}
                            </h4>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 8 }}>
                                {currentTrack.desc}
                            </p>
                        </div>

                    </div>

                </div>

                {/* ─── NEXUS BEAT WEAVER (SEQUENCER) ─── */}
                <section style={{
                    background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                    borderRadius: 24, padding: 32, boxShadow: '0 20px 50px rgba(0,0,0,0.4)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20, borderBottom: '1px solid var(--border-default)', paddingBottom: 20, marginBottom: 28 }}>
                        <div>
                            <div className="cosmo-label" style={{ color: 'var(--nya-gold)' }}>INITIATION RYTHMIQUE</div>
                            <h2 style={{ fontSize: '1.6rem', color: '#fff', marginTop: 4 }}>TISSEUR DE RYTHMES NOMMO</h2>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                Programmez des polyrythmes traditionnels à l'aide de percussions ouest-africaines synthétisées en temps réel.
                            </p>
                        </div>

                        {/* Sequencer Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                            {/* BPM Slider */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 12, padding: '8px 16px' }}>
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)' }}>TEMPO:</span>
                                <input
                                    type="range"
                                    min="60"
                                    max="180"
                                    value={bpm}
                                    onChange={(e) => setBpm(parseInt(e.target.value))}
                                    style={{ width: 80, accentColor: 'var(--nya-gold)' }}
                                />
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--nya-gold)', fontFamily: 'var(--font-code)', width: 50, textAlign: 'right' }}>{bpm} BPM</span>
                            </div>

                            {/* Preset drop-down */}
                            <select
                                onChange={(e) => {
                                    if (e.target.value) applyPreset(e.target.value)
                                    e.target.value = ''
                                }}
                                style={{
                                    background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                                    color: '#fff', borderRadius: 12, padding: '10px 14px', fontSize: '0.75rem',
                                    fontWeight: 700, cursor: 'pointer', outline: 'none'
                                }}
                            >
                                <option value="">Choisir un Rythme...</option>
                                <option value="mandingue">Rythme Mandingue</option>
                                <option value="sirius">Constellation Bounce</option>
                                <option value="transe">Transe des Initiés</option>
                            </select>

                            <button
                                onClick={randomizeGrid}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                                    color: '#fff', padding: '10px 16px', borderRadius: 12,
                                    fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer'
                                }}
                            >
                                <Shuffle size={14} /> ALÉATOIRE
                            </button>

                            <button
                                onClick={clearGrid}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    background: 'none', border: '1px solid rgba(239, 68, 68, 0.3)',
                                    color: '#ef4444', padding: '10px 16px', borderRadius: 12,
                                    fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer'
                                }}
                            >
                                <Trash2 size={14} /> VIDER
                            </button>
                        </div>
                    </div>

                    {/* Step Grid Container */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {[
                            { name: 'DUNUN (Basse)', color: 'var(--nya-gold)' },
                            { name: 'DJEMBÉ (Slap)', color: 'var(--nya-ochre)' },
                            { name: 'TAMA (Talking Drum)', color: 'var(--nya-sirius)' },
                            { name: 'SHÉKÉRÉ (Sec)', color: 'var(--nya-sand)' },
                        ].map((inst, rowIdx) => (
                            <div key={rowIdx} style={{ display: 'grid', gridTemplateColumns: '1.2fr repeat(8, 1fr)', gap: 12, alignItems: 'center' }}>
                                {/* Instrument label */}
                                <div style={{
                                    fontFamily: 'var(--font-display)', fontSize: '0.85rem',
                                    fontWeight: 900, color: inst.color, textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    {inst.name}
                                </div>

                                {/* Step Pads */}
                                {grid[rowIdx].map((isActive, stepIdx) => {
                                    const isCurrent = currentStep === stepIdx
                                    return (
                                        <div
                                            key={stepIdx}
                                            onClick={() => togglePad(rowIdx, stepIdx)}
                                            style={{
                                                aspectRatio: '1', borderRadius: 10, cursor: 'pointer',
                                                background: isActive ? inst.color : 'var(--bg-elevated)',
                                                border: isCurrent 
                                                    ? '2.5px solid #fff' 
                                                    : `1px solid ${isActive ? 'transparent' : 'var(--border-default)'}`,
                                                boxShadow: isActive 
                                                    ? `0 0 14px ${inst.color}` 
                                                    : 'none',
                                                transform: isCurrent ? 'scale(1.08)' : 'scale(1)',
                                                transition: 'all 0.12s ease',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}
                                        >
                                            {/* Micro-dot representing active playhead */}
                                            {isCurrent && (
                                                <div style={{
                                                    width: 6, height: 6, borderRadius: '50%',
                                                    background: isActive ? '#000' : '#fff'
                                                }} />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>

                    {/* Play Sequencer Trigger */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleSequencer}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                background: isPlayingSeq ? '#ef4444' : 'var(--nya-ochre)',
                                border: 'none', color: '#fff', padding: '16px 32px',
                                borderRadius: 16, fontSize: '0.9rem', fontWeight: 900,
                                letterSpacing: '0.08em', textTransform: 'uppercase',
                                cursor: 'pointer', boxShadow: isPlayingSeq 
                                    ? '0 8px 24px rgba(239,68,68,0.25)' 
                                    : '0 8px 24px rgba(184,92,46,0.3)'
                            }}
                        >
                            {isPlayingSeq ? <Pause size={18} /> : <Play size={18} />}
                            {isPlayingSeq ? 'Arrêter le Séquenceur' : 'Lancer le Rythme'}
                        </motion.button>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    )
}

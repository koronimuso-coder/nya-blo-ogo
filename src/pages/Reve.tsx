import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { useNotificationStore } from '../stores/notificationStore'
import { useAudioFX } from '../hooks/useAudioFX'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import { Sparkles, RefreshCw } from 'lucide-react'

interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    alpha: number
    color: string
    size: number
    life: number
}

interface StarNode {
    x: number
    y: number
    targetX: number
    targetY: number
    size: number
}

export default function Reve() {
    const { addCoins } = useAuthStore()
    const { push } = useNotificationStore()
    const { playRipple, playChime } = useAudioFX()

    const [dream, setDream] = useState('')
    const [interpreting, setInterpreting] = useState(false)
    const [interpretation, setInterpretation] = useState<string | null>(null)
    
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<Particle[]>([])
    const constellationStarsRef = useRef<StarNode[]>([])
    const isDreamAnalyzedRef = useRef(false)
    const activeSymbolRef = useRef<string>('')

    // Water wave physics buffers
    const width = 250
    const height = 250
    const buffer1 = useRef<Float32Array>(new Float32Array(width * height))
    const buffer2 = useRef<Float32Array>(new Float32Array(width * height))
    const damping = 0.96

    // Spawn a water ripple at canvas relative coords
    const addRipple = (cx: number, cy: number, strength = 128) => {
        const x = Math.floor(cx)
        const y = Math.floor(cy)
        if (x < 1 || x >= width - 1 || y < 1 || y >= height - 1) return

        buffer1.current[y * width + x] = strength
        buffer1.current[(y + 1) * width + x] = strength
        buffer1.current[(y - 1) * width + x] = strength
        buffer1.current[y * width + (x + 1)] = strength
        buffer1.current[y * width + (x - 0)] = strength

        playRipple()
    }

    // Spawn random glowing particles
    const spawnParticles = (count: number, cx: number, cy: number, color: string) => {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2
            const speed = 0.5 + Math.random() * 2.5
            particlesRef.current.push({
                x: cx,
                y: cy,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                alpha: 1.0,
                color: color,
                size: 1.5 + Math.random() * 2,
                life: 30 + Math.random() * 50
            })
        }
    }

    // Set constellation star layouts based on detected symbol
    const loadConstellation = (symbol: string) => {
        const stars: StarNode[] = []
        const cx = width / 2
        const cy = height / 2

        if (symbol === 'Serpent') {
            // S-shape serpent constellation
            for (let i = 0; i < 7; i++) {
                const angle = (i * Math.PI) / 3
                const r = 30 + i * 8
                stars.push({
                    x: cx + Math.sin(angle) * r + (Math.random() - 0.5) * 40,
                    y: cy + Math.cos(angle) * 30 + (Math.random() - 0.5) * 40,
                    targetX: cx + Math.sin(angle) * r,
                    targetY: cy + Math.cos(angle) * 30,
                    size: 2 + Math.random() * 3
                })
            }
        } else if (symbol === 'Eau') {
            // Wavy ripple structure
            for (let i = 0; i < 8; i++) {
                const tx = cx - 70 + i * 20
                const ty = cy + Math.sin(i * 1.5) * 20
                stars.push({
                    x: tx + (Math.random() - 0.5) * 30,
                    y: ty + (Math.random() - 0.5) * 30,
                    targetX: tx,
                    targetY: ty,
                    size: 2 + Math.random() * 3
                })
            }
        } else if (symbol === 'Étoile') {
            // Star shaped constellation (5 points)
            stars.push({ x: cx, y: cy, targetX: cx, targetY: cy - 60, size: 4 }) // top
            stars.push({ x: cx, y: cy, targetX: cx + 50, targetY: cy + 40, size: 3 }) // bottom right
            stars.push({ x: cx, y: cy, targetX: cx - 40, targetY: cy - 20, size: 3 }) // left top
            stars.push({ x: cx, y: cy, targetX: cx + 40, targetY: cy - 20, size: 3 }) // right top
            stars.push({ x: cx, y: cy, targetX: cx - 50, targetY: cy + 40, size: 3 }) // bottom left
            stars.push({ x: cx, y: cy, targetX: cx, targetY: cy, size: 5 }) // center Sirius B
        } else {
            // Oiseau (Bird / V-shape)
            stars.push({ x: cx, y: cy, targetX: cx, targetY: cy + 10, size: 4 }) // Center body
            stars.push({ x: cx, y: cy, targetX: cx - 50, targetY: cy - 40, size: 3 }) // Wing left tip
            stars.push({ x: cx, y: cy, targetX: cx - 25, targetY: cy - 15, size: 2.5 })
            stars.push({ x: cx, y: cy, targetX: cx + 25, targetY: cy - 15, size: 2.5 })
            stars.push({ x: cx, y: cy, targetX: cx + 50, targetY: cy - 40, size: 3 }) // Wing right tip
            stars.push({ x: cx, y: cy, targetX: cx, targetY: cy + 45, size: 3 }) // Tail
        }

        constellationStarsRef.current = stars
    }

    // Simulation loop
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number

        const updatePhysics = () => {
            const b1 = buffer1.current
            const b2 = buffer2.current

            // 2D Wave propagation equations
            for (let y = 1; y < height - 1; y++) {
                for (let x = 1; x < width - 1; x++) {
                    const idx = y * width + x
                    b2[idx] = (
                        b1[idx - 1] +
                        b1[idx + 1] +
                        b1[idx - width] +
                        b1[idx + width]
                    ) / 2 - b2[idx]
                    b2[idx] *= damping
                }
            }

            // Swap buffers
            buffer1.current = b2
            buffer2.current = b1
        }

        const render = () => {
            updatePhysics()

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Draw dark circular pool gradient
            const grad = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, 120)
            grad.addColorStop(0, '#0c1a20')
            grad.addColorStop(1, '#020608')
            ctx.fillStyle = grad
            ctx.beginPath()
            ctx.arc(width / 2, height / 2, 115, 0, Math.PI * 2)
            ctx.fill()

            // Draw pool reflection using water waves buffer heights
            const b1 = buffer1.current
            const imgData = ctx.getImageData(0, 0, width, height)
            const pixels = imgData.data

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const idx = y * width + x
                    const val = b1[idx]
                    
                    // Only modify pixels inside circular basin
                    const dx = x - width / 2
                    const dy = y - height / 2
                    if (dx * dx + dy * dy < 115 * 115) {
                        const pixelIdx = idx * 4
                        // Ripples glow in aqua neon hue (#00E5A0)
                        pixels[pixelIdx] += Math.min(255, val * 0.4) // R
                        pixels[pixelIdx + 1] += Math.min(255, val * 1.5 + 20) // G
                        pixels[pixelIdx + 2] += Math.min(255, val * 2.2 + 60) // B
                    }
                }
            }
            ctx.putImageData(imgData, 0, 0)

            // Draw ambient particles
            const particles = particlesRef.current
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i]
                p.x += p.vx
                p.y += p.vy
                p.alpha -= 0.015
                p.life--

                ctx.fillStyle = p.color
                ctx.globalAlpha = Math.max(0, p.alpha)
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fill()

                if (p.life <= 0 || p.alpha <= 0) {
                    particles.splice(i, 1)
                }
            }
            ctx.globalAlpha = 1.0

            // Draw Constellation Stars if analyzed
            if (isDreamAnalyzedRef.current) {
                const stars = constellationStarsRef.current
                ctx.strokeStyle = 'rgba(0, 229, 160, 0.15)'
                ctx.lineWidth = 1.5

                // Draw connecting constellation lines
                ctx.beginPath()
                for (let i = 0; i < stars.length; i++) {
                    // Smoothly animate stars towards target coordinates
                    const s = stars[i]
                    s.x += (s.targetX - s.x) * 0.08
                    s.y += (s.targetY - s.y) * 0.08

                    if (i === 0) ctx.moveTo(s.x, s.y)
                    else ctx.lineTo(s.x, s.y)
                }
                ctx.stroke()

                // Draw star nodes
                stars.forEach((s) => {
                    ctx.fillStyle = '#fff'
                    ctx.shadowColor = 'rgba(0, 229, 160, 0.9)'
                    ctx.shadowBlur = 10
                    ctx.beginPath()
                    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
                    ctx.fill()
                    ctx.shadowBlur = 0 // reset
                })
            }

            // Pool circular border glow
            ctx.strokeStyle = 'rgba(0, 229, 160, 0.25)'
            ctx.lineWidth = 4
            ctx.beginPath()
            ctx.arc(width / 2, height / 2, 116, 0, Math.PI * 2)
            ctx.stroke()

            animationFrameId = requestAnimationFrame(render)
        }

        render()

        return () => {
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = canvasRef.current?.getBoundingClientRect()
        if (!rect) return
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        
        // Spawn physical waves
        addRipple(x, y, 160)
        // Spawn glow click particles
        spawnParticles(15, x, y, 'rgba(0, 229, 160, 0.6)')
    }

    const handleInterpret = (e: React.FormEvent) => {
        e.preventDefault()
        if (!dream.trim()) return

        setInterpreting(true)
        setInterpretation(null)
        isDreamAnalyzedRef.current = false

        // Parse key elements for customized reply
        const lowerDream = dream.toLowerCase()
        let detectedSymbol = ''
        let interpretationText = ''
        let symbolColor = ''

        if (lowerDream.includes('serpent') || lowerDream.includes('cobra')) {
            detectedSymbol = 'Serpent'
            symbolColor = 'rgba(184, 92, 46, 0.7)' // Ochre
            interpretationText = "Dans les mystères du Toguna, le serpent symbolise la régénération spirituelle, la sagesse cachée et la force vitale tellurique. Votre rêve indique une période de transformation profonde. Préparez-vous à muer et à accueillir un nouveau savoir."
        } else if (lowerDream.includes('eau') || lowerDream.includes('rivière') || lowerDream.includes('mer') || lowerDream.includes('pluie')) {
            detectedSymbol = 'Eau'
            symbolColor = 'rgba(0, 180, 216, 0.7)' // Cyan
            interpretationText = "L'eau est le domaine du Nommo, messager divin d'Amma. Rêver d'eau symbolise la purification de votre esprit, l'apaisement des colères et l'arrivée prochaine d'une parole féconde. Vos projets s'écouleront sans encombre."
        } else if (lowerDream.includes('étoile') || lowerDream.includes('ciel') || lowerDream.includes('voler') || lowerDream.includes('espace')) {
            detectedSymbol = 'Étoile'
            symbolColor = 'rgba(230, 194, 41, 0.7)' // Gold
            interpretationText = "Les astres de Sirius veillent sur vous. Rêver de vol céleste ou d'étoiles est le présage d'une élévation intellectuelle majeure. Vous êtes appelé à devenir un Scribe Érudit de premier plan. Restez à l'écoute des murmures cosmiques."
        } else {
            detectedSymbol = 'Oiseau'
            symbolColor = 'rgba(0, 229, 160, 0.7)' // Neon Emerald
            interpretationText = "L'oiseau messager du Toguna indique une nouvelle imminente en provenance d'une contrée lointaine. Votre esprit cherche à s'affranchir des contraintes terrestres pour embrasser une vision globale."
        }

        activeSymbolRef.current = detectedSymbol

        // Simulation water disturbances at start of interpretation
        let count = 0
        const interval = setInterval(() => {
            const rx = width / 2 + (Math.random() - 0.5) * 80
            const ry = height / 2 + (Math.random() - 0.5) * 80
            addRipple(rx, ry, 110)
            spawnParticles(5, rx, ry, symbolColor)
            count++
            if (count > 8) clearInterval(interval)
        }, 300)

        setTimeout(() => {
            setInterpreting(false)
            setInterpretation(`✦ Oracle d'Amma — Symbole identifié : ${detectedSymbol}\n\n"${interpretationText}"`)
            
            // Assemble constellation
            loadConstellation(detectedSymbol)
            isDreamAnalyzedRef.current = true
            
            playChime()
            addCoins(15)
            
            push({
                type: 'reward',
                title: 'Rêve Enregistré',
                message: 'L\'Oracle a analysé votre vision. +15 Nya Coins ajoutés.',
                icon: '🔮',
                color: '#B85C2E'
            })
        }, 3000)
    }

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 100 }}>
            <Starfield />
            <CosmicBackground />
            <Navbar />

            {/* Main content */}
            <main className="max-w-container" style={{ paddingTop: 120, position: 'relative', zIndex: 2 }}>
                
                {/* Hero Header */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
                    <div className="cosmo-label">Observatoire {" > "} Espace Mystique</div>
                    <h1 className="text-shimmer" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                        ORACLE DES RÊVES
                    </h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, alignItems: 'center' }}>
                    
                    {/* Dream input form */}
                    <div style={{
                        background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                        borderRadius: 24, padding: 32, boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
                    }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 900, color: '#fff', marginBottom: 20 }}>
                            RACONTER VOTRE VISION NOCTURNE
                        </h3>

                        <form onSubmit={handleInterpret} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div>
                                <textarea
                                    value={dream}
                                    onChange={(e) => setDream(e.target.value)}
                                    placeholder="Racontez les détails de votre rêve (ex: un serpent rampant, une rivière d'eau pure, s'envoler vers les étoiles)..."
                                    required
                                    rows={5}
                                    style={{
                                        width: '100%', padding: '16px',
                                        background: 'var(--bg-primary)', border: '1px solid var(--border-default)',
                                        borderRadius: 14, color: 'var(--text-primary)', outline: 'none',
                                        fontSize: '0.85rem', lineHeight: 1.6, resize: 'none'
                                    }}
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={interpreting}
                                style={{
                                    padding: '16px', borderRadius: 12,
                                    background: 'var(--nya-ochre)', border: 'none',
                                    color: '#fff', fontWeight: 800, letterSpacing: '0.1em',
                                    textTransform: 'uppercase', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                                }}
                            >
                                {interpreting ? (
                                    <>
                                        <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                        ALIGNEMENT DES ASTRES...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={16} /> INTERPRÉTER LE RÊVE
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </div>

                    {/* Mystical water reflection canvas */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
                        <div style={{
                            width: 250, height: 250, borderRadius: '50%',
                            background: 'radial-gradient(circle, #0e1e24 0%, #050b0c 100%)',
                            border: '4px solid rgba(0, 229, 160, 0.35)',
                            boxShadow: '0 0 35px rgba(0, 229, 160, 0.25), inset 0 0 20px rgba(0,0,0,0.8)',
                            overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer'
                        }}>
                            <canvas 
                                ref={canvasRef} 
                                width={width} 
                                height={height} 
                                onClick={handleCanvasClick}
                            />
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: 220, lineHeight: 1.5 }}>
                            Cliquez sur le Bassin de Divination pour perturber l'eau stellaire.
                        </div>

                        <AnimatePresence>
                            {interpretation && (
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    style={{
                                        background: 'var(--nya-deep)', border: '1px solid rgba(0, 229, 160, 0.3)',
                                        borderRadius: 16, padding: '20px 24px',
                                        fontSize: '0.85rem', color: '#eae1d8', lineHeight: 1.6,
                                        fontStyle: 'italic', boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                                        whiteSpace: 'pre-line'
                                    }}
                                >
                                    {interpretation}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>

            </main>
            <Footer />
        </div>
    )
}

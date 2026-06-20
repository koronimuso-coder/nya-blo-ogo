import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { useAuthStore } from '../stores/authStore'
import { useAudioFX } from '../hooks/useAudioFX'
import { Gamepad2, Trophy, Brain, Swords, Puzzle, Timer, Check, X, Award, Coins, Play, RotateCcw, Rocket, ShieldAlert } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Other static games for listing (Bandiagara and Scribes are now playable!)
const otherGames = [
    { icon: Brain, title: 'Échiquier Cosmique', desc: 'Échecs revisités avec des pièces Dogon. Classement ELO Sirius.', players: '12K+', difficulty: 'Intermédiaire', label: 'INDISPONIBLE' },
    { icon: Timer, title: 'Sprint Nommo', desc: "Course contre la montre. Résolvez des énigmes mathématiques ancestrales.", players: '6K+', difficulty: 'Avancé', label: 'INDISPONIBLE' },
    { icon: Gamepad2, title: "L'Aventure du Griot", desc: 'RPG narratif à travers les royaumes africains. 40h de jeu.', players: '15K+', difficulty: 'Intermédiaire', label: 'INDISPONIBLE' },
]

// Quiz questions
const questions = [
    {
        q: "Quel peuple est célèbre pour ses connaissances astronomiques précises sur l'étoile Sirius B avant les télescopes modernes ?",
        options: ["Les Massaïs", "Les Dogons", "Les Zoulous", "Les Yorubas"],
        correct: 1,
        desc: "Les Dogons du Mali décrivent Sirius B (Po Tolo) comme une étoile naine blanche extrêmement dense, invisible à l'œil nu."
    },
    {
        q: "Quelle ancienne cité du Mali abritait la célèbre Université de Sankoré, centre d'érudition mondial ?",
        options: ["Djenné", "Mopti", "Tombouctou", "Gao"],
        correct: 2,
        desc: "Tombouctou abritait l'université de Sankoré qui comptait plus de 25 000 étudiants au XVIe siècle, conservant des manuscrits inestimables."
    },
    {
        q: "Quel empire historique d'Afrique de l'Ouest a été fondé par Soundiata Keïta au XIIIe siècle ?",
        options: ["L'Empire du Ghana", "L'Empire du Mali", "L'Empire Songhaï", "Le Royaume du Dahomey"],
        correct: 1,
        desc: "L'Empire du Mali a été fondé par Soundiata Keïta et est resté célèbre pour sa charte de Kouroukan Fouga, l'une des premières déclarations des droits de l'homme."
    },
    {
        q: "Dans la mythologie Dogon, qui est le dieu créateur suprême de l'univers ?",
        options: ["Amma", "Nommo", "Ogo", "Sigi Tolo"],
        correct: 0,
        desc: "Amma est le dieu créateur suprême dans la cosmogonie Dogon, qui a structuré le monde à partir de sa pensée originelle en forme d'œuf."
    },
    {
        q: "Comment appelle-t-on le lieu traditionnel de palabre et d'arbitrage dans un village Dogon ?",
        options: ["Le Kanaga", "Le Toguna", "Le Hogon", "Le Sigi"],
        correct: 1,
        desc: "Le Toguna est une structure au toit bas de chaume, forçant les anciens à rester assis pour délibérer, empêchant ainsi la violence physique."
    }
]

export default function Games() {
    const navigate = useNavigate()
    const { playCoin, playEngine } = useAudioFX()
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended' | 'puzzle-playing' | 'puzzle-won' | 'memory-playing' | 'memory-won' | 'nommo-playing' | 'nommo-ended'>('idle')
    const [qIndex, setQIndex] = useState(0)
    const [score, setScore] = useState(0)
    const [coinsEarned, setCoinsEarned] = useState(0)
    const [selectedOpt, setSelectedOpt] = useState<number | null>(null)
    const [isAnswered, setIsAnswered] = useState(false)
    const [timeLeft, setTimeLeft] = useState(15)
    const [rewardNotification, setRewardNotification] = useState<string | null>(null)

    // Sliding Puzzle State
    const [puzzleBoard, setPuzzleBoard] = useState<Array<number>>([0, 1, 2, 3, 4, 5, 6, 7, 8])
    const [puzzleMoves, setPuzzleMoves] = useState(0)
    const [puzzleTime, setPuzzleTime] = useState(0)

    // Memory Game State
    const memorySymbols = ['✦', '♠', '♥', '♦', '♣', '✶', '◆', '★']
    const [memoryCards, setMemoryCards] = useState<Array<{id: number; symbol: string; flipped: boolean; matched: boolean}>>([])
    const [memoryFlipped, setMemoryFlipped] = useState<number[]>([])
    const [memoryMoves, setMemoryMoves] = useState(0)
    const [memoryTime, setMemoryTime] = useState(0)
    const [memoryLocked, setMemoryLocked] = useState(false)

    // Nommo Odyssey Arcade State
    const [nommoScore, setNommoScore] = useState(0)
    const [nommoShields, setNommoShields] = useState(3)
    const [nommoCoinsEarned, setNommoCoinsEarned] = useState(0)
    const [nommoTime, setNommoTime] = useState(0)

    const nommoCanvasRef = useRef<HTMLCanvasElement>(null)
    const shipYRef = useRef(200)
    const shipXRef = useRef(80)
    const mouseYRef = useRef(200)
    const keysPressedRef = useRef<Record<string, boolean>>({})

    const timerRef = useRef<any>(null)
    const memoryTimerRef = useRef<any>(null)
    const { addCoins, addScore, unlockAchievement } = useAuthStore()

    // Quiz Countdown logic
    useEffect(() => {
        if (gameState !== 'playing') return

        if (timeLeft > 0 && !isAnswered) {
            timerRef.current = setTimeout(() => {
                setTimeLeft(prev => prev - 1)
            }, 1000)
        } else if (timeLeft === 0 && !isAnswered) {
            handleAnswerSelect(-1) // Timeout
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [timeLeft, isAnswered, gameState])

    // Sliding Puzzle Timer
    useEffect(() => {
        if (gameState !== 'puzzle-playing') return
        const pInterval = setInterval(() => {
            setPuzzleTime(prev => prev + 1)
        }, 1000)
        return () => clearInterval(pInterval)
    }, [gameState])

    // Memory Game Timer
    useEffect(() => {
        if (gameState !== 'memory-playing') return
        memoryTimerRef.current = setInterval(() => {
            setMemoryTime(prev => prev + 1)
        }, 1000)
        return () => { if (memoryTimerRef.current) clearInterval(memoryTimerRef.current) }
    }, [gameState])

    const startQuiz = () => {
        setGameState('playing')
        setQIndex(0)
        setScore(0)
        setCoinsEarned(0)
        setSelectedOpt(null)
        setIsAnswered(false)
        setTimeLeft(15)
    }

    const handleAnswerSelect = (optIndex: number) => {
        if (isAnswered) return
        setSelectedOpt(optIndex)
        setIsAnswered(true)

        const isCorrect = optIndex === questions[qIndex].correct
        if (isCorrect) {
            setScore(prev => prev + 20)
            setCoinsEarned(prev => prev + 10)
        }

        // Show feedback and load next question
        setTimeout(() => {
            if (qIndex < questions.length - 1) {
                setQIndex(prev => prev + 1)
                setSelectedOpt(null)
                setIsAnswered(false)
                setTimeLeft(15)
            } else {
                setGameState('ended')
                const finalCoins = coinsEarned + (isCorrect ? 10 : 0)
                const finalScore = score + (isCorrect ? 20 : 0)
                addCoins(finalCoins)
                addScore(finalScore)

                setRewardNotification(`+${finalCoins} Nya Coins & +${finalScore} Nya Score ajoutés à votre compte !`)
                setTimeout(() => setRewardNotification(null), 5000)
            }
        }, 3000)
    }

    // Memory Game mechanics
    const startMemory = () => {
        const pairs = [...memorySymbols, ...memorySymbols]
        // Fisher-Yates shuffle
        for (let i = pairs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pairs[i], pairs[j]] = [pairs[j], pairs[i]]
        }
        setMemoryCards(pairs.map((symbol, id) => ({ id, symbol, flipped: false, matched: false })))
        setMemoryFlipped([])
        setMemoryMoves(0)
        setMemoryTime(0)
        setMemoryLocked(false)
        setGameState('memory-playing')
    }

    const handleMemoryClick = (cardId: number) => {
        if (memoryLocked) return
        const card = memoryCards[cardId]
        if (card.flipped || card.matched) return

        const newCards = memoryCards.map(c => c.id === cardId ? { ...c, flipped: true } : c)
        setMemoryCards(newCards)
        const newFlipped = [...memoryFlipped, cardId]
        setMemoryFlipped(newFlipped)

        if (newFlipped.length === 2) {
            setMemoryMoves(prev => prev + 1)
            setMemoryLocked(true)

            const [first, second] = newFlipped
            if (newCards[first].symbol === newCards[second].symbol) {
                // Match found
                const matched = newCards.map(c =>
                    c.id === first || c.id === second ? { ...c, matched: true } : c
                )
                setMemoryCards(matched)
                setMemoryFlipped([])
                setMemoryLocked(false)

                // Check win
                if (matched.every(c => c.matched)) {
                    setGameState('memory-won')
                    addCoins(100)
                    addScore(200)
                    unlockAchievement('memory-master')
                    setRewardNotification('+100 Nya Coins & +200 Nya Score ! Mémoire Ancestrale débloquée.')
                    setTimeout(() => setRewardNotification(null), 5000)
                }
            }
        }
    }

    // Nommo Odyssey mechanics
    const startNommo = () => {
        shipYRef.current = 200
        shipXRef.current = 80
        mouseYRef.current = 200
        keysPressedRef.current = {}
        setNommoScore(0)
        setNommoShields(3)
        setNommoCoinsEarned(0)
        setNommoTime(0)
        setGameState('nommo-playing')
    }

    useEffect(() => {
        if (gameState !== 'nommo-playing') return
        const canvas = nommoCanvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animFrame: number
        let frameCount = 0
        let gameTime = 0
        const startTime = Date.now()

        // Game objects
        const stars: Array<{ x: number; y: number; size: number; speed: number }> = []
        const coins: Array<{ x: number; y: number; size: number; speed: number }> = []
        const asteroids: Array<{ x: number; y: number; size: number; speed: number; rot: number; rotSpeed: number }> = []
        const particles: Array<{ x: number; y: number; vx: number; vy: number; color: string; alpha: number; size: number; life: number }> = []

        // Populate background stars
        for (let i = 0; i < 40; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: 0.5 + Math.random() * 1.5,
                speed: 1 + Math.random() * 2
            })
        }

        // Mouse listeners
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            mouseYRef.current = e.clientY - rect.top
        }
        canvas.addEventListener('mousemove', handleMouseMove)

        // Key listeners
        const handleKeyDown = (e: KeyboardEvent) => {
            keysPressedRef.current[e.key.toLowerCase()] = true
        }
        const handleKeyUp = (e: KeyboardEvent) => {
            keysPressedRef.current[e.key.toLowerCase()] = false
        }
        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        // Internal score & shield track (sync to react state periodically)
        let internalScore = 0
        let internalShields = 3
        let internalCoinsEarned = 0
        let lastEnginePlay = 0

        const gameLoop = () => {
            frameCount++

            // Survival Time count
            const elapsed = Math.floor((Date.now() - startTime) / 1000)
            if (elapsed > gameTime) {
                gameTime = elapsed
                setNommoTime(gameTime)
            }

            // --- UPDATE SHIELD & COLLISION LOGIC ---
            // Move Ship with keys
            let dy = 0
            let dx = 0
            if (keysPressedRef.current['arrowup'] || keysPressedRef.current['z'] || keysPressedRef.current['w']) dy -= 5
            if (keysPressedRef.current['arrowdown'] || keysPressedRef.current['s']) dy += 5
            if (keysPressedRef.current['arrowleft'] || keysPressedRef.current['q'] || keysPressedRef.current['a']) dx -= 5
            if (keysPressedRef.current['arrowright'] || keysPressedRef.current['d']) dx += 5

            if (dx !== 0 || dy !== 0) {
                shipXRef.current = Math.max(20, Math.min(canvas.width - 20, shipXRef.current + dx))
                shipYRef.current = Math.max(20, Math.min(canvas.height - 20, shipYRef.current + dy))
                // Sound effect for movement throttle
                if (Date.now() - lastEnginePlay > 250) {
                    playEngine()
                    lastEnginePlay = Date.now()
                }
            } else {
                // Hover follow mouse smoothly
                const targetY = mouseYRef.current
                shipYRef.current += (targetY - shipYRef.current) * 0.15
                shipYRef.current = Math.max(20, Math.min(canvas.height - 20, shipYRef.current))
            }

            // Spawn Stars
            if (frameCount % 4 === 0) {
                stars.push({
                    x: canvas.width,
                    y: Math.random() * canvas.height,
                    size: 0.5 + Math.random() * 1.5,
                    speed: 1 + Math.random() * 2
                })
            }

            // Spawn Coins (Sirius Shards)
            if (frameCount % 45 === 0) {
                coins.push({
                    x: canvas.width,
                    y: 30 + Math.random() * (canvas.height - 60),
                    size: 7,
                    speed: 3 + Math.random() * 2
                })
            }

            // Spawn Asteroids
            if (frameCount % (60 - Math.min(45, Math.floor(gameTime * 0.5))) === 0) {
                asteroids.push({
                    x: canvas.width,
                    y: 20 + Math.random() * (canvas.height - 40),
                    size: 12 + Math.random() * 16,
                    speed: 2.5 + Math.random() * 3.5 + Math.min(5, gameTime * 0.15),
                    rot: Math.random() * Math.PI * 2,
                    rotSpeed: (Math.random() - 0.5) * 0.05
                })
            }

            // Update Stars
            for (let i = stars.length - 1; i >= 0; i--) {
                stars[i].x -= stars[i].speed
                if (stars[i].x < 0) stars.splice(i, 1)
            }

            // Update Particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i]
                p.x += p.vx
                p.y += p.vy
                p.alpha -= 0.02
                p.life--
                if (p.life <= 0 || p.alpha <= 0) particles.splice(i, 1)
            }

            // Update Coins & Collisions
            for (let i = coins.length - 1; i >= 0; i--) {
                const c = coins[i]
                c.x -= c.speed

                // Hit ship detection (distance)
                const distShipX = c.x - shipXRef.current
                const distShipY = c.y - shipYRef.current
                const dist = Math.sqrt(distShipX * distShipX + distShipY * distShipY)

                if (dist < c.size + 15) {
                    // Collected!
                    playCoin()
                    internalScore += 1
                    internalCoinsEarned += 2
                    setNommoScore(internalScore)
                    setNommoCoinsEarned(internalCoinsEarned)
                    
                    // Golden stardust burst
                    for (let pIdx = 0; pIdx < 10; pIdx++) {
                        const angle = Math.random() * Math.PI * 2
                        const speed = 1 + Math.random() * 3
                        particles.push({
                            x: c.x,
                            y: c.y,
                            vx: Math.cos(angle) * speed,
                            vy: Math.sin(angle) * speed,
                            color: 'rgba(230,194,41,0.8)',
                            alpha: 1.0,
                            size: 1.5 + Math.random() * 2,
                            life: 25
                        })
                    }
                    coins.splice(i, 1)
                } else if (c.x < -10) {
                    coins.splice(i, 1)
                }
            }

            // Update Asteroids & Collisions
            for (let i = asteroids.length - 1; i >= 0; i--) {
                const a = asteroids[i]
                a.x -= a.speed
                a.rot += a.rotSpeed

                // Hit ship detection (distance)
                const distShipX = a.x - shipXRef.current
                const distShipY = a.y - shipYRef.current
                const dist = Math.sqrt(distShipX * distShipX + distShipY * distShipY)

                if (dist < a.size + 12) {
                    // Crash!
                    internalShields -= 1
                    setNommoShields(internalShields)
                    
                    // Orange explosion burst
                    for (let pIdx = 0; pIdx < 15; pIdx++) {
                        const angle = Math.random() * Math.PI * 2
                        const speed = 1.5 + Math.random() * 4
                        particles.push({
                            x: a.x,
                            y: a.y,
                            vx: Math.cos(angle) * speed,
                            vy: Math.sin(angle) * speed,
                            color: 'rgba(239,68,68,0.8)',
                            alpha: 1.0,
                            size: 2 + Math.random() * 3,
                            life: 30
                        })
                    }
                    asteroids.splice(i, 1)

                    if (internalShields <= 0) {
                        // Game Over!
                        setGameState('nommo-ended')
                        addCoins(internalCoinsEarned)
                        addScore(internalScore * 15)

                        if (internalScore >= 15) {
                            unlockAchievement('sirius-pilot')
                            setRewardNotification(`Mission Complétée ! +${internalCoinsEarned} Nya Coins et Badge "Pilote de Sirius" débloqué !`)
                        } else {
                            setRewardNotification(`Crash ! Vous avez récolté +${internalCoinsEarned} Nya Coins.`)
                        }
                        setTimeout(() => setRewardNotification(null), 5000)
                        return // Exit game loop
                    }
                } else if (a.x < -30) {
                    asteroids.splice(i, 1)
                }
            }

            // --- DRAWING STAGE ---
            ctx.fillStyle = '#050b0d'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Grid lines overlay
            ctx.strokeStyle = 'rgba(0, 229, 160, 0.03)'
            ctx.lineWidth = 1
            for (let gridX = 0; gridX < canvas.width; gridX += 40) {
                ctx.beginPath()
                ctx.moveTo(gridX, 0)
                ctx.lineTo(gridX, canvas.height)
                ctx.stroke()
            }
            for (let gridY = 0; gridY < canvas.height; gridY += 40) {
                ctx.beginPath()
                ctx.moveTo(0, gridY)
                ctx.lineTo(canvas.width, gridY)
                ctx.stroke()
            }

            // Render Stars
            stars.forEach((s) => {
                ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + Math.random() * 0.4})`
                ctx.beginPath()
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
                ctx.fill()
            })

            // Render Particles
            particles.forEach((p) => {
                ctx.fillStyle = p.color
                ctx.globalAlpha = Math.max(0, p.alpha)
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fill()
            })
            ctx.globalAlpha = 1.0

            // Render Coins (Sirius Shards)
            coins.forEach((c) => {
                ctx.fillStyle = '#E6C229'
                ctx.shadowColor = '#E6C229'
                ctx.shadowBlur = 8
                ctx.beginPath()
                ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2)
                ctx.fill()

                // Star drawing inside coin
                ctx.fillStyle = '#FFF'
                ctx.beginPath()
                ctx.arc(c.x, c.y, 2, 0, Math.PI * 2)
                ctx.fill()
                ctx.shadowBlur = 0
            })

            // Render Asteroids
            asteroids.forEach((a) => {
                ctx.save()
                ctx.translate(a.x, a.y)
                ctx.rotate(a.rot)
                ctx.fillStyle = 'rgba(239, 68, 68, 0.25)'
                ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)'
                ctx.lineWidth = 2
                ctx.shadowColor = 'rgba(239, 68, 68, 0.4)'
                ctx.shadowBlur = 6
                
                // Draw irregular rock shape
                ctx.beginPath()
                ctx.moveTo(a.size, 0)
                for (let angleIdx = 0; angleIdx < 8; angleIdx++) {
                    const angle = (angleIdx * Math.PI) / 4
                    const r = a.size * (0.85 + Math.random() * 0.25)
                    ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r)
                }
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
                ctx.restore()
            })

            // Render Ship (Pirogue Stellaire Dogon)
            ctx.save()
            ctx.translate(shipXRef.current, shipYRef.current)
            
            // Draw thruster fire if moving
            const isThrusterOn = dx !== 0 || dy !== 0 || frameCount % 6 < 4
            if (isThrusterOn) {
                const fireGrad = ctx.createLinearGradient(-15, 0, -35, 0)
                fireGrad.addColorStop(0, '#B85C2E')
                fireGrad.addColorStop(1, 'rgba(230,194,41,0.01)')
                ctx.fillStyle = fireGrad
                ctx.beginPath()
                ctx.moveTo(-12, -4)
                ctx.lineTo(-30 - Math.random() * 10, 0)
                ctx.lineTo(-12, 4)
                ctx.closePath()
                ctx.fill()
            }

            // Ship main body (golden-ochre triangle with futuristic glowing winglets)
            ctx.fillStyle = '#B85C2E'
            ctx.strokeStyle = 'rgba(0, 229, 160, 0.9)'
            ctx.lineWidth = 1.5
            ctx.shadowColor = 'rgba(0, 229, 160, 0.5)'
            ctx.shadowBlur = 8

            ctx.beginPath()
            ctx.moveTo(18, 0) // nose
            ctx.lineTo(-12, -10) // left wing
            ctx.lineTo(-6, -4) // inner body
            ctx.lineTo(-6, 4)
            ctx.lineTo(-12, 10) // right wing
            ctx.closePath()
            ctx.fill()
            ctx.stroke()

            // Pilot cabin glass
            ctx.fillStyle = 'rgba(0, 229, 160, 0.4)'
            ctx.beginPath()
            ctx.moveTo(6, 0)
            ctx.lineTo(-2, -4)
            ctx.lineTo(-2, 4)
            ctx.closePath()
            ctx.fill()

            ctx.restore()

            animFrame = requestAnimationFrame(gameLoop)
        }

        gameLoop()

        return () => {
            cancelAnimationFrame(animFrame)
            canvas.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [gameState])

    // Sliding Puzzle mechanics
    const startPuzzle = () => {
        let boardState = [0, 1, 2, 3, 4, 5, 6, 7, 8]
        let emptyIndex = 8

        const getAdjacent = (idx: number) => {
            const row = Math.floor(idx / 3)
            const col = idx % 3
            const adjacent = []
            if (row > 0) adjacent.push(idx - 3)
            if (row < 2) adjacent.push(idx + 3)
            if (col > 0) adjacent.push(idx - 1)
            if (col < 2) adjacent.push(idx + 1)
            return adjacent
        }

        // Shuffle by executing 100 valid random sliding moves (ensures solvability)
        for (let shuffle = 0; shuffle < 100; shuffle++) {
            const adj = getAdjacent(emptyIndex)
            const randomMove = adj[Math.floor(Math.random() * adj.length)]
            boardState[emptyIndex] = boardState[randomMove]
            boardState[randomMove] = 8
            emptyIndex = randomMove
        }

        setPuzzleBoard(boardState)
        setPuzzleMoves(0)
        setPuzzleTime(0)
        setGameState('puzzle-playing')
    }

    const handleTileClick = (tileIndex: number) => {
        if (gameState !== 'puzzle-playing') return
        const emptyIndex = puzzleBoard.indexOf(8)
        const row = Math.floor(tileIndex / 3)
        const col = tileIndex % 3
        const empRow = Math.floor(emptyIndex / 3)
        const empCol = emptyIndex % 3

        const isAdjacent = Math.abs(row - empRow) + Math.abs(col - empCol) === 1
        if (isAdjacent) {
            const nextBoard = [...puzzleBoard]
            nextBoard[emptyIndex] = puzzleBoard[tileIndex]
            nextBoard[tileIndex] = 8
            setPuzzleBoard(nextBoard)
            setPuzzleMoves(prev => prev + 1)

            // Check solved state
            const isSolved = nextBoard.every((val, idx) => val === idx)
            if (isSolved) {
                setGameState('puzzle-won')
                addCoins(150)
                addScore(300)
                setRewardNotification("+150 Nya Coins & +300 Nya Score ! Sceau de Bandiagara résolu avec succès.")
                setTimeout(() => setRewardNotification(null), 5000)
            }
        }
    }

    return (
        <div style={{ position: 'relative', overflowX: 'hidden' }}>
            <Navbar />

            {/* Notification Reward */}
            <AnimatePresence>
                {rewardNotification && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 100, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        style={{
                            position: 'fixed',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 10000,
                            padding: '16px 28px',
                            background: 'linear-gradient(135deg, var(--nya-gold), var(--nya-ochre))',
                            border: '1px solid #FFF',
                            borderRadius: 'var(--radius-pill, 99px)',
                            color: '#FFF',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            pointerEvents: 'none'
                        }}
                    >
                        <Trophy size={20} className="text-white" />
                        {rewardNotification}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero */}
            <section className="section-full" style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(167,139,250,0.08) 0%, transparent 60%)', zIndex: 1 }}></div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 2 }}>
                    <div className="cosmo-label" style={{ justifyContent: 'center', marginBottom: 24 }}>JEUX D'ESPRIT</div>
                    <h1 className="text-shimmer" style={{ marginBottom: 24 }}>DÉFIS<br />ANCESTRAUX</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: 600, margin: '0 auto' }}>
                        Défis stratégiques et puzzles ancestraux modernisés. Affûtez votre esprit et gagnez des récompenses.
                    </p>
                </motion.div>
            </section>

            {/* Game Workspace Section */}
            <section className="section-full section-dark" style={{ paddingTop: 0 }}>
                <div className="max-w-container">
                    <AnimatePresence mode="wait">
                        
                        {/* ─── IDLE STATE: List of games ─── */}
                        {gameState === 'idle' && (
                            <motion.div key="game-idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                
                                {/* Featured Game 1: Duel des Scribes */}
                                <div style={{
                                    background: 'linear-gradient(135deg, rgba(184,92,46,0.15) 0%, rgba(212,160,23,0.05) 100%)',
                                    border: '1px solid var(--border-ochre)',
                                    borderRadius: 'var(--radius-xl, 20px)',
                                    padding: '48px 40px',
                                    marginBottom: 32,
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                                    gap: 32,
                                    alignItems: 'center',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ position: 'absolute', right: -50, top: -50, width: 250, height: 250, background: 'radial-gradient(var(--nya-ochre) 0%, transparent 70%)', opacity: 0.15, pointerEvents: 'none' }} />
                                    <div>
                                        <div className="cosmo-label" style={{ marginBottom: 16 }}>DUEL DES SCRIBES</div>
                                        <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)', marginBottom: 16, lineHeight: 1.2 }}>
                                            LE QUIZ DE LA <span className="text-ochre">SAGESSE ANCESTRALE</span>
                                        </h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 24, maxWidth: 500 }}>
                                            Mesurez vos connaissances sur l'histoire, la géographie, les sciences et la cosmogonie de l'Afrique. 5 questions, 15 secondes par question. Gagnez 10 Nya Coins par bonne réponse !
                                        </p>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={startQuiz}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 10,
                                                padding: '16px 32px', borderRadius: 'var(--radius-pill, 30px)',
                                                background: 'linear-gradient(135deg, var(--nya-ochre), var(--nya-ochre-dark, #8B4522))',
                                                border: 'none', color: '#FFF', cursor: 'pointer',
                                                fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.05em',
                                                fontFamily: 'var(--font-body)', boxShadow: '0 8px 30px rgba(184,92,46,0.3)'
                                            }}
                                        >
                                            <Play size={14} fill="#FFF" /> COMMENCER LE DUEL
                                        </motion.button>
                                    </div>

                                    {/* Geometric illustration decoration */}
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <div style={{ position: 'relative', width: 180, height: 180 }}>
                                            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', color: 'var(--nya-ochre)' }}>
                                                <polygon points="50,5 95,35 95,75 50,95 5,75 5,35" stroke="currentColor" strokeWidth="1" fill="none" />
                                                <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                                <path d="M50,20 L50,80 M20,50 L80,50" stroke="currentColor" strokeWidth="1" />
                                            </svg>
                                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Swords size={36} style={{ color: '#FFF' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Featured Game 2: Puzzle de Bandiagara */}
                                <div style={{
                                    background: 'linear-gradient(135deg, rgba(167,139,250,0.15) 0%, rgba(0,229,160,0.05) 100%)',
                                    border: '1px solid #a78bfa',
                                    borderRadius: 'var(--radius-xl, 20px)',
                                    padding: '48px 40px',
                                    marginBottom: 48,
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                                    gap: 32,
                                    alignItems: 'center',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ position: 'absolute', right: -50, top: -50, width: 250, height: 250, background: 'radial-gradient(#a78bfa 0%, transparent 70%)', opacity: 0.15, pointerEvents: 'none' }} />
                                    <div>
                                        <div className="cosmo-label" style={{ marginBottom: 16, borderColor: '#a78bfa', color: '#a78bfa' }}>PUZZLE DU GRIOT</div>
                                        <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)', marginBottom: 16, lineHeight: 1.2 }}>
                                            LE PUZZLE DE <span style={{ color: '#a78bfa' }}>BANDIAGARA</span>
                                        </h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 24, maxWidth: 500 }}>
                                            Faites glisser les tuiles pour reconstituer le sceau céleste de la cosmogonie Dogon et le masque Kanaga. Résolvez l'énigme sacrée pour emporter une récompense majeure de 150 Nya Coins !
                                        </p>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={startPuzzle}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 10,
                                                padding: '16px 32px', borderRadius: 'var(--radius-pill, 30px)',
                                                background: 'linear-gradient(135deg, #a78bfa, #8b5cf6)',
                                                border: 'none', color: '#FFF', cursor: 'pointer',
                                                fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.05em',
                                                fontFamily: 'var(--font-body)', boxShadow: '0 8px 30px rgba(167,139,250,0.3)'
                                            }}
                                        >
                                            <Puzzle size={14} /> RECONSTITUER LE SCEAU
                                        </motion.button>
                                    </div>

                                    {/* SVG Icon Illustration */}
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <div style={{ position: 'relative', width: 150, height: 150 }}>
                                            <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ color: '#a78bfa' }}>
                                                <rect x="5" y="5" width="26" height="26" stroke="currentColor" fill="none" strokeWidth="1.5" />
                                                <rect x="37" y="5" width="26" height="26" stroke="currentColor" fill="none" strokeWidth="1.5" />
                                                <rect x="69" y="5" width="26" height="26" stroke="currentColor" fill="none" strokeWidth="1.5" />
                                                <rect x="5" y="37" width="26" height="26" stroke="currentColor" fill="none" strokeWidth="1.5" />
                                                <rect x="37" y="37" width="26" height="26" stroke="currentColor" fill="none" strokeWidth="1.5" />
                                                <rect x="69" y="37" width="26" height="26" stroke="currentColor" fill="none" strokeWidth="1.5" />
                                                <rect x="5" y="69" width="26" height="26" stroke="currentColor" fill="none" strokeWidth="1.5" />
                                                <rect x="37" y="69" width="26" height="26" stroke="currentColor" fill="none" strokeWidth="1.5" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Featured Game 3: Memory Dogon */}
                                <div style={{
                                    background: 'linear-gradient(135deg, rgba(0,206,209,0.15) 0%, rgba(99,102,241,0.05) 100%)',
                                    border: '1px solid #00CED1',
                                    borderRadius: 'var(--radius-xl, 20px)',
                                    padding: '48px 40px',
                                    marginBottom: 48,
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                                    gap: 32,
                                    alignItems: 'center',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ position: 'absolute', right: -50, top: -50, width: 250, height: 250, background: 'radial-gradient(#00CED1 0%, transparent 70%)', opacity: 0.15, pointerEvents: 'none' }} />
                                    <div>
                                        <div className="cosmo-label" style={{ marginBottom: 16, borderColor: '#00CED1', color: '#00CED1' }}>MÉMOIRE SACRÉE</div>
                                        <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)', marginBottom: 16, lineHeight: 1.2 }}>
                                            MEMORY <span style={{ color: '#00CED1' }}>DOGON</span>
                                        </h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 24, maxWidth: 500 }}>
                                            Retrouvez les paires de symboles sacrés Dogon cachés dans les cartes. 8 paires à découvrir, le moins de coups possible ! Gagnez 100 Nya Coins et le badge "Mémoire Ancestrale".
                                        </p>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={startMemory}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 10,
                                                padding: '16px 32px', borderRadius: 'var(--radius-pill, 30px)',
                                                background: 'linear-gradient(135deg, #00CED1, #0891b2)',
                                                border: 'none', color: '#FFF', cursor: 'pointer',
                                                fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.05em',
                                                fontFamily: 'var(--font-body)', boxShadow: '0 8px 30px rgba(0,206,209,0.3)'
                                            }}
                                        >
                                            <Brain size={14} /> RÉVÉLER LES CARTES
                                        </motion.button>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, width: 140 }}>
                                            {[...Array(16)].map((_, i) => (
                                                <div key={i} style={{
                                                    width: 30, height: 30, borderRadius: 4,
                                                    background: i % 3 === 0 ? 'rgba(0,206,209,0.3)' : 'rgba(0,206,209,0.1)',
                                                    border: '1px solid rgba(0,206,209,0.3)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '0.7rem', color: '#00CED1',
                                                }}>
                                                    {i % 3 === 0 ? '?' : ''}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Featured Game 4: Nommo Odyssey */}
                                <div style={{
                                    background: 'linear-gradient(135deg, rgba(230,194,41,0.15) 0%, rgba(184,92,46,0.05) 100%)',
                                    border: '1px solid var(--nya-gold)',
                                    borderRadius: 'var(--radius-xl, 20px)',
                                    padding: '48px 40px',
                                    marginBottom: 48,
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                                    gap: 32,
                                    alignItems: 'center',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ position: 'absolute', right: -50, top: -50, width: 250, height: 250, background: 'radial-gradient(var(--nya-gold) 0%, transparent 70%)', opacity: 0.15, pointerEvents: 'none' }} />
                                    <div>
                                        <div className="cosmo-label" style={{ marginBottom: 16, borderColor: 'var(--nya-gold)', color: 'var(--nya-gold)' }}>ARCADE STELLAIRE</div>
                                        <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)', marginBottom: 16, lineHeight: 1.2 }}>
                                            NOMMO <span style={{ color: 'var(--nya-gold)' }}>ODYSSEY</span>
                                        </h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 24, maxWidth: 500 }}>
                                            Pilotez une pirogue stellaire à travers la spirale de Sirius. Évitez les astéroïdes et collectez des éclats d'énergie dorée. Débloquez le badge "Pilote de Sirius" en atteignant 15 points !
                                        </p>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={startNommo}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 10,
                                                padding: '16px 32px', borderRadius: 'var(--radius-pill, 30px)',
                                                background: 'linear-gradient(135deg, var(--nya-gold), var(--nya-ochre))',
                                                border: 'none', color: '#FFF', cursor: 'pointer',
                                                fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.05em',
                                                fontFamily: 'var(--font-body)', boxShadow: '0 8px 30px rgba(230,194,41,0.3)'
                                            }}
                                        >
                                            <Rocket size={14} /> LANCER L'ODYSSÉE
                                        </motion.button>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <div style={{ position: 'relative', width: 150, height: 150 }}>
                                            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', color: 'var(--nya-gold)' }}>
                                                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" fill="none" />
                                                <polygon points="50,20 65,60 50,50 35,60" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                                <circle cx="50" cy="80" r="4" fill="currentColor" />
                                                <circle cx="20" cy="40" r="3" fill="currentColor" />
                                                <circle cx="80" cy="50" r="5" fill="currentColor" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Featured Game 5: Awalé Cosmique */}
                                <div style={{
                                    background: 'linear-gradient(135deg, rgba(0,229,160,0.15) 0%, rgba(230,194,41,0.05) 100%)',
                                    border: '1px solid var(--nya-sirius)',
                                    borderRadius: 'var(--radius-xl, 20px)',
                                    padding: '48px 40px',
                                    marginBottom: 48,
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                                    gap: 32,
                                    alignItems: 'center',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ position: 'absolute', right: -50, top: -50, width: 250, height: 250, background: 'radial-gradient(var(--nya-sirius) 0%, transparent 70%)', opacity: 0.15, pointerEvents: 'none' }} />
                                    <div>
                                        <div className="cosmo-label" style={{ marginBottom: 16, borderColor: 'var(--nya-sirius)', color: 'var(--nya-sirius)' }}>STRATÉGIE ANCESTRALE</div>
                                        <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)', marginBottom: 16, lineHeight: 1.2 }}>
                                            AWALÉ <span style={{ color: 'var(--nya-sirius)' }}>COSMIQUE</span>
                                        </h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 24, maxWidth: 500 }}>
                                            Défiez l'Oracle de Sirius B dans le jeu de société traditionnel le plus ancien d'Afrique. Semez des graines d'énergie, récoltez vos gains cosmiques et gagnez 120 Nya Coins en cas de victoire !
                                        </p>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate('/games/awale')}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 10,
                                                padding: '16px 32px', borderRadius: 'var(--radius-pill, 30px)',
                                                background: 'linear-gradient(135deg, var(--nya-sirius), var(--nya-gold))',
                                                border: 'none', color: '#FFF', cursor: 'pointer',
                                                fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.05em',
                                                fontFamily: 'var(--font-body)', boxShadow: '0 8px 30px rgba(0,229,160,0.3)'
                                            }}
                                        >
                                            <Trophy size={14} /> LANCER L'AWALÉ
                                        </motion.button>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, width: 220 }}>
                                            {[...Array(12)].map((_, i) => (
                                                <div key={i} style={{
                                                    width: 30, height: 30, borderRadius: '50%',
                                                    background: 'rgba(255,255,255,0.02)',
                                                    border: '1.5px dashed var(--nya-sirius)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--nya-sirius)' }} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Games catalog list */}
                                <div className="cosmo-label" style={{ marginBottom: 24 }}>AUTRES MODULES DE JEUX</div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
                                    {otherGames.map((g, i) => (
                                        <div key={i} className="service-card" style={{ opacity: 0.6 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                                <g.icon size={28} style={{ color: 'var(--text-faint)' }} />
                                                <span className="accent-label" style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--text-faint)' }}>{g.label}</span>
                                            </div>
                                            <div className="card-title" style={{ fontSize: '1.1rem' }}>{g.title}</div>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.6, marginTop: 8, marginBottom: 12 }}>{g.desc}</p>
                                            <div style={{ display: 'flex', gap: 16 }}>
                                                <span className="accent-label">{g.players} joueurs</span>
                                                <span className="accent-label">{g.difficulty}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* ─── PLAYING STATE: Scribes Quiz ─── */}
                        {gameState === 'playing' && (
                            <motion.div
                                key="game-playing"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    maxWidth: 750,
                                    margin: '0 auto',
                                    background: 'var(--bg-surface)',
                                    border: '1px solid var(--border-default)',
                                    borderRadius: 'var(--radius-xl, 20px)',
                                    padding: 40,
                                    boxShadow: '0 30px 60px rgba(0,0,0,0.5)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--nya-ochre)', textTransform: 'uppercase' }}>
                                        QUESTION {qIndex + 1} / {questions.length}
                                    </span>
                                    <div style={{ display: 'flex', gap: 20 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Award size={14} style={{ color: 'var(--nya-ochre)' }} />
                                            <span style={{ fontSize: '0.75rem', fontWeight: 800, fontFamily: 'monospace' }}>SCORE: {score}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Coins size={14} style={{ color: 'var(--nya-gold)' }} />
                                            <span style={{ fontSize: '0.75rem', fontWeight: 800, fontFamily: 'monospace' }}>+{coinsEarned}</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden', marginBottom: 40 }}>
                                    <motion.div
                                        initial={{ width: '100%' }}
                                        animate={{ width: isAnswered ? `${(timeLeft/15)*100}%` : `${(timeLeft/15)*100}%` }}
                                        transition={{ duration: isAnswered ? 0 : 1, ease: 'linear' }}
                                        style={{
                                            height: '100%',
                                            background: timeLeft > 5 ? 'var(--nya-ochre)' : '#ef4444',
                                            borderRadius: 2
                                        }}
                                    />
                                </div>

                                <h3 style={{ fontSize: '1.25rem', lineHeight: 1.5, marginBottom: 32, fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                                    {questions[qIndex].q}
                                </h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    {questions[qIndex].options.map((opt, idx) => {
                                        let border = '1px solid var(--border-default)'
                                        let bg = 'rgba(255,255,255,0.01)'
                                        let icon = null

                                        if (isAnswered) {
                                            if (idx === questions[qIndex].correct) {
                                                border = '1px solid #00E5A0'
                                                bg = 'rgba(0, 229, 160, 0.05)'
                                                icon = <Check size={16} style={{ color: '#00E5A0' }} />
                                            } else if (selectedOpt === idx) {
                                                border = '1px solid #ef4444'
                                                bg = 'rgba(239, 68, 68, 0.05)'
                                                icon = <X size={16} style={{ color: '#ef4444' }} />
                                            } else {
                                                border = '1px solid rgba(255,255,255,0.02)'
                                            }
                                        }

                                        return (
                                            <motion.button
                                                key={idx}
                                                whileHover={!isAnswered ? { scale: 1.02, borderColor: 'var(--nya-ochre)' } : {}}
                                                whileTap={!isAnswered ? { scale: 0.98 } : {}}
                                                onClick={() => handleAnswerSelect(idx)}
                                                disabled={isAnswered}
                                                style={{
                                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                    padding: 18, borderRadius: 'var(--radius-lg, 12px)',
                                                    border, background: bg, color: '#FFF',
                                                    textAlign: 'left', cursor: isAnswered ? 'default' : 'pointer',
                                                    fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                                                    transition: 'border-color 0.3s, background 0.3s'
                                                }}
                                            >
                                                <span>{opt}</span>
                                                {icon}
                                            </motion.button>
                                        )
                                    })}
                                </div>

                                <AnimatePresence>
                                    {isAnswered && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            style={{
                                                marginTop: 32,
                                                padding: 20,
                                                background: 'rgba(255,255,255,0.02)',
                                                border: '1px solid var(--border-subtle)',
                                                borderRadius: 'var(--radius-md, 8px)'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--nya-ochre)', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', marginBottom: 6 }}>
                                                <Brain size={14} /> EXPLICATION SACRÉE
                                            </div>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                                                {questions[qIndex].desc}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}

                        {/* ─── PLAYING STATE: sliding puzzle game ─── */}
                        {gameState === 'puzzle-playing' && (
                            <motion.div
                                key="game-puzzle"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    maxWidth: 500,
                                    margin: '0 auto',
                                    background: 'var(--bg-surface)',
                                    border: '1px solid var(--border-default)',
                                    borderRadius: 'var(--radius-xl, 20px)',
                                    padding: 40,
                                    boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                                    textAlign: 'center'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#a78bfa', textTransform: 'uppercase' }}>
                                        SCEAU DE BANDIAGARA
                                    </span>
                                    <div style={{ display: 'flex', gap: 16, fontSize: '0.7rem', fontWeight: 800, fontFamily: 'monospace' }}>
                                        <span>MOUVEMENTS: {puzzleMoves}</span>
                                        <span>TEMPS: {Math.floor(puzzleTime / 60)}m {puzzleTime % 60}s</span>
                                    </div>
                                </div>

                                {/* Sliding 3x3 Grid with SVG parts rendering */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 100px)',
                                    gridTemplateRows: 'repeat(3, 100px)',
                                    gap: 6,
                                    justifyContent: 'center',
                                    background: '#040812',
                                    padding: 12,
                                    borderRadius: 16,
                                    border: '1px solid rgba(167,139,250,0.2)',
                                    margin: '0 auto 32px'
                                }}>
                                    {puzzleBoard.map((val, idx) => {
                                        // Empty slot
                                        if (val === 8) {
                                            return <div key={idx} style={{ background: 'transparent' }} />
                                        }

                                        // Clipped SVG calculations
                                        const originalRow = Math.floor(val / 3)
                                        const originalCol = val % 3

                                        return (
                                            <motion.button
                                                key={idx}
                                                onClick={() => handleTileClick(idx)}
                                                style={{
                                                    width: 100, height: 100,
                                                    border: 'none', padding: 0,
                                                    borderRadius: 8, cursor: 'pointer',
                                                    position: 'relative', overflow: 'hidden',
                                                    background: 'none'
                                                }}
                                            >
                                                {/* Shift the full SVG to show only the correct portion */}
                                                <div style={{
                                                    position: 'absolute',
                                                    left: -originalCol * 100,
                                                    top: -originalRow * 100,
                                                    width: 300,
                                                    height: 300
                                                }}>
                                                    <svg width="300" height="300" viewBox="0 0 100 100" style={{ display: 'block', color: 'var(--nya-gold)', background: '#0b1120' }}>
                                                        {/* Orbit rings */}
                                                        <circle cx="50" cy="50" r="45" stroke="rgba(212,160,23,0.15)" strokeWidth="0.8" fill="none" />
                                                        <circle cx="50" cy="50" r="30" stroke="rgba(212,160,23,0.2)" strokeWidth="0.8" fill="none" />
                                                        <path d="M50,5 L95,35 L95,75 L50,95 L5,75 L5,35 Z" stroke="rgba(167,139,250,0.3)" strokeWidth="1" fill="none" />

                                                        {/* Constellations */}
                                                        <circle cx="50" cy="5" r="2.5" fill="var(--nya-gold)" />
                                                        <circle cx="95" cy="35" r="2.5" fill="var(--nya-gold)" />
                                                        <circle cx="95" cy="75" r="2.5" fill="var(--nya-gold)" />
                                                        <circle cx="50" cy="95" r="2.5" fill="var(--nya-gold)" />
                                                        <circle cx="5" cy="75" r="2.5" fill="var(--nya-gold)" />
                                                        <circle cx="5" cy="35" r="2.5" fill="var(--nya-gold)" />

                                                        {/* Kanaga geometry */}
                                                        <path d="M50,22 L50,78 M32,32 L68,32 M26,56 L74,56 M26,32 L26,44 M74,32 L74,44 M32,56 L32,68 M68,56 L68,68" stroke="var(--nya-gold)" strokeWidth="2.5" fill="none" />
                                                        <circle cx="50" cy="50" r="14" stroke="var(--nya-ochre)" strokeWidth="1.5" fill="none" />
                                                    </svg>
                                                </div>

                                                {/* Micro tile numbers */}
                                                <div style={{
                                                    position: 'absolute', right: 6, bottom: 4,
                                                    fontSize: '0.6rem', fontWeight: 900, fontFamily: 'monospace',
                                                    color: 'rgba(255,255,255,0.4)', background: 'rgba(0,0,0,0.4)',
                                                    padding: '2px 5px', borderRadius: 4
                                                }}>
                                                    {val + 1}
                                                </div>
                                            </motion.button>
                                        )
                                    })}
                                </div>

                                {/* Quick buttons */}
                                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                                    <button
                                        onClick={startPuzzle}
                                        style={{
                                            padding: '10px 20px', borderRadius: 20,
                                            border: 'none', background: '#a78bfa', color: '#FFF',
                                            fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer'
                                        }}
                                    >
                                        MÉLANGER À NOUVEAU
                                    </button>
                                    <button
                                        onClick={() => setGameState('idle')}
                                        style={{
                                            padding: '10px 20px', borderRadius: 20,
                                            border: '1px solid var(--border-subtle)', background: 'none', color: '#FFF',
                                            fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer'
                                        }}
                                    >
                                        ABANDONNER
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* ─── END STATE: Quiz Results ─── */}
                        {gameState === 'ended' && (
                            <motion.div
                                key="game-ended"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    maxWidth: 600,
                                    margin: '0 auto',
                                    background: 'var(--bg-surface)',
                                    border: '1px solid var(--border-default)',
                                    borderRadius: 'var(--radius-xl, 20px)',
                                    padding: 48,
                                    boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                                    textAlign: 'center'
                                }}
                            >
                                <motion.div
                                    animate={{ scale: [0.8, 1.1, 1] }}
                                    transition={{ duration: 0.5 }}
                                    style={{
                                        width: 80, height: 80, borderRadius: '50%',
                                        background: 'rgba(212,160,23,0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--nya-gold)', margin: '0 auto', marginBottom: 24
                                    }}
                                >
                                    <Trophy size={40} />
                                </motion.div>

                                <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-display)', marginBottom: 12 }}>
                                    COMBAT TERMINÉ
                                </h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 32 }}>
                                    Vous avez honoré les ancêtres par vos réponses. Le grand Hogon salue votre esprit.
                                </p>

                                <div style={{
                                    display: 'grid', gridTemplateColumns: '1fr 1fr',
                                    gap: 20, padding: 24, borderRadius: 'var(--radius-lg, 12px)',
                                    background: 'var(--bg-primary)',
                                    border: '1px solid var(--border-subtle)',
                                    marginBottom: 40
                                }}>
                                    <div>
                                        <div className="accent-label" style={{ marginBottom: 4 }}>SCORE ATTEINT</div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                            <Award size={20} style={{ color: 'var(--nya-ochre)' }} />
                                            <span style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-display)' }}>{score}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="accent-label" style={{ marginBottom: 4 }}>COINS GAGNÉS</div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                            <Coins size={20} style={{ color: 'var(--nya-gold)' }} />
                                            <span style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--nya-gold)' }}>+{coinsEarned}</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={startQuiz}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 8,
                                            padding: '14px 28px', borderRadius: 'var(--radius-pill, 20px)',
                                            background: 'var(--nya-ochre)', border: 'none',
                                            color: '#FFF', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800,
                                            fontFamily: 'var(--font-body)', transition: 'all 0.3s'
                                        }}
                                    >
                                        <RotateCcw size={12} /> REJOUER
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setGameState('idle')}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 8,
                                            padding: '14px 28px', borderRadius: 'var(--radius-pill, 20px)',
                                            background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)',
                                            color: '#FFF', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800,
                                            fontFamily: 'var(--font-body)', transition: 'all 0.3s'
                                        }}
                                    >
                                        RETOURNER AUX JEUX
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {/* ─── END STATE: Puzzle Victory Results ─── */}
                        {gameState === 'puzzle-won' && (
                            <motion.div
                                key="puzzle-won-screen"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    maxWidth: 600,
                                    margin: '0 auto',
                                    background: 'var(--bg-surface)',
                                    border: '1px solid var(--border-default)',
                                    borderRadius: 'var(--radius-xl, 20px)',
                                    padding: 48,
                                    boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                                    textAlign: 'center'
                                }}
                            >
                                <motion.div
                                    animate={{ scale: [0.8, 1.2, 1], rotate: [0, 360] }}
                                    transition={{ duration: 0.8 }}
                                    style={{
                                        width: 80, height: 80, borderRadius: '50%',
                                        background: 'rgba(0, 229, 160, 0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#00E5A0', margin: '0 auto', marginBottom: 24
                                    }}
                                >
                                    <Trophy size={40} />
                                </motion.div>

                                <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-display)', marginBottom: 12, color: '#00E5A0' }}>
                                    SCEAU DE BANDIAGARA RÉSOLU !
                                </h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 32 }}>
                                    Incroyable ! Vous avez aligné le sceau géométrique Dogon en {puzzleMoves} mouvements. Les Nommos sont honorés.
                                </p>

                                <div style={{
                                    display: 'grid', gridTemplateColumns: '1fr 1fr',
                                    gap: 20, padding: 24, borderRadius: 'var(--radius-lg, 12px)',
                                    background: 'var(--bg-primary)',
                                    border: '1px solid var(--border-subtle)',
                                    marginBottom: 40
                                }}>
                                    <div>
                                        <div className="accent-label" style={{ marginBottom: 4 }}>TEMPS TOTAL</div>
                                        <span style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'var(--font-display)' }}>
                                            {Math.floor(puzzleTime / 60)}m {puzzleTime % 60}s
                                        </span>
                                    </div>
                                    <div>
                                        <div className="accent-label" style={{ marginBottom: 4 }}>RÉCOMPENSE SCEAU</div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                            <Coins size={20} style={{ color: 'var(--nya-gold)' }} />
                                            <span style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--nya-gold)' }}>+150</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={startPuzzle}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 8,
                                            padding: '14px 28px', borderRadius: 'var(--radius-pill, 20px)',
                                            background: '#a78bfa', border: 'none',
                                            color: '#FFF', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800,
                                            fontFamily: 'var(--font-body)', transition: 'all 0.3s'
                                        }}
                                    >
                                        <RotateCcw size={12} /> REJOUER
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setGameState('idle')}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 8,
                                            padding: '14px 28px', borderRadius: 'var(--radius-pill, 20px)',
                                            background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)',
                                            color: '#FFF', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800,
                                            fontFamily: 'var(--font-body)', transition: 'all 0.3s'
                                        }}
                                    >
                                        RETOURNER AUX JEUX
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {/* ─── MEMORY PLAYING STATE ─── */}
                        {gameState === 'memory-playing' && (
                            <motion.div
                                key="memory-playing"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    maxWidth: 550,
                                    margin: '0 auto',
                                    background: 'var(--bg-surface)',
                                    border: '1px solid var(--border-default)',
                                    borderRadius: 'var(--radius-xl, 20px)',
                                    padding: 40,
                                    boxShadow: '0 30px 60px rgba(0,0,0,0.5)'
                                }}
                            >
                                {/* Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', color: '#00CED1', textTransform: 'uppercase' }}>
                                        MEMORY DOGON
                                    </span>
                                    <div style={{ display: 'flex', gap: 20 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Timer size={14} style={{ color: '#00CED1' }} />
                                            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                                                {Math.floor(memoryTime / 60)}:{String(memoryTime % 60).padStart(2, '0')}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Brain size={14} style={{ color: '#00CED1' }} />
                                            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                                                {memoryMoves}
                                            </span>
                                            <span className="accent-label">COUPS</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Matched counter */}
                                <div style={{
                                    marginBottom: 24, height: 4, borderRadius: 2,
                                    background: 'var(--bg-elevated)', overflow: 'hidden',
                                }}>
                                    <motion.div
                                        animate={{ width: `${(memoryCards.filter(c => c.matched).length / memoryCards.length) * 100}%` }}
                                        style={{ height: '100%', background: 'linear-gradient(90deg, #00CED1, #0891b2)', borderRadius: 2 }}
                                    />
                                </div>

                                {/* Card Grid */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(4, 1fr)',
                                    gap: 10,
                                    marginBottom: 24,
                                }}>
                                    {memoryCards.map((card) => (
                                        <motion.div
                                            key={card.id}
                                            whileHover={!card.flipped && !card.matched ? { scale: 1.05 } : {}}
                                            whileTap={!card.flipped && !card.matched ? { scale: 0.95 } : {}}
                                            onClick={() => handleMemoryClick(card.id)}
                                            style={{
                                                aspectRatio: '1',
                                                borderRadius: 12,
                                                cursor: card.flipped || card.matched ? 'default' : 'pointer',
                                                perspective: '600px',
                                                position: 'relative',
                                            }}
                                        >
                                            <motion.div
                                                animate={{ rotateY: card.flipped || card.matched ? 180 : 0 }}
                                                transition={{ duration: 0.4 }}
                                                style={{
                                                    width: '100%', height: '100%',
                                                    position: 'relative',
                                                    transformStyle: 'preserve-3d',
                                                }}
                                            >
                                                {/* Front (hidden) */}
                                                <div style={{
                                                    position: 'absolute', inset: 0,
                                                    backfaceVisibility: 'hidden',
                                                    background: 'linear-gradient(135deg, rgba(0,206,209,0.15), rgba(0,206,209,0.05))',
                                                    border: '1px solid rgba(0,206,209,0.3)',
                                                    borderRadius: 12,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '1.5rem', color: '#00CED1',
                                                }}>
                                                    ?
                                                </div>
                                                {/* Back (symbol) */}
                                                <div style={{
                                                    position: 'absolute', inset: 0,
                                                    backfaceVisibility: 'hidden',
                                                    transform: 'rotateY(180deg)',
                                                    background: card.matched
                                                        ? 'linear-gradient(135deg, rgba(0,229,160,0.2), rgba(0,229,160,0.05))'
                                                        : 'linear-gradient(135deg, rgba(0,206,209,0.3), rgba(0,206,209,0.1))',
                                                    border: `2px solid ${card.matched ? '#00E5A0' : '#00CED1'}`,
                                                    borderRadius: 12,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '1.8rem',
                                                    color: card.matched ? '#00E5A0' : '#fff',
                                                }}>
                                                    {card.symbol}
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={startMemory}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 8,
                                            padding: '12px 24px', borderRadius: 'var(--radius-pill, 20px)',
                                            background: 'rgba(0,206,209,0.1)', border: '1px solid rgba(0,206,209,0.3)',
                                            color: '#00CED1', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 800,
                                            fontFamily: 'var(--font-body)',
                                        }}
                                    >
                                        <RotateCcw size={12} /> RECOMMENCER
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setGameState('idle')}
                                        style={{
                                            padding: '12px 24px', borderRadius: 'var(--radius-pill, 20px)',
                                            background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)',
                                            color: '#FFF', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 800,
                                            fontFamily: 'var(--font-body)',
                                        }}
                                    >
                                        RETOUR
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {/* ─── MEMORY WON STATE ─── */}
                        {gameState === 'memory-won' && (
                            <motion.div
                                key="memory-won"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    maxWidth: 500,
                                    margin: '0 auto',
                                    background: 'var(--bg-surface)',
                                    border: '1px solid var(--border-default)',
                                    borderRadius: 'var(--radius-xl, 20px)',
                                    padding: 48,
                                    boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                                    textAlign: 'center'
                                }}
                            >
                                <motion.div
                                    animate={{ scale: [0.8, 1.2, 1], rotate: [0, 360] }}
                                    transition={{ duration: 0.8 }}
                                    style={{
                                        width: 80, height: 80, borderRadius: '50%',
                                        background: 'rgba(0, 206, 209, 0.1)',
                                        border: '2px solid rgba(0, 206, 209, 0.3)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        margin: '0 auto 24px',
                                    }}
                                >
                                    <Brain size={36} style={{ color: '#00CED1' }} />
                                </motion.div>

                                <h3 style={{ fontSize: '1.6rem', marginBottom: 8 }}>
                                    MÉMOIRE <span style={{ color: '#00CED1' }}>PARFAITE</span>
                                </h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.9rem' }}>
                                    Toutes les paires trouvées en {memoryMoves} coups et {Math.floor(memoryTime / 60)}:{String(memoryTime % 60).padStart(2, '0')} !
                                </p>

                                <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 32 }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.15em', color: 'var(--text-faint)', marginBottom: 4 }}>COUPS</div>
                                        <span style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#00CED1' }}>{memoryMoves}</span>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.15em', color: 'var(--text-faint)', marginBottom: 4 }}>RÉCOMPENSE</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Coins size={20} style={{ color: 'var(--nya-gold)' }} />
                                            <span style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--nya-gold)' }}>+100</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={startMemory}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 8,
                                            padding: '14px 28px', borderRadius: 'var(--radius-pill, 20px)',
                                            background: '#00CED1', border: 'none',
                                            color: '#FFF', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800,
                                            fontFamily: 'var(--font-body)',
                                        }}
                                    >
                                        <RotateCcw size={12} /> REJOUER
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setGameState('idle')}
                                        style={{
                                            padding: '14px 28px', borderRadius: 'var(--radius-pill, 20px)',
                                            background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)',
                                            color: '#FFF', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800,
                                            fontFamily: 'var(--font-body)',
                                        }}
                                    >
                                        RETOURNER AUX JEUX
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {/* ─── NOMMO ODYSSEY PLAYING STATE ─── */}
                        {gameState === 'nommo-playing' && (
                            <motion.div
                                key="nommo-playing"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    maxWidth: 650,
                                    margin: '0 auto',
                                    background: 'var(--bg-surface)',
                                    border: '1px solid var(--border-default)',
                                    borderRadius: 'var(--radius-xl, 20px)',
                                    padding: 30,
                                    boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                                    textAlign: 'center'
                                }}
                            >
                                {/* HUD */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 800, color: 'var(--nya-gold)', textTransform: 'uppercase' }}>
                                        <Rocket size={14} /> NOMMO ODYSSEY
                                    </div>
                                    <div style={{ display: 'flex', gap: 20 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <ShieldAlert size={14} style={{ color: nommoShields > 1 ? '#00E5A0' : '#ef4444' }} />
                                            <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>
                                                BOUCLIERS: {nommoShields}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Timer size={14} style={{ color: 'var(--text-muted)' }} />
                                            <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>{nommoTime}s</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Coins size={14} style={{ color: 'var(--nya-gold)' }} />
                                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--nya-gold)' }}>SCORE: {nommoScore}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Canvas */}
                                <div style={{
                                    border: '2px solid rgba(0,229,160,0.3)',
                                    borderRadius: 14,
                                    overflow: 'hidden',
                                    background: '#050b0d',
                                    marginBottom: 20,
                                    cursor: 'none'
                                }}>
                                    <canvas 
                                        ref={nommoCanvasRef} 
                                        width={590} 
                                        height={380} 
                                        style={{ display: 'block', width: '100%', height: 'auto' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                    <div>CONTROLE : Glissez la souris ou utilisez ZQSD / Flèches</div>
                                    <button 
                                        onClick={() => setGameState('idle')}
                                        style={{
                                            background: 'none', border: 'none', color: '#ef4444',
                                            fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase'
                                        }}
                                    >
                                        ABANDONNER
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* ─── NOMMO ODYSSEY ENDED STATE ─── */}
                        {gameState === 'nommo-ended' && (
                            <motion.div
                                key="nommo-ended"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    maxWidth: 500,
                                    margin: '0 auto',
                                    background: 'var(--bg-surface)',
                                    border: '1px solid var(--border-default)',
                                    borderRadius: 'var(--radius-xl, 20px)',
                                    padding: 48,
                                    boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                                    textAlign: 'center'
                                }}
                            >
                                <motion.div
                                    animate={{ scale: [0.8, 1.2, 1] }}
                                    transition={{ duration: 0.5 }}
                                    style={{
                                        width: 80, height: 80, borderRadius: '50%',
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#ef4444', margin: '0 auto', marginBottom: 24
                                    }}
                                >
                                    <Rocket size={40} style={{ transform: 'rotate(90deg)' }} />
                                </motion.div>

                                <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-display)', marginBottom: 12 }}>
                                    ODYSSÉE TERMINÉE
                                </h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 32 }}>
                                    Votre pirogue a subi des avaries critiques dans le champ d'astéroïdes de Sirius.
                                </p>

                                <div style={{
                                    display: 'grid', gridTemplateColumns: '1fr 1fr',
                                    gap: 20, padding: 24, borderRadius: 'var(--radius-lg, 12px)',
                                    background: 'var(--bg-primary)',
                                    border: '1px solid var(--border-subtle)',
                                    marginBottom: 40
                                }}>
                                    <div>
                                        <div className="accent-label" style={{ marginBottom: 4 }}>SHARDS COLLECTÉS</div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                            <Award size={20} style={{ color: 'var(--nya-gold)' }} />
                                            <span style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-display)' }}>{nommoScore}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="accent-label" style={{ marginBottom: 4 }}>COINS OBTENUS</div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                            <Coins size={20} style={{ color: 'var(--nya-gold)' }} />
                                            <span style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--nya-gold)' }}>+{nommoCoinsEarned}</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={startNommo}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 8,
                                            padding: '14px 28px', borderRadius: 'var(--radius-pill, 20px)',
                                            background: 'linear-gradient(135deg, var(--nya-gold), var(--nya-ochre))', border: 'none',
                                            color: '#FFF', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800,
                                            fontFamily: 'var(--font-body)', transition: 'all 0.3s'
                                        }}
                                    >
                                        <RotateCcw size={12} /> REJOUER
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setGameState('idle')}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 8,
                                            padding: '14px 28px', borderRadius: 'var(--radius-pill, 20px)',
                                            background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)',
                                            color: '#FFF', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800,
                                            fontFamily: 'var(--font-body)', transition: 'all 0.3s'
                                        }}
                                    >
                                        RETOURNER AUX JEUX
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            <Footer />
            <div className="grain-overlay" />
        </div>
    )
}

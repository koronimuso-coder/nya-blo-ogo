import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import { Trophy, ArrowLeft, RotateCcw, HelpCircle, Coins } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useNotificationStore } from '../stores/notificationStore'
import { useNavigate } from 'react-router-dom'

// Counter-clockwise circular path indexing:
// Lower row (Player: 0, 1, 2, 3, 4, 5) -> Upper row (AI: 11, 10, 9, 8, 7, 6)
const PATH = [0, 1, 2, 3, 4, 5, 11, 10, 9, 8, 7, 6]

export default function Awale() {
    const navigate = useNavigate()
    const { addCoins, addScore } = useAuthStore()
    const { push } = useNotificationStore()

    // Game state
    const [board, setBoard] = useState<number[]>([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4])
    const [playerScore, setPlayerScore] = useState(0)
    const [aiScore, setAiScore] = useState(0)
    const [turn, setTurn] = useState<'player' | 'ai'>('player')
    const [isAnimating, setIsAnimating] = useState(false)
    const [activeSowingCell, setActiveSowingCell] = useState<number | null>(null)
    const [gameOver, setGameOver] = useState(false)
    const [gameResult, setGameResult] = useState<'victory' | 'defeat' | 'draw' | null>(null)
    const [coinsReward, setCoinsReward] = useState(0)
    const [showRules, setShowRules] = useState(false)

    // Refs
    const audioCtxRef = useRef<AudioContext | null>(null)
    const isAnimatingRef = useRef(false)

    const getAudioContext = (): AudioContext => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        }
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume()
        }
        return audioCtxRef.current
    }

    // Sound synthesis
    const playSeedClick = (pitchOffset = 0) => {
        try {
            const ctx = getAudioContext()
            const time = ctx.currentTime
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            const filter = ctx.createBiquadFilter()

            osc.type = 'sine'
            osc.frequency.setValueAtTime(550 + pitchOffset, time)
            osc.frequency.exponentialRampToValueAtTime(140 + pitchOffset, time + 0.04)

            filter.type = 'bandpass'
            filter.frequency.value = 750
            filter.Q.value = 4.5

            gain.gain.setValueAtTime(0, time)
            gain.gain.linearRampToValueAtTime(0.35, time + 0.002)
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05)

            osc.connect(filter)
            filter.connect(gain)
            gain.connect(ctx.destination)

            osc.start(time)
            osc.stop(time + 0.06)
        } catch (e) {}
    }

    const playCaptureChime = () => {
        try {
            const ctx = getAudioContext()
            const time = ctx.currentTime
            const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator()
                const gain = ctx.createGain()

                osc.type = 'sine'
                osc.frequency.setValueAtTime(freq, time + idx * 0.06)

                gain.gain.setValueAtTime(0, time + idx * 0.06)
                gain.gain.linearRampToValueAtTime(0.18, time + idx * 0.06 + 0.01)
                gain.gain.exponentialRampToValueAtTime(0.001, time + idx * 0.06 + 0.25)

                osc.connect(gain)
                gain.connect(ctx.destination)

                osc.start(time + idx * 0.06)
                osc.stop(time + idx * 0.06 + 0.3)
            })
        } catch (e) {}
    }

    const playGameOverSound = (win: boolean) => {
        try {
            const ctx = getAudioContext()
            const time = ctx.currentTime
            const notes = win 
                ? [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50] // Rising major arpeggio
                : [392.00, 349.23, 311.13, 261.63, 233.08, 196.00] // Falling minor arpeggio
            
            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator()
                const gain = ctx.createGain()

                osc.type = win ? 'triangle' : 'sawtooth'
                osc.frequency.setValueAtTime(freq, time + idx * 0.08)

                gain.gain.setValueAtTime(0, time + idx * 0.08)
                gain.gain.linearRampToValueAtTime(0.2, time + idx * 0.08 + 0.01)
                gain.gain.exponentialRampToValueAtTime(0.001, time + idx * 0.08 + 0.4)

                osc.connect(gain)
                gain.connect(ctx.destination)

                osc.start(time + idx * 0.08)
                osc.stop(time + idx * 0.08 + 0.45)
            })
        } catch (e) {}
    }

    // Turn execution
    const makeMove = async (startIndex: number) => {
        if (isAnimating || gameOver || board[startIndex] === 0) return
        
        setIsAnimating(true)
        isAnimatingRef.current = true
        
        const tempBoard = [...board]
        let seeds = tempBoard[startIndex]
        tempBoard[startIndex] = 0
        setBoard([...tempBoard])

        let pathIdx = PATH.indexOf(startIndex)
        
        // Sowing loop
        for (let i = 0; i < seeds; i++) {
            await new Promise(resolve => setTimeout(resolve, 200))
            
            pathIdx = (pathIdx + 1) % PATH.length
            // Skip the origin cup if sowing loops fully (standard Awale rule)
            if (PATH[pathIdx] === startIndex && seeds > 11) {
                pathIdx = (pathIdx + 1) % PATH.length
            }

            const currentCell = PATH[pathIdx]
            tempBoard[currentCell] += 1
            setBoard([...tempBoard])
            setActiveSowingCell(currentCell)
            
            // Play procedural seed drop click sound
            playSeedClick((currentCell % 6) * 20)
        }

        await new Promise(resolve => setTimeout(resolve, 200))
        setActiveSowingCell(null)

        // Capture logic
        let captureSum = 0
        let checkPathIdx = pathIdx
        const activePlayer = turn

        // Opponent cups filter check
        const isOpponentCell = (cell: number) => {
            return activePlayer === 'player' 
                ? (cell >= 6 && cell <= 11) 
                : (cell >= 0 && cell <= 5)
        }

        while (true) {
            const checkCell = PATH[checkPathIdx]
            if (isOpponentCell(checkCell) && (tempBoard[checkCell] === 2 || tempBoard[checkCell] === 3)) {
                captureSum += tempBoard[checkCell]
                tempBoard[checkCell] = 0
                checkPathIdx = (checkPathIdx - 1 + PATH.length) % PATH.length
            } else {
                break
            }
        }

        // Apply captures if valid
        if (captureSum > 0) {
            playCaptureChime()
            if (activePlayer === 'player') {
                setPlayerScore(prev => prev + captureSum)
            } else {
                setAiScore(prev => prev + captureSum)
            }
            setBoard([...tempBoard])
        }

        setIsAnimating(false)
        isAnimatingRef.current = false

        // Check ending criteria
        checkGameEnd(tempBoard, playerScore + (activePlayer === 'player' ? captureSum : 0), aiScore + (activePlayer === 'ai' ? captureSum : 0))
        
        // Pass turn
        if (!gameOver) {
            setTurn(activePlayer === 'player' ? 'ai' : 'player')
        }
    }

    // Check end conditions
    const checkGameEnd = (currentBoard: number[], currentPScore: number, currentAIScore: number) => {
        if (currentPScore > 24) {
            triggerGameEnd('victory', currentPScore, currentAIScore)
            return
        }
        if (currentAIScore > 24) {
            triggerGameEnd('defeat', currentPScore, currentAIScore)
            return
        }

        // Check if one side has no seeds
        const playerSeeds = currentBoard.slice(0, 6).reduce((a, b) => a + b, 0)
        const aiSeeds = currentBoard.slice(6, 12).reduce((a, b) => a + b, 0)

        if (playerSeeds === 0 && turn === 'ai') {
            // Player has no seeds, AI must feed if possible.
            // Simplified check: if game continues, but no move is possible, collect remaining seeds.
            const totalRemaining = currentBoard.reduce((a, b) => a + b, 0)
            if (totalRemaining < 4) {
                const finalPScore = currentPScore
                const finalAIScore = currentAIScore + totalRemaining
                triggerGameEnd(finalPScore > finalAIScore ? 'victory' : finalPScore < finalAIScore ? 'defeat' : 'draw', finalPScore, finalAIScore)
            }
        } else if (aiSeeds === 0 && turn === 'player') {
            const totalRemaining = currentBoard.reduce((a, b) => a + b, 0)
            if (totalRemaining < 4) {
                const finalPScore = currentPScore + totalRemaining
                const finalAIScore = currentAIScore
                triggerGameEnd(finalPScore > finalAIScore ? 'victory' : finalPScore < finalAIScore ? 'defeat' : 'draw', finalPScore, finalAIScore)
            }
        }
    }

    const triggerGameEnd = (result: 'victory' | 'defeat' | 'draw', finalPScore: number, finalAIScore: number) => {
        setGameOver(true)
        setGameResult(result)
        playGameOverSound(result === 'victory')

        let reward = 10
        if (result === 'victory') reward = 120
        else if (result === 'draw') reward = 40

        setCoinsReward(reward)
        addCoins(reward)
        addScore(result === 'victory' ? 200 : result === 'draw' ? 50 : 10)

        push({
            type: 'system',
            title: result === 'victory' ? 'VICTOIRE DE L\'INITIÉ !' : result === 'draw' ? 'ÉGALITÉ CÉLESTE' : 'DÉFAITE FACE À L\'ORACLE',
            message: `Vous : ${finalPScore} - Oracle : ${finalAIScore}. Gain : +${reward} Nya Coins !`,
            icon: result === 'victory' ? '🏆' : '⚖️',
            color: result === 'victory' ? 'var(--nya-sirius)' : '#ef4444'
        })
    }

    // AI Heuristics Opponent
    useEffect(() => {
        if (turn === 'ai' && !gameOver && !isAnimating) {
            const runAI = async () => {
                await new Promise(resolve => setTimeout(resolve, 1500))
                
                // Get valid AI moves (indices 6 to 11 with seeds > 0)
                const validMoves = [6, 7, 8, 9, 10, 11].filter(idx => board[idx] > 0)
                if (validMoves.length === 0) return

                // Smart AI heuristic: look for moves that score captures
                let bestMove = validMoves[0]
                let maxCapture = -1

                for (const move of validMoves) {
                    const temp = [...board]
                    let seeds = temp[move]
                    temp[move] = 0
                    
                    let pathIdx = PATH.indexOf(move)
                    for (let i = 0; i < seeds; i++) {
                        pathIdx = (pathIdx + 1) % PATH.length
                        if (PATH[pathIdx] === move && seeds > 11) {
                            pathIdx = (pathIdx + 1) % PATH.length
                        }
                        temp[PATH[pathIdx]] += 1
                    }

                    // Score capture
                    let captures = 0
                    let checkPathIdx = pathIdx
                    while (true) {
                        const checkCell = PATH[checkPathIdx]
                        if (checkCell >= 0 && checkCell <= 5 && (temp[checkCell] === 2 || temp[checkCell] === 3)) {
                            captures += temp[checkCell]
                            temp[checkCell] = 0
                            checkPathIdx = (checkPathIdx - 1 + PATH.length) % PATH.length
                        } else {
                            break
                        }
                    }

                    if (captures > maxCapture) {
                        maxCapture = captures
                        bestMove = move
                    }
                }

                // If no captures possible, choose one with seeds to distribute
                if (maxCapture <= 0) {
                    bestMove = validMoves[Math.floor(Math.random() * validMoves.length)]
                }

                makeMove(bestMove)
            }
            runAI()
        }
    }, [turn, gameOver, isAnimating, board])

    const restartGame = () => {
        setBoard([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4])
        setPlayerScore(0)
        setAiScore(0)
        setTurn('player')
        setGameOver(false)
        setGameResult(null)
        setCoinsReward(0)
    }

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 100 }}>
            <Starfield />
            <CosmicBackground />
            <Navbar />

            {/* Main content */}
            <main className="max-w-container" style={{ paddingTop: 120, position: 'relative', zIndex: 2 }}>
                
                {/* Header back button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                    <button
                        onClick={() => navigate('/games')}
                        style={{
                            background: 'none', border: '1px solid var(--border-default)',
                            color: '#fff', padding: '10px 20px', borderRadius: 12,
                            fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.3s'
                        }}
                    >
                        <ArrowLeft size={14} /> RETOUR AUX JEUX
                    </button>

                    <button
                        onClick={() => setShowRules(!showRules)}
                        style={{
                            background: 'none', border: '1px solid var(--nya-gold)',
                            color: 'var(--nya-gold)', padding: '10px 20px', borderRadius: 12,
                            fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.3s'
                        }}
                    >
                        <HelpCircle size={14} /> {showRules ? 'MASQUER LES RÈGLES' : 'RÈGLES DU JEU'}
                    </button>
                </div>

                {/* Hero Header */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48, textAlign: 'center' }}>
                    <div className="cosmo-label" style={{ margin: '0 auto' }}>NEXUS ARCADE</div>
                    <h1 className="text-shimmer" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
                        AWALÉ COSMIQUE
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: 600, margin: '0 auto' }}>
                        Affrontez l'Oracle de Sirius B dans ce jeu traditionnel ancestral revisité dans une esthétique Afrofuturiste.
                    </p>
                </div>

                {/* Rules Modal / Panel */}
                <AnimatePresence>
                    {showRules && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{
                                background: 'var(--nya-deep)', border: '1px solid var(--nya-gold)',
                                borderRadius: 24, padding: 28, marginBottom: 40, overflow: 'hidden'
                            }}
                        >
                            <h3 style={{ fontSize: '1.1rem', color: 'var(--nya-gold)', marginBottom: 12 }}>RÈGLES DE L'AWALÉ SACRÉ</h3>
                            <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 16 }}>
                                <li><strong>But du jeu :</strong> Capturer le plus de graines possible. La partie s'arrête lorsqu'un joueur a capturé plus de 24 graines.</li>
                                <li><strong>Distribution :</strong> Cliquez sur l'une de vos 6 cases (ligne inférieure) contenant des graines. Les graines sont semées une à une dans les cases suivantes, dans le sens inverse des aiguilles d'une montre.</li>
                                <li><strong>Capture :</strong> Si la dernière graine tombe dans une case de l'adversaire (ligne supérieure) et que celle-ci contient alors 2 ou 3 graines, vous capturez ces graines. La règle s'applique aussi aux cases précédentes si elles respectent la même condition.</li>
                                <li><strong>Nourrir l'adversaire :</strong> Il est interdit d'affamer l'adversaire. Si ses cases sont vides, vous devez jouer un coup qui lui donne des graines si c'est possible.</li>
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Scoreboard and Turn Indicator */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: 20, alignItems: 'center', marginBottom: 48 }}>
                    
                    {/* Player score */}
                    <div style={{
                        background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                        borderRadius: 20, padding: '16px 24px', textAlign: 'center'
                    }}>
                        <div className="cosmo-label" style={{ fontSize: '0.6rem', color: 'var(--nya-gold)' }}>GRAINES CAPTURÉES</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: '#fff', marginTop: 4 }}>
                            {playerScore}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4, fontWeight: 700 }}>VOUS</div>
                    </div>

                    {/* Turn Indicator Banner */}
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 10,
                            background: 'var(--nya-deep)', border: `1.5px solid ${turn === 'player' ? 'var(--nya-sirius)' : 'var(--nya-ochre)'}`,
                            borderRadius: '100px', padding: '10px 24px'
                        }}>
                            <span style={{
                                width: 8, height: 8, borderRadius: '50%',
                                background: turn === 'player' ? 'var(--nya-sirius)' : 'var(--nya-ochre)',
                                boxShadow: `0 0 10px ${turn === 'player' ? 'var(--nya-sirius)' : 'var(--nya-ochre)'}`
                            }} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.05em', color: '#fff', textTransform: 'uppercase' }}>
                                {turn === 'player' ? 'À VOTRE TOUR' : 'L\'ORACLE MÉDITE...'}
                            </span>
                        </div>
                    </div>

                    {/* AI Score */}
                    <div style={{
                        background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                        borderRadius: 20, padding: '16px 24px', textAlign: 'center'
                    }}>
                        <div className="cosmo-label" style={{ fontSize: '0.6rem', color: 'var(--nya-ochre)' }}>GRAINES CAPTURÉES</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: '#fff', marginTop: 4 }}>
                            {aiScore}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4, fontWeight: 700 }}>ORACLE DE SIRIUS</div>
                    </div>

                </div>

                {/* GAME BOARD */}
                <div style={{
                    background: 'linear-gradient(180deg, #111116 0%, #060609 100%)',
                    border: '2px solid var(--nya-ochre)',
                    borderRadius: 32, padding: '48px 32px',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.6), inset 0 0 30px rgba(0,0,0,0.8)',
                    position: 'relative', overflow: 'hidden',
                    marginBottom: 48
                }}>
                    {/* Inner styling decoration */}
                    <div style={{ position: 'absolute', inset: 0, border: '1px dashed rgba(184,92,46,0.15)', borderRadius: 28, pointerEvents: 'none', margin: 6 }} />

                    {/* The 12 Cups Board Layout */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
                        
                        {/* Upper row: AI cups (indices 11 to 6, right to left) */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 24 }}>
                            {[11, 10, 9, 8, 7, 6].map((idx) => {
                                const count = board[idx]
                                const isSowing = activeSowingCell === idx
                                return (
                                    <div
                                        key={idx}
                                        style={{
                                            aspectRatio: '1', borderRadius: '50%',
                                            background: isSowing ? 'rgba(184,92,46,0.1)' : 'rgba(255,255,255,0.01)',
                                            border: isSowing 
                                                ? '2px solid var(--nya-ochre)' 
                                                : '1px solid rgba(255,255,255,0.06)',
                                            boxShadow: isSowing 
                                                ? '0 0 15px var(--nya-ochre)' 
                                                : 'none',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            position: 'relative', transition: 'all 0.3s ease-in-out'
                                        }}
                                    >
                                        {/* Seed particles count indicator */}
                                        <div style={{
                                            position: 'absolute', top: -14,
                                            fontSize: '0.65rem', fontWeight: 900,
                                            color: 'var(--nya-ochre)', fontFamily: 'monospace'
                                        }}>
                                            CUP {idx + 1}
                                        </div>

                                        {/* Nested Seed particles visualizer */}
                                        <div style={{
                                            display: 'grid', 
                                            gridTemplateColumns: count > 4 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)', 
                                            gap: 6, width: '50%', height: '50%',
                                            alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            {[...Array(count)].map((_, s) => (
                                                <div
                                                    key={s}
                                                    style={{
                                                        width: 10, height: 10, borderRadius: '50%',
                                                        background: 'var(--nya-ochre)',
                                                        boxShadow: '0 0 6px var(--nya-ochre)'
                                                    }}
                                                />
                                            ))}
                                        </div>

                                        {/* Seed count tag overlay */}
                                        <div style={{
                                            position: 'absolute', bottom: -12,
                                            background: '#000', border: '1px solid var(--border-default)',
                                            borderRadius: 8, padding: '2px 8px', fontSize: '0.65rem',
                                            fontWeight: 800, color: '#fff'
                                        }}>
                                            {count}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Middle divider line */}
                        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent 0%, var(--nya-ochre) 50%, transparent 100%)', opacity: 0.3 }} />

                        {/* Lower row: Player cups (indices 0 to 5, left to right) */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 24 }}>
                            {[0, 1, 2, 3, 4, 5].map((idx) => {
                                const count = board[idx]
                                const isSowing = activeSowingCell === idx
                                const isValidMove = turn === 'player' && count > 0 && !isAnimating && !gameOver
                                return (
                                    <motion.div
                                        key={idx}
                                        whileHover={isValidMove ? { scale: 1.05, borderColor: 'var(--nya-sirius)', boxShadow: '0 0 20px rgba(0,229,160,0.2)' } : {}}
                                        whileTap={isValidMove ? { scale: 0.95 } : {}}
                                        onClick={() => {
                                            if (isValidMove) makeMove(idx)
                                        }}
                                        style={{
                                            aspectRatio: '1', borderRadius: '50%',
                                            background: isSowing ? 'rgba(0,229,160,0.1)' : 'rgba(255,255,255,0.01)',
                                            border: isSowing 
                                                ? '2px solid var(--nya-sirius)' 
                                                : `1.5px solid ${isValidMove ? 'rgba(0,229,160,0.3)' : 'rgba(255,255,255,0.06)'}`,
                                            boxShadow: isSowing 
                                                ? '0 0 15px var(--nya-sirius)' 
                                                : 'none',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            position: 'relative', cursor: isValidMove ? 'pointer' : 'default',
                                            transition: 'all 0.3s ease-in-out'
                                        }}
                                    >
                                        <div style={{
                                            position: 'absolute', bottom: -14,
                                            fontSize: '0.65rem', fontWeight: 900,
                                            color: isValidMove ? 'var(--nya-sirius)' : 'var(--text-muted)',
                                            fontFamily: 'monospace'
                                        }}>
                                            CUP {idx + 1}
                                        </div>

                                        {/* Nested Seed particles visualizer */}
                                        <div style={{
                                            display: 'grid', 
                                            gridTemplateColumns: count > 4 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)', 
                                            gap: 6, width: '50%', height: '50%',
                                            alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            {[...Array(count)].map((_, s) => (
                                                <div
                                                    key={s}
                                                    style={{
                                                        width: 10, height: 10, borderRadius: '50%',
                                                        background: 'var(--nya-sirius)',
                                                        boxShadow: '0 0 6px var(--nya-sirius)'
                                                    }}
                                                />
                                            ))}
                                        </div>

                                        {/* Seed count tag overlay */}
                                        <div style={{
                                            position: 'absolute', top: -12,
                                            background: '#000', border: '1px solid var(--border-default)',
                                            borderRadius: 8, padding: '2px 8px', fontSize: '0.65rem',
                                            fontWeight: 800, color: '#fff'
                                        }}>
                                            {count}
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>

                    </div>

                </div>

                {/* Restart control */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
                    <button
                        onClick={restartGame}
                        style={{
                            background: 'none', border: '1px solid var(--border-default)',
                            color: '#fff', padding: '12px 28px', borderRadius: 16,
                            fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.3s'
                        }}
                    >
                        <RotateCcw size={16} /> RÉINITIALISER LA PARTIE
                    </button>
                </div>

                {/* GAME RESULT OVERLAY MODAL */}
                <AnimatePresence>
                    {gameOver && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: 'fixed', inset: 0, zIndex: 1000,
                                background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                style={{
                                    maxWidth: 480, width: '90%',
                                    background: 'var(--nya-deep)', border: `2px solid ${gameResult === 'victory' ? 'var(--nya-sirius)' : 'rgba(239, 68, 68, 0.5)'}`,
                                    borderRadius: 32, padding: 40, textAlign: 'center',
                                    boxShadow: `0 20px 60px ${gameResult === 'victory' ? 'rgba(0,229,160,0.15)' : 'rgba(239, 68, 68, 0.15)'}`
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                                    <div style={{
                                        width: 70, height: 70, borderRadius: '50%',
                                        background: gameResult === 'victory' ? 'rgba(0,229,160,0.1)' : 'rgba(239,68,68,0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <Trophy size={36} style={{ color: gameResult === 'victory' ? 'var(--nya-sirius)' : '#ef4444' }} />
                                    </div>
                                </div>

                                <h2 style={{
                                    fontFamily: 'var(--font-display)', fontSize: '2.2rem',
                                    color: gameResult === 'victory' ? 'var(--nya-sirius)' : gameResult === 'draw' ? 'var(--nya-gold)' : '#ef4444',
                                    marginBottom: 8
                                }}>
                                    {gameResult === 'victory' ? 'VICTOIRE !' : gameResult === 'draw' ? 'ÉGALITÉ CÉLESTE' : 'DÉFAITE'}
                                </h2>
                                
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 24 }}>
                                    {gameResult === 'victory' 
                                        ? "Vous avez surmonté la prescience de l'Oracle de Sirius B !" 
                                        : gameResult === 'draw'
                                            ? "Un équilibre parfait a été maintenu dans le champ stellaire."
                                            : "L'Oracle a anticipé toutes vos stratégies cosmiques."}
                                </p>

                                <div style={{
                                    display: 'flex', flexDirection: 'column', gap: 10,
                                    background: 'var(--bg-elevated)', borderRadius: 20,
                                    padding: '16px 20px', marginBottom: 28
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>Vos captures :</span>
                                        <span style={{ color: '#fff', fontWeight: 800 }}>{playerScore} graines</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>Captures de l'Oracle :</span>
                                        <span style={{ color: '#fff', fontWeight: 800 }}>{aiScore} graines</span>
                                    </div>
                                    <div style={{ height: 1, background: 'var(--border-default)', margin: '4px 0' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--nya-gold)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Coins size={14} /> RÉCOMPENSE
                                        </span>
                                        <span style={{ fontSize: '1rem', color: 'var(--nya-gold)', fontWeight: 900 }}>
                                            +{coinsReward} NYA COINS
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <button
                                        onClick={restartGame}
                                        style={{
                                            width: '100%', padding: '14px', borderRadius: 16,
                                            background: gameResult === 'victory' ? 'var(--nya-sirius)' : 'var(--nya-ochre)',
                                            border: 'none', color: '#fff', fontWeight: 900,
                                            fontSize: '0.8rem', letterSpacing: '0.05em', cursor: 'pointer',
                                            boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                                        }}
                                    >
                                        JOUER UNE NOUVELLE PARTIE
                                    </button>
                                    <button
                                        onClick={() => {
                                            setGameOver(false)
                                            navigate('/games')
                                        }}
                                        style={{
                                            width: '100%', padding: '12px', borderRadius: 16,
                                            background: 'none', border: '1px solid var(--border-default)',
                                            color: 'var(--text-muted)', fontWeight: 700,
                                            fontSize: '0.8rem', cursor: 'pointer'
                                        }}
                                    >
                                        RETOUR AU LOBBY
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </main>
            <Footer />
        </div>
    )
}

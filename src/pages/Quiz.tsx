import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { useNotificationStore } from '../stores/notificationStore'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import { Award, CheckCircle, XCircle, Clock } from 'lucide-react'

interface Question {
    text: string
    options: string[]
    correct: number
    lore: string
}

const QUESTIONS: Question[] = [
    {
        text: "Quelle étoile, invisible à l'œil nu, était connue des prêtres Dogon avant sa découverte moderne ?",
        options: ["Alpha Centauri", "Sirius B (Digitaria)", "Betelgeuse", "Polaris"],
        correct: 1,
        lore: "Les Dogons nomment Sirius B 'Pô Tolo' ou 'Digitaria'. Ils connaissaient sa période orbitale de 50 ans et sa densité exceptionnelle."
    },
    {
        text: "Dans quel empire de l'Ouest africain a été rédigée la charte des droits de l'homme de Kouroukan Fouga en 1236 ?",
        options: ["Empire du Ghana", "Empire Songhaï", "Empire du Mali", "Royaume Ashanti"],
        correct: 2,
        lore: "La charte de Kouroukan Fouga a été proclamée par Soundiata Keïta après la fondation de l'Empire du Mali."
    },
    {
        text: "Quelle est la capitale politique de la Côte d'Ivoire, réputée pour sa Basilique géante ?",
        options: ["Abidjan", "Yamoussoukro", "San-Pédro", "Bouaké"],
        correct: 1,
        lore: "Yamoussoukro est la capitale politique et administrative, abritant la Basilique Notre-Dame de la Paix."
    }
]

export default function Quiz() {
    const { addCoins, addScore, unlockAchievement } = useAuthStore()
    const { push } = useNotificationStore()

    const [qIdx, setQIdx] = useState(0)
    const [selected, setSelected] = useState<number | null>(null)
    const [timeLeft, setTimeLeft] = useState(15)
    const [score, setScore] = useState(0)
    const [quizFinished, setQuizFinished] = useState(false)

    const activeQuestion = QUESTIONS[qIdx]

    // Countdown Timer
    useEffect(() => {
        if (quizFinished || selected !== null) return
        if (timeLeft <= 0) {
            handleAnswer(-1) // timeout
            return
        }

        const timer = setTimeout(() => {
            setTimeLeft(prev => prev - 1)
        }, 1000)

        return () => clearTimeout(timer)
    }, [timeLeft, selected, quizFinished])

    const handleAnswer = (idx: number) => {
        setSelected(idx)
        if (idx === activeQuestion.correct) {
            setScore(prev => prev + 1)
        }

        setTimeout(() => {
            if (qIdx < QUESTIONS.length - 1) {
                setQIdx(prev => prev + 1)
                setSelected(null)
                setTimeLeft(15)
            } else {
                finishQuiz()
            }
        }, 2500)
    }

    const finishQuiz = () => {
        setQuizFinished(true)
        const perfect = score === QUESTIONS.length
        const coinsEarned = score * 15
        const scoreEarned = score * 30

        addCoins(coinsEarned)
        addScore(scoreEarned)

        if (perfect) {
            unlockAchievement('quiz-master')
        }

        push({
            type: 'reward',
            title: 'Quiz Terminé',
            message: `Vous avez obtenu ${score}/${QUESTIONS.length} réponses correctes (+${coinsEarned} Nya Coins).`,
            icon: '🎓',
            color: '#00E5A0'
        })
    }

    const restartQuiz = () => {
        setQIdx(0)
        setSelected(null)
        setTimeLeft(15)
        setScore(0)
        setQuizFinished(false)
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
                    <div className="cosmo-label">Académie des Scribes {" > "} Évaluation</div>
                    <h1 className="text-shimmer" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                        QUIZ DES SCRIBES
                    </h1>
                </div>

                <div style={{ maxWidth: 640, margin: '0 auto' }}>
                    <AnimatePresence mode="wait">
                        {!quizFinished ? (
                            /* Active Question Panel */
                            <motion.div
                                key={qIdx}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                                    borderRadius: 24, padding: 40, boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
                                }}
                            >
                                {/* Header bar */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--nya-gold)', fontWeight: 800 }}>
                                        QUESTION {qIdx + 1} / {QUESTIONS.length}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: timeLeft <= 5 ? '#ef4444' : '#fff', fontWeight: 800 }}>
                                        <Clock size={14} /> {timeLeft} s
                                    </span>
                                </div>

                                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', lineHeight: 1.6, marginBottom: 32 }}>
                                    {activeQuestion.text}
                                </h3>

                                {/* Options */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    {activeQuestion.options.map((opt, idx) => {
                                        const isSelected = selected === idx
                                        const isCorrect = idx === activeQuestion.correct
                                        let bg = 'var(--bg-elevated)'
                                        let border = '1px solid var(--border-default)'

                                        if (selected !== null) {
                                            if (isCorrect) {
                                                bg = 'rgba(0,229,160,0.1)'
                                                border = '1px solid #00E5A0'
                                            } else if (isSelected) {
                                                bg = 'rgba(239,68,68,0.1)'
                                                border = '1px solid #ef4444'
                                            }
                                        }

                                        return (
                                            <motion.button
                                                key={idx}
                                                whileHover={selected === null ? { scale: 1.01 } : {}}
                                                whileTap={selected === null ? { scale: 0.99 } : {}}
                                                onClick={() => selected === null && handleAnswer(idx)}
                                                disabled={selected !== null}
                                                style={{
                                                    padding: '16px 20px', borderRadius: 12,
                                                    background: bg, border: border,
                                                    color: '#fff', textAlign: 'left', fontSize: '0.85rem',
                                                    fontWeight: 600, cursor: selected === null ? 'pointer' : 'default',
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                    transition: 'background 0.3s, border 0.3s'
                                                }}
                                            >
                                                {opt}
                                                {selected !== null && isCorrect && <CheckCircle size={16} color="#00E5A0" />}
                                                {selected !== null && isSelected && !isCorrect && <XCircle size={16} color="#ef4444" />}
                                            </motion.button>
                                        )
                                    })}
                                </div>

                                {/* Lore text on answer selection */}
                                {selected !== null && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{
                                            marginTop: 24, padding: 16, background: 'rgba(212,160,23,0.05)',
                                            border: '1px solid rgba(212,160,23,0.2)', borderRadius: 12,
                                            fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5
                                        }}
                                    >
                                        <span style={{ fontWeight: 800, color: 'var(--nya-gold)', display: 'block', marginBottom: 4 }}>Le Savoir de Ségou :</span>
                                        {activeQuestion.lore}
                                    </motion.div>
                                )}
                            </motion.div>
                        ) : (
                            /* Quiz Victory / Summary Panel */
                            <motion.div
                                key="finished"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{
                                    background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                                    borderRadius: 24, padding: 40, textAlign: 'center',
                                    boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
                                }}
                            >
                                <div style={{
                                    width: 70, height: 70, borderRadius: '50%',
                                    background: 'rgba(212,160,23,0.1)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 24px', color: 'var(--nya-gold)'
                                }}>
                                    <Award size={36} />
                                </div>

                                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, color: '#fff', marginBottom: 12 }}>
                                    ÉVALUATION TERMINÉE
                               </h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
                                    Votre score : **{score} / {QUESTIONS.length}** réponses correctes.
                                </p>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 360, margin: '0 auto 32px' }}>
                                    <div style={{ background: 'var(--bg-primary)', padding: 16, borderRadius: 16 }}>
                                        <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', display: 'block' }}>Nya Coins Gagnés</span>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                                            +{score * 15}
                                        </span>
                                    </div>
                                    <div style={{ background: 'var(--bg-primary)', padding: 16, borderRadius: 16 }}>
                                        <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', display: 'block' }}>Nya Score Gagné</span>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                                            +{score * 30}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={restartQuiz}
                                        style={{
                                            padding: '12px 24px', borderRadius: 12,
                                            background: 'var(--nya-ochre)', border: 'none',
                                            color: '#fff', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer'
                                        }}
                                    >
                                        RECOMMENCER
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </main>
            <Footer />
        </div>
    )
}

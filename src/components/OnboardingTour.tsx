import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { ChevronRight, X, Sparkles } from 'lucide-react'

interface TourStep {
    targetId: string
    title: string
    content: string
    position: 'bottom' | 'top' | 'left' | 'right' | 'center'
}

const TOUR_STEPS: TourStep[] = [
    {
        targetId: '',
        title: '🌌 Salutations Scribe !',
        content: 'Bienvenue sur NYA BLO. Je suis Nommo AI, l\'Oracle des Étoiles. Laissez-moi vous initier aux secrets de cet écosystème numérique inspiré du savoir Dogon.',
        position: 'center',
    },
    {
        targetId: 'nav-search-hint',
        title: '⚡ Palette d\'Invocation (Ctrl+K)',
        content: 'Pressez Ctrl+K ou cliquez ici pour invoquer la Palette Sirius. Vous pourrez naviguer instantanément vers n\'importe quel module ou action du site.',
        position: 'bottom',
    },
    {
        targetId: 'nav-achievements',
        title: '🏆 Les Badges d\'Initiation',
        content: 'Suivez votre progression d\'initié ! Complétez des défis pour débloquer 13 badges cosmiques différents et gagner des Nya Coins.',
        position: 'bottom',
    },
    {
        targetId: 'nav-notifications',
        title: '🔔 Les Murmures du Nexus',
        content: 'Restez informé en temps réel des messages du conseil, des récompenses obtenues et des événements du système.',
        position: 'bottom',
    },
    {
        targetId: 'nav-cart',
        title: '🛒 Le Panier Sacré',
        content: 'Achetez des objets bogolan, du matériel technologique ou des services IA en un clic. Vos objets iront directement dans votre voûte de profil.',
        position: 'bottom',
    },
    {
        targetId: 'nav-nexus-portal',
        title: '🔑 Le Portail Nexus',
        content: 'Accédez à votre Observatoire Sirius (Dashboard) pour voir vos statistiques de connexion, votre portefeuille de Nya Coins et vos tâches.',
        position: 'bottom',
    },
    {
        targetId: '',
        title: '🚀 Prêt pour l\'Aventure ?',
        content: 'Votre initiation de base est terminée. Allez de l\'avant, explorez, et que l\'étoile Sirius guide vos pas dans l\'univers digital !',
        position: 'center',
    }
]

export default function OnboardingTour() {
    const { unlockAchievement } = useAuthStore()
    const [stepIndex, setStepIndex] = useState(-1)
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 })

    useEffect(() => {
        const completed = localStorage.getItem('nya-onboarding-completed')
        if (!completed) {
            // Start tour after a delay
            const timer = setTimeout(() => {
                setStepIndex(0)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [])

    const currentStep = stepIndex >= 0 && stepIndex < TOUR_STEPS.length ? TOUR_STEPS[stepIndex] : null

    useEffect(() => {
        if (!currentStep || currentStep.position === 'center') return

        const updatePosition = () => {
            const el = document.getElementById(currentStep.targetId)
            if (el) {
                const rect = el.getBoundingClientRect()
                setCoords({
                    top: rect.top + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width,
                    height: rect.height
                })
                // Scroll into view if needed
                el.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
        }

        updatePosition()
        window.addEventListener('resize', updatePosition)
        return () => window.removeEventListener('resize', updatePosition)
    }, [currentStep])

    if (!currentStep) return null

    const handleNext = () => {
        if (stepIndex === TOUR_STEPS.length - 1) {
            handleComplete()
        } else {
            setStepIndex(stepIndex + 1)
        }
    }

    const handleSkip = () => {
        handleComplete()
    }

    const handleComplete = () => {
        localStorage.setItem('nya-onboarding-completed', 'true')
        unlockAchievement('onboarding-complete')
        setStepIndex(-1)
    }

    // Custom inline trigger for profile setting
    const triggerRestart = () => {
        localStorage.removeItem('nya-onboarding-completed')
        setStepIndex(0)
    }

    // Attach to window so we can trigger it from Profile settings
    (window as any).restartOnboardingTour = triggerRestart

    // Calculate tooltip coordinates based on position type
    const getTooltipStyle = (): React.CSSProperties => {
        if (currentStep.position === 'center') {
            return {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10005,
                width: 'min(420px, 90vw)',
            }
        }

        // Target-relative styling
        const spacing = 12
        const style: React.CSSProperties = {
            position: 'absolute',
            zIndex: 10005,
            width: 320,
        }

        if (currentStep.position === 'bottom') {
            style.top = coords.top + coords.height + spacing
            style.left = coords.left + (coords.width / 2) - 160
        } else if (currentStep.position === 'top') {
            style.top = coords.top - spacing - 200 // estimated height
            style.left = coords.left + (coords.width / 2) - 160
        } else if (currentStep.position === 'left') {
            style.top = coords.top + (coords.height / 2) - 100
            style.left = coords.left - 320 - spacing
        } else if (currentStep.position === 'right') {
            style.top = coords.top + (coords.height / 2) - 100
            style.left = coords.left + coords.width + spacing
        }

        // Keep inside screen bounds
        if (style.left && typeof style.left === 'number') {
            if (style.left < 10) style.left = 10
            if (style.left + 320 > window.innerWidth - 10) {
                style.left = window.innerWidth - 330
            }
        }

        return style
    }

    return (
        <AnimatePresence>
            <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 10001 }}>
                {/* Backdrop with hole (spotlight) if target exists */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        backdropFilter: 'blur(3px)',
                        zIndex: 10002,
                        pointerEvents: 'auto',
                    }}
                    onClick={handleSkip}
                />

                {/* Spotlight SVG overlay */}
                {currentStep.position !== 'center' && (
                    <svg
                        style={{
                            position: 'fixed',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: 10003,
                            pointerEvents: 'none',
                        }}
                    >
                        <defs>
                            <mask id="spotlight-mask">
                                <rect width="100%" height="100%" fill="white" />
                                <rect
                                    x={coords.left - 6 - window.scrollX}
                                    y={coords.top - 6 - window.scrollY}
                                    width={coords.width + 12}
                                    height={coords.height + 12}
                                    rx={12}
                                    fill="black"
                                />
                            </mask>
                        </defs>
                        <rect
                            width="100%"
                            height="100%"
                            fill="rgba(0, 0, 0, 0.75)"
                            mask="url(#spotlight-mask)"
                        />
                        {/* Glowing outline around target */}
                        <rect
                            x={coords.left - 6 - window.scrollX}
                            y={coords.top - 6 - window.scrollY}
                            width={coords.width + 12}
                            height={coords.height + 12}
                            rx={12}
                            fill="none"
                            stroke="var(--nya-gold)"
                            strokeWidth="2"
                            style={{ filter: 'drop-shadow(0 0 8px var(--nya-gold))' }}
                        />
                    </svg>
                )}

                {/* Tooltip Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    style={getTooltipStyle()}
                >
                    <div
                        style={{
                            background: 'var(--nya-deep)',
                            border: '1px solid rgba(212,160,23,0.3)',
                            borderRadius: 16,
                            padding: '24px 20px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 20px rgba(212,160,23,0.05)',
                            color: 'var(--text-primary)',
                            position: 'relative',
                        }}
                    >
                        {/* Glowing orb in header */}
                        <div style={{
                            position: 'absolute', top: -20, left: 24,
                            width: 40, height: 40, borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--nya-ochre) 0%, var(--nya-gold) 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 15px var(--nya-ochre)',
                        }}>
                            <Sparkles size={18} color="#fff" />
                        </div>

                        {/* Close button */}
                        <button
                            onClick={handleSkip}
                            style={{
                                position: 'absolute', top: 12, right: 12,
                                background: 'none', border: 'none', color: 'var(--text-muted)',
                                cursor: 'pointer', opacity: 0.7,
                            }}
                        >
                            <X size={16} />
                        </button>

                        <div style={{ marginTop: 8 }}>
                            <h3 style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '1.2rem', fontWeight: 900,
                                marginBottom: 12, color: 'var(--nya-gold)',
                                textTransform: 'uppercase', letterSpacing: '0.05em'
                            }}>
                                {currentStep.title}
                            </h3>
                            <p style={{
                                fontSize: '0.85rem', lineHeight: 1.6,
                                color: 'var(--text-secondary)', marginBottom: 20
                            }}>
                                {currentStep.content}
                            </p>

                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                borderTop: '1px solid var(--border-default)', paddingTop: 16
                            }}>
                                <button
                                    onClick={handleSkip}
                                    style={{
                                        background: 'none', border: 'none',
                                        fontSize: '0.7rem', fontWeight: 700,
                                        color: 'var(--text-faint)', cursor: 'pointer',
                                        letterSpacing: '0.05em', textTransform: 'uppercase'
                                    }}
                                >
                                    Passer l\'initiation
                                </button>

                                <button
                                    onClick={handleNext}
                                    style={{
                                        background: 'var(--nya-ochre)',
                                        border: 'none', borderRadius: '20px',
                                        padding: '8px 16px', color: '#fff',
                                        fontSize: '0.75rem', fontWeight: 800,
                                        letterSpacing: '0.05em', textTransform: 'uppercase',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                                        boxShadow: '0 4px 12px rgba(184,92,46,0.3)'
                                    }}
                                >
                                    {stepIndex === TOUR_STEPS.length - 1 ? 'Terminer' : 'Suivant'}
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Step indicators */}
                        <div style={{
                            display: 'flex', gap: 4, justifyContent: 'center', marginTop: 12
                        }}>
                            {TOUR_STEPS.map((_, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        width: idx === stepIndex ? 16 : 4,
                                        height: 4, borderRadius: 2,
                                        background: idx === stepIndex ? 'var(--nya-gold)' : 'var(--border-default)',
                                        transition: 'all 0.3s'
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

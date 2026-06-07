import { useEffect, useState } from 'react'

/**
 * CosmicBackground — Combines all background effects:
 * - Aurora borealis drifting nebulae
 * - Cosmic grid lines (Dogon cosmogonic grid)
 * - Periodic comet streaks
 * - Floating Kanaga symbols
 */
export default function CosmicBackground() {
    const [showComet, setShowComet] = useState(false)

    // Trigger a comet every 12–20 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setShowComet(true)
            setTimeout(() => setShowComet(false), 8000)
        }, 12000 + Math.random() * 8000)
        return () => clearInterval(interval)
    }, [])

    return (
        <>
            {/* Aurora nebulae */}
            <div className="aurora-bg" style={{ opacity: 'var(--aurora-opacity)' }} />

            {/* Subtle cosmic grid — Dogon cosmogonic structure */}
            <div className="cosmic-grid" style={{ opacity: 'var(--grid-opacity)' }} />

            {/* Periodic comet */}
            {showComet && <div className="comet" style={{ top: `${15 + Math.random() * 30}%` }} />}

            {/* Floating Kanaga symbols */}
            {[...Array(5)].map((_, i) => (
                <svg
                    key={i}
                    width="30"
                    height="30"
                    viewBox="0 0 40 40"
                    fill="none"
                    style={{
                        position: 'fixed',
                        left: `${15 + i * 18}%`,
                        top: `${10 + (i * 23) % 70}%`,
                        opacity: 0.06,
                        pointerEvents: 'none',
                        zIndex: 0,
                        animation: `kanaga-float ${8 + i * 3}s ease-in-out infinite`,
                        animationDelay: `${i * 2}s`,
                    }}
                >
                    <path d="M20 4 L36 20 L20 36 L4 20 Z" stroke="currentColor" strokeWidth="1" fill="none" style={{ color: 'var(--nya-ochre)' }} />
                    <path d="M20 14 L26 20 L20 26 L14 20 Z" fill="currentColor" style={{ color: 'var(--nya-ochre)' }} />
                </svg>
            ))}
        </>
    )
}

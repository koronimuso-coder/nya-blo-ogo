import { useEffect, useState } from 'react'

/**
 * ScrollProgress — Ochre-to-gold-to-sirius gradient bar at top
 * that tracks the user's scroll position through the page
 */
export default function ScrollProgress() {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY
            const docHeight = document.documentElement.scrollHeight - window.innerHeight
            const prog = docHeight > 0 ? scrollTop / docHeight : 0
            setProgress(Math.min(prog, 1))
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div
            className="scroll-progress"
            style={{ transform: `scaleX(${progress})` }}
        />
    )
}

import { useMemo } from 'react'

/**
 * Starfield — 80 twinkling stars with varied sizes, positions and timings
 * Creates the illusion of deep space behind the Dogon Universe
 */
export default function Starfield() {
    const stars = useMemo(() => {
        return Array.from({ length: 80 }, (_, i) => ({
            id: i,
            x: ((i * 37 + 13) % 100),
            y: ((i * 53 + 7) % 100),
            size: (i % 5 === 0) ? 2 : (i % 3 === 0) ? 1.5 : 1,
            duration: 2 + (i % 7) * 1.2,
            delay: (i % 11) * 0.5,
            minOpacity: 0.05 + (i % 4) * 0.05,
            maxOpacity: 0.3 + (i % 6) * 0.12,
        }))
    }, [])

    return (
        <div className="starfield" style={{ opacity: 'var(--starfield-opacity)' }}>
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="star"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: star.size,
                        height: star.size,
                        ['--duration' as string]: `${star.duration}s`,
                        ['--delay' as string]: `${star.delay}s`,
                        ['--min-opacity' as string]: star.minOpacity,
                        ['--max-opacity' as string]: star.maxOpacity,
                    }}
                />
            ))}
        </div>
    )
}

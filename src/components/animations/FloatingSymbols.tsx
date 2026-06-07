import { motion } from 'framer-motion'
import { useMemo } from 'react'

// 12 Dogon SVG symbols as simple path data
const dogonSymbols = [
    // Kanaga mask ◈
    'M12 2 L22 12 L12 22 L2 12 Z M12 6 L18 12 L12 18 L6 12 Z',
    // Spiral (Amma)
    'M12 12 C12 8 16 8 16 12 C16 16 8 16 8 12 C8 6 18 6 18 12 C18 18 6 18 6 12',
    // Cross
    'M12 2 V22 M2 12 H22',
    // Zigzag (Hogon serpent)
    'M2 12 L6 6 L10 18 L14 6 L18 18 L22 12',
    // Triangle (chevron)
    'M12 4 L22 20 H2 Z',
    // Circle (Po Tolo)
    'M12 3 A9 9 0 1 0 12 21 A9 9 0 1 0 12 3',
    // Tower (grenier)
    'M6 22 V8 L12 2 L18 8 V22',
    // Double spiral
    'M6 12 C6 8 10 8 10 12 C10 16 6 16 6 12 M18 12 C18 16 14 16 14 12 C14 8 18 8 18 12',
    // Star
    'M12 2 L14.5 8.5 L22 9.5 L16 15 L17.5 22 L12 18.5 L6.5 22 L8 15 L2 9.5 L9.5 8.5 Z',
    // Nommo twins
    'M8 4 A4 4 0 1 0 8 12 M16 12 A4 4 0 1 0 16 20',
    // Sun disc
    'M12 6 A6 6 0 1 0 12 18 A6 6 0 1 0 12 6 M12 2 V4 M12 20 V22 M2 12 H4 M20 12 H22',
    // Toguna roof
    'M2 14 H22 M4 14 V22 M20 14 V22 M6 14 L12 6 L18 14',
]

export default function FloatingSymbols() {
    const symbols = useMemo(
        () =>
            dogonSymbols.map((path, i) => ({
                path,
                x: `${5 + (i * 8) % 90}%`,
                delay: i * 0.8,
                duration: 12 + Math.random() * 8,
                size: 20 + Math.random() * 16,
            })),
        []
    )

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1,
                overflow: 'hidden',
            }}
        >
            {symbols.map((s, i) => (
                <motion.svg
                    key={i}
                    width={s.size}
                    height={s.size}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(212,160,23,0.06)"
                    strokeWidth="1"
                    style={{
                        position: 'absolute',
                        left: s.x,
                        bottom: '-5%',
                    }}
                    animate={{
                        y: [0, -window.innerHeight - 100],
                        rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
                        opacity: [0, 0.04, 0.04, 0],
                    }}
                    transition={{
                        duration: s.duration,
                        delay: s.delay,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                >
                    <path d={s.path} />
                </motion.svg>
            ))}
        </div>
    )
}

import { motion } from 'framer-motion'

/**
 * SacredGeometry — Rotating Dogon sacred geometry ornament
 * 3 concentric rings with inner Kanaga diamond, slow rotation
 */
export default function SacredGeometry({ size = 300, opacity = 0.06 }: { size?: number; opacity?: number }) {
    return (
        <div style={{ width: size, height: size, position: 'relative', opacity, pointerEvents: 'none' }}>
            {/* Outer ring */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                style={{
                    position: 'absolute', inset: 0,
                    border: '1px solid var(--nya-ochre)',
                    borderRadius: '50%',
                }}
            />

            {/* Mid ring — counter-rotating */}
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                style={{
                    position: 'absolute',
                    top: '15%', left: '15%', right: '15%', bottom: '15%',
                    border: '1px solid var(--nya-ochre)',
                    borderRadius: '50%',
                }}
            />

            {/* Inner ring */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                style={{
                    position: 'absolute',
                    top: '30%', left: '30%', right: '30%', bottom: '30%',
                    border: '1px solid var(--nya-ochre)',
                    borderRadius: '50%',
                }}
            />

            {/* Central Kanaga */}
            <motion.svg
                animate={{ rotate: -360 }}
                transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
                viewBox="0 0 40 40"
                fill="none"
                style={{
                    position: 'absolute',
                    top: '40%', left: '40%', width: '20%', height: '20%',
                }}
            >
                <path d="M20 4 L36 20 L20 36 L4 20 Z" stroke="var(--nya-ochre)" strokeWidth="1.5" fill="none" />
                <path d="M20 12 L28 20 L20 28 L12 20 Z" fill="var(--nya-ochre)" opacity="0.5" />
            </motion.svg>

            {/* 4 cardinal dots */}
            {[0, 90, 180, 270].map((angle) => (
                <motion.div
                    key={angle}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: angle / 180 }}
                    style={{
                        position: 'absolute',
                        width: 4, height: 4,
                        borderRadius: '50%',
                        background: 'var(--nya-ochre)',
                        top: `${50 + 45 * Math.sin((angle * Math.PI) / 180)}%`,
                        left: `${50 + 45 * Math.cos((angle * Math.PI) / 180)}%`,
                        transform: 'translate(-50%, -50%)',
                    }}
                />
            ))}
        </div>
    )
}

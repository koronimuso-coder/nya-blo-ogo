import { motion } from 'framer-motion'

interface OrbitalProps {
    variant?: 'landing' | 'shop' | 'learn' | 'vtc' | 'immobilier' | 'health'
}

const variants = {
    landing: { planetColor: '#1a1a2e', glowColor: 'rgba(212,160,23,0.15)', rings: 3, dotColor: '#00CED1' },
    shop: { planetColor: '#2e1a0a', glowColor: 'rgba(184,92,46,0.2)', rings: 2, dotColor: '#FF8C00' },
    learn: { planetColor: '#0a2e1a', glowColor: 'rgba(0,229,160,0.15)', rings: 2, dotColor: '#00E5A0' },
    vtc: { planetColor: '#0a1a2e', glowColor: 'rgba(0,206,209,0.2)', rings: 3, dotColor: '#00CED1' },
    immobilier: { planetColor: '#2e2a0a', glowColor: 'rgba(212,160,23,0.2)', rings: 2, dotColor: '#D4A017' },
    health: { planetColor: '#0a2e0a', glowColor: 'rgba(74,222,128,0.15)', rings: 2, dotColor: '#4ade80' },
}

export default function OrbitalIllustration({ variant = 'landing' }: OrbitalProps) {
    const v = variants[variant]
    const ringSizes = variant === 'landing' ? [180, 300, 450] : variant === 'vtc' ? [120, 220, 340] : [160, 280]

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: 500, aspectRatio: '1', margin: '0 auto' }}>
            {/* Orbital rings */}
            {ringSizes.map((size, i) => (
                <motion.div
                    key={i}
                    animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                    transition={{ duration: 30 + i * 15, repeat: Infinity, ease: 'linear' }}
                    style={{
                        position: 'absolute', top: '50%', left: '50%',
                        width: size, height: size,
                        marginTop: -size / 2, marginLeft: -size / 2,
                        border: `1px ${i === ringSizes.length - 1 ? 'dashed' : 'solid'} rgba(255,255,255,0.05)`,
                        borderRadius: '50%',
                    }}
                />
            ))}

            {/* Central planet */}
            <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 120, height: 120, borderRadius: '50%',
                background: `radial-gradient(circle at 30% 30%, ${v.planetColor}, #050505)`,
                boxShadow: `0 0 60px ${v.glowColor}, inset 0 0 30px rgba(0,0,0,0.8)`,
            }}>
                {/* Inner glow line */}
                <div style={{
                    position: 'absolute', top: '20%', left: '50%',
                    transform: 'translateX(-50%)',
                    width: 3, height: '60%', borderRadius: 2,
                    background: `linear-gradient(transparent, ${v.dotColor}33, transparent)`,
                }} />
            </div>

            {/* Orbiting dot */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', top: '50%', left: '50%', width: ringSizes[0] + 40, height: ringSizes[0] + 40, marginTop: -(ringSizes[0] + 40) / 2, marginLeft: -(ringSizes[0] + 40) / 2 }}
            >
                <div style={{
                    position: 'absolute', top: 0, left: '50%',
                    width: 10, height: 10, borderRadius: '50%',
                    background: v.dotColor,
                    boxShadow: `0 0 15px ${v.dotColor}80`,
                    transform: 'translate(-50%, -50%)',
                }} />
            </motion.div>

            {/* Secondary orbiting dot */}
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', top: '50%', left: '50%', width: ringSizes[ringSizes.length - 1], height: ringSizes[ringSizes.length - 1], marginTop: -ringSizes[ringSizes.length - 1] / 2, marginLeft: -ringSizes[ringSizes.length - 1] / 2 }}
            >
                <div style={{
                    position: 'absolute', top: '50%', left: 0,
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.3)',
                    transform: 'translate(-50%, -50%)',
                }} />
            </motion.div>
        </div>
    )
}

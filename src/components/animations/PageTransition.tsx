import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { type ReactNode } from 'react'

const pageVariants: Variants = {
    initial: { opacity: 0, y: 30 },
    enter: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: { duration: 0.25 },
    },
}

const wipeVariants: Variants = {
    initial: { scaleX: 0 },
    animate: {
        scaleX: [0, 1, 1, 0],
        transition: {
            duration: 0.8,
            times: [0, 0.4, 0.6, 1],
            ease: [0.76, 0, 0.24, 1],
        },
    },
}

export default function PageTransition({ children }: { children: ReactNode }) {
    const location = useLocation()

    return (
        <>
            {/* Terracotta wipe overlay */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`wipe-${location.pathname}`}
                    variants={wipeVariants}
                    initial="initial"
                    animate="animate"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #C8641A, #D4A017)',
                        transformOrigin: 'left',
                        zIndex: 9990,
                        pointerEvents: 'none',
                    }}
                />
            </AnimatePresence>

            {/* Page content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={location.pathname}
                    variants={pageVariants}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    style={{ minHeight: '100vh' }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </>
    )
}

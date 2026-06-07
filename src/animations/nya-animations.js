/* ═══════════════════════════════════════
   NYA BLO — Central Animation System
   GSAP + Framer Motion presets
   ═══════════════════════════════════════ */
import gsap from 'gsap'

// ─── GSAP DEFAULTS ───
gsap.defaults({
    ease: 'power3.out',
    duration: 0.8,
})

// ─── PAGE TRANSITION ─── (ANIM-001, ANIM-002)
export const pageTransition = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
}

export const pageWipe = {
    initial: { scaleX: 0 },
    animate: { scaleX: 1, transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] } },
    exit: { scaleX: 0, transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] } },
}

// ─── STAGGER CHILDREN ─── (ANIM-002)
export const staggerContainer = {
    animate: {
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
}

export const staggerItem = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

// ─── CARD ANIMATIONS ─── (ANIM-033, ANIM-034)
export const cardReveal = {
    initial: { opacity: 0, rotateY: 15, scale: 0.95 },
    whileInView: { opacity: 1, rotateY: 0, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
    viewport: { once: true, margin: '-100px' },
}

export const cardHover = {
    whileHover: {
        y: -8,
        scale: 1.02,
        boxShadow: '0 20px 60px rgba(212,160,23,0.2)',
        transition: { duration: 0.3 },
    },
    whileTap: { scale: 0.98 },
}

// ─── SLIDE ANIMATIONS ───
export const slideFromLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export const slideFromRight = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export const slideFromBottom = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

// ─── FLOAT ANIMATION ─── (ANIM-007, ANIM-031)
export const floatAnimation = {
    animate: {
        y: [0, -20, 0],
        rotate: [0, 3, -3, 0],
        transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
    },
}

// ─── SCALE REVEAL ─── (ANIM-010)
export const scaleReveal = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] } },
}

// ─── TEXT REVEAL ─── (ANIM-026, ANIM-036)
export const textReveal = {
    initial: { clipPath: 'inset(0 100% 0 0)' },
    animate: { clipPath: 'inset(0 0% 0 0)', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
}

// ─── NAVBAR ─── (ANIM-013)
export const navbarAnim = {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 } },
}

// ─── SIDEBAR ─── (ANIM-021)
export const sidebarSpring = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
}

// ─── COUNTER ─── (ANIM-032)
export const animateCounter = (
    element: HTMLElement,
    target: number,
    duration: number = 2
) => {
    gsap.fromTo(
        element,
        { innerText: '0' },
        {
            innerText: target,
            duration,
            snap: { innerText: 1 },
            ease: 'power2.out',
        }
    )
}

// ─── SCROLL TRIGGER REVEAL ─── (ANIM-461+)
export const scrollRevealConfig = {
    start: 'top 85%',
    end: 'bottom 15%',
    toggleActions: 'play none none reverse',
}

// ─── BOUNCE ─── (ANIM-030)
export const bounceInfinite = {
    animate: {
        y: [0, -12, 0],
        transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
    },
}

// ─── MOBILE MENU ─── (ANIM-018)
export const mobileMenuVariants = {
    closed: {
        clipPath: 'circle(30px at calc(100% - 40px) 40px)',
        transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
    },
    open: {
        clipPath: 'circle(150% at calc(100% - 40px) 40px)',
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
}

export const mobileMenuItemVariants = {
    closed: { opacity: 0, x: 50, rotate: -10 },
    open: (i: number) => ({
        opacity: 1,
        x: 0,
        rotate: 0,
        transition: { delay: 0.1 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    }),
}

// ─── PULSE ─── (ANIM-054)
export const pulseScale = {
    animate: {
        scale: [1, 1.05, 1],
        transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
    },
}

// ─── WOBBLE ─── (ANIM-025)
export const wobble = {
    animate: {
        rotate: [0, -15, 12, -8, 5, 0],
        transition: { duration: 0.6, ease: 'easeInOut' },
    },
}

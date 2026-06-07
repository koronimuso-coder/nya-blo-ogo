import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useRef, useEffect, useState } from 'react'
import {
    ArrowUpRight, Mic, ChevronRight, ChevronDown, Mail,
    Store, GraduationCap, Car, Building2,
    Film, Briefcase, Gamepad2, Bot, Globe,
    Heart, FileText, Users, Zap, Star, Shield, Quote
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import ScrollProgress from '../components/animations/ScrollProgress'
import SacredGeometry from '../components/animations/SacredGeometry'
import SEOHead from '../components/SEOHead'

/* ─── 10 MODULES — exact reference content ─── */
const modules = [
    { id: 'O01', icon: Store, title: 'NYA BLO Market', desc: 'Échanges sacrés. Mode bogolan, or pur et technologie.', path: '/shop', color: '#B85C2E' },
    { id: 'O02', icon: Film, title: 'Toguna Stream', desc: "Le conseil des anciens en image. Cinéma africain futuriste.", path: '/media', color: '#ef4444' },
    { id: 'O03', icon: GraduationCap, title: 'École des Scribes', desc: 'Initiation à la connaissance. Langues et savoirs Dogon.', path: '/learn', color: '#00E5A0' },
    { id: 'O04', icon: FileText, title: 'Sceau du Destin', desc: "Forgez votre identité professionnelle via le CV Builder.", path: '/cv-builder', color: '#C2A888' },
    { id: 'O05', icon: Gamepad2, title: "Jeux d'Esprit", desc: "Défis stratégiques et puzzles ancestraux modernisés.", path: '/games', color: '#a78bfa' },
    { id: 'O06', icon: Bot, title: 'Laboratoire Nommo', desc: "Forge numérique d'IA pour manifester vos visions.", path: '/lab', color: '#FFD700' },
    { id: 'O07', icon: Heart, title: "Soins d'Amma", desc: "Bien-être et santé via la sagesse des plantes et tech.", path: '/health', color: '#4ade80' },
    { id: 'O08', icon: Briefcase, title: 'Conseil Sirius', desc: "Ventes privées, services pro et gouvernance de l'app.", path: '/pricing', color: '#D4A017' },
    { id: 'O09', icon: Car, title: 'VTC Sirius', desc: 'Transport premium avec chauffeurs certifiés Sirius.', path: '/vtc', color: '#00CED1' },
    { id: 'O10', icon: Building2, title: 'NYA Immobilier', desc: "Villas, bureaux et terrains à travers la Côte d'Ivoire.", path: '/immobilier', color: '#00CED1' },
]

const stats = [
    { value: '10K+', label: 'UTILISATEURS ACTIFS', icon: Users },
    { value: '500+', label: 'CHAUFFEURS SIRIUS', icon: Car },
    { value: '27', label: 'PRODUITS AU MARCHÉ', icon: Store },
    { value: '50ms', label: 'LATENCE GLOBALE', icon: Zap },
]

const techFeatures = [
    { icon: '⚡', title: 'WebGPU 3D', desc: 'RENDU TEMPS RÉEL 120 FPS' },
    { icon: '🌐', title: 'WebXR AR', desc: 'ESSAYAGE VIRTUEL NATIF' },
    { icon: '👗', title: 'Edge Dominance', desc: 'LATENCE MONDIALE < 50MS' },
]

const team = [
    { initial: 'D', name: 'DR. AMADOU NIAMKEY', role: 'CHIEF VISIONARY OFFICER (CVO)', desc: "Expert en IA et Anthropologue de la culture Dogon.", bg: '#B85C2E' },
    { initial: 'A', name: 'AWA DIABATÉ', role: 'HEAD OF SCRIBE ACADEMY', desc: "Championne de l'innovation digitale panafricaine.", bg: '#ef4444' },
    { initial: 'S', name: 'SULTAN KONE', role: 'LEAD ARCHITECT', desc: "Maître du code et gardien du Nexus Sirius.", bg: '#D4A017' },
]

const values = [
    { title: 'EXCELLENCE', desc: 'SCRIBES HAUTEMENT QUALIFIÉS.' },
    { title: 'INTÉGRITÉ', desc: "CODE GRAVÉ DANS L'ÉTHIQUE." },
    { title: 'SOUVERAINETÉ', desc: 'DONNÉES PROTÉGÉES PAR SIRIUS.' },
    { title: 'INNOVATION', desc: 'NEXUS ENTRE HIER ET DEMAIN.' },
]

const marqueeText = "LE SAVOIR EST UN TRÉSOR • L'INITIATION EST LE CHEMIN • SIRIUS VEILLE SUR NYA BLO • LA TRADITION EST LE FUTUR • "

/* ─── TESTIMONIALS ─── */
const testimonials = [
    { name: 'FATOU DIALLO', role: 'Entrepreneure, Abidjan', quote: 'NYA BLO a transformé ma façon de vendre en ligne. Le marché digital est incroyable, mes ventes ont triplé en 3 mois.', stars: 5, color: '#B85C2E' },
    { name: 'MOUSSA TRAORÉ', role: 'Chauffeur VTC Sirius', quote: 'Grâce à VTC Sirius, j\'ai trouvé une activité stable et bien rémunérée. L\'application est fluide et professionnelle.', stars: 5, color: '#00CED1' },
    { name: 'AMINATA KONATÉ', role: 'Étudiante, Bamako', quote: 'L\'École des Scribes m\'a permis d\'apprendre le développement web en bambara. C\'est une révolution pour l\'Afrique.', stars: 5, color: '#00E5A0' },
    { name: 'IBRAHIMA SANOGO', role: 'Agent immobilier', quote: 'NYA Immobilier centralise tout ce dont j\'ai besoin. La présentation des biens est magnifique et les clients adorent.', stars: 4, color: '#D4A017' },
    { name: 'DR. MARIAM CISSÉ', role: 'Pharmacienne, Bouaké', quote: 'Soins d\'Amma est exactement ce qu\'il fallait pour connecter la médecine traditionnelle et la technologie moderne.', stars: 5, color: '#4ade80' },
]

/* ─── FAQ ─── */
const faqItems = [
    { q: 'Qu\'est-ce que NYA BLO ?', a: 'NYA BLO est un écosystème numérique africain tout-en-un. Il regroupe un marketplace, un service VTC, une plateforme d\'apprentissage, un service immobilier, un espace santé, et bien d\'autres modules — le tout inspiré de la cosmogonie Dogon.' },
    { q: 'NYA BLO est-il gratuit ?', a: 'L\'accès de base à NYA BLO est entièrement gratuit. Des formules Premium et Business sont disponibles pour les utilisateurs et entreprises souhaitant accéder à des fonctionnalités avancées (voir notre page Tarification).' },
    { q: 'Comment devenir chauffeur VTC Sirius ?', a: 'Pour rejoindre le réseau VTC Sirius, rendez-vous sur la page VTC et remplissez le formulaire d\'inscription chauffeur. Après vérification de vos documents et une courte formation, vous serez certifié Sirius.' },
    { q: 'Mes données sont-elles protégées ?', a: 'Absolument. NYA BLO utilise un chiffrement TLS/SSL, ne vend jamais vos données à des tiers, et respecte les réglementations sur la protection des données personnelles en Côte d\'Ivoire. Consultez notre politique de confidentialité.' },
    { q: 'Dans quels pays NYA BLO est-il disponible ?', a: 'NYA BLO est actuellement disponible en Côte d\'Ivoire avec une expansion prévue vers le Sénégal, le Mali, le Burkina Faso et la Guinée courant 2026-2027.' },
    { q: 'Comment contacter le support ?', a: 'Vous pouvez nous joindre via WhatsApp (+225 07 08 73 68 71), par email (nyablo@outlook.com), ou directement via notre page Contact.' },
]

/* ─── PARTNERS / TRUST BADGES ─── */
const partners = [
    { name: 'Verified by Sirius', icon: Shield },
    { name: 'Made in Côte d\'Ivoire', icon: Globe },
    { name: 'WebGPU Powered', icon: Zap },
    { name: 'Chiffrement TLS', icon: Shield },
    { name: '10K+ Utilisateurs', icon: Users },
    { name: 'IA Oracle Engine', icon: Bot },
]

/* ─── ANIMATED COUNTER HOOK ─── */
function useAnimatedCounter(target: string, duration = 2000) {
    const [count, setCount] = useState('0')
    const ref = useRef<HTMLDivElement>(null)
    const [hasStarted, setHasStarted] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !hasStarted) {
                setHasStarted(true)
                const numeric = parseInt(target.replace(/[^0-9]/g, ''))
                const suffix = target.replace(/[0-9]/g, '')
                if (isNaN(numeric)) { setCount(target); return }
                const start = performance.now()
                const animate = (now: number) => {
                    const elapsed = now - start
                    const progress = Math.min(elapsed / duration, 1)
                    const eased = 1 - Math.pow(1 - progress, 3)
                    setCount(Math.floor(numeric * eased) + suffix)
                    if (progress < 1) requestAnimationFrame(animate)
                }
                requestAnimationFrame(animate)
            }
        }, { threshold: 0.5 })
        observer.observe(el)
        return () => observer.disconnect()
    }, [target, duration, hasStarted])

    return { count, ref }
}

export default function Landing() {
    const navigate = useNavigate()
    const { loginAsDemo } = useAuthStore()
    const { scrollYProgress } = useScroll()

    // Parallax transforms
    const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100])
    const orbitalScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8])
    const orbitalOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.3])

    const [openFaq, setOpenFaq] = useState<number | null>(null)
    const [newsletterEmail, setNewsletterEmail] = useState('')
    const [newsletterSubmitted, setNewsletterSubmitted] = useState(false)

    const handleNewsletter = (e: React.FormEvent) => {
        e.preventDefault()
        if (newsletterEmail && newsletterEmail.includes('@')) {
            setNewsletterSubmitted(true)
            setNewsletterEmail('')
            setTimeout(() => setNewsletterSubmitted(false), 4000)
        }
    }

    return (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
            <SEOHead />
            {/* ═══ COSMIC BACKGROUND LAYERS ═══ */}
            <Starfield />
            <CosmicBackground />
            <ScrollProgress />
            <Navbar />

            {/* ═══════════════════════ HERO ═══════════════════════ */}
            <section className="section-full nebula-section" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 120, paddingBottom: 60 }}>
                <div className="max-w-container" style={{ position: 'relative', zIndex: 2 }}>
                    <motion.div style={{ y: heroY, textAlign: 'center' }}>
                        {/* Cosmogonie label with staggered letter animation */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="cosmo-label"
                            style={{ justifyContent: 'center' }}
                        >
                            {'COSMOGONIE DOGON'.split('').map((char, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + i * 0.03 }}
                                >
                                    {char === ' ' ? '\u00A0' : char}
                                </motion.span>
                            ))}
                        </motion.div>

                        {/* Main heading with shimmer */}
                        <motion.h1
                            initial={{ opacity: 0, y: 60, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-shimmer ochre-pulse"
                            style={{ marginTop: 32, marginBottom: 40 }}
                        >
                            L'UNIVERS DOGON
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 0.6 }}
                            style={{
                                fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',
                                color: 'var(--text-muted)',
                                maxWidth: 600, margin: '0 auto 56px',
                                lineHeight: 1.8, fontWeight: 300,
                            }}
                        >
                            Ici, l'innovation tech rencontre la cosmologie Sirius. Une cité numérique bâtie sur les piliers de l'Héritage Ancestral.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1 }}
                            style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}
                        >
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: '0 16px 50px rgba(184,92,46,0.5)' }}
                                whileTap={{ scale: 0.95 }}
                                className="btn-primary"
                                onClick={() => navigate('/shop')}
                            >
                                ENTRER AU GRAND MARCHÉ <ArrowUpRight size={16} strokeWidth={3} />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn-secondary"
                                onClick={() => navigate('/learn')}
                            >
                                INSCRIS-TOI À L'ÉCOLE
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </div>

                {/* ─── ORBITAL SYSTEM with parallax ─── */}
                <motion.div style={{ marginTop: 80, position: 'relative', scale: orbitalScale, opacity: orbitalOpacity }}>
                    <div className="orbital-system" style={{ maxWidth: 600 }}>
                        {[180, 300, 450].map((size, i) => (
                            <motion.div
                                key={i}
                                className="orbital-ring"
                                style={{ width: size, height: size, borderColor: i === 1 ? 'rgba(184,92,46,0.08)' : undefined }}
                                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                                transition={{ duration: 40 + i * 20, repeat: Infinity, ease: 'linear' }}
                            />
                        ))}
                        {/* Core planet — glowing Sirius A */}
                        <motion.div
                            animate={{ boxShadow: ['0 0 60px rgba(212,160,23,0.1)', '0 0 100px rgba(212,160,23,0.25)', '0 0 60px rgba(212,160,23,0.1)'] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            style={{
                                position: 'absolute', top: '50%', left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 160, height: 160, borderRadius: '50%',
                                background: 'radial-gradient(circle at 30% 30%, #1a1a2e, #050505)',
                            }}
                        />
                        {/* Sirius B — orbiting white star */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                            style={{ position: 'absolute', top: '50%', left: '50%', width: 300, height: 300, marginTop: -150, marginLeft: -150 }}
                        >
                            <motion.div
                                animate={{ boxShadow: ['0 0 20px rgba(255,255,255,0.4)', '0 0 40px rgba(255,255,255,0.8)', '0 0 20px rgba(255,255,255,0.4)'] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                style={{
                                    position: 'absolute', top: '50%', left: '100%',
                                    transform: 'translate(-50%, -50%)',
                                    width: 20, height: 20, borderRadius: '50%',
                                    background: 'radial-gradient(circle, #fff, #e0e0ff)',
                                }}
                            />
                        </motion.div>
                        {/* Cyan orbiting dot */}
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
                            style={{ position: 'absolute', top: '50%', left: '50%', width: 400, height: 400, marginTop: -200, marginLeft: -200 }}
                        >
                            <div style={{
                                position: 'absolute', top: '30%', left: '5%',
                                width: 14, height: 14, borderRadius: '50%',
                                background: 'var(--nya-cyan-dot)',
                                boxShadow: '0 0 20px rgba(0,206,209,0.5)',
                            }} />
                        </motion.div>
                    </div>

                    {/* Sacred geometry ornament behind orbital */}
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: -1 }}>
                        <SacredGeometry size={700} opacity={0.04} />
                    </div>
                </motion.div>
            </section>

            {/* ═══════════════════════ STATS BAR ═══════════════════════ */}
            <div className="glow-separator" />
            <section style={{ padding: '60px var(--page-padding)' }}>
                <div className="max-w-container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, textAlign: 'center' }}>
                        {stats.map((stat, i) => {
                            const { count, ref } = useAnimatedCounter(stat.value)
                            const Icon = stat.icon
                            return (
                                <motion.div
                                    key={i}
                                    ref={ref}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 }}
                                >
                                    <Icon size={20} style={{ color: 'var(--nya-ochre)', marginBottom: 12, opacity: 0.6 }} />
                                    <div className="stat-number">{count}</div>
                                    <div className="accent-label" style={{ marginTop: 8 }}>{stat.label}</div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>
            <div className="glow-separator" />

            {/* ═══════════════════════ MARQUEE BANNER ═══════════════════════ */}
            <div style={{
                overflow: 'hidden', padding: '24px 0',
                borderTop: '1px solid var(--border-default)',
                borderBottom: '1px solid var(--border-default)',
            }}>
                <motion.div
                    animate={{ x: ['0%', '-50%'] }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    style={{
                        display: 'flex', whiteSpace: 'nowrap', gap: 0,
                        fontFamily: 'var(--font-display)', fontSize: '0.8rem',
                        fontWeight: 900, letterSpacing: '0.2em', color: 'var(--text-faint)',
                        textTransform: 'uppercase',
                    }}
                >
                    <span>{marqueeText.repeat(6)}</span>
                    <span>{marqueeText.repeat(6)}</span>
                </motion.div>
            </div>

            {/* ═══════════════════════ 10 MODULE CARDS ═══════════════════════ */}
            <section className="section-full section-dark nebula-section">
                <div className="max-w-container" style={{ position: 'relative', zIndex: 2 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ marginBottom: 60 }}
                    >
                        <div className="cosmo-label" style={{ marginBottom: 24 }}>ÉCOSYSTÈME SIRIUS</div>
                        <h2>NOS PILIERS<br /><span className="text-ochre">COSMIQUES</span></h2>
                    </motion.div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                        {modules.map((m, i) => (
                            <motion.div
                                key={m.id}
                                initial={{ opacity: 0, y: 50, rotateX: 10 }}
                                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                whileHover={{
                                    scale: 1.04,
                                    borderColor: `${m.color}40`,
                                    boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 30px ${m.color}15`,
                                }}
                                className="service-card"
                                onClick={() => navigate(m.path)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="accent-label" style={{ marginBottom: 8 }}>{m.id}</div>
                                <div className="card-icon">
                                    <m.icon size={28} style={{ color: m.color }} />
                                </div>
                                <div className="card-title">{m.title}</div>
                                <div className="card-desc">{m.desc}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ NOYAU SIRIUS IA ═══════════════════════ */}
            <section className="section-full glow-bg nebula-section">
                <div className="max-w-container" style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, alignItems: 'start' }}>
                        {/* Oracle AI Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="oracle-card"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h3 style={{ marginBottom: 8 }}>Noyau Sirius IA</h3>
                                <div className="accent-label" style={{ color: 'var(--nya-ochre)', marginBottom: 24 }}>
                                    SYSTÈME DE CONSCIENCE DISTRIBUÉ
                                </div>
                            </motion.div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                                <div className="accent-label">STATUT ORACLE</div>
                                <div className="oracle-status">
                                    <div className="dot" />
                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--nya-sirius)' }}>
                                        EN VEILLE
                                    </span>
                                </div>
                            </div>

                            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '1rem', lineHeight: 1.8, marginBottom: 32 }}>
                                "L'intelligence n'est pas seulement dans le code, elle est dans la résonance entre nos ancêtres et notre futur."
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(255,255,255,0.15)' }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    width: '100%', padding: '18px 32px', borderRadius: 'var(--radius-pill)',
                                    background: 'var(--nya-white)', color: 'var(--nya-black)',
                                    border: 'none', fontSize: '0.8rem', fontWeight: 800,
                                    letterSpacing: '0.12em', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                    fontFamily: 'var(--font-body)',
                                }}
                            >
                                <Mic size={16} /> DEMANDER AU CURATOR
                            </motion.button>
                        </motion.div>

                        {/* Tech features grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            {techFeatures.map((f, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + i * 0.12 }}
                                    whileHover={{ scale: 1.06, borderColor: 'var(--border-ochre)', boxShadow: '0 8px 32px rgba(184,92,46,0.1)' }}
                                    style={{
                                        padding: 32, background: 'var(--bg-surface)',
                                        border: '1px solid var(--border-default)',
                                        borderRadius: 'var(--radius-lg)', textAlign: 'center',
                                        cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                                    }}
                                >
                                    <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
                                    <div style={{
                                        fontFamily: 'var(--font-display)', fontSize: '1.1rem',
                                        fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8,
                                    }}>
                                        {f.title}
                                    </div>
                                    <div className="accent-label">{f.desc}</div>
                                </motion.div>
                            ))}

                            {/* See more card */}
                            <motion.div
                                whileHover={{ scale: 1.04, borderColor: 'var(--border-ochre)' }}
                                onClick={() => navigate('/services')}
                                style={{
                                    padding: 32, background: 'var(--bg-surface)',
                                    border: '1px solid var(--border-default)',
                                    borderRadius: 'var(--radius-lg)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    cursor: 'pointer', gridColumn: 'span 2',
                                    transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                                }}
                            >
                                <span style={{
                                    fontFamily: 'var(--font-display)', fontSize: '1.3rem',
                                    fontWeight: 900, letterSpacing: '-0.02em',
                                }}>
                                    VOIR PLUS
                                </span>
                                <ChevronRight size={20} />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ DOGON PROVERB ═══════════════════════ */}
            <div className="dogon-border" />
            <section style={{ padding: '80px var(--page-padding)', textAlign: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="max-w-container max-w-narrow mx-auto"
                >
                    <motion.div
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        style={{ fontSize: 32, marginBottom: 24 }}
                    >
                        ✦
                    </motion.div>
                    <p style={{
                        fontFamily: 'var(--font-accent)',
                        fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                        color: 'var(--text-faint)',
                        lineHeight: 1.6,
                        fontStyle: 'italic',
                    }}>
                        « Celui qui sait d'où il vient sait où il va. La lumière de Sirius éclaire le chemin. »
                    </p>
                    <div className="accent-label" style={{ marginTop: 24, color: 'var(--nya-ochre)' }}>
                        — PROVERBE DOGON
                    </div>
                </motion.div>
            </section>
            <div className="dogon-border" />

            {/* ═══════════════════════ VISION + TEAM ═══════════════════════ */}
            <section className="section-full nebula-section">
                <div className="max-w-container" style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 60, alignItems: 'start' }}>
                        {/* Vision */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <h2 style={{ marginBottom: 8 }}>
                                NOTRE VISION<br />
                                <span className="text-ochre">QUANTIQUE</span>
                            </h2>
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: 60 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                style={{ height: 3, background: 'var(--nya-ochre)', borderRadius: 2, marginBottom: 40 }}
                            />

                            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: 48 }}>
                                NYA BLO n'est pas qu'une application, c'est une <strong style={{ color: 'var(--text-primary)' }}>infrastructure de souveraineté</strong>. Notre mission est d'unir la puissance de l'Intelligence Artificielle à la profondeur des sagesses africaines pour offrir des services qui résonnent avec notre identité.
                            </p>

                            <div className="values-grid">
                                {values.map((v, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 + i * 0.12 }}
                                        className="value-item"
                                        whileHover={{ x: 8 }}
                                    >
                                        <div className="value-title">{v.title}</div>
                                        <div className="value-desc">{v.desc}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Team */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="toguna-glass"
                            style={{ padding: 48 }}
                        >
                            <h3 style={{ marginBottom: 8 }}>LE CONSEIL DE DIRECTION</h3>
                            <div className="accent-label" style={{ color: 'var(--nya-ochre)', marginBottom: 32 }}>
                                GARDIENS DU NEXUS
                            </div>

                            {team.map((m, i) => (
                                <motion.div
                                    key={i}
                                    className="team-member"
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + i * 0.15 }}
                                    whileHover={{ x: 6, transition: { duration: 0.2 } }}
                                >
                                    <motion.div
                                        className="team-avatar"
                                        style={{ background: m.bg, color: 'var(--text-primary)' }}
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                    >
                                        {m.initial}
                                    </motion.div>
                                    <div>
                                        <div className="team-name">{m.name}</div>
                                        <div className="team-role">{m.role}</div>
                                        <div className="team-desc">{m.desc}</div>
                                    </div>
                                </motion.div>
                            ))}

                            <div style={{ marginTop: 24, padding: '12px 0', borderTop: '1px solid var(--border-default)', textAlign: 'center' }}>
                                <span className="accent-label">Propulsé par les alliances galactiques</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ TESTIMONIALS ═══════════════════════ */}
            <div className="glow-separator" />
            <section className="section-full nebula-section">
                <div className="max-w-container" style={{ position: 'relative', zIndex: 2 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ marginBottom: 60, textAlign: 'center' }}
                    >
                        <div className="cosmo-label" style={{ justifyContent: 'center', marginBottom: 24 }}>VOIX DE LA COMMUNAUTÉ</div>
                        <h2>TÉMOIGNAGES<br /><span className="text-ochre">DU NEXUS</span></h2>
                    </motion.div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                whileHover={{ scale: 1.03, borderColor: `${t.color}40` }}
                                style={{
                                    padding: '36px 32px',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border-default)',
                                    borderRadius: 'var(--radius-xl)',
                                    transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                                    position: 'relative',
                                }}
                            >
                                <Quote size={28} style={{ color: t.color, opacity: 0.3, marginBottom: 16 }} />
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: 24, fontStyle: 'italic' }}>
                                    "{t.quote}"
                                </p>
                                <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                                    {[...Array(5)].map((_, s) => (
                                        <Star key={s} size={14} fill={s < t.stars ? t.color : 'transparent'} style={{ color: s < t.stars ? t.color : 'var(--border-hover)' }} />
                                    ))}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: '50%',
                                        background: t.color, display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 900, fontSize: '0.9rem', color: '#fff',
                                    }}>
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                            {t.name}
                                        </div>
                                        <div className="accent-label" style={{ color: t.color }}>{t.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ FAQ ═══════════════════════ */}
            <div className="glow-separator" />
            <section className="section-full section-dark">
                <div className="max-w-container" style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 2 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ marginBottom: 60, textAlign: 'center' }}
                    >
                        <div className="cosmo-label" style={{ justifyContent: 'center', marginBottom: 24 }}>ORACLE DES RÉPONSES</div>
                        <h2>QUESTIONS<br /><span className="text-ochre">FRÉQUENTES</span></h2>
                    </motion.div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {faqItems.map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.06 }}
                                style={{
                                    border: '1px solid var(--border-default)',
                                    borderRadius: 'var(--radius-lg)',
                                    overflow: 'hidden',
                                    background: 'var(--bg-card)',
                                    transition: 'border-color 0.3s',
                                    borderColor: openFaq === i ? 'var(--border-ochre)' : undefined,
                                }}
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    style={{
                                        width: '100%', padding: '24px 28px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        fontFamily: 'var(--font-display)', fontSize: '1.05rem',
                                        fontWeight: 900, textTransform: 'uppercase',
                                        letterSpacing: '-0.01em',
                                        color: openFaq === i ? 'var(--nya-ochre)' : 'var(--text-primary)',
                                        textAlign: 'left', gap: 16, transition: 'color 0.3s',
                                    }}
                                >
                                    <span>{faq.q}</span>
                                    <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                        <ChevronDown size={20} style={{ flexShrink: 0, color: 'var(--nya-ochre)' }} />
                                    </motion.div>
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                        >
                                            <div style={{ padding: '0 28px 24px', color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.8 }}>
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ PARTNERS ═══════════════════════ */}
            <section style={{ padding: '60px var(--page-padding)' }}>
                <div className="max-w-container">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        style={{ textAlign: 'center', marginBottom: 40 }}
                    >
                        <div className="accent-label">ILS FONT CONFIANCE AU NEXUS</div>
                    </motion.div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: 16,
                    }}>
                        {partners.map((p, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                style={{
                                    display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', gap: 10,
                                    padding: '24px 16px',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid var(--border-default)',
                                    background: 'var(--bg-surface)',
                                    transition: 'border-color 0.3s',
                                }}
                            >
                                <p.icon size={22} style={{ color: 'var(--nya-ochre)', opacity: 0.5 }} />
                                <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-faint)', textAlign: 'center' }}>
                                    {p.name}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ NEWSLETTER ═══════════════════════ */}
            <div className="glow-separator" />
            <section className="section-full" style={{ textAlign: 'center' }}>
                <div className="max-w-container max-w-narrow mx-auto" style={{ position: 'relative', zIndex: 2 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="cosmo-label" style={{ justifyContent: 'center', marginBottom: 24 }}>TRANSMISSION SIRIUS</div>
                        <h2 style={{ marginBottom: 16 }}>REJOINS LA<br /><span className="text-ochre">COMMUNAUTÉ</span></h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.8, marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>
                            Reçois les dernières nouvelles de l'écosystème, des offres exclusives et les mises à jour des modules directement dans ta boîte.
                        </p>

                        {newsletterSubmitted ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{ color: 'var(--nya-sirius)', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em' }}
                            >
                                ✦ INSCRIPTION CONFIRMÉE — BIENVENUE DANS LE NEXUS ✦
                            </motion.div>
                        ) : (
                            <form onSubmit={handleNewsletter} style={{
                                display: 'flex', gap: 12, justifyContent: 'center',
                                flexWrap: 'wrap', maxWidth: 500, margin: '0 auto',
                            }}>
                                <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
                                    <Mail size={16} style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
                                    <input
                                        type="email"
                                        value={newsletterEmail}
                                        onChange={e => setNewsletterEmail(e.target.value)}
                                        placeholder="ton@email.com"
                                        required
                                        style={{
                                            width: '100%', padding: '16px 20px 16px 44px',
                                            background: 'var(--bg-surface)',
                                            border: '1px solid var(--border-default)',
                                            borderRadius: 'var(--radius-pill)',
                                            color: 'var(--text-primary)',
                                            fontSize: '0.88rem',
                                            fontFamily: 'var(--font-body)',
                                            outline: 'none',
                                            transition: 'border-color 0.3s',
                                        }}
                                        onFocus={e => e.target.style.borderColor = 'var(--nya-ochre)'}
                                        onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
                                    />
                                </div>
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(184,92,46,0.4)' }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn-primary"
                                >
                                    S'INSCRIRE
                                </motion.button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </section>
            <div className="glow-separator" />

            {/* ═══════════════════════ CTA FINAL ═══════════════════════ */}
            <section className="section-full nebula-section" style={{ textAlign: 'center' }}>
                <div className="max-w-container max-w-narrow mx-auto" style={{ position: 'relative', zIndex: 2 }}>
                    {/* Sacred geometry behind CTA */}
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: -1 }}>
                        <SacredGeometry size={500} opacity={0.03} />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="cosmo-label" style={{ justifyContent: 'center', marginBottom: 24 }}>REJOINDRE LE NEXUS</div>
                        <h2 className="text-shimmer" style={{ marginBottom: 24 }}>
                            ENTRE DANS<br />
                            L'UNIVERS
                        </h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: 48, fontSize: '1.05rem', lineHeight: 1.8 }}>
                            Nya Blo n'est pas une app. C'est un univers entier, inspiré de la cosmogonie Dogon, construit pour l'Afrique qui crée.
                        </p>
                        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: '0 16px 50px rgba(184,92,46,0.5)' }}
                                whileTap={{ scale: 0.95 }}
                                className="btn-primary"
                                onClick={() => { loginAsDemo(); navigate('/') }}
                            >
                                ACCÈS NEXUS PORTAL <ArrowUpRight size={16} strokeWidth={3} />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn-secondary"
                                onClick={() => navigate('/register')}
                            >
                                CRÉER UN COMPTE
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <Footer />

            {/* Grain */}
            <div className="grain-overlay" />
        </div>
    )
}

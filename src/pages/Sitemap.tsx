import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
    Store, GraduationCap, Car, Building2, Cross,
    Bot, Gamepad2, Film, FileText, Heart,
    Briefcase, Map, Wrench, Users, Shield, LogIn
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'

const sitemapGroups = [
    {
        title: 'MODULES PRINCIPAUX',
        icon: Store,
        links: [
            { label: 'NYA BLO Market', path: '/shop', icon: Store },
            { label: 'École des Scribes', path: '/learn', icon: GraduationCap },
            { label: 'VTC Sirius', path: '/vtc', icon: Car },
            { label: 'NYA Immobilier', path: '/immobilier', icon: Building2 },
            { label: 'Soins d\'Amma', path: '/health', icon: Cross },
        ],
    },
    {
        title: 'OUTILS & SERVICES',
        icon: Wrench,
        links: [
            { label: 'Laboratoire Nommo (IA)', path: '/lab', icon: Bot },
            { label: 'Jeux d\'Esprit', path: '/games', icon: Gamepad2 },
            { label: 'Toguna Stream', path: '/media', icon: Film },
            { label: 'Sceau du Destin (CV)', path: '/cv-builder', icon: FileText },
        ],
    },
    {
        title: 'ENTREPRISE',
        icon: Briefcase,
        links: [
            { label: 'À Propos', path: '/about', icon: Heart },
            { label: 'Nos Services', path: '/services', icon: Briefcase },
            { label: 'Tarification', path: '/pricing', icon: Briefcase },
            { label: 'Contact', path: '/contact', icon: Users },
        ],
    },
    {
        title: 'COMPTE',
        icon: LogIn,
        links: [
            { label: 'Connexion', path: '/login', icon: LogIn },
            { label: 'Inscription', path: '/register', icon: Users },
        ],
    },
    {
        title: 'LÉGAL',
        icon: Shield,
        links: [
            { label: 'Mentions Légales', path: '/mentions-legales', icon: Shield },
            { label: 'Confidentialité', path: '/privacy', icon: Shield },
            { label: 'FAQ', path: '/faq', icon: Map },
        ],
    },
]

export default function Sitemap() {
    const navigate = useNavigate()

    return (
        <div style={{ position: 'relative' }}>
            <Starfield />
            <CosmicBackground />
            <Navbar />

            <section className="section-full nebula-section" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 2 }}>
                    <div className="cosmo-label" style={{ justifyContent: 'center', marginBottom: 24 }}>NAVIGATION</div>
                    <h1 style={{ marginBottom: 16 }}>PLAN DU <span className="text-ochre">SITE</span></h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 500, margin: '0 auto' }}>
                        Toutes les pages de l'écosystème NYA BLO, organisées pour vous.
                    </p>
                </motion.div>
            </section>
            <div className="glow-separator" />

            <section className="section-full">
                <div className="max-w-container" style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 32 }}>
                        {sitemapGroups.map((group, gi) => (
                            <motion.div
                                key={group.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: gi * 0.1 }}
                                style={{
                                    padding: 32,
                                    background: 'var(--bg-surface)',
                                    border: '1px solid var(--border-default)',
                                    borderRadius: 'var(--radius-xl)',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                                    <group.icon size={20} style={{ color: 'var(--nya-ochre)' }} />
                                    <div style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: '0.9rem', fontWeight: 900,
                                        letterSpacing: '0.05em',
                                    }}>{group.title}</div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {group.links.map((link) => (
                                        <motion.div
                                            key={link.path}
                                            whileHover={{ x: 6, color: 'var(--nya-ochre)' }}
                                            onClick={() => navigate(link.path)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 10,
                                                padding: '8px 0', cursor: 'pointer',
                                                color: 'var(--text-muted)',
                                                fontSize: '0.85rem', fontWeight: 500,
                                                transition: 'color 0.2s',
                                            }}
                                        >
                                            <link.icon size={14} style={{ opacity: 0.5 }} />
                                            {link.label}
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
            <div className="grain-overlay" />
        </div>
    )
}

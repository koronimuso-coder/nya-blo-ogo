import { motion } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { Store, GraduationCap, Car, Building2, Cross, Bot, Film, Gamepad2, FileText, Palette } from 'lucide-react'

const services = [
    { icon: Store, title: 'NYA BLO Market', desc: 'Marketplace panafricaine. Artisanat, tech, mode bogolan, or pur. Livraison Sirius.', color: '#B85C2E' },
    { icon: GraduationCap, title: 'École des Scribes', desc: "Formations en IA, fullstack, leadership, blockchain. Certifications Dogon.", color: '#00E5A0' },
    { icon: Car, title: 'NYA VTC', desc: 'Transport premium. Chauffeurs certifiés Sirius. Arrivée en 2 minutes.', color: '#D4A017' },
    { icon: Building2, title: 'NYA Immobilier', desc: "5000+ propriétés en Côte d'Ivoire. Visite 360°, simulation prêt.", color: '#00CED1' },
    { icon: Cross, title: "Soins d'Amma", desc: 'Téléconsultation, pharmacies de garde, urgences Sirius, bien-être.', color: '#4ade80' },
    { icon: Bot, title: 'Lab Nommo (IA)', desc: "Forge d'intelligence artificielle. Génération de contenu, images, code.", color: '#FFD700' },
    { icon: Film, title: 'Toguna Stream', desc: 'Streaming cinéma et séries africaines. Contenu exclusif Sirius.', color: '#ef4444' },
    { icon: Gamepad2, title: "Jeux d'Esprit", desc: 'Défis stratégiques et puzzles ancestraux. Compétitions classées.', color: '#a78bfa' },
    { icon: FileText, title: 'Sceau du Destin', desc: 'CV Builder IA. Créez votre identité professionnelle en minutes.', color: '#C2A888' },
    { icon: Palette, title: 'Branding IA', desc: 'Logos, sites web en 24h, vidéos courtes, gestion réseaux sociaux.', color: '#B85C2E' },
]

export default function Services() {
    return (
        <div>
            <Navbar />

            <section className="section-full" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="cosmo-label" style={{ justifyContent: 'center', marginBottom: 24 }}>ÉCOSYSTÈME SIRIUS</div>
                    <h1 style={{ marginBottom: 32 }}>NOS<br />SERVICES</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: 600, margin: '0 auto' }}>
                        Tout l'univers NYA BLO en un seul lieu. Découvrez nos 10 modules cosmiques.
                    </p>
                </motion.div>
            </section>

            <section className="section-full section-dark">
                <div className="max-w-container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
                        {services.map((s, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                                whileHover={{ scale: 1.02, borderColor: 'var(--border-ochre)' }} className="service-card">
                                <s.icon size={32} style={{ color: s.color, marginBottom: 16 }} />
                                <div className="card-title">{s.title}</div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, marginTop: 8 }}>{s.desc}</p>
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

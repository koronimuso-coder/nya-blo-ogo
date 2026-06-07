import { motion } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { Target, Shield, Rocket, Heart } from 'lucide-react'

const milestones = [
    { year: '2024', title: 'Genèse', desc: "Naissance de l'idée NYA BLO à Abidjan." },
    { year: '2025', title: 'Nexus Alpha', desc: 'Lancement des modules Market, VTC et Académie.' },
    { year: '2026', title: 'Expansion Sirius', desc: "Déploiement de l'IA Oracle et ouverture internationale." },
]

const coreValues = [
    { icon: Target, title: 'MISSION', desc: 'Unir la puissance de l\'IA à la profondeur des sagesses africaines pour créer un écosystème numérique souverain.' },
    { icon: Shield, title: 'VISION', desc: "Devenir la première cité numérique africaine, connectant 50 millions d'utilisateurs d'ici 2030." },
    { icon: Heart, title: 'VALEURS', desc: 'Excellence, Intégrité, Souveraineté des données, Innovation ancestrale.' },
    { icon: Rocket, title: 'IMPACT', desc: "Plus de 10 000 entrepreneurs accompagnés, 500 chauffeurs VTC actifs, 200 propriétés répertoriées." },
]

const founders = [
    { name: 'DR. AMADOU NIAMKEY', role: 'Fondateur & CVO', desc: "Expert en IA et Anthropologue de la culture Dogon. Architecte du Nexus Sirius.", color: '#B85C2E' },
    { name: 'AWA DIABATÉ', role: 'Co-fondatrice & Head of Academy', desc: "Championne de l'innovation digitale panafricaine et pédagogie tech.", color: '#ef4444' },
    { name: 'SULTAN KONE', role: 'CTO & Lead Architect', desc: "Maître du code, gardien du Nexus Sirius. Full-stack & blockchain.", color: '#D4A017' },
    { name: 'MARIAM TOURÉ', role: 'Head of Design', desc: "Directrice artistique, experte en design afrofuturiste et UX cosmique.", color: '#00E5A0' },
]

export default function About() {
    return (
        <div>
            <Navbar />

            {/* Hero */}
            <section className="section-full" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="cosmo-label" style={{ justifyContent: 'center', marginBottom: 24 }}>COSMOGONIE DOGON</div>
                    <h1 style={{ marginBottom: 32 }}>À PROPOS<br />DE NYA BLO</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: 600, margin: '0 auto' }}>
                        Une cité numérique bâtie sur les piliers de l'Héritage Ancestral et de l'Innovation technologique.
                    </p>
                </motion.div>
            </section>

            {/* Core values */}
            <section className="section-full section-dark">
                <div className="max-w-container">
                    <div className="cosmo-label" style={{ marginBottom: 24 }}>NOS FONDATIONS</div>
                    <h2 style={{ marginBottom: 48 }}>PILIERS <span className="text-ochre">COSMIQUES</span></h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                        {coreValues.map((v, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="service-card">
                                <v.icon size={28} style={{ color: 'var(--nya-ochre)', marginBottom: 16 }} />
                                <div className="card-title">{v.title}</div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.7, marginTop: 8 }}>{v.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="section-full">
                <div className="max-w-container" style={{ maxWidth: 700, margin: '0 auto' }}>
                    <div className="cosmo-label" style={{ marginBottom: 24 }}>CHRONOLOGIE</div>
                    <h2 style={{ marginBottom: 48 }}>NOTRE <span className="text-ochre">HISTOIRE</span></h2>
                    {milestones.map((m, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                            style={{ display: 'flex', gap: 32, marginBottom: 40, paddingBottom: 40, borderBottom: '1px solid var(--border-default)' }}>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, color: 'var(--nya-ochre)', flexShrink: 0, lineHeight: 1 }}>{m.year}</div>
                            <div>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 900, marginBottom: 8 }}>{m.title}</div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{m.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Team */}
            <section className="section-full section-dark">
                <div className="max-w-container">
                    <div className="cosmo-label" style={{ marginBottom: 24 }}>GARDIENS DU NEXUS</div>
                    <h2 style={{ marginBottom: 48 }}>NOTRE <span className="text-ochre">ÉQUIPE</span></h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                        {founders.map((f, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="service-card">
                                <div style={{ width: 56, height: 56, borderRadius: '50%', background: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.2rem', marginBottom: 16 }}>
                                    {f.name[0]}
                                </div>
                                <div className="card-title" style={{ fontSize: '1rem' }}>{f.name}</div>
                                <div className="accent-label" style={{ color: 'var(--nya-ochre)', marginBottom: 8 }}>{f.role}</div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.6 }}>{f.desc}</p>
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

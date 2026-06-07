import { motion } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { Play, Star, Clock } from 'lucide-react'

const categories = ['Tous', 'Films', 'Séries', 'Documentaires', 'Court-métrages', 'Animation', 'Musique']

const content = [
    { title: 'Le Dernier Griot', genre: 'Drame', year: '2026', rating: '4.8', duration: '2h15' },
    { title: 'Abidjan 2050', genre: 'Sci-Fi', year: '2025', rating: '4.6', duration: '1h48' },
    { title: 'Les Masques Dansants', genre: 'Documentaire', year: '2025', rating: '4.9', duration: '1h20' },
    { title: "L'Étoile de Sirius", genre: 'Animation', year: '2026', rating: '4.7', duration: '1h35' },
    { title: 'Falaise Rouge', genre: 'Thriller', year: '2024', rating: '4.4', duration: '2h05' },
    { title: 'Nommo Rising', genre: 'Action', year: '2026', rating: '4.5', duration: '2h20' },
    { title: 'La Sagesse du Baobab', genre: 'Documentaire', year: '2025', rating: '4.8', duration: '55min' },
    { title: 'Djembe Symphony', genre: 'Musique', year: '2025', rating: '4.9', duration: '1h10' },
]

export default function Media() {
    return (
        <div>
            <Navbar />

            <section className="section-full" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="cosmo-label" style={{ justifyContent: 'center', marginBottom: 24 }}>TOGUNA STREAM</div>
                    <h1 style={{ marginBottom: 32 }}>CINÉMA<br />COSMIQUE</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: 600, margin: '0 auto' }}>
                        Le conseil des anciens en image. Cinéma africain futuriste et contenus exclusifs Sirius.
                    </p>
                </motion.div>
            </section>

            {/* Category bar */}
            <section style={{ padding: '0 var(--page-padding)', marginBottom: 40 }}>
                <div className="max-w-container">
                    <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
                        {categories.map((cat, i) => (
                            <motion.button key={cat} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                style={{
                                    padding: '10px 24px', borderRadius: 'var(--radius-pill)', whiteSpace: 'nowrap',
                                    background: i === 0 ? 'var(--nya-ochre)' : 'var(--bg-surface)',
                                    color: i === 0 ? '#FFFFFF' : 'var(--text-muted)',
                                    border: i === 0 ? 'none' : '1px solid var(--border-subtle)',
                                    fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' as const,
                                    cursor: 'pointer', fontFamily: 'var(--font-body)',
                                }}>{cat}</motion.button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content grid */}
            <section className="section-full section-dark">
                <div className="max-w-container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                        {content.map((c, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                                whileHover={{ scale: 1.02, borderColor: 'var(--border-ochre)' }} className="service-card" style={{ cursor: 'pointer' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                    <span className="accent-label" style={{ background: 'rgba(239,68,68,0.1)', padding: '4px 12px', borderRadius: 'var(--radius-pill)' }}>{c.genre}</span>
                                    <Play size={18} style={{ color: 'var(--nya-ochre)', opacity: 0.5 }} />
                                </div>
                                <div className="card-title" style={{ fontSize: '1.1rem' }}>{c.title}</div>
                                <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                                    <span className="accent-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Star size={10} /> {c.rating}</span>
                                    <span className="accent-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={10} /> {c.duration}</span>
                                    <span className="accent-label">{c.year}</span>
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

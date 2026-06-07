import { motion } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { Gamepad2, Trophy, Brain, Swords, Puzzle, Timer } from 'lucide-react'

const games = [
    { icon: Brain, title: 'Échiquier Cosmique', desc: 'Échecs revisités avec des pièces Dogon. Classement ELO Sirius.', players: '12K+', difficulty: 'Intermédiaire' },
    { icon: Puzzle, title: 'Puzzle de Bandiagara', desc: 'Reconstituez les fresques ancestrales. 200 niveaux.', players: '8K+', difficulty: 'Tous niveaux' },
    { icon: Swords, title: 'Duel des Scribes', desc: 'Quiz de culture générale africaine. Modes solo et multijoueur.', players: '25K+', difficulty: 'Variable' },
    { icon: Timer, title: 'Sprint Nommo', desc: "Course contre la montre. Résolvez des énigmes mathématiques ancestrales.", players: '6K+', difficulty: 'Avancé' },
    { icon: Gamepad2, title: "L'Aventure du Griot", desc: 'RPG narratif à travers les royaumes africains. 40h de jeu.', players: '15K+', difficulty: 'Intermédiaire' },
    { icon: Trophy, title: 'Tournoi Sirius', desc: 'Compétitions hebdomadaires. Gagnez des récompenses FCFA.', players: '3K+', difficulty: 'Expert' },
]

export default function Games() {
    return (
        <div>
            <Navbar />

            <section className="section-full" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="cosmo-label" style={{ justifyContent: 'center', marginBottom: 24 }}>JEUX D'ESPRIT</div>
                    <h1 style={{ marginBottom: 32 }}>DÉFIS<br />ANCESTRAUX</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: 600, margin: '0 auto' }}>
                        Défis stratégiques et puzzles ancestraux modernisés. Affûtez votre esprit.
                    </p>
                </motion.div>
            </section>

            <section className="section-full section-dark">
                <div className="max-w-container">
                    <div className="cosmo-label" style={{ marginBottom: 24 }}>CATALOGUE DE JEUX</div>
                    <h2 style={{ marginBottom: 48 }}>CHOISISSEZ <span className="text-ochre">VOTRE DÉFI</span></h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
                        {games.map((g, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                                whileHover={{ scale: 1.02, borderColor: 'var(--border-ochre)' }} className="service-card" style={{ cursor: 'pointer' }}>
                                <g.icon size={28} style={{ color: '#a78bfa', marginBottom: 16 }} />
                                <div className="card-title" style={{ fontSize: '1.1rem' }}>{g.title}</div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.6, marginTop: 8, marginBottom: 12 }}>{g.desc}</p>
                                <div style={{ display: 'flex', gap: 16 }}>
                                    <span className="accent-label">{g.players} joueurs</span>
                                    <span className="accent-label" style={{ color: 'var(--nya-ochre)' }}>{g.difficulty}</span>
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

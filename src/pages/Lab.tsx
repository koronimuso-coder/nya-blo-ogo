import { motion } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { Bot, Wand2, ImageIcon, Code, FileText, MessageSquare, ArrowUpRight } from 'lucide-react'

const tools = [
    { icon: Wand2, title: 'Génération de Texte', desc: 'Articles, emails, discours, scripts marketing. IA optimisée pour le français africain.', label: 'TEXTE' },
    { icon: ImageIcon, title: "Création d'Images", desc: "Générez des visuels afrofuturistes, logos, mockups et illustrations par IA.", label: 'IMAGE' },
    { icon: Code, title: 'Assistance Code', desc: 'Génération de code, debugging, refactoring. Support Next.js, Python, React.', label: 'CODE' },
    { icon: FileText, title: 'Documents IA', desc: 'Business plans, contrats, présentations automatisées.', label: 'DOCUMENTS' },
    { icon: MessageSquare, title: 'Oracle Conversationnel', desc: "Posez n'importe quelle question à l'Oracle Sirius. Réponses contextuelles.", label: 'CHAT' },
    { icon: Bot, title: 'Agents Autonomes', desc: "Automatisez vos tâches avec des agents IA personnalisés.", label: 'AGENTS' },
]

export default function Lab() {
    return (
        <div>
            <Navbar />

            <section className="section-full" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="cosmo-label" style={{ justifyContent: 'center', marginBottom: 24 }}>INTELLIGENCE ANCESTRALE</div>
                    <h1 style={{ marginBottom: 32 }}>LABORATOIRE<br />NOMMO</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: 600, margin: '0 auto' }}>
                        Forge numérique d'IA pour manifester vos visions. Propulsé par le Noyau Sirius.
                    </p>
                </motion.div>
            </section>

            <section className="section-full section-dark">
                <div className="max-w-container">
                    <div className="cosmo-label" style={{ marginBottom: 24 }}>OUTILS DISPONIBLES</div>
                    <h2 style={{ marginBottom: 48 }}>FORGE <span className="text-ochre">NUMÉRIQUE</span></h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
                        {tools.map((t, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                                whileHover={{ scale: 1.02, borderColor: 'var(--border-ochre)' }} className="service-card" style={{ cursor: 'pointer' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                    <t.icon size={28} style={{ color: '#FFD700' }} />
                                    <span className="accent-label">{t.label}</span>
                                </div>
                                <div className="card-title" style={{ fontSize: '1.1rem' }}>{t.title}</div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.6, marginTop: 8 }}>{t.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Prompt bar */}
            <section className="section-full" style={{ textAlign: 'center' }}>
                <div className="max-w-container max-w-narrow mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h3 style={{ marginBottom: 24 }}>ESSAYEZ <span className="text-ochre">L'ORACLE</span></h3>
                        <div style={{ display: 'flex', gap: 8, maxWidth: 600, margin: '0 auto' }}>
                            <input placeholder="Posez votre question à l'Oracle Sirius..." style={{
                                flex: 1, padding: '16px 24px', borderRadius: 'var(--radius-pill)',
                                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                                color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontSize: '0.85rem', outline: 'none',
                            }} />
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary" style={{ padding: '16px 24px' }}>
                                <ArrowUpRight size={18} />
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
            <div className="grain-overlay" />
        </div>
    )
}

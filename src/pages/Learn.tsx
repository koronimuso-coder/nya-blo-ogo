import { motion } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import ScrollProgress from '../components/animations/ScrollProgress'
import { GraduationCap, Clock, Users, Star, BookOpen, Award, Zap } from 'lucide-react'

const courses = [
    { id: 'SCR-01', title: "Maîtrise de l'IA Générative", master: 'Dr. Amadou Niamkey', duration: '40h', students: '2.3K', level: 'Avancé', rating: 4.9, gradient: 'linear-gradient(135deg, #0a0a2e 0%, #FFD700 100%)', modules: 12 },
    { id: 'SCR-02', title: 'Fullstack React/Node Sirius', master: 'Sultan Kone', duration: '60h', students: '3.1K', level: 'Intermédiaire', rating: 4.8, gradient: 'linear-gradient(135deg, #050520 0%, #00E5A0 100%)', modules: 18 },
    { id: 'SCR-03', title: 'Blockchain & Smart Contracts', master: 'Bakary Traoré', duration: '35h', students: '1.5K', level: 'Avancé', rating: 4.7, gradient: 'linear-gradient(135deg, #0a1a2e 0%, #3b82f6 100%)', modules: 10 },
    { id: 'SCR-04', title: 'Leadership Digital Panafricain', master: 'Awa Diabaté', duration: '20h', students: '4.2K', level: 'Débutant', rating: 4.9, gradient: 'linear-gradient(135deg, #2e0a1a 0%, #ef4444 100%)', modules: 8 },
    { id: 'SCR-05', title: 'Design UX/UI Afrofuturiste', master: 'Mariam Touré', duration: '30h', students: '2.8K', level: 'Intermédiaire', rating: 4.8, gradient: 'linear-gradient(135deg, #1a0a2e 0%, #a78bfa 100%)', modules: 14 },
    { id: 'SCR-06', title: 'Cybersécurité Sirius Shield', master: 'Ibrahim Diallo', duration: '45h', students: '1.1K', level: 'Expert', rating: 5.0, gradient: 'linear-gradient(135deg, #0a2e0a 0%, #059669 100%)', modules: 16 },
    { id: 'SCR-07', title: 'Marketing Digital & Growth AI', master: 'Fatou Sylla', duration: '25h', students: '5.6K', level: 'Débutant', rating: 4.6, gradient: 'linear-gradient(135deg, #2e1a0a 0%, #B85C2E 100%)', modules: 9 },
]

const levelColors: Record<string, string> = { 'Débutant': '#00E5A0', 'Intermédiaire': '#D4A017', 'Avancé': '#ef4444', 'Expert': '#a78bfa' }

export default function Learn() {
    return (
        <div style={{ position: 'relative' }}>
            <Starfield />
            <CosmicBackground />
            <ScrollProgress />
            <Navbar />

            {/* Hero */}
            <section className="section-full nebula-section" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 2 }}>
                    <div className="cosmo-label" style={{ justifyContent: 'center', marginBottom: 24 }}>COSMOGONIE DOGON</div>
                    <h1 className="text-shimmer ochre-pulse" style={{ marginBottom: 32 }}>L'ÉCOLE DES<br />SCRIBES</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: 600, margin: '0 auto 40px' }}>
                        Formations d'élite propulsées par l'IA Sirius. Chaque Scribe devient un gardien du savoir numérique.
                    </p>
                    <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
                        {[{ val: '7', label: 'FORMATIONS' }, { val: '15K+', label: 'SCRIBES ACTIFS' }, { val: '4.8★', label: 'SATISFACTION' }].map((s, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.15 }}>
                                <div className="stat-number" style={{ fontSize: '1.8rem' }}>{s.val}</div>
                                <div className="accent-label">{s.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>
            <div className="glow-separator" />

            {/* Courses Grid */}
            <section className="section-full">
                <div className="max-w-container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 24 }}>
                        {courses.map((c, i) => (
                            <motion.div
                                key={c.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                whileHover={{ y: -10, boxShadow: 'var(--shadow-hover)' }}
                                style={{
                                    borderRadius: 'var(--radius-xl)', overflow: 'hidden', cursor: 'pointer',
                                    background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                                    transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
                                }}
                            >
                                {/* Gradient header */}
                                <div style={{
                                    height: 180, background: c.gradient, position: 'relative',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <GraduationCap size={48} style={{ color: 'var(--icon-watermark)' }} />
                                    {/* Level badge */}
                                    <div style={{
                                        position: 'absolute', top: 16, left: 16,
                                        padding: '5px 16px', borderRadius: 'var(--radius-pill)',
                                        background: 'var(--badge-bg)', backdropFilter: 'blur(10px)',
                                        fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.15em',
                                        color: levelColors[c.level] || '#fff',
                                    }}>{c.level.toUpperCase()}</div>
                                    {/* Modules count */}
                                    <div style={{
                                        position: 'absolute', top: 16, right: 16,
                                        padding: '5px 14px', borderRadius: 'var(--radius-pill)',
                                        background: 'var(--badge-bg)', backdropFilter: 'blur(10px)',
                                        fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--badge-text-dim)',
                                    }}>{c.modules} MODULES</div>
                                </div>

                                {/* Course info */}
                                <div style={{ padding: '28px 28px 32px' }}>
                                    <div className="accent-label" style={{ marginBottom: 8 }}>{c.id}</div>
                                    <div style={{
                                        fontFamily: 'var(--font-display)', fontSize: '1.15rem',
                                        fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 12, lineHeight: 1.2,
                                    }}>{c.title}</div>

                                    {/* Master */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                        <div style={{
                                            width: 28, height: 28, borderRadius: '50%',
                                            background: 'linear-gradient(135deg, var(--nya-ochre), var(--nya-ochre-dark))',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.65rem', fontWeight: 900, color: 'white',
                                        }}>{c.master.charAt(0)}</div>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{c.master}</span>
                                    </div>

                                    {/* Rating + meta */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid var(--border-default)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Star size={14} fill="#D4A017" stroke="#D4A017" />
                                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#D4A017' }}>{c.rating}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: 16 }}>
                                            <span className="accent-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={10} /> {c.duration}</span>
                                            <span className="accent-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={10} /> {c.students}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <div className="glow-separator" />
            <section style={{ padding: '60px var(--page-padding)' }}>
                <div className="max-w-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, textAlign: 'center' }}>
                    {[
                        { icon: BookOpen, title: 'Cours HD', desc: 'Vidéo + exercices' },
                        { icon: Award, title: 'Certificats', desc: 'Reconnus Sirius' },
                        { icon: Zap, title: 'IA Tuteur', desc: 'Assistance 24/7' },
                        { icon: Users, title: 'Communauté', desc: '15K+ Scribes' },
                    ].map((f, i) => (
                        <motion.div key={i} whileHover={{ y: -4 }} style={{ padding: 24 }}>
                            <f.icon size={24} style={{ color: 'var(--nya-ochre)', marginBottom: 12 }} />
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 900, marginBottom: 4 }}>{f.title}</div>
                            <div className="accent-label">{f.desc}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <Footer />
            <div className="grain-overlay" />
        </div>
    )
}

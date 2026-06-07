import { motion } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import ScrollProgress from '../components/animations/ScrollProgress'
import { Cross, Phone, MapPin, Star, Stethoscope, Pill, ShieldCheck, AlertCircle, Ambulance } from 'lucide-react'

const quickServices = [
    { icon: Stethoscope, title: 'Téléconsultation', desc: 'Consultation vidéo avec un médecin certifié. Disponible 24h/7j.', gradient: 'linear-gradient(135deg, #0a2e0a 0%, #00E5A0 100%)', price: '5 000 FCFA' },
    { icon: Pill, title: 'Pharmacie de Garde', desc: 'Localisation en temps réel de la pharmacie ouverte la plus proche.', gradient: 'linear-gradient(135deg, #0a0a2e 0%, #3b82f6 100%)', price: 'Gratuit' },
    { icon: Ambulance, title: 'Urgence Sirius', desc: 'Service d\'ambulance intelligent avec dispatch IA optimisé.', gradient: 'linear-gradient(135deg, #2e0a0a 0%, #ef4444 100%)', price: 'SOS' },
]

const centers = [
    { name: 'CHU de Cocody', type: 'Hôpital', address: 'Bd de l\'Université, Cocody', rating: 4.5, open: true, gradient: 'linear-gradient(135deg, #0a2e1a 0%, #059669 100%)' },
    { name: 'Clinique Procréa', type: 'Clinique', address: 'Riviera Palmeraie, Cocody', rating: 4.8, open: true, gradient: 'linear-gradient(135deg, #0a0a2e 0%, #00CED1 100%)' },
    { name: 'Pharmacie du Centre', type: 'Pharmacie', address: 'Rue du Commerce, Plateau', rating: 4.6, open: true, gradient: 'linear-gradient(135deg, #1a0a2e 0%, #a78bfa 100%)' },
    { name: 'Polyclinique Farah', type: 'Clinique', address: 'II Plateaux, Cocody', rating: 4.7, open: false, gradient: 'linear-gradient(135deg, #2e1a0a 0%, #D4A017 100%)' },
    { name: 'Centre de Santé de Yopougon', type: 'Hôpital', address: 'Quartier Millionnaire, Yopougon', rating: 4.3, open: true, gradient: 'linear-gradient(135deg, #2e0a1a 0%, #ef4444 100%)' },
    { name: 'Pharmacie Internationale', type: 'Pharmacie', address: 'Avenue Crosson Duplessis, Plateau', rating: 4.4, open: true, gradient: 'linear-gradient(135deg, #0a1a2e 0%, #3b82f6 100%)' },
    { name: 'CHU de Treichville', type: 'Hôpital', address: 'Bd de Marseille, Treichville', rating: 4.2, open: true, gradient: 'linear-gradient(135deg, #0a2e0a 0%, #4ade80 100%)' },
    { name: 'Laboratoire BIO24', type: 'Laboratoire', address: 'Zone 4, Marcory', rating: 4.9, open: false, gradient: 'linear-gradient(135deg, #0a0a1a 0%, #FFD700 100%)' },
]

const typeColors: Record<string, string> = { 'Hôpital': '#00E5A0', 'Clinique': '#00CED1', 'Pharmacie': '#a78bfa', 'Laboratoire': '#FFD700' }

export default function Health() {
    return (
        <div style={{ position: 'relative' }}>
            <Starfield />
            <CosmicBackground />
            <ScrollProgress />
            <Navbar />

            <section className="section-full nebula-section" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 2 }}>
                    <div className="cosmo-label" style={{ justifyContent: 'center', marginBottom: 24 }}>COSMOGONIE DOGON</div>
                    <h1 className="text-shimmer ochre-pulse" style={{ marginBottom: 32 }}>LES SOINS<br />D'AMMA</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: 600, margin: '0 auto 40px' }}>
                        Santé et bien-être propulsés par l'IA Oracle. Téléconsultation, pharmacies et urgences à portée de main.
                    </p>
                    <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
                        {[{ val: '8', label: 'CENTRES' }, { val: '24/7', label: 'DISPONIBILITÉ' }, { val: '4.6★', label: 'SATISFACTION' }].map((s, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.15 }}>
                                <div className="stat-number" style={{ fontSize: '1.8rem' }}>{s.val}</div>
                                <div className="accent-label">{s.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>
            <div className="glow-separator" />

            {/* Quick services */}
            <section className="section-full">
                <div className="max-w-container">
                    <h2 style={{ marginBottom: 48 }}>SERVICES <span className="text-ochre">RAPIDES</span></h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
                        {quickServices.map((s, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                whileHover={{ y: -10, boxShadow: 'var(--shadow-hover)' }}
                                style={{
                                    borderRadius: 'var(--radius-xl)', overflow: 'hidden', cursor: 'pointer',
                                    background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                                    transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
                                }}
                            >
                                <div style={{ height: 120, background: s.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                    <s.icon size={40} style={{ color: 'var(--icon-watermark)' }} />
                                    <div style={{
                                        position: 'absolute', bottom: 16, right: 16,
                                        padding: '5px 18px', borderRadius: 'var(--radius-pill)',
                                        background: 'var(--badge-bg)', backdropFilter: 'blur(10px)',
                                        fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.1em', color: 'var(--nya-ochre)',
                                    }}>{s.price}</div>
                                </div>
                                <div style={{ padding: 28 }}>
                                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 900, marginBottom: 10 }}>{s.title}</div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.6 }}>{s.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            <div className="glow-separator" />

            {/* Health Centers */}
            <section className="section-full section-dark nebula-section">
                <div className="max-w-container" style={{ position: 'relative', zIndex: 2 }}>
                    <div className="cosmo-label" style={{ marginBottom: 24 }}>RÉSEAU SIRIUS</div>
                    <h2 style={{ marginBottom: 48 }}>CENTRES <span className="text-ochre">RÉFÉRENCÉS</span></h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: 24 }}>
                        {centers.map((c, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.06, duration: 0.5 }}
                                whileHover={{ y: -8, boxShadow: 'var(--shadow-hover)' }}
                                style={{
                                    borderRadius: 'var(--radius-xl)', overflow: 'hidden', cursor: 'pointer',
                                    background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                                    transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
                                }}
                            >
                                <div style={{ height: 80, background: c.gradient, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Cross size={28} style={{ color: 'var(--icon-watermark)' }} />
                                    {/* Type badge */}
                                    <div style={{
                                        position: 'absolute', top: 12, left: 12,
                                        padding: '4px 14px', borderRadius: 'var(--radius-pill)',
                                        background: 'var(--badge-bg)', backdropFilter: 'blur(10px)',
                                        fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.15em',
                                        color: typeColors[c.type] || '#fff',
                                    }}>{c.type.toUpperCase()}</div>
                                    {/* Status */}
                                    <div style={{
                                        position: 'absolute', top: 12, right: 12,
                                        display: 'flex', alignItems: 'center', gap: 6,
                                        padding: '4px 14px', borderRadius: 'var(--radius-pill)',
                                        background: 'var(--badge-bg)', backdropFilter: 'blur(10px)',
                                    }}>
                                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: c.open ? '#00E5A0' : '#ef4444' }} />
                                        <span style={{ fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.1em', color: c.open ? '#00E5A0' : '#ef4444' }}>
                                            {c.open ? 'OUVERT' : 'FERMÉ'}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ padding: '24px 24px 28px' }}>
                                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 900, marginBottom: 8, lineHeight: 1.2 }}>{c.name}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                                        <MapPin size={12} style={{ color: 'var(--nya-ochre)', opacity: 0.5 }} />
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>{c.address}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border-default)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Star size={12} fill="#D4A017" stroke="#D4A017" />
                                            <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#D4A017' }}>{c.rating}</span>
                                        </div>
                                        <motion.div whileHover={{ scale: 1.1 }} style={{
                                            width: 36, height: 36, borderRadius: '50%',
                                            background: 'linear-gradient(135deg, var(--nya-ochre), var(--nya-ochre-dark))',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                        }}>
                                            <Phone size={14} style={{ color: 'white' }} />
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Safety banner */}
            <div className="dogon-border" />
            <section style={{ padding: '60px var(--page-padding)', textAlign: 'center' }}>
                <div className="max-w-container max-w-narrow mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <ShieldCheck size={28} style={{ color: 'var(--nya-ochre)', marginBottom: 16 }} />
                        <h3 style={{ marginBottom: 16 }}>VOTRE SANTÉ, <span className="text-ochre">NOTRE PRIORITÉ</span></h3>
                        <p style={{ color: 'var(--text-faint)', lineHeight: 1.8, marginBottom: 32 }}>
                            Tous les centres sont vérifiés et certifiés par le réseau Sirius Health. En cas d'urgence, appelez le SOS Sirius.
                        </p>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary">
                            <AlertCircle size={14} /> SOS SIRIUS — URGENCE
                        </motion.button>
                    </motion.div>
                </div>
            </section>

            <Footer />
            <div className="grain-overlay" />
        </div>
    )
}

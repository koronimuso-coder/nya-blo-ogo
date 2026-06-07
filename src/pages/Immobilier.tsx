import { motion } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import ScrollProgress from '../components/animations/ScrollProgress'
import { Building2, BedDouble, Bath, Ruler, Heart, Eye, Calculator, Bot } from 'lucide-react'

const properties = [
    { id: 'IMM-01', title: 'Villa Standing Cocody Riviera', price: '185 000 000', type: 'Vente', bedrooms: 5, bathrooms: 3, area: '450m²', gradient: 'linear-gradient(135deg, #2e1a0a 0%, #D4A017 100%)', hot: true },
    { id: 'IMM-02', title: 'Appartement T3 Plateau', price: '350 000', type: 'Location', bedrooms: 3, bathrooms: 2, area: '120m²', gradient: 'linear-gradient(135deg, #0a0a2e 0%, #3b82f6 100%)', hot: false },
    { id: 'IMM-03', title: 'Duplex Angré 8ème Tranche', price: '95 000 000', type: 'Vente', bedrooms: 4, bathrooms: 3, area: '280m²', gradient: 'linear-gradient(135deg, #0a2e0a 0%, #059669 100%)', hot: true },
    { id: 'IMM-04', title: 'Studio Meublé Marcory Zone 4', price: '200 000', type: 'Location', bedrooms: 1, bathrooms: 1, area: '45m²', gradient: 'linear-gradient(135deg, #1a0a2e 0%, #a78bfa 100%)', hot: false },
    { id: 'IMM-05', title: 'Terrain Bingerville (600m²)', price: '25 000 000', type: 'Vente', bedrooms: 0, bathrooms: 0, area: '600m²', gradient: 'linear-gradient(135deg, #2e2e0a 0%, #B85C2E 100%)', hot: false },
    { id: 'IMM-06', title: 'Bureau Open Space Abidjan Sud', price: '500 000', type: 'Location', bedrooms: 0, bathrooms: 2, area: '200m²', gradient: 'linear-gradient(135deg, #0a1a2e 0%, #00CED1 100%)', hot: false },
    { id: 'IMM-07', title: 'Villa Vue Lagune Assinie', price: '350 000 000', type: 'Vente', bedrooms: 6, bathrooms: 4, area: '800m²', gradient: 'linear-gradient(135deg, #0a0a1a 0%, #FFD700 100%)', hot: true },
    { id: 'IMM-08', title: 'Penthouse Cocody Ambassades', price: '750 000', type: 'Location', bedrooms: 4, bathrooms: 3, area: '250m²', gradient: 'linear-gradient(135deg, #2e0a1a 0%, #ef4444 100%)', hot: false },
]

const services = [
    { icon: Eye, title: 'Visite 360° Sirius', desc: 'Explorez chaque propriété en réalité virtuelle haute définition.', gradient: 'linear-gradient(135deg, #0a0a2e 0%, #00E5A0 100%)' },
    { icon: Calculator, title: 'Simulation Prêt', desc: 'Calculez votre capacité d\'emprunt avec l\'IA Oracle en temps réel.', gradient: 'linear-gradient(135deg, #1a0a2e 0%, #D4A017 100%)' },
    { icon: Bot, title: 'Assistance Sirius', desc: 'Un conseiller IA disponible 24h/7j pour toutes vos questions.', gradient: 'linear-gradient(135deg, #2e0a1a 0%, #B85C2E 100%)' },
]

export default function Immobilier() {
    return (
        <div style={{ position: 'relative' }}>
            <Starfield />
            <CosmicBackground />
            <ScrollProgress />
            <Navbar />

            <section className="section-full nebula-section" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 2 }}>
                    <div className="cosmo-label" style={{ justifyContent: 'center', marginBottom: 24 }}>COSMOGONIE DOGON</div>
                    <h1 className="text-shimmer ochre-pulse" style={{ marginBottom: 32 }}>TROUVEZ VOTRE<br />CHEZ-VOUS</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: 600, margin: '0 auto 40px' }}>
                        Des villas luxueuses aux studios modernes, l'immobilier Sirius connecte votre rêve à la réalité.
                    </p>
                    <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
                        {[{ val: '200+', label: 'PROPRIÉTÉS' }, { val: '8', label: 'COMMUNES' }, { val: '360°', label: 'VISITES VIRTUELLES' }].map((s, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.15 }}>
                                <div className="stat-number" style={{ fontSize: '1.8rem' }}>{s.val}</div>
                                <div className="accent-label">{s.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>
            <div className="glow-separator" />

            {/* Properties grid */}
            <section className="section-full">
                <div className="max-w-container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: 24 }}>
                        {properties.map((p, i) => (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                whileHover={{ y: -8, boxShadow: 'var(--shadow-hover)' }}
                                style={{
                                    borderRadius: 'var(--radius-xl)', overflow: 'hidden', cursor: 'pointer',
                                    background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                                    transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
                                }}
                            >
                                <div style={{ height: 180, background: p.gradient, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Building2 size={40} style={{ color: 'var(--icon-watermark)' }} />
                                    {/* Type badge */}
                                    <div style={{
                                        position: 'absolute', top: 16, left: 16,
                                        padding: '5px 16px', borderRadius: 'var(--radius-pill)',
                                        background: p.type === 'Vente' ? 'rgba(184,92,46,0.9)' : 'rgba(0,206,209,0.9)',
                                        fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.15em', color: 'white',
                                    }}>{p.type.toUpperCase()}</div>
                                    {p.hot && (
                                        <div style={{
                                            position: 'absolute', top: 16, right: 16,
                                            padding: '5px 14px', borderRadius: 'var(--radius-pill)',
                                            background: 'rgba(239,68,68,0.9)',
                                            fontSize: '0.55rem', fontWeight: 900, letterSpacing: '0.1em', color: 'white',
                                        }}>🔥 HOT</div>
                                    )}
                                    <motion.div whileHover={{ scale: 1.2 }} style={{
                                        position: 'absolute', bottom: 16, right: 16,
                                        width: 36, height: 36, borderRadius: '50%',
                                        background: 'var(--badge-bg)', backdropFilter: 'blur(10px)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <Heart size={14} style={{ color: 'var(--wishlist-icon)' }} />
                                    </motion.div>
                                </div>

                                <div style={{ padding: '24px 24px 28px' }}>
                                    <div className="accent-label" style={{ marginBottom: 6 }}>{p.id}</div>
                                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 900, marginBottom: 16, lineHeight: 1.2 }}>{p.title}</div>

                                    {/* Property meta */}
                                    <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                                        {p.bedrooms > 0 && <span className="accent-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><BedDouble size={10} /> {p.bedrooms}</span>}
                                        {p.bathrooms > 0 && <span className="accent-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Bath size={10} /> {p.bathrooms}</span>}
                                        <span className="accent-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Ruler size={10} /> {p.area}</span>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid var(--border-default)' }}>
                                        <div>
                                            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 900, color: 'var(--nya-ochre)' }}>{p.price}</span>
                                            <span style={{ fontSize: '0.6rem', color: 'var(--text-faint)', marginLeft: 4 }}>{p.type === 'Location' ? 'FCFA/MOIS' : 'FCFA'}</span>
                                        </div>
                                        <motion.div whileHover={{ scale: 1.1 }} style={{
                                            width: 38, height: 38, borderRadius: '50%',
                                            background: 'linear-gradient(135deg, var(--nya-ochre), var(--nya-ochre-dark))',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                        }}>
                                            <Eye size={14} style={{ color: 'white' }} />
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services */}
            <div className="glow-separator" />
            <section className="section-full section-dark">
                <div className="max-w-container" style={{ position: 'relative', zIndex: 2 }}>
                    <h2 style={{ marginBottom: 48, textAlign: 'center' }}>SERVICES <span className="text-ochre">QUANTIQUES</span></h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
                        {services.map((s, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -8, boxShadow: 'var(--shadow-hover)' }}
                                style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
                                <div style={{ height: 100, background: s.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <s.icon size={32} style={{ color: 'var(--icon-muted)' }} />
                                </div>
                                <div style={{ padding: 28 }}>
                                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 900, marginBottom: 8 }}>{s.title}</div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.6 }}>{s.desc}</p>
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

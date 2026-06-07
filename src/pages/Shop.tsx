import { motion } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import ScrollProgress from '../components/animations/ScrollProgress'
import SacredGeometry from '../components/animations/SacredGeometry'
import { ShoppingBag, Search, Filter, Star, Heart, Eye, Truck } from 'lucide-react'

const categories = ['Tous', 'Artisanat', 'Tech', 'Mode', 'Services IA', 'Entertainment', 'Formation', 'Transit', 'Business']

const products = [
    { id: 'O01', name: 'Sceau Sirius B — Or Pur 24k', price: '450 000', cat: 'Artisanat', gradient: 'linear-gradient(135deg, #8B4522 0%, #D4A017 100%)', rating: 4.9, reviews: 128 },
    { id: 'O02', name: 'Bazin Riche Bogolan Imperial', price: '85 000', cat: 'Mode', gradient: 'linear-gradient(135deg, #1a1a3e 0%, #4a1a5e 100%)', rating: 4.7, reviews: 89 },
    { id: 'O03', name: 'Masque Kanaga Sculpteur Alpha', price: '120 000', cat: 'Artisanat', gradient: 'linear-gradient(135deg, #2d1810 0%, #8B4522 100%)', rating: 5.0, reviews: 64 },
    { id: 'O04', name: 'Tablette de Scribe Papyrus v2', price: '175 000', cat: 'Tech', gradient: 'linear-gradient(135deg, #0a0a2e 0%, #00CED1 80%)', rating: 4.8, reviews: 203 },
    { id: 'O05', name: 'Beurre de Karité des Falaises', price: '12 000', cat: 'Artisanat', gradient: 'linear-gradient(135deg, #3d2e1a 0%, #C2A888 100%)', rating: 4.6, reviews: 312 },
    { id: 'O06', name: 'Module de Calcul Sirius', price: '350 000', cat: 'Tech', gradient: 'linear-gradient(135deg, #050520 0%, #FFD700 100%)', rating: 4.9, reviews: 76 },
    { id: 'O07', name: 'Sphère de Vision Sirius', price: '280 000', cat: 'Tech', gradient: 'linear-gradient(135deg, #0d0d2b 0%, #00E5A0 100%)', rating: 4.8, reviews: 54 },
    { id: 'O08', name: 'Vidéo Courte AI (Reels/TikTok)', price: '15 000', cat: 'Services IA', gradient: 'linear-gradient(135deg, #1a0a2e 0%, #ef4444 100%)', rating: 4.5, reviews: 445 },
    { id: 'O09', name: 'Starter Community Manager AI', price: '45 000', cat: 'Services IA', gradient: 'linear-gradient(135deg, #0a1a2e 0%, #3b82f6 100%)', rating: 4.7, reviews: 198 },
    { id: 'O10', name: 'Gestion Publicité AI-Optimized', price: '75 000', cat: 'Services IA', gradient: 'linear-gradient(135deg, #1a0d2e 0%, #a78bfa 100%)', rating: 4.6, reviews: 167 },
    { id: 'O11', name: 'Formation Express AI (2h)', price: '25 000', cat: 'Formation', gradient: 'linear-gradient(135deg, #0a2e1a 0%, #00E5A0 100%)', rating: 4.8, reviews: 234 },
    { id: 'O12', name: 'Audit Digital AI + Plan 90j', price: '150 000', cat: 'Services IA', gradient: 'linear-gradient(135deg, #2e1a0a 0%, #D4A017 100%)', rating: 4.9, reviews: 87 },
    { id: 'O13', name: 'Masterclass Scribe Fullstack', price: '200 000', cat: 'Formation', gradient: 'linear-gradient(135deg, #0a0a2e 0%, #B85C2E 100%)', rating: 5.0, reviews: 156 },
    { id: 'O14', name: 'Netflix Premium (1 Mois)', price: '7 000', cat: 'Entertainment', gradient: 'linear-gradient(135deg, #1a0000 0%, #e50914 100%)', rating: 4.4, reviews: 567 },
    { id: 'O15', name: 'IPTV Pro Elite (12 Mois)', price: '45 000', cat: 'Entertainment', gradient: 'linear-gradient(135deg, #0a0a2e 0%, #6366f1 100%)', rating: 4.3, reviews: 234 },
    { id: 'O16', name: 'Pack Entertainment Total', price: '35 000', cat: 'Entertainment', gradient: 'linear-gradient(135deg, #2e0a1a 0%, #ec4899 100%)', rating: 4.5, reviews: 189 },
    { id: 'O17', name: 'Canal+ Tout Canal (1 Mois)', price: '18 000', cat: 'Entertainment', gradient: 'linear-gradient(135deg, #000a2e 0%, #0ea5e9 100%)', rating: 4.2, reviews: 423 },
    { id: 'O18', name: 'Fire TV Stick 4K Max', price: '45 000', cat: 'Tech', gradient: 'linear-gradient(135deg, #1a1a1a 0%, #f59e0b 100%)', rating: 4.6, reviews: 345 },
    { id: 'O19', name: 'Casque Gaming Sirius G1', price: '65 000', cat: 'Tech', gradient: 'linear-gradient(135deg, #0a0a1a 0%, #06b6d4 100%)', rating: 4.7, reviews: 278 },
    { id: 'O20', name: "T-Shirt AI Custom Design", price: '15 000', cat: 'Mode', gradient: 'linear-gradient(135deg, #1a1a2e 0%, #8b5cf6 100%)', rating: 4.4, reviews: 567 },
    { id: 'O21', name: "Hoodie Premium 'NOMMO'", price: '35 000', cat: 'Mode', gradient: 'linear-gradient(135deg, #0a0a0a 0%, #B85C2E 100%)', rating: 4.8, reviews: 189 },
    { id: 'O22', name: "Sac à Main Cuir 'Bandiagara'", price: '95 000', cat: 'Mode', gradient: 'linear-gradient(135deg, #2e1a0a 0%, #92400e 100%)', rating: 4.9, reviews: 112 },
    { id: 'O23', name: 'Transit Chine -> CI (Air Express)', price: '850/kg', cat: 'Transit', gradient: 'linear-gradient(135deg, #0a1a2e 0%, #2563eb 100%)', rating: 4.5, reviews: 678 },
    { id: 'O24', name: 'Achat Pour Compte (Chine/Dubai)', price: '10%', cat: 'Transit', gradient: 'linear-gradient(135deg, #1a0a2e 0%, #7c3aed 100%)', rating: 4.6, reviews: 234 },
    { id: 'O25', name: 'Pack Startup Launch 360', price: '500 000', cat: 'Business', gradient: 'linear-gradient(135deg, #0a2e0a 0%, #059669 100%)', rating: 4.9, reviews: 45 },
    { id: 'O26', name: 'Pack Business Scaler', price: '850 000', cat: 'Business', gradient: 'linear-gradient(135deg, #2e2e0a 0%, #D4A017 100%)', rating: 5.0, reviews: 23 },
    { id: 'O27', name: 'Consultance Business Sirius', price: '100 000', cat: 'Business', gradient: 'linear-gradient(135deg, #1a0a0a 0%, #dc2626 100%)', rating: 4.7, reviews: 89 },
]

export default function Shop() {
    return (
        <div style={{ position: 'relative' }}>
            <Starfield />
            <CosmicBackground />
            <ScrollProgress />
            <Navbar />

            {/* Hero */}
            <section className="section-full nebula-section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
                <div className="max-w-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', position: 'relative', zIndex: 2 }}>
                    <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                        <div className="cosmo-label" style={{ marginBottom: 24 }}>COSMOGONIE DOGON</div>
                        <h1 className="text-shimmer" style={{ marginBottom: 32 }}>
                            LA FORCE DE<br />L'IMPACT AI
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: 500, marginBottom: 40 }}>
                            Des sites web en 24h, du branding par IA, des équipements tech de pointe et l'héritage sacré Dogon réunis en un seul lieu.
                        </p>
                        {/* Search bar */}
                        <div style={{ display: 'flex', gap: 8 }}>
                            <div style={{
                                flex: 1, display: 'flex', alignItems: 'center', gap: 12,
                                padding: '14px 24px', borderRadius: 'var(--radius-pill)',
                                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                            }}>
                                <Search size={16} style={{ color: 'var(--nya-ochre)', opacity: 0.6 }} />
                                <input placeholder="Rechercher un produit sacré..." style={{
                                    background: 'none', border: 'none', outline: 'none',
                                    color: 'var(--text-secondary)', fontFamily: 'var(--font-body)',
                                    fontSize: '0.85rem', width: '100%',
                                }} />
                            </div>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                style={{
                                    width: 52, height: 52, borderRadius: '50%',
                                    background: 'var(--nya-ochre)', border: 'none', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                <Filter size={18} style={{ color: 'white' }} />
                            </motion.button>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.8 }}>
                        <SacredGeometry size={500} opacity={0.08} />
                    </motion.div>
                </div>
            </section>

            {/* Stats row */}
            <div className="glow-separator" />
            <section style={{ padding: '40px var(--page-padding)' }}>
                <div className="max-w-container" style={{ display: 'flex', justifyContent: 'center', gap: 60, flexWrap: 'wrap' }}>
                    {[
                        { value: '27', label: 'PRODUITS' },
                        { value: '9', label: 'CATÉGORIES' },
                        { value: '4.8★', label: 'NOTE MOYENNE' },
                        { value: '24h', label: 'LIVRAISON SIRIUS' },
                    ].map((s, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                            style={{ textAlign: 'center' }}>
                            <div className="stat-number" style={{ fontSize: '2rem' }}>{s.value}</div>
                            <div className="accent-label" style={{ marginTop: 4 }}>{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>
            <div className="glow-separator" />

            {/* Filter bar */}
            <section style={{ padding: '40px var(--page-padding) 20px' }}>
                <div className="max-w-container">
                    <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8 }}>
                        {categories.map((cat, i) => (
                            <motion.button
                                key={cat}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    padding: '12px 28px', borderRadius: 'var(--radius-pill)', whiteSpace: 'nowrap',
                                    background: i === 0 ? 'linear-gradient(135deg, var(--nya-ochre), var(--nya-ochre-dark))' : 'var(--bg-surface)',
                                    color: i === 0 ? '#FFFFFF' : 'var(--text-muted)',
                                    border: i === 0 ? 'none' : '1px solid var(--border-subtle)',
                                    fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' as const,
                                    cursor: 'pointer', fontFamily: 'var(--font-body)',
                                    boxShadow: i === 0 ? '0 4px 20px rgba(184,92,46,0.3)' : 'none',
                                }}
                            >{cat}</motion.button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Grid — PREMIUM CARDS */}
            <section style={{ padding: '20px var(--page-padding) var(--section-gap)' }}>
                <div className="max-w-container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
                        {products.map((p, i) => (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.03, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                whileHover={{ y: -8, boxShadow: 'var(--shadow-hover)' }}
                                style={{
                                    borderRadius: 'var(--radius-xl)', overflow: 'hidden', cursor: 'pointer',
                                    background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                                    transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
                                }}
                            >
                                {/* Product image placeholder with gradient */}
                                <div style={{
                                    height: 200, background: p.gradient, position: 'relative',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    overflow: 'hidden',
                                }}>
                                    {/* Floating ID badge */}
                                    <div style={{
                                        position: 'absolute', top: 16, left: 16,
                                        padding: '4px 14px', borderRadius: 'var(--radius-pill)',
                                        background: 'var(--badge-bg)', backdropFilter: 'blur(10px)',
                                        fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.2em', color: 'var(--nya-ochre)',
                                    }}>{p.id}</div>

                                    {/* Wishlist button */}
                                    <motion.div whileHover={{ scale: 1.2 }} style={{
                                        position: 'absolute', top: 16, right: 16,
                                        width: 36, height: 36, borderRadius: '50%',
                                        background: 'var(--badge-bg)', backdropFilter: 'blur(10px)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <Heart size={14} style={{ color: 'var(--wishlist-icon)' }} />
                                    </motion.div>

                                    {/* Category badge */}
                                    <div style={{
                                        position: 'absolute', bottom: 16, left: 16,
                                        padding: '6px 16px', borderRadius: 'var(--radius-pill)',
                                        background: 'var(--badge-bg)', backdropFilter: 'blur(10px)',
                                        fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em',
                                        textTransform: 'uppercase', color: 'var(--badge-text)',
                                    }}>{p.cat}</div>

                                    {/* Kanaga watermark */}
                                    <svg width="60" height="60" viewBox="0 0 40 40" fill="none" style={{ opacity: 0.08 }}>
                                        <path d="M20 4 L36 20 L20 36 L4 20 Z" stroke="white" strokeWidth="1" fill="none" />
                                        <path d="M20 12 L28 20 L20 28 L12 20 Z" fill="white" />
                                    </svg>
                                </div>

                                {/* Product info */}
                                <div style={{ padding: '24px 24px 28px' }}>
                                    <div style={{
                                        fontFamily: 'var(--font-display)', fontSize: '1.05rem',
                                        fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em',
                                        marginBottom: 12, lineHeight: 1.2,
                                    }}>{p.name}</div>

                                    {/* Rating */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                        <div style={{ display: 'flex', gap: 2 }}>
                                            {[...Array(5)].map((_, j) => (
                                                <Star key={j} size={12} fill={j < Math.floor(p.rating) ? '#D4A017' : 'none'} stroke={j < Math.floor(p.rating) ? '#D4A017' : 'var(--star-empty)'} />
                                            ))}
                                        </div>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                            {p.rating} ({p.reviews})
                                        </span>
                                    </div>

                                    {/* Price + CTA */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <span style={{
                                                fontFamily: 'var(--font-display)', fontSize: '1.3rem',
                                                fontWeight: 900, color: 'var(--nya-ochre)',
                                            }}>{p.price}</span>
                                            <span style={{ fontSize: '0.65rem', color: 'var(--text-faint)', marginLeft: 4, fontWeight: 700 }}>FCFA</span>
                                        </div>
                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                            style={{
                                                width: 42, height: 42, borderRadius: '50%',
                                                background: 'linear-gradient(135deg, var(--nya-ochre), var(--nya-ochre-dark))',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                cursor: 'pointer', boxShadow: '0 4px 16px rgba(184,92,46,0.3)',
                                            }}>
                                            <ShoppingBag size={16} style={{ color: 'white' }} />
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Delivery Banner */}
            <div className="glow-separator" />
            <section style={{ padding: '60px var(--page-padding)' }}>
                <div className="max-w-container">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        style={{
                            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: 24, textAlign: 'center',
                        }}>
                        {[
                            { icon: Truck, title: 'Livraison Sirius', desc: 'Abidjan en 24h' },
                            { icon: Eye, title: 'Aperçu AR', desc: 'Essayez avant d\'acheter' },
                            { icon: ShoppingBag, title: 'Paiement Sécurisé', desc: 'Mobile Money & Carte' },
                            { icon: Star, title: 'Satisfaction', desc: 'Garantie Nexus 30j' },
                        ].map((f, i) => (
                            <motion.div key={i} whileHover={{ y: -4 }} style={{ padding: 24 }}>
                                <f.icon size={24} style={{ color: 'var(--nya-ochre)', marginBottom: 12 }} />
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 900, marginBottom: 4 }}>{f.title}</div>
                                <div className="accent-label">{f.desc}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <Footer />
            <div className="grain-overlay" />
        </div>
    )
}

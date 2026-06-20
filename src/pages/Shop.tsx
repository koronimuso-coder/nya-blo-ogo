import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import ScrollProgress from '../components/animations/ScrollProgress'
import SacredGeometry from '../components/animations/SacredGeometry'
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'
import { useNotificationStore } from '../stores/notificationStore'
import { ShoppingBag, Search, Filter, Star, Heart, Eye, Truck, ArrowUpDown, Check } from 'lucide-react'

const categories = ['Tous', 'Artisanat', 'Tech', 'Mode', 'Services IA', 'Entertainment', 'Formation', 'Transit', 'Business']

const products = [
    { id: 'O01', name: 'Sceau Sirius B — Or Pur 24k', price: '450 000', cat: 'Artisanat', gradient: 'linear-gradient(135deg, #8B4522 0%, #D4A017 100%)', rating: 4.9, reviews: 128, image: undefined as string | undefined },
    { id: 'O02', name: 'Bazin Riche Bogolan Imperial', price: '85 000', cat: 'Mode', gradient: 'linear-gradient(135deg, #1a1a3e 0%, #4a1a5e 100%)', rating: 4.7, reviews: 89, image: undefined },
    { id: 'O03', name: 'Masque Kanaga Sculpteur Alpha', price: '120 000', cat: 'Artisanat', gradient: 'linear-gradient(135deg, #2d1810 0%, #8B4522 100%)', rating: 5.0, reviews: 64, image: undefined },
    { id: 'O04', name: 'Tablette de Scribe Papyrus v2', price: '175 000', cat: 'Tech', gradient: 'linear-gradient(135deg, #0a0a2e 0%, #00CED1 80%)', rating: 4.8, reviews: 203, image: undefined },
    { id: 'O05', name: 'Beurre de Karité des Falaises', price: '12 000', cat: 'Artisanat', gradient: 'linear-gradient(135deg, #3d2e1a 0%, #C2A888 100%)', rating: 4.6, reviews: 312, image: undefined },
    { id: 'O06', name: 'Module de Calcul Sirius', price: '350 000', cat: 'Tech', gradient: 'linear-gradient(135deg, #050520 0%, #FFD700 100%)', rating: 4.9, reviews: 76, image: undefined },
    { id: 'O07', name: 'Sphère de Vision Sirius', price: '280 000', cat: 'Tech', gradient: 'linear-gradient(135deg, #0d0d2b 0%, #00E5A0 100%)', rating: 4.8, reviews: 54, image: undefined },
    { id: 'O08', name: 'Vidéo Courte AI (Reels/TikTok)', price: '15 000', cat: 'Services IA', gradient: 'linear-gradient(135deg, #1a0a2e 0%, #ef4444 100%)', rating: 4.5, reviews: 445, image: undefined },
    { id: 'O09', name: 'Starter Community Manager AI', price: '45 000', cat: 'Services IA', gradient: 'linear-gradient(135deg, #0a1a2e 0%, #3b82f6 100%)', rating: 4.7, reviews: 198, image: undefined },
    { id: 'O10', name: 'Gestion Publicité AI-Optimized', price: '75 000', cat: 'Services IA', gradient: 'linear-gradient(135deg, #1a0d2e 0%, #a78bfa 100%)', rating: 4.6, reviews: 167, image: undefined },
    { id: 'O11', name: 'Formation Express AI (2h)', price: '25 000', cat: 'Formation', gradient: 'linear-gradient(135deg, #0a2e1a 0%, #00E5A0 100%)', rating: 4.8, reviews: 234, image: undefined },
    { id: 'O12', name: 'Audit Digital AI + Plan 90j', price: '150 000', cat: 'Services IA', gradient: 'linear-gradient(135deg, #2e1a0a 0%, #D4A017 100%)', rating: 4.9, reviews: 87, image: undefined },
    { id: 'O13', name: 'Masterclass Scribe Fullstack', price: '200 000', cat: 'Formation', gradient: 'linear-gradient(135deg, #0a0a2e 0%, #B85C2E 100%)', rating: 5.0, reviews: 156, image: undefined },
    { id: 'O14', name: 'Netflix Premium (1 Mois)', price: '7 000', cat: 'Entertainment', gradient: 'linear-gradient(135deg, #1a0000 0%, #e50914 100%)', rating: 4.4, reviews: 567, image: undefined },
    { id: 'O15', name: 'IPTV Pro Elite (12 Mois)', price: '45 000', cat: 'Entertainment', gradient: 'linear-gradient(135deg, #0a0a2e 0%, #6366f1 100%)', rating: 4.3, reviews: 234, image: undefined },
    { id: 'O16', name: 'Pack Entertainment Total', price: '35 000', cat: 'Entertainment', gradient: 'linear-gradient(135deg, #2e0a1a 0%, #ec4899 100%)', rating: 4.5, reviews: 189, image: undefined },
    { id: 'O17', name: 'Canal+ Tout Canal (1 Mois)', price: '18 000', cat: 'Entertainment', gradient: 'linear-gradient(135deg, #000a2e 0%, #0ea5e9 100%)', rating: 4.2, reviews: 423, image: undefined },
    { id: 'O18', name: 'Fire TV Stick 4K Max', price: '45 000', cat: 'Tech', gradient: 'linear-gradient(135deg, #1a1a1a 0%, #f59e0b 100%)', rating: 4.6, reviews: 345, image: undefined },
    { id: 'O19', name: 'Casque Gaming Sirius G1', price: '65 000', cat: 'Tech', gradient: 'linear-gradient(135deg, #0a0a1a 0%, #06b6d4 100%)', rating: 4.7, reviews: 278, image: undefined },
    { id: 'O20', name: "T-Shirt AI Custom Design", price: '15 000', cat: 'Mode', gradient: 'linear-gradient(135deg, #1a1a2e 0%, #8b5cf6 100%)', rating: 4.4, reviews: 567, image: undefined },
    { id: 'O21', name: "Hoodie Premium 'NOMMO'", price: '35 000', cat: 'Mode', gradient: 'linear-gradient(135deg, #0a0a0a 0%, #B85C2E 100%)', rating: 4.8, reviews: 189, image: undefined },
    { id: 'O22', name: "Sac à Main Cuir 'Bandiagara'", price: '95 000', cat: 'Mode', gradient: 'linear-gradient(135deg, #2e1a0a 0%, #92400e 100%)', rating: 4.9, reviews: 112, image: undefined },
    { id: 'O23', name: 'Transit Chine -> CI (Air Express)', price: '850', cat: 'Transit', gradient: 'linear-gradient(135deg, #0a1a2e 0%, #2563eb 100%)', rating: 4.5, reviews: 678, image: undefined },
    { id: 'O24', name: 'Achat Pour Compte (Chine/Dubai)', price: '10 000', cat: 'Transit', gradient: 'linear-gradient(135deg, #1a0a2e 0%, #7c3aed 100%)', rating: 4.6, reviews: 234, image: undefined },
    { id: 'O25', name: 'Pack Startup Launch 360', price: '500 000', cat: 'Business', gradient: 'linear-gradient(135deg, #0a2e0a 0%, #059669 100%)', rating: 4.9, reviews: 45, image: undefined },
    { id: 'O26', name: 'Pack Business Scaler', price: '850 000', cat: 'Business', gradient: 'linear-gradient(135deg, #2e2e0a 0%, #D4A017 100%)', rating: 5.0, reviews: 23, image: undefined },
    { id: 'O27', name: 'Consultance Business Sirius', price: '100 000', cat: 'Business', gradient: 'linear-gradient(135deg, #1a0a0a 0%, #dc2626 100%)', rating: 4.7, reviews: 89, image: undefined },
    
    // iPhones Quasi Neuf Nano Banana (Initial Price + 30 000F)
    { id: 'IP01', name: 'iPhone 16 Pro Max 256GB — Quasi Neuf', price: '555 000', cat: 'Tech', image: '/iphone_16_nano_banana.png', gradient: 'linear-gradient(135deg, #09090b 0%, #eab308 100%)', rating: 4.9, reviews: 42 },
    { id: 'IP02', name: 'iPhone 16 Pro 256GB — Quasi Neuf', price: '485 000', cat: 'Tech', image: '/iphone_16_nano_banana.png', gradient: 'linear-gradient(135deg, #09090b 0%, #eab308 100%)', rating: 4.8, reviews: 31 },
    { id: 'IP03', name: 'iPhone 16 Pro 128GB — Quasi Neuf', price: '470 000', cat: 'Tech', image: '/iphone_16_nano_banana.png', gradient: 'linear-gradient(135deg, #09090b 0%, #eab308 100%)', rating: 4.8, reviews: 25 },
    { id: 'IP04', name: 'iPhone 15 Pro 1TB — Quasi Neuf', price: '410 000', cat: 'Tech', image: '/iphone_15_nano_banana.png', gradient: 'linear-gradient(135deg, #09090b 0%, #eab308 100%)', rating: 4.9, reviews: 18 },
    { id: 'IP05', name: 'iPhone 15 256GB — Quasi Neuf', price: '315 000', cat: 'Tech', image: '/iphone_15_nano_banana.png', gradient: 'linear-gradient(135deg, #09090b 0%, #eab308 100%)', rating: 4.7, reviews: 29 },
    { id: 'IP06', name: 'iPhone 15 128GB — Quasi Neuf', price: '300 000', cat: 'Tech', image: '/iphone_15_nano_banana.png', gradient: 'linear-gradient(135deg, #09090b 0%, #eab308 100%)', rating: 4.7, reviews: 37 },
    { id: 'IP07', name: 'iPhone 14 Pro Max 256GB — Quasi Neuf', price: '345 000', cat: 'Tech', image: '/iphone_14_nano_banana.png', gradient: 'linear-gradient(135deg, #09090b 0%, #eab308 100%)', rating: 4.8, reviews: 56 },
    { id: 'IP08', name: 'iPhone 14 Pro Max 128GB — Quasi Neuf', price: '330 000', cat: 'Tech', image: '/iphone_14_nano_banana.png', gradient: 'linear-gradient(135deg, #09090b 0%, #eab308 100%)', rating: 4.8, reviews: 49 },
    { id: 'IP09', name: 'iPhone 14 Pro 128GB — Quasi Neuf', price: '295 000', cat: 'Tech', image: '/iphone_14_nano_banana.png', gradient: 'linear-gradient(135deg, #09090b 0%, #eab308 100%)', rating: 4.7, reviews: 34 },
    { id: 'IP10', name: 'iPhone 14 128GB — Quasi Neuf', price: '220 000', cat: 'Tech', image: '/iphone_14_nano_banana.png', gradient: 'linear-gradient(135deg, #09090b 0%, #eab308 100%)', rating: 4.6, reviews: 41 },
    { id: 'IP11', name: 'iPhone 13 Pro Max 256GB — Quasi Neuf', price: '275 000', cat: 'Tech', image: '/iphone_13_nano_banana.png', gradient: 'linear-gradient(135deg, #09090b 0%, #eab308 100%)', rating: 4.8, reviews: 62 },
    { id: 'IP12', name: 'iPhone 13 Pro Max 128GB — Quasi Neuf', price: '260 000', cat: 'Tech', image: '/iphone_13_nano_banana.png', gradient: 'linear-gradient(135deg, #09090b 0%, #eab308 100%)', rating: 4.7, reviews: 58 },
    { id: 'IP13', name: 'iPhone 13 Pro 256GB — Quasi Neuf', price: '240 000', cat: 'Tech', image: '/iphone_13_nano_banana.png', gradient: 'linear-gradient(135deg, #09090b 0%, #eab308 100%)', rating: 4.7, reviews: 39 },
    { id: 'IP14', name: 'iPhone 13 Pro 128GB — Quasi Neuf', price: '230 000', cat: 'Tech', image: '/iphone_13_nano_banana.png', gradient: 'linear-gradient(135deg, #09090b 0%, #eab308 100%)', rating: 4.6, reviews: 45 },
    { id: 'IP15', name: 'iPhone 13 128GB — Quasi Neuf', price: '185 000', cat: 'Tech', image: '/iphone_13_nano_banana.png', gradient: 'linear-gradient(135deg, #09090b 0%, #eab308 100%)', rating: 4.6, reviews: 53 },
    { id: 'IP16', name: 'iPhone 12 Pro Max 128GB — Quasi Neuf', price: '205 000', cat: 'Tech', image: '/iphone_12_nano_banana.png', gradient: 'linear-gradient(135deg, #09090b 0%, #eab308 100%)', rating: 4.6, reviews: 29 },
    { id: 'IP17', name: 'iPhone 12 Pro Max 256GB — Quasi Neuf', price: '215 000', cat: 'Tech', image: '/iphone_12_nano_banana.png', gradient: 'linear-gradient(135deg, #09090b 0%, #eab308 100%)', rating: 4.7, reviews: 34 },
    { id: 'IP18', name: 'iPhone 12 Pro 128GB — Quasi Neuf', price: '180 000', cat: 'Tech', image: '/iphone_12_nano_banana.png', gradient: 'linear-gradient(135deg, #09090b 0%, #eab308 100%)', rating: 4.5, reviews: 27 },
    { id: 'IP19', name: 'iPhone 12 64GB — Quasi Neuf', price: '137 000', cat: 'Tech', image: '/iphone_12_nano_banana.png', gradient: 'linear-gradient(135deg, #09090b 0%, #eab308 100%)', rating: 4.4, reviews: 48 },
    { id: 'IP20', name: 'iPhone 12 128GB — Quasi Neuf', price: '148 000', cat: 'Tech', image: '/iphone_12_nano_banana.png', gradient: 'linear-gradient(135deg, #09090b 0%, #eab308 100%)', rating: 4.5, reviews: 52 },
    { id: 'IP21', name: 'iPhone 11 Pro 64GB — Quasi Neuf', price: '145 000', cat: 'Tech', image: '/iphone_11_nano_banana.png', gradient: 'linear-gradient(135deg, #09090b 0%, #eab308 100%)', rating: 4.6, reviews: 71 },
    { id: 'IP22', name: 'iPhone 11 Pro 256GB — Quasi Neuf', price: '155 000', cat: 'Tech', image: '/iphone_11_nano_banana.png', gradient: 'linear-gradient(135deg, #09090b 0%, #eab308 100%)', rating: 4.6, reviews: 65 },
    { id: 'IP23', name: 'iPhone 11 64GB — Quasi Neuf', price: '122 000', cat: 'Tech', image: '/iphone_11_nano_banana.png', gradient: 'linear-gradient(135deg, #09090b 0%, #eab308 100%)', rating: 4.4, reviews: 88 },
    { id: 'IP24', name: 'iPhone XR 64GB — Quasi Neuf', price: '112 000', cat: 'Tech', image: '/iphone_xr_nano_banana.png', gradient: 'linear-gradient(135deg, #09090b 0%, #eab308 100%)', rating: 4.3, reviews: 94 },
    { id: 'IP25', name: 'iPhone XR 128GB (2025) — Quasi Neuf', price: '115 000', cat: 'Tech', image: '/iphone_xr_nano_banana.png', gradient: 'linear-gradient(135deg, #09090b 0%, #eab308 100%)', rating: 4.4, reviews: 106 },

]

type SortMode = 'default' | 'price-asc' | 'price-desc' | 'rating' | 'popular'

function parsePrice(p: string): number {
    return parseInt(p.replace(/[^0-9]/g, '')) || 0
}

export default function Shop() {
    const [activeCat, setActiveCat] = useState('Tous')
    const [searchQuery, setSearchQuery] = useState('')
    const [sortMode, setSortMode] = useState<SortMode>('default')
    const [addedIds, setAddedIds] = useState<string[]>([])

    const { addItem, toggleWishlist, wishlist } = useCartStore()
    const { unlockAchievement } = useAuthStore()
    const { push } = useNotificationStore()

    const filtered = useMemo(() => {
        let result = products

        // Category filter
        if (activeCat !== 'Tous') {
            result = result.filter(p => p.cat === activeCat)
        }

        // Search filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase()
            result = result.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.cat.toLowerCase().includes(q) ||
                p.id.toLowerCase().includes(q)
            )
        }

        // Sort
        switch (sortMode) {
            case 'price-asc':
                result = [...result].sort((a, b) => parsePrice(a.price) - parsePrice(b.price))
                break
            case 'price-desc':
                result = [...result].sort((a, b) => parsePrice(b.price) - parsePrice(a.price))
                break
            case 'rating':
                result = [...result].sort((a, b) => b.rating - a.rating)
                break
            case 'popular':
                result = [...result].sort((a, b) => b.reviews - a.reviews)
                break
        }

        return result
    }, [activeCat, searchQuery, sortMode])

    const handleAddToCart = (p: typeof products[0]) => {
        addItem({ id: p.id, name: p.name, price: p.price, gradient: p.gradient })
        setAddedIds(prev => [...prev, p.id])
        setTimeout(() => setAddedIds(prev => prev.filter(id => id !== p.id)), 1500)

        // Achievement
        unlockAchievement('shopper')

        // Notification
        push({
            type: 'reward',
            title: 'Article ajouté',
            message: `${p.name} ajouté au panier.`,
            icon: '🛒',
            color: '#B85C2E',
        })
    }

    const handleWishlist = (id: string) => {
        toggleWishlist(id)
    }

    const sortLabels: Record<SortMode, string> = {
        'default': 'Par défaut',
        'price-asc': 'Prix croissant',
        'price-desc': 'Prix décroissant',
        'rating': 'Meilleures notes',
        'popular': 'Plus populaires',
    }

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
                                <input
                                    placeholder="Rechercher un produit sacré..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        background: 'none', border: 'none', outline: 'none',
                                        color: 'var(--text-secondary)', fontFamily: 'var(--font-body)',
                                        fontSize: '0.85rem', width: '100%',
                                    }}
                                />
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
                        { value: String(filtered.length), label: 'PRODUITS AFFICHÉS' },
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

            {/* Filter bar + Sort */}
            <section style={{ padding: '40px var(--page-padding) 20px' }}>
                <div className="max-w-container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', flex: 1, paddingBottom: 8 }}>
                            {categories.map((cat) => {
                                const isActive = activeCat === cat
                                const count = cat === 'Tous' ? products.length : products.filter(p => p.cat === cat).length
                                return (
                                    <motion.button
                                        key={cat}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setActiveCat(cat)}
                                        style={{
                                            padding: '12px 24px', borderRadius: 'var(--radius-pill)', whiteSpace: 'nowrap',
                                            background: isActive ? 'linear-gradient(135deg, var(--nya-ochre), var(--nya-ochre-dark))' : 'var(--bg-surface)',
                                            color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                                            border: isActive ? 'none' : '1px solid var(--border-subtle)',
                                            fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' as const,
                                            cursor: 'pointer', fontFamily: 'var(--font-body)',
                                            boxShadow: isActive ? '0 4px 20px rgba(184,92,46,0.3)' : 'none',
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        {cat} <span style={{ opacity: 0.6, marginLeft: 4 }}>({count})</span>
                                    </motion.button>
                                )
                            })}
                        </div>

                        {/* Sort dropdown */}
                        <div style={{ position: 'relative' }}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                onClick={() => {
                                    const modes: SortMode[] = ['default', 'price-asc', 'price-desc', 'rating', 'popular']
                                    const idx = modes.indexOf(sortMode)
                                    setSortMode(modes[(idx + 1) % modes.length])
                                }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    padding: '10px 20px', borderRadius: 'var(--radius-pill)',
                                    background: 'var(--bg-surface)',
                                    border: '1px solid var(--border-subtle)',
                                    color: 'var(--text-muted)', cursor: 'pointer',
                                    fontSize: '0.65rem', fontWeight: 700,
                                    letterSpacing: '0.1em', textTransform: 'uppercase' as const,
                                    fontFamily: 'var(--font-body)',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                <ArrowUpDown size={14} />
                                {sortLabels[sortMode]}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Grid — INTERACTIVE CARDS */}
            <section style={{ padding: '20px var(--page-padding) var(--section-gap)' }}>
                <div className="max-w-container">
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            layout
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}
                        >
                            {filtered.map((p, i) => {
                                const inWishlist = wishlist.includes(p.id)
                                const justAdded = addedIds.includes(p.id)
                                return (
                                    <motion.div
                                        key={p.id}
                                        layout
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: i * 0.02, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                        whileHover={{ y: -8, boxShadow: 'var(--shadow-hover)' }}
                                        style={{
                                            borderRadius: 'var(--radius-xl)', overflow: 'hidden', cursor: 'pointer',
                                            background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                                            transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
                                        }}
                                    >
                                        {/* Product image placeholder with gradient */}
                                        <div style={{
                                            height: 200, background: p.image ? '#0a0a0f' : p.gradient, position: 'relative',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            overflow: 'hidden',
                                        }}>
                                            {p.image && (
                                                <motion.img
                                                    src={p.image}
                                                    alt={p.name}
                                                    whileHover={{ scale: 1.06 }}
                                                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        position: 'absolute',
                                                        inset: 0,
                                                        zIndex: 0
                                                    }}
                                                />
                                            )}

                                            {/* Floating ID badge */}
                                            <div style={{
                                                position: 'absolute', top: 16, left: 16,
                                                padding: '4px 14px', borderRadius: 'var(--radius-pill)',
                                                background: 'var(--badge-bg)', backdropFilter: 'blur(10px)',
                                                fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.2em', color: 'var(--nya-ochre)',
                                                zIndex: 1
                                            }}>{p.id}</div>

                                            {/* Wishlist button */}
                                            <motion.div
                                                whileHover={{ scale: 1.2 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => { e.stopPropagation(); handleWishlist(p.id) }}
                                                style={{
                                                    position: 'absolute', top: 16, right: 16,
                                                    width: 36, height: 36, borderRadius: '50%',
                                                    background: inWishlist ? 'rgba(239,68,68,0.3)' : 'var(--badge-bg)',
                                                    backdropFilter: 'blur(10px)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    transition: 'background 0.3s',
                                                    zIndex: 1
                                                }}
                                            >
                                                <Heart
                                                    size={14}
                                                    fill={inWishlist ? '#ef4444' : 'none'}
                                                    style={{ color: inWishlist ? '#ef4444' : 'var(--wishlist-icon)' }}
                                                />
                                            </motion.div>

                                            {/* Category badge */}
                                            <div style={{
                                                position: 'absolute', bottom: 16, left: 16,
                                                padding: '6px 16px', borderRadius: 'var(--radius-pill)',
                                                background: 'var(--badge-bg)', backdropFilter: 'blur(10px)',
                                                fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em',
                                                textTransform: 'uppercase', color: 'var(--badge-text)',
                                                zIndex: 1
                                            }}>{p.cat}</div>

                                            {/* Kanaga watermark */}
                                            <svg width="60" height="60" viewBox="0 0 40 40" fill="none" style={{ opacity: 0.08, zIndex: 1 }}>
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
                                                <motion.div
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={(e) => { e.stopPropagation(); handleAddToCart(p) }}
                                                    style={{
                                                        width: 42, height: 42, borderRadius: '50%',
                                                        background: justAdded
                                                            ? 'linear-gradient(135deg, #059669, #00E5A0)'
                                                            : 'linear-gradient(135deg, var(--nya-ochre), var(--nya-ochre-dark))',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        boxShadow: justAdded ? '0 4px 16px rgba(5,150,105,0.4)' : '0 4px 16px rgba(184,92,46,0.3)',
                                                        transition: 'all 0.3s ease',
                                                    }}
                                                >
                                                    <AnimatePresence mode="wait">
                                                        <motion.div
                                                            key={justAdded ? 'check' : 'bag'}
                                                            initial={{ scale: 0, rotate: -90 }}
                                                            animate={{ scale: 1, rotate: 0 }}
                                                            exit={{ scale: 0, rotate: 90 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            {justAdded
                                                                ? <Check size={16} style={{ color: 'white' }} />
                                                                : <ShoppingBag size={16} style={{ color: 'white' }} />
                                                            }
                                                        </motion.div>
                                                    </AnimatePresence>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </motion.div>
                    </AnimatePresence>

                    {filtered.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                                padding: 60, textAlign: 'center',
                                color: 'var(--text-faint)',
                            }}
                        >
                            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>🔍</div>
                            <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8 }}>Aucun produit trouvé</div>
                            <div style={{ fontSize: '0.8rem' }}>
                                Essayez une autre catégorie ou recherche
                            </div>
                        </motion.div>
                    )}
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

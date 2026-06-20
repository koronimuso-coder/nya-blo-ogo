import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import SEOHead from '../components/SEOHead'
import { useNotificationStore } from '../stores/notificationStore'
import { useAuthStore } from '../stores/authStore'
import {
    Search, Star, CheckCircle, User, Check
} from 'lucide-react'

interface GigProvider {
    id: string
    name: string
    specialty: string
    rating: number
    reviews: number
    rateFCFA: number
    rateCoins: number
    category: 'tech' | 'home' | 'delivery' | 'education'
    location: string
    gradient: string
}

export default function Gigs() {
    const { addCoins, addScore } = useAuthStore()
    const { push } = useNotificationStore()

    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'tech' | 'home' | 'delivery' | 'education'>('all')
    
    // Booking States
    const [selectedProvider, setSelectedProvider] = useState<GigProvider | null>(null)
    const [bookingDate, setBookingDate] = useState('')
    const [bookingTime, setBookingTime] = useState('10:00')
    const [jobDetails, setJobDetails] = useState('')
    const [bookingStep, setBookingStep] = useState<'details' | 'success'>('details')
    const [bookingLoading, setBookingLoading] = useState(false)

    const providers: GigProvider[] = [
        { id: 'GP1', name: 'Moussa DIALLO', specialty: 'Plomberie & Réparation de Canalisations', rating: 4.9, reviews: 104, rateFCFA: 6000, rateCoins: 60, category: 'home', location: 'Cocody, Abidjan', gradient: 'linear-gradient(135deg, #8B4522 0%, #D4A017 100%)' },
        { id: 'GP2', name: 'Awa TRAORÉ', specialty: 'Création de Contenu & Scribe IA', rating: 4.8, reviews: 88, rateFCFA: 12000, rateCoins: 120, category: 'tech', location: 'Plateau, Abidjan', gradient: 'linear-gradient(135deg, #1a1a3e 0%, #4a1a5e 100%)' },
        { id: 'GP3', name: 'Amadou KOFFI', specialty: 'Cours Particuliers Mathématiques & Physiques', rating: 4.7, reviews: 62, rateFCFA: 8000, rateCoins: 80, category: 'education', location: 'Yamoussoukro', gradient: 'linear-gradient(135deg, #0a2e1a 0%, #00E5A0 100%)' },
        { id: 'GP4', name: 'Kassi BROU', specialty: 'Livreur Express & Transport de Colis Précieux', rating: 4.9, reviews: 145, rateFCFA: 4000, rateCoins: 40, category: 'delivery', location: 'Marcory, Abidjan', gradient: 'linear-gradient(135deg, #0d0d2b 0%, #00CED1 100%)' },
        { id: 'GP5', name: 'Bakary KONÉ', specialty: 'Maintenance Informatique & Réseau Satellite', rating: 4.6, reviews: 39, rateFCFA: 15000, rateCoins: 150, category: 'tech', location: 'Bouaké', gradient: 'linear-gradient(135deg, #2e1a0a 0%, #B85C2E 100%)' },
    ]

    const filtered = useMemo(() => {
        return providers.filter(p => {
            const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 p.specialty.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory
            return matchesQuery && matchesCategory
        })
    }, [searchQuery, selectedCategory])

    const handleOpenBooking = (p: GigProvider) => {
        setSelectedProvider(p)
        setBookingStep('details')
    }

    const handleConfirmBooking = (e: React.FormEvent) => {
        e.preventDefault()
        if (!bookingDate || !bookingTime || !jobDetails.trim() || !selectedProvider) return

        setBookingLoading(true)
        setTimeout(() => {
            setBookingLoading(false)
            setBookingStep('success')
            addScore(80)
            addCoins(15)
            push({
                type: 'system',
                title: 'Prestation Réservée',
                message: `Réservation enregistrée avec ${selectedProvider.name} (+80 Score, +15 Coins).`,
                icon: '🛠️',
                color: '#00E5A0'
            })
        }, 2200)
    }

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 100 }}>
            <SEOHead 
                title="Nya Gigs — Marché de Services de Proximité NYA BLO OGO" 
                description="Réservez des prestataires locaux qualifiés en Côte d'Ivoire (Tech, Plomberie, Livraison, Enseignement) et réglez en Coins ou FCFA." 
            />
            <Starfield />
            <CosmicBackground />
            <Navbar />

            <main className="max-w-container" style={{ paddingTop: 120, position: 'relative', zIndex: 2 }}>
                
                {/* Header */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
                    <div className="cosmo-label">Écosystème Sirius {" > "} Micro-Prestations</div>
                    <h1 className="text-shimmer" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                        NYA GIGS
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 650 }}>
                        Connectez-vous à un réseau d'artisans et professionnels de confiance certifiés par l'Oracle Sirius. Des services rapides, sécurisés et à tarifs transparents.
                    </p>
                </div>

                {/* Filter and Search Bar */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24, marginBottom: 40 }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 20px', borderRadius: 12,
                        background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)'
                    }}>
                        <Search size={16} style={{ color: 'var(--nya-ochre)' }} />
                        <input
                            type="text"
                            placeholder="Rechercher un artisan, plombier, développeur..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '0.85rem', width: '100%' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
                        {[
                            { id: 'all', label: 'Tous' },
                            { id: 'home', label: 'Maison' },
                            { id: 'tech', label: 'Tech' },
                            { id: 'delivery', label: 'Logistique' },
                            { id: 'education', label: 'Éducation' }
                        ].map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id as any)}
                                style={{
                                    padding: '8px 16px', borderRadius: 10,
                                    background: selectedCategory === cat.id ? 'rgba(255,255,255,0.06)' : 'transparent',
                                    border: '1px solid ' + (selectedCategory === cat.id ? 'var(--nya-gold)' : 'transparent'),
                                    color: selectedCategory === cat.id ? 'var(--nya-gold)' : 'var(--text-muted)',
                                    fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer'
                                }}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid of Providers */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
                    {filtered.map((provider) => (
                        <motion.div
                            key={provider.id}
                            whileHover={{ y: -6, borderColor: 'var(--border-hover)' }}
                            style={{
                                borderRadius: 24, overflow: 'hidden', background: 'var(--bg-surface)',
                                border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column'
                            }}
                        >
                            {/* Graphic Header */}
                            <div style={{ height: 120, background: provider.gradient, position: 'relative', display: 'flex', alignItems: 'center', padding: '0 24px' }}>
                                <div style={{
                                    width: 54, height: 54, borderRadius: '50%', background: 'rgba(0,0,0,0.5)',
                                    border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
                                }}>
                                    <User size={24} />
                                </div>
                                <div style={{ marginLeft: 16 }}>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', display: 'block' }}>{provider.location}</span>
                                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 900, color: '#fff' }}>{provider.name}</h3>
                                </div>
                            </div>

                            {/* Content */}
                            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, flex: 1, justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                        <div style={{ display: 'flex', gap: 2 }}>
                                            {[...Array(5)].map((_, j) => (
                                                <Star key={j} size={12} fill={j < Math.floor(provider.rating) ? 'var(--nya-gold)' : 'none'} stroke={j < Math.floor(provider.rating) ? 'var(--nya-gold)' : 'var(--star-empty)'} />
                                            ))}
                                        </div>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                                            {provider.rating} ({provider.reviews})
                                        </span>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>{provider.specialty}</span>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-default)', paddingTop: 16 }}>
                                    <div>
                                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>TARIF MOYEN</span>
                                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 900, color: 'var(--nya-ochre)' }}>
                                            {provider.rateFCFA.toLocaleString('fr-FR')} FCFA
                                        </span>
                                        <span style={{ fontSize: '0.65rem', color: 'var(--text-faint)', marginLeft: 4 }}>/ heure</span>
                                    </div>
                                    <button onClick={() => handleOpenBooking(provider)} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: 'var(--nya-ochre)', color: '#fff', fontWeight: 800, fontSize: '0.7rem', cursor: 'pointer' }}>
                                        Réserver
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </main>

            {/* Booking Modal */}
            <AnimatePresence>
                {selectedProvider && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProvider(null)}
                            style={{ position: 'fixed', inset: 0, zIndex: 99998, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 99999, width: 'min(480px, 90vw)' }}
                        >
                            <div className="toguna-glass" style={{ padding: 32, borderRadius: 24, border: '1px solid rgba(212,160,23,0.3)', color: '#fff', position: 'relative' }}>
                                <button onClick={() => setSelectedProvider(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>

                                {bookingStep === 'details' ? (
                                    <form onSubmit={handleConfirmBooking} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900, color: 'var(--nya-gold)', textTransform: 'uppercase' }}>
                                            Demande de Prestation
                                        </h3>
                                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                            <div style={{ width: 44, height: 44, borderRadius: '50%', background: selectedProvider.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>{selectedProvider.name}</h4>
                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{selectedProvider.specialty}</span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)' }}>Date</label>
                                                <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '0.8rem' }} />
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)' }}>Heure</label>
                                                <input type="time" value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} required style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '0.8rem' }} />
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                            <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)' }}>Description du besoin</label>
                                            <textarea rows={3} placeholder="Ex: Réparation de fuite d'eau sous l'évier de la cuisine..." value={jobDetails} onChange={(e) => setJobDetails(e.target.value)} required style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '0.8rem', resize: 'none' }} />
                                        </div>

                                        <div style={{ height: 1, background: 'var(--border-default)' }} />

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TARIF / HEURE</span>
                                            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 900 }}>{selectedProvider.rateFCFA.toLocaleString('fr-FR')} FCFA</span>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={bookingLoading}
                                            style={{
                                                width: '100%', padding: '14px', borderRadius: 12, border: 'none', cursor: 'pointer',
                                                background: 'var(--nya-ochre)', color: '#fff', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
                                            }}
                                        >
                                            {bookingLoading ? (
                                                <>
                                                    <div style={{ width: 14, height: 14, border: '2px solid #fff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                                    Validation...
                                                </>
                                            ) : (
                                                <>Confirmer la Réservation <Check size={16} /></>
                                            )}
                                        </button>
                                    </form>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '16px 0' }}>
                                        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(0,229,160,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--nya-sirius)' }}>
                                            <CheckCircle size={32} />
                                        </div>
                                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900, color: '#fff', marginBottom: 8 }}>
                                            Demande Envoyée !
                                        </h3>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 24 }}>
                                            {selectedProvider.name} a reçu votre demande de prestation. Vous serez alerté dès sa confirmation.
                                        </p>
                                        <button onClick={() => setSelectedProvider(null)} style={{ padding: '12px 24px', borderRadius: 'var(--radius-pill)', border: 'none', background: 'var(--nya-ochre)', color: '#fff', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}>
                                            Fermer
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    )
}

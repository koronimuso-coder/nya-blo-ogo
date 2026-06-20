import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import SEOHead from '../components/SEOHead'
import { useNotificationStore } from '../stores/notificationStore'
import { useAuthStore } from '../stores/authStore'
import {
    MapPin, Calendar as CalendarIcon, QrCode,
    Ticket, ChevronRight, Award
} from 'lucide-react'

export default function Tickets() {
    const { addCoins, addScore } = useAuthStore()
    const { push } = useNotificationStore()

    const [activeTab, setActiveTab] = useState<'bus' | 'events'>('bus')

    // Bus states
    const [fromCity, setFromCity] = useState('Abidjan')
    const [toCity, setToCity] = useState('Yamoussoukro')
    const [departDate, setDepartDate] = useState('2026-06-21')
    const [seatsSelected, setSeatsSelected] = useState<string[]>([])
    const [step, setStep] = useState<'search' | 'seats' | 'checkout' | 'success'>('search')
    const [ticketQR, setTicketQR] = useState('')

    // Event states
    const [selectedEvent, setSelectedEvent] = useState<any>(null)
    const [eventQty, setEventQty] = useState(1)

    const events = [
        { id: 'E1', title: 'Grand Concert L\'Agora Abidjan', date: '2026-07-04', location: 'Agora de Koumassi', price: 15000, coins: 150, image: 'linear-gradient(135deg, #ef4444, #b91c1c)' },
        { id: 'E2', title: 'Ligue des Champions Afrique — Final', date: '2026-07-12', location: 'Stade Alassane Ouattara Ebimpé', price: 5000, coins: 50, image: 'linear-gradient(135deg, #10b981, #047857)' },
        { id: 'E3', title: 'Cinéma Majestic — Le Retour de Nommo', date: '2026-06-25', location: 'Majestic Ivoire', price: 7000, coins: 70, image: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }
    ]

    const handleSearchBus = (e: React.FormEvent) => {
        e.preventDefault()
        if (fromCity === toCity) {
            push({
                type: 'system',
                title: 'Trajet invalide',
                message: 'La ville de départ et d\'arrivée doivent être différentes.',
                icon: '⚠️',
                color: '#ef4444'
            })
            return
        }
        setStep('seats')
    }

    const toggleSeat = (seatId: string) => {
        if (seatsSelected.includes(seatId)) {
            setSeatsSelected(prev => prev.filter(s => s !== seatId))
        } else {
            if (seatsSelected.length >= 4) {
                push({
                    type: 'system',
                    title: 'Limite atteinte',
                    message: 'Vous pouvez sélectionner jusqu\'à 4 sièges par trajet.',
                    icon: '💺',
                    color: '#B85C2E'
                })
                return
            }
            setSeatsSelected(prev => [...prev, seatId])
        }
    }

    const handleCheckoutBus = () => {
        if (seatsSelected.length === 0) return
        setStep('checkout')
    }

    const handlePayTicket = () => {
        setStep('success')
        const qrContent = `NYA-TKT-${Math.floor(Math.random() * 900000) + 100000}-CI`
        setTicketQR(qrContent)
        addScore(150)
        addCoins(30)
        push({
            type: 'system',
            title: 'Réservation Confirmée',
            message: 'Vos billets ont été générés avec succès (+150 Score, +30 Coins).',
            icon: '🎟️',
            color: '#00E5A0'
        })
    }

    const handleBookEvent = (evt: any) => {
        setSelectedEvent(evt)
        setStep('checkout')
    }

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 100 }}>
            <SEOHead 
                title="Sirius Voyage & Tickets — Super-App NYA BLO OGO" 
                description="Réservez vos tickets de transport interurbains et billets d'événements culturels en Côte d'Ivoire en Nya Coins ou en FCFA." 
            />
            <Starfield />
            <CosmicBackground />
            <Navbar />

            <main className="max-w-container" style={{ paddingTop: 120, position: 'relative', zIndex: 2 }}>
                
                {/* Header */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
                    <div className="cosmo-label">Écosystème Sirius {" > "} Services de Mobilité</div>
                    <h1 className="text-shimmer" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                        SIRIUS VOYAGE
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 650 }}>
                        Planifiez vos déplacements interurbains et réservez vos billets pour les plus grands événements. Paiements instantanés et e-tickets sécurisés.
                    </p>
                </div>

                {/* Step Indicators */}
                {step !== 'success' && (
                    <div style={{ display: 'flex', gap: 12, marginBottom: 40, borderBottom: '1px solid var(--border-default)', paddingBottom: 16 }}>
                        <button
                            onClick={() => setActiveTab('bus')}
                            style={{
                                padding: '10px 24px', borderRadius: 'var(--radius-pill)',
                                background: activeTab === 'bus' ? 'var(--nya-ochre)' : 'transparent',
                                border: '1px solid ' + (activeTab === 'bus' ? 'var(--nya-ochre)' : 'var(--border-subtle)'),
                                color: activeTab === 'bus' ? '#fff' : 'var(--text-muted)',
                                fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase',
                                cursor: 'pointer', transition: 'all 0.3s ease'
                            }}
                        >
                            Billets de Bus
                        </button>
                        <button
                            onClick={() => { setActiveTab('events'); setStep('search'); setSelectedEvent(null); }}
                            style={{
                                padding: '10px 24px', borderRadius: 'var(--radius-pill)',
                                background: activeTab === 'events' ? 'var(--nya-ochre)' : 'transparent',
                                border: '1px solid ' + (activeTab === 'events' ? 'var(--nya-ochre)' : 'var(--border-subtle)'),
                                color: activeTab === 'events' ? '#fff' : 'var(--text-muted)',
                                fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase',
                                cursor: 'pointer', transition: 'all 0.3s ease'
                            }}
                        >
                            Événements & Loisirs
                        </button>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {/* BUS BOOKING FLOW */}
                    {activeTab === 'bus' && (
                        <motion.div
                            key="bus-flow"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            {step === 'search' && (
                                <form onSubmit={handleSearchBus} className="toguna-glass" style={{ padding: 32, borderRadius: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>Départ</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, borderRadius: 10, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)' }}>
                                            <MapPin size={16} style={{ color: 'var(--nya-ochre)' }} />
                                            <select value={fromCity} onChange={(e) => setFromCity(e.target.value)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '0.85rem', width: '100%' }}>
                                                <option value="Abidjan">Abidjan</option>
                                                <option value="Yamoussoukro">Yamoussoukro</option>
                                                <option value="Bouaké">Bouaké</option>
                                                <option value="San Pedro">San Pedro</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>Destination</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, borderRadius: 10, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)' }}>
                                            <MapPin size={16} style={{ color: 'var(--nya-ochre)' }} />
                                            <select value={toCity} onChange={(e) => setToCity(e.target.value)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '0.85rem', width: '100%' }}>
                                                <option value="Yamoussoukro">Yamoussoukro</option>
                                                <option value="Abidjan">Abidjan</option>
                                                <option value="Bouaké">Bouaké</option>
                                                <option value="San Pedro">San Pedro</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>Date de Voyage</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, borderRadius: 10, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)' }}>
                                            <CalendarIcon size={16} style={{ color: 'var(--nya-ochre)' }} />
                                            <input type="date" value={departDate} onChange={(e) => setDepartDate(e.target.value)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '0.85rem', width: '100%' }} />
                                        </div>
                                    </div>

                                    <button type="submit" style={{ gridColumn: '1 / -1', padding: '16px', borderRadius: 12, border: 'none', background: 'var(--nya-ochre)', color: '#fff', fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                                        Trouver un bus disponible <ChevronRight size={16} />
                                    </button>
                                </form>
                            )}

                            {step === 'seats' && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40 }}>
                                    <div className="toguna-glass" style={{ padding: 32, borderRadius: 24, textAlign: 'center' }}>
                                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900, color: '#fff', marginBottom: 24 }}>
                                            PLAN DES SIÈGES (Sirius Express)
                                        </h3>
                                        
                                        {/* Seat grid simulator */}
                                        <div style={{
                                            maxWidth: 240, margin: '0 auto 32px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12,
                                            padding: 20, borderRadius: 16, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)'
                                        }}>
                                            {/* Driver placeholder */}
                                            <div style={{ gridColumn: 'span 2', gridRow: '1', height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: 6, fontSize: '0.65rem', color: 'var(--text-faint)' }}>Chauffeur</div>
                                            <div style={{ gridColumn: 'span 2', gridRow: '1' }} />
                                            
                                            {/* Normal Seats */}
                                            {Array.from({ length: 16 }, (_, idx) => {
                                                const seatNo = String(idx + 1)
                                                const isSelected = seatsSelected.includes(seatNo)
                                                const isBooked = [3, 7, 12].includes(idx) // Fictional booked seats
                                                return (
                                                    <button
                                                        key={idx}
                                                        disabled={isBooked}
                                                        onClick={() => toggleSeat(seatNo)}
                                                        style={{
                                                            height: 36, borderRadius: 8, cursor: isBooked ? 'not-allowed' : 'pointer',
                                                            background: isBooked ? 'rgba(255,255,255,0.05)' : isSelected ? 'var(--nya-ochre)' : 'rgba(255,255,255,0.02)',
                                                            border: '1.5px solid ' + (isBooked ? 'rgba(255,255,255,0.05)' : isSelected ? 'var(--nya-ochre)' : 'var(--border-subtle)'),
                                                            color: isBooked ? 'var(--text-faint)' : '#fff',
                                                            fontSize: '0.75rem', fontWeight: 800
                                                        }}
                                                    >
                                                        {seatNo}
                                                    </button>
                                                )
                                            })}
                                        </div>

                                        {/* Legend */}
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }} /> Libre</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--nya-ochre)' }} /> Sélectionné</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(255,255,255,0.05)' }} /> Réservé</span>
                                        </div>
                                    </div>

                                    {/* Sidebar booking summary */}
                                    <div className="toguna-glass" style={{ padding: 24, borderRadius: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
                                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 900, color: '#fff' }}>Détails du Trajet</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}><span style={{ color: 'var(--text-muted)' }}>Itinéraire</span><span style={{ fontWeight: 800, color: '#fff' }}>{fromCity} ➔ {toCity}</span></div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}><span style={{ color: 'var(--text-muted)' }}>Date</span><span style={{ fontWeight: 800, color: '#fff' }}>{departDate}</span></div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}><span style={{ color: 'var(--text-muted)' }}>Sièges</span><span style={{ fontWeight: 800, color: 'var(--nya-gold)' }}>{seatsSelected.join(', ') || 'Aucun'}</span></div>
                                            <div style={{ height: 1, background: 'var(--border-default)', margin: '8px 0' }} />
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800 }}>PRIX TOTAL</span>
                                                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>
                                                    {(seatsSelected.length * 8000).toLocaleString('fr-FR')} FCFA
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleCheckoutBus}
                                            disabled={seatsSelected.length === 0}
                                            style={{
                                                width: '100%', padding: '14px', borderRadius: 12, border: 'none', cursor: seatsSelected.length === 0 ? 'not-allowed' : 'pointer',
                                                background: 'var(--nya-ochre)', color: '#fff', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase'
                                            }}
                                        >
                                            Passer au Paiement
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 'checkout' && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40 }}>
                                    <div className="toguna-glass" style={{ padding: 32, borderRadius: 24 }}>
                                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900, color: '#fff', marginBottom: 16 }}>
                                            RÉCAPITULATIF DE LA COMMANDE
                                        </h3>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 24 }}>
                                            Choisissez votre méthode d'échange cosmique pour valider vos titres de transport sécurisés.
                                        </p>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}><span style={{ color: 'var(--text-muted)' }}>Départ</span><span style={{ fontWeight: 800, color: '#fff' }}>{fromCity} (Gare Centrale)</span></div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}><span style={{ color: 'var(--text-muted)' }}>Arrivée</span><span style={{ fontWeight: 800, color: '#fff' }}>{toCity} (Gare Centrale)</span></div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}><span style={{ color: 'var(--text-muted)' }}>Date de Départ</span><span style={{ fontWeight: 800, color: '#fff' }}>{departDate} à 08:30</span></div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}><span style={{ color: 'var(--text-muted)' }}>Sièges réservés</span><span style={{ fontWeight: 800, color: 'var(--nya-gold)' }}>{seatsSelected.join(', ')}</span></div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                            <button onClick={handlePayTicket} style={{ padding: '16px', borderRadius: 12, border: 'none', background: 'var(--nya-ochre)', color: '#fff', fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer' }}>
                                                Payer en Coins ({(seatsSelected.length * 80)} Nya)
                                            </button>
                                            <button onClick={handlePayTicket} style={{ padding: '16px', borderRadius: 12, border: '1px solid var(--border-subtle)', background: 'transparent', color: '#fff', fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer' }}>
                                                Payer en FCFA ({(seatsSelected.length * 8000).toLocaleString('fr-FR')})
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 'success' && (
                                <div className="toguna-glass" style={{ padding: 40, borderRadius: 24, textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
                                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(0,229,160,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--nya-sirius)' }}>
                                        <QrCode size={40} />
                                    </div>
                                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, color: '#fff', marginBottom: 12 }}>
                                        TICKET ÉLECTRONIQUE PRÊT
                                    </h3>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 24 }}>
                                        Votre ticket cryptographique a été ajouté à votre compte. Présentez ce code QR lors de l'embarquement.
                                    </p>

                                    {/* QR Code Placeholder */}
                                    <div style={{
                                        width: 160, height: 160, background: '#fff', padding: 12, borderRadius: 12,
                                        margin: '0 auto 32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 8px 30px rgba(0,0,0,0.8)'
                                    }}>
                                        {/* Simulated QR Code SVG */}
                                        <svg width="120" height="120" viewBox="0 0 100 100">
                                            <path d="M0 0h30v10H10v20H0V0zm70 0h30v30H90V10H70V0zM0 70h10v20h20v10H0V70zm100 0v30H70V90h20V70h10z" fill="#000"/>
                                            <rect x="25" y="25" width="20" height="20" fill="#000"/>
                                            <rect x="55" y="25" width="20" height="20" fill="#000"/>
                                            <rect x="25" y="55" width="20" height="20" fill="#000"/>
                                            <rect x="55" y="55" width="10" height="10" fill="#000"/>
                                            <rect x="65" y="65" width="10" height="10" fill="#000"/>
                                        </svg>
                                    </div>

                                    <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-code)', color: 'var(--text-muted)', marginBottom: 24 }}>
                                        ID: {ticketQR}
                                    </div>

                                    <button onClick={() => setStep('search')} style={{ padding: '12px 32px', borderRadius: 'var(--radius-pill)', border: 'none', background: 'var(--nya-ochre)', color: '#fff', fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer' }}>
                                        Nouveau Voyage
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* EVENT BOOKING FLOW */}
                    {activeTab === 'events' && (
                        <motion.div
                            key="events-flow"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            {step === 'search' && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
                                    {events.map((evt) => (
                                        <div
                                            key={evt.id}
                                            style={{
                                                borderRadius: 24, overflow: 'hidden', background: 'var(--nya-deep)',
                                                border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column'
                                            }}
                                        >
                                            <div style={{ height: 160, background: evt.image, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Ticket size={48} style={{ color: 'rgba(255,255,255,0.2)' }} />
                                                <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.6)', padding: '6px 14px', borderRadius: 8, fontSize: '0.7rem', fontWeight: 800, color: 'var(--nya-gold)' }}>
                                                    {evt.price.toLocaleString('fr-FR')} FCFA
                                                </div>
                                            </div>
                                            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                                                <div>
                                                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>{evt.date}</span>
                                                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 900, color: '#fff', marginTop: 4 }}>{evt.title}</h3>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{evt.location}</p>
                                                </div>
                                                <button onClick={() => handleBookEvent(evt)} style={{ width: '100%', padding: '12px', borderRadius: 12, border: 'none', background: 'var(--nya-ochre)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
                                                    Réserver mon Billet
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {step === 'checkout' && selectedEvent && (
                                <div style={{ maxWidth: 480, margin: '0 auto' }} className="toguna-glass">
                                    <div style={{ padding: 32, borderRadius: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
                                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900, color: '#fff', textTransform: 'uppercase' }}>
                                            Paiement Billet
                                        </h3>
                                        <div style={{ display: 'flex', gap: 16 }}>
                                            <div style={{ width: 80, height: 80, borderRadius: 12, background: selectedEvent.image, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Ticket size={24} style={{ color: '#fff' }} />
                                            </div>
                                            <div>
                                                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>{selectedEvent.title}</h4>
                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{selectedEvent.location}</span>
                                            </div>
                                        </div>

                                        {/* Qty controls */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quantité</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <button onClick={() => setEventQty(q => Math.max(1, q - 1))} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'transparent', color: '#fff', cursor: 'pointer' }}>-</button>
                                                <span style={{ fontWeight: 800, color: '#fff' }}>{eventQty}</span>
                                                <button onClick={() => setEventQty(q => Math.min(5, q + 1))} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'transparent', color: '#fff', cursor: 'pointer' }}>+</button>
                                            </div>
                                        </div>

                                        <div style={{ height: 1, background: 'var(--border-default)' }} />
                                        
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL</span>
                                            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900, color: '#fff' }}>
                                                {(selectedEvent.price * eventQty).toLocaleString('fr-FR')} FCFA
                                            </span>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                            <button onClick={handlePayTicket} style={{ padding: '14px', borderRadius: 12, border: 'none', background: 'var(--nya-ochre)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
                                                En Coins ({(selectedEvent.coins * eventQty)} Nya)
                                            </button>
                                            <button onClick={handlePayTicket} style={{ padding: '14px', borderRadius: 12, border: '1px solid var(--border-subtle)', background: 'transparent', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
                                                En FCFA
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 'success' && (
                                <div className="toguna-glass" style={{ padding: 40, borderRadius: 24, textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
                                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(212,160,23,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--nya-gold)' }}>
                                        <Award size={40} />
                                    </div>
                                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, color: '#fff', marginBottom: 12 }}>
                                        BILLET ÉVÉNEMENT MATÉRIALISÉ
                                    </h3>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 24 }}>
                                        Votre ticket d'accès a été généré avec succès. Retrouvez-le dans votre Wallet et présentez-le au guichet.
                                    </p>

                                    {/* QR Code placeholder */}
                                    <div style={{ width: 140, height: 140, background: '#fff', padding: 10, borderRadius: 12, margin: '0 auto 32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <svg width="100" height="100" viewBox="0 0 100 100">
                                            <path d="M0 0h30v10H10v20H0V0zm70 0h30v30H90V10H70V0zM0 70h10v20h20v10H0V70zm100 0v30H70V90h20V70h10z" fill="#000"/>
                                            <rect x="20" y="20" width="20" height="20" fill="#000"/>
                                            <rect x="60" y="20" width="20" height="20" fill="#000"/>
                                            <rect x="20" y="60" width="20" height="20" fill="#000"/>
                                            <rect x="60" y="60" width="20" height="20" fill="#000"/>
                                        </svg>
                                    </div>

                                    <button onClick={() => setStep('search')} style={{ padding: '12px 32px', borderRadius: 'var(--radius-pill)', border: 'none', background: 'var(--nya-ochre)', color: '#fff', fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer' }}>
                                        Découvrir d'autres événements
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

            </main>
            <Footer />
        </div>
    )
}

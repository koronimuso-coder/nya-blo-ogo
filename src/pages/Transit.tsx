import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { useNotificationStore } from '../stores/notificationStore'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import {
    Truck, Package, Search,
    ArrowRight, Coins, ShieldCheck
} from 'lucide-react'

interface Shipment {
    id: string
    from: string
    to: string
    type: string
    weight: number
    status: 'pending' | 'collected' | 'in_transit' | 'delivered'
    statusText: string
    progress: number
    date: string
}

const CITIES = ["Abidjan", "Yamoussoukro", "Bouaké", "San Pedro", "Korhogo", "Man"]

const PACKAGE_TYPES = [
    { id: 'doc', name: 'Documents', basePrice: 5 },
    { id: 'box', name: 'Colis Standard (Box)', basePrice: 15 },
    { id: 'freight', name: 'Fret Moyen (Cargaison)', basePrice: 50 },
    { id: 'precious', name: 'Marchandise Sacrée (Fragile)', basePrice: 30 }
]

export default function Transit() {
    const { user, addTransaction } = useAuthStore()
    const { push } = useNotificationStore()

    // Form inputs
    const [fromCity, setFromCity] = useState('Abidjan')
    const [toCity, setToCity] = useState('Yamoussoukro')
    const [packageTypeId, setPackageTypeId] = useState('box')
    const [weight, setWeight] = useState(5) // in kg
    const [express, setExpress] = useState(false)
    const [recipientName, setRecipientName] = useState('')
    const [recipientPhone, setRecipientPhone] = useState('')

    // Active shipments
    const [shipments, setShipments] = useState<Shipment[]>([
        {
            id: 'NYA-TR-58932-CI',
            from: 'Abidjan',
            to: 'Bouaké',
            type: 'Colis Standard (Box)',
            weight: 8,
            status: 'in_transit',
            statusText: 'En transit à l\'entrepôt principal de Yamoussoukro',
            progress: 65,
            date: '2026-06-19'
        },
        {
            id: 'NYA-TR-12093-CI',
            from: 'San Pedro',
            to: 'Abidjan',
            type: 'Documents',
            weight: 1,
            status: 'delivered',
            statusText: 'Livré au destinataire',
            progress: 100,
            date: '2026-06-18'
        }
    ])

    // Search tracking number
    const [searchTrackNum, setSearchTrackNum] = useState('')
    const [searchedShipment, setSearchedShipment] = useState<Shipment | null>(null)

    // Estimate calculations
    const selectedType = PACKAGE_TYPES.find(t => t.id === packageTypeId) || PACKAGE_TYPES[1]
    const distanceFactor = fromCity === toCity ? 1 : Math.abs(CITIES.indexOf(fromCity) - CITIES.indexOf(toCity)) * 1.5
    const baseCost = selectedType.basePrice + (weight * 2.5) * distanceFactor
    const finalCost = Math.round(express ? baseCost * 1.5 : baseCost)

    const handleCreateShipment = (e: React.FormEvent) => {
        e.preventDefault()
        if (fromCity === toCity) {
            push({
                type: 'system',
                title: 'Erreur d\'expédition',
                message: 'La ville de départ et d\'arrivée doivent être différentes.',
                icon: '⚠️',
                color: 'var(--nya-red)'
            })
            return
        }

        if (!recipientName || !recipientPhone) return

        if ((user?.nyaCoins ?? 0) < finalCost) {
            push({
                type: 'system',
                title: 'Coins insuffisants',
                message: 'Vous ne disposez pas d\'assez de Nya Coins pour cette expédition.',
                icon: '⚠️',
                color: 'var(--nya-red)'
            })
            return
        }

        // Deduct balance
        addTransaction(`Envoi Colis - Réf. ${recipientName}`, finalCost, 'debit')

        const trackNum = `NYA-TR-${Math.floor(10000 + Math.random() * 90000)}-CI`
        const newShipment: Shipment = {
            id: trackNum,
            from: fromCity,
            to: toCity,
            type: selectedType.name,
            weight,
            status: 'pending',
            statusText: 'En attente de collecte par le coursier Sirius',
            progress: 15,
            date: new Date().toISOString().split('T')[0]
        }

        setShipments(prev => [newShipment, ...prev])

        // reset form inputs
        setRecipientName('')
        setRecipientPhone('')
        setExpress(false)

        push({
            type: 'reward',
            title: 'Expédition Enregistrée !',
            message: `Le colis ${trackNum} a été confié aux Scribes de la logistique.`,
            icon: '📦',
            color: 'var(--nya-sirius)'
        })
    }

    const handleSearchTracking = (e: React.FormEvent) => {
        e.preventDefault()
        const found = shipments.find(s => s.id.toLowerCase() === searchTrackNum.trim().toLowerCase())
        if (found) {
            setSearchedShipment(found)
        } else {
            push({
                type: 'system',
                title: 'Colis introuvable',
                message: 'Aucun enregistrement trouvé pour ce numéro de suivi.',
                icon: '🔎',
                color: 'var(--nya-red)'
            })
            setSearchedShipment(null)
        }
    }

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 100 }}>
            <Starfield />
            <CosmicBackground />
            <Navbar />

            <main className="max-w-container" style={{ paddingTop: 120, position: 'relative', zIndex: 2 }}>
                
                {/* Header */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
                    <div className="cosmo-label">Écosystème Sirius {" > "} Nya Transit</div>
                    <h1 className="text-shimmer" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                        NYA TRANSIT
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 600 }}>
                        Faites transiter vos biens en toute sécurité sur tout le réseau ivoirien. Suivez l'alignement de vos expéditions du ramassage à la remise en main propre.
                    </p>
                </div>

                {/* Dashboard grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, alignItems: 'start' }}>
                    
                    {/* Left Column: Booking Form */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
                        
                        <div style={{
                            background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                            borderRadius: 24, padding: 24
                        }}>
                            <h3 style={{
                                fontFamily: 'var(--font-display)', fontSize: '1.3rem',
                                fontWeight: 900, color: 'var(--text-primary)', marginBottom: 8,
                                display: 'flex', alignItems: 'center', gap: 10
                            }}>
                                <Truck size={20} style={{ color: 'var(--nya-ochre)' }} />
                                EXPÉDIER UN NOUVEAU COLIS
                            </h3>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 24 }}>
                                Calculez vos frais de port de manière transparente et créez un bordereau d'expédition instantané.
                            </p>

                            <form onSubmit={handleCreateShipment} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                
                                {/* Route Cities Selection */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    <div>
                                        <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>VILLE DE DÉPART</label>
                                        <select
                                            value={fromCity}
                                            onChange={(e) => setFromCity(e.target.value)}
                                            style={{
                                                width: '100%', padding: '12px', borderRadius: 10,
                                                background: 'var(--bg-primary)', border: '1px solid var(--border-default)',
                                                color: '#fff', fontSize: '0.75rem', outline: 'none'
                                            }}
                                        >
                                            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>VILLE DE DESTINATION</label>
                                        <select
                                            value={toCity}
                                            onChange={(e) => setToCity(e.target.value)}
                                            style={{
                                                width: '100%', padding: '12px', borderRadius: 10,
                                                background: 'var(--bg-primary)', border: '1px solid var(--border-default)',
                                                color: '#fff', fontSize: '0.75rem', outline: 'none'
                                            }}
                                        >
                                            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* Package Specs */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
                                    <div>
                                        <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>TYPE DE CONTENU</label>
                                        <select
                                            value={packageTypeId}
                                            onChange={(e) => setPackageTypeId(e.target.value)}
                                            style={{
                                                width: '100%', padding: '12px', borderRadius: 10,
                                                background: 'var(--bg-primary)', border: '1px solid var(--border-default)',
                                                color: '#fff', fontSize: '0.75rem', outline: 'none'
                                            }}
                                        >
                                            {PACKAGE_TYPES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                            <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>POIDS ESTIMÉ</label>
                                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--nya-gold)' }}>{weight} kg</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1"
                                            max="100"
                                            value={weight}
                                            onChange={(e) => setWeight(parseInt(e.target.value))}
                                            style={{ width: '100%', accentColor: 'var(--nya-ochre)', height: 6, background: 'var(--bg-primary)', borderRadius: 3 }}
                                        />
                                    </div>
                                </div>

                                {/* Speed selection */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border-default)' }}>
                                    <div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fff', display: 'block' }}>LIVRAISON EXPRESS SIRIUS (+50%)</span>
                                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Transit aérien/routier prioritaire en moins de 12 heures</span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={express}
                                        onChange={(e) => setExpress(e.target.checked)}
                                        style={{ width: 18, height: 18, accentColor: 'var(--nya-ochre)', cursor: 'pointer' }}
                                    />
                                </div>

                                {/* Recipient information */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, borderTop: '1px solid var(--border-default)', paddingTop: 20 }}>
                                    <div>
                                        <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>NOM DU DESTINATAIRE</label>
                                        <input
                                            type="text"
                                            value={recipientName}
                                            onChange={(e) => setRecipientName(e.target.value)}
                                            placeholder="Ex: Fatou Diallo"
                                            required
                                            style={{
                                                width: '100%', padding: '12px', fontSize: '0.75rem',
                                                background: 'var(--bg-primary)', border: '1px solid var(--border-default)',
                                                borderRadius: 10, color: '#fff', outline: 'none'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>TÉLÉPHONE DESTINATAIRE</label>
                                        <input
                                            type="text"
                                            value={recipientPhone}
                                            onChange={(e) => setRecipientPhone(e.target.value)}
                                            placeholder="Ex: +225 07 08 92 10"
                                            required
                                            style={{
                                                width: '100%', padding: '12px', fontSize: '0.75rem',
                                                background: 'var(--bg-primary)', border: '1px solid var(--border-default)',
                                                borderRadius: 10, color: '#fff', outline: 'none'
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Calculation details and submit */}
                                <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                                    <div>
                                        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>COÛT ESTIMÉ DE L'EXPÉDITION</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                                            <Coins size={16} style={{ color: 'var(--nya-gold)' }} />
                                            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--nya-gold)', fontFamily: 'var(--font-display)' }}>
                                                {finalCost} Coins
                                            </span>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                                (~ {(finalCost * 100).toLocaleString('fr-FR')} FCFA)
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                        style={{ padding: '12px 32px', fontSize: '0.75rem' }}
                                    >
                                        ENVOYER LE COLIS
                                    </button>
                                </div>

                            </form>
                        </div>

                    </div>

                    {/* Right Column: Tracking & Active list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                        
                        {/* Interactive Tracking Search */}
                        <div style={{
                            background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                            borderRadius: 24, padding: 24
                        }}>
                            <h3 style={{
                                fontFamily: 'var(--font-display)', fontSize: '1.2rem',
                                fontWeight: 900, color: 'var(--text-primary)', marginBottom: 16,
                                display: 'flex', alignItems: 'center', gap: 10
                            }}>
                                <Search size={18} style={{ color: 'var(--nya-gold)' }} />
                                SUIVI DE COLIS SIRIUS
                            </h3>

                            <form onSubmit={handleSearchTracking} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                                <input
                                    type="text"
                                    placeholder="Ex: NYA-TR-58932-CI"
                                    value={searchTrackNum}
                                    onChange={(e) => setSearchTrackNum(e.target.value)}
                                    required
                                    style={{
                                        flex: 1, padding: '10px 14px', fontSize: '0.75rem',
                                        background: 'var(--bg-primary)', border: '1px solid var(--border-default)',
                                        borderRadius: 10, color: '#fff', outline: 'none'
                                    }}
                                />
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    style={{ padding: '10px 20px', fontSize: '0.7rem', borderRadius: 10 }}
                                >
                                    RECHERCHER
                                </button>
                            </form>

                            {/* Search result card */}
                            <AnimatePresence>
                                {searchedShipment && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="toguna-glass"
                                        style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, borderColor: 'var(--nya-gold)' }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                                            <span style={{ fontWeight: 800, color: 'var(--nya-gold)' }}>{searchedShipment.id}</span>
                                            <span style={{ color: 'var(--text-muted)' }}>Date : {searchedShipment.date}</span>
                                        </div>

                                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#fff' }}>
                                            <span>{searchedShipment.from}</span>
                                            <ArrowRight size={12} style={{ color: 'var(--nya-ochre)' }} />
                                            <span>{searchedShipment.to}</span>
                                        </div>

                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                                                <span>Statut : {searchedShipment.statusText}</span>
                                                <span>{searchedShipment.progress}%</span>
                                            </div>
                                            <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                                                <div style={{ width: `${searchedShipment.progress}%`, height: '100%', background: searchedShipment.status === 'delivered' ? 'var(--nya-sirius)' : 'var(--nya-ochre)' }} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Active Shipment list */}
                        <div style={{
                            background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                            borderRadius: 24, padding: 24
                        }}>
                            <h3 style={{
                                fontFamily: 'var(--font-display)', fontSize: '1.2rem',
                                fontWeight: 900, color: 'var(--text-primary)', marginBottom: 20,
                                display: 'flex', alignItems: 'center', gap: 10
                            }}>
                                <Package size={18} style={{ color: 'var(--nya-ochre)' }} />
                                EXPÉDITIONS EN COURS ({shipments.length})
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {shipments.map(s => (
                                    <div
                                        key={s.id}
                                        className="toguna-glass"
                                        style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem' }}>
                                            <span style={{ fontWeight: 800, color: 'var(--nya-gold)', fontFamily: 'var(--font-mono)' }}>{s.id}</span>
                                            <span style={{
                                                padding: '2px 8px', borderRadius: 4,
                                                background: s.status === 'delivered' ? 'rgba(0,229,160,0.1)' : 'rgba(184,92,46,0.1)',
                                                color: s.status === 'delivered' ? 'var(--nya-sirius)' : 'var(--nya-ochre)',
                                                fontWeight: 800, fontSize: '0.55rem'
                                            }}>
                                                {s.status.toUpperCase()}
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#fff' }}>
                                            <span>{s.from}</span>
                                            <ArrowRight size={12} style={{ color: 'var(--nya-ochre)', opacity: 0.5 }} />
                                            <span>{s.to}</span>
                                        </div>

                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                                                <span>{s.statusText}</span>
                                                <span>{s.progress}%</span>
                                            </div>
                                            <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                                                <div style={{ width: `${s.progress}%`, height: '100%', background: s.status === 'delivered' ? 'var(--nya-sirius)' : 'var(--nya-ochre)' }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Trust badge */}
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.01)', border: '1px dashed var(--border-default)',
                            borderRadius: 20, padding: 20, display: 'flex', gap: 12, alignItems: 'flex-start'
                        }}>
                            <ShieldCheck size={18} style={{ color: 'var(--nya-sirius)', flexShrink: 0, marginTop: 2 }} />
                            <div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fff', display: 'block' }}>Transit Assuré par Sirius</span>
                                <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: 1.4, marginTop: 4 }}>
                                    Vos colis sont suivis et assurés jusqu'à 500 Coins contre la perte ou la détérioration lors du transport.
                                </p>
                            </div>
                        </div>

                    </div>

                </div>

            </main>
            <Footer />
        </div>
    )
}

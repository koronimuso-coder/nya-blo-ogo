import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { useNotificationStore } from '../stores/notificationStore'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import {
    ShoppingCart, Utensils,
    Search, Plus, Minus, Navigation,
    Coins, ArrowRight, ShieldCheck
} from 'lucide-react'

interface FoodItem {
    id: string
    name: string
    desc: string
    price: number
    image: string
    category: string
}

interface Restaurant {
    id: string
    name: string
    rating: number
    time: string
    deliveryFee: number
    image: string
    menu: FoodItem[]
}

const RESTAURANTS: Restaurant[] = [
    {
        id: 'r1',
        name: 'Le Kiosque d\'Adjamé',
        rating: 4.8,
        time: '15-25 min',
        deliveryFee: 10,
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
        menu: [
            { id: 'f1', name: 'Garba de Thon Royal', desc: 'Attiéké de qualité supérieure servi avec du thon frit croquant, du piment frais coupé et des oignons.', price: 25, category: 'plats', image: '🐟' },
            { id: 'f2', name: 'Alloco Spécial Piment', desc: 'Bananes plantains frites dorées, servies avec une sauce tomate pimentée maison.', price: 15, category: 'accompagnements', image: '🍌' },
            { id: 'f3', name: 'Poisson Braisé du Port', desc: 'Poisson entier braisé au charbon de bois, mariné aux épices du terroir.', price: 40, category: 'plats', image: '🐟' }
        ]
    },
    {
        id: 'r2',
        name: 'Chez Maman Goli - Cocody',
        rating: 4.9,
        time: '30-40 min',
        deliveryFee: 15,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80',
        menu: [
            { id: 'f4', name: 'Foutou Banane Sauce Graine', desc: 'Boule de foutou banane traditionnelle servie dans une sauce onctueuse de graines de palme et viande de brousse.', price: 45, category: 'plats', image: '🍲' },
            { id: 'f5', name: 'Kedjenou de Poulet', desc: 'Ragoût de poulet cuit à l\'étouffée dans une jarre en terre cuite avec légumes et piments.', price: 35, category: 'plats', image: '🍗' },
            { id: 'f6', name: 'Plékobilé Poisson fumé', desc: 'Sauce de feuilles locales accompagnée de poisson fumé et d\'attiéké frais.', price: 30, category: 'plats', image: '🥬' }
        ]
    },
    {
        id: 'r3',
        name: 'Sirius Kitchen (Afro-Futuriste)',
        rating: 4.7,
        time: '20-30 min',
        deliveryFee: 12,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
        menu: [
            { id: 'f7', name: 'Cosmic Fonio Bowl', desc: 'Salade tiède de fonio bio, légumes croquants, avocat, graines de sésame et vinaigrette au moringa.', price: 28, category: 'salades', image: '🥗' },
            { id: 'f8', name: 'Burger de Patate Douce', desc: 'Steak de patate douce et pois chiches dans un pain artisanal au charbon actif, mayonnaise épicée.', price: 32, category: 'plats', image: '🍔' },
            { id: 'f9', name: 'Infusion Hibiscus-Gingembre', desc: 'Bissap revisité infusé à froid avec du gingembre frais et une touche de menthe.', price: 10, category: 'boissons', image: '🍹' }
        ]
    }
]

export default function Food() {
    const { user, addTransaction } = useAuthStore()
    const { push } = useNotificationStore()

    const [selectedCategory, setSelectedCategory] = useState('tous')
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant>(RESTAURANTS[0])
    
    // Cart state
    const [cart, setCart] = useState<{ [key: string]: { item: FoodItem; quantity: number } }>({})
    
    // Delivery tracking simulation state
    const [deliveryState, setDeliveryState] = useState<'idle' | 'preparing' | 'on_the_way' | 'delivered'>('idle')
    const [deliveryProgress, setDeliveryProgress] = useState(0)
    const [courierLocation, setCourierLocation] = useState({ x: 10, y: 80 })

    const addToCart = (item: FoodItem) => {
        setCart(prev => {
            const current = prev[item.id] ? prev[item.id].quantity : 0
            return {
                ...prev,
                [item.id]: { item, quantity: current + 1 }
            }
        })
        push({
            type: 'system',
            title: 'Ajouté au panier',
            message: `${item.name} a été ajouté à votre panier.`,
            icon: '🛒',
            color: 'var(--nya-ochre)'
        })
    }

    const removeFromCart = (itemId: string) => {
        setCart(prev => {
            if (!prev[itemId]) return prev
            const newQty = prev[itemId].quantity - 1
            const newCart = { ...prev }
            if (newQty <= 0) {
                delete newCart[itemId]
            } else {
                newCart[itemId] = { ...newCart[itemId], quantity: newQty }
            }
            return newCart
        })
    }

    const cartTotal = Object.values(cart).reduce((sum, entry) => sum + (entry.item.price * entry.quantity), 0)
    const finalTotal = cartTotal + (cartTotal > 0 ? selectedRestaurant.deliveryFee : 0)

    // Simulate delivery tracker
    useEffect(() => {
        let interval: any
        if (deliveryState === 'preparing') {
            interval = setInterval(() => {
                setDeliveryProgress(p => {
                    if (p >= 100) {
                        setDeliveryState('on_the_way')
                        push({
                            type: 'system',
                            title: 'Commande en route !',
                            message: 'Votre livreur Sirius a récupéré votre repas et se dirige vers votre constellation.',
                            icon: '🛵',
                            color: 'var(--nya-gold)'
                        })
                        return 0
                    }
                    return p + 10
                })
            }, 600)
        } else if (deliveryState === 'on_the_way') {
            interval = setInterval(() => {
                setDeliveryProgress(p => {
                    // Update simulated courier coordinates moving towards destination
                    setCourierLocation(loc => ({
                        x: loc.x + (85 - loc.x) * 0.15,
                        y: loc.y - (loc.y - 25) * 0.15
                    }))
                    if (p >= 100) {
                        setDeliveryState('delivered')
                        addTransaction(`Repas Sirius - ${selectedRestaurant.name}`, finalTotal, 'debit')
                        push({
                            type: 'reward',
                            title: 'Repas Livré !',
                            message: `Votre repas chaud de chez ${selectedRestaurant.name} a été livré. Bon appétit !`,
                            icon: '🍲',
                            color: 'var(--nya-sirius)'
                        })
                        return 100
                    }
                    return p + 8
                })
            }, 800)
        }
        return () => clearInterval(interval)
    }, [deliveryState])

    const handleCheckout = () => {
        if (finalTotal > (user?.nyaCoins ?? 0)) {
            push({
                type: 'system',
                title: 'Solde insuffisant',
                message: 'Vous n\'avez pas assez de Nya Coins pour finaliser cette commande.',
                icon: '⚠️',
                color: 'var(--nya-red)'
            })
            return
        }

        setDeliveryState('preparing')
        setDeliveryProgress(0)
        setCourierLocation({ x: 10, y: 80 })
        setCart({})
    }

    const filteredMenu = selectedRestaurant.menu.filter(item => {
        const matchesCategory = selectedCategory === 'tous' || item.category === selectedCategory
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.desc.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesCategory && matchesSearch
    })

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 100 }}>
            <Starfield />
            <CosmicBackground />
            <Navbar />

            <main className="max-w-container" style={{ paddingTop: 120, position: 'relative', zIndex: 2 }}>
                
                {/* Header */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
                    <div className="cosmo-label">Écosystème Sirius {" > "} Nya Food</div>
                    <h1 className="text-shimmer" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                        NYA FOOD
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 600 }}>
                        Commandez les saveurs authentiques du terroir ivoirien et sahélien, préparées par des chefs certifiés et livrées en un temps record.
                    </p>
                </div>

                {/* Tracking View Overlay when Active */}
                <AnimatePresence>
                    {deliveryState !== 'idle' && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="toguna-glass-strong"
                            style={{ padding: 28, marginBottom: 32, border: '1px solid var(--nya-gold)' }}
                        >
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                                <div>
                                    <div className="accent-label" style={{ color: 'var(--nya-gold)' }}>SUIVI EN DIRECT</div>
                                    <h3 style={{ fontSize: '1.2rem', marginTop: 4 }}>
                                        {deliveryState === 'preparing' && '🍳 PRÉPARATION DE VOTRE COMMANDE...'}
                                        {deliveryState === 'on_the_way' && '🛵 LE COURSIER EST EN ROUTE !'}
                                        {deliveryState === 'delivered' && '✅ LIVRAISON EFFECTUÉE !'}
                                    </h3>
                                </div>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    {deliveryState !== 'delivered' && (
                                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--nya-gold)', animation: 'pulse-dot 1.5s infinite' }} />
                                    )}
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                                        ORIGINE : {selectedRestaurant.name.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Simulated mini Map */}
                            <div style={{
                                width: '100%', height: 160, borderRadius: 16, background: '#0a0a0f',
                                border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden',
                                marginBottom: 20
                            }}>
                                {/* Grid lines simulating streets */}
                                <div style={{ position: 'absolute', top: '30%', left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.03)' }} />
                                <div style={{ position: 'absolute', top: '70%', left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.03)' }} />
                                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '25%', width: 1, background: 'rgba(255,255,255,0.03)' }} />
                                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '60%', width: 1, background: 'rgba(255,255,255,0.03)' }} />
                                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '85%', width: 1, background: 'rgba(255,255,255,0.03)' }} />

                                {/* Restaurant Pin */}
                                <div style={{ position: 'absolute', left: '10%', top: '70%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.2rem' }}>🍳</div>
                                    <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', display: 'block', whiteSpace: 'nowrap' }}>{selectedRestaurant.name}</span>
                                </div>

                                {/* Destination Pin */}
                                <div style={{ position: 'absolute', left: '85%', top: '25%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.2rem', animation: 'bounce 2s infinite' }}>📍</div>
                                    <span style={{ fontSize: '0.55rem', color: 'var(--nya-sirius)', display: 'block', fontWeight: 800 }}>VOTRE NEXUS</span>
                                </div>

                                {/* Animated Courier Position */}
                                {deliveryState !== 'delivered' && (
                                    <motion.div
                                        style={{
                                            position: 'absolute',
                                            left: `${courierLocation.x}%`,
                                            top: `${courierLocation.y}%`,
                                            transform: 'translate(-50%, -50%)',
                                            zIndex: 10
                                        }}
                                    >
                                        <div style={{
                                            width: 32, height: 32, borderRadius: '50%',
                                            background: 'var(--nya-gold)', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center',
                                            boxShadow: '0 0 15px var(--nya-gold)'
                                        }}>
                                            <Navigation size={14} style={{ color: '#000', transform: 'rotate(45deg)' }} />
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Progress bar */}
                            <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden', marginBottom: 12 }}>
                                <motion.div
                                    animate={{ width: `${deliveryProgress}%` }}
                                    style={{ height: '100%', background: 'linear-gradient(90deg, var(--nya-ochre), var(--nya-gold))', borderRadius: 3 }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                    {deliveryState === 'preparing' && 'Le chef assemble vos ingrédients sacrés...'}
                                    {deliveryState === 'on_the_way' && 'Votre livreur trace sa route inter-dimensionnelle.'}
                                    {deliveryState === 'delivered' && 'Livré à votre portail Cocody.'}
                                </span>
                                {deliveryState === 'delivered' && (
                                    <button
                                        onClick={() => setDeliveryState('idle')}
                                        className="btn-primary"
                                        style={{ padding: '8px 20px', fontSize: '0.7rem' }}
                                    >
                                        TERMINER LE SUIVI
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Dashboard layout */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
                    
                    {/* Left Column: Restaurants & Menu */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                        
                        {/* Restaurant Selector Row */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div className="accent-label">CUISINES & MAQUIS DE CONFIANCE</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                                {RESTAURANTS.map(rest => {
                                    const isSelected = selectedRestaurant.id === rest.id
                                    return (
                                        <div
                                            key={rest.id}
                                            onClick={() => {
                                                if (deliveryState === 'idle') setSelectedRestaurant(rest)
                                            }}
                                            style={{
                                                background: isSelected ? 'rgba(184,92,46,0.06)' : 'var(--nya-deep)',
                                                border: isSelected ? '1.5px solid var(--nya-ochre)' : '1px solid var(--border-default)',
                                                borderRadius: 20, cursor: deliveryState === 'idle' ? 'pointer' : 'not-allowed',
                                                overflow: 'hidden', transition: 'all 0.3s'
                                            }}
                                        >
                                            <div style={{ height: 110, width: '100%', position: 'relative' }}>
                                                <img src={rest.image} alt={rest.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                                                <div style={{ position: 'absolute', bottom: 8, left: 12, display: 'flex', gap: 8 }}>
                                                    <span style={{ background: '#000', padding: '3px 8px', borderRadius: 6, fontSize: '0.6rem', fontWeight: 800 }}>
                                                        ⭐️ {rest.rating}
                                                    </span>
                                                    <span style={{ background: '#000', padding: '3px 8px', borderRadius: 6, fontSize: '0.6rem', fontWeight: 800 }}>
                                                        🕒 {rest.time}
                                                    </span>
                                                </div>
                                            </div>
                                            <div style={{ padding: 16 }}>
                                                <h4 style={{ fontSize: '0.95rem', color: '#fff' }}>{rest.name}</h4>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                                                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Livraison :</span>
                                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--nya-gold)' }}>{rest.deliveryFee} Nya Coins</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Search & Categories */}
                        <div style={{
                            display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', 
                            alignItems: 'center', gap: 16, borderTop: '1px solid var(--border-default)', paddingTop: 32
                        }}>
                            {/* Categories */}
                            <div style={{ display: 'flex', gap: 10 }}>
                                {[
                                    { id: 'tous', name: 'Tous les Plats' },
                                    { id: 'plats', name: 'Plats Principaux' },
                                    { id: 'accompagnements', name: 'Accompagnements' },
                                    { id: 'boissons', name: 'Boissons' },
                                ].map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        style={{
                                            background: selectedCategory === cat.id ? 'var(--nya-ochre)' : 'rgba(255,255,255,0.03)',
                                            color: '#fff', border: 'none', borderRadius: 10,
                                            padding: '8px 16px', fontSize: '0.75rem', fontWeight: 700,
                                            cursor: 'pointer', transition: 'all 0.3s'
                                        }}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>

                            {/* Search Input */}
                            <div style={{ position: 'relative', width: '100%', maxWidth: 280 }}>
                                <input
                                    type="text"
                                    placeholder="Rechercher une saveur..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        width: '100%', padding: '10px 14px 10px 38px',
                                        background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                                        borderRadius: 12, color: '#fff', fontSize: '0.75rem', outline: 'none'
                                    }}
                                />
                                <Search size={14} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
                            </div>
                        </div>

                        {/* Menu Items List */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                            {filteredMenu.map(food => {
                                const cartEntry = cart[food.id]
                                return (
                                    <div
                                        key={food.id}
                                        className="toguna-glass"
                                        style={{ padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16 }}
                                    >
                                        <div style={{ display: 'flex', gap: 16 }}>
                                            <span style={{ fontSize: '2.5rem', width: 60, height: 60, borderRadius: 12, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {food.image}
                                            </span>
                                            <div>
                                                <h4 style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 800 }}>{food.name}</h4>
                                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.5, marginTop: 4 }}>
                                                    {food.desc}
                                                </p>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-default)', paddingTop: 12 }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--nya-gold)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <Coins size={14} /> {food.price} Nya Coins
                                                </span>
                                                <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>
                                                    ~ {(food.price * 100).toLocaleString('fr-FR')} FCFA
                                                </span>
                                            </div>

                                            {/* Add/Remove Buttons */}
                                            {cartEntry ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '4px 8px' }}>
                                                    <button onClick={() => removeFromCart(food.id)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                                                        <Minus size={14} />
                                                    </button>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, minWidth: 16, textAlign: 'center' }}>{cartEntry.quantity}</span>
                                                    <button onClick={() => addToCart(food)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => addToCart(food)}
                                                    className="btn-nexus"
                                                    style={{ padding: '8px 16px', fontSize: '0.65rem' }}
                                                >
                                                    AJOUTER
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                    </div>

                    {/* Right Column: Checkout Basket */}
                    <div style={{ position: 'sticky', top: 120, display: 'flex', flexDirection: 'column', gap: 24 }}>
                        
                        {/* Cart Summary */}
                        <div style={{
                            background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                            borderRadius: 24, padding: 24
                        }}>
                            <h3 style={{
                                fontFamily: 'var(--font-display)', fontSize: '1.2rem',
                                fontWeight: 900, color: 'var(--text-primary)', marginBottom: 20,
                                display: 'flex', alignItems: 'center', gap: 10
                            }}>
                                <ShoppingCart size={18} style={{ color: 'var(--nya-ochre)' }} />
                                VOTRE PANIER
                            </h3>

                            {Object.keys(cart).length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '32px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <Utensils size={32} style={{ color: 'var(--text-faint)', margin: '0 auto' }} />
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Le panier est vide pour le moment.</span>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    {/* Items List */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 200, overflowY: 'auto', paddingRight: 4 }}>
                                        {Object.values(cart).map(({ item, quantity }) => (
                                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                                                <div style={{ flex: 1 }}>
                                                    <span style={{ fontWeight: 800, color: '#fff' }}>{item.name}</span>
                                                    <span style={{ color: 'var(--text-muted)', marginLeft: 8 }}>x{quantity}</span>
                                                </div>
                                                <span style={{ fontWeight: 800, color: 'var(--nya-gold)', fontFamily: 'var(--font-mono)' }}>
                                                    {item.price * quantity} Coins
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Cost breakdown */}
                                    <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.7rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                            <span>Sous-total</span>
                                            <span>{cartTotal} Coins</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                            <span>Frais de livraison ({selectedRestaurant.name})</span>
                                            <span>{selectedRestaurant.deliveryFee} Coins</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 800, fontSize: '0.8rem', marginTop: 8 }}>
                                            <span>Total final</span>
                                            <span style={{ color: 'var(--nya-gold)', fontFamily: 'var(--font-mono)' }}>{finalTotal} Coins</span>
                                        </div>
                                    </div>

                                    {/* Checkout button */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleCheckout}
                                        disabled={deliveryState !== 'idle'}
                                        style={{
                                            width: '100%', padding: '14px', borderRadius: 12,
                                            background: 'var(--nya-ochre)', border: 'none',
                                            color: '#fff', fontWeight: 800, fontSize: '0.75rem',
                                            textTransform: 'uppercase', cursor: deliveryState === 'idle' ? 'pointer' : 'not-allowed',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                            marginTop: 8, boxShadow: '0 8px 24px rgba(184,92,46,0.3)'
                                        }}
                                    >
                                        COMMANDER & LIVRER <ArrowRight size={14} />
                                    </motion.button>
                                </div>
                            )}
                        </div>

                        {/* Guarantee Card */}
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.01)', border: '1px dashed var(--border-default)',
                            borderRadius: 20, padding: 20, display: 'flex', gap: 12, alignItems: 'flex-start'
                        }}>
                            <ShieldCheck size={18} style={{ color: 'var(--nya-sirius)', flexShrink: 0, marginTop: 2 }} />
                            <div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fff', display: 'block' }}>Charte de Qualité Sirius</span>
                                <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: 1.4, marginTop: 4 }}>
                                    Tous les restaurants partenaires sont rigoureusement certifiés pour l'hygiène et la qualité. Les livreurs sont géolocalisés et formés.
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

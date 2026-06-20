import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { useNotificationStore } from '../stores/notificationStore'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import { Sprout, Droplet, DollarSign, Sunrise, Activity } from 'lucide-react'

interface Crop {
    id: string
    name: string
    growth: number // 0-100
    humidity: number // 0-100
    baseCycle: string
    marketPrice: string // FCFA / kg
    gradient: string
}

export default function Agriculture() {
    const { addCoins, addScore } = useAuthStore()
    const { push } = useNotificationStore()

    const [crops, setCrops] = useState<Crop[]>([
        { id: '1', name: 'Mil Sacré', growth: 10, humidity: 40, baseCycle: '90 jours', marketPrice: '450', gradient: 'linear-gradient(135deg, #B85C2E 0%, #D4A017 100%)' },
        { id: '2', name: 'Manioc des Falaises', growth: 25, humidity: 50, baseCycle: '180 jours', marketPrice: '350', gradient: 'linear-gradient(135deg, #0a2e1a 0%, #00E5A0 100%)' },
        { id: '3', name: 'Cacao Sirius-Bio', growth: 60, humidity: 75, baseCycle: '270 jours', marketPrice: '1 500', gradient: 'linear-gradient(135deg, #2e1a0a 0%, #C2A888 100%)' },
    ])

    // Dry out soil slowly
    useEffect(() => {
        const interval = setInterval(() => {
            setCrops(prev => prev.map(c => ({
                ...c,
                humidity: Math.max(0, c.humidity - Math.floor(Math.random() * 3) - 1)
            })))
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    const handleIrrigate = (id: string) => {
        setCrops(prev => prev.map(c => {
            if (c.id !== id) return c
            
            const newHumidity = Math.min(100, c.humidity + 25)
            const growthIncrease = c.humidity > 20 ? Math.floor(Math.random() * 8) + 4 : 2
            const newGrowth = Math.min(100, c.growth + growthIncrease)

            if (newGrowth >= 100 && c.growth < 100) {
                // Harvest!
                setTimeout(() => {
                    addCoins(30)
                    addScore(60)
                    push({
                        type: 'reward',
                        title: 'Récolte Effectuée',
                        message: `Vous avez récolté votre ${c.name} ! +30 Nya Coins obtenus.`,
                        icon: '🌾',
                        color: '#00E5A0'
                    })
                    // Reset growth
                    setCrops(curr => curr.map(item => item.id === id ? { ...item, growth: 0 } : item))
                }, 200)
            }

            return {
                ...c,
                humidity: newHumidity,
                growth: newGrowth
            }
        }))
    }

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 100 }}>
            <Starfield />
            <CosmicBackground />
            <Navbar />

            {/* Main content */}
            <main className="max-w-container" style={{ paddingTop: 120, position: 'relative', zIndex: 2 }}>
                
                {/* Hero Header */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginBottom: 48 }}>
                    <div className="cosmo-label">Ogo Farm {" > "} Saisons & Cultures</div>
                    <h1 className="text-shimmer" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                        OGO AGRICULTURE
                    </h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 40, alignItems: 'start' }}>
                    
                    {/* Crops panel */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>VOS CULTURES EN COURS</h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {crops.map((crop) => (
                                <div
                                    key={crop.id}
                                    style={{
                                        background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                                        borderRadius: 24, padding: 24, display: 'grid', gridTemplateColumns: '1fr 2fr 1fr',
                                        gap: 24, alignItems: 'center'
                                    }}
                                >
                                    {/* Icon thumbnail */}
                                    <div style={{
                                        width: '100%', height: 100, borderRadius: 16,
                                        background: crop.gradient, display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        color: '#fff', fontSize: '2.5rem'
                                    }}>
                                        <Sprout />
                                    </div>

                                    {/* Progress info */}
                                    <div>
                                        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', marginBottom: 8 }}>{crop.name}</h4>
                                        
                                        {/* Growth progress bar */}
                                        <div style={{ marginBottom: 14 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                                                <span>CROISSANCE</span>
                                                <span>{crop.growth}%</span>
                                            </div>
                                            <div style={{ width: '100%', height: 6, background: 'var(--bg-primary)', borderRadius: 3, overflow: 'hidden' }}>
                                                <div style={{ width: `${crop.growth}%`, height: '100%', background: 'var(--nya-gold)', borderRadius: 3 }} />
                                            </div>
                                        </div>

                                        {/* Soil Humidity progress bar */}
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                                                <span>HUMIDITÉ DU SOL</span>
                                                <span>{crop.humidity}%</span>
                                            </div>
                                            <div style={{ width: '100%', height: 6, background: 'var(--bg-primary)', borderRadius: 3, overflow: 'hidden' }}>
                                                <div style={{ width: `${crop.humidity}%`, height: '100%', background: '#3b82f6', borderRadius: 3 }} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action button */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleIrrigate(crop.id)}
                                            style={{
                                                padding: '12px', borderRadius: 12,
                                                background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)',
                                                color: '#3b82f6', fontWeight: 800, fontSize: '0.75rem',
                                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                                            }}
                                        >
                                            <Droplet size={14} /> IRRIGUER
                                        </motion.button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Market prices sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        
                        {/* Weather cosmic forecast */}
                        <div style={{
                            background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                            borderRadius: 24, padding: 24
                        }}>
                            <h3 style={{
                                fontFamily: 'var(--font-display)', fontSize: '1.1rem',
                                fontWeight: 900, color: '#fff', marginBottom: 20,
                                display: 'flex', alignItems: 'center', gap: 10
                            }}>
                                <Sunrise size={18} style={{ color: 'var(--nya-gold)' }} />
                                CLIMAT DE SIRIUS
                            </h3>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                <p style={{ fontWeight: 700, color: '#00E5A0' }}>Saison Sèche Lunaire</p>
                                <p style={{ marginTop: 6 }}>Le sol s'assèche rapidement. Une irrigation régulière (+25% humidité) est requise pour assurer la maturation de vos plants.</p>
                            </div>
                        </div>

                        {/* Market Prices */}
                        <div style={{
                            background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                            borderRadius: 24, padding: 24
                        }}>
                            <h3 style={{
                                fontFamily: 'var(--font-display)', fontSize: '1.1rem',
                                fontWeight: 900, color: '#fff', marginBottom: 20,
                                display: 'flex', alignItems: 'center', gap: 10
                            }}>
                                <Activity size={18} style={{ color: 'var(--nya-ochre)' }} />
                                COURS DU MARCHÉ
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {crops.map(crop => (
                                    <div key={crop.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-elevated)', padding: '12px 16px', borderRadius: 12 }}>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>{crop.name}</span>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--nya-gold)', display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <DollarSign size={12} /> {crop.marketPrice} FCFA / kg
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                </div>

            </main>
            <Footer />
        </div>
    )
}

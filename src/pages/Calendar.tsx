import { motion } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import { Calendar as CalendarIcon, Sun, Moon, Star, Compass } from 'lucide-react'

export default function Calendar() {

    const getDogonSeason = () => {
        const month = new Date().getMonth()
        if (month >= 10 || month <= 1) {
            return { name: 'Saison Bado (Harmattan)', desc: 'Climat sec et vent chaud venu du désert. Période propice à la récolte du mil et aux initiations orales dans le Toguna.' }
        } else if (month >= 2 && month <= 5) {
            return { name: 'Saison Kebe (Chaleur)', desc: 'Préparation des sols et semailles. La constellation de Sirius B est particulièrement visible dans le ciel nocturne.' }
        } else {
            return { name: 'Saison Nay (Pluies)', desc: 'Saison humide de grande fertilité. Période de forte croissance pour le manioc et le maïs.' }
        }
    }

    const season = getDogonSeason()

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 100 }}>
            <Starfield />
            <CosmicBackground />
            <Navbar />

            {/* Main content */}
            <main className="max-w-container" style={{ paddingTop: 120, position: 'relative', zIndex: 2 }}>
                
                {/* Hero Header */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginBottom: 48 }}>
                    <div className="cosmo-label">Observatoire Sirius {" > "} Temps Astrologique</div>
                    <h1 className="text-shimmer" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                        CALENDRIER SIRIUS
                    </h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, alignItems: 'center' }}>
                    
                    {/* Rotating Astrolabe */}
                    <div style={{
                        background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                        borderRadius: 24, padding: 40, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', minHeight: 420,
                        boxShadow: '0 25px 50px rgba(0,0,0,0.5)', position: 'relative'
                    }}>
                        {/* Astrolabe circular layout */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
                            style={{
                                width: 260, height: 260, borderRadius: '50%',
                                border: '4px dashed var(--nya-gold)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                position: 'relative',
                                background: 'radial-gradient(circle, rgba(184,92,46,0.05) 0%, rgba(0,0,0,0.8) 80%)'
                            }}
                        >
                            {/* Inner rings */}
                            <div style={{
                                width: 180, height: 180, borderRadius: '50%',
                                border: '2px solid rgba(212,160,23,0.3)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <div style={{
                                    width: 100, height: 100, borderRadius: '50%',
                                    background: 'var(--nya-ochre)', opacity: 0.15,
                                    border: '1.5px solid var(--nya-gold)'
                                }} />
                            </div>

                            {/* Seasonal nodes */}
                            <div style={{ position: 'absolute', top: 12, color: '#fff', fontSize: '0.6rem', fontWeight: 900 }}>BADO</div>
                            <div style={{ position: 'absolute', bottom: 12, color: '#fff', fontSize: '0.6rem', fontWeight: 900 }}>NAY</div>
                            <div style={{ position: 'absolute', right: 12, color: '#fff', fontSize: '0.6rem', fontWeight: 900 }}>KEBE</div>
                            <div style={{ position: 'absolute', left: 12, color: '#fff', fontSize: '0.6rem', fontWeight: 900 }}>PÔ</div>
                        </motion.div>

                        <div style={{ position: 'absolute', bottom: 20, fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.1em' }}>
                            MOUVEMENT DE ROTATION LUNAIRE
                        </div>
                    </div>

                    {/* Astronomical data details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {/* Day indicator */}
                        <div style={{
                            background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                            borderRadius: 24, padding: 24, display: 'flex', alignItems: 'center', gap: 16
                        }}>
                            <CalendarIcon size={28} style={{ color: 'var(--nya-ochre)' }} />
                            <div>
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)' }}>JOUR ACTUEL</span>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff', marginTop: 4 }}>
                                    {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </h3>
                            </div>
                        </div>

                        {/* Season details */}
                        <div style={{
                            background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                            borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column', gap: 12
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Sun size={18} style={{ color: 'var(--nya-gold)' }} />
                                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>{season.name}</h4>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                {season.desc}
                            </p>
                        </div>

                        {/* Cosmic alignments */}
                        <div style={{
                            background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                            borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column', gap: 12
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Moon size={18} style={{ color: 'var(--nya-gold)' }} />
                                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>ALIGNEMENTS COSMIQUES</h4>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', borderTop: '1px solid var(--border-default)', paddingTop: 10 }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Visibilité Sirius B</span>
                                <span style={{ color: '#00E5A0', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}><Star size={12} /> Maximale (96%)</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Force Gravitationnelle</span>
                                <span style={{ color: 'var(--nya-gold)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}><Compass size={12} /> Alignée</span>
                            </div>
                        </div>
                    </div>

                </div>

            </main>
            <Footer />
        </div>
    )
}

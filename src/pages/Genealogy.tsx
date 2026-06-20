import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { useNotificationStore } from '../stores/notificationStore'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import { MapPin, Sparkles, Music } from 'lucide-react'

interface ClanData {
    name: string
    totem: string
    animal: string
    origin: string
    history: string
    praises: string
}

const CLANS: Record<string, ClanData> = {
    coulibaly: {
        name: 'Coulibaly / Diallo',
        totem: '🐍 Python',
        animal: 'Python Sacré',
        origin: 'Royaume de Ségou (Mali)',
        history: 'Lignée fondatrice de dynasties. Le nom Coulibaly signifie littéralement "sans pirogue", rappelant un ancêtre ayant traversé le fleuve Niger sur le dos d\'un python géant.',
        praises: 'Diarra ! Koulibali ! Kulibali ! Les rois du Mandé.'
    },
    kone: {
        name: 'Koné / Condé',
        totem: '🐘 Éléphant',
        animal: 'Éléphant Royal',
        origin: 'Empire du Mandé',
        history: 'Gardiens des traités de paix de Kouroukan Fouga. Synonyme de force tranquille, de dignité et de sagesse millénaire.',
        praises: 'Condé ! Koné ! Les porteurs du Mandé.'
    },
    traore: {
        name: 'Traoré / Diarra',
        totem: '🦁 Lion',
        animal: 'Lion du Sahel',
        origin: 'Dynasties guerrières de Kong',
        history: 'Lignée de chefs militaires et de grands conquérants de l\'Empire du Mali. Protecteurs des caravanes marchandes.',
        praises: 'Diarra ! Traoré ! Les rugissants.'
    },
    diallo: {
        name: 'Diallo / Ka',
        totem: '🐂 Vache',
        animal: 'Zébu du Sahel',
        origin: 'Fouta Djallon',
        history: 'Gardiens des troupeaux et de la poésie pastorale. Symbolise l\'abondance, la patience et le respect sacré de la nature.',
        praises: 'Diallo ! Ka ! Les pasteurs.'
    }
}

export default function Genealogy() {
    const { addScore } = useAuthStore()
    const { push } = useNotificationStore()

    const [query, setQuery] = useState('')
    const [activeClan, setActiveClan] = useState<ClanData | null>(null)

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const key = query.trim().toLowerCase()
        
        // Match partial key
        const matchKey = Object.keys(CLANS).find(k => k.includes(key) || key.includes(k))
        if (matchKey) {
            setActiveClan(CLANS[matchKey])
        } else {
            push({
                type: 'system',
                title: 'Lignée introuvable',
                message: 'Le nom recherché n\'est pas encore catalogué dans la mémoire du Toguna.',
                icon: '❓',
                color: '#ef4444'
            })
        }
    }

    const handlePraise = () => {
        addScore(15)
        push({
            type: 'reward',
            title: 'Louanges Chantées',
            message: 'Vous avez honoré la mémoire des ancêtres. +15 Nya Score obtenu.',
            icon: '🎵',
            color: '#00E5A0'
        })
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
                    <div className="cosmo-label">Conseil des Scribes {" > "} Traditions</div>
                    <h1 className="text-shimmer" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                        L'ARBRE GÉNÉALOGIQUE
                    </h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 40, alignItems: 'center' }}>
                    
                    {/* Left: Baobab Tree SVG & Search */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center' }}>
                        
                        {/* Baobab Tree Graphics */}
                        <svg width="220" height="220" viewBox="0 0 200 200" style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}>
                            <path d="M 90,190 C 85,150 70,120 70,100 C 70,70 130,70 130,100 C 130,120 115,150 110,190 Z" fill="#8B4522" />
                            {/* Foliage */}
                            <circle cx="70" cy="80" r="30" fill="rgba(0,229,160,0.2)" stroke="var(--nya-gold)" strokeWidth="1" />
                            <circle cx="130" cy="80" r="30" fill="rgba(0,229,160,0.2)" stroke="var(--nya-gold)" strokeWidth="1" />
                            <circle cx="100" cy="50" r="35" fill="rgba(0,229,160,0.3)" stroke="var(--nya-gold)" strokeWidth="1.5" />
                        </svg>

                        {/* Search form */}
                        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, width: '100%' }}>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Rechercher un nom (Kone, Diallo, Coulibaly, Traore)..."
                                required
                                style={{
                                    flex: 1, padding: '14px 16px',
                                    background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                                    borderRadius: 12, color: 'var(--text-primary)', outline: 'none'
                                }}
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                style={{
                                    padding: '14px 24px', borderRadius: 12,
                                    background: 'var(--nya-ochre)', border: 'none',
                                    color: '#fff', fontWeight: 800, cursor: 'pointer'
                                }}
                            >
                                CHERCHER
                            </motion.button>
                        </form>
                    </div>

                    {/* Right: Clan Detail Result Panel */}
                    <div style={{ minHeight: 320 }}>
                        <AnimatePresence mode="wait">
                            {activeClan ? (
                                <motion.div
                                    key={activeClan.name}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    style={{
                                        background: 'var(--nya-deep)', border: '1px solid rgba(212,160,23,0.3)',
                                        borderRadius: 24, padding: 32, boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900, color: '#fff' }}>
                                            {activeClan.name}
                                        </h3>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--nya-gold)', background: 'rgba(212,160,23,0.1)', padding: '6px 14px', borderRadius: 20 }}>
                                            {activeClan.totem}
                                        </span>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            <MapPin size={14} style={{ color: 'var(--nya-ochre)' }} />
                                            <span>Origines : {activeClan.origin}</span>
                                        </div>

                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                            {activeClan.history}
                                        </p>
                                    </div>

                                    <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Louanges Sacrées</div>
                                            <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--nya-gold)', marginTop: 4 }}>"{activeClan.praises}"</p>
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handlePraise}
                                            style={{
                                                padding: '10px 16px', borderRadius: 10,
                                                background: 'rgba(212,160,23,0.1)', border: '1px solid rgba(212,160,23,0.3)',
                                                color: 'var(--nya-gold)', fontWeight: 800, fontSize: '0.75rem',
                                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                                            }}
                                        >
                                            <Music size={14} /> Chanter
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="placeholder"
                                    style={{
                                        background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                                        borderRadius: 24, padding: 40, textAlign: 'center', color: 'var(--text-faint)'
                                    }}
                                >
                                    <Sparkles size={48} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
                                    <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Mémoires généalogiques</p>
                                    <p style={{ fontSize: '0.7rem', marginTop: 4 }}>
                                        Saisissez votre nom de famille dans le moteur à gauche pour découvrir vos totems et louanges d'ancêtres.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>

            </main>
            <Footer />
        </div>
    )
}

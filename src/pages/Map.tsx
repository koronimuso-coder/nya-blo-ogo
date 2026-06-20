import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import { useAudioFX } from '../hooks/useAudioFX'
import { useAuthStore } from '../stores/authStore'
import { useNotificationStore } from '../stores/notificationStore'
import { Compass, BookOpen, Sparkles, Award, MapPin } from 'lucide-react'

interface Empire {
    id: string
    name: string
    period: string
    location: string
    description: string
    astroConnection: string
    starX: number
    starY: number
    artifactName: string
    artifactDesc: string
    color: string
}

const empires: Empire[] = [
    {
        id: 'ghana',
        name: "L'Empire du Ghana",
        period: "IIIe - XIIIe Siècle",
        location: "Afrique de l'Ouest (Mali/Mauritanie)",
        description: "Aussi appelé Wagadou, c'était le pays de l'or. Son organisation politique et militaire a impressionné les chroniqueurs arabes par sa splendeur et sa gestion du commerce transsaharien.",
        astroConnection: "Aligné avec le Lever de Sigi Tolo (Sirius). Les empereurs utilisaient la position stellaire pour marquer le début de la récolte de l'or.",
        starX: 280,
        starY: 340,
        artifactName: "Sceptre d'Or du Wagadou",
        artifactDesc: "Un sceptre en or massif poli par les anciens alchimistes du Sahara.",
        color: '#E6C229'
    },
    {
        id: 'mali',
        name: "L'Empire du Mali",
        period: "XIIIe - XVIIe Siècle",
        location: "Sénégal, Mali, Niger, Guinée",
        description: "Fondé par Soundiata Keïta, cet empire est célèbre pour sa Charte de Kouroukan Fouga et la légendaire richesse de Mansa Moussa, qui a transformé Tombouctou en pôle d'érudition planétaire.",
        astroConnection: "Lié à la constellation d'Amma (Orion). L'architecture des mosquées en terre de Tombouctou reflète les orientations de ces constellations sacrées.",
        starX: 420,
        starY: 360,
        artifactName: "Manuscrit Astral de Tombouctou",
        artifactDesc: "Un codex de mathématiques contenant des coordonnées de Sirius B.",
        color: '#B85C2E'
    },
    {
        id: 'songhai',
        name: "L'Empire Songhaï",
        period: "XVe - XVIe Siècle",
        location: "Bassin du fleuve Niger",
        description: "Le plus vaste des empires ouest-africains. Sous Askia Mohammad, l'administration a été modernisée, les universités ont prospéré et le commerce de manuscrits scientifiques a surpassé l'or.",
        astroConnection: "Orienté selon Po Tolo (Sirius B). La disposition de l'observatoire de Gao permettait de suivre le cycle de 50 ans de Sirius.",
        starX: 520,
        starY: 280,
        artifactName: "Astrolabe en Bronze de Gao",
        artifactDesc: "Un appareil de mesure d'angles stellaires forgé par les astronomes Songhaï.",
        color: '#00E5A0'
    },
    {
        id: 'axoum',
        name: "Le Royaume d'Axoum",
        period: "Ier - Xe Siècle",
        location: "Afrique de l'Est (Éthiopie/Érythrée)",
        description: "Carrefour commercial majeur entre l'Inde, Rome et la Perse. Réputé pour ses immenses obélisques (stèles gravées) taillés d'un seul bloc, témoignant d'une ingénierie spectaculaire.",
        astroConnection: "Aligné sur les solstices et la constellation de la Grande Ourse, gravés sur les sommets arrondis des obélisques funéraires.",
        starX: 820,
        starY: 320,
        artifactName: "Stèle d'Orichalque d'Axoum",
        artifactDesc: "Une réplique miniature gravée d'une stèle alignée sur Sirius.",
        color: '#00B4D8'
    },
    {
        id: 'zimbabwe',
        name: "Le Grand Zimbabwe",
        period: "XIe - XVe Siècle",
        location: "Afrique Australe",
        description: "Une civilisation de bâtisseurs de pierre légendaire. Leurs structures de granit s'élèvent sans aucun mortier et témoignent d'une société urbaine florissante connectée à l'Océan Indien.",
        astroConnection: "Orienté vers les Pléiades (Sigi). Le grand enclos servait de calendrier solaire et stellaire marquant les saisons agricoles.",
        starX: 780,
        starY: 580,
        artifactName: "Oiseau de Pierre de Shona",
        artifactDesc: "Sculpture sacrée représentant le messager stéllaire volant au-dessus du Grand Enclos.",
        color: '#FF007F'
    }
]

export default function Map() {
    const { playClick, playChime } = useAudioFX()
    const { addCoins, user, inventory, addUnlockedArtifact } = useAuthStore()
    const { push } = useNotificationStore()
    const [selectedEmpire, setSelectedEmpire] = useState<Empire | null>(null)

    const handleSelectEmpire = (emp: Empire) => {
        playClick()
        setSelectedEmpire(emp)
    }

    const handleUnlockArtifact = (emp: Empire) => {
        if (!user) return
        const alreadyUnlocked = inventory.some((item) => item.name === emp.artifactName)
        if (alreadyUnlocked) return

        playChime()
        const grad = `linear-gradient(135deg, ${emp.color}4D, ${emp.color}1A)`
        addUnlockedArtifact(emp.artifactName, grad)
        addCoins(30)
        push({
            type: 'achievement',
            title: 'Artefact Céleste Découvert',
            message: `Vous avez débloqué le ${emp.artifactName} ! +30 Nya Coins`,
            icon: '⚜️',
            color: emp.color
        })
    }

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 100 }}>
            <Starfield />
            <CosmicBackground />
            <Navbar />

            <main className="max-w-container" style={{ paddingTop: 120, position: 'relative', zIndex: 2 }}>
                
                {/* Header Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
                    <div className="cosmo-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Compass size={14} className="spin-slow" style={{ color: 'var(--nya-gold)' }} />
                        OBSERVATOIRE {" > "} CARTOGRAPHIE STELLAIRE
                    </div>
                    <h1 className="text-shimmer" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                        PLANISPHÈRE CÉLESTE DES EMPIRES
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: 650, lineHeight: 1.6 }}>
                        Explorez les alignements stellaires et l'héritage astronomique des grands empires africains. Cliquez sur les constellations pour dévoiler leurs secrets et récolter leurs artefacts sacrés.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 40 }}>
                    
                    {/* SVG Map Canvas */}
                    <div style={{
                        background: 'radial-gradient(circle, #0c1a20 0%, #030607 100%)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 24,
                        padding: 24,
                        position: 'relative',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                        overflow: 'hidden',
                        minHeight: 500
                    }}>
                        {/* Map Title/Grid Lines overlay */}
                        <div style={{ position: 'absolute', top: 16, left: 16, fontSize: '0.65rem', color: 'rgba(0,229,160,0.4)', fontFamily: 'var(--font-mono)', letterSpacing: '0.15em' }}>
                            GRID COORD: SIRIUS_SENS_V3
                        </div>

                        {/* Interactive SVG */}
                        <svg viewBox="0 0 1000 650" style={{ width: '100%', height: 'auto', display: 'block' }}>
                            {/* Grid circles */}
                            <circle cx="500" cy="325" r="150" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" strokeDasharray="5,5" />
                            <circle cx="500" cy="325" r="300" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" strokeDasharray="5,5" />
                            
                            {/* Grid axes */}
                            <line x1="500" y1="25" x2="500" y2="625" stroke="rgba(255,255,255,0.02)" strokeDasharray="4,4" />
                            <line x1="25" y1="325" x2="975" y2="325" stroke="rgba(255,255,255,0.02)" strokeDasharray="4,4" />

                            {/* Abstract continent outline representing Africa */}
                            <path 
                                d="M 200,280 Q 250,220 350,200 Q 550,170 700,220 Q 820,260 880,330 T 900,450 Q 880,500 820,530 T 720,580 Q 640,630 580,620 T 480,550 T 380,480 Q 300,430 250,380 Z" 
                                fill="rgba(0, 229, 160, 0.01)" 
                                stroke="rgba(0, 229, 160, 0.06)" 
                                strokeWidth="2"
                                strokeDasharray="6,6"
                            />

                            {/* Constellation lines connecting empires */}
                            <g stroke="rgba(255, 194, 41, 0.15)" strokeWidth="1.5" strokeDasharray="4,4">
                                <line x1="280" y1="340" x2="420" y2="360" />
                                <line x1="420" y1="360" x2="520" y2="280" />
                                <line x1="520" y1="280" x2="820" y2="320" />
                                <line x1="820" y1="320" x2="780" y2="580" />
                                <line x1="420" y1="360" x2="780" y2="580" />
                            </g>

                            {/* Empire Star Nodes */}
                            {empires.map((emp) => {
                                const isSelected = selectedEmpire?.id === emp.id
                                return (
                                    <g key={emp.id} style={{ cursor: 'pointer' }} onClick={() => handleSelectEmpire(emp)}>
                                        {/* Outer glowing pulse */}
                                        <motion.circle 
                                            cx={emp.starX} 
                                            cy={emp.starY} 
                                            r={isSelected ? 16 : 10}
                                            fill="none" 
                                            stroke={emp.color} 
                                            strokeWidth="2"
                                            animate={{ scale: isSelected ? [1, 1.25, 1] : [1, 1.15, 1], opacity: [0.3, 0.8, 0.3] }}
                                            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                                        />
                                        {/* Core Star */}
                                        <circle 
                                            cx={emp.starX} 
                                            cy={emp.starY} 
                                            r="5" 
                                            fill={isSelected ? '#fff' : emp.color} 
                                            style={{ filter: `drop-shadow(0 0 8px ${emp.color})` }}
                                        />
                                        {/* Label text */}
                                        <text 
                                            x={emp.starX} 
                                            y={emp.starY - 18} 
                                            textAnchor="middle" 
                                            fill={isSelected ? '#fff' : 'rgba(255,255,255,0.6)'}
                                            style={{
                                                fontFamily: 'var(--font-display)',
                                                fontSize: isSelected ? '11px' : '9px',
                                                fontWeight: 800,
                                                letterSpacing: '0.05em',
                                                textTransform: 'uppercase'
                                            }}
                                        >
                                            {emp.name}
                                        </text>
                                    </g>
                                )
                            })}
                        </svg>
                    </div>

                    {/* Information Sidebar panel */}
                    <div>
                        <AnimatePresence mode="wait">
                            {selectedEmpire ? (
                                <motion.div
                                    key={selectedEmpire.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    style={{
                                        background: 'var(--nya-deep)',
                                        border: `1px solid ${selectedEmpire.color}33`,
                                        borderRadius: 24,
                                        padding: 32,
                                        boxShadow: `0 20px 40px rgba(0,0,0,0.5), 0 0 20px ${selectedEmpire.color}11`,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 24,
                                        minHeight: 500
                                    }}
                                >
                                    {/* Empire details header */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        <div style={{ fontSize: '0.7rem', color: selectedEmpire.color, fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                                            {selectedEmpire.period}
                                        </div>
                                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>
                                            {selectedEmpire.name}
                                        </h2>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            <MapPin size={12} style={{ color: selectedEmpire.color }} />
                                            {selectedEmpire.location}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                                        {selectedEmpire.description}
                                    </p>

                                    {/* Astronomical Alignment info */}
                                    <div style={{
                                        background: 'rgba(255,255,255,0.02)',
                                        borderLeft: `3px solid ${selectedEmpire.color}`,
                                        padding: 16,
                                        borderRadius: '0 12px 12px 0'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', color: selectedEmpire.color, fontWeight: 800, marginBottom: 6 }}>
                                            <Sparkles size={12} />
                                            ALIGNEMENT ASTRONOMIQUE
                                        </div>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.6, fontStyle: 'italic' }}>
                                            {selectedEmpire.astroConnection}
                                        </p>
                                    </div>

                                    {/* Artifact claim block */}
                                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        <div style={{
                                            border: '1px dashed rgba(255,255,255,0.1)',
                                            borderRadius: 14,
                                            padding: 16,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 16
                                        }}>
                                            <div style={{
                                                width: 44, height: 44, borderRadius: 10,
                                                background: `${selectedEmpire.color}1A`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '1.25rem',
                                                border: `1px solid ${selectedEmpire.color}44`
                                            }}>
                                                ⚜️
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                <div style={{ fontSize: '0.75rem', color: '#fff', fontWeight: 800 }}>
                                                    {selectedEmpire.artifactName}
                                                </div>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                                                    {selectedEmpire.artifactDesc}
                                                </div>
                                            </div>
                                        </div>

                                        {inventory.some((item) => item.name === selectedEmpire.artifactName) ? (
                                            <div style={{
                                                padding: '12px', borderRadius: 10,
                                                background: 'rgba(0,229,160,0.1)',
                                                border: '1px solid rgba(0,229,160,0.2)',
                                                color: '#00E5A0', fontSize: '0.75rem', fontWeight: 800,
                                                textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                                            }}>
                                                <Award size={14} /> ARTEFACT RÉCUPÉRÉ (DANS LA VOÛTE)
                                            </div>
                                        ) : (
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleUnlockArtifact(selectedEmpire)}
                                                style={{
                                                    padding: '14px', borderRadius: 10,
                                                    background: selectedEmpire.color,
                                                    border: 'none', color: '#fff', fontWeight: 800,
                                                    fontSize: '0.75rem', cursor: 'pointer', letterSpacing: '0.05em',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                                                }}
                                            >
                                                <BookOpen size={14} /> RÉCUPÉRER L'ARTEFACT SACRÉ (+30 COINS)
                                            </motion.button>
                                        )}
                                    </div>

                                </motion.div>
                            ) : (
                                <div style={{
                                    background: 'var(--nya-deep)',
                                    border: '1px dashed var(--border-default)',
                                    borderRadius: 24,
                                    padding: 48,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 16,
                                    minHeight: 500,
                                    textAlign: 'center',
                                    color: 'var(--text-muted)'
                                }}>
                                    <Compass size={48} className="stroke-muted spin-slow" style={{ color: 'rgba(255,255,255,0.15)' }} />
                                    <div>
                                        <h3 style={{ fontSize: '1rem', color: '#fff', fontWeight: 800, marginBottom: 6 }}>
                                            SÉLECTIONNEZ UNE CONSTELLATION
                                        </h3>
                                        <p style={{ fontSize: '0.75rem', maxWidth: 260, lineHeight: 1.6 }}>
                                            Cliquez sur l'une des étoiles constellations de l'Afrique pour afficher ses secrets et son alignement spirituel.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>

            </main>

            <Footer />
        </div>
    )
}

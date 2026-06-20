import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import { Mic, Play, Pause, Volume2, Clock, Share2 } from 'lucide-react'

interface PodcastEpisode {
    id: string
    title: string
    duration: string
    host: string
    desc: string
    gradient: string
}

const EPISODES: PodcastEpisode[] = [
    { id: '1', title: 'Le Mystère de l\'Étoile Digitaria', duration: '3:45', host: 'Dr. Amadou Niamkey', desc: 'Exploration de la connaissance millénaire de Sirius B par les prêtres Dogon avant l\'astronomie moderne.', gradient: 'linear-gradient(135deg, #B85C2E 0%, #D4A017 100%)' },
    { id: '2', title: 'La Structure des Abris Toguna', duration: '4:20', host: 'Awa Diabaté', desc: 'Pourquoi les toits du Toguna sont délibérément bas : décryptage d\'un chef-d\'œuvre d\'apaisement social.', gradient: 'linear-gradient(135deg, #0a2e1a 0%, #00E5A0 100%)' },
    { id: '3', title: 'L\'Arbre à Paroles Africain', duration: '5:12', host: 'Sultan Koné', desc: 'Le rôle de la tradition orale, de la Kora et des conteurs dans la transmission des codes éthiques du continent.', gradient: 'linear-gradient(135deg, #1a0a2e 0%, #8b5cf6 100%)' }
]

export default function Podcast() {
    const [activeEp, setActiveEp] = useState(EPISODES[0])
    const [playing, setPlaying] = useState(false)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        setProgress(0)
        setPlaying(false)
    }, [activeEp])

    useEffect(() => {
        if (!playing) return
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    setPlaying(false)
                    return 0
                }
                return prev + 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [playing])

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 100 }}>
            <Starfield />
            <CosmicBackground />
            <Navbar />

            {/* Main content */}
            <main className="max-w-container" style={{ paddingTop: 120, position: 'relative', zIndex: 2 }}>
                
                {/* Hero Header */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginBottom: 48 }}>
                    <div className="cosmo-label">Toguna Radio {" > "} Podcasts Audio</div>
                    <h1 className="text-shimmer" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                        TOGUNA PODCAST
                    </h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, alignItems: 'center' }}>
                    
                    {/* Media player board */}
                    <div style={{
                        background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                        borderRadius: 24, padding: 32, display: 'flex', flexDirection: 'column',
                        gap: 24, boxShadow: '0 25px 50px rgba(0,0,0,0.5)', position: 'relative'
                    }}>
                        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                            <div style={{
                                width: 80, height: 80, borderRadius: 16,
                                background: activeEp.gradient, display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontSize: '2.2rem'
                            }}>
                                <Mic />
                            </div>
                            <div>
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--nya-gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lecteur de Récits</span>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff', marginTop: 4 }}>{activeEp.title}</h3>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>Présenté par : {activeEp.host}</p>
                            </div>
                        </div>

                        {/* Scrubber progress */}
                        <div>
                            <div style={{ width: '100%', height: 4, background: 'var(--bg-primary)', borderRadius: 2, overflow: 'hidden' }}>
                                <div style={{ width: `${progress}%`, height: '100%', background: 'var(--nya-ochre)', borderRadius: 2 }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 8 }}>
                                <span>{progress}%</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={10} /> Durée: {activeEp.duration}</span>
                            </div>
                        </div>

                        {/* Player controls */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-default)', paddingTop: 16 }}>
                            <div style={{ display: 'flex', gap: 10 }}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setPlaying(!playing)}
                                    style={{
                                        width: 44, height: 44, borderRadius: '50%',
                                        background: 'var(--nya-ochre)', border: 'none',
                                        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', boxShadow: '0 4px 12px rgba(184,92,46,0.3)'
                                    }}
                                >
                                    {playing ? <Pause size={18} /> : <Play size={18} />}
                                </motion.button>
                            </div>

                            <div style={{ display: 'flex', gap: 14 }}>
                                <Volume2 size={16} style={{ color: 'var(--text-muted)' }} />
                                <Share2 size={16} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
                            </div>
                        </div>
                    </div>

                    {/* Episodes playlist */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={{
                            background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                            borderRadius: 24, padding: 24
                        }}>
                            <h3 style={{
                                fontFamily: 'var(--font-display)', fontSize: '1rem',
                                fontWeight: 900, color: '#fff', marginBottom: 20,
                                display: 'flex', alignItems: 'center', gap: 10
                            }}>
                                <Mic size={16} style={{ color: 'var(--nya-gold)' }} />
                                ÉPISODES DISPONIBLES
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {EPISODES.map((ep) => {
                                    const active = activeEp.id === ep.id
                                    return (
                                        <div
                                            key={ep.id}
                                            onClick={() => setActiveEp(ep)}
                                            style={{
                                                background: active ? 'rgba(184,92,46,0.08)' : 'var(--bg-elevated)',
                                                border: active ? '1px solid var(--nya-ochre)' : '1px solid var(--border-default)',
                                                borderRadius: 16, padding: '14px 18px', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', gap: 14,
                                                transition: 'all 0.3s'
                                            }}
                                        >
                                            <div style={{
                                                width: 32, height: 32, borderRadius: 8,
                                                background: ep.gradient, display: 'flex',
                                                alignItems: 'center', justifyContent: 'center',
                                                color: '#fff', fontSize: '1rem'
                                            }}>
                                                <Mic size={14} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fff' }}>{ep.title}</div>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>Durée: {ep.duration}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                </div>

            </main>
            <Footer />
        </div>
    )
}

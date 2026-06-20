import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { useNotificationStore } from '../stores/notificationStore'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import { Shield, Edit2, Check, Award, Landmark } from 'lucide-react'

const AVATAR_SYMBOLS = ['✨', '👽', '🦉', '🦁', '🦅', '🐍', '👑', '🔥', '🌊', '🌾']
const AVATAR_GRADIENTS = [
    { name: 'Ocre Bandiagara', value: 'linear-gradient(135deg, #B85C2E 0%, #D4A017 100%)' },
    { name: 'Sirius Aqua', value: 'linear-gradient(135deg, #0a1a2e 0%, #00E5A0 100%)' },
    { name: 'Feu Nommo', value: 'linear-gradient(135deg, #1a0505 0%, #ef4444 100%)' },
    { name: 'Amma Violet', value: 'linear-gradient(135deg, #1a0a2e 0%, #8b5cf6 100%)' },
    { name: 'Abidjan Night', value: 'linear-gradient(135deg, #050505 0%, #3b82f6 100%)' },
]
const AVATAR_TITLES = [
    'Apprenti Toguna',
    'Scribe de Sirius',
    'Guerrier Nommo',
    'Grand Forgeron',
    'Gardien des Masques',
    'Grand Prêtre d\'Amma'
]

// Artifact Lore Database
const ARTIFACT_LORE: Record<string, { rarity: string, lore: string, perk: string }> = {
    'O01': { rarity: 'Légendaire', lore: 'Ce sceau sacré recèle la force gravitationnelle de l\'étoile triple Sirius B. Gravé dans l\'or le plus pur de Côte d\'Ivoire.', perk: '+15% de vitesse de chargement du Nexus' },
    'O02': { rarity: 'Initiatique', lore: 'Tissu royal teint selon des méthodes ancestrales. Il vibre aux couleurs de la nuit cosmique.', perk: 'Double le gain de Nya Coins dans le Toguna Chat' },
    'O03': { rarity: 'Légendaire', lore: 'Représente le lien vertical entre la Terre (Bandiagara) et le ciel de Sirius. Utilisé lors des rites solaires.', perk: '+25% de chances de réussite aux Puzzles' },
    'O04': { rarity: 'Rare', lore: 'Une tablette numérique conçue pour transcrire les langages sacrés de l\'univers.', perk: '+10% d\'expérience dans l\'Académie' },
    'O05': { rarity: 'Commun', lore: 'Produit à base de plantes médicinales récoltées aux falaises sacrées, béni par Amma.', perk: 'Régénère le streak en cas d\'absence d\'un jour' },
    'O06': { rarity: 'Épique', lore: 'Un processeur photonique capable de décoder les murmures de l\'espace lointain.', perk: 'Débloque les filtres AI exclusifs dans le Lab' },
    'O07': { rarity: 'Épique', lore: 'Cette sphère projette un hologramme de la constellation du Chien en temps réel.', perk: '+5% de score global sur le Leaderboard' },
    'O21': { rarity: 'Rare', lore: 'Un vêtement d\'initié brodé à l\'effigie du Nommo créateur.', perk: 'Style premium dans le Toguna Chat' },
    'O22': { rarity: 'Rare', lore: 'Sac en cuir de buffle tanné selon les techniques séculaires de Bandiagara.', perk: '+5 emplacements d\'inventaire' },
}

export default function Profile() {
    const { user, achievements, inventory, updateProfile } = useAuthStore()
    const { push } = useNotificationStore()

    const [isEditing, setIsEditing] = useState(false)
    const [name, setName] = useState(user?.displayName || '')
    const [bio, setBio] = useState(user?.bio || '')
    const [symbol, setSymbol] = useState(user?.avatarConfig?.symbol || '✨')
    const [gradient, setGradient] = useState(user?.avatarConfig?.gradient || AVATAR_GRADIENTS[0].value)
    const [title, setTitle] = useState(user?.avatarConfig?.title || AVATAR_TITLES[0])

    const [selectedArtifact, setSelectedArtifact] = useState<any | null>(null)

    const handleSave = () => {
        updateProfile(name, bio, { symbol, gradient, title })
        setIsEditing(false)
        push({
            type: 'system',
            title: 'Profil mis à jour',
            message: 'Votre identité cosmique a été gravée avec succès.',
            icon: '👤',
            color: '#B85C2E'
        })
    }

    const startTour = () => {
        if ((window as any).restartOnboardingTour) {
            (window as any).restartOnboardingTour()
        }
    }

    const unlockedBadges = achievements.filter(a => a.unlocked)

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 100 }}>
            <Starfield />
            <CosmicBackground />
            <Navbar />

            {/* Content Container */}
            <main className="max-w-container" style={{ paddingTop: 120, position: 'relative', zIndex: 2 }}>
                
                {/* Hero Header */}
                <div style={{
                    display: 'flex', flexDirection: 'column', gap: 32,
                    marginBottom: 48
                }}>
                    <div className="cosmo-label">Nexus Sirius {" > "} Initié</div>
                    <h1 className="text-shimmer" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                        VOTRE IDENTITÉ
                    </h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 32, alignItems: 'start' }}>
                    
                    {/* Left Column: Avatar Display & Editor */}
                    <div style={{
                        background: 'var(--nya-deep)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 24,
                        padding: 24,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24
                    }}>
                        {/* Avatar bubble */}
                        <div style={{
                            width: 140, height: 140, borderRadius: '50%',
                            background: isEditing ? gradient : (user?.avatarConfig?.gradient || gradient),
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '4.5rem',
                            boxShadow: '0 0 30px rgba(184,92,46,0.3)',
                            border: '4px solid var(--bg-primary)',
                            position: 'relative'
                        }}>
                            {isEditing ? symbol : (user?.avatarConfig?.symbol || symbol)}
                            <div style={{
                                position: 'absolute', bottom: 0, right: 0,
                                width: 36, height: 36, borderRadius: '50%',
                                background: 'var(--nya-ochre)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', border: '2px solid var(--bg-primary)'
                            }}>
                                <Shield size={16} />
                            </div>
                        </div>

                        {/* Title Display */}
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{
                                fontFamily: 'var(--font-display)', fontSize: '1.4rem',
                                fontWeight: 900, color: 'var(--text-primary)'
                            }}>
                                {isEditing ? name : (user?.displayName || 'Initié')}
                            </h2>
                            <p style={{
                                fontSize: '0.75rem', fontWeight: 800,
                                color: 'var(--nya-gold)', textTransform: 'uppercase',
                                letterSpacing: '0.15em', marginTop: 4
                            }}>
                                {isEditing ? title : (user?.avatarConfig?.title || title)}
                            </p>
                        </div>

                        {/* Bio Display */}
                        <p style={{
                            fontSize: '0.85rem', color: 'var(--text-secondary)',
                            textAlign: 'center', lineHeight: 1.6,
                            maxWidth: 260, minHeight: 40
                        }}>
                            {isEditing ? bio : (user?.bio || 'Aucune biographie rédigée.')}
                        </p>

                        {/* Edit Buttons */}
                        {!isEditing ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsEditing(true)}
                                style={{
                                    width: '100%', padding: '12px',
                                    background: 'var(--bg-elevated)',
                                    border: '1px solid var(--border-hover)',
                                    borderRadius: '12px', color: 'var(--text-primary)',
                                    fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                                }}
                            >
                                <Edit2 size={14} /> PERSONNALISER
                            </motion.button>
                        ) : (
                            <div style={{ width: '100%', display: 'flex', gap: 12 }}>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsEditing(false)}
                                    style={{
                                        flex: 1, padding: '12px',
                                        background: 'none', border: '1px solid var(--border-hover)',
                                        borderRadius: '12px', color: 'var(--text-muted)',
                                        fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
                                    }}
                                >
                                    Annuler
                                </motion.button>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSave}
                                    style={{
                                        flex: 1, padding: '12px',
                                        background: 'var(--nya-ochre)', border: 'none',
                                        borderRadius: '12px', color: '#fff',
                                        fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                                    }}
                                >
                                    <Check size={14} /> Sauver
                                </motion.button>
                            </div>
                        )}

                        <button
                            onClick={startTour}
                            style={{
                                background: 'none', border: 'none',
                                fontSize: '0.75rem', fontWeight: 700,
                                color: 'var(--nya-ochre)', cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                        >
                            Relancer l'initiation guidée
                        </button>
                    </div>

                    {/* Right Column: Customization Forms or Vault/Badges */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                        
                        {/* Editor Form (shows only if editing) */}
                        <AnimatePresence>
                            {isEditing && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    style={{
                                        background: 'var(--nya-deep)',
                                        border: '1px solid rgba(184,92,46,0.3)',
                                        borderRadius: 24,
                                        padding: 24,
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                                    }}
                                >
                                    <h3 style={{
                                        fontFamily: 'var(--font-display)', fontSize: '1.2rem',
                                        fontWeight: 900, color: 'var(--nya-gold)', marginBottom: 20
                                    }}>
                                        FORGE DU SCRIBE
                                    </h3>

                                    {/* Name Input */}
                                    <div style={{ marginBottom: 16 }}>
                                        <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>PSEUDONYME</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            style={{
                                                width: '100%', padding: '12px 16px',
                                                background: 'var(--bg-primary)',
                                                border: '1px solid var(--border-default)',
                                                borderRadius: 12, color: 'var(--text-primary)',
                                                outline: 'none', fontSize: '0.85rem'
                                            }}
                                        />
                                    </div>

                                    {/* Title Select */}
                                    <div style={{ marginBottom: 16 }}>
                                        <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>TITRE SOCIAL</label>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                            {AVATAR_TITLES.map((t) => (
                                                <button
                                                    key={t}
                                                    onClick={() => setTitle(t)}
                                                    style={{
                                                        padding: '8px 12px', borderRadius: 8,
                                                        background: title === t ? 'var(--nya-ochre)' : 'var(--bg-elevated)',
                                                        border: title === t ? 'none' : '1px solid var(--border-hover)',
                                                        color: title === t ? '#fff' : 'var(--text-secondary)',
                                                        fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer'
                                                    }}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Bio Input */}
                                    <div style={{ marginBottom: 16 }}>
                                        <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>BIOGRAPHIE</label>
                                        <textarea
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            rows={3}
                                            style={{
                                                width: '100%', padding: '12px 16px',
                                                background: 'var(--bg-primary)',
                                                border: '1px solid var(--border-default)',
                                                borderRadius: 12, color: 'var(--text-primary)',
                                                outline: 'none', fontSize: '0.85rem', resize: 'none'
                                            }}
                                        />
                                    </div>

                                    {/* Symbols Selector */}
                                    <div style={{ marginBottom: 16 }}>
                                        <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>SYMBOLE SACRÉ</label>
                                        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8 }}>
                                            {AVATAR_SYMBOLS.map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => setSymbol(s)}
                                                    style={{
                                                        width: 40, height: 40, borderRadius: '50%',
                                                        background: symbol === s ? 'var(--nya-gold)' : 'var(--bg-elevated)',
                                                        border: 'none', fontSize: '1.2rem', cursor: 'pointer',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                    }}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Gradient Selector */}
                                    <div>
                                        <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>AURA COSMIQUE</label>
                                        <div style={{ display: 'flex', gap: 10 }}>
                                            {AVATAR_GRADIENTS.map((g) => (
                                                <button
                                                    key={g.name}
                                                    onClick={() => setGradient(g.value)}
                                                    style={{
                                                        width: 32, height: 32, borderRadius: '50%',
                                                        background: g.value, cursor: 'pointer',
                                                        border: gradient === g.value ? '2px solid #fff' : '2px solid transparent',
                                                        boxShadow: gradient === g.value ? '0 0 10px rgba(255,255,255,0.5)' : 'none'
                                                    }}
                                                    title={g.name}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Vault / Inventaire Sacré */}
                        <div style={{
                            background: 'var(--nya-deep)',
                            border: '1px solid var(--border-default)',
                            borderRadius: 24,
                            padding: 24,
                            boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                        }}>
                            <h3 style={{
                                fontFamily: 'var(--font-display)', fontSize: '1.2rem',
                                fontWeight: 900, color: 'var(--text-primary)', marginBottom: 20,
                                display: 'flex', alignItems: 'center', gap: 10
                            }}>
                                <Landmark size={18} style={{ color: 'var(--nya-ochre)' }} />
                                VOÛTE DES ARTEFACTS
                            </h3>

                            {inventory.length === 0 ? (
                                <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-faint)' }}>
                                    <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Votre voûte est vide.</p>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-faint)', marginTop: 4 }}>
                                        Faites des acquisitions au Marché pour stocker vos objets et débloquer leurs effets cosmiques.
                                    </p>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 16 }}>
                                    {inventory.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            whileHover={{ scale: 1.05, y: -4 }}
                                            onClick={() => setSelectedArtifact(item)}
                                            style={{
                                                background: 'var(--bg-elevated)',
                                                border: '1px solid var(--border-hover)',
                                                borderRadius: 16, padding: 12, cursor: 'pointer',
                                                display: 'flex', flexDirection: 'column', gap: 12
                                            }}
                                        >
                                            <div style={{
                                                width: '100%', height: 80, borderRadius: 12,
                                                background: item.gradient, display: 'flex',
                                                alignItems: 'center', justifyContent: 'center',
                                                fontSize: '2rem'
                                            }} />
                                            <div>
                                                <div style={{
                                                    fontSize: '0.75rem', fontWeight: 700,
                                                    color: 'var(--text-primary)',
                                                    overflow: 'hidden', textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {item.name}
                                                </div>
                                                <div style={{
                                                    fontSize: '0.65rem', fontWeight: 800,
                                                    color: 'var(--nya-ochre)', marginTop: 2
                                                }}>
                                                    Qté: {item.quantity}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Badges d'Initiation */}
                        <div style={{
                            background: 'var(--nya-deep)',
                            border: '1px solid var(--border-default)',
                            borderRadius: 24,
                            padding: 24,
                            boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                        }}>
                            <h3 style={{
                                fontFamily: 'var(--font-display)', fontSize: '1.2rem',
                                fontWeight: 900, color: 'var(--text-primary)', marginBottom: 8,
                                display: 'flex', alignItems: 'center', gap: 10
                            }}>
                                <Award size={18} style={{ color: 'var(--nya-gold)' }} />
                                INITIATIONS COMPLÉTÉES
                            </h3>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 20 }}>
                                {unlockedBadges.length} / {achievements.length} Badges Sacrés Débloqués
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))', gap: 16, justifyContent: 'center' }}>
                                {achievements.map((ach) => (
                                    <div
                                        key={ach.id}
                                        style={{
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                                            opacity: ach.unlocked ? 1 : 0.25,
                                            filter: ach.unlocked ? 'none' : 'grayscale(100%)',
                                            transition: 'all 0.3s'
                                        }}
                                        title={`${ach.title} : ${ach.description}`}
                                    >
                                        <div style={{
                                            width: 48, height: 48, borderRadius: '50%',
                                            background: ach.unlocked ? ach.color : 'var(--bg-elevated)',
                                            border: ach.unlocked ? 'none' : '1px dashed var(--border-hover)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '1.5rem',
                                            boxShadow: ach.unlocked ? `0 0 15px ${ach.color}40` : 'none'
                                        }}>
                                            {ach.icon}
                                        </div>
                                        <div style={{ fontSize: '0.55rem', fontWeight: 800, textAlign: 'center', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                                            {ach.title}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {/* Artifact Detail Modal Overlay */}
            <AnimatePresence>
                {selectedArtifact && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedArtifact(null)}
                            style={{
                                position: 'fixed', inset: 0, zIndex: 99998,
                                background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)'
                            }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            style={{
                                position: 'fixed', top: '50%', left: '50%',
                                transform: 'translate(-50%, -50%)', zIndex: 99999,
                                width: 'min(480px, 90vw)'
                            }}
                        >
                            <div style={{
                                background: 'var(--nya-deep)',
                                border: '1px solid rgba(212,160,23,0.4)',
                                borderRadius: 24, padding: 32,
                                boxShadow: '0 30px 60px rgba(0,0,0,0.8), inset 0 0 30px rgba(212,160,23,0.05)',
                                color: '#fff', textAlign: 'center', position: 'relative'
                            }}>
                                {/* Close */}
                                <button
                                    onClick={() => setSelectedArtifact(null)}
                                    style={{
                                        position: 'absolute', top: 16, right: 16,
                                        background: 'none', border: 'none', color: 'var(--text-muted)',
                                        cursor: 'pointer', fontSize: '1.2rem'
                                    }}
                                >
                                    ✕
                                </button>

                                {/* 3D Hovering Card container */}
                                <div style={{
                                    perspective: 1000, display: 'flex', justifyContent: 'center', marginBottom: 24
                                }}>
                                    <motion.div
                                        whileHover={{ rotateY: 15, rotateX: -10 }}
                                        style={{
                                            width: 140, height: 140, borderRadius: 20,
                                            background: selectedArtifact.gradient,
                                            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
                                            border: '2px solid rgba(255,255,255,0.1)'
                                        }}
                                    />
                                </div>

                                <span style={{
                                    fontSize: '0.6rem', fontWeight: 900,
                                    background: 'rgba(212,160,23,0.1)',
                                    color: 'var(--nya-gold)', border: '1px solid var(--nya-gold)',
                                    padding: '4px 12px', borderRadius: 20, textTransform: 'uppercase',
                                    letterSpacing: '0.2em'
                                }}>
                                    {ARTIFACT_LORE[selectedArtifact.id]?.rarity || 'Mystique'}
                                </span>

                                <h3 style={{
                                    fontFamily: 'var(--font-display)', fontSize: '1.5rem',
                                    fontWeight: 900, marginTop: 16, marginBottom: 12,
                                    color: 'var(--text-primary)'
                                }}>
                                    {selectedArtifact.name}
                                </h3>

                                <p style={{
                                    fontSize: '0.85rem', color: 'var(--text-secondary)',
                                    lineHeight: 1.6, marginBottom: 24, fontStyle: 'italic'
                                }}>
                                    "{ARTIFACT_LORE[selectedArtifact.id]?.lore || 'Cet objet mystique a été façonné sous l\'influence directe de l\'étoile Sirius.'}"
                                </p>

                                {/* Magical perk / power */}
                                <div style={{
                                    background: 'var(--bg-elevated)',
                                    border: '1px solid var(--border-hover)',
                                    borderRadius: 16, padding: '16px 20px',
                                    textAlign: 'left'
                                }}>
                                    <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                        Propriété Cosmique :
                                    </div>
                                    <div style={{
                                        fontSize: '0.8rem', fontWeight: 700,
                                        color: 'var(--nya-gold)', marginTop: 4,
                                        display: 'flex', alignItems: 'center', gap: 8
                                    }}>
                                        ✦ {ARTIFACT_LORE[selectedArtifact.id]?.perk || 'Augmente l\'aura mystique de votre profil'}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    )
}

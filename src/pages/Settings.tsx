import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { useNotificationStore } from '../stores/notificationStore'
import { useThemeStore, applyCosmicThemeStyles, type CosmicTheme } from '../stores/themeStore'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import { Volume2, Globe, Eye, RefreshCw, Save, ShieldAlert, Palette, Shuffle, Copy } from 'lucide-react'

const LANGUAGES = [
    { code: 'fr', name: 'Français', sub: 'Langue officielle' },
    { code: 'en', name: 'English', sub: 'International' },
    { code: 'bm', name: 'Bamanankan', sub: 'Bambara' },
    { code: 'bl', name: 'Baoulé', sub: "Côte d'Ivoire" },
]

function hslToHex(h: number, s: number, l: number): string {
    s /= 100
    l /= 100
    const k = (n: number) => (n + h / 30) % 12
    const a = s * Math.min(l, 1 - l)
    const f = (n: number) => {
        const y = l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))
        return Math.round(255 * y).toString(16).padStart(2, '0')
    }
    return `#${f(0)}${f(8)}${f(4)}`
}

export default function Settings() {
    const { resetAccount } = useAuthStore()
    const { push } = useNotificationStore()
    const { cosmicTheme, setCosmicTheme } = useThemeStore()

    const [language, setLanguage] = useState('fr')
    const [volume, setVolume] = useState(80)
    const [soundEffects, setSoundEffects] = useState(true)
    const [publicProfile, setPublicProfile] = useState(true)
    const [selectedCosmicTheme, setSelectedCosmicTheme] = useState<CosmicTheme>(cosmicTheme)
    const [confirmReset, setConfirmReset] = useState(false)

    // Custom Theme states
    const [customOchre, setCustomOchre] = useState(() => localStorage.getItem('nya-custom-ochre') || '#B85C2E')
    const [customOchreLight, setCustomOchreLight] = useState(() => localStorage.getItem('nya-custom-ochreLight') || '#D4793F')
    const [customOchreDark, setCustomOchreDark] = useState(() => localStorage.getItem('nya-custom-ochreDark') || '#8B4522')
    const [customGold, setCustomGold] = useState(() => localStorage.getItem('nya-custom-gold') || '#D4A017')
    const [customBrightGold, setCustomBrightGold] = useState(() => localStorage.getItem('nya-custom-brightGold') || '#FFD700')
    const [customSirius, setCustomSirius] = useState(() => localStorage.getItem('nya-custom-sirius') || '#00E5A0')
    const [customBgPrimary, setCustomBgPrimary] = useState(() => localStorage.getItem('nya-custom-bgPrimary') || '#000000')
    const [customBgSecondary, setCustomBgSecondary] = useState(() => localStorage.getItem('nya-custom-bgSecondary') || '#050505')
    const [shareCodeInput, setShareCodeInput] = useState('')

    // Load initial setting values
    useEffect(() => {
        const savedVol = localStorage.getItem('nya-audio-volume')
        if (savedVol) setVolume(parseInt(savedVol))

        const savedLang = localStorage.getItem('nya-language')
        if (savedLang) setLanguage(savedLang)

        const savedSfx = localStorage.getItem('nya-sfx-enabled')
        if (savedSfx) setSoundEffects(savedSfx === 'true')

        const savedPub = localStorage.getItem('nya-profile-public')
        if (savedPub) setPublicProfile(savedPub === 'true')
    }, [])

    const handleSave = () => {
        localStorage.setItem('nya-language', language)
        localStorage.setItem('nya-audio-volume', volume.toString())
        localStorage.setItem('nya-sfx-enabled', soundEffects.toString())
        localStorage.setItem('nya-profile-public', publicProfile.toString())
        setCosmicTheme(selectedCosmicTheme)

        // If custom theme is selected, ensure values are locked in
        if (selectedCosmicTheme === 'custom') {
            localStorage.setItem('nya-custom-ochre', customOchre)
            localStorage.setItem('nya-custom-ochreLight', customOchreLight)
            localStorage.setItem('nya-custom-ochreDark', customOchreDark)
            localStorage.setItem('nya-custom-gold', customGold)
            localStorage.setItem('nya-custom-brightGold', customBrightGold)
            localStorage.setItem('nya-custom-sirius', customSirius)
            localStorage.setItem('nya-custom-bgPrimary', customBgPrimary)
            localStorage.setItem('nya-custom-bgSecondary', customBgSecondary)
            applyCosmicThemeStyles('custom')
        }

        // Dispatch Custom Event for ambient audio to adjust volume dynamically
        window.dispatchEvent(new CustomEvent('nya-volume-change', { detail: volume }))

        push({
            type: 'system',
            title: 'Paramètres enregistrés',
            message: 'Vos configurations du Nexus ont été mises à jour.',
            icon: '⚙️',
            color: 'var(--nya-ochre)'
        })
    }

    const handleReset = () => {
        if (!confirmReset) {
            setConfirmReset(true)
            return
        }
        resetAccount()
        setConfirmReset(false)
        push({
            type: 'system',
            title: 'Réinitialisation complète',
            message: 'Toutes les initiations, inventaires et transactions ont été effacés.',
            icon: '🧹',
            color: '#ef4444'
        })
    }

    const updateCustomColor = (key: string, value: string) => {
        localStorage.setItem(`nya-custom-${key}`, value)
        if (key === 'ochre') setCustomOchre(value)
        if (key === 'ochreLight') setCustomOchreLight(value)
        if (key === 'ochreDark') setCustomOchreDark(value)
        if (key === 'gold') setCustomGold(value)
        if (key === 'brightGold') setCustomBrightGold(value)
        if (key === 'sirius') setCustomSirius(value)
        if (key === 'bgPrimary') setCustomBgPrimary(value)
        if (key === 'bgSecondary') setCustomBgSecondary(value)

        if (selectedCosmicTheme === 'custom') {
            applyCosmicThemeStyles('custom')
        }
    }

    const generateRandomTheme = () => {
        const baseHue = Math.floor(Math.random() * 360)
        
        const bgPrimary = hslToHex(baseHue, 15, 3)
        const bgSecondary = hslToHex(baseHue, 20, 7)
        
        const ochre = hslToHex(baseHue, 85, 55)
        const ochreLight = hslToHex(baseHue, 85, 70)
        const ochreDark = hslToHex(baseHue, 85, 30)
        
        const goldHue = (baseHue + 180) % 360
        const gold = hslToHex(goldHue, 90, 55)
        const brightGold = hslToHex(goldHue, 90, 75)
        
        const siriusHue = (baseHue + 120) % 360
        const sirius = hslToHex(siriusHue, 95, 55)

        updateCustomColor('ochre', ochre)
        updateCustomColor('ochreLight', ochreLight)
        updateCustomColor('ochreDark', ochreDark)
        updateCustomColor('gold', gold)
        updateCustomColor('brightGold', brightGold)
        updateCustomColor('sirius', sirius)
        updateCustomColor('bgPrimary', bgPrimary)
        updateCustomColor('bgSecondary', bgSecondary)

        setSelectedCosmicTheme('custom')
        setCosmicTheme('custom')
        applyCosmicThemeStyles('custom')

        push({
            type: 'system',
            title: 'Constellation générée !',
            message: `Une harmonie basée sur la teinte ${baseHue}° a été créée avec succès.`,
            icon: '🎨',
            color: ochre
        })
    }

    const getThemeShareCode = (): string => {
        return [
            customOchre,
            customOchreLight,
            customOchreDark,
            customGold,
            customBrightGold,
            customSirius,
            customBgPrimary,
            customBgSecondary
        ].map(c => c.replace('#', '')).join('-')
    }

    const handleCopyShareCode = () => {
        const code = getThemeShareCode()
        navigator.clipboard.writeText(code)
        push({
            type: 'system',
            title: 'Clé copiée !',
            message: 'Le code de votre constellation est dans votre presse-papiers.',
            icon: '📋',
            color: customOchre
        })
    }

    const handleImportCode = () => {
        if (!shareCodeInput.trim()) return
        const parts = shareCodeInput.trim().split('-')
        if (parts.length !== 8) {
            push({
                type: 'system',
                title: 'Clé non valide',
                message: 'Le format de clé de constellation est incorrect (doit comporter 8 segments).',
                icon: '⚠️',
                color: '#ef4444'
            })
            return
        }

        const colors = parts.map(p => `#${p.replace(/[^0-9a-fA-F]/g, '')}`)
        
        updateCustomColor('ochre', colors[0])
        updateCustomColor('ochreLight', colors[1])
        updateCustomColor('ochreDark', colors[2])
        updateCustomColor('gold', colors[3])
        updateCustomColor('brightGold', colors[4])
        updateCustomColor('sirius', colors[5])
        updateCustomColor('bgPrimary', colors[6])
        updateCustomColor('bgSecondary', colors[7])

        setSelectedCosmicTheme('custom')
        setCosmicTheme('custom')
        applyCosmicThemeStyles('custom')
        setShareCodeInput('')

        push({
            type: 'system',
            title: 'Constellation reprogrammée',
            message: 'La clé de constellation a été appliquée sur votre Nexus.',
            icon: '👽',
            color: colors[0]
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
                <div style={{
                    display: 'flex', flexDirection: 'column', gap: 32,
                    marginBottom: 48
                }}>
                    <div className="cosmo-label">Nexus Sirius {" > "} Paramètres</div>
                    <h1 className="text-shimmer" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                        PARAMÈTRES
                    </h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 40, alignItems: 'start' }}>
                    
                    {/* Settings Form */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                        
                        {/* Section 0: Aura Visuelle & Couleurs */}
                        <div style={{
                            background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                            borderRadius: 24, padding: 24
                        }}>
                            <h3 style={{
                                fontFamily: 'var(--font-display)', fontSize: '1.2rem',
                                fontWeight: 900, color: 'var(--text-primary)', marginBottom: 8,
                                display: 'flex', alignItems: 'center', gap: 10
                            }}>
                                <Palette size={18} style={{ color: 'var(--nya-gold)' }} />
                                AMBIANCE VISUELLE DU NEXUS
                            </h3>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 20 }}>
                                Sélectionnez la constellation de couleur qui régit l'énergie de votre interface.
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14 }}>
                                {[
                                    { id: 'fusion-sahel', name: 'Sahel Fusion', desc: 'Gris, Marron, Bleu, Rouge', color1: '#B85C2E', color2: '#3B82F6', color3: '#EF4444' },
                                    { id: 'ochre', name: 'Ocre Nommo', desc: 'Sahel & Bandiagara', color1: '#B85C2E', color2: '#D4A017', color3: '#00E5A0' },
                                    { id: 'sirius', name: 'Aura Sirius', desc: 'Abysse Cosmique', color1: '#00B4D8', color2: '#00E5A0', color3: '#00F5D4' },
                                    { id: 'gao', name: 'Or de Gao', desc: 'Splendeur Songhaï', color1: '#8b5cf6', color2: '#FFD700', color3: '#FF007F' },
                                    { id: 'eclipse', name: 'Éclipse Kente', desc: 'Énergie Royale', color1: '#dc2626', color2: '#ea580c', color3: '#10b981' },
                                    { id: 'sirius-nova', name: 'Sirius Nova', desc: 'Supernova Électrique', color1: '#818cf8', color2: '#d946ef', color3: '#38bdf8' },
                                    { id: 'kemet-sun', name: 'Soleil de Kemet', desc: 'Obsidienne & Or de Râ', color1: '#b45309', color2: '#fbbf24', color3: '#10b981' },
                                    { id: 'asante-magenta', name: 'Magenta Ashanti', desc: 'Pourpre Royal', color1: '#db2777', color2: '#f97316', color3: '#22d3ee' },
                                    { id: 'sahara-dune', name: 'Sahara Dune', desc: 'Crépuscule Saharien', color1: '#ea580c', color2: '#eab308', color3: '#14b8a6' },
                                    { id: 'custom', name: 'Création Unique', desc: 'Couleurs personnalisées', color1: customOchre, color2: customGold, color3: customSirius },
                                ].map((t) => {
                                    const isActive = selectedCosmicTheme === t.id
                                    return (
                                        <div
                                            key={t.id}
                                            onClick={() => {
                                                setSelectedCosmicTheme(t.id as CosmicTheme)
                                                setCosmicTheme(t.id as CosmicTheme)
                                            }}
                                            style={{
                                                background: isActive ? 'rgba(255,255,255,0.02)' : 'var(--bg-elevated)',
                                                border: isActive ? `1.5px solid var(--nya-gold)` : '1px solid var(--border-default)',
                                                borderRadius: 16, padding: '16px', cursor: 'pointer',
                                                transition: 'all 0.3s', display: 'flex', flexDirection: 'column', gap: 12
                                            }}
                                        >
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <div style={{ width: 14, height: 14, borderRadius: '50%', background: t.color1 }} />
                                                <div style={{ width: 14, height: 14, borderRadius: '50%', background: t.color2 }} />
                                                <div style={{ width: 14, height: 14, borderRadius: '50%', background: t.color3 }} />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fff' }}>
                                                    {t.name}
                                                </div>
                                                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                                    {t.desc}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Custom Theme Mixer Panel */}
                        {selectedCosmicTheme === 'custom' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    background: 'var(--nya-deep)', border: '1px solid var(--nya-gold)',
                                    borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column', gap: 24
                                }}
                            >
                                <div>
                                    <h3 style={{
                                        fontFamily: 'var(--font-display)', fontSize: '1.2rem',
                                        fontWeight: 900, color: 'var(--nya-gold)', marginBottom: 8,
                                        display: 'flex', alignItems: 'center', gap: 10
                                    }}>
                                        <Shuffle size={18} />
                                        CRÉATEUR DE CONSTELLATION UNIQUE
                                    </h3>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        Ajustez les longueurs d'ondes de couleur du Nexus pour forger votre propre dimension.
                                    </p>
                                </div>

                                {/* Mixer Controls Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16 }}>
                                    {[
                                        { key: 'ochre', label: 'Accent Principal (Marron)', val: customOchre },
                                        { key: 'ochreLight', label: 'Accent Lumineux', val: customOchreLight },
                                        { key: 'ochreDark', label: 'Accent Sombre', val: customOchreDark },
                                        { key: 'gold', label: 'Or Céleste', val: customGold },
                                        { key: 'brightGold', label: 'Or Brillant', val: customBrightGold },
                                        { key: 'sirius', label: 'Énergie de Sirius (Bleu/Rouge)', val: customSirius },
                                        { key: 'bgPrimary', label: 'Fond Abysse (Gris)', val: customBgPrimary },
                                        { key: 'bgSecondary', label: 'Fond Nébuleuse', val: customBgSecondary },
                                    ].map((field) => (
                                        <div
                                            key={field.key}
                                            style={{
                                                background: 'var(--bg-elevated)', borderRadius: 16,
                                                padding: 14, border: '1px solid var(--border-default)',
                                                display: 'flex', flexDirection: 'column', gap: 8
                                            }}
                                        >
                                            <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                                                {field.label}
                                            </label>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <input
                                                    type="color"
                                                    value={field.val}
                                                    onChange={(e) => updateCustomColor(field.key, e.target.value)}
                                                    style={{
                                                        width: 28, height: 28, border: 'none', borderRadius: '50%',
                                                        cursor: 'pointer', background: 'none'
                                                    }}
                                                />
                                                <input
                                                    type="text"
                                                    value={field.val.toUpperCase()}
                                                    onChange={(e) => {
                                                        if (e.target.value.startsWith('#') && e.target.value.length <= 7) {
                                                            updateCustomColor(field.key, e.target.value)
                                                        }
                                                    }}
                                                    style={{
                                                        background: 'none', border: 'none', color: '#fff',
                                                        fontFamily: 'var(--font-code)', fontSize: '0.7rem',
                                                        width: '100%', outline: 'none'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Custom actions */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, borderTop: '1px solid var(--border-default)', paddingTop: 20 }}>
                                    
                                    <button
                                        onClick={generateRandomTheme}
                                        style={{
                                            flex: '1 1 200px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                            background: 'rgba(212,160,23,0.1)', border: '1px solid var(--nya-gold)',
                                            color: 'var(--nya-gold)', padding: '12px 16px', borderRadius: 12,
                                            fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        <Shuffle size={14} /> GÉNÉRER UNE HARMONIE ALÉATOIRE
                                    </button>

                                    <button
                                        onClick={handleCopyShareCode}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 8,
                                            background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                                            color: '#fff', padding: '12px 16px', borderRadius: 12,
                                            fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer'
                                        }}
                                    >
                                        <Copy size={14} /> EXPORTER LA CLÉ
                                    </button>

                                </div>

                                {/* Import input */}
                                <div style={{ display: 'flex', gap: 10, background: 'var(--bg-elevated)', borderRadius: 12, padding: 8, border: '1px solid var(--border-default)' }}>
                                    <input
                                        type="text"
                                        placeholder="Coller un code de constellation..."
                                        value={shareCodeInput}
                                        onChange={(e) => setShareCodeInput(e.target.value)}
                                        style={{
                                            background: 'none', border: 'none', outline: 'none',
                                            color: '#fff', fontSize: '0.75rem', flex: 1, paddingLeft: 8
                                        }}
                                    />
                                    <button
                                        onClick={handleImportCode}
                                        style={{
                                            background: 'var(--nya-ochre)', border: 'none', color: '#fff',
                                            padding: '8px 16px', borderRadius: 8, fontSize: '0.7rem',
                                            fontWeight: 800, cursor: 'pointer'
                                        }}
                                    >
                                        IMPORTER
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Section 1: Langues */}
                        <div style={{
                            background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                            borderRadius: 24, padding: 24
                        }}>
                            <h3 style={{
                                fontFamily: 'var(--font-display)', fontSize: '1.2rem',
                                fontWeight: 900, color: 'var(--text-primary)', marginBottom: 20,
                                display: 'flex', alignItems: 'center', gap: 10
                            }}>
                                <Globe size={18} style={{ color: 'var(--nya-ochre)' }} />
                                TRADUCTION & LANGUE
                            </h3>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                {LANGUAGES.map((lang) => (
                                    <div
                                        key={lang.code}
                                        onClick={() => setLanguage(lang.code)}
                                        style={{
                                            background: language === lang.code ? 'rgba(184,92,46,0.1)' : 'var(--bg-elevated)',
                                            border: language === lang.code ? '1.5px solid var(--nya-ochre)' : '1px solid var(--border-default)',
                                            borderRadius: 16, padding: '16px 20px', cursor: 'pointer',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>
                                            {lang.name}
                                        </div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                            {lang.sub}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section 2: Audio */}
                        <div style={{
                            background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                            borderRadius: 24, padding: 24
                        }}>
                            <h3 style={{
                                fontFamily: 'var(--font-display)', fontSize: '1.2rem',
                                fontWeight: 900, color: 'var(--text-primary)', marginBottom: 20,
                                display: 'flex', alignItems: 'center', gap: 10
                            }}>
                                <Volume2 size={18} style={{ color: 'var(--nya-gold)' }} />
                                SYSTÈME SONORE DE SIRIUS
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>VOLUME DE L'AMBIANCE</label>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--nya-gold)' }}>{volume}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={volume}
                                        onChange={(e) => setVolume(parseInt(e.target.value))}
                                        style={{
                                            width: '100%',
                                            accentColor: 'var(--nya-ochre)',
                                            background: 'var(--bg-primary)',
                                            borderRadius: 6,
                                            height: 6
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-default)', paddingTop: 16 }}>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>EFFETS SONORES</div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>Activer les carillons lors des réussites</div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={soundEffects}
                                        onChange={(e) => setSoundEffects(e.target.checked)}
                                        style={{ width: 18, height: 18, accentColor: 'var(--nya-ochre)', cursor: 'pointer' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Confidentialité */}
                        <div style={{
                            background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                            borderRadius: 24, padding: 24
                        }}>
                            <h3 style={{
                                fontFamily: 'var(--font-display)', fontSize: '1.2rem',
                                fontWeight: 900, color: 'var(--text-primary)', marginBottom: 20,
                                display: 'flex', alignItems: 'center', gap: 10
                            }}>
                                <Eye size={18} style={{ color: 'var(--nya-ochre)' }} />
                                CONFIDENTIALITÉ
                            </h3>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>PROFIL PUBLIC</div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>Afficher votre pseudo et score sur le classement général</div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={publicProfile}
                                    onChange={(e) => setPublicProfile(e.target.checked)}
                                    style={{ width: 18, height: 18, accentColor: 'var(--nya-ochre)', cursor: 'pointer' }}
                                />
                            </div>
                        </div>

                        {/* Save Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSave}
                            style={{
                                width: '100%', padding: '16px', borderRadius: 12,
                                background: 'var(--nya-ochre)', border: 'none',
                                color: '#fff', fontWeight: 800, letterSpacing: '0.15em',
                                textTransform: 'uppercase', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                boxShadow: '0 8px 24px rgba(184,92,46,0.3)'
                            }}
                        >
                            <Save size={16} /> SAUVEGARDER LES CHOIX
                        </motion.button>

                    </div>

                    {/* Right Column: Live Preview & Danger Zone */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, position: 'sticky', top: 120 }}>
                        
                        {/* Live Preview Card */}
                        <div style={{
                            background: 'var(--nya-deep)', border: '1px solid var(--nya-gold)',
                            borderRadius: 24, padding: 24, boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                            display: 'flex', flexDirection: 'column', gap: 20
                        }}>
                            <div style={{ borderBottom: '1px solid var(--border-default)', paddingBottom: 12 }}>
                                <div className="cosmo-label" style={{ fontSize: '0.6rem' }}>PRÉVISUALISATION NEXUS</div>
                                <h4 style={{ fontSize: '1rem', color: '#fff', marginTop: 4 }}>DOCK DE CONTRÔLE LIVE</h4>
                            </div>

                            {/* Simulated Card Rendering */}
                            <div style={{
                                background: 'var(--bg-secondary)', border: '1px solid var(--border-default)',
                                borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 14
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.6rem', color: 'var(--nya-gold)', fontWeight: 800, letterSpacing: '0.1em' }}>NOMMO STATION</span>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--nya-sirius)', boxShadow: '0 0 8px var(--nya-sirius)' }} />
                                </div>

                                <div>
                                    <h5 style={{ fontSize: '1.1rem', color: '#fff', letterSpacing: '-0.02em' }}>ARTEFACT D'INITIATION</h5>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.5 }}>
                                        Exemple de description d'un module stellaire appliquant vos variables CSS en direct.
                                    </p>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-default)', paddingTop: 12 }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--nya-gold)' }}>500 COINS</span>
                                    
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{
                                            background: 'var(--nya-ochre)', border: 'none', color: '#fff',
                                            padding: '6px 14px', borderRadius: 8, fontSize: '0.65rem',
                                            fontWeight: 800, cursor: 'pointer'
                                        }}
                                    >
                                        ACTIVER
                                    </motion.button>
                                </div>
                            </div>

                            {/* Theme Details summary */}
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Teinte d'accent :</span>
                                    <span style={{ color: 'var(--nya-ochre)', fontFamily: 'var(--font-code)' }}>{selectedCosmicTheme === 'custom' ? customOchre : 'Variable'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Énergie de Sirius :</span>
                                    <span style={{ color: 'var(--nya-sirius)', fontFamily: 'var(--font-code)' }}>{selectedCosmicTheme === 'custom' ? customSirius : 'Variable'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Fond Principal :</span>
                                    <span style={{ color: 'var(--bg-primary)', fontFamily: 'var(--font-code)' }}>{selectedCosmicTheme === 'custom' ? customBgPrimary : 'Variable'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Reset Column */}
                        <div style={{
                            background: 'var(--nya-deep)', border: '1px solid rgba(239,68,68,0.2)',
                            borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column', gap: 20
                        }}>
                            <h3 style={{
                                fontFamily: 'var(--font-display)', fontSize: '1.2rem',
                                fontWeight: 900, color: '#ef4444',
                                display: 'flex', alignItems: 'center', gap: 10
                            }}>
                                <ShieldAlert size={18} />
                                ZONE DE DANGER
                            </h3>

                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                                La réinitialisation supprimera définitivement tous vos badges débloqués, votre solde de Nya Coins, votre voûte d'artefacts ainsi que vos historiques. Cette action est irréversible.
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleReset}
                                style={{
                                    width: '100%', padding: '14px', borderRadius: 12,
                                    background: confirmReset ? '#ef4444' : 'none',
                                    border: confirmReset ? 'none' : '1px solid #ef4444',
                                    color: confirmReset ? '#fff' : '#ef4444',
                                    fontWeight: 800, letterSpacing: '0.05em',
                                    textTransform: 'uppercase', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                                }}
                            >
                                <RefreshCw size={14} />
                                {confirmReset ? "CONFIRMER L'EFFACEMENT" : 'RÉINITIALISER MON COMPTE'}
                            </motion.button>

                            {confirmReset && (
                                <button
                                    onClick={() => setConfirmReset(false)}
                                    style={{
                                        background: 'none', border: 'none',
                                        fontSize: '0.7rem', color: 'var(--text-muted)',
                                        cursor: 'pointer', textDecoration: 'underline'
                                    }}
                                >
                                    Annuler la réinitialisation
                                </button>
                            )}
                        </div>

                    </div>

                </div>

            </main>
            <Footer />
        </div>
    )
}

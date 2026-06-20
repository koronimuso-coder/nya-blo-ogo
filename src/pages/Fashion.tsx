import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { useNotificationStore } from '../stores/notificationStore'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import { Download, Palette, Check } from 'lucide-react'

const TEMPLATES = [
    { id: 'boubou', name: 'Grand Boubou Royal', path: 'M 50,10 L 150,10 L 180,60 L 150,60 L 150,190 L 50,190 L 50,60 L 20,60 Z' },
    { id: 'tshirt', name: 'T-Shirt Nommo Tech', path: 'M 50,10 L 150,10 L 180,45 L 145,45 L 145,190 L 55,190 L 55,45 L 20,45 Z' },
    { id: 'robe', name: 'Robe Pagne Impériale', path: 'M 70,10 L 130,10 L 150,60 L 160,190 L 40,190 L 50,60 Z' }
]

const PATTERNS = [
    { id: 'zigzag', name: 'Zigzag Bogolan', color: '#B85C2E', strokeWidth: 4, spacing: 20 },
    { id: 'diamonds', name: 'Losanges Sacrés', color: '#D4A017', strokeWidth: 2, spacing: 30 },
    { id: 'lines', name: 'Lignes de Sirius', color: '#00E5A0', strokeWidth: 3, spacing: 15 },
]

const FABRIC_COLORS = [
    { name: 'Noir Ébène', value: '#0f0f0f' },
    { name: 'Ocre Bandiagara', value: '#8B4522' },
    { name: 'Bleu Indigo', value: '#0a0a2e' },
    { name: 'Blanc Sacré', value: '#f9f9f9' }
]

export default function Fashion() {
    const { addScore, checkoutCart } = useAuthStore()
    const { push } = useNotificationStore()

    const [template, setTemplate] = useState(TEMPLATES[0])
    const [pattern, setPattern] = useState(PATTERNS[0])
    const [fabricColor, setFabricColor] = useState(FABRIC_COLORS[0].value)

    const [isExporting, setIsExporting] = useState(false)
    const [exportSuccess, setExportSuccess] = useState(false)

    const handleExport = () => {
        setIsExporting(true)
        setTimeout(() => {
            setIsExporting(false)
            setExportSuccess(true)
            addScore(30)
            
            // Add custom dress to user profile inventory vault
            const customItem = {
                id: `custom-${template.id}-${Date.now()}`,
                name: `Création : ${template.name}`,
                price: '0',
                gradient: `linear-gradient(135deg, ${fabricColor} 0%, var(--nya-gold) 100%)`,
                quantity: 1
            }
            checkoutCart([customItem])

            // We simulate checkout or direct insertion
            // Let's call direct transaction credit for points
            push({
                type: 'reward',
                title: 'Création Enregistrée',
                message: 'Votre tenue a été sauvegardée et ajoutée à votre garde-robe.',
                icon: '👗',
                color: '#B85C2E'
            })
        }, 2200)
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
                    <div className="cosmo-label">Bogolan Studio {" > "} Haute Couture</div>
                    <h1 className="text-shimmer" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                        BOGOLAN STUDIO
                    </h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, alignItems: 'center' }}>
                    
                    {/* SVG Garment Preview Canvas */}
                    <div style={{
                        background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                        borderRadius: 24, padding: 40, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', minHeight: 450,
                        boxShadow: '0 25px 50px rgba(0,0,0,0.5)', position: 'relative'
                    }}>
                        <svg width="220" height="220" viewBox="0 0 200 200" style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}>
                            <defs>
                                <pattern id="bogolan-pattern" width={pattern.spacing} height={pattern.spacing} patternUnits="userSpaceOnUse">
                                    {pattern.id === 'zigzag' && (
                                        <path d={`M 0,${pattern.spacing/2} L ${pattern.spacing/2},0 L ${pattern.spacing},${pattern.spacing/2} L ${pattern.spacing/2},${pattern.spacing}`} fill="none" stroke={pattern.color} strokeWidth={pattern.strokeWidth} />
                                    )}
                                    {pattern.id === 'diamonds' && (
                                        <rect x="2" y="2" width={pattern.spacing - 4} height={pattern.spacing - 4} fill="none" stroke={pattern.color} strokeWidth={pattern.strokeWidth} />
                                    )}
                                    {pattern.id === 'lines' && (
                                        <line x1="0" y1="0" x2={pattern.spacing} y2={pattern.spacing} fill="none" stroke={pattern.color} strokeWidth={pattern.strokeWidth} />
                                    )}
                                </pattern>
                            </defs>

                            {/* Base fabric */}
                             <path d={template.path} fill={fabricColor} style={{ transition: 'fill 0.3s' }} />
                            
                            {/* Pattern overlay */}
                            <path d={template.path} fill="url(#bogolan-pattern)" opacity="0.65" />
                        </svg>

                        <div style={{ position: 'absolute', bottom: 20, fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.1em' }}>
                            CANVAS RENDU WebGL 2D
                        </div>
                    </div>

                    {/* Studio Customization Controls */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        
                        {/* Selector 1: Templates */}
                        <div style={{
                            background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                            borderRadius: 24, padding: 24
                        }}>
                            <h3 style={{
                                fontFamily: 'var(--font-display)', fontSize: '1rem',
                                fontWeight: 900, color: '#fff', marginBottom: 16,
                                display: 'flex', alignItems: 'center', gap: 8
                            }}>
                                <Palette size={16} style={{ color: 'var(--nya-gold)' }} />
                                PATRONS DE VÊTEMENTS
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {TEMPLATES.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setTemplate(t)}
                                        style={{
                                            padding: '12px 16px', borderRadius: 12,
                                            background: template.id === t.id ? 'rgba(184,92,46,0.1)' : 'var(--bg-elevated)',
                                            border: template.id === t.id ? '1px solid var(--nya-ochre)' : '1px solid var(--border-default)',
                                            color: '#fff', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer',
                                            textAlign: 'left', transition: 'all 0.3s'
                                        }}
                                    >
                                        {t.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Selector 2: Patterns & Colors */}
                        <div style={{
                            background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                            borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column', gap: 20
                        }}>
                            <div>
                                <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: 10 }}>MOTIFS BOGOLAN</h4>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    {PATTERNS.map(p => (
                                        <button
                                            key={p.id}
                                            onClick={() => setPattern(p)}
                                            style={{
                                                padding: '8px 14px', borderRadius: 8,
                                                background: pattern.id === p.id ? 'var(--nya-ochre)' : 'var(--bg-elevated)',
                                                border: 'none', color: '#fff', fontSize: '0.7rem', fontWeight: 700,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {p.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: 10 }}>COULEUR DU TISSU</h4>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    {FABRIC_COLORS.map(c => (
                                        <button
                                            key={c.name}
                                            onClick={() => setFabricColor(c.value)}
                                            style={{
                                                width: 32, height: 32, borderRadius: '50%',
                                                background: c.value, border: fabricColor === c.value ? '2px solid var(--nya-gold)' : '2px solid transparent',
                                                cursor: 'pointer', boxShadow: fabricColor === c.value ? '0 0 10px rgba(212,160,23,0.4)' : 'none'
                                            }}
                                            title={c.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Export actions */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleExport}
                            disabled={isExporting}
                            style={{
                                padding: '16px', borderRadius: 12,
                                background: 'var(--nya-ochre)', border: 'none',
                                color: '#fff', fontWeight: 800, letterSpacing: '0.1em',
                                textTransform: 'uppercase', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                boxShadow: '0 8px 24px rgba(184,92,46,0.3)'
                            }}
                        >
                            {isExporting ? (
                                <>
                                    <div style={{ width: 14, height: 14, border: '2px solid #fff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                    IMPRESSION NUMÉRIQUE...
                                </>
                            ) : exportSuccess ? (
                                <>
                                    <Check size={16} /> BOGOLAN EXPORTÉ !
                                </>
                            ) : (
                                <>
                                    <Download size={16} /> EXPORTER & TÉLÉCHARGER Le Patron
                                </>
                            )}
                        </motion.button>

                    </div>

                </div>

            </main>
            <Footer />
        </div>
    )
}

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import { Leaf, Search, Activity } from 'lucide-react'

interface Plant {
    id: string
    name: string
    scientificName: string
    symptoms: string[]
    description: string
    preparation: string
    rarity: string
    gradient: string
}

const PLANTS: Plant[] = [
    {
        id: '1',
        name: 'Moringa (Arbre de Vie)',
        scientificName: 'Moringa oleifera',
        symptoms: ['fatigue', 'carence', 'anémie', 'tension'],
        description: 'Plante aux apports nutritionnels hors du commun. Idéal pour lutter contre les états de fatigue passagère et réguler la glycémie.',
        preparation: 'Infusion de feuilles séchées pendant 10 minutes ou poudre ajoutée aux aliments.',
        rarity: 'Commune',
        gradient: 'linear-gradient(135deg, #0a2e1a 0%, #00E5A0 100%)'
    },
    {
        id: '2',
        name: 'Neem (Margousier)',
        scientificName: 'Azadirachta indica',
        symptoms: ['fièvre', 'paludisme', 'peau', 'boutons'],
        description: 'Puissant antiseptique et fébrifuge naturel largement utilisé dans toute l\'Afrique de l\'Ouest.',
        preparation: 'Décoction de feuilles en compresses locales pour la peau ou en boisson légère contre la fièvre.',
        rarity: 'Rare',
        gradient: 'linear-gradient(135deg, #1d3318 0%, #a78bfa 100%)'
    },
    {
        id: '3',
        name: 'Pulpe de Baobab (Bouye)',
        scientificName: 'Adansonia digitata',
        symptoms: ['digestion', 'transit', 'diarrhée', 'récupération'],
        description: 'Riche en vitamine C et fibres insolubles. Elle reconstitue la flore intestinale et régule les fonctions hépatiques.',
        preparation: 'Mélanger la poudre de pulpe dans de l\'eau fraîche ou du lait (jus de bouye).',
        rarity: 'Commune',
        gradient: 'linear-gradient(135deg, #2e1a0a 0%, #D4A017 100%)'
    },
    {
        id: '4',
        name: 'Kinkéliba (Tisane de Longue Vie)',
        scientificName: 'Combretum micranthum',
        symptoms: ['foie', 'détox', 'digestion', 'nettoyage'],
        description: 'Excellente plante dépurative facilitant le fonctionnement de la vésicule biliaire et l\'élimination rénale des toxines.',
        preparation: 'Faire bouillir les feuilles pendant 15 minutes et boire chaud le matin.',
        rarity: 'Initiatique',
        gradient: 'linear-gradient(135deg, #3d2e1a 0%, #ef4444 100%)'
    }
]

export default function Pharmacie() {
    const [search, setSearch] = useState('')
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null)
    const [diagnoseInput, setDiagnoseInput] = useState('')
    const [diagnosticResult, setDiagnosticResult] = useState<string | null>(null)

    const filtered = useMemo(() => {
        if (!search.trim()) return PLANTS
        const q = search.toLowerCase()
        return PLANTS.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.symptoms.some(s => s.includes(q))
        )
    }, [search])

    const handleDiagnose = (e: React.FormEvent) => {
        e.preventDefault()
        const q = diagnoseInput.toLowerCase()
        const match = PLANTS.find(p => p.symptoms.some(s => q.includes(s)))
        if (match) {
            setDiagnosticResult(`L'Oracle d'Amma vous conseille l'utilisation du ${match.name}. Symptômes identifiés : ${match.symptoms.filter(s => q.includes(s)).join(', ')}. Préparation : ${match.preparation}`)
        } else {
            setDiagnosticResult("Aucun remède évident trouvé pour ces symptômes dans l'Herbier de base. Veuillez essayer des mots clés comme 'fatigue', 'fièvre' ou 'digestion'.")
        }
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
                    <div className="cosmo-label">Soins d'Amma {" > "} Herboristerie</div>
                    <h1 className="text-shimmer" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                        L'HERBIER D'AMMA
                    </h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 40, alignItems: 'start' }}>
                    
                    {/* Herb list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {/* Search Bar */}
                        <div style={{ position: 'relative', width: '100%' }}>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher une plante ou un symptôme (ex: fatigue, fièvre)..."
                                style={{
                                    width: '100%', padding: '14px 16px 14px 44px',
                                    background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                                    borderRadius: 14, color: '#fff', fontSize: '0.85rem', outline: 'none'
                                }}
                            />
                            <Search size={16} style={{ position: 'absolute', left: 16, top: 16, color: 'var(--text-muted)' }} />
                        </div>

                        {/* Plants grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                            {filtered.map((plant) => (
                                <motion.div
                                    key={plant.id}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setSelectedPlant(plant)}
                                    style={{
                                        background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                                        borderRadius: 20, padding: 24, cursor: 'pointer',
                                        display: 'flex', flexDirection: 'column', gap: 14
                                    }}
                                >
                                    <div style={{
                                        width: '100%', height: 100, borderRadius: 12,
                                        background: plant.gradient, display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        color: '#fff', fontSize: '2.5rem'
                                    }}>
                                        <Leaf />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>{plant.name}</div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: 2 }}>{plant.scientificName}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Diagnostic Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
                                ORACLE DE DIAGNOSTIC
                            </h3>

                            <form onSubmit={handleDiagnose} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>VOS SYMPTÔMES</label>
                                    <input
                                        type="text"
                                        value={diagnoseInput}
                                        onChange={(e) => setDiagnoseInput(e.target.value)}
                                        placeholder="Ex: J'ai de la fièvre et des boutons"
                                        required
                                        style={{
                                            width: '100%', padding: '12px 16px',
                                            background: 'var(--bg-primary)', border: '1px solid var(--border-default)',
                                            borderRadius: 12, color: 'var(--text-primary)', outline: 'none'
                                        }}
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    style={{
                                        padding: '12px', borderRadius: 12,
                                        background: 'var(--nya-ochre)', border: 'none',
                                        color: '#fff', fontWeight: 800, fontSize: '0.8rem',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                                    }}
                                >
                                    Consulter l'Oracle
                                </motion.button>
                            </form>

                            <AnimatePresence>
                                {diagnosticResult && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        style={{
                                            background: 'var(--bg-primary)', border: '1px solid var(--border-hover)',
                                            borderRadius: 12, padding: 16, marginTop: 20,
                                            fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5
                                        }}
                                    >
                                        {diagnosticResult}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                </div>

            </main>

            {/* Plant Detail Modal */}
            <AnimatePresence>
                {selectedPlant && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedPlant(null)}
                            style={{
                                position: 'fixed', inset: 0, zIndex: 99998,
                                background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)'
                            }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            style={{
                                position: 'fixed', top: '50%', left: '50%',
                                transform: 'translate(-50%, -50%)', zIndex: 99999,
                                width: 'min(480px, 90vw)'
                            }}
                        >
                            <div style={{
                                background: 'var(--nya-deep)', border: '1px solid rgba(0,229,160,0.4)',
                                borderRadius: 24, padding: 32, color: '#fff', position: 'relative'
                            }}>
                                <button
                                    onClick={() => setSelectedPlant(null)}
                                    style={{
                                        position: 'absolute', top: 16, right: 16,
                                        background: 'none', border: 'none', color: 'var(--text-muted)',
                                        cursor: 'pointer', fontSize: '1.2rem'
                                    }}
                                >
                                    ✕
                                </button>

                                <div style={{
                                    width: 100, height: 100, borderRadius: '50%',
                                    background: selectedPlant.gradient, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 20px', fontSize: '3rem'
                                }}>
                                    <Leaf />
                                </div>

                                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900 }}>{selectedPlant.name}</h3>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--nya-gold)', textTransform: 'uppercase', marginTop: 4 }}>{selectedPlant.scientificName}</p>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <div>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>DESCRIPTION</span>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: 4 }}>{selectedPlant.description}</p>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>PREPARATION</span>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: 4 }}>{selectedPlant.preparation}</p>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>SYMPTÔMES ASSOCIÉS</span>
                                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                                            {selectedPlant.symptoms.map(s => (
                                                <span key={s} style={{ fontSize: '0.65rem', fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: 'var(--bg-elevated)', color: '#00E5A0' }}>
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
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

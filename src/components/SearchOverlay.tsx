import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search, Store, GraduationCap, Car, Building2, Cross,
    Bot, Gamepad2, Film, FileText, Heart, Briefcase, Settings,
    ArrowRight
} from 'lucide-react'

const searchItems = [
    { icon: Store, title: 'NYA BLO Market', desc: 'Marketplace sacré', path: '/shop', category: 'Modules' },
    { icon: GraduationCap, title: 'École des Scribes', desc: 'Formations d\'élite', path: '/learn', category: 'Modules' },
    { icon: Car, title: 'VTC Sirius', desc: 'Transport premium', path: '/vtc', category: 'Modules' },
    { icon: Building2, title: 'NYA Immobilier', desc: 'Villas & bureaux', path: '/immobilier', category: 'Modules' },
    { icon: Cross, title: 'Soins d\'Amma', desc: 'Santé & bien-être', path: '/health', category: 'Modules' },
    { icon: Bot, title: 'Laboratoire Nommo', desc: 'Forge IA', path: '/lab', category: 'Outils' },
    { icon: Gamepad2, title: 'Jeux d\'Esprit', desc: 'Défis stratégiques', path: '/games', category: 'Outils' },
    { icon: Film, title: 'Toguna Stream', desc: 'Cinéma africain', path: '/media', category: 'Outils' },
    { icon: FileText, title: 'Sceau du Destin (CV)', desc: 'CV Builder IA', path: '/cv-builder', category: 'Outils' },
    { icon: Heart, title: 'À Propos', desc: 'Notre vision', path: '/about', category: 'Pages' },
    { icon: Briefcase, title: 'Tarification', desc: 'Plans & prix', path: '/pricing', category: 'Pages' },
    { icon: Settings, title: 'Contact', desc: 'Nous joindre', path: '/contact', category: 'Pages' },
]

export default function SearchOverlay() {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()

    const filtered = query.trim()
        ? searchItems.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.desc.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        )
        : searchItems

    const grouped = filtered.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = []
        acc[item.category].push(item)
        return acc
    }, {} as Record<string, typeof searchItems>)

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault()
            setIsOpen(prev => !prev)
        }
        if (e.key === 'Escape') setIsOpen(false)
    }, [])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])

    useEffect(() => {
        if (isOpen) {
            setQuery('')
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [isOpen])

    const goTo = (path: string) => {
        setIsOpen(false)
        navigate(path)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 9999,
                        background: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                        paddingTop: '15vh',
                    }}
                    onClick={() => setIsOpen(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: '100%', maxWidth: 600, maxHeight: '60vh',
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--border-hover)',
                            borderRadius: 'var(--radius-xl, 20px)',
                            overflow: 'hidden',
                            boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
                        }}
                    >
                        {/* Search input */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 14,
                            padding: '20px 24px',
                            borderBottom: '1px solid var(--border-default)',
                        }}>
                            <Search size={20} style={{ color: 'var(--nya-ochre)', flexShrink: 0 }} />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Rechercher un module, une page..."
                                style={{
                                    flex: 1, background: 'none', border: 'none', outline: 'none',
                                    color: 'var(--text-primary)',
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '1rem',
                                }}
                            />
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 4,
                                padding: '4px 10px', borderRadius: 6,
                                background: 'var(--bg-elevated)',
                                fontSize: '0.65rem', fontWeight: 700,
                                color: 'var(--text-faint)',
                                letterSpacing: '0.05em',
                            }}>
                                ESC
                            </div>
                        </div>

                        {/* Results */}
                        <div style={{
                            maxHeight: '45vh', overflowY: 'auto',
                            padding: '12px 8px',
                        }}>
                            {Object.entries(grouped).map(([category, items]) => (
                                <div key={category} style={{ marginBottom: 8 }}>
                                    <div style={{
                                        padding: '8px 16px',
                                        fontSize: '0.6rem', fontWeight: 800,
                                        letterSpacing: '0.2em',
                                        color: 'var(--text-faint)',
                                        textTransform: 'uppercase',
                                    }}>{category}</div>
                                    {items.map((item) => (
                                        <motion.div
                                            key={item.path}
                                            whileHover={{ background: 'var(--card-bg-hover)' }}
                                            onClick={() => goTo(item.path)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 14,
                                                padding: '12px 16px',
                                                borderRadius: 'var(--radius-sm, 8px)',
                                                cursor: 'pointer',
                                                transition: 'background 0.15s',
                                            }}
                                        >
                                            <item.icon size={18} style={{ color: 'var(--nya-ochre)', flexShrink: 0 }} />
                                            <div style={{ flex: 1 }}>
                                                <div style={{
                                                    fontFamily: 'var(--font-display)',
                                                    fontSize: '0.9rem', fontWeight: 800,
                                                    color: 'var(--text-primary)',
                                                }}>{item.title}</div>
                                                <div style={{
                                                    fontSize: '0.7rem',
                                                    color: 'var(--text-faint)',
                                                }}>{item.desc}</div>
                                            </div>
                                            <ArrowRight size={14} style={{ color: 'var(--text-faint)', opacity: 0 }} className="search-arrow" />
                                        </motion.div>
                                    ))}
                                </div>
                            ))}
                            {filtered.length === 0 && (
                                <div style={{
                                    padding: '40px 20px',
                                    textAlign: 'center',
                                    color: 'var(--text-faint)',
                                    fontSize: '0.85rem',
                                }}>
                                    Aucun résultat pour "{query}"
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
    Search, Store, GraduationCap, Car, Building2, Heart,
    Gamepad2, Bot, FileText, Film, LayoutDashboard,
    Trophy, Settings, HelpCircle, ArrowRight, User, Wallet,
    MessageSquare, Music, Smile, ShieldAlert, Sprout, Paintbrush,
    BookOpen, Sparkles, Rocket, TreeDeciduous, Dumbbell, Compass,
    Coins, Mic, Calendar, BookOpenCheck
} from 'lucide-react'

interface CommandItem {
    id: string
    title: string
    description: string
    icon: React.ReactNode
    category: 'page' | 'module' | 'action'
    action: () => void
    keywords: string[]
}

/**
 * CommandPalette — "Invocation Sirius" (Ctrl+K / ⌘K)
 * Global search & navigation overlay similar to VS Code / Raycast.
 */
export default function CommandPalette() {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [selectedIdx, setSelectedIdx] = useState(0)
    const inputRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()

    const go = useCallback((path: string) => {
        setOpen(false)
        setQuery('')
        navigate(path)
    }, [navigate])

    const commands: CommandItem[] = useMemo(() => [
        // Core Pages
        { id: 'home', title: 'Accueil', description: 'Page d\'accueil NYA BLO', icon: <LayoutDashboard size={16} />, category: 'page', action: () => go('/'), keywords: ['accueil', 'home', 'landing'] },
        { id: 'dashboard', title: 'Observatoire Sirius', description: 'Dashboard utilisateur', icon: <LayoutDashboard size={16} />, category: 'page', action: () => go('/dashboard'), keywords: ['dashboard', 'stats', 'observatory'] },
        { id: 'profile', title: 'Profil Initié', description: 'Identité sacrée et voûte d\'artefacts', icon: <User size={16} />, category: 'page', action: () => go('/profile'), keywords: ['profil', 'profile', 'avatar', 'voûte', 'inventaire'] },
        { id: 'wallet', title: 'Portefeuille Sirius', description: 'Gérer vos Nya Coins et virements', icon: <Wallet size={16} />, category: 'page', action: () => go('/wallet'), keywords: ['portefeuille', 'wallet', 'coins', 'argent', 'virement'] },
        { id: 'settings', title: 'Paramètres', description: 'Audio, langues et configurations', icon: <Settings size={16} />, category: 'page', action: () => go('/settings'), keywords: ['paramètres', 'settings', 'config', 'langue', 'volume'] },
        { id: 'leaderboard', title: 'Classement des Scribes', description: 'Tableau d\'honneur du Toguna', icon: <Trophy size={16} />, category: 'page', action: () => go('/leaderboard'), keywords: ['leaderboard', 'classement', 'ranking', 'trophée', 'top'] },
        { id: 'achievements', title: 'Initiations Dogon', description: 'Badges et accomplissements', icon: <Trophy size={16} />, category: 'page', action: () => go('/achievements'), keywords: ['achievements', 'badges', 'trophée', 'succès'] },

        // Modules
        { id: 'shop', title: 'NYA BLO Market', description: 'Boutique et marketplace', icon: <Store size={16} />, category: 'module', action: () => go('/shop'), keywords: ['shop', 'marché', 'boutique', 'acheter'] },
        { id: 'learn', title: 'École des Scribes', description: 'Apprentissage et formation', icon: <GraduationCap size={16} />, category: 'module', action: () => go('/learn'), keywords: ['learn', 'école', 'formation', 'cours'] },
        { id: 'vtc', title: 'VTC Sirius', description: 'Transport premium certifié', icon: <Car size={16} />, category: 'module', action: () => go('/vtc'), keywords: ['vtc', 'transport', 'chauffeur', 'taxi', 'carte'] },
        { id: 'immobilier', title: 'NYA Immobilier', description: 'Biens immobiliers et visites', icon: <Building2 size={16} />, category: 'module', action: () => go('/immobilier'), keywords: ['immobilier', 'villa', 'terrain', 'maison'] },
        { id: 'health', title: 'Soins d\'Amma', description: 'Santé et bien-être', icon: <Heart size={16} />, category: 'module', action: () => go('/health'), keywords: ['santé', 'health', 'soins'] },
        { id: 'games', title: 'Jeux d\'Esprit', description: 'Puzzles ancestrales', icon: <Gamepad2 size={16} />, category: 'module', action: () => go('/games'), keywords: ['jeux', 'games', 'puzzle', 'memory'] },
        { id: 'lab', title: 'Laboratoire Nommo', description: 'Forge IA et Canvas', icon: <Bot size={16} />, category: 'module', action: () => go('/lab'), keywords: ['lab', 'ia', 'nommo', 'canvas', 'chat'] },
        { id: 'cv', title: 'Sceau du Destin', description: 'Créateur de CV avec aperçu', icon: <FileText size={16} />, category: 'module', action: () => go('/cv-builder'), keywords: ['cv', 'resume', 'builder', 'sceau'] },
        { id: 'media', title: 'Toguna Stream', description: 'Cinéma et médias', icon: <Film size={16} />, category: 'module', action: () => go('/media'), keywords: ['media', 'stream', 'film', 'video'] },
        
        // 20 New Interactive Sub-modules
        { id: 'chat', title: 'Toguna Chat', description: 'Discuter avec les Gardiens IA', icon: <MessageSquare size={16} />, category: 'module', action: () => go('/chat'), keywords: ['chat', 'discuss', 'forum', 'gardiens'] },
        { id: 'music', title: 'Sirius Stream / Musique', description: 'Ambiance sonore afro-lofi', icon: <Music size={16} />, category: 'module', action: () => go('/music'), keywords: ['music', 'musique', 'lofi', 'sahel', 'kora'] },
        { id: 'comedy', title: 'Toguna Comedy Hub', description: 'Contes et rires folkloriques', icon: <Smile size={16} />, category: 'module', action: () => go('/comedy'), keywords: ['comedy', 'humour', 'rires', 'contes', 'folklore'] },
        { id: 'pharmacie', title: 'Herbier d\'Amma / Pharmacie', description: 'Médecine traditionnelle & remèdes', icon: <ShieldAlert size={16} />, category: 'module', action: () => go('/pharmacie'), keywords: ['pharmacie', 'herbier', 'plantes', 'remède', 'moringa'] },
        { id: 'agriculture', title: 'Ogo Farm', description: 'Saisons agricoles et cours réels', icon: <Sprout size={16} />, category: 'module', action: () => go('/agriculture'), keywords: ['agriculture', 'ferme', 'saisons', 'mil', 'manioc'] },
        { id: 'fashion', title: 'Bogolan Studio', description: 'Créateur de mode bogolan/wax 2D', icon: <Paintbrush size={16} />, category: 'module', action: () => go('/fashion'), keywords: ['fashion', 'mode', 'bogolan', 'wax', 'tissu'] },
        { id: 'books', title: 'Scribe Books', description: 'Bibliothèque des savoirs anciens', icon: <BookOpen size={16} />, category: 'module', action: () => go('/books'), keywords: ['books', 'livres', 'bibliothèque', 'dogon', 'empire'] },
        { id: 'reve', title: 'Oracle des Rêves', description: 'Interprétation cosmique de rêves', icon: <Sparkles size={16} />, category: 'module', action: () => go('/reve'), keywords: ['rêve', 'reve', 'oracle', 'présage', 'sommeil'] },
        { id: 'startup', title: 'Startup Incubator', description: 'Simulateur de pitch et business', icon: <Rocket size={16} />, category: 'module', action: () => go('/startup'), keywords: ['startup', 'business', 'pitch', 'incubateur', 'investir'] },
        { id: 'genealogy', title: 'Arbre Généalogique', description: 'Origines des noms et totems', icon: <TreeDeciduous size={16} />, category: 'module', action: () => go('/genealogy'), keywords: ['généalogie', 'genealogy', 'arbre', 'nom', 'totem', 'kone'] },
        { id: 'fitness', title: 'Amma Fitness', description: 'Sport et danses traditionnelles', icon: <Dumbbell size={16} />, category: 'module', action: () => go('/fitness'), keywords: ['fitness', 'sport', 'danse', 'zaouli', 'calories'] },
        { id: 'meditation', title: 'Méditation Nommo', description: 'Exercices respiratoires sacrés', icon: <Compass size={16} />, category: 'module', action: () => go('/meditation'), keywords: ['méditation', 'meditation', 'zen', 'respirer', 'binaural'] },
        { id: 'crowdfunding', title: 'Crowdfunding Créatif', description: 'Financer des projets d\'avenir', icon: <Coins size={16} />, category: 'module', action: () => go('/crowdfunding'), keywords: ['crowdfunding', 'financer', 'projets', 'coins', 'soutien'] },
        { id: 'podcast', title: 'Toguna Podcast', description: 'Récits astronomiques et tech', icon: <Mic size={16} />, category: 'module', action: () => go('/podcast'), keywords: ['podcast', 'audio', 'récit', 'sirius', 'astronomie'] },
        { id: 'calendar', title: 'Calendrier Cosmique', description: 'Cycles agraires et lunaires Dogon', icon: <Calendar size={16} />, category: 'module', action: () => go('/calendar'), keywords: ['calendrier', 'calendar', 'lune', 'sirius', 'saison'] },
        { id: 'quiz', title: 'Le Quiz des Scribes', description: 'Arène de questions chronométrées', icon: <BookOpenCheck size={16} />, category: 'module', action: () => go('/quiz'), keywords: ['quiz', 'trivia', 'questions', 'savoir', 'temps'] },
        { id: 'map', title: 'Carte Céleste des Empires', description: 'Cartographie et constellations sacrées', icon: <Compass size={16} />, category: 'module', action: () => go('/map'), keywords: ['carte', 'map', 'constellation', 'empire', 'histoire', 'sirius'] },

        // Actions
        { id: 'faq', title: 'FAQ', description: 'Questions fréquentes', icon: <HelpCircle size={16} />, category: 'action', action: () => go('/faq'), keywords: ['faq', 'aide', 'questions'] },
        { id: 'contact', title: 'Contact', description: 'Nous contacter', icon: <Settings size={16} />, category: 'action', action: () => go('/contact'), keywords: ['contact', 'email', 'whatsapp'] },
        { id: 'about', title: 'À Propos', description: 'Notre histoire', icon: <HelpCircle size={16} />, category: 'action', action: () => go('/about'), keywords: ['about', 'propos', 'histoire'] },
    ], [go])

    const filtered = useMemo(() => {
        if (!query.trim()) return commands
        const q = query.toLowerCase()
        return commands.filter(c =>
            c.title.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q) ||
            c.keywords.some(k => k.includes(q))
        )
    }, [query, commands])

    // Keyboard shortcut
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault()
                setOpen(prev => !prev)
            }
            if (e.key === 'Escape') {
                setOpen(false)
                setQuery('')
            }
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [])

    // Focus input when opened
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 100)
            setSelectedIdx(0)
        }
    }, [open])

    // Keyboard nav
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSelectedIdx(prev => Math.min(prev + 1, filtered.length - 1))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSelectedIdx(prev => Math.max(prev - 1, 0))
        } else if (e.key === 'Enter' && filtered[selectedIdx]) {
            filtered[selectedIdx].action()
        }
    }

    useEffect(() => { setSelectedIdx(0) }, [query])

    const categoryLabels: Record<string, string> = {
        page: 'PAGES PRINCIPALES',
        module: 'MODULES DE L\'ÉCOSYSTÈME',
        action: 'SUPPORT & INFORMATIONS',
    }

    // Group by category
    const grouped = useMemo(() => {
        const groups: Record<string, CommandItem[]> = {}
        filtered.forEach(item => {
            if (!groups[item.category]) groups[item.category] = []
            groups[item.category].push(item)
        })
        return groups
    }, [filtered])

    let flatIdx = 0

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => { setOpen(false); setQuery('') }}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 10000,
                            background: 'rgba(0,0,0,0.6)',
                            backdropFilter: 'blur(8px)',
                        }}
                    />

                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            position: 'fixed',
                            top: '15%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 10001,
                            width: 600,
                            maxWidth: '90vw',
                            background: 'var(--nya-deep)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Search input */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '16px 20px',
                            borderBottom: '1px solid var(--border-default)',
                        }}>
                            <Search size={18} style={{ color: 'var(--nya-ochre)', flexShrink: 0 }} />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Rechercher une page, module ou action..."
                                style={{
                                    flex: 1, background: 'none', border: 'none', outline: 'none',
                                    color: 'var(--text-primary)',
                                    fontFamily: 'var(--font-body)', fontSize: '0.95rem',
                                }}
                            />
                            <div style={{
                                padding: '4px 8px', borderRadius: 6,
                                background: 'var(--bg-elevated)',
                                border: '1px solid var(--border-default)',
                                fontSize: '0.6rem', fontWeight: 700,
                                letterSpacing: '0.1em', color: 'var(--text-faint)',
                            }}>
                                ESC
                            </div>
                        </div>

                        {/* Results */}
                        <div style={{ maxHeight: 400, overflowY: 'auto', padding: '8px 0' }}>
                            {filtered.length === 0 ? (
                                <div style={{
                                    padding: 32, textAlign: 'center',
                                    color: 'var(--text-faint)', fontSize: '0.8rem',
                                }}>
                                    Aucun résultat pour "{query}"
                                </div>
                            ) : (
                                Object.entries(grouped).map(([cat, items]) => (
                                    <div key={cat}>
                                        <div style={{
                                            padding: '8px 20px 4px',
                                            fontSize: '0.6rem', fontWeight: 800,
                                            letterSpacing: '0.2em', textTransform: 'uppercase',
                                            color: 'var(--text-faint)',
                                        }}>
                                            {categoryLabels[cat] || cat.toUpperCase()}
                                        </div>
                                        {items.map((item) => {
                                            const currentIdx = flatIdx++
                                            const isSelected = currentIdx === selectedIdx
                                            return (
                                                <motion.div
                                                    key={item.id}
                                                    onClick={() => item.action()}
                                                    onMouseEnter={() => setSelectedIdx(currentIdx)}
                                                    whileTap={{ scale: 0.98 }}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: 12,
                                                        padding: '10px 20px',
                                                        cursor: 'pointer',
                                                        background: isSelected ? 'rgba(184,92,46,0.08)' : 'transparent',
                                                        borderLeft: isSelected ? '2px solid var(--nya-ochre)' : '2px solid transparent',
                                                        transition: 'all 0.15s ease',
                                                    }}
                                                >
                                                    <div style={{
                                                        width: 32, height: 32, borderRadius: 8,
                                                        background: isSelected ? 'rgba(184,92,46,0.15)' : 'var(--bg-elevated)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        color: isSelected ? 'var(--nya-ochre)' : 'var(--text-muted)',
                                                        transition: 'all 0.15s',
                                                    }}>
                                                        {item.icon}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{
                                                            fontSize: '0.85rem', fontWeight: 700,
                                                            color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                                                        }}>
                                                            {item.title}
                                                        </div>
                                                        <div style={{
                                                            fontSize: '0.7rem', color: 'var(--text-faint)',
                                                        }}>
                                                            {item.description}
                                                        </div>
                                                    </div>
                                                    {isSelected && (
                                                        <ArrowRight size={14} style={{ color: 'var(--nya-ochre)' }} />
                                                    )}
                                                </motion.div>
                                            )
                                        })}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div style={{
                            padding: '10px 20px',
                            borderTop: '1px solid var(--border-default)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            fontSize: '0.6rem', fontWeight: 700,
                            letterSpacing: '0.1em', color: 'var(--text-faint)',
                        }}>
                            <span>↑↓ NAVIGUER</span>
                            <span>↵ SÉLECTIONNER</span>
                            <span>ESC FERMER</span>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

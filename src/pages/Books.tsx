import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { useNotificationStore } from '../stores/notificationStore'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import { ArrowLeft, ArrowRight, Book } from 'lucide-react'

interface BookItem {
    id: string
    title: string
    author: string
    desc: string
    pages: string[]
}

const BOOKS: BookItem[] = [
    {
        id: '1',
        title: 'La Création par Amma',
        author: 'Prêtres de Bandiagara',
        desc: 'Récit cosmologique de la genèse de l\'univers par le dieu unique Amma et la formation des étoiles.',
        pages: [
            "Au commencement était Amma, le Dieu Suprême. Il existait dans un œuf cosmique, solitaire et infini. Rien d'autre n'existait.",
            "Amma créa les quatre éléments sacrés : l'eau, la terre, le feu et l'air. Il les disposa selon les lois de la géométrie cosmique.",
            "Puis, Amma créa les Nommo, esprits d'eau et de sagesse, pour veiller sur l'équilibre du monde et transmettre la parole sacrée aux hommes.",
            "Il dessina ensuite les constellations dans le ciel noir, plaçant au cœur de la nuit l'étoile triple de Sirius, guide céleste éternel de l'humanité."
        ]
    },
    {
        id: '2',
        title: 'L\'Empire Céleste du Mali',
        author: 'Griot de Ségou',
        desc: 'L\'histoire de Soundiata Keïta et de la charte de Kouroukan Fouga, l\'une des premières constitutions du monde.',
        pages: [
            "Au XIIIe siècle, Soundiata Keïta réunit les clans mandingues et fonda l'Empire du Mali après la célèbre bataille de Kirina.",
            "Il proclama la Charte de Kouroukan Fouga en 1236, établissant les droits de l'homme, la paix sociale et le respect des aînés.",
            "L'Empire prospéra grâce au commerce de l'or et du sel, attirant les savants du monde entier dans les universités de Tombouctou.",
            "L'histoire de Soundiata est le symbole même de la souveraineté et de l'éclat de la civilisation ouest-africaine."
        ]
    }
]

export default function Books() {
    const { addScore } = useAuthStore()
    const { push } = useNotificationStore()

    const [selectedBook, setSelectedBook] = useState<BookItem | null>(null)
    const [pageIdx, setPageIdx] = useState(0)

    const startReading = (book: BookItem) => {
        setSelectedBook(book)
        setPageIdx(0)
    }

    const nextPage = () => {
        if (!selectedBook) return
        if (pageIdx < selectedBook.pages.length - 1) {
            setPageIdx(prev => prev + 1)
        } else {
            // Reached last page - reward score
            addScore(25)
            push({
                type: 'reward',
                title: 'Livre Terminé',
                message: 'Vous avez assimilé le savoir de ce manuscrit. +25 Nya Score obtenu.',
                icon: '📚',
                color: '#00E5A0'
            })
            setSelectedBook(null)
        }
    }

    const prevPage = () => {
        if (pageIdx > 0) {
            setPageIdx(prev => prev - 1)
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
                    <div className="cosmo-label">Académie des Scribes {" > "} Manuscrits anciens</div>
                    <h1 className="text-shimmer" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                        SCRIBE BOOKS
                    </h1>
                </div>

                {!selectedBook ? (
                    /* Library Shelf Selector */
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
                        {BOOKS.map((book) => (
                            <motion.div
                                key={book.id}
                                whileHover={{ scale: 1.03, y: -4 }}
                                style={{
                                    background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                                    borderRadius: 24, padding: 32, cursor: 'pointer',
                                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                                    minHeight: 220
                                }}
                                onClick={() => startReading(book)}
                            >
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                        <Book size={20} style={{ color: 'var(--nya-ochre)' }} />
                                        <span style={{ fontSize: '0.65rem', color: 'var(--nya-gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>MANUSCRIT</span>
                                    </div>
                                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 900, color: '#fff', marginBottom: 12 }}>
                                        {book.title}
                                    </h3>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                        {book.desc}
                                    </p>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--nya-ochre)', fontSize: '0.8rem', fontWeight: 700, marginTop: 20 }}>
                                    Dérouler le rouleau <ArrowRight size={14} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    /* Papyrus Book Reader Layout */
                    <div style={{
                        background: 'linear-gradient(135deg, #2d241e 0%, #1a1410 100%)',
                        border: '2px solid rgba(212,160,23,0.3)',
                        borderRadius: 24, padding: 40, maxWidth: 640, margin: '0 auto',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.6), inset 0 0 30px rgba(212,160,23,0.05)',
                        minHeight: 380, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                    }}>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(212,160,23,0.2)', paddingBottom: 16, marginBottom: 24 }}>
                            <div>
                                <span style={{ fontSize: '0.6rem', color: 'var(--nya-gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Lecture en cours</span>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 900, color: '#fff', marginTop: 4 }}>{selectedBook.title}</h3>
                            </div>
                            <button
                                onClick={() => setSelectedBook(null)}
                                style={{
                                    background: 'none', border: 'none', color: 'var(--text-muted)',
                                    cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'underline'
                                }}
                            >
                                Retour à la bibliothèque
                            </button>
                        </div>

                        {/* Page Content */}
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={pageIdx}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.25 }}
                                    style={{
                                        fontFamily: 'Georgia, serif',
                                        fontSize: '1rem', color: '#eae1d8',
                                        lineHeight: 1.8, textAlign: 'justify', fontStyle: 'italic'
                                    }}
                                >
                                    {selectedBook.pages[pageIdx]}
                                </motion.p>
                            </AnimatePresence>
                        </div>

                        {/* Pagination footer */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, borderTop: '1px solid rgba(212,160,23,0.2)', paddingTop: 16 }}>
                            <button
                                onClick={prevPage}
                                disabled={pageIdx === 0}
                                style={{
                                    background: 'none', border: 'none', color: pageIdx === 0 ? 'rgba(255,255,255,0.1)' : 'var(--nya-gold)',
                                    cursor: pageIdx === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                                    fontSize: '0.8rem', fontWeight: 700
                                }}
                            >
                                <ArrowLeft size={16} /> Précédent
                            </button>

                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                                PAGE {pageIdx + 1} / {selectedBook.pages.length}
                            </span>

                            <button
                                onClick={nextPage}
                                style={{
                                    background: 'none', border: 'none', color: 'var(--nya-gold)',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                                    fontSize: '0.8rem', fontWeight: 700
                                }}
                            >
                                {pageIdx === selectedBook.pages.length - 1 ? 'Terminer' : 'Suivant'} <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

            </main>
            <Footer />
        </div>
    )
}

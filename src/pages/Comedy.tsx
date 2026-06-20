import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { useNotificationStore } from '../stores/notificationStore'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import { BookOpen, ArrowRight } from 'lucide-react'

interface StoryNode {
    text: string
    options: { text: string, nextNode: string, reward?: number }[]
}

const STORIES: Record<string, { title: string, desc: string, startNode: string, nodes: Record<string, StoryNode> }> = {
    anansi: {
        title: "L'Araignée Anansi et la Jarre de Sagesse",
        desc: "Accompagnez l'araignée Anansi alors qu'elle essaie de s'approprier toute la sagesse du monde.",
        startNode: "start",
        nodes: {
            start: {
                text: "Anansi a rassemblé toute la sagesse du monde dans une jarre en terre cuite. Pour la cacher, il décide de la monter au sommet d'un grand baobab. Mais attacher la jarre devant son ventre rend la montée très difficile. Que fait Anansi ?",
                options: [
                    { text: "Continuer à grimper en serrant la jarre sur son ventre.", nextNode: "belly_climb" },
                    { text: "Écouter les conseils de son fils Ntikuma qui suggère de l'attacher dans son dos.", nextNode: "back_climb" }
                ]
            },
            belly_climb: {
                text: "Anansi glisse et la jarre manque de se briser. La frustration monte. Un singe passe et se moque de lui. Que fait Anansi ?",
                options: [
                    { text: "Lancer la jarre de colère contre le singe.", nextNode: "break_jar" },
                    { text: "S'arrêter, respirer et attacher finalement la jarre dans son dos.", nextNode: "back_climb" }
                ]
            },
            back_climb: {
                text: "La jarre sur son dos, Anansi grimpe avec une facilité déconcertante ! Il atteint le sommet. Mais il réalise qu'il s'est comporté de manière stupide en refusant de partager ce savoir. Que décide-t-il ?",
                options: [
                    { text: "Briser la jarre pour libérer la sagesse dans le vent mondial.", nextNode: "release_wisdom", reward: 50 },
                    { text: "Cacher quand même la jarre au sommet pour lui seul.", nextNode: "hoard_wisdom" }
                ]
            },
            break_jar: {
                text: "La jarre se fracasse au sol. La sagesse se disperse instantanément aux quatre vents, et toute l'humanité en hérite d'une petite part. Anansi se retrouve bredouille mais le monde est sauvé !",
                options: [
                    { text: "Recommencer le conte", nextNode: "start" }
                ]
            },
            release_wisdom: {
                text: "Anansi jette la jarre dans le ciel. Elle se transforme en une constellation d'étoiles (Sirius B !). La sagesse se diffuse partout sous forme de rayons cosmiques. Le conseil de Sirius vous félicite pour cette fin philosophique !",
                options: [
                    { text: "Recommencer le conte", nextNode: "start" }
                ]
            },
            hoard_wisdom: {
                text: "Anansi garde la jarre. Mais en restant au sommet, il se transforme en statue de pierre, prisonnier de son propre égoïsme. La sagesse reste scellée jusqu'à la venue d'un nouveau scribe.",
                options: [
                    { text: "Recommencer le conte", nextNode: "start" }
                ]
            }
        }
    },
    baobab: {
        title: "Le Secret du Baobab Sacré",
        desc: "Explorez les racines d'un arbre géant qui recèle des trésors cachés de l'ancien Mali.",
        startNode: "start",
        nodes: {
            start: {
                text: "Vous vous tenez devant le Grand Baobab des Falaises de Bandiagara. Ses racines s'enfoncent profondément dans des galeries souterraines secrètes. Par où commencez-vous l'exploration ?",
                options: [
                    { text: "Entrer par la crevasse lumineuse au tronc.", nextNode: "trunk_path" },
                    { text: "Descendre par les galeries souterraines des racines.", nextNode: "root_path" }
                ]
            },
            trunk_path: {
                text: "À l'intérieur du tronc, vous trouvez des sculptures antiques gravées dans le bois. Elles semblent indiquer une carte céleste. Mais un essaim d'abeilles sacrées bloque le passage.",
                options: [
                    { text: "Allumer une branche pour les enfumer doucement.", nextNode: "smoke_bees" },
                    { text: "Faire demi-tour et tenter le chemin des racines.", nextNode: "root_path" }
                ]
            },
            root_path: {
                text: "Les galeries souterraines sont fraîches et humides. Vous découvrez une jarre en or ornée de symboles de Sirius. Un serpent d'eau bloque l'accès.",
                options: [
                    { text: "Lui offrir une louche d'eau pure.", nextNode: "feed_snake", reward: 40 },
                    { text: "L'effrayer avec une torche.", nextNode: "scare_snake" }
                ]
            },
            smoke_bees: {
                text: "Les abeilles s'écartent sans violence, révélant une pierre gravée étincelante (+50 Score). Le secret des astres Dogon vous est révélé !",
                options: [
                    { text: "Recommencer le conte", nextNode: "start" }
                ]
            },
            feed_snake: {
                text: "Le serpent boit l'eau, s'incline respectueusement et libère la jarre. À l'intérieur se trouvent des Nya Coins étincelants ! L'esprit d'Amma veille sur vous.",
                options: [
                    { text: "Recommencer le conte", nextNode: "start" }
                ]
            },
            scare_snake: {
                text: "Le serpent se cabre et crache de l'eau sacrée. Vous glissez et vous retrouvez hors des galeries, bredouille mais sain et sauf.",
                options: [
                    { text: "Recommencer le conte", nextNode: "start" }
                ]
            }
        }
    }
}

export default function Comedy() {
    const { addCoins, addScore } = useAuthStore()
    const { push } = useNotificationStore()

    const [selectedStory, setSelectedStory] = useState<string | null>(null)
    const [currentNode, setCurrentNode] = useState('start')

    const activeStory = selectedStory ? STORIES[selectedStory] : null
    const activeNode = activeStory ? activeStory.nodes[currentNode] : null

    const handleChoice = (option: any) => {
        if (option.reward) {
            addCoins(option.reward)
            addScore(option.reward * 2)
            push({
                type: 'reward',
                title: 'Conte Résolu',
                message: `Vous avez obtenu +${option.reward} Nya Coins pour cette fin.`,
                icon: '📜',
                color: '#00E5A0'
            })
        }
        setCurrentNode(option.nextNode)
    }

    const selectStory = (id: string) => {
        setSelectedStory(id)
        setCurrentNode('start')
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
                    <div className="cosmo-label">Toguna Comedy {" > "} Légendes & Sagesse</div>
                    <h1 className="text-shimmer" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                        CONTES & SAGESSES
                    </h1>
                </div>

                {!selectedStory ? (
                    /* Story grid selector */
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
                        {Object.entries(STORIES).map(([id, story]) => (
                            <motion.div
                                key={id}
                                whileHover={{ scale: 1.03, y: -4 }}
                                style={{
                                    background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                                    borderRadius: 24, padding: 32, cursor: 'pointer',
                                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                                    minHeight: 220
                                }}
                                onClick={() => selectStory(id)}
                            >
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                        <BookOpen size={20} style={{ color: 'var(--nya-ochre)' }} />
                                        <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--nya-gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>CONTE INTERACTIF</span>
                                    </div>
                                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 900, color: '#fff', marginBottom: 12 }}>
                                        {story.title}
                                    </h3>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                        {story.desc}
                                    </p>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--nya-ochre)', fontSize: '0.8rem', fontWeight: 700, marginTop: 20 }}>
                                    Entrer dans le conte <ArrowRight size={14} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    /* Interactive reader */
                    <div style={{
                        background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                        borderRadius: 24, padding: 40, maxWidth: 640, margin: '0 auto',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--nya-gold)', fontWeight: 800 }}>{activeStory?.title}</span>
                            <button
                                onClick={() => setSelectedStory(null)}
                                style={{
                                    background: 'none', border: 'none', color: 'var(--text-muted)',
                                    cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'underline'
                                }}
                            >
                                Quitter le conte
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentNode}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <p style={{ fontSize: '0.95rem', color: '#fff', lineHeight: 1.8, marginBottom: 32 }}>
                                    {activeNode?.text}
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {activeNode?.options.map((opt, idx) => (
                                        <motion.button
                                            key={idx}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            onClick={() => handleChoice(opt)}
                                            style={{
                                                padding: '16px 20px', borderRadius: 12,
                                                background: 'var(--bg-elevated)', border: '1px solid var(--border-hover)',
                                                color: '#fff', textAlign: 'left', fontSize: '0.85rem',
                                                fontWeight: 600, cursor: 'pointer',
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                            }}
                                        >
                                            {opt.text}
                                            <ArrowRight size={14} style={{ color: 'var(--nya-ochre)' }} />
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                )}

            </main>
            <Footer />
        </div>
    )
}

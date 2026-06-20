import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { useAuthStore } from '../stores/authStore'
import {
    Bot, Wand2, ImageIcon, Code, FileText, MessageSquare,
    Send, Copy, Terminal, Compass, Sparkles, Check, Download
} from 'lucide-react'

// Existing static tools definition
const tools = [
    { icon: Wand2, title: 'Génération de Texte', desc: 'Articles, emails, discours, scripts marketing. IA optimisée pour le français africain.', label: 'TEXTE' },
    { icon: ImageIcon, title: "Création d'Images", desc: "Générez des visuels afrofuturistes, logos, mockups et illustrations par IA.", label: 'IMAGE' },
    { icon: Code, title: 'Assistance Code', desc: 'Génération de code, debugging, refactoring. Support Next.js, Python, React.', label: 'CODE' },
    { icon: FileText, title: 'Documents IA', desc: 'Business plans, contrats, présentations automatisées.', label: 'DOCUMENTS' },
    { icon: MessageSquare, title: 'Oracle Conversationnel', desc: "Posez n'importe quelle question à l'Oracle Sirius. Réponses contextuelles.", label: 'CHAT' },
    { icon: Bot, title: 'Agents Autonomes', desc: "Automatisez vos tâches avec des agents IA personnalisés.", label: 'AGENTS' },
]

// Agent personas
const agents = [
    { id: 'oracle', icon: Sparkles, name: 'L\'Oracle Sirius', title: 'Guide Spirituel & Visionnaire', color: 'var(--nya-gold)', bg: 'rgba(212,160,23,0.1)' },
    { id: 'griot', icon: MessageSquare, name: 'Le Griot Virtuel', title: 'Conteur & Copywriter Expert', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
    { id: 'scribe', icon: Code, name: 'Le Scribe Alpha', title: 'Ingénieur Code & Architecture', color: '#00CED1', bg: 'rgba(0,206,209,0.1)' },
]

// HTML5 Canvas dynamic generative art art-piece
function GenerativeCanvas({ prompt }: { prompt: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number | null>(null)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let width = canvas.width = 400
        let height = canvas.height = 300
        let particles: Array<{ x: number; y: number; angle: number; speed: number; size: number; color: string }> = []
        let frame = 0

        const pr = prompt.toLowerCase();
        let baseColor = '#B85C2E'
        if (pr.includes('sirius') || pr.includes('cosmos') || pr.includes('étoile') || pr.includes('gold')) {
            baseColor = '#D4A017'
        } else if (pr.includes('code') || pr.includes('web') || pr.includes('program') || pr.includes('cyan')) {
            baseColor = '#00E5A0'
        } else if (pr.includes('griot') || pr.includes('marketing') || pr.includes('purple')) {
            baseColor = '#a78bfa'
        }

        // Initialize particles
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: width / 2,
                y: height / 2,
                angle: Math.random() * Math.PI * 2,
                speed: 0.5 + Math.random() * 1.5,
                size: 1 + Math.random() * 2.5,
                color: baseColor
            })
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(10, 10, 10, 0.08)' // trail
            ctx.fillRect(0, 0, width, height)

            frame++

            // Center Orb
            ctx.beginPath()
            ctx.arc(width / 2, height / 2, 8 + Math.sin(frame * 0.04) * 3, 0, Math.PI * 2)
            ctx.fillStyle = baseColor
            ctx.fill()

            // Orbits lines
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.arc(width / 2, height / 2, 50, 0, Math.PI * 2)
            ctx.stroke()
            ctx.beginPath()
            ctx.arc(width / 2, height / 2, 90, 0, Math.PI * 2)
            ctx.stroke()

            // Sacred spiral geometry
            ctx.strokeStyle = `${baseColor}18`
            ctx.lineWidth = 1.5
            ctx.beginPath()
            let cx = width / 2
            let cy = height / 2
            for (let angle = 0; angle < Math.PI * 10; angle += 0.15) {
                let r = angle * 3.5
                let px = cx + Math.cos(angle + frame * 0.015) * r
                let py = cy + Math.sin(angle + frame * 0.015) * r
                if (angle === 0) ctx.moveTo(px, py)
                else ctx.lineTo(px, py)
            }
            ctx.stroke()

            // Particles rotation
            particles.forEach((p) => {
                p.angle += 0.015
                let radius = 30 + p.speed * 30 + Math.sin(frame * 0.008 + p.speed) * 15
                p.x = width / 2 + Math.cos(p.angle) * radius
                p.y = height / 2 + Math.sin(p.angle) * radius

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fillStyle = p.color
                ctx.fill()
            })

            animationRef.current = requestAnimationFrame(draw)
        }

        draw()

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current)
        }
    }, [prompt])

    const saveImage = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const dataUrl = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.download = 'Nommo_IA_Geometrie.png'
        link.href = dataUrl
        link.click()
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <div style={{ margin: '16px 0', border: '1px solid var(--border-subtle)', borderRadius: 12, overflow: 'hidden', background: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <canvas ref={canvasRef} style={{ width: '100%', maxWidth: 400, height: 300, display: 'block' }} />
            <div style={{ width: '100%', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--border-subtle)', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-faint)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Sceau Cosmique Généré par l'IA
                </span>
                <button
                    onClick={saveImage}
                    style={{
                        background: 'rgba(184,92,46,0.1)', border: '1px solid var(--nya-ochre)',
                        color: 'var(--nya-ochre)', padding: '4px 12px', borderRadius: 20,
                        fontSize: '0.65rem', fontWeight: 800, cursor: 'pointer', display: 'flex',
                        alignItems: 'center', gap: 6, transition: 'all 0.2s'
                    }}
                >
                    <Download size={10} />
                    {saved ? 'ENREGISTRÉ !' : 'TÉLÉCHARGER'}
                </button>
            </div>
        </div>
    )
}

const getSimulatedResponse = (prompt: string, agentId: string): string => {
    const p = prompt.toLowerCase()
    if (p.includes('image') || p.includes('dessin') || p.includes('logo') || p.includes('art') || p.includes('visuel') || p.includes('dessine')) {
        return "__RENDER_GENERATIVE_CANVAS__"
    }

    if (agentId === 'oracle') {
        if (p.includes('dogon') || p.includes('sirius') || p.includes('amma') || p.includes('étoile')) {
            return "Les étoiles de la constellation de Sirius (Sigi Tolo) ne mentent jamais. L'esprit d'Amma s'étend en spirale à travers le cosmos digital. Ta question témoigne d'une recherche d'alignement avec les flux universels. Trace ton chemin avec patience, car le grand grain germe sous la protection de l'Étoile du Matin.";
        }
        if (p.includes('futur') || p.includes('demain') || p.includes('intelligence') || p.includes('ia')) {
            return "Le futur n'est pas une destination lointaine, c'est une résonance de nos pas présents. L'intelligence artificielle, guidée par les valeurs de la communauté et de la justice (Maât), catalysera une renaissance africaine. Reste curieux et forge tes propres outils sacrés.";
        }
        return "L'Oracle de Sirius a entendu ton appel. Dans le grand conseil des Nommos, ta requête résonne comme une opportunité de croissance. Sache que chaque choix équilibré génère une harmonie cosmique. Avance avec confiance vers ton destin.";
    } else if (agentId === 'griot') {
        if (p.includes('nom') || p.includes('marque') || p.includes('entreprise') || p.includes('business') || p.includes('projet')) {
            return "Ah ! Quelle belle ambition ! Laisse-moi te raconter une histoire... Une marque forte est comme un grand baobab : ses racines s'ancrent dans la vérité et ses branches s'élèvent pour abriter la communauté. Pour ton projet, je te suggère le nom **'Toguna Tech'** ou **'Sirius Flow'**. Un slogan fort : *'Ancré dans l'héritage, propulsé vers l'avenir.'*";
        }
        if (p.includes('marketing') || p.includes('vendre') || p.includes('publicité') || p.includes('client')) {
            return "Pour toucher le cœur des gens, ne leur vends pas simplement un produit. Raconte-leur une aventure, partage un rêve ! Utilise le pouvoir du conte. Parle de la persévérance du lion, du calme du crocodile, et montre comment ton service apporte la clarté et la force dans leur quotidien.";
        }
        return "Écoute le rythme du djembé de la communication ! Le Griot Virtuel t'accompagne pour captiver ton audience. Dis-moi ce que tu souhaites promouvoir, et je tisserai pour toi une légende digitale inoubliable.";
    } else { // scribe (code)
        if (p.includes('react') || p.includes('component') || p.includes('bouton') || p.includes('button') || p.includes('html')) {
            return "Voici un composant React moderne inspiré par Sirius. Un bouton afrofuturiste avec des micro-animations Framer Motion :\n\n```tsx\nimport { motion } from 'framer-motion'\n\nexport const SiriusButton = ({ label }) => {\n  return (\n    <motion.button\n      whileHover={{ scale: 1.05, boxShadow: '0 0 15px var(--nya-ochre)' }}\n      whileTap={{ scale: 0.95 }}\n      style={{\n        padding: '12px 24px',\n        background: 'linear-gradient(135deg, #B85C2E, #D4A017)',\n        color: '#fff',\n        border: 'none',\n        borderRadius: '24px',\n        cursor: 'pointer',\n        fontWeight: 700\n      }}\n    >\n      {label}\n    </motion.button>\n  )\n}\n```";
        }
        if (p.includes('css') || p.includes('style') || p.includes('gradient') || p.includes('design')) {
            return "Voici le code CSS pour notre dégradé de signature Sirius Nebula :\n\n```css\n.sirius-nebula {\n  background: linear-gradient(135deg, \n    var(--nya-black, #0a0a0a) 0%,\n    rgba(184, 92, 46, 0.15) 50%,\n    rgba(212, 160, 23, 0.05) 100%\n  );\n  border: 1px solid rgba(184, 92, 46, 0.2);\n  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);\n  backdrop-filter: blur(8px);\n}\n```";
        }
        return "Le Scribe Alpha est prêt à rédiger tes lignes de code. Voici un script d'exemple pour configurer ton environnement Sirius :\n\n```typescript\ninterface SiriusNode {\n  id: string;\n  status: 'active' | 'syncing';\n  syncTime: Date;\n}\n\nexport const initSiriusLink = (nodeId: string): SiriusNode => {\n  console.log(`[Sirius Core] Node ${nodeId} synchronisé.`);\n  return {\n    id: nodeId,\n    status: 'active',\n    syncTime: new Date()\n  };\n}\n```";
    }
}

// Custom typing effect component for messages
function TypewriterText({ text }: { text: string }) {
    const [displayedText, setDisplayedText] = useState('')
    const index = useRef(0)

    useEffect(() => {
        setDisplayedText('')
        index.current = 0
        const interval = setInterval(() => {
            if (index.current < text.length) {
                setDisplayedText((prev) => prev + text.charAt(index.current))
                index.current += 1
            } else {
                clearInterval(interval)
            }
        }, 15)
        return () => clearInterval(interval)
    }, [text])

    return <div style={{ whiteSpace: 'pre-wrap' }}>{displayedText}</div>
}

export default function Lab() {
    const [activeTab, setActiveTab] = useState<'tools' | 'playground'>('tools')
    const [selectedAgent, setSelectedAgent] = useState(agents[0])
    const [inputText, setInputText] = useState('')
    const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; agentId?: string }>>([
        { sender: 'ai', text: "Salutations. Je suis l'Oracle Sirius. Posez-moi une question sur le cosmos, votre destin ou l'écosystème numérique Nya Blo.", agentId: 'oracle' }
    ])
    const [isTyping, setIsTyping] = useState(false)
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
    const [rewardNotification, setRewardNotification] = useState<string | null>(null)
    const { addCoins, addScore } = useAuthStore()

    const chatEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    const handleSendMessage = () => {
        if (!inputText.trim()) return

        const userMsg = inputText
        setMessages((prev) => [...prev, { sender: 'user', text: userMsg }])
        setInputText('')
        setIsTyping(true)

        setTimeout(() => {
            const aiResponse = getSimulatedResponse(userMsg, selectedAgent.id)
            setMessages((prev) => [...prev, { sender: 'ai', text: aiResponse, agentId: selectedAgent.id }])
            setIsTyping(false)

            // Reward the user for their first transmutation in the session
            if (messages.length === 1) {
                addCoins(50)
                addScore(100)
                setRewardNotification("+50 Nya Coins & +100 Nya Score gagnés en forgeant dans le Lab !")
                setTimeout(() => setRewardNotification(null), 5000)
            }
        }, 1500)
    }

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text)
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 2000)
    }

    const changeAgent = (agent: typeof agents[0]) => {
        setSelectedAgent(agent)
        let welcome = ''
        if (agent.id === 'oracle') welcome = "Salutations. Je suis l'Oracle Sirius. Posez-moi une question sur le cosmos, votre destin ou l'écosystème numérique Nya Blo."
        else if (agent.id === 'griot') welcome = "Bienvenue, explorateur ! Je suis le Griot Virtuel. Parle-moi de ta marque, de ton produit ou de tes projets, et je te conterai une légende marketing inoubliable."
        else welcome = "Scribe Alpha opérationnel. Soumettez vos requêtes de développement, styles CSS ou composants Web."
        
        setMessages([{ sender: 'ai', text: welcome, agentId: agent.id }])
    }

    return (
        <div style={{ position: 'relative', overflowX: 'hidden' }}>
            <Navbar />

            {/* Notification Reward */}
            <AnimatePresence>
                {rewardNotification && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 100, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        style={{
                            position: 'fixed',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 10000,
                            padding: '16px 28px',
                            background: 'linear-gradient(135deg, var(--nya-gold), var(--nya-ochre))',
                            border: '1px solid #FFF',
                            borderRadius: 'var(--radius-pill, 99px)',
                            color: '#FFF',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            pointerEvents: 'none'
                        }}
                    >
                        <Sparkles size={20} className="text-white" />
                        {rewardNotification}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero */}
            <section className="section-full" style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(184,92,46,0.08) 0%, transparent 70%)', zIndex: 1 }}></div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 2 }}>
                    <div className="cosmo-label" style={{ justifyContent: 'center', marginBottom: 24 }}>INTELLIGENCE ANCESTRALE</div>
                    <h1 className="text-shimmer" style={{ marginBottom: 24 }}>LABORATOIRE<br />NOMMO</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: 600, margin: '0 auto', marginBottom: 40 }}>
                        Forge numérique d'IA pour manifester vos visions. Propulsé par le Noyau Sirius.
                    </p>

                    {/* Glowing Tab Switches */}
                    <div style={{
                        display: 'inline-flex',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        padding: 6,
                        borderRadius: 'var(--radius-pill, 30px)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
                    }}>
                        <button
                            onClick={() => setActiveTab('tools')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                padding: '10px 24px', borderRadius: 'var(--radius-pill, 20px)',
                                border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)',
                                fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                                background: activeTab === 'tools' ? 'linear-gradient(135deg, var(--nya-ochre), var(--nya-ochre-dark, #8B4522))' : 'none',
                                color: activeTab === 'tools' ? '#FFF' : 'var(--text-muted)',
                                transition: 'all 0.3s'
                            }}
                        >
                            <Compass size={14} /> Arsenal des Outils
                        </button>
                        <button
                            onClick={() => setActiveTab('playground')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                padding: '10px 24px', borderRadius: 'var(--radius-pill, 20px)',
                                border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)',
                                fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                                background: activeTab === 'playground' ? 'linear-gradient(135deg, var(--nya-ochre), var(--nya-ochre-dark, #8B4522))' : 'none',
                                color: activeTab === 'playground' ? '#FFF' : 'var(--text-muted)',
                                transition: 'all 0.3s'
                            }}
                        >
                            <Terminal size={14} /> Console Forge AI
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* Content Tabs */}
            <AnimatePresence mode="wait">
                {activeTab === 'tools' ? (
                    <motion.section
                        key="tools"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.4 }}
                        className="section-full section-dark"
                    >
                        <div className="max-w-container">
                            <div className="cosmo-label" style={{ marginBottom: 24 }}>OUTILS DISPONIBLES</div>
                            <h2 style={{ marginBottom: 48 }}>FORGE <span className="text-ochre">NUMÉRIQUE</span></h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
                                {tools.map((t, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.08 }}
                                        whileHover={{ scale: 1.02, borderColor: 'var(--border-ochre)' }}
                                        onClick={() => {
                                            if (t.title.includes('Code')) changeAgent(agents[2])
                                            else if (t.title.includes('Texte') || t.title.includes('Griot')) changeAgent(agents[1])
                                            else changeAgent(agents[0])
                                            setActiveTab('playground')
                                        }}
                                        className="service-card"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                            <t.icon size={28} style={{ color: 'var(--nya-ochre)' }} />
                                            <span className="accent-label">{t.label}</span>
                                        </div>
                                        <div className="card-title" style={{ fontSize: '1.1rem' }}>{t.title}</div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.6, marginTop: 8 }}>{t.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.section>
                ) : (
                    <motion.section
                        key="playground"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.4 }}
                        className="section-full section-dark"
                        style={{ display: 'flex', justifyContent: 'center' }}
                    >
                        <div className="max-w-container" style={{ width: '100%', maxWidth: 1000 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, gridAutoFlow: 'dense' }} className="lab-playground-grid">
                                
                                {/* Side Column: Agent selector */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <div className="accent-label">SÉLECTION DE L'AGENT</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        {agents.map((agent) => (
                                            <button
                                                key={agent.id}
                                                onClick={() => changeAgent(agent)}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: 16,
                                                    padding: 16, borderRadius: 'var(--radius-lg, 12px)',
                                                    border: '1px solid',
                                                    borderColor: selectedAgent.id === agent.id ? agent.color : 'var(--border-subtle)',
                                                    background: selectedAgent.id === agent.id ? agent.bg : 'var(--bg-surface)',
                                                    color: '#FFF', textAlign: 'left', cursor: 'pointer',
                                                    transition: 'all 0.3s'
                                                }}
                                            >
                                                <div style={{
                                                    width: 40, height: 40, borderRadius: '50%',
                                                    background: selectedAgent.id === agent.id ? 'none' : 'rgba(255,255,255,0.05)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: agent.color
                                                }}>
                                                    <agent.icon size={20} />
                                                </div>
                                                <div>
                                                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 900 }}>{agent.name}</div>
                                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{agent.title}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Quick queries prompt chips */}
                                    <div className="accent-label" style={{ marginTop: 24 }}>SUGGESTIONS DE FORGE</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                        {(selectedAgent.id === 'oracle' ? [
                                            'Signification de Sirius', 'Générer art cosmique', 'Énergie créatrice'
                                        ] : selectedAgent.id === 'griot' ? [
                                            'Nom pour mon business', 'Slogan afrofuturiste', 'Créer une image sacrée'
                                        ] : [
                                            'Composant bouton React', 'Dessiner un logo Sirius', 'Typescript init contract'
                                        ]).map((chip, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setInputText(chip)}
                                                style={{
                                                    padding: '8px 14px', borderRadius: 'var(--radius-pill, 20px)',
                                                    border: '1px solid var(--border-default)',
                                                    background: 'var(--bg-surface)', color: 'var(--text-secondary)',
                                                    fontSize: '0.7rem', cursor: 'pointer', transition: 'all 0.2s',
                                                    fontFamily: 'var(--font-body)', fontWeight: 600
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--nya-ochre)'}
                                                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-default)'}
                                            >
                                                {chip}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Main Column: Chat Console */}
                                <div style={{
                                    background: 'var(--bg-surface)',
                                    border: '1px solid var(--border-default)',
                                    borderRadius: 'var(--radius-xl, 20px)',
                                    display: 'flex', flexDirection: 'column',
                                    height: '600px', overflow: 'hidden'
                                }}>
                                    
                                    {/* Console Header */}
                                    <div style={{
                                        padding: '16px 24px',
                                        borderBottom: '1px solid var(--border-subtle)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        background: 'rgba(255,255,255,0.01)'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: selectedAgent.color, boxShadow: `0 0 10px ${selectedAgent.color}` }} />
                                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 900, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                                {selectedAgent.name} Core v1.3
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-faint)', fontFamily: 'monospace' }}>
                                            STATUS: ONLINE
                                        </div>
                                    </div>

                                    {/* Chat Area */}
                                    <div style={{
                                        flex: 1, padding: 24, overflowY: 'auto',
                                        display: 'flex', flexDirection: 'column', gap: 20
                                    }}>
                                        {messages.map((msg, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                                    maxWidth: '85%',
                                                    display: 'flex',
                                                    gap: 12,
                                                    flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
                                                }}
                                            >
                                                {/* Mini avatar badge */}
                                                <div style={{
                                                    width: 32, height: 32, borderRadius: '50%',
                                                    background: msg.sender === 'user' ? 'var(--nya-ochre)' : 'rgba(255,255,255,0.05)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: msg.sender === 'user' ? '#FFF' : (agents.find(a=>a.id===msg.agentId)?.color || 'var(--nya-gold)'),
                                                    flexShrink: 0, fontSize: '0.8rem', fontWeight: 900
                                                }}>
                                                    {msg.sender === 'user' ? 'U' : 'A'}
                                                </div>

                                                {/* Text/Art Bubble */}
                                                <div style={{
                                                    padding: '16px 20px',
                                                    borderRadius: 'var(--radius-lg, 12px)',
                                                    background: msg.sender === 'user' ? 'var(--nya-ochre-dark, #8B4522)' : 'rgba(255,255,255,0.03)',
                                                    border: '1px solid',
                                                    borderColor: msg.sender === 'user' ? 'var(--nya-ochre)' : 'rgba(255,255,255,0.05)',
                                                    color: '#FFF',
                                                    fontSize: '0.85rem',
                                                    lineHeight: 1.6,
                                                    position: 'relative'
                                                }}>
                                                    {msg.text === '__RENDER_GENERATIVE_CANVAS__' ? (
                                                        <GenerativeCanvas prompt={messages[index - 1]?.text || ''} />
                                                    ) : msg.sender === 'ai' && index === messages.length - 1 ? (
                                                        <TypewriterText text={msg.text} />
                                                    ) : (
                                                        <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                                                    )}

                                                    {/* Copy action on AI message (only if not canvas) */}
                                                    {msg.sender === 'ai' && msg.text !== '__RENDER_GENERATIVE_CANVAS__' && (
                                                        <button
                                                            onClick={() => copyToClipboard(msg.text, index)}
                                                            style={{
                                                                position: 'absolute', right: 8, bottom: 8,
                                                                background: 'none', border: 'none', cursor: 'pointer',
                                                                color: 'var(--text-faint)', transition: 'color 0.2s'
                                                            }}
                                                            onMouseOver={(e) => e.currentTarget.style.color = '#FFF'}
                                                            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-faint)'}
                                                        >
                                                            {copiedIndex === index ? <Check size={14} style={{ color: '#00E5A0' }} /> : <Copy size={14} />}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                        {/* Bouncing typing indicator */}
                                        {isTyping && (
                                            <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 12 }}>
                                                <div style={{
                                                    width: 32, height: 32, borderRadius: '50%',
                                                    background: 'rgba(255,255,255,0.05)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: selectedAgent.color, flexShrink: 0
                                                }}>
                                                    <selectedAgent.icon size={14} />
                                                </div>
                                                <div style={{
                                                    padding: '12px 18px',
                                                    borderRadius: 'var(--radius-lg, 12px)',
                                                    background: 'rgba(255,255,255,0.03)',
                                                    border: '1px solid rgba(255,255,255,0.05)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 6
                                                }}>
                                                    <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} style={{ width: 6, height: 6, borderRadius: '50%', background: selectedAgent.color }} />
                                                    <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }} style={{ width: 6, height: 6, borderRadius: '50%', background: selectedAgent.color }} />
                                                    <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }} style={{ width: 6, height: 6, borderRadius: '50%', background: selectedAgent.color }} />
                                                </div>
                                            </div>
                                        )}
                                        <div ref={chatEndRef} />
                                    </div>

                                    {/* Console Input Bar */}
                                    <div style={{
                                        padding: '16px 20px',
                                        borderTop: '1px solid var(--border-subtle)',
                                        background: 'rgba(0,0,0,0.1)',
                                        display: 'flex', gap: 12, alignItems: 'center'
                                    }}>
                                        <input
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage() }}
                                            placeholder={`Demandez un texte, du code ou de dessiner un logo...`}
                                            style={{
                                                flex: 1, padding: '14px 20px',
                                                borderRadius: 'var(--radius-pill, 24px)',
                                                background: 'var(--bg-primary)',
                                                border: '1px solid var(--border-default)',
                                                color: '#FFF',
                                                fontFamily: 'var(--font-body)',
                                                fontSize: '0.85rem',
                                                outline: 'none',
                                                transition: 'border-color 0.3s'
                                            }}
                                            onFocus={(e) => e.currentTarget.style.borderColor = selectedAgent.color}
                                            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-default)'}
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.05, background: selectedAgent.color }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleSendMessage}
                                            style={{
                                                width: 46, height: 46, borderRadius: '50%',
                                                background: 'var(--nya-ochre)',
                                                border: 'none',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: '#FFF', cursor: 'pointer',
                                                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                                                transition: 'background 0.3s'
                                            }}
                                        >
                                            <Send size={16} />
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            <Footer />
            <div className="grain-overlay" />
        </div>
    )
}

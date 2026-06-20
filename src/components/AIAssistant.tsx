import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Sparkles, Bot } from 'lucide-react'

interface Message {
    id: string
    sender: 'user' | 'nommo'
    text: string
    time: number
}

const PRESETS = [
    { q: 'Qui est le Nommo ?', a: 'Dans la cosmogonie Dogon, le Nommo est le génie de l\'eau et le premier être créé par Amma. Il enseigne la parole sacrée, l\'art et le tissage.' },
    { q: 'Comment gagner des Nya Coins ?', a: 'Vous gagnez des Nya Coins en jouant aux Jeux d\'Esprit (Memory, Puzzle), en résolvant le Quiz des Scribes ou en débloquant des Badges d\'Initiation.' },
    { q: 'Où dépenser mes Coins ?', a: 'Vos Nya Coins peuvent être dépensés au Marché (Shop) pour acquérir des artefacts magiques, commander un VTC Sirius ou investir dans des projets de Crowdfunding.' },
    { q: 'Traduire en Bambara', a: 'Voici quelques bases : Bonjour = "I ni ce", Merci = "I ni ce" ou "Aw ni ce" (au pluriel), Au revoir = "K\'an ben", S\'il vous plaît = "Sabali".' },
]

export default function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', sender: 'nommo', text: 'I ni ce ! Bonjour initié. Je suis l\'Oracle Nommo AI. Posez-moi vos questions sur l\'univers digital de NYA BLO.', time: Date.now() }
    ])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const chatEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    const handleSend = (text: string) => {
        if (!text.trim()) return

        const newMsg: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text,
            time: Date.now()
        }

        setMessages(prev => [...prev, newMsg])
        setInput('')
        setIsTyping(true)

        // Find answer in presets or general reply
        setTimeout(() => {
            let replyText = 'Mes excuses initié, mes capteurs stellaires de Sirius B recherchent encore la réponse à cette invocation. Essayez l\'une de mes requêtes prédéfinies !'
            
            const lowerText = text.toLowerCase()
            const match = PRESETS.find(p => lowerText.includes(p.q.toLowerCase()) || p.q.toLowerCase().includes(lowerText))
            if (match) {
                replyText = match.a
            } else if (lowerText.includes('bonjour') || lowerText.includes('salut')) {
                replyText = 'I ni ce ! Que la sagesse d\'Amma vous accompagne.'
            } else if (lowerText.includes('merci')) {
                replyText = 'An kabla ! (De rien / Avec plaisir).'
            }

            const response: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'nommo',
                text: replyText,
                time: Date.now()
            }
            setMessages(prev => [...prev, response])
            setIsTyping(false)
        }, 1200)
    }

    return (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
            
            {/* Toggle button */}
            <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0,229,160,0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00E5A0 0%, #00CED1 100%)',
                    border: 'none', color: '#fff', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 30px rgba(0,229,160,0.3)',
                }}
                aria-label="Contacter l'Oracle Nommo AI"
            >
                {isOpen ? <X size={24} /> : <Bot size={24} />}
            </motion.button>

            {/* Chat Drawer Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50, x: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50, x: -10 }}
                        style={{
                            position: 'absolute', bottom: 70, right: 0,
                            width: 360, height: 480,
                            background: 'var(--nya-deep)',
                            border: '1px solid rgba(0,229,160,0.3)',
                            borderRadius: 20,
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,229,160,0.05)',
                            display: 'flex', flexDirection: 'column', overflow: 'hidden'
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '16px 20px', background: 'rgba(0,229,160,0.08)',
                            borderBottom: '1px solid var(--border-default)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Sparkles size={16} style={{ color: '#00E5A0' }} />
                                <div>
                                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 900, color: '#fff' }}>ORACLE NOMMO AI</div>
                                    <div style={{ fontSize: '0.55rem', color: '#00E5A0', fontWeight: 700, letterSpacing: '0.1em' }}>SIRIUS B SYNCED</div>
                                </div>
                            </div>
                        </div>

                        {/* Messages panel */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {messages.map((m) => {
                                const isNommo = m.sender === 'nommo'
                                return (
                                    <div
                                        key={m.id}
                                        style={{
                                            alignSelf: isNommo ? 'flex-start' : 'flex-end',
                                            maxWidth: '80%',
                                            background: isNommo ? 'var(--bg-elevated)' : 'var(--nya-ochre)',
                                            border: isNommo ? '1px solid var(--border-default)' : 'none',
                                            borderRadius: isNommo ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                                            padding: '12px 16px',
                                            color: '#fff',
                                            fontSize: '0.8rem',
                                            lineHeight: 1.5
                                        }}
                                    >
                                        {m.text}
                                    </div>
                                )
                            })}

                            {/* Typing Indicator */}
                            {isTyping && (
                                <div style={{ alignSelf: 'flex-start', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: '16px 16px 16px 4px', padding: '12px 16px', display: 'flex', gap: 4 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', animation: 'bounce 1s infinite' }} />
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', animation: 'bounce 1s infinite 0.2s' }} />
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', animation: 'bounce 1s infinite 0.4s' }} />
                                    <style>{`@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }`}</style>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Presets / Quick reply list */}
                        <div style={{ padding: '0 20px 10px', display: 'flex', gap: 8, overflowX: 'auto', flexShrink: 0 }}>
                            {PRESETS.map((p) => (
                                <button
                                    key={p.q}
                                    onClick={() => handleSend(p.q)}
                                    style={{
                                        padding: '6px 12px', background: 'var(--bg-primary)',
                                        border: '1px solid var(--border-hover)', borderRadius: 20,
                                        color: '#00E5A0', fontSize: '0.65rem', fontWeight: 700,
                                        cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0
                                    }}
                                >
                                    {p.q}
                                </button>
                            ))}
                        </div>

                        {/* Input bar */}
                        <div style={{ padding: '10px 20px 20px', borderTop: '1px solid var(--border-default)' }}>
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(input) }}
                                style={{ display: 'flex', gap: 8 }}
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Posez votre question..."
                                    style={{
                                        flex: 1, padding: '10px 14px',
                                        background: 'var(--bg-primary)', border: '1px solid var(--border-default)',
                                        borderRadius: 12, color: '#fff', fontSize: '0.8rem', outline: 'none'
                                    }}
                                />
                                <button
                                    type="submit"
                                    style={{
                                        width: 38, height: 38, borderRadius: 10,
                                        background: 'var(--nya-ochre)', border: 'none',
                                        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Send size={16} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

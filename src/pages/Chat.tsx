import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useNotificationStore } from '../stores/notificationStore'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import { Send, Users } from 'lucide-react'

interface ChatMessage {
    id: string
    sender: string
    role: 'user' | 'bot' | 'other'
    text: string
    avatar: string
    time: string
}

const ROOMS = [
    { id: 'savoirs', name: '📚 Conseil des Savoirs', desc: 'Discussions philosophiques sur la cosmogonie Dogon et l\'histoire.' },
    { id: 'tech', name: '⚡ Forge Technologique', desc: 'AI, WebGPU, Web3 et innovations panafricaines.' },
    { id: 'sirius', name: '🌌 Étoile Sirius', desc: 'Astronomie, cycles cosmiques et observations de Sirius B.' },
]

const BOT_REPLIES: Record<string, string[]> = {
    savoirs: [
        "Le savoir est comme un tronc de baobab, une seule personne ne peut l'embrasser.",
        "Celui qui pose des questions ne peut pas se tromper de chemin dans la falaise.",
        "Le Toguna est bas pour que l'homme en colère soit forcé de s'asseoir et de s'apaiser."
    ],
    tech: [
        "La forge du futur se construit avec les marteaux du code et l'enclume du silicium.",
        "L'IA est un oracle : elle projette ce que nous lui enseignons. Enseignons-lui la sagesse.",
        "Le réseau Sirius connecte nos esprits à travers le continent en moins de 50 millisecondes."
    ],
    sirius: [
        "Sirius B est le grain de Digitaria (Pô), la plus petite et la plus lourde des étoiles.",
        "Les quatre éléments d'Amma (eau, terre, feu, air) forment la structure même du code cosmique.",
        "Les anciens connaissaient l'étoile invisible bien avant les télescopes. Regardons vers le ciel."
    ]
}

export default function Chat() {
    const { unlockAchievement, addCoins } = useAuthStore()
    const { push } = useNotificationStore()

    const [activeRoom, setActiveRoom] = useState(ROOMS[0])
    const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
        savoirs: [
            { id: '1', sender: 'L\'Ancien du Toguna', role: 'bot', text: 'I ni ce, bienvenu dans le Conseil des Savoirs. Quel mystère ancestral souhaitez-vous explorer aujourd\'hui ?', avatar: '👴', time: '10:00' },
            { id: '2', sender: 'Scribe Alpha', role: 'other', text: 'Bonjour ! Quelqu\'un sait quel est le totem de la famille Coulibaly ?', avatar: '🦊', time: '10:02' },
        ],
        tech: [
            { id: '1', sender: 'Scribe Tech', role: 'other', text: 'Les performances de rendu du WebGPU sur notre canvas 3D sont incroyables !', avatar: '💻', time: '09:45' },
        ],
        sirius: [
            { id: '1', sender: 'Oracle Nommo', role: 'bot', text: 'Les murmures de Sirius B indiquent une forte conjonction de données ce matin.', avatar: '👽', time: '08:00' },
        ]
    })

    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const chatEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping, activeRoom])

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            sender: 'Vous',
            role: 'user',
            text: input,
            avatar: '✨',
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        }

        const roomMsgs = messages[activeRoom.id] || []
        const updated = {
            ...messages,
            [activeRoom.id]: [...roomMsgs, userMsg]
        }

        setMessages(updated)
        setInput('')
        setIsTyping(true)

        // Trigger first chat achievement and coins reward
        unlockAchievement('first-chat')

        // Reward for contributing to chat
        const isFirstChatInSession = !localStorage.getItem('nya-chat-contributed')
        if (isFirstChatInSession) {
            localStorage.setItem('nya-chat-contributed', 'true')
            addCoins(10)
            push({
                type: 'reward',
                title: 'Parole Partagée',
                message: 'Vous avez gagné +10 Nya Coins pour votre participation.',
                icon: '🪙',
                color: '#00E5A0'
            })
        }

        // Simulate wise bot reply
        setTimeout(() => {
            const replies = BOT_REPLIES[activeRoom.id] || ['La parole est un fil à tisser.']
            const randomReply = replies[Math.floor(Math.random() * replies.length)]

            const botMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: activeRoom.id === 'sirius' ? 'Oracle Nommo' : 'L\'Ancien du Toguna',
                role: 'bot',
                text: randomReply,
                avatar: activeRoom.id === 'sirius' ? '👽' : '👴',
                time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
            }

            setMessages(prev => ({
                ...prev,
                [activeRoom.id]: [...(prev[activeRoom.id] || []), botMsg]
            }))
            setIsTyping(false)
        }, 1500)
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
                    <div className="cosmo-label">Conseil des Anciens {" > "} Salon de Discussion</div>
                    <h1 className="text-shimmer" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                        TOGUNA CHAT
                    </h1>
                </div>

                <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: 24,
                    height: 550, background: 'var(--nya-deep)',
                    border: '1px solid var(--border-default)', borderRadius: 24,
                    overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
                }}>
                    
                    {/* Left Panel: Rooms */}
                    <div style={{
                        background: 'rgba(0,0,0,0.2)', borderRight: '1px solid var(--border-default)',
                        padding: 24, display: 'flex', flexDirection: 'column', gap: 24
                    }}>
                        <h3 style={{
                            fontFamily: 'var(--font-display)', fontSize: '1rem',
                            fontWeight: 900, letterSpacing: '0.05em', color: 'var(--nya-gold)',
                            display: 'flex', alignItems: 'center', gap: 8
                        }}>
                            <Users size={16} /> SALONS DE DISCUSSION
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {ROOMS.map((room) => (
                                <button
                                    key={room.id}
                                    onClick={() => setActiveRoom(room)}
                                    style={{
                                        width: '100%', padding: '14px', borderRadius: 12,
                                        background: activeRoom.id === room.id ? 'rgba(184,92,46,0.1)' : 'none',
                                        border: activeRoom.id === room.id ? '1px solid var(--nya-ochre)' : '1px solid transparent',
                                        color: '#fff', textAlign: 'left', cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{room.name}</div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.3 }}>{room.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Panel: Active Chat */}
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        
                        {/* Room Header */}
                        <div style={{
                            padding: '16px 24px', background: 'rgba(255,255,255,0.02)',
                            borderBottom: '1px solid var(--border-default)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <div>
                                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>{activeRoom.name}</h3>
                                <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>{activeRoom.desc}</p>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {(messages[activeRoom.id] || []).map((msg) => {
                                const isUser = msg.role === 'user'
                                return (
                                    <div
                                        key={msg.id}
                                        style={{
                                            display: 'flex', gap: 12,
                                            flexDirection: isUser ? 'row-reverse' : 'row',
                                            alignSelf: isUser ? 'flex-end' : 'flex-start',
                                            maxWidth: '75%'
                                        }}
                                    >
                                        <div style={{
                                            width: 36, height: 36, borderRadius: '50%',
                                            background: 'var(--bg-elevated)', border: '1px solid var(--border-hover)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '1.2rem', flexShrink: 0
                                        }}>
                                            {msg.avatar}
                                        </div>
                                        <div>
                                            <div style={{
                                                fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: 4,
                                                textAlign: isUser ? 'right' : 'left', fontWeight: 700
                                            }}>
                                                {msg.sender} <span style={{ fontWeight: 400, marginLeft: 6 }}>{msg.time}</span>
                                            </div>
                                            <div style={{
                                                background: isUser ? 'var(--nya-ochre)' : 'var(--bg-elevated)',
                                                border: isUser ? 'none' : '1px solid var(--border-default)',
                                                borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                                padding: '12px 16px', color: '#fff', fontSize: '0.8rem', lineHeight: 1.5
                                            }}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                            {isTyping && (
                                <div style={{ display: 'flex', gap: 12, alignSelf: 'flex-start' }}>
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                                        {activeRoom.id === 'sirius' ? '👽' : '👴'}
                                    </div>
                                    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: '16px 16px 16px 4px', padding: '12px 16px', display: 'flex', gap: 4 }}>
                                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)', animation: 'bounce 1s infinite' }} />
                                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)', animation: 'bounce 1s infinite 0.2s' }} />
                                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)', animation: 'bounce 1s infinite 0.4s' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Area */}
                        <div style={{ padding: 20, borderTop: '1px solid var(--border-default)' }}>
                            <form onSubmit={handleSend} style={{ display: 'flex', gap: 12 }}>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Échangez vos paroles avec le Conseil..."
                                    style={{
                                        flex: 1, padding: '14px 18px',
                                        background: 'var(--bg-primary)', border: '1px solid var(--border-default)',
                                        borderRadius: 14, color: '#fff', fontSize: '0.85rem', outline: 'none'
                                    }}
                                />
                                <button
                                    type="submit"
                                    style={{
                                        width: 46, height: 46, borderRadius: 12,
                                        background: 'var(--nya-ochre)', border: 'none',
                                        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>

                    </div>

                </div>

            </main>
            <Footer />
        </div>
    )
}

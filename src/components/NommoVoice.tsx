import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Mic, Volume2, X, Play, MessageSquare } from 'lucide-react'

interface PresetCommand {
    label: string
    phrase: string
    lang: string
    translation: string
    reply: string
    actionPath?: string
}

export default function NommoVoice() {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const [activeLang, setActiveLang] = useState('bambara')
    const [isListening, setIsListening] = useState(false)
    const [statusText, setStatusText] = useState('Prêt à écouter l\'Oracle...')
    const [oracleReply, setOracleReply] = useState<string | null>(null)

    const presets: PresetCommand[] = [
        {
            label: 'Consulter mon Solde',
            phrase: 'Kolo Safe coins n\'a solde',
            lang: 'bambara',
            translation: 'Combien ai-je dans mon portefeuille ?',
            reply: 'Oracle Sirius : Vos coffres contiennent actuellement des Coins sacrés. Redirection vers votre Wallet...',
            actionPath: '/wallet'
        },
        {
            label: 'Commander un Taxi',
            phrase: 'Sirius VTC taxi n\'a gwa',
            lang: 'dioula',
            translation: 'Commande-moi immédiatement un chauffeur Sirius.',
            reply: 'Oracle Sirius : Le chauffeur KOFFI S. est en route dans sa Corolla Orange. Redirection...',
            actionPath: '/vtc'
        },
        {
            label: 'Aide Académie',
            phrase: 'Kalanko academie support',
            lang: 'baoule',
            translation: 'Ouvre le support de la formation Kalanko.',
            reply: 'Oracle Sirius : Lancement de la Masterclass Scribe Fullstack...',
            actionPath: '/learn'
        },
        {
            label: 'Transit Chine',
            phrase: 'Transit chine douane express',
            lang: 'wolof',
            translation: 'Où en est mon colis en provenance de Chine ?',
            reply: 'Oracle Sirius : Votre conteneur aérien a atterri à l\'Aéroport d\'Abidjan. Redirection...',
            actionPath: '/transit'
        }
    ]

    const handleSimulateCommand = (cmd: PresetCommand) => {
        setIsListening(true)
        setStatusText(`Analyse vocale (${cmd.phrase})...`)
        setOracleReply(null)

        setTimeout(() => {
            setIsListening(false)
            setStatusText('Commandes décodée par l\'Oracle !')
            setOracleReply(cmd.reply)

            setTimeout(() => {
                if (cmd.actionPath) {
                    navigate(cmd.actionPath)
                    setIsOpen(false)
                    setOracleReply(null)
                }
            }, 3000)
        }, 2200)
    }

    return (
        <>
            {/* Floating Mic Button */}
            <motion.button
                whileHover={{ scale: 1.1, boxShadow: '0 0 25px rgba(212,160,23,0.4)' }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed', bottom: 32, right: 32, zIndex: 999,
                    width: 60, height: 60, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--nya-gold), var(--nya-ochre))',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 30px rgba(184,92,46,0.3)',
                }}
            >
                <Mic size={24} style={{ color: '#000' }} />
            </motion.button>

            {/* Dialog Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            style={{ position: 'fixed', inset: 0, zIndex: 99998, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            style={{ position: 'fixed', bottom: 100, right: 32, zIndex: 99999, width: 'min(400px, 90vw)' }}
                        >
                            <div className="toguna-glass" style={{ padding: 28, borderRadius: 24, border: '1px solid rgba(212,160,23,0.3)', color: '#fff', position: 'relative' }}>
                                <button onClick={() => setIsOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>

                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(212,160,23,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--nya-gold)' }}>
                                        <Volume2 size={18} />
                                    </div>
                                    <div>
                                        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 900, color: 'var(--nya-gold)' }}>NOMMO AI VOICE</h4>
                                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Traducteur Sirius Satellitaire</span>
                                    </div>
                                </div>

                                {/* Voice Visualizer Waves */}
                                <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, margin: '20px 0', background: 'rgba(0,0,0,0.2)', borderRadius: 12 }}>
                                    {isListening ? (
                                        [...Array(6)].map((_, i) => (
                                            <motion.span
                                                key={i}
                                                animate={{ height: [10, 40, 10] }}
                                                transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                                                style={{ width: 4, height: 10, background: 'var(--nya-gold)', borderRadius: 2 }}
                                            />
                                        ))
                                    ) : (
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{statusText}</span>
                                    )}
                                </div>

                                {/* Language Selector */}
                                <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 6 }}>
                                    {['bambara', 'dioula', 'baoule', 'wolof'].map((lang) => (
                                        <button
                                            key={lang}
                                            onClick={() => setActiveLang(lang)}
                                            style={{
                                                padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                                                background: activeLang === lang ? 'rgba(255,255,255,0.06)' : 'transparent',
                                                color: activeLang === lang ? 'var(--nya-gold)' : 'var(--text-muted)',
                                                fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase'
                                            }}
                                        >
                                            {lang}
                                        </button>
                                    ))}
                                </div>

                                {/* Commands List */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Commandes Prédéfinies</span>
                                    {presets.filter(p => p.lang === activeLang).map((cmd, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => handleSimulateCommand(cmd)}
                                            style={{
                                                padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.02)',
                                                border: '1px solid var(--border-subtle)', cursor: 'pointer', display: 'flex',
                                                justifyContent: 'space-between', alignItems: 'center'
                                            }}
                                        >
                                            <div>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fff', display: 'block' }}>{cmd.label}</span>
                                                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>"{cmd.phrase}"</span>
                                            </div>
                                            <Play size={12} style={{ color: 'var(--nya-gold)' }} />
                                        </div>
                                    ))}
                                </div>

                                {/* Oracle reply output */}
                                <AnimatePresence>
                                    {oracleReply && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            style={{ marginTop: 20, padding: 14, borderRadius: 12, background: 'rgba(0,229,160,0.05)', border: '1px solid var(--nya-sirius)', display: 'flex', gap: 10 }}
                                        >
                                            <MessageSquare size={16} style={{ color: 'var(--nya-sirius)', flexShrink: 0, marginTop: 2 }} />
                                            <p style={{ fontSize: '0.75rem', color: 'var(--nya-sirius)', lineHeight: 1.4 }}>{oracleReply}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

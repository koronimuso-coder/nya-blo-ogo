import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import {
    WifiOff, Smartphone, Send,
    PhoneCall, Delete, Info, ArrowLeft, Wifi
} from 'lucide-react'

export default function Ussd() {
    const { user } = useAuthStore()

    const [dialedCode, setDialedCode] = useState('*380')
    const [isOffline, setIsOffline] = useState(true) // Start offline to justify USSD
    
    // USSD Active Session states
    const [sessionActive, setSessionActive] = useState(false)
    const [menuHistory, setMenuHistory] = useState<string[]>([])
    const [screenText, setScreenText] = useState('')
    const [userInput, setUserInput] = useState('')

    // Define USSD menus
    const showMainMenu = () => {
        setScreenText(
            `NYA BLO OFFLINE\n` +
            `1. Solde Portefeuille\n` +
            `2. Commander VTC Sirius\n` +
            `3. Pharmacie de garde\n` +
            `4. Statut du Réseau\n` +
            `5. Aide & Langues\n\n` +
            `Sélectionnez une option :`
        )
        setMenuHistory(['main'])
    }

    const startUssdSession = (codeToDial = dialedCode) => {
        if (codeToDial === '*380#' || codeToDial === '*380') {
            setSessionActive(true)
            showMainMenu()
        } else if (codeToDial === '*380*1#' || codeToDial === '*380*1') {
            setSessionActive(true)
            handleMenuSelection('1', 'main')
        } else if (codeToDial === '*380*2#' || codeToDial === '*380*2') {
            setSessionActive(true)
            handleMenuSelection('2', 'main')
        } else if (codeToDial === '*380*3#' || codeToDial === '*380*3') {
            setSessionActive(true)
            handleMenuSelection('3', 'main')
        } else {
            setSessionActive(true)
            setScreenText("Code USSD non valide.\n\n0. Quitter")
            setMenuHistory(['invalid'])
        }
    }

    const handleMenuSelection = (choice: string, currentMenu: string) => {
        if (choice === '0') {
            closeSession()
            return
        }

        if (choice === '99' || (choice === '1' && currentMenu !== 'main' && currentMenu !== 'invalid')) {
            showMainMenu()
            return
        }

        if (currentMenu === 'main') {
            switch (choice) {
                case '1':
                    const coins = user?.nyaCoins ?? 0
                    setScreenText(
                        `SOLDE PORTFEUILLE :\n` +
                        `- Coins : ${coins.toLocaleString('fr-FR')} Nya Coins\n` +
                        `- Fictif : ${(coins * 100).toLocaleString('fr-FR')} FCFA\n\n` +
                        `1. Retour\n0. Quitter`
                    )
                    setMenuHistory(prev => [...prev, 'solde'])
                    break
                case '2':
                    setScreenText(
                        `VTC SIRIUS EXPRESS :\n` +
                        `Chauffeur KOFFI S. trouvé !\n` +
                        `- Véhicule : Toyota Corolla Orange\n` +
                        `- Temps estimé : 6 minutes\n` +
                        `- Code Course : 8824\n\n` +
                        `1. Retour\n0. Quitter`
                    )
                    setMenuHistory(prev => [...prev, 'vtc'])
                    break
                case '3':
                    setScreenText(
                        `PHARMACIE DE GARDE :\n` +
                        `Zone : Cocody / Mermoz\n` +
                        `- Pharm. St. Jean (Ouvert)\n` +
                        `- Pharm. du Lycée (Ouvert)\n` +
                        `- Numéro Urgence : 1443\n\n` +
                        `1. Retour\n0. Quitter`
                    )
                    setMenuHistory(prev => [...prev, 'pharmacie'])
                    break
                case '4':
                    setScreenText(
                        `STATUT DU RÉSEAU :\n` +
                        `Réseau satellite Sirius A.\n` +
                        `- Latence locale : 42ms\n` +
                        `- Signal : Excellent (100%)\n` +
                        `- Protocole : USSD v2.1\n\n` +
                        `1. Retour\n0. Quitter`
                    )
                    setMenuHistory(prev => [...prev, 'reseau'])
                    break
                case '5':
                    setScreenText(
                        `AIDE & LANGUES :\n` +
                        `1. Bambara (Bamanankan)\n` +
                        `2. Baoulé (Dioula)\n` +
                        `3. Support client\n\n` +
                        `1. Retour\n0. Quitter`
                    )
                    setMenuHistory(prev => [...prev, 'aide'])
                    break
                default:
                    setScreenText(
                        `Option invalide.\n\n` +
                        `1. Retour au menu principal\n` +
                        `0. Quitter`
                    )
                    setMenuHistory(prev => [...prev, 'invalid_choice'])
                    break
            }
        } else if (currentMenu === 'aide') {
            switch (choice) {
                case '1':
                    setScreenText("Siri Kolo ye epargne ye. Kalanko ye academie ye. N'a kera gweri gweri ye, siri na micro-pret.\n\n1. Retour\n0. Quitter")
                    setMenuHistory(prev => [...prev, 'lang_bm'])
                    break
                case '2':
                    setScreenText("Kolo Safe wafa sika klé. Academie wafa klé gouen. VTC Sirius gouen ba transport wafa klé.\n\n1. Retour\n0. Quitter")
                    setMenuHistory(prev => [...prev, 'lang_bl'])
                    break
                case '3':
                    setScreenText("Service client par WhatsApp :\n+225 07 08 73 68 71.\n\n1. Retour\n0. Quitter")
                    setMenuHistory(prev => [...prev, 'support'])
                    break
                default:
                    showMainMenu()
                    break
            }
        } else {
            // For other submenus, any input (usually '1') returns to main
            showMainMenu()
        }
    }

    const handleSendInput = (e: React.FormEvent) => {
        e.preventDefault()
        if (!userInput.trim()) return

        const currentMenu = menuHistory[menuHistory.length - 1]
        handleMenuSelection(userInput.trim(), currentMenu)
        setUserInput('')
    }

    const closeSession = () => {
        setSessionActive(false)
        setMenuHistory([])
        setScreenText('')
        setUserInput('')
    }

    const appendToDial = (val: string) => {
        if (dialedCode.length < 10) {
            setDialedCode(prev => prev + val)
        }
    }

    const deleteDial = () => {
        setDialedCode(prev => prev.slice(0, -1))
    }

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 100 }}>
            <Starfield />
            <CosmicBackground />
            <Navbar />

            <main className="max-w-container" style={{ paddingTop: 120, position: 'relative', zIndex: 2 }}>
                
                {/* Header */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
                    <div className="cosmo-label">Écosystème Sirius {" > "} Nya USSD</div>
                    <h1 className="text-shimmer" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                        SIMULATEUR USSD
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 600 }}>
                        Découvrez comment NYA BLO reste accessible en Afrique de l'Ouest même sans internet mobile, en simulant le portail USSD local (`*380#`).
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, alignItems: 'center' }}>
                    
                    {/* Left Column: Phone Frame & Keypad Simulator */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        
                        {/* 3D Mobile Phone Frame */}
                        <div style={{
                            width: 320,
                            height: 600,
                            borderRadius: 40,
                            background: '#161620',
                            border: '4.5px solid #2d2d3a',
                            boxShadow: '0 25px 50px rgba(0,0,0,0.8), 0 0 30px rgba(184,92,46,0.15)',
                            padding: '24px 18px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            position: 'relative'
                        }}>
                            {/* Speaker notch */}
                            <div style={{ width: 60, height: 6, background: '#2d2d3a', borderRadius: 3, position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)' }} />

                            {/* Phone Screen Display */}
                            <div style={{
                                width: '100%',
                                height: 320,
                                background: '#0a0a0f',
                                border: '1px solid rgba(255,255,255,0.04)',
                                borderRadius: 18,
                                padding: 18,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {/* Phone Status Bar */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.55rem', color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: 6 }}>
                                    <span>Sirius Telecom</span>
                                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                        {isOffline ? <WifiOff size={10} style={{ color: 'var(--nya-red)' }} /> : <Wifi size={10} style={{ color: 'var(--nya-sirius)' }} />}
                                        <span>23:20</span>
                                    </div>
                                </div>

                                {/* Active Screen Text (USSD Box or dialing text) */}
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: '12px 0' }}>
                                    {sessionActive ? (
                                        /* USSD active session dialog */
                                        <div style={{
                                            background: '#161620', border: '1.5px solid var(--nya-gold)', borderRadius: 10,
                                            padding: 14, boxShadow: '0 8px 24px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', gap: 10
                                        }}>
                                            <p style={{
                                                fontFamily: 'var(--font-code)', fontSize: '0.7rem',
                                                color: '#fff', whiteSpace: 'pre-wrap', lineHeight: 1.4
                                            }}>
                                                {screenText}
                                            </p>

                                            {/* Send box */}
                                            {menuHistory[menuHistory.length - 1] !== 'invalid' && (
                                                <form onSubmit={handleSendInput} style={{ display: 'flex', gap: 6, borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 8 }}>
                                                    <input
                                                        type="text"
                                                        value={userInput}
                                                        onChange={(e) => setUserInput(e.target.value)}
                                                        placeholder="Saisir..."
                                                        autoFocus
                                                        style={{
                                                            flex: 1, padding: '4px 8px', fontSize: '0.65rem',
                                                            background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)',
                                                            borderRadius: 4, color: '#fff', outline: 'none'
                                                        }}
                                                    />
                                                    <button
                                                        type="submit"
                                                        style={{
                                                            background: 'var(--nya-gold)', border: 'none', borderRadius: 4,
                                                            padding: '4px 8px', display: 'flex', alignItems: 'center', cursor: 'pointer'
                                                        }}
                                                    >
                                                        <Send size={10} style={{ color: '#000' }} />
                                                    </button>
                                                </form>
                                            )}
                                        </div>
                                    ) : (
                                        /* Dialing code preview */
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{
                                                fontSize: '1.8rem', fontWeight: 900,
                                                color: '#fff', letterSpacing: '0.05em',
                                                fontFamily: 'var(--font-mono)'
                                            }}>
                                                {dialedCode}
                                            </div>
                                            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'block', marginTop: 8 }}>
                                                {isOffline ? 'Mode Hors-Ligne Activé' : 'Mode En Ligne'}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Back key to quit session */}
                                {sessionActive && (
                                    <button
                                        onClick={closeSession}
                                        style={{
                                            background: 'none', border: 'none', color: 'var(--nya-red)',
                                            fontSize: '0.6rem', fontWeight: 800, cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: 4, alignSelf: 'flex-start'
                                        }}
                                    >
                                        <ArrowLeft size={10} /> FERMER LA SESSION
                                    </button>
                                )}
                            </div>

                            {/* Phone Keypad */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
                                {/* Keypad layout */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                                    {[
                                        { val: '1', sub: ' ' }, { val: '2', sub: 'ABC' }, { val: '3', sub: 'DEF' },
                                        { val: '4', sub: 'GHI' }, { val: '5', sub: 'JKL' }, { val: '6', sub: 'MNO' },
                                        { val: '7', sub: 'PQRS' }, { val: '8', sub: 'TUV' }, { val: '9', sub: 'WXYZ' },
                                        { val: '*', sub: ' ' }, { val: '0', sub: '+' }, { val: '#', sub: ' ' }
                                    ].map((key, i) => (
                                        <button
                                            key={i}
                                            disabled={sessionActive}
                                            onClick={() => appendToDial(key.val)}
                                            style={{
                                                height: 44, borderRadius: '50%',
                                                background: 'rgba(255,255,255,0.03)',
                                                border: '1.5px solid rgba(255,255,255,0.04)',
                                                color: '#fff', cursor: sessionActive ? 'not-allowed' : 'pointer',
                                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                                            }}
                                        >
                                            <span style={{ fontSize: '0.95rem', fontWeight: 900 }}>{key.val}</span>
                                            <span style={{ fontSize: '0.45rem', color: 'var(--text-muted)', fontWeight: 800 }}>{key.sub}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Dial & Delete Row */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px' }}>
                                    <button
                                        disabled={sessionActive}
                                        onClick={deleteDial}
                                        style={{
                                            width: 48, height: 44, borderRadius: 12,
                                            background: 'rgba(255,255,255,0.02)', border: 'none',
                                            color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: sessionActive ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        <Delete size={16} />
                                    </button>

                                    <button
                                        onClick={() => {
                                            if (sessionActive) return
                                            startUssdSession()
                                        }}
                                        style={{
                                            width: 100, height: 44, borderRadius: 22,
                                            background: 'var(--nya-sirius)', border: 'none',
                                            color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                            cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,229,160,0.3)'
                                        }}
                                    >
                                        <PhoneCall size={14} fill="#000" /> DIAL
                                    </button>
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* Right Column: Information on USSD & offline architecture */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                        
                        {/* Simulation config */}
                        <div style={{
                            background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                            borderRadius: 24, padding: 24
                        }}>
                            <h3 style={{
                                fontFamily: 'var(--font-display)', fontSize: '1.2rem',
                                fontWeight: 900, color: 'var(--text-primary)', marginBottom: 20,
                                display: 'flex', alignItems: 'center', gap: 10
                            }}>
                                <Info size={18} style={{ color: 'var(--nya-gold)' }} />
                                ARCHITECTURE OFF-LINE
                            </h3>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 16 }}>
                                Dans les zones à faible connectivité réseau, les utilisateurs peuvent taper des codes courts pour interagir avec notre base de données.
                            </p>

                            {/* Network Toggle Button */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-default)' }}>
                                <div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fff', display: 'block' }}>SIMULER PERTE INTERNET</span>
                                    <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Coupe la connexion et redirige vers le protocole USSD</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={isOffline}
                                    onChange={(e) => setIsOffline(e.target.checked)}
                                    style={{ width: 18, height: 18, accentColor: 'var(--nya-ochre)', cursor: 'pointer' }}
                                />
                            </div>
                        </div>

                        {/* Presets / Shortcuts */}
                        <div style={{
                            background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                            borderRadius: 24, padding: 24
                        }}>
                            <h3 style={{
                                fontFamily: 'var(--font-display)', fontSize: '1.2rem',
                                fontWeight: 900, color: 'var(--text-primary)', marginBottom: 20,
                                display: 'flex', alignItems: 'center', gap: 10
                            }}>
                                <Smartphone size={18} style={{ color: 'var(--nya-ochre)' }} />
                                RACCOURCIS DE DIAL DE L'INITIÉ
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {[
                                    { code: '*380#', label: 'Menu Principal NYA BLO', desc: 'Accès complet au hub offline.' },
                                    { code: '*380*1#', label: 'Consulter mon Solde', desc: 'Affiche le solde de coins directement.' },
                                    { code: '*380*2#', label: 'VTC Sirius Express', desc: 'Déclenche la recherche immédiate de chauffeur.' },
                                    { code: '*380*3#', label: 'Pharmacies Ouvertes', desc: 'Liste les pharmacies de garde.' }
                                ].map((shortcut, i) => (
                                    <div
                                        key={i}
                                        className="toguna-glass"
                                        style={{ padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                                        onClick={() => {
                                            setDialedCode(shortcut.code.replace('#', ''))
                                            startUssdSession(shortcut.code)
                                        }}
                                    >
                                        <div>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fff' }}>{shortcut.label}</span>
                                            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>{shortcut.desc}</p>
                                        </div>
                                        <div style={{
                                            fontFamily: 'var(--font-code)', fontSize: '0.75rem',
                                            fontWeight: 800, color: 'var(--nya-gold)', background: 'rgba(212,160,23,0.1)',
                                            padding: '4px 10px', borderRadius: 8
                                        }}>
                                            {shortcut.code}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                </div>

            </main>
            <Footer />
        </div>
    )
}

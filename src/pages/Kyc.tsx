import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { useNotificationStore } from '../stores/notificationStore'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import {
    Shield, UserCheck, FileText,
    CheckCircle2, Award, AlertCircle
} from 'lucide-react'

export default function Kyc() {
    const { user, addScore } = useAuthStore()
    const { push } = useNotificationStore()

    const [kycLevel, setKycLevel] = useState<'observer' | 'initiated' | 'scribe'>(
        (localStorage.getItem('nya-kyc-level') as any) || 'observer'
    )
    const [step, setStep] = useState<'status' | 'doc_select' | 'doc_scan' | 'face_scan' | 'complete'>('status')
    const [docType, setDocType] = useState<'cni' | 'passport' | 'driver_license'>('cni')

    // Document Scanning Simulation states
    const [scanState, setScanState] = useState<'idle' | 'scanning' | 'ocr' | 'done'>('idle')
    const [scannedData, setScannedData] = useState<any>(null)

    // Biometric scanning simulation states
    const [faceState, setFaceState] = useState<'idle' | 'positioning' | 'processing' | 'done'>('idle')
    const [faceFeedback, setFaceFeedback] = useState('Positionnez votre visage au centre du cercle')

    const startVerificationFlow = () => {
        setStep('doc_select')
    }

    const startDocScan = () => {
        setStep('doc_scan')
        setScanState('scanning')

        // Simulate Camera feed scan
        setTimeout(() => {
            setScanState('ocr')
            setTimeout(() => {
                setScanState('done')
                setScannedData({
                    lastName: user?.displayName?.split(' ')[1] || 'DIALLO',
                    firstName: user?.displayName?.split(' ')[0] || 'FATOU',
                    birthDate: '1995-10-12',
                    docNumber: 'CI' + Math.floor(100000000 + Math.random() * 900000000),
                    nationality: 'Ivoirienne'
                })
            }, 1800)
        }, 2200)
    }

    const startFaceScan = () => {
        setStep('face_scan')
        setFaceState('positioning')

        setTimeout(() => {
            setFaceFeedback('Tournez la tête lentement vers la DROITE')
            setFaceState('processing')
            setTimeout(() => {
                setFaceFeedback('Clignez des yeux 2 fois')
                setTimeout(() => {
                    setFaceState('done')
                    setFaceFeedback('Vérification biométrique réussie !')
                }, 1500)
            }, 1500)
        }, 1800)
    }

    const finalizeVerification = () => {
        setKycLevel('initiated')
        localStorage.setItem('nya-kyc-level', 'initiated')
        setStep('complete')
        
        // Try updating auth store
        if (user) {
            addScore(150) // Reward for KYC
        }

        push({
            type: 'reward',
            title: 'Niveau 2 : Initié !',
            message: 'Votre identité a été validée par le Conseil. Vous recevez +150 Points.',
            icon: '🛡️',
            color: 'var(--nya-sirius)'
        })
    }

    const resetVerification = () => {
        setKycLevel('observer')
        localStorage.setItem('nya-kyc-level', 'observer')
        setStep('status')
        setScannedData(null)
    }

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 100 }}>
            <Starfield />
            <CosmicBackground />
            <Navbar />

            <main className="max-w-container" style={{ paddingTop: 120, position: 'relative', zIndex: 2 }}>
                
                {/* Header */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
                    <div className="cosmo-label">Écosystème Sirius {" > "} Nya KYC</div>
                    <h1 className="text-shimmer" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                        IDENTITÉ SOUVERAINE
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 600 }}>
                        Vérifiez votre identité pour déverrouiller l'accès aux services premium de transport, immobilier et micro-finance du Toguna.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40, alignItems: 'start' }}>
                    
                    {/* Left Column: Interactive flow */}
                    <div style={{
                        background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                        borderRadius: 24, padding: 32, minHeight: 460,
                        display: 'flex', flexDirection: 'column', justifyContent: 'center'
                    }}>
                        
                        <AnimatePresence mode="wait">
                            {/* STEP 1: Status & Info */}
                            {step === 'status' && (
                                <motion.div key="status" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 24 }}>
                                    <div style={{ width: 100, height: 100, margin: '0 auto', borderRadius: '50%', background: kycLevel === 'observer' ? 'rgba(184,92,46,0.1)' : 'rgba(0,229,160,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Shield size={48} style={{ color: kycLevel === 'observer' ? 'var(--nya-ochre)' : 'var(--nya-sirius)' }} />
                                    </div>
                                    
                                    <div>
                                        <div className="cosmo-label" style={{ justifyContent: 'center' }}>STATUT DE CONFIANCE</div>
                                        <h2 style={{ fontSize: '1.8rem', marginTop: 12 }}>
                                            {kycLevel === 'observer' && 'NIVEAU 1 : OBSERVATEUR'}
                                            {kycLevel === 'initiated' && 'NIVEAU 2 : INITIÉ CERTIFIÉ'}
                                            {kycLevel === 'scribe' && 'NIVEAU 3 : SCRIBE DU NEXUS'}
                                        </h2>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: 450, margin: '12px auto 0', lineHeight: 1.6 }}>
                                            {kycLevel === 'observer' && 'Votre compte est limité. Validez votre pièce d\'identité pour devenir Initié et débloquer les limites de retraits, les prêts et la conduite VTC.'}
                                            {kycLevel === 'initiated' && 'Félicitations ! Votre pièce d\'identité et vos repères biométriques ont été enregistrés avec succès dans le grand registre de Sirius.'}
                                        </p>
                                    </div>

                                    {kycLevel === 'observer' ? (
                                        <button
                                            onClick={startVerificationFlow}
                                            className="btn-primary"
                                            style={{ alignSelf: 'center', padding: '14px 36px' }}
                                        >
                                            COMMENCER LA CERTIFICATION
                                        </button>
                                    ) : (
                                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                                            <button
                                                onClick={resetVerification}
                                                className="btn-secondary"
                                                style={{ padding: '10px 24px', fontSize: '0.75rem', borderColor: 'var(--nya-red)', color: 'var(--nya-red)' }}
                                            >
                                                RÉINITIALISER LE KYC
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* STEP 2: Document Type Selection */}
                            {step === 'doc_select' && (
                                <motion.div key="doc_select" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                    <h3 style={{ fontSize: '1.2rem', borderBottom: '1px solid var(--border-default)', paddingBottom: 12 }}>
                                        CHOIX DE LA PIÈCE D'IDENTITÉ
                                    </h3>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                                        {[
                                            { id: 'cni', name: 'Carte Nationale d\'Identité (CNI)', desc: 'Recommandé en Côte d\'Ivoire' },
                                            { id: 'passport', name: 'Passeport International', desc: 'Pour les voyageurs inter-Sirius' },
                                            { id: 'driver_license', name: 'Permis de Conduire', desc: 'Obligatoire pour les chauffeurs' }
                                        ].map(doc => (
                                            <div
                                                key={doc.id}
                                                onClick={() => setDocType(doc.id as any)}
                                                style={{
                                                    background: docType === doc.id ? 'rgba(184,92,46,0.06)' : 'var(--nya-deep)',
                                                    border: docType === doc.id ? '1.5px solid var(--nya-ochre)' : '1px solid var(--border-default)',
                                                    borderRadius: 16, padding: 20, cursor: 'pointer', transition: 'all 0.3s'
                                                }}
                                            >
                                                <FileText size={24} style={{ color: docType === doc.id ? 'var(--nya-ochre)' : 'var(--text-muted)' }} />
                                                <h4 style={{ fontSize: '0.85rem', color: '#fff', marginTop: 12 }}>{doc.name}</h4>
                                                <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 4 }}>{doc.desc}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                                        <button onClick={() => setStep('status')} className="btn-secondary" style={{ padding: '12px 24px', fontSize: '0.75rem' }}>
                                            RETOUR
                                        </button>
                                        <button onClick={startDocScan} className="btn-primary" style={{ padding: '12px 28px', fontSize: '0.75rem' }}>
                                            ÉTAPE SUIVANTE
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3: Document Scanning Simulator */}
                            {step === 'doc_scan' && (
                                <motion.div key="doc_scan" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                    <h3 style={{ fontSize: '1.2rem' }}>NUMÉRISATION DU DOCUMENT</h3>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, alignItems: 'center' }}>
                                        {/* Simulated camera feed */}
                                        <div style={{
                                            height: 180, borderRadius: 16, background: '#050505',
                                            border: '2px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden'
                                        }}>
                                            {/* ID card frame */}
                                            <div style={{
                                                position: 'absolute', top: '15%', left: '10%', right: '10%', bottom: '15%',
                                                border: '2px dashed rgba(212,160,23,0.4)', borderRadius: 8
                                            }} />

                                            {/* Laser scanning beam */}
                                            {scanState === 'scanning' && (
                                                <motion.div
                                                    animate={{ top: ['15%', '80%', '15%'] }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                                    style={{
                                                        position: 'absolute', left: '10%', right: '10%', height: 2,
                                                        background: 'var(--nya-gold)', boxShadow: '0 0 10px var(--nya-gold)', zIndex: 5
                                                    }}
                                                />
                                            )}

                                            {/* Simulated Scan Output Card preview */}
                                            {scanState === 'ocr' && (
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                                    <div style={{ width: 140, height: 90, borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: 6 }}>
                                                        <div style={{ width: 30, height: 35, background: 'rgba(255,255,255,0.1)', borderRadius: 3, float: 'left', marginRight: 6 }} />
                                                        <div style={{ height: 6, width: 80, background: 'rgba(255,255,255,0.1)', marginBottom: 4 }} />
                                                        <div style={{ height: 6, width: 50, background: 'rgba(255,255,255,0.1)', marginBottom: 4 }} />
                                                        <div style={{ height: 6, width: 60, background: 'rgba(255,255,255,0.1)' }} />
                                                    </div>
                                                </div>
                                            )}

                                            {scanState === 'done' && (
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--nya-sirius)' }}>
                                                    <CheckCircle2 size={48} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Scan Details / Status */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                            <div className="accent-label">STATUT DU LECTEUR OCR</div>
                                            <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>
                                                {scanState === 'scanning' && '⚙️ RAMASSAGE DES CHAMPS COSMIQUES...'}
                                                {scanState === 'ocr' && '🧠 EXTRACTION DES DONNÉES PAR L\'IA...'}
                                                {scanState === 'done' && '✅ DOCUMENT VALIDÉ !'}
                                            </div>
                                            
                                            {scannedData && (
                                                <div style={{ background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 8, fontSize: '0.65rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                    <div><strong>Nom :</strong> {scannedData.lastName}</div>
                                                    <div><strong>Prénom :</strong> {scannedData.firstName}</div>
                                                    <div><strong>N° Pièce :</strong> {scannedData.docNumber}</div>
                                                    <div><strong>Nationalité :</strong> {scannedData.nationality}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                                        <button onClick={() => setStep('doc_select')} className="btn-secondary" style={{ padding: '12px 24px', fontSize: '0.75rem' }}>
                                            RETOUR
                                        </button>
                                        <button
                                            onClick={startFaceScan}
                                            disabled={scanState !== 'done'}
                                            className="btn-primary"
                                            style={{
                                                padding: '12px 28px', fontSize: '0.75rem',
                                                cursor: scanState === 'done' ? 'pointer' : 'not-allowed',
                                                opacity: scanState === 'done' ? 1 : 0.4
                                            }}
                                        >
                                            ÉTAPE BIOMÉTRIQUE
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 4: Facial Biometric scanning */}
                            {step === 'face_scan' && (
                                <motion.div key="face_scan" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
                                    <h3 style={{ fontSize: '1.2rem', width: '100%' }}>AUDIT BIOMÉTRIQUE</h3>

                                    {/* Facial scanner circle */}
                                    <div style={{
                                        width: 160, height: 160, borderRadius: '50%', background: '#050505',
                                        border: '3px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden'
                                    }}>
                                        {/* Scanner circle guidance overlay */}
                                        <div style={{
                                            position: 'absolute', top: '10%', left: '10%', right: '10%', bottom: '10%',
                                            border: '2px dashed var(--nya-sirius)', borderRadius: '50%', opacity: 0.5
                                        }} />

                                        {/* Animated circle tracking */}
                                        {faceState === 'processing' && (
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1], rotate: 360 }}
                                                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                                style={{
                                                    position: 'absolute', top: '5%', left: '5%', right: '5%', bottom: '5%',
                                                    border: '1.5px solid var(--nya-gold)', borderRadius: '50%'
                                                }}
                                            />
                                        )}

                                        {/* Face placeholder shape */}
                                        <div style={{
                                            position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)',
                                            width: 70, height: 95, borderRadius: '40% 40% 45% 45%',
                                            border: '3.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.02)'
                                        }} />
                                    </div>

                                    {/* Instructions */}
                                    <div style={{ textAlign: 'center' }}>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: faceState === 'done' ? 'var(--nya-sirius)' : 'var(--nya-gold)' }}>
                                            {faceFeedback.toUpperCase()}
                                        </span>
                                        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 6 }}>
                                            Cette étape garantit que le titulaire de la pièce d'identité est bien présent devant l'appareil.
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', gap: 16, marginTop: 12, width: '100%', justifyContent: 'center' }}>
                                        <button onClick={() => setStep('doc_scan')} className="btn-secondary" style={{ padding: '12px 24px', fontSize: '0.75rem' }}>
                                            RETOUR
                                        </button>
                                        <button
                                            onClick={finalizeVerification}
                                            disabled={faceState !== 'done'}
                                            className="btn-primary"
                                            style={{
                                                padding: '12px 28px', fontSize: '0.75rem',
                                                cursor: faceState === 'done' ? 'pointer' : 'not-allowed',
                                                opacity: faceState === 'done' ? 1 : 0.4
                                            }}
                                        >
                                            FINALISER LE KYC
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 5: Complete */}
                            {step === 'complete' && (
                                <motion.div key="complete" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 24 }}>
                                    <div style={{ width: 100, height: 100, margin: '0 auto', borderRadius: '50%', background: 'rgba(0,229,160,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <UserCheck size={48} style={{ color: 'var(--nya-sirius)' }} />
                                    </div>

                                    <div>
                                        <h2 style={{ fontSize: '1.8rem', color: 'var(--nya-sirius)' }}>CONSTELLATION LIÉE !</h2>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: 450, margin: '12px auto 0', lineHeight: 1.6 }}>
                                            Votre identité souveraine a été forgée avec succès. Vous bénéficiez désormais du badge de niveau 2 <strong>Initié</strong> et de tous les accès avancés de l'écosystème.
                                        </p>
                                    </div>

                                    <button onClick={() => setStep('status')} className="btn-primary" style={{ alignSelf: 'center', padding: '12px 32px' }}>
                                        VOIR MON REPERTOIRE
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>

                    {/* Right Column: Benefits list & Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                        
                        {/* Benefits list */}
                        <div style={{
                            background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                            borderRadius: 24, padding: 24
                        }}>
                            <h3 style={{
                                fontFamily: 'var(--font-display)', fontSize: '1.2rem',
                                fontWeight: 900, color: 'var(--text-primary)', marginBottom: 20,
                                display: 'flex', alignItems: 'center', gap: 10
                            }}>
                                <Award size={18} style={{ color: 'var(--nya-gold)' }} />
                                NIVEAUX DE SOUVERAINETÉ
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {[
                                    { level: 'Observer (Niveau 1)', active: kycLevel === 'observer', desc: 'Accès limité aux marchands, profil public et navigation de base.', color: 'var(--nya-ochre)' },
                                    { level: 'Initié (Niveau 2)', active: kycLevel === 'initiated', desc: 'Débloque les virement cosmiques, prêts Sirius, et transactions immobilières.', color: 'var(--nya-gold)' },
                                    { level: 'Scribe (Niveau 3)', active: kycLevel === 'scribe', desc: 'Autorisation de conduite VTC, marchands officiels, modération des tontines.', color: 'var(--nya-sirius)' }
                                ].map((badge, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            padding: 14, borderRadius: 16,
                                            background: badge.active ? 'rgba(255,255,255,0.02)' : 'transparent',
                                            border: badge.active ? `1.5px solid ${badge.color}` : '1px solid var(--border-default)',
                                            opacity: badge.active ? 1 : 0.5
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: badge.active ? '#fff' : 'var(--text-muted)' }}>
                                                {badge.level}
                                            </span>
                                            {badge.active && <CheckCircle2 size={14} style={{ color: badge.color }} />}
                                        </div>
                                        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.4 }}>
                                            {badge.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Security notice */}
                        <div style={{
                            background: 'rgba(239,68,68,0.01)', border: '1px dashed rgba(239,68,68,0.2)',
                            borderRadius: 20, padding: 20, display: 'flex', gap: 12, alignItems: 'flex-start'
                        }}>
                            <AlertCircle size={18} style={{ color: 'var(--nya-red)', flexShrink: 0, marginTop: 2 }} />
                            <div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fff', display: 'block' }}>Sécurité et Vie Privée</span>
                                <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: 1.4, marginTop: 4 }}>
                                    Vos données d'identité sont cryptées localement et stockées de manière souveraine. Aucun document n'est transféré à des serveurs tiers sans votre accord explicite.
                                </p>
                            </div>
                        </div>

                    </div>

                </div>

            </main>
            <Footer />
        </div>
    )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import SEOHead from '../components/SEOHead'
import { useNotificationStore } from '../stores/notificationStore'
import { useAuthStore } from '../stores/authStore'
import {
    Zap, Droplet, BookOpen, Shield, FileText, CheckCircle,
    Search, Building, Clock, ArrowUpRight, Check
} from 'lucide-react'

interface MiniApp {
    id: string
    title: string
    category: 'admin' | 'utility' | 'edu' | 'finance'
    description: string
    icon: any
    color: string
    popularity: number
}

export default function MiniHub() {
    const { addCoins, addScore } = useAuthStore()
    const { push } = useNotificationStore()

    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'admin' | 'utility' | 'edu' | 'finance'>('all')
    const [activeTab, setActiveTab] = useState<'catalog' | 'bills' | 'documents'>('catalog')

    // Facture States
    const [billType, setBillType] = useState<'cie' | 'sodeci'>('cie')
    const [billNumber, setBillNumber] = useState('')
    const [billAmount, setBillAmount] = useState<number>(0)
    const [paying, setPaying] = useState(false)
    const [paySuccess, setPaySuccess] = useState(false)

    // Document States
    const [docType, setDocType] = useState('extrait')
    const [fullName, setFullName] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const [submittingDoc, setSubmittingDoc] = useState(false)
    const [docSuccess, setDocSuccess] = useState(false)

    const miniApps: MiniApp[] = [
        { id: 'MA1', title: 'Portail CIE Factures', category: 'utility', description: 'Réglez vos factures d\'électricité de Côte d\'Ivoire instantanément en Nya Coins ou Mobile Money.', icon: Zap, color: '#F59E0B', popularity: 98 },
        { id: 'MA2', title: 'SODECI Eau Directe', category: 'utility', description: 'Suivi et paiement de vos factures d\'eau courante locales avec reçus dématérialisés.', icon: Droplet, color: '#3b82f6', popularity: 94 },
        { id: 'MA3', title: 'Guichet État Civil', category: 'admin', description: 'Demandes officielles d\'extraits de naissance, certificats de résidence et documents légaux.', icon: FileText, color: '#B85C2E', popularity: 87 },
        { id: 'MA4', title: 'Sirius Éducation / CIE', category: 'edu', description: 'Paiement des frais scolaires universitaires et accès aux bourses d\'études Sirius.', icon: BookOpen, color: '#10b981', popularity: 82 },
        { id: 'MA5', title: 'Oracle Légal / Contrats', category: 'admin', description: 'Vérifiez et certifiez vos contrats de bail ou de vente immobilière via la signature Sirius.', icon: Shield, color: '#8b5cf6', popularity: 75 },
    ]

    const handleSearch = (app: MiniApp) => {
        const matchesQuery = app.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             app.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory
        return matchesQuery && matchesCategory
    }

    const handleQueryBill = (e: React.FormEvent) => {
        e.preventDefault()
        if (!billNumber.trim()) return
        
        // Fictional bill query generator
        const amount = Math.floor(Math.random() * 45000) + 5000
        setBillAmount(amount)
        push({
            type: 'system',
            title: 'Facture retrouvée',
            message: `Montant à payer : ${amount.toLocaleString('fr-FR')} FCFA.`,
            icon: '📄',
            color: '#B85C2E'
        })
    }

    const handlePayBill = () => {
        setPaying(true)
        setTimeout(() => {
            setPaying(false)
            setPaySuccess(true)
            addScore(50)
            addCoins(10)
            push({
                type: 'system',
                title: 'Paiement Effectué',
                message: `La facture a été réglée avec succès (+50 Score, +10 Coins).`,
                icon: '⚡',
                color: '#00E5A0'
            })
        }, 2000)
    }

    const handleRequestDoc = (e: React.FormEvent) => {
        e.preventDefault()
        if (!fullName.trim() || !birthDate) return

        setSubmittingDoc(true)
        setTimeout(() => {
            setSubmittingDoc(false)
            setDocSuccess(true)
            addScore(100)
            push({
                type: 'reward',
                title: 'Demande Enregistrée',
                message: `Votre demande de document a été validée par l'Oracle Sirius (+100 Score).`,
                icon: '📜',
                color: '#D4A017'
            })
        }, 2500)
    }

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 100 }}>
            <SEOHead 
                title="Sirius Mini-Hub — Super-App NYA BLO OGO" 
                description="Accédez aux services publics locaux, réglez vos factures CIE & SODECI, et demandez vos documents administratifs d'état civil en ligne." 
            />
            <Starfield />
            <CosmicBackground />
            <Navbar />

            <main className="max-w-container" style={{ paddingTop: 120, position: 'relative', zIndex: 2 }}>
                
                {/* Header */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
                    <div className="cosmo-label">Écosystème Sirius {" > "} Services Nationaux</div>
                    <h1 className="text-shimmer" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                        SIRIUS MINI-HUB
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 650 }}>
                        L'intégration WeChat-style pour l'Afrique de l'Ouest. Payez vos factures, accédez aux guichets publics locaux et lancez des mini-programmes tiers instantanément.
                    </p>
                </div>

                {/* Sub-Navigation Tabs */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 40, borderBottom: '1px solid var(--border-default)', paddingBottom: 16, overflowX: 'auto' }}>
                    {[
                        { id: 'catalog', label: 'Mini-Programmes' },
                        { id: 'bills', label: 'Règlement de Factures' },
                        { id: 'documents', label: 'Guichet Administratif' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            style={{
                                padding: '10px 24px', borderRadius: 'var(--radius-pill)',
                                background: activeTab === tab.id ? 'var(--nya-ochre)' : 'transparent',
                                border: '1px solid ' + (activeTab === tab.id ? 'var(--nya-ochre)' : 'var(--border-subtle)'),
                                color: activeTab === tab.id ? '#fff' : 'var(--text-muted)',
                                fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase',
                                cursor: 'pointer', transition: 'all 0.3s ease',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'catalog' && (
                        <motion.div
                            key="catalog"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            {/* Search and Categories bar */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24, marginBottom: 40 }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    padding: '12px 20px', borderRadius: 12,
                                    background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)'
                                }}>
                                    <Search size={16} style={{ color: 'var(--nya-ochre)' }} />
                                    <input
                                        type="text"
                                        placeholder="Rechercher une application ou administration locale..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '0.85rem', width: '100%' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
                                    {[
                                        { id: 'all', label: 'Tous' },
                                        { id: 'utility', label: 'Factures' },
                                        { id: 'admin', label: 'État Civil' },
                                        { id: 'edu', label: 'Éducation' }
                                    ].map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id as any)}
                                            style={{
                                                padding: '8px 16px', borderRadius: 10,
                                                background: selectedCategory === cat.id ? 'rgba(255,255,255,0.06)' : 'transparent',
                                                border: '1px solid ' + (selectedCategory === cat.id ? 'var(--nya-gold)' : 'transparent'),
                                                color: selectedCategory === cat.id ? 'var(--nya-gold)' : 'var(--text-muted)',
                                                fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer'
                                            }}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Mini Programs Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
                                {miniApps.filter(handleSearch).map((app) => (
                                    <motion.div
                                        key={app.id}
                                        whileHover={{ y: -6, borderColor: 'var(--border-hover)' }}
                                        onClick={() => {
                                            if (app.category === 'utility') setActiveTab('bills')
                                            if (app.category === 'admin') setActiveTab('documents')
                                        }}
                                        style={{
                                            borderRadius: 24, padding: 24, cursor: 'pointer',
                                            background: 'var(--nya-deep)', border: '1px solid var(--border-default)',
                                            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                                            gap: 16, transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{
                                                width: 48, height: 48, borderRadius: 12,
                                                background: `rgba(${app.color === '#3b82f6' ? '59,130,246' : app.color === '#F59E0B' ? '245,158,11' : '184,92,46'}, 0.1)`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <app.icon size={22} style={{ color: app.color }} />
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                                                <Clock size={12} />
                                                <span>Populaire ({app.popularity}%)</span>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 900, color: '#fff', marginBottom: 8 }}>
                                                {app.title}
                                            </h3>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                                                {app.description}
                                            </p>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.7rem', fontWeight: 800, color: 'var(--nya-gold)', textTransform: 'uppercase', marginTop: 12 }}>
                                            Lancer l'application <ArrowUpRight size={14} />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'bills' && (
                        <motion.div
                            key="bills"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40 }}
                        >
                            {/* Bill form */}
                            <div className="toguna-glass" style={{ padding: 32, borderRadius: 24 }}>
                                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, color: '#fff', marginBottom: 24 }}>
                                    Règlement d'utilité publique
                                </h2>

                                {!paySuccess ? (
                                    <form onSubmit={handleQueryBill} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                        {/* Bill Selector */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                            <button
                                                type="button"
                                                onClick={() => { setBillType('cie'); setBillAmount(0); setBillNumber(''); }}
                                                style={{
                                                    padding: '16px', borderRadius: 12, cursor: 'pointer',
                                                    background: billType === 'cie' ? 'rgba(245,158,11,0.08)' : 'transparent',
                                                    border: '1.5px solid ' + (billType === 'cie' ? '#F59E0B' : 'var(--border-subtle)'),
                                                    color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8
                                                }}
                                            >
                                                <Zap size={24} style={{ color: '#F59E0B' }} />
                                                <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>Électricité CIE</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => { setBillType('sodeci'); setBillAmount(0); setBillNumber(''); }}
                                                style={{
                                                    padding: '16px', borderRadius: 12, cursor: 'pointer',
                                                    background: billType === 'sodeci' ? 'rgba(59,130,246,0.08)' : 'transparent',
                                                    border: '1.5px solid ' + (billType === 'sodeci' ? '#3b82f6' : 'var(--border-subtle)'),
                                                    color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8
                                                }}
                                            >
                                                <Droplet size={24} style={{ color: '#3b82f6' }} />
                                                <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>Eau SODECI</span>
                                            </button>
                                        </div>

                                        {/* Bill number field */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                                Identifiant Facture / Numéro de Contrat
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Ex: 0984817478"
                                                value={billNumber}
                                                onChange={(e) => setBillNumber(e.target.value)}
                                                style={{
                                                    padding: '14px 20px', borderRadius: 12, background: 'rgba(0,0,0,0.2)',
                                                    border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '0.85rem'
                                                }}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            style={{
                                                padding: '14px', borderRadius: 12, border: 'none', cursor: 'pointer',
                                                background: 'var(--nya-ochre)', color: '#fff', fontWeight: 800,
                                                fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase'
                                            }}
                                        >
                                            Rechercher ma facture
                                        </button>
                                    </form>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '32px 0' }}>
                                        <div style={{
                                            width: 60, height: 60, borderRadius: '50%',
                                            background: 'rgba(0,229,160,0.1)', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center',
                                            margin: '0 auto 20px', color: 'var(--nya-sirius)'
                                        }}>
                                            <CheckCircle size={32} />
                                        </div>
                                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900, color: '#fff', marginBottom: 8 }}>
                                            Facture Réglée !
                                        </h3>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 24 }}>
                                            Le reçu électronique a été envoyé sur votre messagerie et stocké sur la blockchain Sirius.
                                        </p>
                                        <button
                                            onClick={() => { setPaySuccess(false); setBillAmount(0); setBillNumber(''); }}
                                            style={{
                                                padding: '12px 24px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-hover)',
                                                background: 'transparent', color: '#fff', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer'
                                            }}
                                        >
                                            Régler une autre facture
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Bill details sidebar */}
                            <div>
                                {billAmount > 0 && !paySuccess && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="toguna-glass"
                                        style={{ padding: 24, borderRadius: 24, border: '1px solid var(--nya-gold)', display: 'flex', flexDirection: 'column', gap: 20 }}
                                    >
                                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 900, color: 'var(--nya-gold)' }}>
                                            DÉTAILS DU PAIEMENT
                                        </h3>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                                <span style={{ color: 'var(--text-muted)' }}>Type</span>
                                                <span style={{ fontWeight: 800, color: '#fff' }}>{billType === 'cie' ? 'Électricité CIE' : 'Eau SODECI'}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                                <span style={{ color: 'var(--text-muted)' }}>Numéro</span>
                                                <span style={{ fontWeight: 800, color: '#fff' }}>{billNumber}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                                <span style={{ color: 'var(--text-muted)' }}>Échéance</span>
                                                <span style={{ fontWeight: 800, color: 'var(--nya-red)' }}>Immédiate</span>
                                            </div>
                                            <div style={{ height: 1, background: 'var(--border-default)', margin: '8px 0' }} />
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800 }}>TOTAL</span>
                                                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>
                                                    {billAmount.toLocaleString('fr-FR')} FCFA
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handlePayBill}
                                            disabled={paying}
                                            style={{
                                                width: '100%', padding: '14px', borderRadius: 12, border: 'none', cursor: 'pointer',
                                                background: 'linear-gradient(135deg, var(--nya-ochre), var(--nya-ochre-dark))', color: '#fff',
                                                fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
                                            }}
                                        >
                                            {paying ? (
                                                <>
                                                    <div style={{ width: 14, height: 14, border: '2px solid #fff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                                    Validation...
                                                </>
                                            ) : (
                                                <>RÉGLER MA FACTURE <Check size={16} /></>
                                            )}
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'documents' && (
                        <motion.div
                            key="documents"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40 }}
                        >
                            {/* Document request form */}
                            <div className="toguna-glass" style={{ padding: 32, borderRadius: 24 }}>
                                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, color: '#fff', marginBottom: 24 }}>
                                    Guichet Administratif Numérique
                                </h2>

                                {!docSuccess ? (
                                    <form onSubmit={handleRequestDoc} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                        {/* Doc Selector */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                                Sélectionnez le document demandé
                                            </label>
                                            <select
                                                value={docType}
                                                onChange={(e) => setDocType(e.target.value)}
                                                style={{
                                                    padding: '14px 20px', borderRadius: 12, background: 'var(--nya-deep)',
                                                    border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '0.85rem'
                                                }}
                                            >
                                                <option value="extrait">Extrait d'Acte de Naissance</option>
                                                <option value="residence">Certificat de Résidence</option>
                                                <option value="nationalite">Certificat de Nationalité</option>
                                            </select>
                                        </div>

                                        {/* Full Name */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                                Nom Complet (tel que figurant sur la CNI)
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Ex: Koffi Amenan Marie"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                required
                                                style={{
                                                    padding: '14px 20px', borderRadius: 12, background: 'rgba(0,0,0,0.2)',
                                                    border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '0.85rem'
                                                }}
                                            />
                                        </div>

                                        {/* Birth date */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                                Date de Naissance
                                            </label>
                                            <input
                                                type="date"
                                                value={birthDate}
                                                onChange={(e) => setBirthDate(e.target.value)}
                                                required
                                                style={{
                                                    padding: '14px 20px', borderRadius: 12, background: 'rgba(0,0,0,0.2)',
                                                    border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '0.85rem'
                                                }}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={submittingDoc}
                                            style={{
                                                padding: '14px', borderRadius: 12, border: 'none', cursor: 'pointer',
                                                background: 'var(--nya-ochre)', color: '#fff', fontWeight: 800,
                                                fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                                            }}
                                        >
                                            {submittingDoc ? (
                                                <>
                                                    <div style={{ width: 14, height: 14, border: '2px solid #fff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                                    Signature par l'Oracle...
                                                </>
                                            ) : (
                                                <>Soumettre ma demande</>
                                            )}
                                        </button>
                                    </form>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '32px 0' }}>
                                        <div style={{
                                            width: 60, height: 60, borderRadius: '50%',
                                            background: 'rgba(212,160,23,0.1)', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center',
                                            margin: '0 auto 20px', color: 'var(--nya-gold)'
                                        }}>
                                            <CheckCircle size={32} />
                                        </div>
                                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900, color: '#fff', marginBottom: 8 }}>
                                            Demande Envoyée !
                                        </h3>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 24 }}>
                                            Votre document numérique est en cours de validation par la mairie partenaire. Statut : En cours de signature.
                                        </p>
                                        <button
                                            onClick={() => { setDocSuccess(false); setFullName(''); setBirthDate(''); }}
                                            style={{
                                                padding: '12px 24px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-hover)',
                                                background: 'transparent', color: '#fff', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer'
                                            }}
                                        >
                                            Nouvelle demande
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Status tracker */}
                            <div className="toguna-glass" style={{ padding: 24, borderRadius: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <Building size={18} style={{ color: 'var(--nya-ochre)' }} />
                                    SUIVI ADMINISTRATIVE
                                </h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    {[
                                        { id: '1', doc: 'Extrait d\'acte de naissance', date: '2026-06-20', status: 'signature', badge: 'Signature en cours' },
                                        { id: '2', doc: 'Certificat de Résidence', date: '2026-06-18', status: 'dispo', badge: 'Disponible' }
                                    ].map((track) => (
                                        <div key={track.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 12 }}>
                                            <div>
                                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fff', display: 'block' }}>{track.doc}</span>
                                                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Soumis le {track.date}</span>
                                            </div>
                                            <div style={{
                                                fontSize: '0.6rem', fontWeight: 800, padding: '4px 10px', borderRadius: 8,
                                                background: track.status === 'dispo' ? 'rgba(0,229,160,0.1)' : 'rgba(212,160,23,0.1)',
                                                color: track.status === 'dispo' ? 'var(--nya-sirius)' : 'var(--nya-gold)'
                                            }}>
                                                {track.badge}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </main>
            <Footer />
        </div>
    )
}

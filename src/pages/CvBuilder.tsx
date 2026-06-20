import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { useAuthStore } from '../stores/authStore'
import {
    Download, Sparkles, Palette, Layout,
    User, Briefcase, Mail, Phone, Wrench, Check, ArrowRight, ArrowLeft, RefreshCw, Terminal
} from 'lucide-react'

// CV Templates definitions
const themes = [
    { id: 'sirius-noir', name: 'Sirius Noir', color: 'var(--nya-ochre)', bg: 'var(--nya-black)', text: '#FFF', accent: '#D4A017', border: 'rgba(184,92,46,0.3)', font: 'var(--font-display)' },
    { id: 'nommo-tech', name: 'Nommo Tech', color: '#00E5A0', bg: '#050a12', text: '#d1f4ff', accent: '#00CED1', border: 'rgba(0,229,160,0.2)', font: 'monospace' },
    { id: 'amma-gold', name: 'Amma Gold', color: '#B85C2E', bg: '#fdfbf7', text: '#2e1a0a', accent: '#8B4522', border: '#D4A017', font: 'var(--font-body)' },
]

export default function CvBuilder() {
    const [step, setStep] = useState(1)
    const [activeTheme, setActiveTheme] = useState(themes[0])
    const [isOptimizing, setIsOptimizing] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [rewardNotification, setRewardNotification] = useState<string | null>(null)
    const { addCoins, addScore } = useAuthStore()

    // Parser State
    const [showParser, setShowParser] = useState(false)
    const [rawText, setRawText] = useState('')

    // Form state
    const [formData, setFormData] = useState({
        name: 'Kofi Konan',
        title: 'Architecte Cloud & Scribe IA',
        email: 'kofi.konan@sirius.net',
        phone: '+225 07 08 09 10 11',
        bio: 'Passionné par la convergence entre les technologies décentralisées et la sagesse ancestrale. Expert en conception de systèmes robustes avec une touche afrofuturiste.',
        experienceTitle: 'Lead Developer Cloud & Big Data',
        experienceCompany: 'Sirius Tech Labs - Abidjan',
        experienceDuration: '2024 - Présent',
        experienceDesc: 'Direction de la migration des services vers un cloud souverain afrofuturiste. Optimisation des modèles de langage Nommo en français local.',
        education: 'Master Génie Logiciel - Université Polytechnique de Yamoussoukro',
        skill1: 'React / Next.js',
        skill1Level: 90,
        skill2: 'Python & LLM Fine-Tuning',
        skill2Level: 85,
        skill3: 'Cloud Architecture & Docker',
        skill3Level: 75,
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSliderChange = (name: string, value: number) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const optimizeBioWithAI = () => {
        setIsOptimizing(true)
        setTimeout(() => {
            setFormData(prev => ({
                ...prev,
                bio: "Scribe de code d'élite et Architecte Cloud. Expert en déploiement d'écosystèmes digitaux scalables et souverains. Maître d'œuvre dans la forge d'intelligences artificielles (LLM) adaptées au marché ouest-africain, unissant rigueur algorithmique et résonance cosmogonique Sirius."
            }))
            setIsOptimizing(false)

            // Reward user
            addCoins(40)
            addScore(80)
            setRewardNotification("+40 Nya Coins & +80 Nya Score ! L'Oracle Sirius a transmuté votre profil.")
            setTimeout(() => setRewardNotification(null), 5000)
        }, 1500)
    }

    // Algorithmic raw text profile parser
    const parseRawText = () => {
        if (!rawText.trim()) return
        setIsOptimizing(true)

        setTimeout(() => {
            const txt = rawText
            const newForm = { ...formData }

            // Name Match Heuristics
            const nameMatch = txt.match(/(?:je m'appelle|mon nom est|moi c'est)\s+([A-Z][a-zÀ-ÿ]+(?:\s+[A-Z][a-zÀ-ÿ]+)*)/i)
            if (nameMatch && nameMatch[1]) {
                newForm.name = nameMatch[1].trim()
            }

            // Title Match Heuristics
            const titleMatch = txt.match(/(?:je suis|profession\s*:\s*|métier\s*:\s*)\s*([A-Za-zÀ-ÿ\s&]+?)(?:\.|,|$|et\s+je|dans)/i)
            if (titleMatch && titleMatch[1]) {
                newForm.title = titleMatch[1].trim()
            }

            // Skills Match Heuristics
            const skillsPool = [
                'React', 'Next.js', 'Python', 'LLM', 'Cloud', 'Docker', 'Figma', 'UI/UX',
                'DevOps', 'Java', 'Javascript', 'SQL', 'TypeScript', 'Node.js', 'Marketing'
            ]
            const foundSkills = skillsPool.filter(s => txt.toLowerCase().includes(s.toLowerCase()))
            if (foundSkills.length > 0) {
                newForm.skill1 = foundSkills[0]
                newForm.skill1Level = 85
            }
            if (foundSkills.length > 1) {
                newForm.skill2 = foundSkills[1]
                newForm.skill2Level = 80
            }
            if (foundSkills.length > 2) {
                newForm.skill3 = foundSkills[2]
                newForm.skill3Level = 75
            }

            // Summary
            newForm.bio = txt.length > 180 ? txt.substring(0, 180) + '...' : txt

            setFormData(newForm)
            setIsOptimizing(false)
            setRawText('')
            setShowParser(false)

            // Reward
            addCoins(30)
            addScore(60)
            setRewardNotification("+30 Nya Coins & +60 Nya Score ! Transmutation de profil réussie.")
            setTimeout(() => setRewardNotification(null), 5000)
        }, 1200)
    }

    const handleExport = () => {
        setIsExporting(true)
        setTimeout(() => {
            setIsExporting(false)
            window.print()
        }, 1200)
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
            <section className="section-full" style={{ minHeight: '40vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(212,160,23,0.06) 0%, transparent 60%)', zIndex: 1 }}></div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 2 }}>
                    <div className="cosmo-label" style={{ justifyContent: 'center', marginBottom: 24 }}>SCEAU DU DESTIN</div>
                    <h1 className="text-shimmer" style={{ marginBottom: 24 }}>FORGEZ VOTRE<br />IDENTITÉ</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: 600, margin: '0 auto' }}>
                        Créez un CV professionnel propulsé par l'IA Oracle Sirius. Votre passeport vers l'excellence.
                    </p>
                </motion.div>
            </section>

            {/* Main Interactive Workspace */}
            <section className="section-full section-dark" style={{ paddingTop: 0 }}>
                <div className="max-w-container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40 }} className="cv-workspace-grid">
                        
                        {/* LEFT COLUMN: Input form wizard */}
                        <div style={{
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border-default)',
                            borderRadius: 'var(--radius-xl, 20px)',
                            padding: 32,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 24,
                            alignSelf: 'start'
                        }}>
                            
                            {/* AI Raw Text Importer Tool */}
                            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border-hover)', borderRadius: 12, padding: 16 }}>
                                <button
                                    onClick={() => setShowParser(prev => !prev)}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        width: '100%', background: 'none', border: 'none', color: '#FFF',
                                        cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 800,
                                        fontSize: '0.75rem', letterSpacing: '0.05em'
                                    }}
                                >
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Terminal size={14} style={{ color: 'var(--nya-ochre)' }} />
                                        TRANSMUTATION DE TEXTE BRUT (IA)
                                    </span>
                                    <span style={{ color: 'var(--nya-ochre)' }}>{showParser ? '▲ MASQUER' : '▼ AFFICHER'}</span>
                                </button>
                                
                                <AnimatePresence>
                                    {showParser && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            style={{ overflow: 'hidden', marginTop: 12 }}
                                        >
                                            <textarea
                                                value={rawText}
                                                onChange={(e) => setRawText(e.target.value)}
                                                rows={4}
                                                placeholder="Collez votre profil brut en français (ex: Je m'appelle Amina Kone, je suis developpeur React senior. Je maitrise Python et Next.js...)"
                                                style={{
                                                    width: '100%', padding: '12px 16px', borderRadius: 8,
                                                    background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)',
                                                    color: '#FFF', fontSize: '0.8rem', lineHeight: 1.5, outline: 'none',
                                                    resize: 'vertical', fontFamily: 'var(--font-body)', marginBottom: 10
                                                }}
                                            />
                                            <button
                                                onClick={parseRawText}
                                                disabled={isOptimizing || !rawText.trim()}
                                                style={{
                                                    width: '100%', padding: '10px 16px', borderRadius: 'var(--radius-pill, 20px)',
                                                    background: 'linear-gradient(135deg, var(--nya-gold), var(--nya-ochre))',
                                                    color: '#FFF', border: 'none', fontFamily: 'var(--font-body)',
                                                    fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                                                }}
                                            >
                                                {isOptimizing ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                                TRANSMUTER EN CV SCEAU
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Wizard navigation indicators */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 20 }}>
                                {[
                                    { stepNum: 1, label: 'Profil', icon: User },
                                    { stepNum: 2, label: 'Compétences', icon: Wrench },
                                    { stepNum: 3, label: 'Parcours', icon: Briefcase },
                                    { stepNum: 4, label: 'Style', icon: Palette }
                                ].map((s) => (
                                    <button
                                        key={s.stepNum}
                                        onClick={() => setStep(s.stepNum)}
                                        style={{
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            color: step === s.stepNum ? 'var(--nya-ochre)' : 'var(--text-faint)',
                                            transition: 'color 0.3s'
                                        }}
                                    >
                                        <div style={{
                                            width: 32, height: 32, borderRadius: '50%',
                                            background: step === s.stepNum ? 'rgba(184,92,46,0.1)' : 'rgba(255,255,255,0.02)',
                                            border: '1px solid',
                                            borderColor: step === s.stepNum ? 'var(--nya-ochre)' : 'var(--border-subtle)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <s.icon size={14} />
                                        </div>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Wizard Form Sections */}
                            <div style={{ minHeight: '320px' }}>
                                <AnimatePresence mode="wait">
                                    
                                    {/* Step 1: Profil */}
                                    {step === 1 && (
                                        <motion.div key="step-1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                            <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <User size={18} className="text-ochre" /> 1. Informations Générales
                                            </h3>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                                <div>
                                                    <label className="accent-label" style={{ marginBottom: 6, display: 'block' }}>Nom complet</label>
                                                    <input name="name" value={formData.name} onChange={handleInputChange} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', color: '#FFF', outline: 'none' }} />
                                                </div>
                                                <div>
                                                    <label className="accent-label" style={{ marginBottom: 6, display: 'block' }}>Titre professionnel</label>
                                                    <input name="title" value={formData.title} onChange={handleInputChange} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', color: '#FFF', outline: 'none' }} />
                                                </div>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                                <div>
                                                    <label className="accent-label" style={{ marginBottom: 6, display: 'block' }}>Email</label>
                                                    <input name="email" type="email" value={formData.email} onChange={handleInputChange} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', color: '#FFF', outline: 'none' }} />
                                                </div>
                                                <div>
                                                    <label className="accent-label" style={{ marginBottom: 6, display: 'block' }}>Téléphone</label>
                                                    <input name="phone" value={formData.phone} onChange={handleInputChange} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', color: '#FFF', outline: 'none' }} />
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                                    <label className="accent-label">Résumé professionnel / Biographie</label>
                                                    <button
                                                        onClick={optimizeBioWithAI}
                                                        disabled={isOptimizing}
                                                        style={{
                                                            background: 'rgba(184,92,46,0.1)',
                                                            border: '1px solid var(--nya-ochre)',
                                                            color: 'var(--nya-ochre)',
                                                            padding: '4px 12px',
                                                            borderRadius: 20,
                                                            fontSize: '0.65rem',
                                                            fontWeight: 800,
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 6
                                                        }}
                                                    >
                                                        {isOptimizing ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} />}
                                                        OPTIMISER PAR IA
                                                    </button>
                                                </div>
                                                <textarea name="bio" rows={4} value={formData.bio} onChange={handleInputChange} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', color: '#FFF', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-body)', fontSize: '0.85rem', lineHeight: 1.5 }} />
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 2: Compétences */}
                                    {step === 2 && (
                                        <motion.div key="step-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                            <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <Wrench size={18} className="text-ochre" /> 2. Compétences Sacrées
                                            </h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                                <div>
                                                    <label className="accent-label" style={{ marginBottom: 6, display: 'block' }}>Compétence 1</label>
                                                    <input name="skill1" value={formData.skill1} onChange={handleInputChange} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', color: '#FFF', outline: 'none', marginBottom: 8 }} />
                                                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                                        <input type="range" min="10" max="100" value={formData.skill1Level} onChange={(e) => handleSliderChange('skill1Level', parseInt(e.target.value))} style={{ flex: 1, accentColor: 'var(--nya-ochre)' }} />
                                                        <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', width: 30 }}>{formData.skill1Level}%</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="accent-label" style={{ marginBottom: 6, display: 'block' }}>Compétence 2</label>
                                                    <input name="skill2" value={formData.skill2} onChange={handleInputChange} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', color: '#FFF', outline: 'none', marginBottom: 8 }} />
                                                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                                        <input type="range" min="10" max="100" value={formData.skill2Level} onChange={(e) => handleSliderChange('skill2Level', parseInt(e.target.value))} style={{ flex: 1, accentColor: 'var(--nya-ochre)' }} />
                                                        <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', width: 30 }}>{formData.skill2Level}%</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="accent-label" style={{ marginBottom: 6, display: 'block' }}>Compétence 3</label>
                                                    <input name="skill3" value={formData.skill3} onChange={handleInputChange} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', color: '#FFF', outline: 'none', marginBottom: 8 }} />
                                                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                                        <input type="range" min="10" max="100" value={formData.skill3Level} onChange={(e) => handleSliderChange('skill3Level', parseInt(e.target.value))} style={{ flex: 1, accentColor: 'var(--nya-ochre)' }} />
                                                        <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', width: 30 }}>{formData.skill3Level}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 3: Parcours */}
                                    {step === 3 && (
                                        <motion.div key="step-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                            <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <Briefcase size={18} className="text-ochre" /> 3. Expérience & Études
                                            </h3>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                                <div>
                                                    <label className="accent-label" style={{ marginBottom: 6, display: 'block' }}>Poste</label>
                                                    <input name="experienceTitle" value={formData.experienceTitle} onChange={handleInputChange} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', color: '#FFF', outline: 'none' }} />
                                                </div>
                                                <div>
                                                    <label className="accent-label" style={{ marginBottom: 6, display: 'block' }}>Entreprise</label>
                                                    <input name="experienceCompany" value={formData.experienceCompany} onChange={handleInputChange} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', color: '#FFF', outline: 'none' }} />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="accent-label" style={{ marginBottom: 6, display: 'block' }}>Durée (e.g. 2022 - Présent)</label>
                                                <input name="experienceDuration" value={formData.experienceDuration} onChange={handleInputChange} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', color: '#FFF', outline: 'none' }} />
                                            </div>
                                            <div>
                                                <label className="accent-label" style={{ marginBottom: 6, display: 'block' }}>Description des accomplissements</label>
                                                <textarea name="experienceDesc" rows={3} value={formData.experienceDesc} onChange={handleInputChange} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', color: '#FFF', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-body)', fontSize: '0.85rem', lineHeight: 1.5 }} />
                                            </div>
                                            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
                                                <label className="accent-label" style={{ marginBottom: 6, display: 'block' }}>Études / Diplôme le plus élevé</label>
                                                <input name="education" value={formData.education} onChange={handleInputChange} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', color: '#FFF', outline: 'none' }} />
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 4: Theme/Style Selector */}
                                    {step === 4 && (
                                        <motion.div key="step-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                            <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <Palette size={18} className="text-ochre" /> 4. Style d'Initiation
                                            </h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                                {themes.map((t) => (
                                                    <button
                                                        key={t.id}
                                                        onClick={() => setActiveTheme(t)}
                                                        style={{
                                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                            width: '100%', padding: 16, borderRadius: 'var(--radius-lg, 12px)',
                                                            border: '1px solid',
                                                            borderColor: activeTheme.id === t.id ? 'var(--nya-ochre)' : 'var(--border-subtle)',
                                                            background: activeTheme.id === t.id ? 'rgba(184,92,46,0.1)' : 'var(--bg-primary)',
                                                            color: '#FFF', cursor: 'pointer', transition: 'all 0.3s',
                                                            textAlign: 'left'
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                                                            <div style={{ width: 20, height: 20, borderRadius: '50%', background: t.bg, border: `2px solid ${t.color}` }} />
                                                            <div>
                                                                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 900 }}>{t.name}</span>
                                                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Cosmologie: {t.id === 'sirius-noir' ? 'Sombre Cosmique' : t.id === 'nommo-tech' ? 'Cyan Numérique' : 'Beige Ancestral'}</div>
                                                            </div>
                                                        </div>
                                                        {activeTheme.id === t.id && <Check size={18} style={{ color: 'var(--nya-ochre)' }} />}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Wizard Footer Navigation Buttons */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                                <button
                                    onClick={() => setStep(prev => Math.max(1, prev - 1))}
                                    disabled={step === 1}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 8,
                                        padding: '10px 20px', borderRadius: 'var(--radius-pill, 20px)',
                                        background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)',
                                        color: step === 1 ? 'var(--text-faint)' : '#FFF',
                                        cursor: step === 1 ? 'not-allowed' : 'pointer', fontSize: '0.75rem', fontWeight: 800,
                                        fontFamily: 'var(--font-body)', transition: 'all 0.3s'
                                    }}
                                >
                                    <ArrowLeft size={12} /> Précédent
                                </button>
                                {step < 4 ? (
                                    <button
                                        onClick={() => setStep(prev => Math.min(4, prev + 1))}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 8,
                                            padding: '10px 24px', borderRadius: 'var(--radius-pill, 20px)',
                                            background: 'var(--nya-ochre)', border: 'none',
                                            color: '#FFF', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 800,
                                            fontFamily: 'var(--font-body)', transition: 'all 0.3s',
                                            boxShadow: '0 4px 15px rgba(184,92,46,0.3)'
                                        }}
                                    >
                                        Suivant <ArrowRight size={12} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleExport}
                                        disabled={isExporting}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 8,
                                            padding: '10px 24px', borderRadius: 'var(--radius-pill, 20px)',
                                            background: 'linear-gradient(135deg, var(--nya-gold), var(--nya-ochre))', border: 'none',
                                            color: '#FFF', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 800,
                                            fontFamily: 'var(--font-body)', transition: 'all 0.3s',
                                            boxShadow: '0 4px 15px rgba(212,160,23,0.3)'
                                        }}
                                    >
                                        {isExporting ? <RefreshCw size={12} className="animate-spin" /> : <Download size={12} />}
                                        EXPORTER LE SCEAU (PDF)
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Live CV Preview Card */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div className="accent-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Layout size={14} style={{ color: 'var(--nya-ochre)' }} />
                                APERÇU EN DIRECT DU SCEAU
                            </div>
                            
                            {/* The CV sheet */}
                            <motion.div
                                layout
                                id="cv-preview-sheet"
                                style={{
                                    background: activeTheme.bg,
                                    color: activeTheme.text,
                                    border: `1px solid ${activeTheme.border}`,
                                    borderRadius: 'var(--radius-xl, 20px)',
                                    boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                                    padding: '40px 32px',
                                    minHeight: '600px',
                                    fontFamily: activeTheme.font,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 28,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: 'background 0.5s, color 0.5s, border-color 0.5s'
                                }}
                            >
                                {/* Decorative grid background for Nommo Tech */}
                                {activeTheme.id === 'nommo-tech' && (
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        backgroundImage: 'radial-gradient(rgba(0, 229, 160, 0.04) 1px, transparent 1px)',
                                        backgroundSize: '16px 16px', pointerEvents: 'none'
                                    }} />
                                )}

                                {/* Header Section */}
                                <div style={{ borderBottom: `2px solid ${activeTheme.color}`, paddingBottom: 20 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h2 style={{
                                                fontSize: '1.6rem', fontWeight: 900,
                                                letterSpacing: '-0.02em', textTransform: 'uppercase',
                                                margin: 0, color: activeTheme.id === 'amma-gold' ? activeTheme.accent : '#FFF'
                                            }}>
                                                {formData.name || 'NOM DU SCRIBE'}
                                            </h2>
                                            <div style={{
                                                fontSize: '0.85rem', fontWeight: 700,
                                                color: activeTheme.id === 'nommo-tech' ? activeTheme.color : 'var(--nya-ochre)',
                                                marginTop: 4, letterSpacing: '0.1em', textTransform: 'uppercase'
                                            }}>
                                                {formData.title || 'TITRE PROFESSIONNEL'}
                                            </div>
                                        </div>

                                        {/* Symbolic Watermark Sceau icon */}
                                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ opacity: 0.2, color: activeTheme.color }}>
                                            <path d="M20 2 L38 20 L20 38 L2 20 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                            <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="1" />
                                            <path d="M20 10 L20 30 M10 20 L30 20" stroke="currentColor" strokeWidth="1" />
                                        </svg>
                                    </div>

                                    {/* Sub-contacts */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16, fontSize: '0.7rem', color: activeTheme.id === 'amma-gold' ? '#5a3e2b' : 'var(--text-muted)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Mail size={12} style={{ color: activeTheme.color }} />
                                            {formData.email}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Phone size={12} style={{ color: activeTheme.color }} />
                                            {formData.phone}
                                        </div>
                                    </div>
                                </div>

                                {/* Summary */}
                                <div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: activeTheme.color, marginBottom: 8 }}>
                                        SYNTHÈSE DU SCEAU
                                    </div>
                                    <p style={{ fontSize: '0.8rem', lineHeight: 1.6, margin: 0, opacity: 0.85 }}>
                                        {formData.bio}
                                    </p>
                                </div>

                                {/* Skills */}
                                <div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: activeTheme.color, marginBottom: 12 }}>
                                        COMPÉTENCES CLÉS
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        {[
                                            { label: formData.skill1, val: formData.skill1Level },
                                            { label: formData.skill2, val: formData.skill2Level },
                                            { label: formData.skill3, val: formData.skill3Level },
                                        ].map((sk, idx) => (
                                            <div key={idx}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: 4 }}>
                                                    <span>{sk.label || 'Compétence'}</span>
                                                    <span>{sk.val}%</span>
                                                </div>
                                                <div style={{ height: 6, background: activeTheme.id === 'amma-gold' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${sk.val}%` }}
                                                        transition={{ duration: 0.5 }}
                                                        style={{ height: '100%', background: `linear-gradient(90deg, ${activeTheme.color}, ${activeTheme.accent})`, borderRadius: 3 }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Experience */}
                                <div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: activeTheme.color, marginBottom: 12 }}>
                                        PARCOURS INITIATIQUE
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                                <div style={{ fontSize: '0.85rem', fontWeight: 900 }}>
                                                    {formData.experienceTitle}
                                                </div>
                                                <span style={{ fontSize: '0.7rem', color: activeTheme.color, fontWeight: 700 }}>
                                                    {formData.experienceDuration}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.7, marginTop: 2 }}>
                                                {formData.experienceCompany}
                                            </div>
                                            <p style={{ fontSize: '0.75rem', lineHeight: 1.5, marginTop: 8, marginBottom: 0, opacity: 0.8 }}>
                                                {formData.experienceDesc}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Education */}
                                <div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: activeTheme.color, marginBottom: 8 }}>
                                        DIPLÔMES & INITIATION
                                    </div>
                                    <p style={{ fontSize: '0.75rem', margin: 0, fontWeight: 700, opacity: 0.9 }}>
                                        {formData.education}
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
            <div className="grain-overlay" />
        </div>
    )
}

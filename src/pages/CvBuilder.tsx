import { motion } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { FileText, Download, Sparkles, Palette, Type, Layout } from 'lucide-react'

const steps = [
    { icon: Type, title: 'Informations', desc: 'Renseignez vos coordonnées, expériences et compétences.' },
    { icon: Palette, title: "Style d'Initiation", desc: "Choisissez parmi 8 templates cosmiques afrofuturistes." },
    { icon: Sparkles, title: 'Génération IA', desc: "L'Oracle Sirius optimise votre contenu pour maximiser l'impact." },
    { icon: Download, title: 'Export Sacré', desc: 'Téléchargez votre CV en PDF haute qualité, prêt à conquérir.' },
]

const templates = ['Sirius Noir', 'Dogon Classique', 'Nommo Tech', 'Bandiagara Pro', 'Kanaga Minimal', 'Falaise Bold', 'Amma Soft', 'Oracle Gold']

export default function CvBuilder() {
    return (
        <div>
            <Navbar />

            <section className="section-full" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="cosmo-label" style={{ justifyContent: 'center', marginBottom: 24 }}>SCEAU DU DESTIN</div>
                    <h1 style={{ marginBottom: 32 }}>FORGEZ VOTRE<br />IDENTITÉ</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: 600, margin: '0 auto' }}>
                        Créez un CV professionnel propulsé par l'IA Oracle Sirius. Votre passeport vers l'excellence.
                    </p>
                </motion.div>
            </section>

            {/* Steps */}
            <section className="section-full section-dark">
                <div className="max-w-container">
                    <div className="cosmo-label" style={{ marginBottom: 24 }}>PROCESSUS D'INITIATION</div>
                    <h2 style={{ marginBottom: 48 }}>4 ÉTAPES <span className="text-ochre">SACRÉES</span></h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
                        {steps.map((s, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="service-card">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(184,92,46,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '0.9rem', color: 'var(--nya-ochre)' }}>{i + 1}</div>
                                    <s.icon size={20} style={{ color: 'var(--nya-ochre)' }} />
                                </div>
                                <div className="card-title" style={{ fontSize: '1rem' }}>{s.title}</div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.6, marginTop: 8 }}>{s.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Templates */}
            <section className="section-full">
                <div className="max-w-container">
                    <div className="cosmo-label" style={{ marginBottom: 24 }}>TEMPLATES COSMIQUES</div>
                    <h2 style={{ marginBottom: 48 }}>CHOISISSEZ <span className="text-ochre">VOTRE STYLE</span></h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                        {templates.map((t, i) => (
                            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                                whileHover={{ scale: 1.05, borderColor: 'var(--border-ochre)' }}
                                style={{ padding: '32px 24px', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }}>
                                <Layout size={24} style={{ color: 'var(--nya-ochre)', marginBottom: 12 }} />
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 900 }}>{t}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-full section-dark" style={{ textAlign: 'center' }}>
                <div className="max-w-container max-w-narrow mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h3 style={{ marginBottom: 24 }}>PRÊT À <span className="text-ochre">FORGER</span> ?</h3>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary">
                            <FileText size={16} /> CRÉER MON CV MAINTENANT
                        </motion.button>
                    </motion.div>
                </div>
            </section>

            <Footer />
            <div className="grain-overlay" />
        </div>
    )
}

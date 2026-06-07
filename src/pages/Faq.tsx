import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import ScrollProgress from '../components/animations/ScrollProgress'

const faqCategories = [
    {
        title: 'Général',
        items: [
            { q: 'Qu\'est-ce que NYA BLO ?', a: 'NYA BLO est un écosystème numérique africain tout-en-un. Il regroupe un marketplace, un service VTC, une plateforme d\'apprentissage, un service immobilier, un espace santé, et bien d\'autres modules — le tout inspiré de la cosmogonie Dogon.' },
            { q: 'NYA BLO est-il gratuit ?', a: 'L\'accès de base à NYA BLO est entièrement gratuit. Des formules Premium et Business sont disponibles pour les utilisateurs et entreprises souhaitant accéder à des fonctionnalités avancées (voir notre page Tarification).' },
            { q: 'Dans quels pays NYA BLO est-il disponible ?', a: 'NYA BLO est actuellement disponible en Côte d\'Ivoire avec une expansion prévue vers le Sénégal, le Mali, le Burkina Faso et la Guinée courant 2026-2027.' },
        ],
    },
    {
        title: 'Compte & Sécurité',
        items: [
            { q: 'Mes données sont-elles protégées ?', a: 'Absolument. NYA BLO utilise un chiffrement TLS/SSL, ne vend jamais vos données à des tiers, et respecte les réglementations sur la protection des données personnelles en Côte d\'Ivoire.' },
            { q: 'Comment créer un compte ?', a: 'Cliquez sur "NEXUS PORTAL" dans la barre de navigation, puis choisissez "Créer un compte". Vous pouvez vous inscrire avec votre email ou votre numéro de téléphone.' },
            { q: 'J\'ai oublié mon mot de passe', a: 'Sur la page de connexion, cliquez sur "Mot de passe oublié". Un lien de réinitialisation sera envoyé à votre adresse email enregistrée.' },
        ],
    },
    {
        title: 'VTC Sirius',
        items: [
            { q: 'Comment devenir chauffeur VTC Sirius ?', a: 'Rendez-vous sur la page VTC et remplissez le formulaire d\'inscription chauffeur. Après vérification de vos documents et une courte formation, vous serez certifié Sirius.' },
            { q: 'Comment payer ma course ?', a: 'Nous acceptons le paiement Mobile Money (Orange Money, MTN Money, Wave), les cartes bancaires et le paiement en espèces.' },
            { q: 'Puis-je réserver à l\'avance ?', a: 'Oui, vous pouvez réserver un trajet jusqu\'à 7 jours à l\'avance. Une notification vous sera envoyée 15 minutes avant le départ.' },
        ],
    },
    {
        title: 'Market & Paiements',
        items: [
            { q: 'Comment vendre sur le Market ?', a: 'Créez un compte vendeur gratuit, ajoutez vos produits avec photos et descriptions, et commencez à vendre. NYA BLO prélève une commission de 5% sur chaque vente.' },
            { q: 'Quels sont les délais de livraison ?', a: 'La livraison Sirius Express est disponible à Abidjan en 24h. Les livraisons hors Abidjan prennent 2-5 jours ouvrables selon la destination.' },
            { q: 'Les paiements sont-ils sécurisés ?', a: 'Oui, tous les paiements passent par notre passerelle sécurisée avec chiffrement SSL. Nous supportons Mobile Money, Visa, Mastercard et le virement bancaire.' },
        ],
    },
    {
        title: 'Support',
        items: [
            { q: 'Comment contacter le support ?', a: 'Vous pouvez nous joindre via WhatsApp (+225 07 08 73 68 71), par email (nyablo@outlook.com), ou directement via notre page Contact.' },
            { q: 'Quels sont les horaires du support ?', a: 'Notre support est disponible du lundi au samedi, de 8h à 22h (GMT). Le chatbot IA est disponible 24h/24.' },
        ],
    },
]

export default function Faq() {
    const [openItems, setOpenItems] = useState<Record<string, number | null>>({})
    const [searchQuery, setSearchQuery] = useState('')

    const toggleItem = (category: string, index: number) => {
        setOpenItems(prev => ({
            ...prev,
            [category]: prev[category] === index ? null : index,
        }))
    }

    const filteredCategories = faqCategories.map(cat => ({
        ...cat,
        items: cat.items.filter(
            item => item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.a.toLowerCase().includes(searchQuery.toLowerCase())
        ),
    })).filter(cat => cat.items.length > 0)

    return (
        <div style={{ position: 'relative' }}>
            <Starfield />
            <CosmicBackground />
            <ScrollProgress />
            <Navbar />

            {/* Hero */}
            <section className="section-full nebula-section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 2 }}>
                    <div className="cosmo-label" style={{ justifyContent: 'center', marginBottom: 24 }}>ORACLE DES RÉPONSES</div>
                    <h1 className="text-shimmer ochre-pulse" style={{ marginBottom: 32 }}>QUESTIONS<br />FRÉQUENTES</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: 600, margin: '0 auto 40px' }}>
                        Toutes les réponses dont vous avez besoin, centralisées dans le savoir du Nexus.
                    </p>

                    {/* Search */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '16px 28px', borderRadius: 'var(--radius-pill)',
                        background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                        maxWidth: 500, margin: '0 auto',
                    }}>
                        <Search size={16} style={{ color: 'var(--nya-ochre)', opacity: 0.6 }} />
                        <input
                            placeholder="Rechercher une question..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                background: 'none', border: 'none', outline: 'none',
                                color: 'var(--text-secondary)', fontFamily: 'var(--font-body)',
                                fontSize: '0.85rem', width: '100%',
                            }}
                        />
                    </div>
                </motion.div>
            </section>
            <div className="glow-separator" />

            {/* FAQ Content */}
            <section className="section-full">
                <div className="max-w-container" style={{ maxWidth: 800, margin: '0 auto' }}>
                    {filteredCategories.map((cat, ci) => (
                        <motion.div
                            key={cat.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: ci * 0.1 }}
                            style={{ marginBottom: 48 }}
                        >
                            <div className="accent-label" style={{ color: 'var(--nya-ochre)', marginBottom: 20, fontSize: '0.65rem' }}>
                                {cat.title.toUpperCase()}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {cat.items.map((faq, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            border: '1px solid var(--border-default)',
                                            borderRadius: 'var(--radius-lg)',
                                            overflow: 'hidden',
                                            background: 'var(--bg-card, var(--bg-surface))',
                                            transition: 'border-color 0.3s',
                                            borderColor: openItems[cat.title] === i ? 'var(--border-ochre, var(--nya-ochre))' : undefined,
                                        }}
                                    >
                                        <button
                                            onClick={() => toggleItem(cat.title, i)}
                                            style={{
                                                width: '100%', padding: '22px 24px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                fontFamily: 'var(--font-display)', fontSize: '0.95rem',
                                                fontWeight: 900, textTransform: 'uppercase',
                                                letterSpacing: '-0.01em',
                                                color: openItems[cat.title] === i ? 'var(--nya-ochre)' : 'var(--text-primary)',
                                                textAlign: 'left', gap: 16, transition: 'color 0.3s',
                                            }}
                                        >
                                            <span>{faq.q}</span>
                                            <motion.div animate={{ rotate: openItems[cat.title] === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                                <ChevronDown size={18} />
                                            </motion.div>
                                        </button>
                                        <AnimatePresence>
                                            {openItems[cat.title] === i && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                                >
                                                    <div style={{
                                                        padding: '0 24px 24px',
                                                        color: 'var(--text-muted)',
                                                        fontSize: '0.85rem',
                                                        lineHeight: 1.7,
                                                    }}>
                                                        {faq.a}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}

                    {filteredCategories.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-faint)' }}>
                            <p style={{ fontSize: '1.1rem', marginBottom: 8 }}>Aucun résultat pour "{searchQuery}"</p>
                            <p style={{ fontSize: '0.8rem' }}>Essayez un autre terme ou contactez-nous directement.</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
            <div className="grain-overlay" />
        </div>
    )
}

import { motion } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import SEOHead from '../components/SEOHead'

const sections = [
    {
        title: 'Collecte des Données',
        items: [
            'NYA BLO collecte les données personnelles que vous fournissez volontairement lors de la création de votre compte : nom, prénom, adresse email, numéro de téléphone.',
            'Des données techniques sont également collectées automatiquement : adresse IP, type de navigateur, système d\'exploitation, pages consultées, durée de visite.',
            'Pour certains services (VTC, Immobilier, Shop), des informations supplémentaires peuvent être requises : adresse postale, coordonnées bancaires (traitées par nos partenaires de paiement sécurisés).',
        ]
    },
    {
        title: 'Utilisation des Données',
        items: [
            'Fourniture et amélioration de nos services (Market, VTC, Immobilier, Académie, Santé).',
            'Personnalisation de votre expérience utilisateur au sein de l\'écosystème.',
            'Communication relative à votre compte, vos commandes et nos services.',
            'Envoi de newsletters et offres promotionnelles (avec votre consentement préalable).',
            'Analyse statistique anonymisée pour améliorer la plateforme.',
            'Prévention de la fraude et sécurisation de la plateforme.',
        ]
    },
    {
        title: 'Partage des Données',
        items: [
            'NYA BLO ne vend jamais vos données personnelles à des tiers.',
            'Vos données peuvent être partagées avec nos prestataires techniques (hébergement, paiement) dans le cadre strict de la fourniture de nos services.',
            'En cas de service VTC, vos coordonnées de prise en charge sont partagées avec le chauffeur assigné uniquement pour la durée de la course.',
            'Nous pouvons être amenés à divulguer vos données si la loi l\'exige (demande judiciaire ou administrative).',
        ]
    },
    {
        title: 'Vos Droits',
        items: [
            'Droit d\'accès : vous pouvez demander une copie de vos données personnelles.',
            'Droit de rectification : vous pouvez corriger des données inexactes ou incomplètes.',
            'Droit de suppression : vous pouvez demander l\'effacement de vos données.',
            'Droit d\'opposition : vous pouvez vous opposer au traitement de vos données à des fins de prospection.',
            'Droit à la portabilité : vous pouvez recevoir vos données dans un format structuré.',
            'Pour exercer ces droits, contactez-nous à : nyablo@outlook.com',
        ]
    },
    {
        title: 'Cookies',
        items: [
            'Cookies essentiels : nécessaires au fonctionnement de la plateforme (authentification, préférences de thème et de langue). Ils ne peuvent pas être désactivés.',
            'Cookies analytiques : nous aident à comprendre comment vous utilisez la plateforme (pages visitées, durée de session). Ces cookies sont anonymisés.',
            'Cookies de personnalisation : mémorisent vos préférences pour améliorer votre expérience (derniers modules visités, langue choisie).',
            'Vous pouvez gérer vos préférences cookies à tout moment via la bannière cookies ou les paramètres de votre navigateur.',
        ]
    },
    {
        title: 'Conservation des Données',
        items: [
            'Vos données de compte sont conservées pendant toute la durée de votre inscription, puis 3 ans après la dernière activité.',
            'Les données de transaction sont conservées 10 ans conformément aux obligations comptables.',
            'Les logs techniques sont conservés 12 mois maximum.',
            'Vous pouvez demander la suppression anticipée de vos données à tout moment.',
        ]
    },
    {
        title: 'Sécurité',
        items: [
            'NYA BLO met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données.',
            'Chiffrement TLS/SSL pour toutes les communications.',
            'Hébergement sur des serveurs sécurisés (Vercel / Infrastructure Cloud).',
            'Accès aux données strictement limité au personnel habilité.',
            'Audits de sécurité réguliers et mise à jour continue de nos systèmes.',
        ]
    },
    {
        title: 'Modifications',
        items: [
            'NYA BLO se réserve le droit de modifier cette politique de confidentialité à tout moment.',
            'Les utilisateurs seront informés de tout changement significatif par email ou notification in-app.',
            'La date de dernière mise à jour est indiquée en bas de cette page.',
            'Dernière mise à jour : Mai 2026.',
        ]
    }
]

export default function Privacy() {
    return (
        <div>
            <SEOHead
                title="Politique de Confidentialité"
                description="Politique de confidentialité de NYA BLO. Découvrez comment nous collectons, utilisons et protégeons vos données personnelles."
            />
            <Navbar />

            <section className="section-full" style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="cosmo-label" style={{ justifyContent: 'center', marginBottom: 24 }}>PROTECTION SIRIUS</div>
                    <h1 style={{ marginBottom: 24 }}>POLITIQUE DE<br />CONFIDENTIALITÉ</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.8, maxWidth: 550, margin: '0 auto' }}>
                        Chez NYA BLO, la protection de vos données est aussi sacrée que la connaissance ancestrale Dogon.
                    </p>
                </motion.div>
            </section>

            <section className="section-full section-dark">
                <div className="max-w-container" style={{ maxWidth: 800, margin: '0 auto' }}>
                    {sections.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            style={{ marginBottom: 48, paddingBottom: 48, borderBottom: '1px solid var(--border-default)' }}
                        >
                            <h3 style={{ marginBottom: 20 }}>{s.title.toUpperCase()}</h3>
                            {s.items.map((item, j) => (
                                <p key={j} style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.8, marginBottom: 8, paddingLeft: 16, borderLeft: j === 0 ? 'none' : undefined }}>
                                    {item}
                                </p>
                            ))}
                        </motion.div>
                    ))}
                </div>
            </section>

            <Footer />
            <div className="grain-overlay" />
        </div>
    )
}

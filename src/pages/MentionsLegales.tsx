import { motion } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const sections = [
    {
        title: 'Éditeur',
        items: [
            'NYA BLO SARL',
            'Société à Responsabilité Limitée au capital de 1 000 000 FCFA',
            'Siège social : Abidjan, Côte d\'Ivoire',
            'RCCM : CI-ABJ-2024-B-XXXXX',
            'Email : nyablo@outlook.com',
            'Téléphone : +225 07 08 73 68 71',
        ]
    },
    {
        title: 'Directeur de la Publication',
        items: [
            'Dr. Amadou Niamkey, Chief Visionary Officer',
        ]
    },
    {
        title: 'Hébergement',
        items: [
            'Vercel Inc.',
            '340 S Lemon Ave #4133, Walnut, CA 91789, USA',
            'https://vercel.com',
        ]
    },
    {
        title: 'Propriété Intellectuelle',
        items: [
            "L'ensemble du contenu du site NYA BLO (textes, images, logos, illustrations, code source) est protégé par le droit d'auteur.",
            'La marque NYA BLO, le logo Kanaga et le système Sirius sont des marques déposées.',
            "Toute reproduction, même partielle, est soumise à autorisation préalable.",
        ]
    },
    {
        title: 'Protection des Données',
        items: [
            'NYA BLO s\'engage à protéger les données personnelles de ses utilisateurs conformément à la loi ivoirienne relative à la protection des données à caractère personnel.',
            'Les données collectées sont exclusivement utilisées pour le fonctionnement des services de l\'écosystème.',
            'Aucune donnée n\'est vendue à des tiers.',
            'Vous pouvez exercer vos droits d\'accès, de rectification et de suppression en contactant nyablo@outlook.com.',
        ]
    },
    {
        title: 'Cookies',
        items: [
            'Le site utilise des cookies techniques nécessaires au bon fonctionnement des services.',
            'Des cookies analytiques sont utilisés pour améliorer l\'expérience utilisateur.',
            'Vous pouvez configurer votre navigateur pour refuser les cookies.',
        ]
    },
    {
        title: 'Limitation de Responsabilité',
        items: [
            "NYA BLO s'efforce de fournir des informations exactes, mais ne peut garantir l'absence d'erreurs.",
            "L'utilisation des services est sous la responsabilité de l'utilisateur.",
            "NYA BLO ne saurait être tenu responsable des dommages résultant de l'utilisation du site.",
        ]
    }
]

export default function MentionsLegales() {
    return (
        <div>
            <Navbar />

            <section className="section-full" style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="cosmo-label" style={{ justifyContent: 'center', marginBottom: 24 }}>DOCUMENTATION LÉGALE</div>
                    <h1 style={{ marginBottom: 32 }}>MENTIONS<br />LÉGALES</h1>
                </motion.div>
            </section>

            <section className="section-full section-dark">
                <div className="max-w-container" style={{ maxWidth: 800, margin: '0 auto' }}>
                    {sections.map((s, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                            style={{ marginBottom: 48, paddingBottom: 48, borderBottom: '1px solid var(--border-default)' }}>
                            <h3 style={{ marginBottom: 20 }}>{s.title.toUpperCase()}</h3>
                            {s.items.map((item, j) => (
                                <p key={j} style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.8, marginBottom: 8 }}>{item}</p>
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

import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Mail, Phone, Facebook, Instagram, Twitter, Linkedin, Globe, Send } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const footerModules = [
    { label: 'NYA BLO Market', path: '/shop' },
    { label: 'NYA VTC', path: '/vtc' },
    { label: 'NYA Immobilier', path: '/immobilier' },
    { label: 'Toguna Stream', path: '/media' },
    { label: 'École des Scribes', path: '/learn' },
    { label: "Soins d'Amma", path: '/health' },
]

const footerTools = [
    { label: 'Sceau du Destin (CV)', path: '/cv-builder' },
    { label: 'Lab Nommo (IA)', path: '/lab' },
    { label: 'Rêve de Nommo', path: '/reve' },
    { label: "Jeux d'Esprit", path: '/games' },
    { label: 'Tarification', path: '/pricing' },
]

const footerCompany = [
    { label: 'À Propos', path: '/about' },
    { label: 'Nos Services', path: '/services' },
    { label: 'Contact', path: '/contact' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Plan du site', path: '/sitemap' },
    { label: 'Mentions Légales', path: '/mentions-legales' },
    { label: 'Confidentialité', path: '/privacy' },
]

const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/nyablo', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com/nyablo', label: 'Instagram' },
    { icon: Twitter, href: 'https://x.com/nyablo', label: 'X (Twitter)' },
    { icon: Linkedin, href: 'https://linkedin.com/company/nyablo', label: 'LinkedIn' },
]

export default function Footer() {
    const { i18n } = useTranslation()
    const [nlEmail, setNlEmail] = useState('')
    const [nlSent, setNlSent] = useState(false)

    const toggleLanguage = () => {
        const next = i18n.language === 'fr' ? 'en' : 'fr'
        i18n.changeLanguage(next)
    }

    const handleNewsletter = (e: React.FormEvent) => {
        e.preventDefault()
        if (nlEmail && nlEmail.includes('@')) {
            setNlSent(true)
            setNlEmail('')
            setTimeout(() => setNlSent(false), 4000)
        }
    }

    return (
        <footer style={{ borderTop: '1px solid var(--border-default)', padding: '80px var(--page-padding) 40px' }}>
            <div className="max-w-container">
                {/* Top section: logo + description + contact */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 60, marginBottom: 60 }}>
                    <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: 8 }}>NYA BLO</div>
                        <div className="accent-label" style={{ marginBottom: 20 }}>ÉCOSYSTÈME SIRIUS</div>
                        <p style={{ color: 'var(--text-faint)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: 20, maxWidth: 300 }}>
                            Une cité numérique bâtie sur les piliers de l'Héritage Ancestral et de l'Innovation technologique. Connecter l'Afrique au futur.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                            <a href="mailto:nyablo@outlook.com" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--nya-ochre)', fontSize: '0.8rem', fontWeight: 600 }}>
                                <Mail size={14} /> nyablo@outlook.com
                            </a>
                            <a href="tel:+2250708736871" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--nya-ochre)', fontSize: '0.8rem', fontWeight: 600 }}>
                                <Phone size={14} /> +225 07 08 73 68 71
                            </a>
                        </div>

                        {/* Social links */}
                        <div style={{ display: 'flex', gap: 12 }}>
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    style={{
                                        width: 38, height: 38, borderRadius: '50%',
                                        background: 'var(--bg-elevated)',
                                        border: '1px solid var(--border-default)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--text-faint)',
                                        transition: 'all 0.3s ease',
                                    }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLElement).style.color = 'var(--nya-ochre)';
                                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--nya-ochre)';
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLElement).style.color = 'var(--text-faint)';
                                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)';
                                    }}
                                >
                                    <social.icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Modules */}
                    <div>
                        <div className="accent-label" style={{ marginBottom: 16 }}>MODULES</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {footerModules.map((item) => (
                                <Link key={item.path} to={item.path} style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500, transition: 'color 0.2s' }}
                                    onMouseEnter={e => (e.target as HTMLElement).style.color = 'var(--nya-ochre)'}
                                    onMouseLeave={e => (e.target as HTMLElement).style.color = ''}
                                >{item.label}</Link>
                            ))}
                        </div>
                    </div>

                    {/* Outils */}
                    <div>
                        <div className="accent-label" style={{ marginBottom: 16 }}>OUTILS</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {footerTools.map((item) => (
                                <Link key={item.path} to={item.path} style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500, transition: 'color 0.2s' }}
                                    onMouseEnter={e => (e.target as HTMLElement).style.color = 'var(--nya-ochre)'}
                                    onMouseLeave={e => (e.target as HTMLElement).style.color = ''}
                                >{item.label}</Link>
                            ))}
                        </div>
                    </div>

                    {/* Entreprise */}
                    <div>
                        <div className="accent-label" style={{ marginBottom: 16 }}>ENTREPRISE</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {footerCompany.map((item) => (
                                <Link key={item.path} to={item.path} style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500, transition: 'color 0.2s' }}
                                    onMouseEnter={e => (e.target as HTMLElement).style.color = 'var(--nya-ochre)'}
                                    onMouseLeave={e => (e.target as HTMLElement).style.color = ''}
                                >{item.label}</Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Newsletter */}
                <div style={{
                    marginBottom: 60, padding: '40px 32px',
                    background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-xl, 20px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: 24,
                }}>
                    <div style={{ flex: '1 1 300px' }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 900, marginBottom: 6 }}>
                            REJOINDRE LA CONSTELLATION
                        </div>
                        <p style={{ color: 'var(--text-faint)', fontSize: '0.8rem', lineHeight: 1.5 }}>
                            Recevez les dernières nouvelles de l'écosystème Sirius directement dans votre boîte.
                        </p>
                    </div>
                    <form onSubmit={handleNewsletter} style={{ display: 'flex', gap: 8, flex: '1 1 300px' }}>
                        <div style={{
                            flex: 1, display: 'flex', alignItems: 'center', gap: 10,
                            padding: '14px 20px', borderRadius: 'var(--radius-pill, 50px)',
                            background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                        }}>
                            <Mail size={14} style={{ color: 'var(--nya-ochre)', opacity: 0.6, flexShrink: 0 }} />
                            <input
                                type="email"
                                value={nlEmail}
                                onChange={(e) => setNlEmail(e.target.value)}
                                placeholder="votre@email.com"
                                style={{
                                    flex: 1, background: 'none', border: 'none', outline: 'none',
                                    color: 'var(--text-secondary)', fontFamily: 'var(--font-body)',
                                    fontSize: '0.8rem', minWidth: 0,
                                }}
                            />
                        </div>
                        <button
                            type="submit"
                            style={{
                                padding: '14px 24px', borderRadius: 'var(--radius-pill, 50px)',
                                background: 'linear-gradient(135deg, var(--nya-ochre), var(--nya-ochre-dark, #8B4522))',
                                color: '#FFFFFF', border: 'none', cursor: 'pointer',
                                fontFamily: 'var(--font-body)', fontSize: '0.7rem',
                                fontWeight: 800, letterSpacing: '0.1em',
                                display: 'flex', alignItems: 'center', gap: 8,
                                boxShadow: '0 4px 16px rgba(184,92,46,0.3)',
                                whiteSpace: 'nowrap' as any,
                            }}
                        >
                            <Send size={14} />
                            {nlSent ? '✓ ENVOYÉ' : 'S\'INSCRIRE'}
                        </button>
                    </form>
                </div>

                {/* Bottom bar */}
                <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                    <p style={{ color: 'var(--text-faint)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em' }}>
                        © 2026 NYA BLO SARL • Tous droits réservés • Sirius Core v2.6.4
                    </p>

                    {/* Language selector */}
                    <button
                        onClick={toggleLanguage}
                        aria-label="Changer de langue"
                        style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '8px 16px',
                            background: 'var(--bg-elevated)',
                            border: '1px solid var(--border-default)',
                            borderRadius: 'var(--radius-pill)',
                            color: 'var(--text-faint)',
                            fontSize: '0.7rem', fontWeight: 700,
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                            cursor: 'pointer', fontFamily: 'var(--font-body)',
                            transition: 'all 0.3s',
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = 'var(--nya-ochre)';
                            (e.currentTarget as HTMLElement).style.color = 'var(--nya-ochre)';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)';
                            (e.currentTarget as HTMLElement).style.color = 'var(--text-faint)';
                        }}
                    >
                        <Globe size={14} />
                        {i18n.language === 'fr' ? 'FRANÇAIS' : 'ENGLISH'}
                    </button>
                </div>
            </div>
        </footer>
    )
}

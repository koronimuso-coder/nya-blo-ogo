import { motion } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import SEOHead from '../components/SEOHead'

interface ContactForm {
    name: string
    email: string
    subject: string
    message: string
}

const contactInfo = [
    { icon: MapPin, label: 'ADRESSE', value: 'Abidjan, Côte d\'Ivoire', href: undefined },
    { icon: Mail, label: 'EMAIL', value: 'nyablo@outlook.com', href: 'mailto:nyablo@outlook.com' },
    { icon: Phone, label: 'TÉLÉPHONE', value: '+225 07 08 73 68 71', href: 'tel:+2250708736871' },
    { icon: Clock, label: 'HORAIRES', value: 'Lun–Ven : 8h–18h (GMT)', href: undefined },
]

export default function Contact() {
    const [submitted, setSubmitted] = useState(false)
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactForm>()

    const onSubmit = async (_data: ContactForm) => {
        // Simulate submission
        await new Promise(r => setTimeout(r, 1500))
        setSubmitted(true)
        reset()
        setTimeout(() => setSubmitted(false), 5000)
    }

    return (
        <div>
            <SEOHead
                title="Contact"
                description="Contactez l'équipe NYA BLO. Nous sommes à votre écoute pour toute question sur l'écosystème Sirius."
            />
            <Navbar />

            {/* Hero */}
            <section className="section-full" style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="cosmo-label" style={{ justifyContent: 'center', marginBottom: 24 }}>NEXUS COMMUNICATION</div>
                    <h1 style={{ marginBottom: 24 }}>CONTACTEZ<br />LE NEXUS</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: 500, margin: '0 auto' }}>
                        Une question ? Un partenariat ? Notre équipe de Scribes est prête à vous répondre.
                    </p>
                </motion.div>
            </section>

            {/* Contact Form + Info */}
            <section className="section-full section-dark">
                <div className="max-w-container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 48, alignItems: 'start' }}>
                        {/* Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="toguna-glass"
                            style={{ padding: 48 }}
                        >
                            <h3 style={{ marginBottom: 8 }}>ENVOYEZ UN MESSAGE</h3>
                            <div className="accent-label" style={{ color: 'var(--nya-ochre)', marginBottom: 32 }}>
                                FORMULAIRE DE CONTACT
                            </div>

                            {submitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{ textAlign: 'center', padding: '48px 24px' }}
                                >
                                    <CheckCircle size={48} style={{ color: 'var(--nya-sirius)', marginBottom: 16 }} />
                                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: 8 }}>
                                        MESSAGE ENVOYÉ
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        Nous vous répondrons dans les plus brefs délais.
                                    </p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                    {/* Name */}
                                    <div>
                                        <label className="accent-label" style={{ display: 'block', marginBottom: 8 }}>NOM COMPLET *</label>
                                        <input
                                            {...register('name', { required: 'Le nom est requis' })}
                                            placeholder="Amadou Dogon"
                                            style={{
                                                width: '100%', padding: '14px 20px',
                                                background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                                                borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
                                                fontSize: '0.9rem', fontFamily: 'var(--font-body)',
                                                outline: 'none', transition: 'border-color 0.3s',
                                            }}
                                            onFocus={e => e.target.style.borderColor = 'var(--nya-ochre)'}
                                            onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
                                        />
                                        {errors.name && <span style={{ color: 'var(--nya-red)', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>{errors.name.message}</span>}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="accent-label" style={{ display: 'block', marginBottom: 8 }}>ADRESSE EMAIL *</label>
                                        <input
                                            {...register('email', {
                                                required: 'L\'email est requis',
                                                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email invalide' }
                                            })}
                                            type="email"
                                            placeholder="amadou@example.com"
                                            style={{
                                                width: '100%', padding: '14px 20px',
                                                background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                                                borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
                                                fontSize: '0.9rem', fontFamily: 'var(--font-body)',
                                                outline: 'none', transition: 'border-color 0.3s',
                                            }}
                                            onFocus={e => e.target.style.borderColor = 'var(--nya-ochre)'}
                                            onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
                                        />
                                        {errors.email && <span style={{ color: 'var(--nya-red)', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>{errors.email.message}</span>}
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <label className="accent-label" style={{ display: 'block', marginBottom: 8 }}>SUJET *</label>
                                        <select
                                            {...register('subject', { required: 'Le sujet est requis' })}
                                            style={{
                                                width: '100%', padding: '14px 20px',
                                                background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                                                borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
                                                fontSize: '0.9rem', fontFamily: 'var(--font-body)',
                                                outline: 'none', transition: 'border-color 0.3s',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <option value="">Sélectionnez un sujet</option>
                                            <option value="general">Question générale</option>
                                            <option value="partnership">Partenariat</option>
                                            <option value="vtc">Service VTC</option>
                                            <option value="immobilier">Immobilier</option>
                                            <option value="shop">Marketplace</option>
                                            <option value="support">Support technique</option>
                                            <option value="other">Autre</option>
                                        </select>
                                        {errors.subject && <span style={{ color: 'var(--nya-red)', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>{errors.subject.message}</span>}
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="accent-label" style={{ display: 'block', marginBottom: 8 }}>MESSAGE *</label>
                                        <textarea
                                            {...register('message', { required: 'Le message est requis', minLength: { value: 10, message: 'Minimum 10 caractères' } })}
                                            rows={5}
                                            placeholder="Décrivez votre demande..."
                                            style={{
                                                width: '100%', padding: '14px 20px',
                                                background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                                                borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
                                                fontSize: '0.9rem', fontFamily: 'var(--font-body)',
                                                outline: 'none', transition: 'border-color 0.3s',
                                                resize: 'vertical', minHeight: 120,
                                            }}
                                            onFocus={e => e.target.style.borderColor = 'var(--nya-ochre)'}
                                            onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
                                        />
                                        {errors.message && <span style={{ color: 'var(--nya-red)', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>{errors.message.message}</span>}
                                    </div>

                                    <motion.button
                                        type="submit"
                                        disabled={isSubmitting}
                                        whileHover={{ scale: 1.02, boxShadow: '0 12px 40px rgba(184,92,46,0.4)' }}
                                        whileTap={{ scale: 0.98 }}
                                        className="btn-primary"
                                        style={{ width: '100%', justifyContent: 'center', marginTop: 8, opacity: isSubmitting ? 0.7 : 1 }}
                                    >
                                        {isSubmitting ? (
                                            <>ENVOI EN COURS...</>
                                        ) : (
                                            <><Send size={16} /> ENVOYER LE MESSAGE</>
                                        )}
                                    </motion.button>
                                </form>
                            )}
                        </motion.div>

                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h3 style={{ marginBottom: 8 }}>INFORMATIONS</h3>
                            <div className="accent-label" style={{ color: 'var(--nya-ochre)', marginBottom: 32 }}>
                                COORDONNÉES SIRIUS
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                {contactInfo.map((info, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 15 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        whileHover={{ x: 6 }}
                                        style={{
                                            display: 'flex', gap: 20, alignItems: 'flex-start',
                                            padding: '24px 28px',
                                            background: 'var(--bg-card)',
                                            border: '1px solid var(--border-default)',
                                            borderRadius: 'var(--radius-lg)',
                                            transition: 'border-color 0.3s',
                                            cursor: info.href ? 'pointer' : 'default',
                                        }}
                                        onClick={() => info.href && window.open(info.href)}
                                    >
                                        <div style={{
                                            width: 44, height: 44, borderRadius: '50%',
                                            background: 'rgba(184,92,46,0.1)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0,
                                        }}>
                                            <info.icon size={20} style={{ color: 'var(--nya-ochre)' }} />
                                        </div>
                                        <div>
                                            <div className="accent-label" style={{ marginBottom: 6 }}>{info.label}</div>
                                            <div style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 600 }}>
                                                {info.value}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Map embed placeholder */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                style={{
                                    marginTop: 32,
                                    borderRadius: 'var(--radius-lg)',
                                    overflow: 'hidden',
                                    border: '1px solid var(--border-default)',
                                    height: 220,
                                    position: 'relative',
                                    background: 'var(--bg-surface)',
                                }}
                            >
                                <iframe
                                    title="NYA BLO - Abidjan"
                                    src="https://www.openstreetmap.org/export/embed.html?bbox=-4.05%2C5.3%2C-3.9%2C5.4&layer=mapnik"
                                    style={{ width: '100%', height: '100%', border: 'none', filter: 'saturate(0.3) contrast(1.1)' }}
                                    loading="lazy"
                                />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
            <div className="grain-overlay" />
        </div>
    )
}

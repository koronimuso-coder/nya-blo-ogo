import { motion } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import ScrollProgress from '../components/animations/ScrollProgress'
import { Car, MapPin, Clock, Shield, Star, Phone, ArrowUpRight, Fuel } from 'lucide-react'

const routes = [
  { from: 'Cocody', to: 'Plateau', price: '2 500', time: '15 min', gradient: 'linear-gradient(135deg, #0a0a2e 0%, #00CED1 100%)', popular: true },
  { from: 'Yopougon', to: 'Marcory', price: '3 500', time: '25 min', gradient: 'linear-gradient(135deg, #1a0a2e 0%, #a78bfa 100%)', popular: false },
  { from: 'Abobo', to: 'Treichville', price: '4 000', time: '30 min', gradient: 'linear-gradient(135deg, #2e0a1a 0%, #ef4444 100%)', popular: false },
  { from: 'Riviera', to: 'Angré', price: '1 500', time: '10 min', gradient: 'linear-gradient(135deg, #0a2e0a 0%, #00E5A0 100%)', popular: true },
  { from: 'Adjamé', to: 'Zone 4', price: '3 000', time: '20 min', gradient: 'linear-gradient(135deg, #2e1a0a 0%, #D4A017 100%)', popular: false },
  { from: 'Bingerville', to: 'Cocody', price: '3 500', time: '25 min', gradient: 'linear-gradient(135deg, #0a1a2e 0%, #3b82f6 100%)', popular: false },
]

const features = [
  { icon: Shield, title: 'Chauffeurs Certifiés', desc: 'Formation Sirius + vérification biométrique' },
  { icon: Clock, title: 'Arrivée en 2 min', desc: 'IA prédictive de positionnement' },
  { icon: Star, title: '4.9★ Satisfaction', desc: 'Notés par 10K+ passagers' },
  { icon: Fuel, title: 'Véhicules Premium', desc: 'Climatisation + Wi-Fi gratuit' },
]

export default function Vtc() {
  return (
    <div style={{ position: 'relative' }}>
      <Starfield />
      <CosmicBackground />
      <ScrollProgress />
      <Navbar />

      {/* Hero with booking form */}
      <section className="section-full nebula-section" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center' }}>
        <div className="max-w-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="cosmo-label" style={{ marginBottom: 24 }}>TRANSPORT SIRIUS</div>
            <h1 className="text-shimmer ochre-pulse" style={{ marginBottom: 32 }}>DÉPLACEZ-VOUS<br />LIBREMENT</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: 500, marginBottom: 40 }}>
              VTC premium avec chauffeurs certifiés Sirius. Voyagez en sécurité et en style dans tout Abidjan.
            </p>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {[{ val: '500+', label: 'CHAUFFEURS' }, { val: '2 min', label: 'TEMPS D\'ARRIVÉE' }, { val: '4.9★', label: 'SATISFACTION' }].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.15 }}>
                  <div className="stat-number" style={{ fontSize: '1.5rem' }}>{s.val}</div>
                  <div className="accent-label">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Booking card */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="toguna-glass" style={{ padding: 40 }}>
            <h3 style={{ marginBottom: 8, fontSize: '1.3rem' }}>RÉSERVER UN TRAJET</h3>
            <div className="accent-label" style={{ color: 'var(--nya-ochre)', marginBottom: 32 }}>TRANSFERT SIRIUS</div>

            {[{ label: 'POINT DE DÉPART', placeholder: 'Ex: Cocody Riviera' }, { label: 'DESTINATION', placeholder: 'Ex: Plateau Centre' }].map((field, i) => (
              <div key={i} style={{ marginBottom: 20 }}>
                <label style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.2em', color: 'var(--text-faint)', display: 'block', marginBottom: 8 }}>{field.label}</label>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px',
                  borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                }}>
                  <MapPin size={16} style={{ color: 'var(--nya-ochre)', opacity: 0.6 }} />
                  <input placeholder={field.placeholder} style={{
                    background: 'none', border: 'none', outline: 'none', width: '100%',
                    color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontSize: '0.85rem',
                  }} />
                </div>
              </div>
            ))}

            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>
              <Car size={16} /> COMMANDER MAINTENANT
            </motion.button>
          </motion.div>
        </div>
      </section>
      <div className="glow-separator" />

      {/* Features */}
      <section style={{ padding: '60px var(--page-padding)' }}>
        <div className="max-w-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, borderColor: 'var(--border-ochre)' }}
              style={{
                padding: 32, background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)',
                transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
              }}>
              <f.icon size={24} style={{ color: 'var(--nya-ochre)', marginBottom: 16 }} />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 900, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-faint)', lineHeight: 1.5 }}>{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>
      <div className="glow-separator" />

      {/* Routes */}
      <section className="section-full section-dark nebula-section">
        <div className="max-w-container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="cosmo-label" style={{ marginBottom: 24 }}>ITINÉRAIRES FRÉQUENTS</div>
          <h2 style={{ marginBottom: 48 }}>TRAJETS <span className="text-ochre">POPULAIRES</span></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
            {routes.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -8, boxShadow: 'var(--shadow-hover)' }}
                style={{
                  borderRadius: 'var(--radius-xl)', overflow: 'hidden',
                  background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                  cursor: 'pointer', transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                <div style={{ height: 100, background: r.gradient, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Car size={32} style={{ color: 'var(--icon-watermark)' }} />
                  {r.popular && (
                    <div style={{
                      position: 'absolute', top: 12, right: 12,
                      padding: '4px 14px', borderRadius: 'var(--radius-pill)',
                      background: 'var(--nya-ochre)', fontSize: '0.55rem', fontWeight: 900,
                      letterSpacing: '0.15em', color: 'white',
                    }}>★ POPULAIRE</div>
                  )}
                </div>
                <div style={{ padding: '24px 28px 28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 900 }}>{r.from}</span>
                    <ArrowUpRight size={16} style={{ color: 'var(--nya-ochre)', transform: 'rotate(45deg)' }} />
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 900 }}>{r.to}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900, color: 'var(--nya-ochre)' }}>{r.price}</span>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-faint)', marginLeft: 4 }}>FCFA</span>
                    </div>
                    <span className="accent-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={10} /> {r.time}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Driver */}
      <div className="dogon-border" />
      <section style={{ padding: '80px var(--page-padding)', textAlign: 'center' }}>
        <div className="max-w-container max-w-narrow mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 style={{ marginBottom: 16 }}>DEVENIR <span className="text-ochre">CHAUFFEUR SIRIUS</span></h3>
            <p style={{ color: 'var(--text-faint)', marginBottom: 32, lineHeight: 1.8 }}>
              Rejoignez les 500+ chauffeurs certifiés. Revenus garantis, assurance incluse, formation gratuite.
            </p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary">
              <Phone size={14} /> POSTULER MAINTENANT
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer />
      <div className="grain-overlay" />
    </div>
  )
}

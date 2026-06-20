import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { useNotificationStore } from '../stores/notificationStore'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Starfield from '../components/animations/Starfield'
import CosmicBackground from '../components/animations/CosmicBackground'
import ScrollProgress from '../components/animations/ScrollProgress'
import { Car, MapPin, Clock, Shield, Star, Phone, ArrowUpRight, Fuel, Compass } from 'lucide-react'

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
  const { user, addTransaction } = useAuthStore()
  const { push } = useNotificationStore()

  const [fromLoc, setFromLoc] = useState('')
  const [toLoc, setToLoc] = useState('')
  const [bookingState, setBookingState] = useState<'idle' | 'searching' | 'assigned' | 'riding' | 'completed'>('idle')
  const driver = { name: 'Kouassi Yao', car: 'Sirius Sedan Noire', plate: 'CI-01-A123' }
  const mapCanvasRef = useRef<HTMLCanvasElement>(null)

  // Map route animation simulation
  useEffect(() => {
    if (bookingState === 'idle' || bookingState === 'searching') return
    const canvas = mapCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let progress = 0

    // Draw route path
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw stylized road grid
      ctx.strokeStyle = 'rgba(255,255,255,0.05)'
      ctx.lineWidth = 2
      for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, canvas.height)
        ctx.stroke()
      }
      for (let j = 0; j < canvas.height; j += 30) {
        ctx.beginPath()
        ctx.moveTo(0, j)
        ctx.lineTo(canvas.width, j)
        ctx.stroke()
      }

      // Draw route path
      ctx.strokeStyle = 'var(--nya-ochre)'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(40, 150)
      ctx.quadraticCurveTo(150, 40, 260, 150)
      ctx.stroke()

      // Pin A
      ctx.fillStyle = '#00E5A0'
      ctx.beginPath()
      ctx.arc(40, 150, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#fff'
      ctx.font = '9px Arial'
      ctx.fillText('Départ', 28, 170)

      // Pin B
      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.arc(260, 150, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#fff'
      ctx.fillText('Arrivée', 246, 170)

      // Moving VTC car
      const t = progress / 100
      // Bezier point calculation
      const mx = (1 - t) * (1 - t) * 40 + 2 * (1 - t) * t * 150 + t * t * 260
      const my = (1 - t) * (1 - t) * 150 + 2 * (1 - t) * t * 40 + t * t * 150

      ctx.fillStyle = 'var(--nya-gold)'
      ctx.beginPath()
      ctx.arc(mx, my, 10, 0, Math.PI * 2)
      ctx.fill()
      // Glowing halo
      ctx.strokeStyle = 'rgba(212,160,23,0.4)'
      ctx.lineWidth = 6
      ctx.stroke()

      if (bookingState === 'riding') {
        progress += 0.5
        if (progress >= 100) {
          setBookingState('completed')
          // Deduct cost and save transaction
          const fare = 25
          addTransaction(`Trajet VTC: ${fromLoc} ➔ ${toLoc}`, fare, 'debit')
          push({
            type: 'reward',
            title: 'Course Terminée',
            message: `Vous êtes arrivé ! ${fare} Nya Coins déduits.`,
            icon: '🚕',
            color: '#00E5A0'
          })
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [bookingState])

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fromLoc || !toLoc) return

    setBookingState('searching')

    // Find driver
    setTimeout(() => {
      setBookingState('assigned')
      setTimeout(() => {
        setBookingState('riding')
      }, 2500)
    }, 2000)
  }

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

          {/* Booking / Map card */}
          <div style={{ perspective: 1000 }}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3 }}
              className="toguna-glass" 
              style={{ padding: 32, minHeight: 460, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <AnimatePresence mode="wait">
                {bookingState === 'idle' && (
                  <motion.form 
                    key="booking-form"
                    onSubmit={handleBooking}
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}
                  >
                    <div>
                      <h3 style={{ marginBottom: 4, fontSize: '1.2rem', color: '#fff' }}>RÉSERVER UN TRAJET</h3>
                      <div className="accent-label" style={{ color: 'var(--nya-ochre)', marginBottom: 20 }}>TRANSFERT SIRIUS</div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.2em', color: 'var(--text-faint)', display: 'block', marginBottom: 8 }}>POINT DE DÉPART</label>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px',
                        borderRadius: '12px', background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                      }}>
                        <MapPin size={16} style={{ color: 'var(--nya-ochre)', opacity: 0.6 }} />
                        <input 
                          value={fromLoc}
                          onChange={(e) => setFromLoc(e.target.value)}
                          placeholder="Ex: Cocody Riviera" 
                          required
                          style={{
                            background: 'none', border: 'none', outline: 'none', width: '100%',
                            color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontSize: '0.85rem',
                          }} 
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.2em', color: 'var(--text-faint)', display: 'block', marginBottom: 8 }}>DESTINATAIRE</label>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px',
                        borderRadius: '12px', background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                      }}>
                        <MapPin size={16} style={{ color: 'var(--nya-ochre)', opacity: 0.6 }} />
                        <input 
                          value={toLoc}
                          onChange={(e) => setToLoc(e.target.value)}
                          placeholder="Ex: Plateau Centre" 
                          required
                          style={{
                            background: 'none', border: 'none', outline: 'none', width: '100%',
                            color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontSize: '0.85rem',
                          }} 
                        />
                      </div>
                    </div>

                    {user && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(212,160,23,0.05)', border: '1px solid rgba(212,160,23,0.2)', padding: '12px 16px', borderRadius: 12, fontSize: '0.75rem', color: 'var(--nya-gold)' }}>
                        <Compass size={16} /> Solde: {user.nyaCoins} Coins. Tarif trajet fixe: 25 Coins (2500 FCFA).
                      </div>
                    )}

                    <motion.button 
                      whileHover={{ scale: 1.02 }} 
                      whileTap={{ scale: 0.98 }} 
                      type="submit"
                      className="btn-primary" 
                      style={{ width: '100%', justifyContent: 'center', marginTop: 12, padding: 14 }}
                    >
                      <Car size={16} /> COMMANDER MAINTENANT
                    </motion.button>
                  </motion.form>
                )}

                {bookingState === 'searching' && (
                  <motion.div 
                    key="searching-state"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    style={{ textAlign: 'center', padding: '60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}
                  >
                    <div style={{ position: 'relative' }}>
                      <div style={{ width: 80, height: 80, border: '3px solid rgba(184,92,46,0.2)', borderTop: '3px solid var(--nya-ochre)', borderRadius: '50%', animation: 'spin 1.5s linear infinite' }} />
                      <Car size={32} style={{ position: 'absolute', top: 24, left: 24, color: 'var(--nya-ochre)', animation: 'pulse 1.5s infinite' }} />
                    </div>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>INVOCATION CHAUFFEUR</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>Recherche d'un chauffeur certifié à proximité de {fromLoc}...</p>
                    </div>
                  </motion.div>
                )}

                {bookingState === 'assigned' && (
                  <motion.div 
                    key="assigned-state"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
                  >
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 900, color: '#00E5A0' }}>CHAUFFEUR ASSIGNÉ !</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Arrivée du véhicule dans 2 minutes.</p>
                    </div>

                    <div style={{ display: 'flex', gap: 16, background: 'var(--bg-surface)', padding: 16, borderRadius: 16, border: '1px solid var(--border-default)' }}>
                      <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--nya-ochre)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>👨‍✈️</div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>{driver.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', marginTop: 2 }}>{driver.car} • {driver.plate}</div>
                      </div>
                    </div>

                    <canvas ref={mapCanvasRef} width={300} height={200} style={{ background: 'var(--bg-primary)', borderRadius: 16, width: '100%', border: '1px solid var(--border-subtle)' }} />
                  </motion.div>
                )}

                {bookingState === 'riding' && (
                  <motion.div 
                    key="riding-state"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
                  >
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 900, color: 'var(--nya-gold)' }}>TRAJET EN COURS...</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Navigation par portail Sirius vers {toLoc}.</p>
                    </div>

                    <canvas ref={mapCanvasRef} width={300} height={200} style={{ background: 'var(--bg-primary)', borderRadius: 16, width: '100%', border: '1px solid var(--border-subtle)' }} />
                  </motion.div>
                )}

                {bookingState === 'completed' && (
                  <motion.div 
                    key="completed-state"
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0 }}
                    style={{ textAlign: 'center', padding: '30px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}
                  >
                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(0,229,160,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00E5A0' }}>
                      <Shield size={32} />
                    </div>
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 900, color: '#00E5A0' }}>COURSE ACHEVÉE !</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 8 }}>Vous êtes bien arrivé à destination.</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-faint)', marginTop: 4 }}>Facture de 25 Coins payée via Sirius Wallet.</p>
                    </div>

                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setBookingState('idle'); setFromLoc(''); setToLoc('') }}
                      style={{
                        padding: '10px 24px', borderRadius: 20,
                        background: 'var(--nya-ochre)', border: 'none',
                        color: '#fff', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer'
                      }}
                    >
                      COMMANDER UN AUTRE TRAJET
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
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
                onClick={() => { setFromLoc(r.from); setToLoc(r.to); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
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

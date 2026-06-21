import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'

/**
 * CartDrawer — Animated cart side panel
 */
export default function CartDrawer() {
    const { items, isCartOpen, closeCart, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCartStore()
    const { checkoutCart, user } = useAuthStore()

    const [checkoutOpen, setCheckoutOpen] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [success, setSuccess] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'momo'>('card')
    const [momoProvider, setMomoProvider] = useState<'wave' | 'orange' | 'mtn'>('wave')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [otpCode, setOtpCode] = useState('')
    const [processingMessage, setProcessingMessage] = useState('SCULPTURE DU PORTAIL...')

    const formatPrice = (n: number) => n.toLocaleString('fr-FR') + ' FCFA'

    const handleMomoProviderChange = (provider: 'wave' | 'orange' | 'mtn') => {
        setMomoProvider(provider)
        if (provider === 'wave' || provider === 'orange') {
            setPhoneNumber('+2250708736871')
        } else if (provider === 'mtn') {
            setPhoneNumber('+2250556966492')
        }
    }

    const handleCheckoutInit = () => {
        setCheckoutOpen(true)
        closeCart()
        if (momoProvider === 'wave' || momoProvider === 'orange') {
            setPhoneNumber('+2250708736871')
        } else {
            setPhoneNumber('+2250556966492')
        }
        setOtpCode('')
    }

    const confirmOrder = () => {
        setProcessing(true)
        if (paymentMethod === 'card') {
            setProcessingMessage('SCULPTURE DU PORTAIL...')
            setTimeout(() => {
                setProcessing(false)
                setSuccess(true)
                checkoutCart(items)
                clearCart()
            }, 2200)
        } else {
            if (momoProvider === 'wave') {
                setProcessingMessage('ENVOI NOTIFICATION WAVE...')
                setTimeout(() => {
                    setProcessingMessage('ATTENTE DE VALIDATION SUR L\'APP WAVE...')
                    setTimeout(() => {
                        setProcessing(false)
                        setSuccess(true)
                        checkoutCart(items)
                        clearCart()
                    }, 1500)
                }, 1200)
            } else if (momoProvider === 'orange') {
                setProcessingMessage('VÉRIFICATION CODE OTP ORANGE (*144*82#)...')
                setTimeout(() => {
                    setProcessingMessage('COMMUNICATION AVEC LE SERVEUR ORANGE...')
                    setTimeout(() => {
                        setProcessing(false)
                        setSuccess(true)
                        checkoutCart(items)
                        clearCart()
                    }, 1200)
                }, 1200)
            } else { // mtn
                setProcessingMessage('LANCEMENT DE L\'INVITE USSD MTN (*133#)...')
                setTimeout(() => {
                    setProcessingMessage('ATTENTE CONFIRMATION CODE PIN SUR MOBILE...')
                    setTimeout(() => {
                        setProcessing(false)
                        setSuccess(true)
                        checkoutCart(items)
                        clearCart()
                    }, 1500)
                }, 1200)
            }
        }
    }

    const closeAll = () => {
        setCheckoutOpen(false)
        setSuccess(false)
    }

    return (
        <>
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeCart}
                            style={{
                                position: 'fixed', inset: 0, zIndex: 9998,
                                background: 'rgba(0,0,0,0.5)',
                                backdropFilter: 'blur(4px)',
                            }}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            style={{
                                position: 'fixed', top: 0, right: 0, bottom: 0,
                                width: 400, maxWidth: '90vw',
                                zIndex: 9999,
                                background: 'var(--nya-deep)',
                                borderLeft: '1px solid var(--border-subtle)',
                                display: 'flex', flexDirection: 'column',
                            }}
                        >
                            {/* Header */}
                            <div style={{
                                padding: '24px 20px 16px',
                                borderBottom: '1px solid var(--border-default)',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <ShoppingBag size={18} style={{ color: 'var(--nya-ochre)' }} />
                                    <div>
                                        <div style={{
                                            fontFamily: 'var(--font-display)', fontSize: '1.1rem',
                                            fontWeight: 900, textTransform: 'uppercase',
                                            color: 'var(--text-primary)',
                                        }}>
                                            Panier Sacré
                                        </div>
                                        <div style={{
                                            fontSize: '0.65rem', fontWeight: 700,
                                            letterSpacing: '0.15em', textTransform: 'uppercase',
                                            color: 'var(--nya-ochre)',
                                        }}>
                                            {totalItems()} ARTICLE{totalItems() > 1 ? 'S' : ''}
                                        </div>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={closeCart}
                                    style={{
                                        width: 36, height: 36, borderRadius: '50%',
                                        background: 'var(--bg-elevated)',
                                        border: 'none', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--text-muted)',
                                    }}
                                >
                                    <X size={16} />
                                </motion.button>
                            </div>

                            {/* Items */}
                            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
                                {items.length === 0 ? (
                                    <div style={{
                                        padding: 60, textAlign: 'center',
                                        color: 'var(--text-faint)',
                                    }}>
                                        <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>🛒</div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Votre panier est vide</div>
                                        <div style={{ fontSize: '0.7rem', marginTop: 8, color: 'var(--text-faint)' }}>
                                            Explorez le marché pour ajouter des articles
                                        </div>
                                    </div>
                                ) : (
                                    items.map((item, i) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            style={{
                                                padding: '16px 20px',
                                                borderBottom: '1px solid var(--border-default)',
                                                display: 'flex', gap: 14,
                                            }}
                                        >
                                            {/* Product thumbnail */}
                                            <div style={{
                                                width: 56, height: 56, borderRadius: 12,
                                                background: item.gradient,
                                                flexShrink: 0,
                                            }} />

                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{
                                                    fontSize: '0.8rem', fontWeight: 700,
                                                    color: 'var(--text-primary)',
                                                    overflow: 'hidden', textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}>
                                                    {item.name}
                                                </div>
                                                <div style={{
                                                    fontSize: '0.75rem', fontWeight: 800,
                                                    color: 'var(--nya-ochre)', marginTop: 4,
                                                }}>
                                                    {item.price} FCFA
                                                </div>

                                                {/* Quantity controls */}
                                                <div style={{
                                                    display: 'flex', alignItems: 'center', gap: 8,
                                                    marginTop: 8,
                                                }}>
                                                    <motion.button
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        style={{
                                                            width: 26, height: 26, borderRadius: 6,
                                                            background: 'var(--bg-elevated)',
                                                            border: '1px solid var(--border-default)',
                                                            cursor: 'pointer',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            color: 'var(--text-muted)',
                                                        }}
                                                    >
                                                        <Minus size={12} />
                                                    </motion.button>
                                                    <span style={{
                                                        fontSize: '0.8rem', fontWeight: 800,
                                                        color: 'var(--text-primary)', minWidth: 20,
                                                        textAlign: 'center',
                                                    }}>
                                                        {item.quantity}
                                                    </span>
                                                    <motion.button
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        style={{
                                                            width: 26, height: 26, borderRadius: 6,
                                                            background: 'var(--bg-elevated)',
                                                            border: '1px solid var(--border-default)',
                                                            cursor: 'pointer',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            color: 'var(--text-muted)',
                                                        }}
                                                    >
                                                        <Plus size={12} />
                                                    </motion.button>

                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => removeItem(item.id)}
                                                        style={{
                                                            marginLeft: 'auto',
                                                            background: 'none', border: 'none',
                                                            cursor: 'pointer', color: 'var(--nya-red)',
                                                            opacity: 0.6, padding: 4,
                                                        }}
                                                    >
                                                        <Trash2 size={14} />
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>

                            {/* Footer with total */}
                            {items.length > 0 && (
                                <div style={{
                                    padding: '20px',
                                    borderTop: '1px solid var(--border-default)',
                                }}>
                                    <div style={{
                                        display: 'flex', justifyContent: 'space-between',
                                        alignItems: 'center', marginBottom: 16,
                                    }}>
                                        <span style={{
                                            fontSize: '0.7rem', fontWeight: 700,
                                            letterSpacing: '0.15em', textTransform: 'uppercase',
                                            color: 'var(--text-muted)',
                                        }}>
                                            TOTAL
                                        </span>
                                        <span style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: '1.4rem', fontWeight: 900,
                                            color: 'var(--text-primary)',
                                        }}>
                                            {formatPrice(totalPrice())}
                                        </span>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02, boxShadow: '0 12px 40px rgba(184,92,46,0.3)' }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleCheckoutInit}
                                        style={{
                                            width: '100%', padding: '16px 24px',
                                            background: 'var(--nya-ochre)',
                                            border: 'none', borderRadius: 'var(--radius-pill)',
                                            color: '#fff', cursor: 'pointer',
                                            fontFamily: 'var(--font-body)',
                                            fontSize: '0.8rem', fontWeight: 800,
                                            letterSpacing: '0.15em', textTransform: 'uppercase',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                        }}
                                    >
                                        COMMANDER <ArrowRight size={16} />
                                    </motion.button>

                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        onClick={clearCart}
                                        style={{
                                            width: '100%', padding: '10px',
                                            background: 'none', border: 'none',
                                            cursor: 'pointer', marginTop: 8,
                                            fontSize: '0.7rem', fontWeight: 700,
                                            color: 'var(--text-faint)',
                                            letterSpacing: '0.1em', textTransform: 'uppercase',
                                        }}
                                    >
                                        VIDER LE PANIER
                                    </motion.button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Interactive Checkout Modal */}
            <AnimatePresence>
                {checkoutOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeAll}
                            style={{
                                position: 'fixed', inset: 0, zIndex: 99998,
                                background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)'
                            }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            style={{
                                position: 'fixed', top: '50%', left: '50%',
                                transform: 'translate(-50%, -50%)', zIndex: 99999,
                                width: 'min(460px, 90vw)'
                            }}
                        >
                            <div style={{
                                background: 'var(--nya-deep)',
                                border: '1px solid rgba(212,160,23,0.3)',
                                borderRadius: 24, padding: 32,
                                boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
                                color: 'var(--text-primary)', textAlign: 'center',
                                position: 'relative'
                            }}>
                                <button
                                    onClick={closeAll}
                                    style={{
                                        position: 'absolute', top: 16, right: 16,
                                        background: 'none', border: 'none', color: 'var(--text-muted)',
                                        cursor: 'pointer', fontSize: '1.1rem'
                                    }}
                                >
                                    ✕
                                </button>

                                {!success ? (
                                    <>
                                        <div style={{
                                            width: 60, height: 60, borderRadius: '50%',
                                            background: 'rgba(184,92,46,0.1)', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center',
                                            margin: '0 auto 20px', color: 'var(--nya-ochre)'
                                        }}>
                                            <ShoppingBag size={28} />
                                        </div>

                                        <h3 style={{
                                            fontFamily: 'var(--font-display)', fontSize: '1.4rem',
                                            fontWeight: 900, color: '#fff', marginBottom: 12,
                                            textTransform: 'uppercase'
                                        }}>
                                            Invocation de l'Échange
                                        </h3>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
                                            Vous êtes sur le point de valider la commande de vos artefacts sacrés. La transaction sera enregistrée dans le grand registre de Sirius.
                                        </p>

                                        {/* Payment method selector */}
                                        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                                            <button
                                                type="button"
                                                disabled={processing}
                                                onClick={() => setPaymentMethod('card')}
                                                style={{
                                                    flex: 1, padding: '12px 14px', borderRadius: 12, cursor: processing ? 'not-allowed' : 'pointer',
                                                    background: paymentMethod === 'card' ? 'rgba(59,130,246,0.1)' : 'transparent',
                                                    border: '1.5px solid ' + (paymentMethod === 'card' ? 'var(--nya-gold)' : 'var(--border-subtle)'),
                                                    color: '#fff', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase'
                                                }}
                                            >
                                                💳 Carte Sirius
                                            </button>
                                            <button
                                                type="button"
                                                disabled={processing}
                                                onClick={() => { setPaymentMethod('momo'); handleMomoProviderChange(momoProvider); }}
                                                style={{
                                                    flex: 1, padding: '12px 14px', borderRadius: 12, cursor: processing ? 'not-allowed' : 'pointer',
                                                    background: paymentMethod === 'momo' ? 'rgba(239,68,68,0.1)' : 'transparent',
                                                    border: '1.5px solid ' + (paymentMethod === 'momo' ? 'var(--nya-sirius)' : 'var(--border-subtle)'),
                                                    color: '#fff', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase'
                                                }}
                                            >
                                                📱 Mobile Money
                                            </button>
                                        </div>

                                        {paymentMethod === 'card' ? (
                                            /* Card Simulator interface */
                                            <div style={{
                                                background: 'var(--bg-primary)',
                                                border: '1px solid var(--border-default)',
                                                borderRadius: 16, padding: '16px 20px',
                                                textAlign: 'left', marginBottom: 24
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)' }}>PORTEUR</span>
                                                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)' }}>SOCIÉTÉ</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase' }}>
                                                        {user?.displayName || 'Initié'}
                                                    </span>
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--nya-gold)', fontFamily: 'var(--font-display)' }}>
                                                        SIRIUS CARD
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Mobile Money interface */
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24, textAlign: 'left' }}>
                                                {/* MOMO Provider Tabs */}
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                                                    <button
                                                        type="button"
                                                        disabled={processing}
                                                        onClick={() => handleMomoProviderChange('wave')}
                                                        style={{
                                                            padding: '12px 8px', borderRadius: 10, cursor: processing ? 'not-allowed' : 'pointer',
                                                            background: momoProvider === 'wave' ? 'rgba(37,99,235,0.1)' : 'transparent',
                                                            border: '1.5px solid ' + (momoProvider === 'wave' ? '#2563EB' : 'var(--border-subtle)'),
                                                            color: '#fff', fontSize: '0.7rem', fontWeight: 800,
                                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4
                                                        }}
                                                    >
                                                        <span style={{ color: '#2563EB', fontSize: '1rem' }}>🔷</span>
                                                        <span>WAVE</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={processing}
                                                        onClick={() => handleMomoProviderChange('orange')}
                                                        style={{
                                                            padding: '12px 8px', borderRadius: 10, cursor: processing ? 'not-allowed' : 'pointer',
                                                            background: momoProvider === 'orange' ? 'rgba(239,68,68,0.1)' : 'transparent',
                                                            border: '1.5px solid ' + (momoProvider === 'orange' ? '#EF4444' : 'var(--border-subtle)'),
                                                            color: '#fff', fontSize: '0.7rem', fontWeight: 800,
                                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4
                                                        }}
                                                    >
                                                        <span style={{ color: '#EF4444', fontSize: '1rem' }}>🍊</span>
                                                        <span>ORANGE</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={processing}
                                                        onClick={() => handleMomoProviderChange('mtn')}
                                                        style={{
                                                            padding: '12px 8px', borderRadius: 10, cursor: processing ? 'not-allowed' : 'pointer',
                                                            background: momoProvider === 'mtn' ? 'rgba(212,160,23,0.1)' : 'transparent',
                                                            border: '1.5px solid ' + (momoProvider === 'mtn' ? 'var(--nya-gold)' : 'var(--border-subtle)'),
                                                            color: '#fff', fontSize: '0.7rem', fontWeight: 800,
                                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4
                                                        }}
                                                    >
                                                        <span style={{ color: '#D4BFA8', fontSize: '1rem' }}>🟡</span>
                                                        <span>MTN</span>
                                                    </button>
                                                </div>

                                                {/* Phone Number Field */}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                    <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Numéro de Téléphone</label>
                                                    <input
                                                        type="tel"
                                                        value={phoneNumber}
                                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                                        disabled={processing}
                                                        placeholder="Ex: +2250708736871"
                                                        style={{
                                                            padding: '12px 16px', borderRadius: 10, background: 'var(--bg-primary)',
                                                            border: '1px solid var(--border-default)', color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none'
                                                        }}
                                                    />
                                                </div>

                                                {/* Orange OTP Code Field */}
                                                {momoProvider === 'orange' && (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                        <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Code d'Autorisation OTP (*144*82#)</label>
                                                        <input
                                                            type="text"
                                                            value={otpCode}
                                                            onChange={(e) => setOtpCode(e.target.value)}
                                                            disabled={processing}
                                                            placeholder="Ex: 8824"
                                                            maxLength={4}
                                                            style={{
                                                                padding: '12px 16px', borderRadius: 10, background: 'var(--bg-primary)',
                                                                border: '1px solid var(--border-default)', color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none'
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={confirmOrder}
                                            disabled={processing || (paymentMethod === 'momo' && !phoneNumber.trim()) || (paymentMethod === 'momo' && momoProvider === 'orange' && !otpCode.trim())}
                                            style={{
                                                width: '100%', padding: '16px', borderRadius: 12,
                                                background: 'var(--nya-ochre)', border: 'none',
                                                color: '#fff', fontWeight: 800, letterSpacing: '0.15em',
                                                textTransform: 'uppercase', cursor: (processing || (paymentMethod === 'momo' && !phoneNumber.trim())) ? 'not-allowed' : 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                                            }}
                                        >
                                            {processing ? (
                                                <>
                                                    <div style={{ width: 14, height: 14, border: '2px solid #fff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                                    {processingMessage}
                                                </>
                                            ) : (
                                                <>
                                                    <ShieldCheck size={16} /> CONFIRMER LA TRANSACTION
                                                </>
                                            )}
                                        </motion.button>
                                    </>
                                ) : (
                                    <>
                                        <div style={{
                                            width: 70, height: 70, borderRadius: '50%',
                                            background: 'rgba(59,130,246,0.1)', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center',
                                            margin: '0 auto 24px', color: 'var(--nya-bright-gold)'
                                        }}>
                                            <Sparkles size={36} />
                                        </div>

                                        <h3 style={{
                                            fontFamily: 'var(--font-display)', fontSize: '1.5rem',
                                            fontWeight: 900, color: 'var(--nya-bright-gold)', marginBottom: 12,
                                            textTransform: 'uppercase'
                                        }}>
                                            Transaction Réussie !
                                        </h3>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
                                            Vos artefacts ont été matérialisés et transportés directement dans votre **Voûte de Profil** (+100 Nya Score octroyé).
                                        </p>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={closeAll}
                                            style={{
                                                width: '100%', padding: '14px', borderRadius: 12,
                                                background: 'var(--bg-elevated)', border: '1px solid var(--border-hover)',
                                                color: 'var(--text-primary)', fontWeight: 800, letterSpacing: '0.1em',
                                                textTransform: 'uppercase', cursor: 'pointer'
                                            }}
                                        >
                                            CONTINUER LA NAVIGATION
                                        </motion.button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

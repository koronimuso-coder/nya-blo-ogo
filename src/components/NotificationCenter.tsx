import { motion, AnimatePresence } from 'framer-motion'
import { useNotificationStore } from '../stores/notificationStore'
import { X, Bell, Check, Trash2 } from 'lucide-react'

/**
 * NotificationCenter — "Murmures du Nexus"
 * Slide-in panel from the right showing categorized notifications.
 */
export default function NotificationCenter() {
    const { notifications, isOpen, closePanel, markRead, markAllRead, clearAll } = useNotificationStore()
    const unread = notifications.filter(n => !n.read).length

    const timeAgo = (ts: number) => {
        const diff = Date.now() - ts
        if (diff < 60000) return 'À l\'instant'
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m`
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`
        return `${Math.floor(diff / 86400000)}j`
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closePanel}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 9998,
                            background: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(4px)',
                        }}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        style={{
                            position: 'fixed', top: 0, right: 0, bottom: 0,
                            width: 380, maxWidth: '90vw',
                            zIndex: 9999,
                            background: 'var(--nya-deep)',
                            borderLeft: '1px solid var(--border-subtle)',
                            display: 'flex', flexDirection: 'column',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '24px 20px 16px',
                            borderBottom: '1px solid var(--border-default)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <Bell size={18} style={{ color: 'var(--nya-ochre)' }} />
                                <div>
                                    <div style={{
                                        fontFamily: 'var(--font-display)', fontSize: '1.1rem',
                                        fontWeight: 900, textTransform: 'uppercase',
                                        color: 'var(--text-primary)',
                                    }}>
                                        Murmures du Nexus
                                    </div>
                                    <div style={{
                                        fontSize: '0.65rem', fontWeight: 700,
                                        letterSpacing: '0.15em', textTransform: 'uppercase',
                                        color: 'var(--nya-ochre)',
                                    }}>
                                        {unread} NON LU{unread > 1 ? 'S' : ''}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 8 }}>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={markAllRead}
                                    title="Tout marquer comme lu"
                                    style={{
                                        width: 32, height: 32, borderRadius: '50%',
                                        background: 'rgba(0,229,160,0.1)',
                                        border: 'none', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--nya-sirius)',
                                    }}
                                >
                                    <Check size={14} />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={clearAll}
                                    title="Tout supprimer"
                                    style={{
                                        width: 32, height: 32, borderRadius: '50%',
                                        background: 'rgba(239,68,68,0.1)',
                                        border: 'none', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--nya-red)',
                                    }}
                                >
                                    <Trash2 size={14} />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={closePanel}
                                    style={{
                                        width: 32, height: 32, borderRadius: '50%',
                                        background: 'var(--bg-elevated)',
                                        border: 'none', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--text-muted)',
                                    }}
                                >
                                    <X size={14} />
                                </motion.button>
                            </div>
                        </div>

                        {/* Notification list */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
                            {notifications.length === 0 ? (
                                <div style={{
                                    padding: 40, textAlign: 'center',
                                    color: 'var(--text-faint)', fontSize: '0.8rem',
                                }}>
                                    <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>🔔</div>
                                    Aucune notification
                                </div>
                            ) : (
                                notifications.map((n, i) => (
                                    <motion.div
                                        key={n.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        onClick={() => markRead(n.id)}
                                        style={{
                                            padding: '14px 20px',
                                            cursor: 'pointer',
                                            borderBottom: '1px solid var(--border-default)',
                                            background: n.read ? 'transparent' : 'rgba(184,92,46,0.03)',
                                            transition: 'background 0.2s',
                                            display: 'flex', gap: 12, alignItems: 'flex-start',
                                        }}
                                    >
                                        <div style={{
                                            width: 36, height: 36, borderRadius: '50%',
                                            background: `${n.color || 'var(--nya-ochre)'}15`,
                                            border: `1px solid ${n.color || 'var(--nya-ochre)'}30`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '1rem', flexShrink: 0,
                                        }}>
                                            {n.icon || '📢'}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{
                                                display: 'flex', alignItems: 'center', gap: 8,
                                                marginBottom: 2,
                                            }}>
                                                <span style={{
                                                    fontWeight: n.read ? 600 : 800,
                                                    fontSize: '0.8rem',
                                                    color: 'var(--text-primary)',
                                                }}>
                                                    {n.title}
                                                </span>
                                                {!n.read && (
                                                    <div style={{
                                                        width: 6, height: 6, borderRadius: '50%',
                                                        background: 'var(--nya-ochre)', flexShrink: 0,
                                                    }} />
                                                )}
                                            </div>
                                            <div style={{
                                                fontSize: '0.75rem', color: 'var(--text-muted)',
                                                lineHeight: 1.4,
                                                overflow: 'hidden', textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}>
                                                {n.message}
                                            </div>
                                            <div style={{
                                                fontSize: '0.6rem', fontWeight: 700,
                                                letterSpacing: '0.1em', textTransform: 'uppercase',
                                                color: 'var(--text-faint)', marginTop: 4,
                                            }}>
                                                {timeAgo(n.timestamp)}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

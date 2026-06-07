import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Store, Car, Cross } from 'lucide-react'

/* Bottom tab bar matching the reference site's mobile footer nav:
   Accueil – Marché – VTC – Santé */
const tabs = [
    { icon: Home, path: '/', label: 'Accueil' },
    { icon: Store, path: '/shop', label: 'Marché' },
    { icon: Car, path: '/vtc', label: 'VTC' },
    { icon: Cross, path: '/health', label: 'Santé' },
]

export default function MobileNav() {
    const location = useLocation()

    return (
        <nav className="mobile-tab-bar" style={{ display: 'none', alignItems: 'center', justifyContent: 'space-around' }}>
            <style>{`
        @media (max-width: 768px) {
          .mobile-tab-bar { display: flex !important; }
        }
      `}</style>
            {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = location.pathname === tab.path

                return (
                    <NavLink
                        key={tab.path}
                        to={tab.path}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 4,
                            textDecoration: 'none',
                            padding: '8px 12px',
                            position: 'relative',
                        }}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="mobiletab"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    width: 24,
                                    height: 3,
                                    borderRadius: 2,
                                    background: 'linear-gradient(90deg, var(--nya-ochre), var(--nya-terracotta))',
                                }}
                            />
                        )}
                        <Icon
                            size={22}
                            style={{
                                color: isActive ? 'var(--nya-ochre)' : 'rgba(245,240,232,0.4)',
                                strokeWidth: isActive ? 2.5 : 1.5,
                            }}
                        />
                        <span
                            style={{
                                fontSize: '0.6rem',
                                color: isActive ? 'var(--nya-ochre)' : 'rgba(245,240,232,0.4)',
                                fontWeight: isActive ? 700 : 400,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                            }}
                        >
                            {tab.label}
                        </span>
                    </NavLink>
                )
            })}
        </nav>
    )
}

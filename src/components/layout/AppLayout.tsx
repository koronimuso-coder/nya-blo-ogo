import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'
import { useUIStore } from '../../stores/uiStore'
import PageTransition from '../animations/PageTransition'

export default function AppLayout() {
    const { sidebarCollapsed } = useUIStore()

    return (
        <div style={{ minHeight: '100vh', background: 'var(--nya-black)' }}>
            <Navbar />
            <Sidebar />
            <MobileNav />

            <motion.main
                animate={{
                    marginLeft: window.innerWidth > 768 ? (sidebarCollapsed ? 72 : 260) : 0,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{
                    marginTop: 80,
                    minHeight: 'calc(100vh - 80px)',
                    position: 'relative',
                    zIndex: 2,
                }}
            >
                <PageTransition>
                    <Outlet />
                </PageTransition>
            </motion.main>

            {/* Grain overlay */}
            <div className="grain-overlay" />
        </div>
    )
}

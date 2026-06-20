import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '../../stores/uiStore'
import {
    Home, Compass, Newspaper, Bot, Palette, GraduationCap, FileText,
    Music, Mic, Languages, Film, Youtube, Gamepad2, BookOpen,
    Calendar, Radio, Laugh, Trophy, Globe, MessageCircle, Users,
    Briefcase, HelpCircle, Target, ShoppingCart, Monitor,
    Shirt, Cpu, Heart, Store, Car, Cross, Building2, Ship,
    BriefcaseBusiness, Sprout,
    Activity, Dumbbell, UtensilsCrossed, Brain, TreePine,
    Wrench, Wallet, CalendarDays, FolderOpen, Mail,
    BarChart3, DollarSign, Sparkles, Camera, PlaneTakeoff,
    Image, Baby, Award, Box, Rocket, Code, Wifi, ListChecks, Shield,
    Headphones, ChevronLeft, ChevronRight, type LucideIcon
} from 'lucide-react'

interface NavItem { icon: LucideIcon; label: string; path: string }
interface NavGroup { title: string; items: NavItem[] }

const navGroups: NavGroup[] = [
    {
        title: 'EXPLORER', items: [
            { icon: Home, label: 'Accueil', path: '/' },
            { icon: Compass, label: 'Découvrir', path: '/discover' },
            { icon: Newspaper, label: 'Nya News', path: '/news' },
        ]
    },
    {
        title: 'CRÉER & APPRENDRE', items: [
            { icon: Bot, label: 'Nya AI', path: '/ai' },
            { icon: Palette, label: 'Nya Create', path: '/create' },
            { icon: GraduationCap, label: 'Nya Learn', path: '/learn' },
            { icon: FileText, label: 'Nya Docs', path: '/docs' },
            { icon: Music, label: 'Nya Music', path: '/music' },
            { icon: Mic, label: 'Nya Podcast', path: '/podcast' },
            { icon: Languages, label: 'Nya Langue', path: '/langue' },
        ]
    },
    {
        title: 'ENTERTAINMENT', items: [
            { icon: Film, label: 'Nya Stream', path: '/stream' },
            { icon: Youtube, label: 'Nya Tube', path: '/tube' },
            { icon: Gamepad2, label: 'Nya Play', path: '/play' },
            { icon: BookOpen, label: 'Nya Books', path: '/books' },
            { icon: Calendar, label: 'Nya Events', path: '/events' },
            { icon: Radio, label: 'Nya Live', path: '/live' },
            { icon: Laugh, label: 'Nya Comedy', path: '/comedy' },
            { icon: Trophy, label: 'Nya Sport', path: '/sport' },
        ]
    },
    {
        title: 'COMMUNAUTÉ', items: [
            { icon: Globe, label: 'Nya Social', path: '/social' },
            { icon: MessageCircle, label: 'Nya Chat', path: '/chat' },
            { icon: Users, label: 'Nya Forum', path: '/forum' },
            { icon: Briefcase, label: 'Nya Network', path: '/network' },
            { icon: HelpCircle, label: 'Nya Quiz', path: '/quiz' },
            { icon: Target, label: 'Nya Interview', path: '/interview' },
        ]
    },
    {
        title: 'BOUTIQUES', items: [
            { icon: ShoppingCart, label: 'Nya Shop', path: '/shop' },
            { icon: Monitor, label: 'Nya Digital', path: '/digital' },
            { icon: Shirt, label: 'Nya Fashion', path: '/fashion' },
            { icon: Cpu, label: 'Électronique', path: '/electronique' },
            { icon: Heart, label: 'Crowdfunding', path: '/crowdfunding' },
            { icon: Store, label: 'Digital Market', path: '/digital-market' },
        ]
    },
    {
        title: 'SERVICES', items: [
            { icon: Car, label: 'Nya VTC', path: '/vtc' },
            { icon: Cross, label: 'Pharmacie', path: '/pharmacie' },
            { icon: Building2, label: 'Immobilier', path: '/immobilier' },
            { icon: Ship, label: 'Transit', path: '/transit' },
            { icon: BriefcaseBusiness, label: 'Nya Jobs', path: '/jobs' },
            { icon: Sprout, label: 'Agriculture', path: '/agriculture' },
        ]
    },
    {
        title: 'BIEN-ÊTRE', items: [
            { icon: Activity, label: 'Health', path: '/health' },
            { icon: Dumbbell, label: 'Fitness', path: '/fitness' },
            { icon: UtensilsCrossed, label: 'Food', path: '/food' },
            { icon: Brain, label: 'Méditation', path: '/meditation' },
            { icon: TreePine, label: 'Généalogie', path: '/genealogy' },
        ]
    },
    {
        title: 'OUTILS PRO', items: [
            { icon: Wrench, label: 'Tools', path: '/tools' },
            { icon: Wallet, label: 'Finance', path: '/finance' },
            { icon: Wifi, label: 'Simulateur USSD', path: '/ussd' },
            { icon: CalendarDays, label: 'Calendrier', path: '/calendar' },
            { icon: FolderOpen, label: 'Files', path: '/files' },
            { icon: Mail, label: 'Mail', path: '/mail' },
            { icon: BarChart3, label: 'Survey', path: '/survey' },
            { icon: DollarSign, label: 'Affiliate', path: '/affiliate' },
        ]
    },
    {
        title: 'CULTURE', items: [
            { icon: Sparkles, label: 'Spiritual', path: '/spiritual' },
            { icon: Image, label: 'Fashion Mag', path: '/fashion-mag' },
            { icon: PlaneTakeoff, label: 'Travel', path: '/travel' },
            { icon: Camera, label: 'Photo', path: '/photography' },
            { icon: Baby, label: 'Kids', path: '/kids' },
        ]
    },
    {
        title: 'PLATEFORME', items: [
            { icon: Award, label: 'Rewards', path: '/rewards' },
            { icon: Shield, label: 'Identité KYC', path: '/kyc' },
            { icon: Box, label: 'Verse', path: '/verse' },
            { icon: Rocket, label: 'Startup', path: '/startup' },
            { icon: Code, label: 'API Docs', path: '/api-docs' },
            { icon: Wifi, label: 'Status', path: '/status' },
            { icon: ListChecks, label: 'Changelog', path: '/changelog' },
            { icon: Headphones, label: 'Support', path: '/support' },
        ]
    },
]

export default function Sidebar() {
    const { sidebarCollapsed, toggleSidebarCollapse } = useUIStore()
    const location = useLocation()

    return (
        <motion.aside
            animate={{ width: sidebarCollapsed ? 72 : 260 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
                position: 'fixed', top: 0, left: 0, bottom: 0,
                background: 'rgba(5,5,5,0.95)', backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(255,255,255,0.04)', zIndex: 100,
                overflowY: 'auto', overflowX: 'hidden', paddingTop: 80,
            }}
        >
            {/* Collapse btn */}
            <button onClick={toggleSidebarCollapse} style={{
                position: 'absolute', top: 24, right: -12,
                width: 24, height: 24, borderRadius: '50%',
                background: 'var(--nya-void)', border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--nya-ochre)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', zIndex: 101, fontSize: 12,
            }}>
                {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            <nav style={{ padding: '8px 0', paddingBottom: 100 }}>
                {navGroups.map((group, gi) => (
                    <div key={gi} style={{ marginBottom: 4 }}>
                        <AnimatePresence>
                            {!sidebarCollapsed && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="accent-label"
                                    style={{ padding: '14px 20px 6px', whiteSpace: 'nowrap' }}
                                >
                                    {group.title}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {group.items.map((item) => {
                            const Icon = item.icon
                            const isActive = location.pathname === item.path
                            return (
                                <NavLink key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
                                    <motion.div
                                        whileHover={{ x: 3, background: 'rgba(255,255,255,0.03)' }}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 12,
                                            padding: sidebarCollapsed ? '10px 0' : '10px 20px',
                                            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                                            cursor: 'pointer', position: 'relative',
                                            color: isActive ? 'var(--nya-ochre)' : 'rgba(245,240,232,0.5)',
                                            fontSize: '0.8rem', fontWeight: isActive ? 700 : 500,
                                            borderRadius: 'var(--radius-sm)', margin: '1px 8px',
                                            background: isActive ? 'rgba(184,92,46,0.08)' : 'transparent',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        {isActive && (
                                            <motion.div layoutId="sidebar-active" style={{
                                                position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                                                width: 3, height: 20, borderRadius: 2,
                                                background: 'var(--nya-ochre)',
                                            }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
                                        )}
                                        <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
                                        <AnimatePresence>
                                            {!sidebarCollapsed && (
                                                <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                                                    style={{ whiteSpace: 'nowrap' }}
                                                >{item.label}</motion.span>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                </NavLink>
                            )
                        })}

                        {gi < navGroups.length - 1 && (
                            <div style={{ height: 1, margin: '6px 20px', background: 'rgba(255,255,255,0.03)' }} />
                        )}
                    </div>
                ))}
            </nav>
        </motion.aside>
    )
}

export { navGroups }

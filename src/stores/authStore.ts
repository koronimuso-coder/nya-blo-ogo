import { create } from 'zustand'
import type { CartItem } from './cartStore'

export interface Achievement {
    id: string
    title: string
    description: string
    icon: string
    color: string
    points: number
    unlocked: boolean
    unlockedAt?: number
}

export interface Transaction {
    id: string
    label: string
    amount: number
    type: 'credit' | 'debit'
    date: number
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
    { id: 'first-visit', title: 'Premier Pas', description: 'Visiter NYA BLO pour la première fois', icon: '👣', color: '#B85C2E', points: 10, unlocked: true, unlockedAt: Date.now() - 86400000 },
    { id: 'first-chat', title: 'Voix du Nommo', description: 'Envoyer un message dans le Laboratoire Nommo', icon: '💬', color: '#FFD700', points: 25, unlocked: false },
    { id: 'quiz-master', title: 'Scribe Érudit', description: 'Compléter le Quiz des Scribes', icon: '📜', color: '#00E5A0', points: 50, unlocked: false },
    { id: 'puzzle-solver', title: 'Architecte de Bandiagara', description: 'Résoudre le puzzle glissant', icon: '🧩', color: '#a78bfa', points: 75, unlocked: false },
    { id: 'memory-master', title: 'Mémoire Ancestrale', description: 'Compléter le jeu Memory Dogon', icon: '🧠', color: '#00CED1', points: 75, unlocked: false },
    { id: 'explorer', title: 'Explorateur Cosmique', description: 'Visiter 5 pages différentes', icon: '🚀', color: '#ef4444', points: 30, unlocked: false },
    { id: 'cv-creator', title: 'Forgeron du Destin', description: 'Créer un CV dans le CV Builder', icon: '⚒️', color: '#D4A017', points: 50, unlocked: false },
    { id: 'canvas-artist', title: 'Artiste Génératif', description: 'Créer une œuvre dans le Canvas Génératif', icon: '🎨', color: '#ec4899', points: 40, unlocked: false },
    { id: 'shopper', title: 'Marchand de Sirius', description: 'Ajouter un article au panier', icon: '🛒', color: '#059669', points: 20, unlocked: false },
    { id: 'night-walker', title: 'Marcheur Nocturne', description: 'Basculer en mode sombre', icon: '🌙', color: '#6366f1', points: 15, unlocked: false },
    { id: 'patron', title: 'Mécène de Sirius', description: 'Réaliser son premier achat / checkout', icon: '💎', color: '#B85C2E', points: 50, unlocked: false },
    { id: 'collector', title: 'Archiviste Royal', description: 'Posséder 3 articles différents dans son inventaire', icon: '🏛️', color: '#D4A017', points: 60, unlocked: false },
    { id: 'onboarding-complete', title: 'Initié du Nexus', description: 'Terminer la visite guidée du Nexus', icon: '🌟', color: '#00E5A0', points: 25, unlocked: false },
    { id: 'sirius-pilot', title: 'Pilote de Sirius', description: 'Atteindre un score de 15 points dans Nommo Odyssey', icon: '🚀', color: '#FF007F', points: 80, unlocked: false },
]

export interface User {
    id: string
    email: string
    displayName: string
    photoURL?: string
    role: 'user' | 'admin' | 'instructor' | 'driver' | 'pharmacy'
    plan: 'free' | 'premium' | 'business'
    nyaScore: number
    nyaCoins: number
    streak: number
    bio?: string
    avatarConfig?: {
        symbol: string
        gradient: string
        title: string
    }
}

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    achievements: Achievement[]
    recentUnlock: Achievement | null
    inventory: CartItem[]
    transactions: Transaction[]
    login: (email: string, password: string) => Promise<void>
    loginAsDemo: () => void
    logout: () => void
    setLoading: (loading: boolean) => void
    addCoins: (coins: number) => void
    addScore: (score: number) => void
    unlockAchievement: (id: string) => void
    dismissUnlock: () => void
    pagesVisited: string[]
    trackPageVisit: (path: string) => void
    updateProfile: (name: string, bio: string, avatarConfig: { symbol: string, gradient: string, title: string }) => void
    checkoutCart: (items: CartItem[]) => void
    addUnlockedArtifact: (name: string, gradient: string) => void
    addTransaction: (label: string, amount: number, type: 'credit' | 'debit') => void
    resetAccount: () => void
}

const demoUser: User = {
    id: 'demo-001',
    email: 'demo@nyablo.com',
    displayName: 'Amadou Dogon',
    photoURL: undefined,
    role: 'user',
    plan: 'premium',
    nyaScore: 2450,
    nyaCoins: 1280,
    streak: 7,
    bio: 'Scribe passionné par l\'art et les astres de Sirius.',
    avatarConfig: {
        symbol: '✨',
        gradient: 'linear-gradient(135deg, #B85C2E 0%, #D4A017 100%)',
        title: 'Apprenti Toguna',
    }
}

function loadAchievements(): Achievement[] {
    try {
        const saved = localStorage.getItem('nya-achievements')
        if (saved) return JSON.parse(saved)
    } catch { /* ignore */ }
    return DEFAULT_ACHIEVEMENTS
}

function saveAchievements(achievements: Achievement[]) {
    localStorage.setItem('nya-achievements', JSON.stringify(achievements))
}

function loadPagesVisited(): string[] {
    try {
        const saved = localStorage.getItem('nya-pages-visited')
        if (saved) return JSON.parse(saved)
    } catch { /* ignore */ }
    return ['/']
}

function loadInventory(): CartItem[] {
    try {
        const saved = localStorage.getItem('nya-inventory')
        return saved ? JSON.parse(saved) : []
    } catch { return [] }
}

function saveInventory(inventory: CartItem[]) {
    localStorage.setItem('nya-inventory', JSON.stringify(inventory))
}

function loadTransactions(): Transaction[] {
    try {
        const saved = localStorage.getItem('nya-transactions')
        if (saved) return JSON.parse(saved)
    } catch { /* ignore */ }
    return [
        { id: 'tx-001', label: 'Bienvenue sur NYA BLO', amount: 500, type: 'credit', date: Date.now() - 86400000 },
        { id: 'tx-002', label: 'Bonus de Connexion Quotidien', amount: 50, type: 'credit', date: Date.now() - 3600000 },
    ]
}

function saveTransactions(transactions: Transaction[]) {
    localStorage.setItem('nya-transactions', JSON.stringify(transactions))
}

function loadUser(): User | null {
    try {
        const saved = localStorage.getItem('nya-user')
        if (saved) return JSON.parse(saved)
    } catch { /* ignore */ }
    return demoUser
}

function saveUser(user: User | null) {
    if (user) {
        localStorage.setItem('nya-user', JSON.stringify(user))
    } else {
        localStorage.removeItem('nya-user')
    }
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: loadUser(),
    isAuthenticated: true,
    isLoading: false,
    achievements: loadAchievements(),
    recentUnlock: null,
    pagesVisited: loadPagesVisited(),
    inventory: loadInventory(),
    transactions: loadTransactions(),

    login: async (_email: string, _password: string) => {
        set({ isLoading: true })
        await new Promise((r) => setTimeout(r, 1500))
        saveUser(demoUser)
        set({ user: demoUser, isAuthenticated: true, isLoading: false })
    },
    loginAsDemo: () => {
        saveUser(demoUser)
        set({ user: demoUser, isAuthenticated: true })
    },
    logout: () => {
        localStorage.removeItem('nya-user')
        set({ user: null, isAuthenticated: false })
    },
    setLoading: (loading) => set({ isLoading: loading }),
    addCoins: (coins: number) => {
        set((state) => {
            if (!state.user) return {}
            const newUser = { ...state.user, nyaCoins: state.user.nyaCoins + coins }
            saveUser(newUser)
            return { user: newUser }
        })
    },
    addScore: (score: number) => {
        set((state) => {
            if (!state.user) return {}
            const newUser = { ...state.user, nyaScore: state.user.nyaScore + score }
            saveUser(newUser)
            return { user: newUser }
        })
    },

    unlockAchievement: (id: string) => {
        const state = get()
        const achievement = state.achievements.find((a) => a.id === id)
        if (!achievement || achievement.unlocked) return

        const updated = state.achievements.map((a) =>
            a.id === id ? { ...a, unlocked: true, unlockedAt: Date.now() } : a
        )
        saveAchievements(updated)

        const newCoins = (state.user?.nyaCoins ?? 0) + achievement.points
        const newScore = (state.user?.nyaScore ?? 0) + achievement.points * 2

        const newUser = state.user ? { ...state.user, nyaCoins: newCoins, nyaScore: newScore } : null
        saveUser(newUser)

        // Log transaction for the reward coins
        const txId = `tx-ach-${Date.now()}`
        const newTx: Transaction = {
            id: txId,
            label: `Badge débloqué : ${achievement.title}`,
            amount: achievement.points,
            type: 'credit',
            date: Date.now()
        }
        const updatedTxs = [newTx, ...state.transactions]
        saveTransactions(updatedTxs)

        set({
            achievements: updated,
            recentUnlock: { ...achievement, unlocked: true, unlockedAt: Date.now() },
            user: newUser,
            transactions: updatedTxs
        })
    },

    dismissUnlock: () => set({ recentUnlock: null }),

    trackPageVisit: (path: string) => {
        const state = get()
        if (state.pagesVisited.includes(path)) return
        const updated = [...state.pagesVisited, path]
        localStorage.setItem('nya-pages-visited', JSON.stringify(updated))
        set({ pagesVisited: updated })

        if (updated.length >= 5) {
            const explorerAch = state.achievements.find((a) => a.id === 'explorer')
            if (explorerAch && !explorerAch.unlocked) {
                setTimeout(() => get().unlockAchievement('explorer'), 1500)
            }
        }
    },

    updateProfile: (name: string, bio: string, avatarConfig: { symbol: string, gradient: string, title: string }) => {
        set((state) => {
            if (!state.user) return {}
            const newUser: User = {
                ...state.user,
                displayName: name,
                bio,
                avatarConfig
            }
            saveUser(newUser)
            return { user: newUser }
        })
    },

    checkoutCart: (items: CartItem[]) => {
        const state = get()
        if (!state.user) return

        // Calculate total cost
        const parsePrice = (priceStr: string) => {
            return parseInt(priceStr.replace(/[^0-9]/g, '')) || 0
        }
        const total = items.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0)

        // Debit coins or simulate
        const newCoins = state.user.nyaCoins // Fictive money check or just deduction
        // If they don't have enough coins we let them do it (demo mode) but record transaction
        const newUserCoins = Math.max(0, newCoins - total)

        // Add to inventory (merging quantities)
        const updatedInventory = [...state.inventory]
        items.forEach((item) => {
            const existing = updatedInventory.find((i) => i.id === item.id)
            if (existing) {
                existing.quantity += item.quantity
            } else {
                updatedInventory.push({ ...item })
            }
        })
        saveInventory(updatedInventory)

        // Record transaction
        const newTx: Transaction = {
            id: `tx-check-${Date.now()}`,
            label: `Achat Marché (${items.length} article${items.length > 1 ? 's' : ''})`,
            amount: total,
            type: 'debit',
            date: Date.now()
        }
        const updatedTxs = [newTx, ...state.transactions]
        saveTransactions(updatedTxs)

        const finalUser = {
            ...state.user,
            nyaCoins: newUserCoins,
            nyaScore: state.user.nyaScore + 100 // +100 score for purchases
        }
        saveUser(finalUser)

        set({
            user: finalUser,
            inventory: updatedInventory,
            transactions: updatedTxs
        })

        // Check shopper / patron / collector achievements
        get().unlockAchievement('patron')

        if (updatedInventory.length >= 3) {
            get().unlockAchievement('collector')
        }
    },

    addUnlockedArtifact: (name: string, gradient: string) => {
        const state = get()
        const existing = state.inventory.find((item) => item.name === name)
        if (existing) return

        const newItem: CartItem = {
            id: `art-${Date.now()}`,
            name,
            price: '0 Nya Coins',
            gradient,
            quantity: 1
        }
        const updatedInventory = [...state.inventory, newItem]
        saveInventory(updatedInventory)
        set({ inventory: updatedInventory })
    },

    addTransaction: (label: string, amount: number, type: 'credit' | 'debit') => {
        const state = get()
        if (!state.user) return

        const newTx: Transaction = {
            id: `tx-gen-${Date.now()}`,
            label,
            amount,
            type,
            date: Date.now()
        }
        const updatedTxs = [newTx, ...state.transactions]
        saveTransactions(updatedTxs)

        const finalCoins = type === 'credit' 
            ? state.user.nyaCoins + amount 
            : Math.max(0, state.user.nyaCoins - amount)

        const finalUser = {
            ...state.user,
            nyaCoins: finalCoins,
            nyaScore: state.user.nyaScore + (type === 'credit' ? Math.floor(amount * 1.5) : 10)
        }
        saveUser(finalUser)

        set({
            user: finalUser,
            transactions: updatedTxs
        })
    },

    resetAccount: () => {
        localStorage.removeItem('nya-user')
        localStorage.removeItem('nya-achievements')
        localStorage.removeItem('nya-pages-visited')
        localStorage.removeItem('nya-inventory')
        localStorage.removeItem('nya-transactions')

        set({
            user: demoUser,
            achievements: DEFAULT_ACHIEVEMENTS,
            pagesVisited: ['/'],
            inventory: [],
            transactions: [
                { id: 'tx-001', label: 'Bienvenue sur NYA BLO', amount: 500, type: 'credit', date: Date.now() },
            ]
        })
        saveUser(demoUser)
        saveAchievements(DEFAULT_ACHIEVEMENTS)
        saveInventory([])
        saveTransactions([
            { id: 'tx-001', label: 'Bienvenue sur NYA BLO', amount: 500, type: 'credit', date: Date.now() },
        ])
    }
}))

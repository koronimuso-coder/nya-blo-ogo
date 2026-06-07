import { create } from 'zustand'

interface User {
    id: string
    email: string
    displayName: string
    photoURL?: string
    role: 'user' | 'admin' | 'instructor' | 'driver' | 'pharmacy'
    plan: 'free' | 'premium' | 'business'
    nyaScore: number
    nyaCoins: number
    streak: number
}

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    loginAsDemo: () => void
    logout: () => void
    setLoading: (loading: boolean) => void
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
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: async (_email: string, _password: string) => {
        set({ isLoading: true })
        // Mock login - will be replaced with Firebase Auth
        await new Promise((r) => setTimeout(r, 1500))
        set({ user: demoUser, isAuthenticated: true, isLoading: false })
    },
    loginAsDemo: () => {
        set({ user: demoUser, isAuthenticated: true })
    },
    logout: () => {
        set({ user: null, isAuthenticated: false })
    },
    setLoading: (loading) => set({ isLoading: loading }),
}))

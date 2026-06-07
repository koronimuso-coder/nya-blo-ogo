import { create } from 'zustand'

type Theme = 'light' | 'dark'

interface ThemeStore {
    theme: Theme
    toggleTheme: () => void
    setTheme: (t: Theme) => void
}

export const useThemeStore = create<ThemeStore>((set) => ({
    theme: (typeof window !== 'undefined' && localStorage.getItem('nya-theme') as Theme) || 'light',

    toggleTheme: () =>
        set((state) => {
            const next: Theme = state.theme === 'light' ? 'dark' : 'light'
            document.documentElement.setAttribute('data-theme', next)
            localStorage.setItem('nya-theme', next)
            return { theme: next }
        }),

    setTheme: (t: Theme) => {
        document.documentElement.setAttribute('data-theme', t)
        localStorage.setItem('nya-theme', t)
        set({ theme: t })
    },
}))

// Initialize on load
if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('nya-theme') as Theme | null
    const initial = saved || 'light'
    document.documentElement.setAttribute('data-theme', initial)
}

import { create } from 'zustand'

type Theme = 'light' | 'dark'
export type CosmicTheme = 
  | 'ochre' 
  | 'sirius' 
  | 'gao' 
  | 'eclipse' 
  | 'fusion-sahel' 
  | 'sirius-nova' 
  | 'kemet-sun' 
  | 'asante-magenta' 
  | 'sahara-dune' 
  | 'custom'

interface ColorPreset {
    ochre: string
    ochreLight: string
    ochreDark: string
    gold: string
    brightGold: string
    sirius: string
    bgPrimary: string
    bgSecondary: string
    borderDefault: string
}

// Helper to convert hex to RGB for alpha borders
export function hexToRgb(hex: string): string {
    let clean = hex.replace('#', '')
    if (clean.length === 3) {
        clean = clean.split('').map(c => c + c).join('')
    }
    const num = parseInt(clean, 16)
    if (isNaN(num)) return '255, 255, 255'
    const r = (num >> 16) & 255
    const g = (num >> 8) & 255
    const b = num & 255
    return `${r}, ${g}, ${b}`
}

export const COSMIC_THEME_PRESETS: Record<CosmicTheme, ColorPreset> = {
    ochre: {
        ochre: '#B85C2E',
        ochreLight: '#D4793F',
        ochreDark: '#8B4522',
        gold: '#D4A017',
        brightGold: '#FFD700',
        sirius: '#00E5A0',
        bgPrimary: '#000000',
        bgSecondary: '#050505',
        borderDefault: 'rgba(255, 255, 255, 0.04)'
    },
    sirius: {
        ochre: '#00B4D8',
        ochreLight: '#90E0EF',
        ochreDark: '#0077B6',
        gold: '#00E5A0',
        brightGold: '#00F5D4',
        sirius: '#00F5D4',
        bgPrimary: '#020617',
        bgSecondary: '#080e1e',
        borderDefault: 'rgba(0, 180, 216, 0.12)'
    },
    gao: {
        ochre: '#8b5cf6',
        ochreLight: '#a78bfa',
        ochreDark: '#6d28d9',
        gold: '#FFD700',
        brightGold: '#F59E0B',
        sirius: '#FF007F',
        bgPrimary: '#08040d',
        bgSecondary: '#11091d',
        borderDefault: 'rgba(139, 92, 246, 0.12)'
    },
    eclipse: {
        ochre: '#dc2626',
        ochreLight: '#f87171',
        ochreDark: '#991b1b',
        gold: '#ea580c',
        brightGold: '#f97316',
        sirius: '#10b981',
        bgPrimary: '#060101',
        bgSecondary: '#100404',
        borderDefault: 'rgba(220, 38, 38, 0.12)'
    },
    'fusion-sahel': {
        ochre: '#B85C2E', // Sahel Ochre/Brown
        ochreLight: '#D4793F', // Light clay
        ochreDark: '#8B4522', // Deep earth
        gold: '#3B82F6', // Royal blue
        brightGold: '#60A5FA', // Azure light blue
        sirius: '#EF4444', // Hot neon red
        bgPrimary: '#0E0F12', // Charcoal Grey
        bgSecondary: '#17181D', // Slate Nebula Grey
        borderDefault: 'rgba(184, 92, 46, 0.15)'
    },
    'sirius-nova': {
        ochre: '#818cf8',
        ochreLight: '#a5b4fc',
        ochreDark: '#4f46e5',
        gold: '#d946ef',
        brightGold: '#f472b6',
        sirius: '#38bdf8',
        bgPrimary: '#04010a',
        bgSecondary: '#0f051b',
        borderDefault: 'rgba(129, 140, 248, 0.15)'
    },
    'kemet-sun': {
        ochre: '#b45309',
        ochreLight: '#d97706',
        ochreDark: '#78350f',
        gold: '#fbbf24',
        brightGold: '#fef08a',
        sirius: '#10b981',
        bgPrimary: '#030201',
        bgSecondary: '#0e0b06',
        borderDefault: 'rgba(251, 191, 36, 0.15)'
    },
    'asante-magenta': {
        ochre: '#db2777',
        ochreLight: '#f472b6',
        ochreDark: '#9d174d',
        gold: '#f97316',
        brightGold: '#fb923c',
        sirius: '#22d3ee',
        bgPrimary: '#060006',
        bgSecondary: '#140314',
        borderDefault: 'rgba(219, 39, 119, 0.15)'
    },
    'sahara-dune': {
        ochre: '#ea580c',
        ochreLight: '#f97316',
        ochreDark: '#c2410c',
        gold: '#eab308',
        brightGold: '#facc15',
        sirius: '#14b8a6',
        bgPrimary: '#080402',
        bgSecondary: '#150a04',
        borderDefault: 'rgba(234, 88, 12, 0.15)'
    },
    custom: {
        ochre: '#B85C2E',
        ochreLight: '#D4793F',
        ochreDark: '#8B4522',
        gold: '#D4A017',
        brightGold: '#FFD700',
        sirius: '#00E5A0',
        bgPrimary: '#000000',
        bgSecondary: '#050505',
        borderDefault: 'rgba(255, 255, 255, 0.04)'
    }
}

export const applyCosmicThemeStyles = (themeName: CosmicTheme) => {
    if (typeof window === 'undefined') return
    const root = document.documentElement
    
    if (themeName === 'custom') {
        const ochre = localStorage.getItem('nya-custom-ochre') || '#B85C2E'
        const ochreLight = localStorage.getItem('nya-custom-ochreLight') || '#D4793F'
        const ochreDark = localStorage.getItem('nya-custom-ochreDark') || '#8B4522'
        const gold = localStorage.getItem('nya-custom-gold') || '#D4A017'
        const brightGold = localStorage.getItem('nya-custom-brightGold') || '#FFD700'
        const sirius = localStorage.getItem('nya-custom-sirius') || '#00E5A0'
        const bgPrimary = localStorage.getItem('nya-custom-bgPrimary') || '#000000'
        const bgSecondary = localStorage.getItem('nya-custom-bgSecondary') || '#050505'
        const borderDefault = `rgba(${hexToRgb(ochre)}, 0.12)`

        root.style.setProperty('--nya-ochre', ochre)
        root.style.setProperty('--nya-ochre-light', ochreLight)
        root.style.setProperty('--nya-ochre-dark', ochreDark)
        root.style.setProperty('--nya-gold', gold)
        root.style.setProperty('--nya-bright-gold', brightGold)
        root.style.setProperty('--nya-sirius', sirius)
        root.style.setProperty('--bg-primary', bgPrimary)
        root.style.setProperty('--bg-secondary', bgSecondary)
        root.style.setProperty('--border-default', borderDefault)
    } else {
        const preset = COSMIC_THEME_PRESETS[themeName]
        if (!preset) return
        root.style.setProperty('--nya-ochre', preset.ochre)
        root.style.setProperty('--nya-ochre-light', preset.ochreLight)
        root.style.setProperty('--nya-ochre-dark', preset.ochreDark)
        root.style.setProperty('--nya-gold', preset.gold)
        root.style.setProperty('--nya-bright-gold', preset.brightGold)
        root.style.setProperty('--nya-sirius', preset.sirius)
        root.style.setProperty('--bg-primary', preset.bgPrimary)
        root.style.setProperty('--bg-secondary', preset.bgSecondary)
        root.style.setProperty('--border-default', preset.borderDefault)
    }
}

interface ThemeStore {
    theme: Theme
    cosmicTheme: CosmicTheme
    toggleTheme: () => void
    setTheme: (t: Theme) => void
    setCosmicTheme: (ct: CosmicTheme) => void
}

export const useThemeStore = create<ThemeStore>((set) => ({
    theme: (typeof window !== 'undefined' && localStorage.getItem('nya-theme') as Theme) || 'light',
    cosmicTheme: (typeof window !== 'undefined' && localStorage.getItem('nya-cosmic-theme') as CosmicTheme) || 'ochre',

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

    setCosmicTheme: (ct: CosmicTheme) => {
        applyCosmicThemeStyles(ct)
        localStorage.setItem('nya-cosmic-theme', ct)
        set({ cosmicTheme: ct })
    }
}))

// Initialize theme state and colors on load
if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('nya-theme') as Theme | null
    const initial = saved || 'light'
    document.documentElement.setAttribute('data-theme', initial)

    const savedCosmic = localStorage.getItem('nya-cosmic-theme') as CosmicTheme | null
    const initialCosmic = savedCosmic || 'ochre'
    applyCosmicThemeStyles(initialCosmic)
}

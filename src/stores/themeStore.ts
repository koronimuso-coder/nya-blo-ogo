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
    bgPrimaryLight: string
    bgSecondaryLight: string
    bgPrimaryDark: string
    bgSecondaryDark: string
    borderDefaultLight: string
    borderDefaultDark: string
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
        ochre: '#5C2D13', // Terracotta Brown
        ochreLight: '#7E4221',
        ochreDark: '#3D1C08',
        gold: '#1D4ED8', // Royal Blue
        brightGold: '#2563EB', // Bright Blue
        sirius: '#DC2626', // Red
        bgPrimaryLight: '#FFFFFF',
        bgSecondaryLight: '#FAF8F5',
        borderDefaultLight: 'rgba(92, 58, 33, 0.08)',
        bgPrimaryDark: '#1C100B',
        bgSecondaryDark: '#120906',
        borderDefaultDark: 'rgba(253, 251, 247, 0.08)'
    },
    sirius: {
        ochre: '#4A2E1B', // Deep Espresso Brown
        ochreLight: '#6C462C',
        ochreDark: '#2B190E',
        gold: '#2563EB', // Electric Blue
        brightGold: '#60A5FA', // Sky Blue
        sirius: '#EF4444', // Red
        bgPrimaryLight: '#FFFFFF',
        bgSecondaryLight: '#F4F6F9',
        borderDefaultLight: 'rgba(74, 46, 27, 0.08)',
        bgPrimaryDark: '#140E0B',
        bgSecondaryDark: '#0B0806',
        borderDefaultDark: 'rgba(253, 251, 247, 0.08)'
    },
    gao: {
        ochre: '#4C1F03', // Burnt Timber Brown
        ochreLight: '#6E340E',
        ochreDark: '#2E1100',
        gold: '#1E40AF', // Deep Indigo Blue
        brightGold: '#3B82F6', // Electric Blue
        sirius: '#DC2626', // Scarlet Red
        bgPrimaryLight: '#FAF6F0',
        bgSecondaryLight: '#F3ECE3',
        borderDefaultLight: 'rgba(76, 31, 3, 0.08)',
        bgPrimaryDark: '#1D0E05',
        bgSecondaryDark: '#120701',
        borderDefaultDark: 'rgba(253, 251, 247, 0.08)'
    },
    eclipse: {
        ochre: '#2A1E17', // Charcoal Brown
        ochreLight: '#423229',
        ochreDark: '#170E09',
        gold: '#1D4ED8', // Midnight Blue
        brightGold: '#2563EB', // Cobalt Blue
        sirius: '#DC2626', // Red Alert
        bgPrimaryLight: '#FFFFFF',
        bgSecondaryLight: '#F2F2F2',
        borderDefaultLight: 'rgba(42, 30, 23, 0.08)',
        bgPrimaryDark: '#0F0A07',
        bgSecondaryDark: '#080504',
        borderDefaultDark: 'rgba(253, 251, 247, 0.08)'
    },
    'fusion-sahel': {
        ochre: '#5C2D13', // Sahel Clay Brown
        ochreLight: '#8B4522',
        ochreDark: '#3D1C08',
        gold: '#2563EB', // Oasis Blue
        brightGold: '#60A5FA',
        sirius: '#EF4444', // Hot Neon Red
        bgPrimaryLight: '#FCFAF7',
        bgSecondaryLight: '#F5EFE6',
        borderDefaultLight: 'rgba(92, 58, 33, 0.08)',
        bgPrimaryDark: '#21130D',
        bgSecondaryDark: '#170D09',
        borderDefaultDark: 'rgba(253, 251, 247, 0.08)'
    },
    'sirius-nova': {
        ochre: '#3E2723', // Espresso
        ochreLight: '#5D4037',
        ochreDark: '#1B0000',
        gold: '#1565C0', // Nova Royal Blue
        brightGold: '#1E88E5', // Nova Light Blue
        sirius: '#D84315', // Rust Red
        bgPrimaryLight: '#FFFFFF',
        bgSecondaryLight: '#ECEFF1',
        borderDefaultLight: 'rgba(62, 39, 35, 0.08)',
        bgPrimaryDark: '#150C0A',
        bgSecondaryDark: '#0E0706',
        borderDefaultDark: 'rgba(253, 251, 247, 0.08)'
    },
    'kemet-sun': {
        ochre: '#4E342E', // Deep Nile Bronze
        ochreLight: '#6D4C41',
        ochreDark: '#27120E',
        gold: '#0D47A1', // Lapis Lazuli Blue
        brightGold: '#1976D2', // Nile Blue
        sirius: '#C62828', // Sun Red
        bgPrimaryLight: '#FFFDF9',
        bgSecondaryLight: '#FAF2E5',
        borderDefaultLight: 'rgba(78, 52, 46, 0.08)',
        bgPrimaryDark: '#18100E',
        bgSecondaryDark: '#100A09',
        borderDefaultDark: 'rgba(253, 251, 247, 0.08)'
    },
    'asante-magenta': {
        ochre: '#3E2723', // Dark Cocoa
        ochreLight: '#4E342E',
        ochreDark: '#270C00',
        gold: '#1A237E', // Asante Blue
        brightGold: '#283593',
        sirius: '#AD1457', // Magenta Red
        bgPrimaryLight: '#FCF9F2',
        bgSecondaryLight: '#F4EFE3',
        borderDefaultLight: 'rgba(62, 39, 35, 0.08)',
        bgPrimaryDark: '#150D0C',
        bgSecondaryDark: '#0E0807',
        borderDefaultDark: 'rgba(253, 251, 247, 0.08)'
    },
    'sahara-dune': {
        ochre: '#5D4037', // Dune Shadow Brown
        ochreLight: '#7D5648',
        ochreDark: '#3E2723',
        gold: '#01579B', // Oasis Blue
        brightGold: '#0288D1',
        sirius: '#D84315', // Sandstorm Red
        bgPrimaryLight: '#FDFBF7',
        bgSecondaryLight: '#F9F3E8',
        borderDefaultLight: 'rgba(93, 64, 55, 0.08)',
        bgPrimaryDark: '#221612',
        bgSecondaryDark: '#170D0A',
        borderDefaultDark: 'rgba(253, 251, 247, 0.08)'
    },
    custom: {
        ochre: '#5C2D13',
        ochreLight: '#7E4221',
        ochreDark: '#3D1C08',
        gold: '#1D4ED8',
        brightGold: '#2563EB',
        sirius: '#DC2626',
        bgPrimaryLight: '#FFFFFF',
        bgSecondaryLight: '#FAF8F5',
        borderDefaultLight: 'rgba(92, 58, 33, 0.08)',
        bgPrimaryDark: '#1C100B',
        bgSecondaryDark: '#120906',
        borderDefaultDark: 'rgba(253, 251, 247, 0.08)'
    }
}

export const applyCosmicThemeStyles = (themeName: CosmicTheme, isDark: boolean = false) => {
    if (typeof window === 'undefined') return
    const root = document.documentElement
    
    if (themeName === 'custom') {
        const ochre = localStorage.getItem('nya-custom-ochre') || '#5C2D13'
        const ochreLight = localStorage.getItem('nya-custom-ochreLight') || '#7E4221'
        const ochreDark = localStorage.getItem('nya-custom-ochreDark') || '#3D1C08'
        const gold = localStorage.getItem('nya-custom-gold') || '#1D4ED8'
        const brightGold = localStorage.getItem('nya-custom-brightGold') || '#2563EB'
        const sirius = localStorage.getItem('nya-custom-sirius') || '#DC2626'
        const bgPrimary = isDark 
            ? (localStorage.getItem('nya-custom-bgPrimaryDark') || '#1C100B')
            : (localStorage.getItem('nya-custom-bgPrimaryLight') || '#FFFFFF')
        const bgSecondary = isDark 
            ? (localStorage.getItem('nya-custom-bgSecondaryDark') || '#120906')
            : (localStorage.getItem('nya-custom-bgSecondaryLight') || '#FAF8F5')
        const borderDefault = `rgba(${hexToRgb(ochre)}, 0.08)`

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
        
        const bgPrimary = isDark ? preset.bgPrimaryDark : preset.bgPrimaryLight
        const bgSecondary = isDark ? preset.bgSecondaryDark : preset.bgSecondaryLight
        const borderDefault = isDark ? preset.borderDefaultDark : preset.borderDefaultLight

        root.style.setProperty('--nya-ochre', preset.ochre)
        root.style.setProperty('--nya-ochre-light', preset.ochreLight)
        root.style.setProperty('--nya-ochre-dark', preset.ochreDark)
        root.style.setProperty('--nya-gold', preset.gold)
        root.style.setProperty('--nya-bright-gold', preset.brightGold)
        root.style.setProperty('--nya-sirius', preset.sirius)
        root.style.setProperty('--bg-primary', bgPrimary)
        root.style.setProperty('--bg-secondary', bgSecondary)
        root.style.setProperty('--border-default', borderDefault)
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
            applyCosmicThemeStyles(state.cosmicTheme, next === 'dark')
            return { theme: next }
        }),

    setTheme: (t: Theme) => {
        document.documentElement.setAttribute('data-theme', t)
        localStorage.setItem('nya-theme', t)
        set((state) => {
            applyCosmicThemeStyles(state.cosmicTheme, t === 'dark')
            return { theme: t }
        })
    },

    setCosmicTheme: (ct: CosmicTheme) => {
        localStorage.setItem('nya-cosmic-theme', ct)
        set((state) => {
            applyCosmicThemeStyles(ct, state.theme === 'dark')
            return { cosmicTheme: ct }
        })
    }
}))

// Initialize theme state and colors on load
if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('nya-theme') as Theme | null
    const initial = saved || 'light'
    document.documentElement.setAttribute('data-theme', initial)

    const savedCosmic = localStorage.getItem('nya-cosmic-theme') as CosmicTheme | null
    const initialCosmic = savedCosmic || 'ochre'
    applyCosmicThemeStyles(initialCosmic, initial === 'dark')
}

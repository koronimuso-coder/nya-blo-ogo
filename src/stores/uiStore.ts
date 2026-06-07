import { create } from 'zustand'

interface UIState {
    sidebarOpen: boolean
    sidebarCollapsed: boolean
    mobileMenuOpen: boolean
    language: string
    theme: 'dark'
    showLoader: boolean
    activeModal: string | null
    toggleSidebar: () => void
    toggleSidebarCollapse: () => void
    setMobileMenu: (open: boolean) => void
    setLanguage: (lang: string) => void
    setShowLoader: (show: boolean) => void
    openModal: (id: string) => void
    closeModal: () => void
}

export const useUIStore = create<UIState>((set) => ({
    sidebarOpen: true,
    sidebarCollapsed: false,
    mobileMenuOpen: false,
    language: 'fr',
    theme: 'dark',
    showLoader: true,
    activeModal: null,
    toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    toggleSidebarCollapse: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    setMobileMenu: (open) => set({ mobileMenuOpen: open }),
    setLanguage: (lang) => set({ language: lang }),
    setShowLoader: (show) => set({ showLoader: show }),
    openModal: (id) => set({ activeModal: id }),
    closeModal: () => set({ activeModal: null }),
}))

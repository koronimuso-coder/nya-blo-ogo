import { create } from 'zustand'

export interface Notification {
    id: string
    type: 'system' | 'reward' | 'social' | 'achievement'
    title: string
    message: string
    icon?: string
    color?: string
    read: boolean
    timestamp: number
}

interface NotificationState {
    notifications: Notification[]
    isOpen: boolean
    push: (n: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void
    markRead: (id: string) => void
    markAllRead: () => void
    clearAll: () => void
    togglePanel: () => void
    closePanel: () => void
    unreadCount: () => number
}

let notifIdCounter = 0

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [
        {
            id: 'welcome-1',
            type: 'system',
            title: 'Bienvenue dans le Nexus',
            message: 'Explorez les 10 modules de NYA BLO et gagnez des badges !',
            icon: '🌟',
            color: '#FFD700',
            read: false,
            timestamp: Date.now() - 60000,
        },
        {
            id: 'reward-1',
            type: 'reward',
            title: '+50 Nya Coins',
            message: 'Récompense de connexion quotidienne activée.',
            icon: '💰',
            color: '#D4A017',
            read: false,
            timestamp: Date.now() - 120000,
        },
        {
            id: 'social-1',
            type: 'social',
            title: 'Nouveau Message',
            message: 'Awa Diabaté a commenté votre profil.',
            icon: '💬',
            color: '#00E5A0',
            read: true,
            timestamp: Date.now() - 300000,
        },
    ],
    isOpen: false,

    push: (n) => {
        notifIdCounter++
        const notification: Notification = {
            ...n,
            id: `notif-${Date.now()}-${notifIdCounter}`,
            read: false,
            timestamp: Date.now(),
        }
        set((state) => ({
            notifications: [notification, ...state.notifications].slice(0, 50),
        }))
    },

    markRead: (id) =>
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
            ),
        })),

    markAllRead: () =>
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

    clearAll: () => set({ notifications: [] }),

    togglePanel: () => set((state) => ({ isOpen: !state.isOpen })),
    closePanel: () => set({ isOpen: false }),

    unreadCount: () => get().notifications.filter((n) => !n.read).length,
}))

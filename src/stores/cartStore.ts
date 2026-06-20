import { create } from 'zustand'

export interface CartItem {
    id: string
    name: string
    price: string
    gradient: string
    quantity: number
}

interface CartState {
    items: CartItem[]
    wishlist: string[] // product IDs
    isCartOpen: boolean
    addItem: (product: Omit<CartItem, 'quantity'>) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, qty: number) => void
    clearCart: () => void
    toggleCart: () => void
    closeCart: () => void
    toggleWishlist: (id: string) => void
    isInWishlist: (id: string) => boolean
    totalItems: () => number
    totalPrice: () => number
}

function parsePrice(price: string): number {
    const cleaned = price.replace(/[^0-9]/g, '')
    return parseInt(cleaned) || 0
}

// Load from localStorage
function loadCart(): CartItem[] {
    try {
        const saved = localStorage.getItem('nya-cart')
        return saved ? JSON.parse(saved) : []
    } catch { return [] }
}

function loadWishlist(): string[] {
    try {
        const saved = localStorage.getItem('nya-wishlist')
        return saved ? JSON.parse(saved) : []
    } catch { return [] }
}

function saveCart(items: CartItem[]) {
    localStorage.setItem('nya-cart', JSON.stringify(items))
}

function saveWishlist(ids: string[]) {
    localStorage.setItem('nya-wishlist', JSON.stringify(ids))
}

export const useCartStore = create<CartState>((set, get) => ({
    items: loadCart(),
    wishlist: loadWishlist(),
    isCartOpen: false,

    addItem: (product) => {
        set((state) => {
            const existing = state.items.find((i) => i.id === product.id)
            let newItems: CartItem[]
            if (existing) {
                newItems = state.items.map((i) =>
                    i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
                )
            } else {
                newItems = [...state.items, { ...product, quantity: 1 }]
            }
            saveCart(newItems)
            return { items: newItems }
        })
    },

    removeItem: (id) => {
        set((state) => {
            const newItems = state.items.filter((i) => i.id !== id)
            saveCart(newItems)
            return { items: newItems }
        })
    },

    updateQuantity: (id, qty) => {
        set((state) => {
            const newItems = qty <= 0
                ? state.items.filter((i) => i.id !== id)
                : state.items.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
            saveCart(newItems)
            return { items: newItems }
        })
    },

    clearCart: () => {
        saveCart([])
        set({ items: [] })
    },

    toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
    closeCart: () => set({ isCartOpen: false }),

    toggleWishlist: (id) => {
        set((state) => {
            const newWishlist = state.wishlist.includes(id)
                ? state.wishlist.filter((w) => w !== id)
                : [...state.wishlist, id]
            saveWishlist(newWishlist)
            return { wishlist: newWishlist }
        })
    },

    isInWishlist: (id) => get().wishlist.includes(id),
    totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    totalPrice: () => get().items.reduce((sum, i) => sum + parsePrice(i.price) * i.quantity, 0),
}))

import { create } from 'zustand';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface User {
    id?: number;
    name: string;
    role: string;
    email?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User) => void;
    logout: () => void;
}

interface UIState {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
}

// ─────────────────────────────────────────────
// Auth Store — in-memory only (NOT localStorage)
// Sensitive: JWT roles must not persist in localStorage.
// On page refresh, session is restored via /api/auth/me cookie check.
// ─────────────────────────────────────────────
export const useAuthStore = create<AuthState>()((set) => ({
    user: null,
    isAuthenticated: false,
    login: (user) => set({ user, isAuthenticated: true }),
    logout: () => set({ user: null, isAuthenticated: false }),
}));

// ─────────────────────────────────────────────
// UI Store — no sensitive data, fine in memory
// ─────────────────────────────────────────────
export const useUIStore = create<UIState>((set) => ({
    sidebarOpen: true,
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));

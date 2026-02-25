'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useAuthStore, useUIStore } from '@/store/useStore';
import { apiFetch } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { isAuthenticated, login, logout } = useAuthStore();
    const { sidebarOpen } = useUIStore();
    const [checking, setChecking] = useState(!isAuthenticated);

    useEffect(() => {
        // On page refresh the in-memory Zustand state is lost.
        // Re-validate the session using the HttpOnly cookie via /api/auth/me.
        if (!isAuthenticated) {
            apiFetch<{
                id: number;
                username: string;
                first_name: string;
                last_name: string;
                email: string;
                role: string;
            }>('/api/auth/me/')
                .then(({ data, ok }) => {
                    if (ok && data) {
                        login({
                            id: data.id,
                            name: `${data.first_name} ${data.last_name}`.trim() || data.username,
                            email: data.email,
                            role: data.role,
                        });
                    } else {
                        logout();
                        router.push('/login');
                    }
                })
                .finally(() => setChecking(false));
        } else {
            setChecking(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (checking) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-[#00A8BC] border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-400 text-sm font-medium">Verifying session…</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <div className={cn(
                "flex-1 flex flex-col transition-all duration-300",
                sidebarOpen ? "ml-56" : "ml-14"
            )}>
                <Header />
                <main className="p-3 sm:p-6 lg:p-8 flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}

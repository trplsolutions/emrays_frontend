'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useAuthStore, useUIStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const { sidebarOpen } = useUIStore();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return null; // Or a loading spinner
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <div className={cn(
                "flex-1 flex flex-col transition-all duration-300",
                sidebarOpen ? "ml-64" : "ml-20"
            )}>
                <Header />
                <main className="p-8 flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}

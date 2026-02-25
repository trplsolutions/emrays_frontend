'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import {
    LayoutDashboard,
    Users,
    Search,
    UserCircle,
    FileText,
    Truck,
    Package,
    BarChart3,
    Bell,
    FolderOpen,
    HelpCircle,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore, useAuthStore } from '@/store/useStore';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Users, label: 'User Management System', href: '/users' },
    { icon: Search, label: 'Inquiries', href: '/inquiries' },
    { icon: UserCircle, label: 'Customer Inquiry', href: '/customer-inquiry' },
    { icon: FileText, label: 'Quotation & Management', href: '/quotations' },
    { icon: Package, label: 'Indent Tracking', href: '/indent-tracking' },
    { icon: Truck, label: 'Order & Shipment', href: '/orders' },
    { icon: BarChart3, label: 'Inventory', href: '/inventory' },
    { icon: Bell, label: 'Reporting', href: '/reporting' },
    { icon: UserCircle, label: 'Notifications & Alerts', href: '/notifications' },
    { icon: FolderOpen, label: 'Document Repository', href: '/documents' },
    { icon: HelpCircle, label: 'Help Desk', href: '/help' },
    { icon: Settings, label: 'Settings', href: '/settings' },
];

const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { sidebarOpen, toggleSidebar } = useUIStore();
    const { logout } = useAuthStore();

    const handleLogout = async () => {
        await apiFetch('/api/auth/logout/', { method: 'POST' });
        logout();
        router.push('/login');
    };

    return (
        <div className={cn(
            "fixed left-0 top-0 h-full bg-[#E6F7F9] border-r border-[#D1EEF2] transition-all duration-300 z-50 flex flex-col",
            sidebarOpen ? "w-56" : "w-14"
        )}>
            <div className="p-3 flex items-center justify-between">
                <div className={cn("text-[#00A8BC] font-bold text-lg tracking-tight overflow-hidden whitespace-nowrap", !sidebarOpen && "hidden")}>
                    EMRAYS
                </div>
                <button
                    onClick={toggleSidebar}
                    className="p-1 hover:bg-[#D1EEF2] rounded-md transition-colors"
                >
                    {sidebarOpen ? <ChevronLeft size={16} className="text-[#00A8BC]" /> : <ChevronRight size={16} className="text-[#00A8BC]" />}
                </button>
            </div>

            <nav className="flex-1 px-2.5 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-2 px-2 py-2 rounded-lg transition-all duration-200 group",
                                isActive
                                    ? "bg-[#00A8BC] text-white shadow-md shadow-[#00A8BC]/10"
                                    : "text-[#5F7E82] hover:bg-[#D1EEF2]"
                            )}
                        >
                            <item.icon size={16} className={cn(isActive ? "text-white" : "text-[#5F7E82] group-hover:text-[#00A8BC]")} />
                            {sidebarOpen && <span className="text-[11px] font-medium truncate">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-2.5 border-t border-[#D1EEF2]">
                <button
                    onClick={handleLogout}
                    className={cn(
                        "flex items-center gap-2 px-2 py-2 w-full rounded-lg text-[#F25C54] hover:bg-[#FEEAEA] transition-all duration-200 group",
                    )}
                >
                    <LogOut size={16} className="group-hover:scale-110 transition-transform" />
                    {sidebarOpen && <span className="text-[11px] font-bold">Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;

'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Search, Bell, ChevronDown, User, Settings, LogOut,
    MessageSquare, Clock, CheckCircle, Info
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useStore';
import { apiFetch } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const notifications = [
    {
        id: 1,
        title: "New Inquiry",
        message: "Customer John Doe sent a new inquiry regarding product X.",
        time: "5m ago",
        icon: MessageSquare,
        iconColor: "text-blue-500",
        bgColor: "bg-blue-50",
    },
    {
        id: 2,
        title: "Approval Required",
        message: "Indent #10556 requires your final approval.",
        time: "1h ago",
        icon: Clock,
        iconColor: "text-orange-500",
        bgColor: "bg-orange-50",
    },
    {
        id: 3,
        title: "Order Shipped",
        message: "Order #IND-882 has been shipped to destination.",
        time: "3h ago",
        icon: CheckCircle,
        iconColor: "text-green-500",
        bgColor: "bg-green-50",
    },
];

const formatRole = (role: string) => {
    switch (role) {
        case 'admin': return 'System Admin';
        case 'manager': return 'Manager';
        case 'sales_user': return 'Sales User';
        case 'sourcing_user': return 'Sourcing User';
        case 'sourcing_manager': return 'Sourcing Manager';
        case 'operation_user': return 'Operation User';
        default: return 'User';
    }
};

const Header = () => {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    const handleLogout = async () => {
        await apiFetch('/api/auth/logout/', { method: 'POST' });
        logout();
        router.push('/login');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="h-12 flex items-center justify-between px-3 sm:px-4 bg-white border-b border-gray-100 sticky top-0 z-40">
            <div className="relative w-48 md:w-64 lg:w-80 max-w-full">
                <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none">
                    <Search size={14} className="text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-gray-50 border-none rounded-full py-1 pl-9 pr-3 focus:ring-1 focus:ring-[#00A8BC]/20 transition-all outline-none text-gray-700 text-xs"
                />
            </div>

            <div className="flex items-center gap-3">
                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => {
                            setShowNotifications(!showNotifications);
                            setShowProfileMenu(false);
                        }}
                        className={cn(
                            "relative p-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors",
                            showNotifications && "bg-gray-100 text-[#00A8BC]"
                        )}
                    >
                        <Bell size={18} />
                        <span className="absolute top-1 right-1 w-3 h-3 bg-[#F2994A] text-white text-[7px] font-bold flex items-center justify-center rounded-full border border-white">
                            3
                        </span>
                    </button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                            >
                                <div className="p-3 border-b border-gray-50 flex justify-between items-center">
                                    <h3 className="text-sm font-bold text-[#1A3B3E]">Notifications</h3>
                                    <button className="text-[10px] text-[#00A8BC] font-medium hover:underline">Mark all as read</button>
                                </div>
                                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                    {notifications.map((notif) => (
                                        <div key={notif.id} className="p-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0">
                                            <div className="flex gap-3">
                                                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", notif.bgColor)}>
                                                    <notif.icon size={16} className={notif.iconColor} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-[#1A3B3E]">{notif.title}</p>
                                                    <p className="text-[10px] text-gray-500 line-clamp-2 mt-0.5">{notif.message}</p>
                                                    <p className="text-[9px] text-gray-400 mt-1 font-medium">{notif.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-2 border-t border-gray-50">
                                    <button className="w-full text-center py-1 text-[10px] font-bold text-[#00A8BC] hover:bg-[#E6F7F9] rounded-md transition-colors">
                                        View all notifications
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Profile Menu */}
                <div className="relative" ref={profileRef}>
                    <div
                        onClick={() => {
                            setShowProfileMenu(!showProfileMenu);
                            setShowNotifications(false);
                        }}
                        className="flex items-center gap-2 pl-3 border-l border-gray-100 cursor-pointer group"
                    >
                        <div className="text-right hidden sm:block leading-tight">
                            <p className="text-[10px] font-bold text-gray-900 group-hover:text-[#00A8BC] transition-colors">{user?.name || 'Your Name'}</p>
                            <p className="text-[9px] text-gray-500">{formatRole(user?.role || '')}</p>
                        </div>
                        <div className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-[#00A8BC]/20 shadow-sm group-hover:border-[#00A8BC]/50 transition-colors">
                            <Image
                                src="https://avatar.iran.liara.run/public/boy?username=User"
                                alt="Profile"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <ChevronDown
                            size={10}
                            className={cn("text-gray-400 transition-transform duration-200", showProfileMenu && "rotate-180")}
                        />
                    </div>

                    <AnimatePresence>
                        {showProfileMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                            >
                                <div className="p-3 border-b border-gray-50">
                                    <p className="text-xs font-bold text-[#1A3B3E] truncate">{user?.name || 'Your Name'}</p>
                                    <p className="text-[10px] text-gray-500 truncate">{user?.email || 'user@emrays.com'}</p>
                                </div>
                                <div className="p-1">
                                    <button className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                        <User size={14} className="text-gray-400" />
                                        My Profile
                                    </button>
                                    <button className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                        <Settings size={14} className="text-gray-400" />
                                        Account Settings
                                    </button>
                                    <button className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                        <Info size={14} className="text-gray-400" />
                                        Help Center
                                    </button>
                                </div>
                                <div className="p-1 border-t border-gray-50">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <LogOut size={14} />
                                        Log Out
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default Header;

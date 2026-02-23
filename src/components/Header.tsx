'use client';

import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useAuthStore } from '@/store/useStore';

const Header = () => {
    const { user } = useAuthStore();

    return (
        <header className="h-20 flex items-center justify-between px-8 bg-white border-b border-gray-100 sticky top-0 z-40">
            <div className="relative w-96 max-w-full">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-gray-50 border-none rounded-full py-2.5 pl-12 pr-4 focus:ring-2 focus:ring-[#00A8BC]/20 transition-all outline-none text-gray-700"
                />
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                    <Bell size={22} />
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#F2994A] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                        7
                    </span>
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                    <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{user?.name || 'Your Name'}</p>
                        <p className="text-xs text-gray-500">{user?.role || 'Sales Person'}</p>
                    </div>
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#00A8BC]/20 shadow-sm">
                        <Image
                            src="https://avatar.iran.liara.run/public/boy?username=User"
                            alt="Profile"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <ChevronDown size={14} className="text-gray-400" />
                </div>
            </div>
        </header>
    );
};

export default Header;

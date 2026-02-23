'use client';

import React from 'react';
import { cn } from '@/lib/utils';

const InquiriesPage = () => {
    return (
        <div className="space-y-8 max-w-[1400px] mx-auto pb-12">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-[#1A3B3E]">Inquiries <span className="text-gray-400 font-normal">Dashboard</span></h1>
                </div>
            </div>
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
                </div>
            </div>
        </div>
    );
};

export default InquiriesPage;

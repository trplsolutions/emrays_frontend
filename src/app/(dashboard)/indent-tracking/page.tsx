'use client';

import React from 'react';
import { cn } from '@/lib/utils';

const IndentTrackingPage = () => {
    return (
        <div className="space-y-4 max-w-[1400px] mx-auto pb-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-[#1A3B3E]">Indent <span className="text-gray-400 font-normal text-sm">Tracking</span></h1>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-6">
                </div>
            </div>
        </div>
    );
};

export default IndentTrackingPage;

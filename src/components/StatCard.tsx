'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatCardProps {
    title: string;
    value: string | number;
    subValueText?: string;
    subValueColor?: string;
    icon: LucideIcon;
    iconBgColor: string;
    iconColor: string;
}

const StatCard = ({ title, value, subValueText, subValueColor, icon: Icon, iconBgColor, iconColor }: StatCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 group transition-all"
        >
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", iconBgColor)}>
                <Icon className={iconColor} size={30} />
            </div>
            <div>
                <p className="text-[#00A8BC] font-bold text-lg mb-1">{title}</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-[#1A3B3E]">{value}</span>
                    {subValueText && (
                        <span className={cn("text-xs font-bold", subValueColor)}>
                            {subValueText}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default StatCard;

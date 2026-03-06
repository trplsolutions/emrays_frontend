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
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="bg-white p-2.5 rounded-lg border border-gray-100 shadow-sm flex items-center gap-2 group transition-all"
        >
            <div className={cn("w-9 h-9 rounded-md flex items-center justify-center transition-transform group-hover:scale-105", iconBgColor)}>
                <Icon className={iconColor} size={18} />
            </div>
            <div>
                <p className="text-[#00A8BC] font-bold text-xs mb-0.5">{title}</p>
                <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-extrabold text-[#1A3B3E]">{value}</span>
                    {subValueText && (
                        <span className={cn("text-[9px] font-bold", subValueColor)}>
                            {subValueText}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default StatCard;

'use client';

import React from 'react';
import { Search, FolderEdit, Clock, CheckSquare, Calendar } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { CommissionChart, StatusPieChart } from '@/components/DashboardCharts';
import { motion } from 'framer-motion';

const DashboardPage = () => {
    return (
        <div className="space-y-4 max-w-[1600px] mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                    <h1 className="text-xl font-bold text-[#1A3B3E]">Vector Hub <span className="text-gray-400 font-normal text-sm">Dashboard</span></h1>
                </div>
                <div className="flex items-center gap-1.5 bg-white border border-gray-100 px-2 py-1 rounded-md text-gray-500 text-[10px] font-medium shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
                    <Calendar size={14} />
                    Dec 23, 2024 - Dec 30, 2023
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard
                    title="Open Inquiries"
                    value="12"
                    subValueText="(+3 new)"
                    subValueColor="text-[#00A8BC]"
                    icon={Search}
                    iconBgColor="bg-[#E6F7F9]"
                    iconColor="text-[#00A8BC]"
                />
                <StatCard
                    title="Active Indents"
                    value="5"
                    subValueText="($ 150k)"
                    subValueColor="text-[#00A8BC]"
                    icon={FolderEdit}
                    iconBgColor="bg-[#E6F7F9]"
                    iconColor="text-[#00A8BC]"
                />
                <StatCard
                    title="Pending"
                    value="12.5k"
                    subValueText="(+3 new)"
                    subValueColor="text-[#00A8BC]"
                    icon={Clock}
                    iconBgColor="bg-[#FFF4E8]"
                    iconColor="text-[#F2994A]"
                />
                <StatCard
                    title="Approvals Due"
                    value="3"
                    subValueText="(Doc)"
                    subValueColor="text-[#00A8BC]"
                    icon={CheckSquare}
                    iconBgColor="bg-[#E9F2FF]"
                    iconColor="text-[#2D9CDB]"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <CommissionChart />
                <StatusPieChart />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-base font-bold text-[#1A3B3E] mb-3">My Task</h3>
                    <ul className="space-y-1.5">
                        {[
                            "Approval Pending: Quote #Q-1023",
                            "Missing Doc: BL for #IND-550",
                            "Follow-up Due: #INQ-889"
                        ].map((task, i) => (
                            <li key={i} className="flex items-center gap-2 text-[#5F7E82] text-xs font-medium bg-gray-50/50 p-2 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                                <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 accent-[#00A8BC]" />
                                {task}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-base font-bold text-[#1A3B3E] mb-3">Recent Activity Feed</h3>
                    <ul className="space-y-1.5">
                        {[
                            { msg: "Sales created #INQ-105", time: "10m" },
                            { msg: "Mgr Approved #PO-992", time: "1h" },
                            { msg: "Supplier uploaded Invoice #IND-20", time: "2h" }
                        ].map((activity, i) => (
                            <li key={i} className="flex items-center gap-2 text-[#5F7E82] text-xs font-medium bg-gray-50/50 p-2 rounded-md">
                                <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 accent-[#00A8BC]" />
                                <span className="flex-1">{activity.msg}</span>
                                <span className="text-[9px] text-gray-400 font-bold"> - {activity.time}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;

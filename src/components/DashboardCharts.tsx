
'use client';

import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { Info } from 'lucide-react';

const lineData = [
    { name: 'Jan', earned: 2000, pending: 3200 },
    { name: 'Feb', earned: 2500, pending: 3300 },
    { name: 'Mar', earned: 1800, pending: 3400 },
    { name: 'Apr', earned: 3200, pending: 4700 },
    { name: 'May', earned: 2800, pending: 4600 },
    { name: 'Jun', earned: 2200, pending: 3300 },
    { name: 'Jul', earned: 2600, pending: 3200 },
    { name: 'Aug', earned: 2500, pending: 4100 },
    { name: 'Sep', earned: 3400, pending: 3600 },
    { name: 'Oct', earned: 4100, pending: 2500 },
    { name: 'Nov', earned: 3400, pending: 3100 },
    { name: 'Dec', earned: 2800, pending: 2700 },
];

const pieData = [
    { name: 'Production 40% (10)', value: 40, color: '#00A8BC' },
    { name: 'Draft 15% (4)', value: 15, color: '#00C2D1' },
    { name: 'Shipped 20% (4)', value: 20, color: '#1A3B3E' },
    { name: 'Wait for LC 25% (6)', value: 25, color: '#E6F7F9' },
];

export const CommissionChart = () => {
    return (
        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm col-span-1 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-base font-bold text-[#1A3B3E]">Commission Earned vs Pending</h3>
                    <div className="flex gap-2 mt-1">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-[#F2994A]" />
                            <span className="text-[9px] text-gray-500 font-medium">Earned</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-[#EB5757]" />
                            <span className="text-[9px] text-gray-500 font-medium">Pending</span>
                        </div>
                    </div>
                </div>
                <div className="bg-[#1A3B3E] text-white px-2 py-1 rounded-md text-center">
                    <p className="text-[10px] font-bold">$ 1,500 <span className="text-[8px] text-[#00A8BC]">+25%</span></p>
                    <p className="text-[8px] opacity-70">profit/day</p>
                </div>
            </div>
            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#A0A0A0' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#A0A0A0' }}
                            tickFormatter={(value) => `$ ${value / 1000}k`}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="earned"
                            stroke="#F2994A"
                            strokeWidth={2}
                            dot={{ r: 3, fill: '#F2994A', strokeWidth: 1.5, stroke: '#fff' }}
                            activeDot={{ r: 4 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="pending"
                            stroke="#EB5757"
                            strokeWidth={2}
                            dot={{ r: 3, fill: '#EB5757', strokeWidth: 1.5, stroke: '#fff' }}
                            activeDot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export const StatusPieChart = () => {
    return (
        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm relative">
            <div className="flex justify-between items-center mb-3">
                <div>
                    <h3 className="text-base font-bold text-[#1A3B3E]">Indent Status</h3>
                    <p className="text-[10px] text-gray-400">September 2025</p>
                </div>
                <button className="text-[#00A8BC] w-6 h-6 flex items-center justify-center bg-[#E6F7F9] rounded-md">
                    <Info size={12} />
                </button>
            </div>
            <div className="h-[150px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={70}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    <p className="text-lg font-black text-[#1A3B3E]">40%</p>
                    <p className="text-[8px] text-gray-400 font-bold">(10)</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-y-2 mt-3">
                {pieData.map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-[9px] text-gray-500 font-medium">{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

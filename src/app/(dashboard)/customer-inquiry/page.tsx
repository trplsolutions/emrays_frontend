'use client';

import React from 'react';
import { Upload, Paperclip, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const InputField = ({ label, placeholder, type = "text", className }: { label: string, placeholder?: string, type?: string, className?: string }) => (
    <div className={cn("grid grid-cols-3 items-center gap-4", className)}>
        <label className="text-right text-sm font-semibold text-[#5F7E82] pr-4">{label}</label>
        <input
            type={type}
            placeholder={placeholder}
            className="col-span-2 w-full bg-white border border-gray-200 rounded-lg py-1.5 px-3 focus:ring-2 focus:ring-[#00A8BC]/20 outline-none transition-all placeholder:text-gray-300 shadow-sm text-sm"
        />
    </div>
);

const SelectField = ({ label, options, className }: { label: string, options: string[], className?: string }) => (
    <div className={cn("grid grid-cols-3 items-center gap-4", className)}>
        <label className="text-right text-sm font-semibold text-[#5F7E82] pr-4">{label}</label>
        <select
            className="col-span-2 w-full bg-white border border-gray-200 rounded-lg py-1.5 px-3 focus:ring-2 focus:ring-[#00A8BC]/20 outline-none transition-all text-sm text-gray-700 shadow-sm appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C/polyline%3E%3C/svg%3E')] bg-[length:1.25em_1.25em] bg-[right_0.5rem_center] bg-no-repeat"
        >
            {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
            ))}
        </select>
    </div>
);

const CustomerInquiryPage = () => {
    return (
        <div className="space-y-4 max-w-[1400px] mx-auto pb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                    <h1 className="text-xl font-bold text-[#1A3B3E]">Inquiry <span className="text-gray-400 font-normal text-sm">Management</span></h1>
                </div>
                <div className="flex items-center gap-1.5 bg-white border border-gray-100 px-2 py-1 rounded-md text-gray-500 text-[10px] font-medium shadow-sm">
                    <Calendar size={14} />
                    Dec 23, 2024 - Dec 30, 2023
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 lg:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-[#1A3B3E]">Image Upload</span>
                            <button className="bg-gray-100 p-1.5 rounded-md text-gray-500 hover:bg-[#00A8BC]/10 hover:text-[#00A8BC] transition-colors">
                                <Upload size={16} />
                            </button>
                        </div>

                        <section className="space-y-3">
                            <h2 className="text-base font-bold text-[#1A3B3E] mb-3">Contact Info</h2>
                            <InputField label="Name" />
                            <InputField label="Email" type="email" />
                            <InputField label="Phone" />
                            <InputField label="Company" />
                            <SelectField label="Source" options={["Select Source", "Referral", "Website", "Direct"]} />
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-base font-bold text-[#1A3B3E] mb-3 mt-6">Product Info</h2>
                            <InputField label="Product" />
                            <InputField label="Qty" />
                            <SelectField label="Terms" options={["Select Terms", "FOB", "CIF"]} />
                            <InputField label="Date" type="date" />
                            <InputField label="Dest" />

                            <div className="grid grid-cols-3 gap-4 pt-4">
                                <div className="text-right pr-4">
                                    <span className="text-xs text-gray-400 font-bold block leading-tight">Supporting Documents</span>
                                    <button className="mt-2 text-[10px] flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-[#00A8BC] transition-colors">
                                        <Paperclip size={14} className="text-[#00A8BC]" />
                                        Attach File
                                    </button>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-xs text-gray-400 font-bold block mb-2">Documents Description</span>
                                    <textarea
                                        className="w-full h-24 bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#00A8BC]/20 transition-all text-sm"
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <section className="space-y-3">
                            <h2 className="text-base font-bold text-[#1A3B3E] mb-3">Inquiry Details</h2>
                            <SelectField label="Type" options={["Select Type", "Product Inquiry", "Service Inquiry"]} />
                            <InputField label="Date" type="date" />
                            <SelectField label="Status" options={["Select Status", "Open", "Pending", "Closed"]} />
                            <div className="grid grid-cols-3 items-center gap-4">
                                <label className="text-right text-sm font-semibold text-[#5F7E82] pr-4">Priority</label>
                                <span className="col-span-2 text-[9px] text-gray-400 font-medium bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100 italic">
                                    Low, Medium & High
                                </span>
                            </div>
                        </section>

                        <div className="space-y-6 pt-10">
                            <div className="grid grid-cols-3 gap-4">
                                <label className="text-right text-sm font-semibold text-[#5F7E82] pr-4 pt-1">Follow-up</label>
                                <div className="col-span-2 space-y-3">
                                    <input type="text" placeholder="Date for next follow-up" className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2 px-4 shadow-inner text-sm outline-none" />
                                    <input type="text" placeholder="Notes on next steps" className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2 px-4 shadow-inner text-sm outline-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <label className="text-right text-sm font-semibold text-[#5F7E82] pr-4 pt-1">Notes</label>
                                <div className="col-span-2 relative">
                                    <textarea
                                        placeholder="Sales Representative's remarks:"
                                        className="w-full h-24 bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#00A8BC]/20 transition-all text-sm shadow-inner"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <label className="text-right text-sm font-semibold text-[#5F7E82] pr-4 pt-1">Comments</label>
                                <div className="col-span-2">
                                    <textarea
                                        className="w-full h-24 bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#00A8BC]/20 transition-all shadow-inner"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-50">
                            <button className="bg-[#00A8BC] text-white px-5 py-1.5 rounded-md font-bold text-xs shadow-md shadow-[#00A8BC]/20 hover:scale-105 active:scale-95 transition-all">
                                Save
                            </button>
                            <button className="bg-white text-[#00A8BC] border border-[#00A8BC]/40 px-5 py-1.5 rounded-md font-bold text-xs hover:bg-gray-50 transition-all">
                                Submit
                            </button>
                            <button className="bg-gray-100 text-[#1A3B3E]/60 px-5 py-1.5 rounded-md font-bold text-xs hover:bg-gray-200 transition-all">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerInquiryPage;

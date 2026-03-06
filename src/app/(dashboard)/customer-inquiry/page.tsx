'use client';

import React, { useState } from 'react';
import { Upload, Paperclip, Calendar, X, CheckCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { cn } from '@/lib/utils';

// ─── Field Components ────────────────────────────────────────────────────────

const InputField = ({
    label, placeholder, type = 'text', value, onChange, required = false
}: {
    label: string; placeholder?: string; type?: string;
    value: string; onChange: (v: string) => void; required?: boolean;
}) => (
    <div className="grid grid-cols-3 items-center gap-4">
        <label className="text-right text-sm font-semibold text-[#5F7E82] pr-4">
            {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        <input
            type={type}
            placeholder={placeholder}
            required={required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="col-span-2 w-full bg-white border border-gray-200 rounded-lg py-1.5 px-3 focus:ring-2 focus:ring-[#00A8BC]/20 focus:border-[#00A8BC] outline-none transition-all placeholder:text-gray-300 shadow-sm text-sm"
        />
    </div>
);

const SelectField = ({
    label, options, value, onChange, required = false
}: {
    label: string; options: { value: string; label: string }[];
    value: string; onChange: (v: string) => void; required?: boolean;
}) => (
    <div className="grid grid-cols-3 items-center gap-4">
        <label className="text-right text-sm font-semibold text-[#5F7E82] pr-4">
            {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        <select
            required={required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="col-span-2 w-full bg-white border border-gray-200 rounded-lg py-1.5 px-3 focus:ring-2 focus:ring-[#00A8BC]/20 focus:border-[#00A8BC] outline-none transition-all text-sm text-gray-700 shadow-sm"
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    </div>
);

// ─── Initial State ───────────────────────────────────────────────────────────

const INITIAL_FORM = {
    // Customer info
    name: '',
    email: '',
    phone: '',
    company: '',
    source: '',
    // Product info
    product: '',
    quantity: '',
    terms: '',
    inquiryDate: '',
    destination: '',
    // Inquiry details
    inquiryType: 'product',
    detailDate: '',
    status: 'pending',
    priority: 'medium',
    // Notes
    description: '',
    notes: '',
    comments: '',
    // Follow-up
    followUpDate: '',
    followUpNotes: '',
    // Document
    documentDescription: '',
};

// ─── Main Component ──────────────────────────────────────────────────────────

const CustomerInquiryPage = () => {
    const [form, setForm] = useState(INITIAL_FORM);
    const [document, setDocument] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const set = (field: keyof typeof INITIAL_FORM) => (value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    // File upload handler with client-side validation
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp',
            'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const maxSizeMB = 5;

        if (!allowedTypes.includes(file.type)) {
            setError('Invalid file type. Allowed: PDF, JPG, PNG, WebP, DOC, DOCX');
            return;
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
            setError(`File is too large. Maximum size is ${maxSizeMB}MB.`);
            return;
        }

        setError('');
        setDocument(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Client-side required field check
        if (!form.name || !form.email) {
            setError('Customer Name and Email are required.');
            return;
        }

        setIsLoading(true);

        try {
            // Step 1: Create or find the customer
            const customerRes = await apiFetch<{ id: number }>('/api/customers/', {
                method: 'POST',
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    company_name: form.company,
                    source: form.source,
                }),
            });

            if (!customerRes.ok || !customerRes.data?.id) {
                const errData = customerRes.data as Record<string, unknown>;
                const msg = errData?.email
                    ? 'Email already registered. Use a different email.'
                    : 'Failed to save customer info.';
                setError(msg);
                return;
            }

            const customerId = customerRes.data.id;

            // Step 2: Create the inquiry (with optional file)
            const formData = new FormData();
            formData.append('customer', String(customerId));
            formData.append('subject', form.product || form.description || 'New Inquiry');
            formData.append('inquiry_type', form.inquiryType);
            formData.append('status', form.status);
            formData.append('priority', form.priority);
            formData.append('product', form.product);
            formData.append('quantity', form.quantity);
            formData.append('terms', form.terms);
            formData.append('destination', form.destination);
            formData.append('description', form.description);
            formData.append('notes', form.notes);
            formData.append('comments', form.comments);
            formData.append('follow_up_notes', form.followUpNotes);
            formData.append('document_description', form.documentDescription);

            if (form.inquiryDate) formData.append('inquiry_date', form.inquiryDate);
            if (form.followUpDate) formData.append('follow_up_date', form.followUpDate);
            if (document) formData.append('document', document);

            // For multipart uploads, do NOT set Content-Type (browser sets it with boundary)
            const inquiryRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/inquiries/`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            if (inquiryRes.ok) {
                setSuccess(true);
                setForm(INITIAL_FORM);
                setDocument(null);
                setTimeout(() => setSuccess(false), 4000);
            } else {
                const errData = await inquiryRes.json().catch(() => ({}));
                const messages = Object.entries(errData as Record<string, unknown>)
                    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(' ') : v}`)
                    .join(' | ');
                setError(messages || 'Failed to submit inquiry.');
            }
        } catch {
            setError('Cannot connect to server. Is the backend running?');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4 max-w-[1400px] mx-auto pb-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                    <h1 className="text-xl font-bold text-[#1A3B3E]">
                        Inquiry <span className="text-gray-400 font-normal text-sm">Management</span>
                    </h1>
                </div>
                <div className="flex items-center gap-1.5 bg-white border border-gray-100 px-2 py-1 rounded-md text-gray-500 text-[10px] font-medium shadow-sm">
                    <Calendar size={14} />
                    {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
            </div>

            {/* Alerts */}
            {error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-200">
                    <X size={16} className="shrink-0" />
                    {error}
                </div>
            )}
            {success && (
                <div className="flex items-center gap-2 bg-green-50 text-green-600 p-3 rounded-xl text-sm font-medium border border-green-200">
                    <CheckCircle size={16} className="shrink-0" />
                    Inquiry submitted successfully!
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 lg:p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">

                        {/* ── Left Column ── */}
                        <div className="space-y-6">
                            {/* Image Upload */}
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-[#1A3B3E]">Image Upload</span>
                                <label className="bg-gray-100 p-1.5 rounded-md text-gray-500 hover:bg-[#00A8BC]/10 hover:text-[#00A8BC] transition-colors cursor-pointer">
                                    <Upload size={16} />
                                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                </label>
                                {document && (
                                    <span className="text-[10px] text-[#00A8BC] font-medium truncate max-w-[120px]">
                                        {document.name}
                                    </span>
                                )}
                            </div>

                            {/* Contact Info */}
                            <section className="space-y-3">
                                <h2 className="text-base font-bold text-[#1A3B3E] mb-3">Contact Info</h2>
                                <InputField label="Name" placeholder="Full name" value={form.name} onChange={set('name')} required />
                                <InputField label="Email" placeholder="customer@email.com" type="email" value={form.email} onChange={set('email')} required />
                                <InputField label="Phone" placeholder="+92 300 1234567" value={form.phone} onChange={set('phone')} />
                                <InputField label="Company" placeholder="Company name" value={form.company} onChange={set('company')} />
                                <SelectField label="Source" value={form.source} onChange={set('source')} options={[
                                    { value: '', label: 'Select Source' },
                                    { value: 'referral', label: 'Referral' },
                                    { value: 'website', label: 'Website' },
                                    { value: 'direct', label: 'Direct' },
                                    { value: 'other', label: 'Other' },
                                ]} />
                            </section>

                            {/* Product Info */}
                            <section className="space-y-3">
                                <h2 className="text-base font-bold text-[#1A3B3E] mb-3 mt-6">Product Info</h2>
                                <InputField label="Product" placeholder="Product name" value={form.product} onChange={set('product')} />
                                <InputField label="Qty" placeholder="e.g. 500 pcs" value={form.quantity} onChange={set('quantity')} />
                                <SelectField label="Terms" value={form.terms} onChange={set('terms')} options={[
                                    { value: '', label: 'Select Terms' },
                                    { value: 'FOB', label: 'FOB' },
                                    { value: 'CIF', label: 'CIF' },
                                    { value: 'EXW', label: 'EXW' },
                                ]} />
                                <InputField label="Date" type="date" value={form.inquiryDate} onChange={set('inquiryDate')} />
                                <InputField label="Dest" placeholder="Destination" value={form.destination} onChange={set('destination')} />

                                {/* Document Upload */}
                                <div className="grid grid-cols-3 gap-4 pt-4">
                                    <div className="text-right pr-4">
                                        <span className="text-xs text-gray-400 font-bold block leading-tight">Supporting Documents</span>
                                        <label className="mt-2 text-[10px] flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-[#00A8BC] transition-colors cursor-pointer">
                                            <Paperclip size={14} className="text-[#00A8BC]" />
                                            Attach File
                                            <input
                                                type="file"
                                                accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                        {document && (
                                            <span className="text-[9px] text-green-600 font-medium mt-1 block truncate">{document.name}</span>
                                        )}
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-xs text-gray-400 font-bold block mb-2">Documents Description</span>
                                        <textarea
                                            className="w-full h-24 bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#00A8BC]/20 transition-all text-sm"
                                            placeholder="Describe the attached documents…"
                                            value={form.documentDescription}
                                            onChange={(e) => set('documentDescription')(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* ── Right Column ── */}
                        <div className="space-y-6">
                            <section className="space-y-3">
                                <h2 className="text-base font-bold text-[#1A3B3E] mb-3">Inquiry Details</h2>
                                <SelectField label="Type" value={form.inquiryType} onChange={set('inquiryType')} options={[
                                    { value: 'product', label: 'Product Inquiry' },
                                    { value: 'service', label: 'Service Inquiry' },
                                ]} />
                                <InputField label="Date" type="date" value={form.detailDate} onChange={set('detailDate')} />
                                <SelectField label="Status" value={form.status} onChange={set('status')} options={[
                                    { value: 'pending', label: 'Pending' },
                                    { value: 'quoted', label: 'Quoted' },
                                    { value: 'confirmed', label: 'Confirmed' },
                                    { value: 'closed', label: 'Closed' },
                                ]} />
                                <SelectField label="Priority" value={form.priority} onChange={set('priority')} options={[
                                    { value: 'low', label: 'Low' },
                                    { value: 'medium', label: 'Medium' },
                                    { value: 'high', label: 'High' },
                                ]} />
                            </section>

                            {/* Notes & Follow-up */}
                            <div className="space-y-5 pt-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <label className="text-right text-sm font-semibold text-[#5F7E82] pr-4 pt-1">Follow-up</label>
                                    <div className="col-span-2 space-y-2">
                                        <input
                                            type="date"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2 px-4 shadow-inner text-sm outline-none focus:ring-2 focus:ring-[#00A8BC]/20"
                                            value={form.followUpDate}
                                            onChange={(e) => set('followUpDate')(e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Notes on next steps"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2 px-4 shadow-inner text-sm outline-none focus:ring-2 focus:ring-[#00A8BC]/20"
                                            value={form.followUpNotes}
                                            onChange={(e) => set('followUpNotes')(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <label className="text-right text-sm font-semibold text-[#5F7E82] pr-4 pt-1">Notes</label>
                                    <div className="col-span-2">
                                        <textarea
                                            placeholder="Sales Representative's remarks…"
                                            className="w-full h-24 bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#00A8BC]/20 transition-all text-sm shadow-inner"
                                            value={form.notes}
                                            onChange={(e) => set('notes')(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <label className="text-right text-sm font-semibold text-[#5F7E82] pr-4 pt-1">Comments</label>
                                    <div className="col-span-2">
                                        <textarea
                                            className="w-full h-24 bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#00A8BC]/20 transition-all text-sm shadow-inner"
                                            value={form.comments}
                                            onChange={(e) => set('comments')(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => { setForm(INITIAL_FORM); setDocument(null); setError(''); }}
                                    className="bg-gray-100 text-[#1A3B3E]/60 px-5 py-1.5 rounded-md font-bold text-xs hover:bg-gray-200 transition-all"
                                >
                                    Clear
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={cn(
                                        "bg-[#00A8BC] text-white px-6 py-1.5 rounded-md font-bold text-xs shadow-md shadow-[#00A8BC]/20 hover:scale-105 active:scale-95 transition-all",
                                        isLoading && "opacity-60 scale-100 cursor-not-allowed"
                                    )}
                                >
                                    {isLoading ? 'Submitting…' : 'Submit Inquiry'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CustomerInquiryPage;

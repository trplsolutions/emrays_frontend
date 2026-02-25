'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { motion } from 'framer-motion';

// Password strength rules (also enforced on backend via min_length=9)
const validatePassword = (pass: string): string => {
    if (pass.length < 9) return 'Password must be at least 9 characters.';
    if (!/[a-zA-Z]/.test(pass)) return 'Password must contain letters.';
    if (!/\d/.test(pass)) return 'Password must contain at least one number.';
    if (!/[@$!%*?&]/.test(pass)) return 'Password must contain a special character (@$!%*?&).';
    return '';
};

const SignUpPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({ username: '', name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Client-side password validation first
        const passError = validatePassword(formData.password);
        if (passError) { setError(passError); return; }

        setIsLoading(true);

        const { data, ok, status } = await apiFetch<Record<string, unknown>>('/api/auth/register/', {
            method: 'POST',
            body: JSON.stringify({
                username: formData.username.trim(),
                email: formData.email.trim(),
                password: formData.password,
                first_name: formData.name.split(' ')[0] || '',
                last_name: formData.name.split(' ').slice(1).join(' ') || '',
            }),
        });

        setIsLoading(false);

        if (ok) {
            setSuccess(true);
            setTimeout(() => router.push('/login'), 1500);
        } else if (status === 0) {
            setError('Cannot reach server. Is the backend running?');
        } else if (data && typeof data === 'object') {
            // DRF returns field-level errors as { fieldName: ["msg"] }
            const messages = Object.entries(data)
                .map(([field, val]) => {
                    const msg = Array.isArray(val) ? val.join(' ') : String(val);
                    return `${field}: ${msg}`;
                })
                .join(' | ');
            setError(messages || 'Registration failed.');
        } else {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-[#E6F7F9] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
            >
                <div className="text-center mb-8">
                    <h1 className="text-[#00A8BC] text-3xl font-extrabold mb-2">EMRAYS</h1>
                    <p className="text-gray-500 font-medium italic text-sm">Join the Vector Hub</p>
                </div>

                {/* Success banner */}
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-50 text-green-600 p-3 rounded-xl text-sm font-semibold mb-5 border border-green-200"
                    >
                        Account created! Redirecting to login…
                    </motion.div>
                )}

                {/* Error banner */}
                {error && !success && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-semibold mb-5 border border-red-200"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1 ml-1 uppercase tracking-wider">
                            Username
                        </label>
                        <input
                            type="text"
                            required
                            autoComplete="username"
                            placeholder="User Name"
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-[#00A8BC] focus:bg-white rounded-2xl py-3 px-5 outline-none transition-all placeholder:text-gray-300"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1 ml-1 uppercase tracking-wider">
                            Full Name
                        </label>
                        <input
                            type="text"
                            placeholder="User Full Name"
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-[#00A8BC] focus:bg-white rounded-2xl py-3 px-5 outline-none transition-all placeholder:text-gray-300"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1 ml-1 uppercase tracking-wider">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            autoComplete="email"
                            placeholder="User Email"
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-[#00A8BC] focus:bg-white rounded-2xl py-3 px-5 outline-none transition-all placeholder:text-gray-300"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1 ml-1 uppercase tracking-wider">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPass ? 'text' : 'password'}
                                required
                                autoComplete="new-password"
                                placeholder="••••••••"
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-[#00A8BC] focus:bg-white rounded-2xl py-3 px-5 pr-12 outline-none transition-all placeholder:text-gray-300"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass((s) => !s)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00A8BC] transition-colors"
                            >
                                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 ml-2">
                            Min 9 chars · letters · numbers · symbols (@$!%*?&)
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || success}
                        className="w-full bg-[#00A8BC] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#00A8BC]/20 hover:scale-[1.02] active:scale-95 transition-all mt-2 disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creating Account…' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center mt-7 text-gray-500 text-sm">
                    Already have an account?{' '}
                    <Link href="/login" className="text-[#00A8BC] font-bold hover:underline">
                        Login here
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default SignUpPage;

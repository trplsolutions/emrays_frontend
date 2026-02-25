'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/useStore';
import { apiFetch } from '@/lib/api';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const { data, ok, status } = await apiFetch<{
            message?: string;
            user?: { id: number; name: string; email: string; role: string };
            error?: string;
        }>('/api/auth/login/', {
            method: 'POST',
            body: JSON.stringify({
                username: formData.identifier,
                password: formData.password,
            }),
        });

        setIsLoading(false);

        if (ok && data?.user) {
            login(data.user);
            router.push('/dashboard');
        } else if (status === 0) {
            setError('Cannot connect to server. Is the backend running?');
        } else {
            setError(data?.error || 'Invalid credentials. Please try again.');
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
                    <p className="text-gray-500 font-medium italic text-sm">Welcome Back to Vector Hub</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-semibold mb-5 border border-red-200"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                            Email or Username
                        </label>
                        <input
                            type="text"
                            required
                            autoComplete="username"
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-[#00A8BC] focus:bg-white rounded-2xl py-3 px-5 outline-none transition-all placeholder:text-gray-300"
                            placeholder="User Name or Email"
                            value={formData.identifier}
                            onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPass ? 'text' : 'password'}
                                required
                                autoComplete="current-password"
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-[#00A8BC] focus:bg-white rounded-2xl py-3 px-5 pr-12 outline-none transition-all placeholder:text-gray-300"
                                placeholder="••••••••"
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
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold text-[#00A8BC] px-1">
                        <label className="flex items-center gap-2 cursor-pointer text-gray-400 font-normal">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-200 accent-[#00A8BC]" />
                            Remember Me
                        </label>
                        <button type="button" className="underline hover:no-underline">Forgot Password?</button>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#00A8BC] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#00A8BC]/20 hover:scale-[1.02] active:scale-95 transition-all mt-2 disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Signing in…' : 'Login'}
                    </button>
                </form>

                <p className="text-center mt-7 text-gray-500 text-sm">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="text-[#00A8BC] font-bold hover:underline">
                        Sign up
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;

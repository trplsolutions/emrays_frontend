'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useStore';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate login
        login({ name: 'Zaras John', role: 'Sales Person' });
        router.push('/dashboard');
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

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-[#00A8BC] focus:bg-white rounded-2xl py-3 px-5 outline-none transition-all placeholder:text-gray-300"
                            placeholder="zaras@emrays.com"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-[#00A8BC] focus:bg-white rounded-2xl py-3 px-5 outline-none transition-all placeholder:text-gray-300"
                            placeholder="••••••••"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold underline text-[#00A8BC] px-1">
                        <label className="flex items-center gap-2 cursor-pointer no-underline text-gray-400">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-200 accent-[#00A8BC]" />
                            Remember Me
                        </label>
                        <button type="button">Forgot Password?</button>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#00A8BC] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#00A8BC]/20 hover:scale-[1.02] active:scale-95 transition-all mt-4"
                    >
                        Login
                    </button>
                </form>

                <p className="text-center mt-8 text-gray-500 text-sm">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-[#00A8BC] font-bold hover:underline decoration-2">
                        Sign up
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;

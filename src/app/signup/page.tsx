'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useStore';
import { motion } from 'framer-motion';

const SignUpPage = () => {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate signup
        router.push('/login');
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

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Full Name</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-[#00A8BC] focus:bg-white rounded-2xl py-3 px-5 outline-none transition-all placeholder:text-gray-300"
                            placeholder="Zaras John"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
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

                    <button
                        type="submit"
                        className="w-full bg-[#00A8BC] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#00A8BC]/20 hover:scale-[1.02] active:scale-95 transition-all mt-4"
                    >
                        Create Account
                    </button>
                </form>

                <p className="text-center mt-8 text-gray-500 text-sm">
                    Already have an account?{' '}
                    <Link href="/login" className="text-[#00A8BC] font-bold hover:underline decoration-2">
                        Login here
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default SignUpPage;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';

const ForgotPassword = () => {
    // --- 1. STATE MANAGEMENT ---
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [resetLink, setResetLink] = useState('');

    // --- 2. HANDLER LOGIC ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });
        setResetLink('');

        try {
            const registeredUsers = JSON.parse(localStorage.getItem('skillhub_registered_users') || '[]');
            const userIndex = registeredUsers.findIndex((user) => user.email === email);

            if (userIndex === -1) {
                throw new Error('We could not find an account with that email address.');
            }

            const token = `reset-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
            const expiresAt = Date.now() + 1000 * 60 * 30;

            registeredUsers[userIndex] = {
                ...registeredUsers[userIndex],
                resetToken: token,
                resetTokenExpiresAt: expiresAt,
            };

            localStorage.setItem('skillhub_registered_users', JSON.stringify(registeredUsers));
            setStatus({ 
                type: 'success', 
                message: 'Reset link created. Open it to choose a new password.' 
            });
            setResetLink(`/reset-password/${token}`);
        } catch (error) {
            // Error State
            setStatus({ 
                type: 'error', 
                message: error.message 
            });
        } finally {
            setLoading(false);
        }
    };

    // --- 3. RENDER UI ---
    return (
        <AuthLayout
            title="Reset Password"
            subtitle="Enter your email and we'll send you a link to get back into your account."
        >
            {/* Status Message Display */}
            {status.message && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-2 text-sm backdrop-blur-sm border ${
                    status.type === 'success' 
                        ? 'bg-green-500/20 border-green-500/50 text-green-200' 
                        : 'bg-red-500/20 border-red-500/50 text-red-200'
                }`}>
                    {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    {status.message}
                </div>
            )}

            {resetLink && (
                <div className="mb-6 rounded-xl border border-blue-500/40 bg-blue-500/15 p-4 text-sm text-blue-100">
                    <p className="mb-2 font-medium">Reset link</p>
                    <Link to={resetLink} className="break-all text-blue-200 underline decoration-blue-300 underline-offset-4 hover:text-white">
                        {resetLink}
                    </Link>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Email Address
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            required
                            className="block w-full pl-10 pr-3 py-3 bg-black/20 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                            placeholder="your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-blue-900 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
                        loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="animate-spin h-5 w-5" /> Sending Link...
                        </span>
                    ) : (
                        'Send Reset Link'
                    )}
                </button>
            </form>

            {/* Back to Login Link */}
            <div className="mt-8 flex justify-center">
                <Link 
                    to="/login" 
                    className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Login
                </Link>
            </div>
        </AuthLayout>
    );
};

export default ForgotPassword;
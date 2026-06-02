import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';

const ResetPassword = () => {
    // --- 1. STATE MANAGEMENT ---
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Get the reset token from the URL
    const { token } = useParams();
    const navigate = useNavigate();

    // --- 2. HANDLER LOGIC ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validation: Check if passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        // Validation: Check length
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        try {
            const registeredUsers = JSON.parse(localStorage.getItem('skillhub_registered_users') || '[]');
            const userIndex = registeredUsers.findIndex(
                (user) => user.resetToken === token && (!user.resetTokenExpiresAt || Date.now() <= user.resetTokenExpiresAt)
            );

            if (userIndex === -1) {
                throw new Error('This reset link is invalid or has expired. Please request a new one.');
            }

            registeredUsers[userIndex] = {
                ...registeredUsers[userIndex],
                password,
                resetToken: null,
                resetTokenExpiresAt: null,
            };

            localStorage.setItem('skillhub_registered_users', JSON.stringify(registeredUsers));

            // Success State
            setSuccess(true);
            
            // Redirect after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // --- 3. CONDITIONAL RENDER: SUCCESS STATE ---
    if (success) {
        return (
            <AuthLayout title="Success" subtitle="">
                <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 border border-green-500/50 mb-6">
                                <CheckCircle className="h-8 w-8 text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                Password Reset Successful!
                            </h3>
                            <p className="mt-2 text-sm text-gray-300">
                                You can now login with your new password. Redirecting you to login...
                            </p>
                            <div className="mt-6">
                                <Link 
                                    to="/login" 
                                    className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors"
                                >
                                    Click here if not redirected
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthLayout>
        );
    }

    // --- 4. CONDITIONAL RENDER: FORM STATE ---
    return (
        <AuthLayout 
            title="Set New Password"
            subtitle="Your new password must be different from previously used passwords."
        >
            {/* Error Alert */}
            {error && (
                <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg flex items-center gap-2 text-sm backdrop-blur-sm">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
                
                {/* Input Field: New Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        New Password
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            className="block w-full pl-10 pr-10 py-3 bg-black/20 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Input Field: Confirm Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Confirm New Password
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            className="block w-full pl-10 pr-10 py-3 bg-black/20 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-blue-900 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
                            loading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? (
                            <Loader2 className="animate-spin h-5 w-5" /> 
                        ) : (
                            'Reset Password'
                        )}
                    </button>
                </div>
            </form>

            {/* Footer Links */}
            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-transparent text-gray-400">
                            Remember your password?
                        </span>
                    </div>
                </div>

                <div className="mt-6 flex justify-center">
                    <Link 
                        to="/login" 
                        className="flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Login
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
};

export default ResetPassword;
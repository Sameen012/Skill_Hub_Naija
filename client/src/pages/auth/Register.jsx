import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Loader2, AlertCircle, Check, Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    // Password strength calculator
    const calculatePasswordStrength = (password) => {
        if (!password) return 0;
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const passwordStrength = calculatePasswordStrength(formData.password);
    const getStrengthLabel = (level) => {
        if (level === 0) return '';
        if (level <= 2) return 'Weak';
        if (level <= 3) return 'Fair';
        if (level <= 4) return 'Good';
        return 'Strong';
    };

    const getStrengthColor = (level) => {
        if (level === 0) return 'bg-gray-600';
        if (level <= 2) return 'bg-red-500';
        if (level <= 3) return 'bg-yellow-500';
        if (level <= 4) return 'bg-blue-500';
        return 'bg-green-500';
    };

    const passwordsMatch = formData.password === formData.confirmPassword && formData.password !== '';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await register(formData.name, formData.email, formData.password, formData.confirmPassword);
            navigate('/dashboard/learner'); 
        } catch (err) {
            setError(err || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Register"
            subtitle={
                <>
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                        Login
                    </Link>
                </>
            }
        >
            {error && (
                <div className="mb-6 p-3 rounded-lg bg-red-500/20 border border-red-500/50 flex items-center gap-3 text-red-200 text-sm backdrop-blur-sm">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
                
                {/* Name Input */}
                <div>
                    <label className="theme-label mb-1">Full Name</label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <User className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                        </div>
                        <input
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="theme-input pl-10"
                            placeholder="Your full name"
                        />
                    </div>
                </div>

                {/* Email Input */}
                <div>
                    <label className="theme-label mb-1">Email Address</label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Mail className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                        </div>
                        <input
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="theme-input pl-10"
                            placeholder="you@gmail.com"
                        />
                    </div>
                </div>

                {/* Password Input */}
                <div>
                    <label className="theme-label mb-1">Password</label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Lock className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                        </div>
                        <input
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="theme-input pl-10 pr-12"
                            placeholder="Create a password (min. 6 characters)"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((current) => !current)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {/* Password Strength Indicator */}
                    {formData.password && (
                        <div className="mt-2 space-y-2">
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 flex-1 rounded-full transition-all ${
                                            i < passwordStrength ? getStrengthColor(passwordStrength) : 'bg-gray-700'
                                        }`}
                                    />
                                ))}
                            </div>
                            <p className={`text-xs font-medium ${ passwordStrength <= 2 ? 'text-red-400' : passwordStrength <= 3 ? 'text-yellow-400' : 'text-green-400' }`}>
                                Password Strength: {getStrengthLabel(passwordStrength)}
                            </p>
                        </div>
                    )}
                </div>

                {/* Confirm Password Input */}
                <div>
                    <label className="theme-label mb-1">Confirm Password</label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Lock className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                        </div>
                        <input
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="theme-input pl-10 pr-12"
                            placeholder="Repeat password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((current) => !current)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        {formData.confirmPassword && (
                            <div className={`absolute inset-y-0 right-10 flex items-center ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}>
                                {passwordsMatch ? <Check size={20} /> : <AlertCircle size={20} />}
                            </div>
                        )}
                    </div>
                    {formData.confirmPassword && !passwordsMatch && (
                        <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 flex justify-center rounded-xl border border-transparent bg-white px-4 py-3.5 text-sm font-bold text-blue-900 shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign Up'}
                </button>
            </form>
        </AuthLayout>
    );
};

export default Register;
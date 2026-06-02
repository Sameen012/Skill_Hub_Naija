import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const loggedInUser = await login(formData.email, formData.password);
            const targetRoute =
                loggedInUser?.role === 'admin'
                    ? '/dashboard/admin'
                    : loggedInUser?.role === 'instructor'
                    ? '/dashboard/instructor'
                    : '/dashboard/learner';

            navigate(targetRoute);
        } catch (err) {
            setError(err?.message || err || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Login"
            subtitle={
                <>
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                        Register
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

            <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Email Input */}
                <div>
                    <label className="theme-label mb-1">Email</label>
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
                            placeholder="you@example.com"
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
                            placeholder="••••••••"
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
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-900 dark:focus:ring-blue-400 dark:focus:ring-offset-slate-950" />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-500 dark:text-slate-400">Remember me</label>
                        </div>
                        <div className="text-sm">
                            <Link to="/forgot-password" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                                Forgot Password?
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center rounded-xl border border-transparent bg-white px-4 py-3.5 text-sm font-bold text-blue-900 shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Login'}
                </button>
            </form>
        </AuthLayout>
    );
};

export default Login;
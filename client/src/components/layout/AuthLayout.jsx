import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Sparkles } from 'lucide-react';
import skillHubLogo from '../../assets/images/Skill_Hub_Naija.png';
import ThemeToggle from '../common/ThemeToggle.jsx';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="relative flex min-h-screen w-full overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
            <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
                <ThemeToggle />
            </div>
            
            {/* --- ANIMATED BACKGROUND (Moving Blobs & Stars) --- */}
            <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                {/* Moving Blobs */}
                <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-600/20 mix-blend-screen blur-[100px] animate-blob dark:bg-purple-500/20"></div>
                <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/20 mix-blend-screen blur-[100px] animate-blob dark:bg-blue-500/20" style={{ animationDelay: '2s' }}></div>
                
                {/* Twinkling Stars Effect */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 animate-pulse dark:opacity-20"></div>
            </div>

            {/* --- LEFT SIDE: Professional Info (Hidden on Mobile) --- */}
            <div className="hidden w-1/2 flex-col justify-between border-r border-slate-200/70 bg-white/70 p-16 backdrop-blur-sm lg:flex dark:border-slate-800 dark:bg-slate-900/70">
                
                {/* Logo */}
                <div>
                    <Link to="/" className="inline-flex items-center gap-3 text-slate-900 transition-opacity hover:opacity-80 dark:text-white">
                        <img 
                            src={skillHubLogo} 
                            alt="Skill_Hub Logo" 
                            className="h-12 w-12 rounded-lg object-cover shadow-lg shadow-blue-500/20 transition-transform hover:scale-105"
                        />
                        <span className="text-2xl font-bold tracking-tight">Skill_Hub</span>
                    </Link>
                </div>

                {/* Main Content */}
                <div className="space-y-8">
                    <h1 className="text-5xl font-bold leading-tight text-slate-900 dark:text-white">
                        Master New Skills <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            Build Your Future
                        </span>
                    </h1>
                    <p className="max-w-md text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                        Join a community of ambitious learners. Access professional courses, earn certificates, and advance your career today.
                    </p>

                    {/* Features List */}
                    <div className="space-y-4 pt-4">
                        <div className="group flex items-center gap-4 text-slate-700 dark:text-slate-200">
                            <div className="rounded-lg border border-slate-200 bg-white/70 p-2 transition-colors group-hover:border-blue-500/50 dark:border-slate-700 dark:bg-slate-900/70">
                                <CheckCircle className="text-blue-400" size={20} />
                            </div>
                            <span className="font-medium">Industry-Standard Curriculum</span>
                        </div>
                        <div className="group flex items-center gap-4 text-slate-700 dark:text-slate-200">
                            <div className="rounded-lg border border-slate-200 bg-white/70 p-2 transition-colors group-hover:border-purple-500/50 dark:border-slate-700 dark:bg-slate-900/70">
                                <CheckCircle className="text-purple-400" size={20} />
                            </div>
                            <span className="font-medium">Verifiable Certificates</span>
                        </div>
                        <div className="group flex items-center gap-4 text-slate-700 dark:text-slate-200">
                            <div className="rounded-lg border border-slate-200 bg-white/70 p-2 transition-colors group-hover:border-green-500/50 dark:border-slate-700 dark:bg-slate-900/70">
                                <CheckCircle className="text-green-400" size={20} />
                            </div>
                            <span className="font-medium">Lifetime Access to Resources</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Sparkles size={14} className="text-yellow-500" />
                    Trusted by 10,000+ Students
                </div>
            </div>

            {/* --- RIGHT SIDE: The Neon Glass Form --- */}
            <div className="flex w-full items-center justify-center p-4 lg:w-1/2">
                <div className="w-full max-w-md">
                    {/* Glass Card Container */}
                    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-2xl backdrop-blur-xl transition-colors duration-300 sm:p-10 dark:border-slate-800 dark:bg-slate-900/90">
                        
                        {/* Subtle Card Glow */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                        {/* Mobile Logo (Visible only on small screens) */}
                        <div className="lg:hidden text-center mb-8">
                            <Link to="/" className="inline-flex items-center gap-2 text-slate-900 dark:text-white">
                                <img
                                    src={skillHubLogo}
                                    alt="Skill_Hub Logo"
                                    className="h-10 w-10 rounded-lg object-cover"
                                />
                                <span className="text-xl font-bold">Skill_Hub</span>
                            </Link>
                        </div>

                        {/* Form Header */}
                        <div className="text-center mb-8">
                            <h2 className="mb-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                {title}
                            </h2>
                            {subtitle && (
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    {subtitle}
                                </div>
                            )}
                        </div>

                        {/* The Form Content (Inputs & Buttons) */}
                        {children}
                    </div>

                    {/* Bottom Links */}
                    <div className="mt-8 text-center">
                        <p className="cursor-pointer text-xs text-slate-500 transition-colors hover:text-slate-400 dark:text-slate-500 dark:hover:text-slate-400">
                            &copy; 2026 SkillHub NG. Secure Authentication.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
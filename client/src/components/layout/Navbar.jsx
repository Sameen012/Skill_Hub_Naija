import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import Button from '../common/Button.jsx';
import ThemeToggle from '../common/ThemeToggle.jsx';
import { 
    Menu, 
    X, 
    Layout, 
    LogOut, 
    Home, 
    Layers, 
    FileText, 
    Info, 
    Award,
    Mail 
} from 'lucide-react';
import skillHubLogo from '../../assets/images/Skill_Hub_Naija.png';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsOpen(false);
    };

    const isActive = (path) => {
        return location.pathname === path 
            ? "text-blue-600 bg-blue-50 font-semibold dark:bg-blue-950/60 dark:text-blue-300" 
            : "text-slate-600 hover:text-blue-600 hover:bg-slate-100 font-medium dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white";
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur-md transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/90">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <img 
                                src={skillHubLogo} 
                                alt="Skill_Hub Logo" 
                                className="h-10 w-10 object-contain group-hover:scale-105 transition-transform duration-200"
                            />
                            <span className="text-xl font-bold text-slate-900 tracking-tight dark:text-white">
                                SkillHub<span className="text-blue-600">NG</span>
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-1">
                        <Link to="/" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${isActive('/')}`}>
                            <Home size={18} />
                            <span>Home</span>
                        </Link>

                        <Link to="/catalog" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${isActive('/catalog')}`}>
                            <Layers size={18} />
                            <span>Courses</span>
                        </Link>

                        <Link to="/resources" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${isActive('/resources')}`}>
                            <FileText size={18} />
                            <span>Resources</span>
                        </Link>

                        {!user && (
                            <Link to="/about" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${isActive('/about')}`}>
                                <Info size={18} />
                                <span>About</span>
                            </Link>
                        )}

                        {user ? (
                            <div className="flex items-center gap-3 pl-4 ml-2 border-l border-slate-200 dark:border-slate-800">
                                <Link to="/dashboard/learner">
                                    <Button variant="ghost" className={`flex items-center gap-2 ${location.pathname.includes('/dashboard') ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white' : ''}`}>
                                        <Layout size={18} /> Dashboard
                                    </Button>
                                </Link>
                                <ThemeToggle />
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={handleLogout} 
                                    className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 dark:border-red-900/50 dark:hover:bg-red-950/40"
                                >
                                    <LogOut size={16} />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 pl-4 ml-2 border-l border-slate-200 dark:border-slate-800">
                                <ThemeToggle />
                                <Link to="/login">
                                    <button className="px-5 py-2 text-slate-600 font-semibold rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">
                                        Log in
                                    </button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="primary" size="sm" className="shadow-md shadow-blue-500/20">Get Started</Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 md:hidden">
                        <ThemeToggle className="border-blue-200 bg-blue-50 text-blue-700 shadow-md shadow-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <>
                    <button
                        type="button"
                        aria-label="Close mobile menu"
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 z-40 cursor-default bg-slate-950/20 backdrop-blur-[1px] md:hidden"
                    />

                    <div className={`md:hidden fixed inset-x-0 top-16 z-50 animate-slide-in ${theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'}`}>
                        <div
                            className="max-h-[calc(100vh-4rem)] overflow-y-auto px-4 py-4 pr-6"
                            style={{ scrollbarGutter: 'stable' }}
                            onClick={(e) => {
                                // ignore clicks coming from the theme toggle
                                if (e.target.closest('button[aria-label^="Switch to"]')) return;
                                // if a link (<a>) inside the menu was clicked, close the overlay
                                const link = e.target.closest('a');
                                if (link) {
                                    setIsOpen(false);
                                    return;
                                }
                                // if a button (like logout) was clicked (but not theme toggle), close
                                const btn = e.target.closest('button');
                                if (btn && !btn.getAttribute('aria-label')?.startsWith('Switch to')) {
                                    // avoid closing when clicking the backdrop (it's a full-screen button)
                                    if (!btn.classList.contains('fixed')) setIsOpen(false);
                                }
                            }}
                        >
                            <div className={`rounded-2xl border p-3 shadow-sm ${theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                                <div className="flex items-center justify-between gap-3 mb-2">
                                    <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">Menu</span>
                                    <ThemeToggle className="w-fit border-blue-200 bg-blue-50 text-blue-700 shadow-md shadow-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
                                </div>

                                <div className="space-y-1">
                                    <Link to="/" onClick={() => setIsOpen(false)} className={`block rounded-lg px-4 py-3 text-base transition-all ${isActive('/')}`}>
                                        <div className="flex items-center gap-3"><Home size={20} /> Home</div>
                                    </Link>

                                    <Link to="/catalog" onClick={() => setIsOpen(false)} className={`block rounded-lg px-4 py-3 text-base transition-all ${isActive('/catalog')}`}>
                                        <div className="flex items-center gap-3"><Layers size={20} /> Courses</div>
                                    </Link>

                                    <Link to="/resources" onClick={() => setIsOpen(false)} className={`block rounded-lg px-4 py-3 text-base transition-all ${isActive('/resources')}`}>
                                        <div className="flex items-center gap-3"><FileText size={20} /> Resources</div>
                                    </Link>

                                    <Link to="/about" onClick={() => setIsOpen(false)} className={`block rounded-lg px-4 py-3 text-base transition-all ${isActive('/about')}`}>
                                        <div className="flex items-center gap-3"><Info size={20} /> About Us</div>
                                    </Link>

                                    <Link to="/contact" onClick={() => setIsOpen(false)} className={`block rounded-lg px-4 py-3 text-base transition-all ${isActive('/contact')}`}>
                                        <div className="flex items-center gap-3"><Mail size={20} /> Contact</div>
                                    </Link>
                                </div>

                                <div className="mt-3 border-t pt-3">
                                    {user ? (
                                        <div className="space-y-2">
                                            <Link to="/dashboard/learner" onClick={() => setIsOpen(false)} className="block rounded-lg px-4 py-3 text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 dark:text-slate-200 dark:hover:bg-slate-800">
                                                <div className="flex items-center gap-3"><Layout size={20} /> Dashboard</div>
                                            </Link>
                                            <Link to="/certifications" onClick={() => setIsOpen(false)} className="block rounded-lg px-4 py-3 text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 dark:text-slate-200 dark:hover:bg-slate-800">
                                                <div className="flex items-center gap-3"><Award size={20} /> My Certificates</div>
                                            </Link>
                                            <button onClick={handleLogout} className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50">
                                                <LogOut size={20} /> Logout
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            <Link to="/login" onClick={() => setIsOpen(false)} className="block">
                                                <button className="w-full px-4 py-3 text-center text-gray-600 font-semibold border border-gray-300 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">
                                                    Log in
                                                </button>
                                            </Link>
                                            <Link to="/register" onClick={() => setIsOpen(false)}>
                                                <Button variant="primary" className="w-full justify-center py-3 shadow-lg">Get Started</Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
};

export default Navbar;

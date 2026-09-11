import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext.jsx';
import { 
    LayoutDashboard, 
    BookOpen, 
    Award, 
    Settings, 
    LogOut,
    BarChart3,
    Bell,
    Layers3,
    ListChecks,
    Users,
} from 'lucide-react';
import skillHubLogo from '../../assets/images/Skill_Hub_Naija.png';
import ThemeToggle from '../common/ThemeToggle.jsx';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => {
        return location.pathname === path 
            ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" 
            : "text-slate-400 hover:bg-slate-800 hover:text-white";
    };

    const adminNavItems = [
        { label: 'Overview', icon: BarChart3, href: '#overview' },
        { label: 'Users', icon: Users, href: '#users' },
        { label: 'Courses', icon: Layers3, href: '#courses' },
        { label: 'Lessons', icon: ListChecks, href: '#lessons' },
        { label: 'Resources', icon: BookOpen, href: '#resources' },
        { label: 'Enrollments', icon: Users, href: '#enrollments' },
        { label: 'Notifications', icon: Bell, href: '#notifications' },
    ];

    return (
        <aside className={`relative z-50 flex w-full flex-col border-r text-white transition-colors duration-300 lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-64 ${theme === 'dark' ? 'border-slate-800 bg-slate-950' : 'border-slate-800 bg-slate-950'}`}>
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-3 mb-6">
                <img 
                    src={skillHubLogo} 
                    alt="Skill_Hub Logo" 
                    className="h-10 w-10 object-contain"
                />
                <span className="text-xl font-bold tracking-tight">Skill_Hub</span>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 space-y-2">
                {user?.role === 'admin' ? (
                    <>
                        <div className="px-4 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                            Admin Menu
                        </div>
                        {adminNavItems.map(({ label, icon: Icon, href }) => (
                            <a
                                key={label}
                                href={href}
                                className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-slate-300 transition-all duration-200 hover:bg-slate-800 hover:text-white"
                            >
                                <Icon size={20} />
                                {label}
                            </a>
                        ))}
                        <a
                            href="#overview"
                            className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-slate-300 transition-all duration-200 hover:bg-slate-800 hover:text-white"
                        >
                            <LayoutDashboard size={20} />
                            Dashboard
                        </a>
                    </>
                ) : (
                    <>
                        <Link to="/dashboard/learner" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive('/dashboard/learner')}`}>
                            <LayoutDashboard size={20} />
                            Dashboard
                        </Link>

                        <Link to="/catalog" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive('/catalog')}`}>
                            <BookOpen size={20} />
                            Browse Courses
                        </Link>

                        <Link to="/certifications" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive('/certifications')}`}>
                            <Award size={20} />
                            My Certificates
                        </Link>

                        <Link to="/settings" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive('/settings')}`}>
                            <Settings size={20} />
                            Settings
                        </Link>
                    </>
                )}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-800">
                <div className="mb-4 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Theme</span>
                    <ThemeToggle className="border-slate-700 bg-slate-900 px-2 py-1 text-xs" />
                </div>
                <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium text-slate-400 transition-all hover:bg-slate-800 hover:text-red-400"
                >
                    <LogOut size={20} />
                    Log Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
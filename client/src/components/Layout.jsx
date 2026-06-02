// components/Layout.jsx
import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">

            {/* 1. FIXED SIDEBAR */}
            {/* fixed = sticks to screen, w-64 = width 256px */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-slate-950 text-white">
                <div className="p-6">
                    <h1 className="text-xl font-bold">Skill Hub</h1>
                </div>

                {/* Navigation Links */}
                <nav className="mt-6 px-4 space-y-2">
                    <a href="#" className="block px-4 py-2 rounded hover:bg-white/10">Dashboard</a>
                    <a href="#" className="block px-4 py-2 rounded hover:bg-white/10">My Courses</a>
                    <a href="#" className="block px-4 py-2 rounded hover:bg-white/10">Settings</a>
                </nav>
            </aside>

            {/* 2. MAIN CONTENT WRAPPER */}
            {/* ml-64 = pushes content 256px to the right to match sidebar width */}
            <main className="ml-64 p-8">
                {children}
            </main>

        </div>
    );
};

export default Layout;
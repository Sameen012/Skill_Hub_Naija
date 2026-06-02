import React from 'react';
import { BookOpen } from 'lucide-react';

const Loader = ({ fullScreen = true, size = 'md' }) => {
    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center transition-all duration-300">
                <div className="relative">
                    {/* Pulsing Background Ring */}
                    <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>

                    {/* Central Logo */}
                    <div className="relative bg-white p-4 rounded-full shadow-xl border border-blue-50">
                        <BookOpen className="text-blue-600 animate-pulse" size={40} strokeWidth={2.5} />
                    </div>
                </div>

                {/* Bouncing Dots Text */}
                <div className="mt-8 flex flex-col items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                        SkillHub<span className="text-blue-600">NG</span>
                    </h3>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Inline version for small loading states (like inside buttons)
    const sizeClasses = {
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-4',
        lg: 'w-12 h-12 border-4'
    };

    return (
        <div className="flex justify-center items-center p-2">
            <div className={`${sizeClasses[size]} border-blue-200 border-t-blue-600 rounded-full animate-spin`}></div>
        </div>
    );
};

export default Loader;
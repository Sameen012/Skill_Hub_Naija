// src/components/common/Button.jsx
import React from 'react';

const Button = ({
                    children,
                    variant = 'primary',
                    size = 'md',
                    className = '',
                    ...props
                }) => {

    // Base styles
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-slate-950";

    // Variants
    const variants = {
        primary: "bg-blue-600 text-white shadow-sm shadow-blue-500/20 hover:bg-blue-500 focus:ring-blue-500",
        secondary: "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-500 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white",
        outline: "border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-50 focus:ring-slate-500 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
        ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-500 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };

    // Sizes
    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
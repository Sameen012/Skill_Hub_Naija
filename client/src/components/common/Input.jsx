import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="theme-label mb-1">
                    {label}
                </label>
            )}
            <input
                className={`theme-input sm:text-sm ${error ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500/20 dark:border-red-700 dark:text-red-100' : ''}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
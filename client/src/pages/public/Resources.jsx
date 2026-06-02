import React from 'react';

const Resources = () => {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex max-w-4xl items-center justify-center py-24">
        <div className="w-full rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-8 w-8" strokeWidth="1.8">
              <path d="M7 3h7l5 5v13H7z" />
              <path d="M14 3v5h5" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Resources are currently empty</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            User resources are intentionally left blank. Admin can upload PDF resources from the dashboard whenever needed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Resources;
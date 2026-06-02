// pages/MyCourses.jsx
import React from 'react';
import Layout from '../components/Layout'; // Import the layout we created above

const MyCourses = () => {
    return (
        <Layout>
            {/* This div is the white card background */}
            {/* h-[80vh] ensures we have enough height to center things vertically */}
            <div className="flex h-[80vh] w-full flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">

                {/* Search Icon Circle */}
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/60">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {/* Text Content */}
                <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">No courses started yet</h2>

                <p className="mb-8 max-w-md text-center text-slate-500 dark:text-slate-300">
                    You haven't enrolled in any courses. Visit the catalog to find a skill you want to master.
                </p>

                {/* Button */}
                <button className="rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition hover:bg-blue-700 active:scale-95">
                    Explore Course Catalog
                </button>

            </div>
        </Layout>
    );
};

export default MyCourses;
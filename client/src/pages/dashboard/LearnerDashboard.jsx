import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/layout/Sidebar'; // Ensure you created Sidebar.jsx
import { getCourseById } from '../../utils/courseStore.js';
import { 
    Clock, 
    CheckCircle, 
    Award, 
    PlayCircle, 
    Calendar, 
    BookOpen, 
    ArrowRight, 
    ImageOff 
} from 'lucide-react';

// --- Stat Card Component ---
const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center text-white shadow-sm`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
        </div>
    </div>
);

const LearnerDashboard = () => {
    const { user } = useAuth();
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [stats, setStats] = useState({ inProgress: 0, completed: 0, certificates: 0 });

    // --- EFFECT: Load Courses & Calculate Stats ---
    useEffect(() => {
        // 1. Get list of enrolled IDs from LocalStorage
        const enrolledIds = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');

        // 2. Map IDs to Real Course Data & Calculate Progress
        const courses = enrolledIds.map(id => {
            const courseData = getCourseById(id);
            if (!courseData) return null;

            // Get progress from LocalStorage
            const completedLessons = JSON.parse(localStorage.getItem(`progress_${id}`) || '[]');
            const totalModules = courseData.modules ? courseData.modules.length : 0;
            
            // --- PDF COURSE LOGIC (ID 6) ---
            // If it's the Computer Basics PDF course (ID 6), we mark it 100% complete automatically
            // otherwise, calculate based on video modules completed.
            let progressPercent = 0;
            if (courseData.id === 6) {
                progressPercent = 100; 
            } else if (totalModules > 0) {
                progressPercent = Math.round((completedLessons.length / totalModules) * 100);
            }

            return { 
                ...courseData, 
                progress: progressPercent 
            };
        }).filter(Boolean); // Remove any nulls (courses not found)

        setEnrolledCourses(courses);

        // 3. Calculate Dashboard Stats
        const completedCount = courses.filter(c => c.progress >= 100).length;
        const certCount = courses.filter(c => c.progress >= 80).length; // 80% required for certificate

        setStats({
            inProgress: courses.length - completedCount,
            completed: completedCount,
            certificates: certCount
        });

    }, []);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 flex flex-col lg:flex-row">
            {/* 1. SIDEBAR (Fixed Left Navigation) */}
            <Sidebar />

            {/* 2. MAIN CONTENT AREA */}
            <main className="min-w-0 flex-1 lg:ml-64">
                
                {/* --- A. HERO HEADER (Blue Brand Color) --- */}
                <div className="bg-blue-900 text-white pt-10 pb-24 px-8 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-800 rounded-full filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
                    
                    <div className="relative z-10 flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                                Welcome back, {user?.name || 'Learner'}! <span className="animate-pulse">👋</span>
                            </h1>
                            <p className="text-blue-100 text-lg">
                                Ready to continue your learning journey today?
                            </p>
                        </div>
                        <div className="hidden md:block text-sm bg-blue-800/50 px-4 py-2 rounded-lg border border-blue-700 backdrop-blur-sm">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                </div>

                {/* --- B. CONTENT BODY (Overlaps Header) --- */}
                <div className="px-8 -mt-16 pb-12 relative z-20">
                    
                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatCard icon={Clock} label="Courses in Progress" value={stats.inProgress} color="bg-blue-600" />
                        <StatCard icon={CheckCircle} label="Completed Courses" value={stats.completed} color="bg-green-500" />
                        <StatCard icon={Award} label="Earned Certificates" value={stats.certificates} color="bg-purple-500" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* LEFT COLUMN: My Learning List */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
                                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                                    <BookOpen className="text-blue-600" size={20} /> My Learning
                                </h2>
                                <Link to="/catalog" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
                                    Browse All <ArrowRight size={16} />
                                </Link>
                            </div>

                            {enrolledCourses.length > 0 ? (
                                <div className="space-y-4">
                                    {enrolledCourses.map((course) => (
                                        <div key={course.id} className="group flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 sm:flex-row">
                                            
                                            {/* Course Image (With Fallback) */}
                                            <div className="relative h-40 w-full flex-shrink-0 overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800 sm:h-28 sm:w-40">
                                                <img 
                                                    src={course.thumbnail || course.image} 
                                                    alt={course.title} 
                                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                                    onError={(e) => {
                                                        // If image fails, hide img tag and show fallback icon
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                                {/* Fallback Icon */}
                                                <div className="absolute inset-0 hidden items-center justify-center bg-slate-200 text-slate-400 dark:bg-slate-800">
                                                    <ImageOff size={24} />
                                                </div>
                                                {/* Hover Overlay */}
                                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <PlayCircle className="text-white drop-shadow-md" size={32} />
                                                </div>
                                            </div>

                                            {/* Course Info */}
                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div>
                                                    <h3 className="mb-1 text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white line-clamp-1">
                                                        {course.title}
                                                    </h3>
                                                    <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
                                                        {course.id === 6 ? 'Reading Material' : `${course.modules ? course.modules.length : 0} Modules`} • {course.level}
                                                    </p>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="space-y-2 mt-auto">
                                                    <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
                                                        <span>{course.progress}% Complete</span>
                                                        {course.progress >= 80 && <span className="text-green-600 font-bold">Certificate Eligible</span>}
                                                    </div>
                                                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                                                        <div 
                                                            className={`h-full rounded-full transition-all duration-500 ${course.progress >= 100 ? 'bg-green-500' : 'bg-blue-600'}`} 
                                                            style={{ width: `${course.progress}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <div className="flex items-center justify-end sm:border-l sm:border-gray-50 sm:pl-4">
                                                <Link to={course.id === 6 ? "/course/read/computer-basics" : `/course/${course.id}`}>
                                                    <button className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                                        <PlayCircle size={24} />
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                // Empty State
                                <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300">
                                        <BookOpen size={32} />
                                    </div>
                                    <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Start your journey</h3>
                                    <p className="mx-auto mb-6 max-w-sm text-slate-500 dark:text-slate-300">
                                        You haven't enrolled in any courses yet. Visit our catalog to find your first course!
                                    </p>
                                    <Link to="/catalog">
                                        <button className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white shadow-lg shadow-blue-200 transition-colors hover:bg-blue-700">
                                            Explore Courses
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: Widgets */}
                        <div className="space-y-6">
                            
                            {/* Live Session Widget */}
                            <div className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
                                <div className="flex items-center gap-2 border-b border-slate-100 bg-purple-50 p-4 text-sm font-bold text-purple-700 dark:border-slate-800 dark:bg-purple-950/40 dark:text-purple-300">
                                    <Calendar size={16} /> Upcoming Live Session
                                </div>
                                <div className="p-5">
                                    <h4 className="mb-1 font-bold text-slate-900 transition-colors group-hover:text-purple-600 dark:text-white">React Hooks Deep Dive</h4>
                                    <p className="mb-3 text-sm text-slate-500 dark:text-slate-300">with Sameen</p>
                                    <div className="mb-4 flex items-center gap-2 rounded border border-slate-100 bg-slate-50 p-2 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                                        <Clock size={14} className="text-purple-500" /> Coming Soon (WAT)
                                    </div>
                                    <button className="w-full py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors shadow-sm shadow-purple-200">
                                        Set Reminder
                                    </button>
                                </div>
                            </div>

                            {/* Motivation Widget */}
                                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-center text-white shadow-lg">
                                <Award size={32} className="mx-auto mb-3 text-blue-200 relative z-10" />
                                <h4 className="font-bold text-lg mb-2 relative z-10">Keep it up!</h4>
                                <p className="text-blue-100 text-sm mb-4 relative z-10">
                                    You're making great progress. Finish 2 more modules to earn a badge.
                                </p>
                                {/* Decorative Circles */}
                                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/10 rounded-full"></div>
                                <div className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full"></div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default LearnerDashboard;
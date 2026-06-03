import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Target, Layers, Heart, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col overflow-x-hidden text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
            <Navbar />

            {/* =========================================
               1. HERO SECTION (RESPONSIVE & SMALLER IMAGE)
               ========================================= */}
            <div className="relative overflow-hidden bg-blue-900 px-6 pt-20 pb-24 text-white md:pt-24 md:pb-32">
                {/* Animated Background Elements */}
                <div className="absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-purple-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-20 w-64 h-64 md:w-96 md:h-96 bg-pink-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12lg:gap-8 items-center relative z-10">
                    {/* Left Content */}
                    <div className="space-y-6 md:space-y-8 animate-fade-in-left text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 bg-blue-800/50 border border-blue-700 rounded-full px-4 py-1.5 backdrop-blur-sm">
                            <Sparkles size={16} className="text-yellow-400" />
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-100">Future of Learning</span>
                        </div>
                        
                        {/* Responsive Typography */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                            <span className="great-vibes block">Master New Skills</span>
                            <span className="great-vibes block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">For a Better Future</span>
                        </h1>
                        
                        <p className="text-base md:text-lg text-blue-100 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            Access high-quality, structured courses curated from the best open resources. 
                            Learn at your own pace and earn certificates to boost your career.
                        </p>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                            <Link to="/register">
                                <button className="px-6 py-3 md:px-8 md:py-4 bg-white text-blue-900 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2">
                                    Start Learning Free <ArrowRight size={20} />
                                </button>
                            </Link>
                            <Link to="/login">
                                <button className="px-6 py-3 md:px-8 md:py-4 bg-transparent border border-blue-300 text-white rounded-xl font-semibold hover:bg-white/10 transition-all">
                                    Log in
                                </button>
                            </Link>
                            <Link to="/catalog">
                                <button className="px-6 py-3 md:px-8 md:py-4 bg-transparent border border-blue-400 text-white rounded-xl font-bold hover:bg-blue-800/50 transition-all">
                                    Browse Courses
                                </button>
                            </Link>
                        </div>

                        <div className="flex justify-center lg:justify-start items-center gap-4 text-sm text-blue-200 pt-4">
                            <div className="flex -space-x-2">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-blue-400 border-2 border-blue-900"></div>
                                ))}
                            </div>
                            <p>Joined by Learners</p>
                        </div>
                    </div>

                    {/* Right Image (Reduced Size & Responsive) */}
                    {/* Hidden on small mobile, visible on medium+ screens */}
                    <div className="relative animate-fade-in-right hidden md:block lg:col-span-1">
                        <div className="relative bg-gradient-to-b from-blue-800 to-blue-900 rounded-2xl p-3 shadow-2xl border border-blue-700 transform rotate-2 hover:rotate-0 transition-transform duration-500 max-w-md mx-auto lg:max-w-full">
                            {/* Image with aspect ratio and max-height limit */}
                            <img 
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                alt="Students learning" 
                                className="rounded-xl shadow-inner w-full object-cover aspect-[4/3] lg:h-[400px]"
                            />
                            {/* Floating Badge (Scaled down slightly on medium screens) */}
                            <div className="absolute -bottom-4 -left-4 bg-white p-3 md:p-4 rounded-xl shadow-xl flex items-center gap-3 animate-bounce-slow scale-90 md:scale-100">
                                <div className="bg-green-100 p-2 rounded-full text-green-600">
                                    <CheckCircle size={20} className="md:w-6 md:h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase">Success Rate</p>
                                    <p className="text-lg md:text-xl font-bold text-gray-900">98%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* =========================================
               2. MISSION SECTION (RESPONSIVE CARDS)
               ========================================= */}
            <section className="py-16 md:py-24 px-6 relative z-20 -mt-8 md:-mt-10">
                <div className="max-w-7xl mx-auto">
                    {/* Header Text */}
                    <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
                        <h2 className="mb-4 text-2xl font-bold text-slate-900 md:text-3xl lg:text-4xl dark:text-white md:mb-6">
                            Empowering Skills Through <span className="text-blue-600">Accessible Education</span>
                        </h2>
                        <p className="text-base text-slate-600 md:text-lg dark:text-slate-300">
                            Skill Hub was created with a simple but powerful goal: to help people gain practical education 
                            and digital skills regardless of their background or financial situation.
                        </p>
                    </div>

                    {/* 3 Feature Cards (Stack on mobile, grid on desktop) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {/* Card 1 */}
                        <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 transition-transform duration-300 hover:-translate-y-2 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 md:p-8">
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors text-blue-600">
                                <Target size={28} className="md:w-8 md:h-8" />
                            </div>
                            <h3 className="mb-3 text-lg font-bold text-slate-900 dark:text-white md:text-xl">Bridging the Gap</h3>
                            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                Many individuals lack access to quality learning resources due to cost or infrastructure. 
                                We bridge that gap by organizing reliable content into structured paths.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 transition-transform duration-300 hover:-translate-y-2 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 md:p-8">
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors text-purple-600">
                                <Layers size={28} className="md:w-8 md:h-8" />
                            </div>
                            <h3 className="mb-3 text-lg font-bold text-slate-900 dark:text-white md:text-xl">Structured Learning</h3>
                            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                Instead of searching endlessly across the internet, learners can follow guided learning 
                                paths that focus on real-world, job-ready skills.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 transition-transform duration-300 hover:-translate-y-2 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 md:p-8">
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-green-50 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors text-green-600">
                                <Heart size={28} className="md:w-8 md:h-8" />
                            </div>
                            <h3 className="mb-3 text-lg font-bold text-slate-900 dark:text-white md:text-xl">Empowerment</h3>
                            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                Designed to support self-paced learning, empowering learners to become confident, 
                                independent individuals ready to contribute meaningfully to society.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================
               3. POPULAR COURSES PREVIEW
               ========================================= */}
            <section className="bg-slate-50 py-16 md:py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-4">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Popular Courses</h2>
                            <p className="text-slate-500">Start with our most enrolled courses</p>
                        </div>
                        <Link to="/catalog" className="hidden md:flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors">
                            View All Courses <ArrowRight size={20} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {/* Course Card 1 */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-slate-100 group">
                            <div className="h-40 md:h-48 bg-gray-200 relative overflow-hidden">
                                <img src="https://img.youtube.com/vi/ft30zcMlFao/maxresdefault.jpg" alt="Tailwind" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-6">
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded mb-2 inline-block">WEB DEV</span>
                                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">Tailwind CSS for Beginners</h3>
                                <p className="text-sm text-slate-500 mb-4 line-clamp-2">Master modern styling with utility classes and build rapid UIs.</p>
                                <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                                    <span className="text-xs font-bold text-slate-400">19 Lessons</span>
                                    <Link to="/course/8" className="text-blue-600 font-bold text-sm hover:underline">Start Now</Link>
                                </div>
                            </div>
                        </div>

                        {/* Course Card 2 */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-slate-100 group">
                            <div className="h-40 md:h-48 bg-gray-200 relative overflow-hidden">
                                <img src="https://wearebluegrass.com/wp-content/uploads/2024/05/importance-of-graphic-design-services-in-digital-marketing-2.png" alt="Graphic Design" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-6">
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded mb-2 inline-block">GRAPHIC DESIGN</span>
                                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">Graphic Design Full Course</h3>
                                <p className="text-sm text-slate-500 mb-4 line-clamp-2">Learn How to Create a Dianamic Design from scratch.</p>
                                <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                                    <span className="text-xs font-bold text-slate-400">2 Lessons</span>
                                    <Link to="/course/2" className="text-blue-600 font-bold text-sm hover:underline">Start Now</Link>
                                </div>
                            </div>
                        </div>

                        {/* Course Card 3 */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-slate-100 group">
                            <div className="h-40 md:h-48 bg-gray-200 relative overflow-hidden">
                                <img src="https://img.youtube.com/vi/rfscVS0vtbw/maxresdefault.jpg" alt="Python" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-6">
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded mb-2 inline-block">BACKEND</span>
                                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">Python for Beginners</h3>
                                <p className="text-sm text-slate-500 mb-4 line-clamp-2">Learn the basics of programming with the world's most popular language.</p>
                                <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                                    <span className="text-xs font-bold text-slate-400">2 Lessons</span>
                                    <Link to="/course/3" className="text-blue-600 font-bold text-sm hover:underline">Start Now</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Mobile View All Button */}
                    <div className="mt-8 text-center md:hidden">
                        <Link to="/catalog" className="inline-block w-full py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-center hover:bg-slate-50 transition-colors">
                            View All Courses
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />

            {/* --- CUSTOM ANIMATIONS (UNCHANGED) --- */}
            <style>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                
                .animate-fade-in-left {
                    animation: fadeInLeft 1s ease-out forwards;
                }
                .animate-fade-in-right {
                    animation: fadeInRight 1s ease-out forwards;
                }
                .animate-bounce-slow {
                    animation: bounce 3s infinite;
                }

                @keyframes fadeInLeft {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes fadeInRight {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </div>
    );
};

export default Home;
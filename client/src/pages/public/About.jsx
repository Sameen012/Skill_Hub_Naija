import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Target, Layers, Heart, Sparkles } from 'lucide-react';

const About = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
            <Navbar />

            {/* --- HERO SECTION --- */}
            <div className="relative bg-blue-900 text-white py-24 px-6 overflow-hidden">
                {/* Background Pattern (Animated Blobs) */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-blue-800/50 border border-blue-700 rounded-full px-4 py-1.5 mb-6 animate-fade-in-down">
                        <Sparkles size={16} className="text-yellow-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-100">Our Mission</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in-up">
                        Empowering Skills Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Accessible Education</span>
                    </h1>
                    <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100">
                        Bridging the gap between potential and opportunity by providing high-quality, structured learning resources to everyone, everywhere.
                    </p>
                </div>
            </div>

            {/* --- MAIN CONTENT CARDS --- */}
            <div className="max-w-7xl mx-auto px-6 -mt-16 pb-24 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Card 1: The Goal */}
                    <div className="group animate-fade-in-up rounded-2xl border border-slate-200 bg-white p-8 shadow-xl transition-transform duration-300 ease-out hover:-translate-y-2 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 delay-200">
                        <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-100 transition-colors">
                            <Target className="text-red-500" size={32} />
                        </div>
                        <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">The Goal</h3>
                        <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                            Skill Hub was created with a simple but powerful goal: to help people gain practical education and digital skills regardless of their background or financial situation. We believe lack of infrastructure shouldn't be a barrier to learning.
                        </p>
                    </div>

                    {/* Card 2: The Solution */}
                    <div className="group animate-fade-in-up rounded-2xl border border-slate-200 bg-white p-8 shadow-xl transition-transform duration-300 ease-out hover:-translate-y-2 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 delay-300">
                        <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                            <Layers className="text-blue-500" size={32} />
                        </div>
                        <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">The Solution</h3>
                        <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                            We bridge the gap by organizing complete, high-quality learning content sourced from reliable tutorials into structured courses. Instead of searching endlessly, learners follow guided paths focusing on job-ready skills.
                        </p>
                    </div>

                    {/* Card 3: The Impact */}
                    <div className="group animate-fade-in-up rounded-2xl border border-slate-200 bg-white p-8 shadow-xl transition-transform duration-300 ease-out hover:-translate-y-2 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 delay-400">
                        <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-100 transition-colors">
                            <Heart className="text-green-500" size={32} />
                        </div>
                        <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">The Impact</h3>
                        <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                            Designed to support self-paced learning and encourage development, empowering learners to become confident, independent, and skilled individuals ready to contribute meaningfully to society.
                        </p>
                    </div>

                </div>
            </div>

            {/* --- BOTTOM CTA --- */}
            <div className="border-t border-slate-200 bg-white py-20 dark:border-slate-800 dark:bg-slate-900">
                <div className="max-w-4xl mx-auto text-center px-6">
                    <h2 className="mb-6 text-3xl font-bold text-slate-900 dark:text-white">Ready to start your journey?</h2>
                    <p className="mb-8 text-lg text-slate-600 dark:text-slate-300">Join thousands of learners accessing world-class education for free.</p>
                    <div className="flex justify-center gap-4">
                        <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200">
                            Browse Courses
                        </button>
                        <button className="px-8 py-3 bg-white text-slate-700 border border-slate-200 rounded-lg font-bold hover:bg-slate-50 transition-all">
                            Contact Us
                        </button>
                    </div>
                </div>
            </div>

            <Footer />

            {/* --- CSS ANIMATIONS (Add this to your index.css or keep here if using standard CSS) --- */}
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
                
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.8s ease-out forwards;
                    opacity: 0; /* Start hidden */
                }
                .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }
                .delay-300 { animation-delay: 0.3s; }
                .delay-400 { animation-delay: 0.4s; }
            `}</style>
        </div>
    );
};

export default About;
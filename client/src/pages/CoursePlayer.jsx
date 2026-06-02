import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseById } from '../utils/courseStore.js';
import { 
    PlayCircle, CheckCircle, ChevronLeft, ChevronRight, Menu, Lock, Loader2, Clock,
    FileText, Download, Video, MessageSquare, X, Info, AlertCircle
} from 'lucide-react';

const CoursePlayer = () => {
    // ============================
    // 1. STATE & INITIALIZATION
    // ============================
    const { id } = useParams();
    const courseId = parseInt(id);
    
    // Core Data State
    const [course, setCourse] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // UI Layout State
    // Sidebar defaults to OPEN only on screens larger than 1280px
    const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1280); 
    const [activeTab, setActiveTab] = useState('overview');
    
    // Logic State
    const [canMarkComplete, setCanMarkComplete] = useState(false);
    const [timer, setTimer] = useState(0);

    // Load Progress from LocalStorage
    const [completedLessons, setCompletedLessons] = useState(() => {
        try {
            const saved = localStorage.getItem(`progress_${courseId}`);
            return saved ? JSON.parse(saved) : [];
        } catch (error) { 
            console.error("Error loading progress:", error);
            return []; 
        }
    });

    // ============================
    // 2. EFFECTS (LOGIC)
    // ============================
    
    // Handle Window Resize (Responsive Sidebar)
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1280) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Load Course Data & Auto-Enrollment
    useEffect(() => {
        setLoading(true);
        const loadTimer = setTimeout(() => {
            const foundCourse = getCourseById(courseId);
            setCourse(foundCourse);
            
            if (foundCourse) {
                // Select first module if none active
                if (foundCourse.modules.length > 0) {
                    setActiveLesson(foundCourse.modules[0]);
                }
                
                // Auto-Enrollment Logic
                try {
                    const enrolled = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
                    if (!enrolled.includes(courseId)) {
                        const newList = [...enrolled, courseId];
                        localStorage.setItem('enrolledCourses', JSON.stringify(newList));
                        console.log("User auto-enrolled in course:", courseId);
                    }
                } catch (e) {
                    console.error("Auto-enroll failed:", e);
                }
            }
            setLoading(false);
        }, 800); // Simulate API delay
        return () => clearTimeout(loadTimer);
    }, [courseId]);

    // Save Progress to LocalStorage
    useEffect(() => {
        if (courseId) {
            localStorage.setItem(`progress_${courseId}`, JSON.stringify(completedLessons));
        }
    }, [completedLessons, courseId]);

    // Timer Logic (Wait 10s to Mark Complete)
    useEffect(() => {
        if (activeLesson) {
            if (completedLessons.includes(activeLesson.id)) {
                // Already completed? Unlock immediately
                setCanMarkComplete(true);
                setTimer(0);
            } else {
                // New lesson? Lock and start 10s timer
                setCanMarkComplete(false);
                setTimer(10); 
            }
        }
    }, [activeLesson, completedLessons]);

    // Countdown Ticker
    useEffect(() => {
        let interval = null;
        if (!canMarkComplete && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0 && !canMarkComplete) {
            setCanMarkComplete(true);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timer, canMarkComplete]);

    // ============================
    // 3. EVENT HANDLERS
    // ============================
    const toggleComplete = (lessonId) => {
        if (!canMarkComplete && !completedLessons.includes(lessonId)) return;
        
        if (completedLessons.includes(lessonId)) {
            setCompletedLessons(prev => prev.filter(id => id !== lessonId));
        } else {
            setCompletedLessons(prev => [...prev, lessonId]);
        }
    };

    const handleNext = () => {
        if (!course || !activeLesson) return;
        const idx = course.modules.findIndex(m => m.id === activeLesson.id);
        if (idx < course.modules.length - 1) {
            setActiveLesson(course.modules[idx + 1]);
        }
    };

    const handlePrev = () => {
        if (!course || !activeLesson) return;
        const idx = course.modules.findIndex(m => m.id === activeLesson.id);
        if (idx > 0) {
            setActiveLesson(course.modules[idx - 1]);
        }
    };

    const handleLessonSelect = (lesson) => {
        setActiveLesson(lesson);
        // Mobile: Close sidebar automatically when a lesson is picked
        if (window.innerWidth < 1280) {
            setSidebarOpen(false);
        }
        // Scroll main content area to top
        const mainContent = document.getElementById('main-content');
        if (mainContent) mainContent.scrollTop = 0;
    };

    // ============================
    // 4. RENDER UI
    // ============================
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center flex-col gap-4">
                <Loader2 className="animate-spin text-blue-500 h-10 w-10" />
                <p className="text-gray-400 font-medium">Loading Class...</p>
            </div>
        );
    }
    
    if (!course) {
        return (
            <div className="min-h-screen bg-gray-900 text-white p-10 flex flex-col justify-center items-center gap-4">
                <AlertCircle size={48} className="text-red-500"/>
                <h2 className="text-2xl font-bold">Course Not Found</h2>
                <Link to="/catalog" className="text-blue-400 hover:underline">Back to Catalog</Link>
            </div>
        );
    }

    const progressPercentage = course.modules.length > 0 ? Math.round((completedLessons.length / course.modules.length) * 100) : 0;
    const activeIndex = course.modules.findIndex(m => m.id === activeLesson?.id);
    const isFirst = activeIndex === 0;
    const isLast = activeIndex === course.modules.length - 1;

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col overflow-hidden">
            
            {/* --- HEADER (Fixed Top) --- */}
            <header className="h-16 bg-blue-900 flex items-center justify-between px-4 sticky top-0 z-50 shadow-md flex-shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-blue-200 hover:text-white p-2 rounded hover:bg-blue-800 transition-colors">
                        <Menu size={24} />
                    </button>

                    <Link to="/dashboard/learner" className="text-sm text-blue-100 hover:text-white flex items-center gap-2 group transition-colors">
                        <div className="bg-blue-800 p-1.5 rounded-full group-hover:bg-blue-700 transition-colors">
                            <ChevronLeft size={16} /> 
                        </div>
                        <span className="hidden sm:inline font-medium">Dashboard</span>
                    </Link>
                    
                    <div className="h-6 w-px bg-blue-700 hidden sm:block mx-2"></div>
                    <h1 className="text-sm md:text-lg font-bold truncate max-w-[200px] sm:max-w-md text-white">{course.title}</h1>
                </div>
                
                <div className="hidden sm:flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-[10px] text-blue-200 uppercase tracking-wider font-bold">Progress</p>
                        <p className="text-sm font-bold text-white">{progressPercentage}%</p>
                    </div>
                    <div className="w-10 h-10 relative flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-blue-800" />
                            <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="transparent"
                                strokeDasharray={100} strokeDashoffset={100 - progressPercentage}
                                className="text-white transition-all duration-500" />
                        </svg>
                    </div>
                </div>
            </header>

            {/* --- MAIN LAYOUT CONTAINER --- */}
            <div className="flex flex-1 relative overflow-hidden">
                
                {/* 1. SIDEBAR (RESPONSIVE DRAWER) */}
                {/* Overlay for mobile when sidebar is open */}
                {isSidebarOpen && (
                    <div className="fixed inset-0 bg-black/60 z-40 xl:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
                )}

                <aside className={`
                    fixed xl:relative top-0 left-0 z-50 
                    h-[calc(100vh)] xl:h-auto 
                    w-80 bg-[#111827] border-r border-gray-800 flex flex-col 
                    transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0 xl:w-0 xl:border-none xl:overflow-hidden'}
                `}>
                    <div className="p-4 border-b border-gray-800 bg-[#1f2937] flex justify-between items-center shrink-0">
                        <div>
                            <h3 className="font-bold text-gray-100 text-xs uppercase tracking-wider">Course Content</h3>
                            <p className="text-xs text-gray-500 mt-1">{completedLessons.length} / {course.modules.length} Completed</p>
                        </div>
                        <button onClick={() => setSidebarOpen(false)} className="xl:hidden text-gray-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {course.modules.map((lesson, index) => {
                            const isCompleted = completedLessons.includes(lesson.id);
                            const isActive = activeLesson?.id === lesson.id;
                            return (
                                <button key={lesson.id} onClick={() => handleLessonSelect(lesson)} 
                                    className={`w-full text-left p-4 border-b border-gray-800/50 flex gap-3 transition-colors ${isActive ? 'bg-blue-900/20 border-l-4 border-l-blue-500' : 'hover:bg-gray-800/50 border-l-4 border-l-transparent'}`}>
                                    <div className="mt-0.5 shrink-0">
                                        {isCompleted ? <CheckCircle size={18} className="text-green-500" /> : isActive ? <PlayCircle size={18} className="text-blue-500" /> : <span className="text-xs text-gray-500 font-mono ml-1">{index + 1}</span>}
                                    </div>
                                    <div className="overflow-hidden">
                                        <h4 className={`text-sm font-medium truncate ${isActive ? 'text-blue-400' : 'text-gray-300 group-hover:text-white'}`}>{lesson.title}</h4>
                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Video size={10} /> {lesson.duration}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </aside>

                {/* 2. MAIN CONTENT (FIXED VIDEO + SCROLLING TABS) */}
                <main id="main-content" className="flex-1 min-w-0 bg-black flex flex-col h-full overflow-y-auto scroll-smooth">
                    
                    {/* A. VIDEO CONTAINER (Fixed Height to ensure buttons visible) */}
                    <div className="w-full bg-black relative shadow-lg shrink-0 flex justify-center bg-gray-900 sticky top-0 z-20">
                        <div className="w-full max-w-5xl aspect-video max-h-[60vh] relative"> 
                            {activeLesson ? (
                                <iframe className="absolute inset-0 w-full h-full"
                                    src={`${activeLesson.videoUrl}?rel=0&modestbranding=1&autoplay=0`} 
                                    title={activeLesson.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-500 flex-col gap-2">
                                    <Loader2 className="animate-spin" /> <span>Loading Video...</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* B. CONTROLS BAR (Sticky below video) */}
                    <div className="bg-[#111827] border-b border-gray-800 p-4 shrink-0 shadow-md sticky top-[60vh] z-10 w-full">
                        <div className="max-w-5xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-4">
                            
                            <div className="hidden md:block overflow-hidden">
                                <h2 className="text-lg font-bold text-white truncate">{activeLesson?.title}</h2>
                                <p className="text-gray-400 text-xs">Module {activeIndex + 1}</p>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                                <button onClick={handlePrev} disabled={isFirst} className={`p-2.5 rounded-lg border border-gray-700 ${isFirst ? 'text-gray-600 cursor-not-allowed bg-gray-800/30' : 'text-white hover:bg-gray-800 hover:border-gray-500 active:scale-95'}`}>
                                    <ChevronLeft size={20} />
                                </button>

                                <button onClick={() => toggleComplete(activeLesson.id)} disabled={!canMarkComplete && !completedLessons.includes(activeLesson?.id)}
                                    className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm shadow-lg min-w-[180px] transition-all
                                    ${completedLessons.includes(activeLesson?.id) ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-900/30' : !canMarkComplete ? 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-900/30 active:scale-95'}
                                `}>
                                    {completedLessons.includes(activeLesson?.id) ? <><CheckCircle size={18} /> Completed</> : !canMarkComplete ? <><Clock size={18} className="animate-pulse" /> {timer}s</> : "Mark Complete"}
                                </button>

                                <button onClick={handleNext} disabled={isLast} className={`p-2.5 rounded-lg border border-gray-700 ${isLast ? 'text-gray-600 cursor-not-allowed bg-gray-800/30' : 'text-white hover:bg-gray-800 hover:border-gray-500 active:scale-95'}`}>
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* C. SCROLLABLE DETAILS TABS */}
                    <div className="flex-1 bg-[#0f1117] p-4 md:p-6 min-h-[500px]">
                        <div className="max-w-5xl mx-auto space-y-6 pb-20">
                            
                            {/* Tab Buttons */}
                            <div className="flex border-b border-gray-800 gap-6">
                                {['overview', 'resources', 'discussion'].map((tab) => (
                                    <button key={tab} onClick={() => setActiveTab(tab)}
                                        className={`pb-2 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'}`}>
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Panels */}
                            <div className="min-h-[200px] animate-fade-in">
                                {activeTab === 'overview' && (
                                    <div className="space-y-6">
                                        <div><h3 className="text-base font-bold text-white mb-2 flex items-center gap-2"><Info size={16} className="text-blue-400"/> Description</h3><p className="text-gray-300 text-sm leading-relaxed">{course.description}</p></div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50"><h4 className="text-xs text-gray-400 uppercase">Skill Level</h4><p className="text-sm text-white mt-1">Beginner</p></div>
                                            <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50"><h4 className="text-xs text-gray-400 uppercase">Duration</h4><p className="text-sm text-white mt-1">{activeLesson?.duration}</p></div>
                                            <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50"><h4 className="text-xs text-gray-400 uppercase">Instructor</h4><p className="text-sm text-white mt-1">{course.instructor}</p></div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'resources' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-[#1f2937] p-4 rounded-lg border border-gray-700 flex items-center gap-3 hover:border-blue-500 transition-colors cursor-pointer group"><div className="bg-blue-500/10 p-2 rounded text-blue-400"><FileText size={20} /></div><div><h4 className="text-sm font-bold text-gray-200">Source Code</h4><p className="text-xs text-gray-400">Download starter files</p></div></div>
                                        <div className="bg-[#1f2937] p-4 rounded-lg border border-gray-700 flex items-center gap-3 hover:border-purple-500 transition-colors cursor-pointer group"><div className="bg-purple-500/10 p-2 rounded text-purple-400"><Download size={20} /></div><div><h4 className="text-sm font-bold text-gray-200">Slides</h4><p className="text-xs text-gray-400">Download PDF</p></div></div>
                                    </div>
                                )}

                                {activeTab === 'discussion' && (
                                    <div className="bg-gray-800/20 border border-gray-800 border-dashed rounded-xl p-8 text-center"><MessageSquare size={32} className="mx-auto text-gray-600 mb-3" /><p className="text-gray-400 text-sm">Discussion is currently locked for guest users.</p></div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CoursePlayer;
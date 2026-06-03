import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { COMPUTER_BASICS_DATA } from '../data/computerBasicsData';
import { Book, ChevronRight, Menu, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ComputerBasicsViewer = () => {
    const [activeTopicId, setActiveTopicId] = useState(COMPUTER_BASICS_DATA[0].id);
    const [isTopicMenuOpen, setIsTopicMenuOpen] = useState(false);

    const activeTopic = COMPUTER_BASICS_DATA.find(t => t.id === activeTopicId);

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
            {/* Main Navigation Sidebar */}
            <Sidebar />

            <div className="lg:ml-64 w-full flex flex-col md:flex-row h-screen overflow-hidden">

                {/* Internal Topic Sidebar */}
                <aside className={`flex w-full flex-shrink-0 flex-col border-r border-slate-200 bg-white z-20 dark:border-slate-800 dark:bg-slate-900 md:w-80 ${isTopicMenuOpen ? 'fixed inset-0 md:static' : 'hidden md:flex'}`}>
                    <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                        <Link to="/catalog" className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400">
                            <ChevronLeft size={14}/> Back to Catalog
                        </Link>
                        <div>
                            <h2 className="text-lg font-bold leading-tight text-slate-900 dark:text-white">Basic Computer Concepts</h2>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Based on Course Manual</p>
                        </div>
                        <button onClick={() => setIsTopicMenuOpen(false)} className="absolute top-4 right-4 text-slate-500 md:hidden dark:text-slate-400">✕</button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-1">
                        {COMPUTER_BASICS_DATA.map((topic) => (
                            <button
                                key={topic.id}
                                onClick={() => {
                                    setActiveTopicId(topic.id);
                                    setIsTopicMenuOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between group ${
                                    activeTopicId === topic.id
                                        ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900/50'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                                }`}
                            >
                                <span>{topic.title}</span>
                                {activeTopicId === topic.id && <ChevronRight size={16} />}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="relative h-full flex-1 overflow-y-auto bg-white scroll-smooth dark:bg-slate-950">
                    {/* Mobile Header */}
                    <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95 md:hidden">
                        <button onClick={() => setIsTopicMenuOpen(true)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                            <Menu size={24} />
                        </button>
                        <span className="truncate text-sm font-bold text-slate-800 dark:text-slate-200">{activeTopic.title}</span>
                    </div>

                    {/* Content Renderer */}
                    <div className="mx-auto max-w-4xl p-8 pb-32 md:p-12">
                        <div className="max-w-none dark:[&_.bg-white]:!bg-slate-900 dark:[&_.bg-gray-50]:!bg-slate-950 dark:[&_.bg-gray-100]:!bg-slate-800 dark:[&_.border-gray-200]:!border-slate-800 dark:[&_.border-gray-100]:!border-slate-800 dark:[&_.text-gray-900]:!text-slate-100 dark:[&_.text-gray-800]:!text-slate-100 dark:[&_.text-gray-700]:!text-slate-200 dark:[&_.text-gray-600]:!text-slate-300 dark:[&_.text-gray-500]:!text-slate-400 dark:[&_.bg-white/95]:!bg-slate-950/95">
                            {/* Render HTML Content */}
                            <div dangerouslySetInnerHTML={{ __html: activeTopic.content }} />
                        </div>

                        {/* Navigation Footer */}
                        <div className="mt-16 flex justify-between border-t border-slate-100 pt-8 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                            <span>Topic ID: {activeTopic.id}</span>
                            <span>SkillHub NG Learning Material</span>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ComputerBasicsViewer;
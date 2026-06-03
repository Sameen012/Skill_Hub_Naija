import React, { useState, useEffect } from 'react';
// FIX: Changed "../../" to "../" because this file is in src/pages/
import Sidebar from '../components/layout/Sidebar';
import { getCourseById } from '../utils/courseStore.js';
import { Award, Download, X, Calendar, CheckCircle, Lock, Eye, Printer } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import MySignature from './public/My_Signature.png';

// --- CERTIFICATE MODAL COMPONENT ---
const CertificateModal = ({ cert, studentName, onClose, autoPrint }) => {

    // Auto-trigger print view if "Download" was clicked
    useEffect(() => {
        if (autoPrint) {
            // Small delay to ensure styles are loaded
            const timer = setTimeout(() => {
                window.print();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [autoPrint]);

    return (
        // Modal Container
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 print:p-0 print:bg-white print:block print:static">

            {/* Close / Action Buttons (Hidden during Print) */}
            <div className="fixed top-6 right-6 flex gap-4 print:hidden z-50">
                {!autoPrint && (
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-transform active:scale-95"
                    >
                        <Download size={20} /> Download PDF
                    </button>
                )}
                <button
                    onClick={onClose}
                    className="p-3 bg-white/10 text-white rounded-full hover:bg-red-600 transition-colors backdrop-blur-md"
                >
                    <X size={24} />
                </button>
            </div>

            {/* --- CERTIFICATE CANVAS --- */}
            <div
                id="printable-cert"
                className="relative bg-white text-gray-900 shadow-2xl overflow-hidden w-full max-w-5xl aspect-[1.414/1] flex flex-col mx-auto rounded-xl print:rounded-none print:shadow-none"
                style={{ fontFamily: "'Times New Roman', serif" }}
            >
                {/* Ornamental Border */}
                <div className="absolute inset-3 border-[6px] border-double border-blue-900/20 pointer-events-none"></div>
                <div className="absolute inset-6 border-[1px] border-blue-900/40 pointer-events-none"></div>

                {/* Corner Decorations */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-900/10 to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-blue-900/10 to-transparent"></div>

                {/* Content Layer */}
                <div className="flex-1 flex flex-col items-center justify-between py-16 px-20 relative z-10 text-center">

                    {/* 1. Header */}
                    <div className="w-full space-y-2">
                        <div className="flex justify-center items-center gap-2 opacity-70 mb-6">
                            <Award size={20} className="text-blue-800" />
                            <span className="text-sm font-bold tracking-[0.4em] uppercase font-sans text-blue-900 img src='Skill_Hub_Naija.jpg'"> SkillHub Naija</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-gray-900 mb-2 uppercase scale-y-110" style={{ fontFamily: 'serif' }}>
                            Certificate of Completion
                        </h1>
                        <p className="text-xs md:text-sm text-gray-500 font-sans tracking-[0.3em] uppercase">This certifies that</p>
                    </div>

                    {/* 2. Student Name */}
                    <div className="w-full py-4 relative">
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-blue-900 italic relative z-10 px-4 py-2" style={{ fontFamily: "'Great Vibes', cursive, serif" }}>
                            {studentName}
                        </h2>
                        {/* Underline decoration */}
                        <div className="h-px w-2/3 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto mt-2"></div>
                    </div>

                    {/* 3. Course Details */}
                    <div className="max-w-3xl mx-auto space-y-4">
                        <p className="text-sm md:text-base text-gray-600 italic font-serif leading-relaxed">
                            Has successfully completed all required modules, assessments, and practical exercises demonstrating professional proficiency in the course:
                        </p>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 font-sans uppercase tracking-wide leading-tight py-4 border-b border-gray-100">
                            {cert.title}
                        </h3>
                        
                        <div className="grid grid-cols-3 gap-8 text-xs text-gray-500 font-sans uppercase tracking-wider mt-4">
                            <div>
                                <span className="block font-bold text-gray-900">Completed On</span>
                                {cert.issueDate}
                            </div>
                            
                            <div>
                                <span className="block font-bold text-gray-900">Certificate ID</span>
                                SH-{cert.id}-2026
                            </div>
                        </div>
                    </div>

                    {/* 4. Footer (Signatures) */}
                    <div className="w-full flex justify-between items-end mt-12 px-10">

                        {/* Instructor Sig */}
    <div className="text-center w-48">
    <div className="border-b-2 border-gray-300 pb-2 mb-2"></div>

    <p className="font-semibold text-slate-700 text-sm">
        SkillHub Naija
    </p>

    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
        Training Team
    </p>
          </div>

                        {/* Gold Seal */}
                        <div className="relative -mb-6">
                            <div className="w-24 h-24 bg-gradient-to-b from-yellow-100 to-yellow-50 rounded-full border-4 border-yellow-600/30 flex items-center justify-center shadow-xl relative">
                                <div className="absolute inset-1 border-[2px] border-yellow-600 rounded-full border-dashed opacity-50"></div>
                                <div className="text-center">
                                    <Award className="w-8 h-8 text-yellow-600 mx-auto mb-1" />
                                    <div className="text-[8px] font-bold text-yellow-800 uppercase tracking-tighter leading-tight">Verified<br/>Credential</div>
                                </div>
                            </div>
                        </div>

 {/* Director Sig */}
<div className="text-center w-48">
    <div className="border-b-2 border-gray-300 pb-2 mb-2">
        <img
            src={MySignature}
            alt="Saminu Aminu Signature"
            className="h-14 mx-auto object-contain"
        />
    </div>

    <p className="font-semibold text-blue-900 text-sm">
        Saminu Aminu
    </p>

    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
        Director, SkillHub Naija
    </p>
</div>

                    </div>
                </div>
            </div>

            {/* --- PRINT STYLES (THE FIX) --- */}
            <style>{`
                @media print {
                    /* Hide scrollbars and extra UI */
                    body {
                        margin: 0;
                        padding: 0;
                        background: white;
                    }
                    
                    /* Hide everything EXCEPT the certificate */
                    body * {
                        visibility: hidden;
                    }
                    
                    /* Make certificate visible */
                    #printable-cert, #printable-cert * {
                        visibility: visible;
                    }

                    /* Position certificate perfectly on the page */
                    #printable-cert {
                        position: fixed;
                        left: 0;
                        top: 0;
                        width: 100vw;
                        height: 100vh;
                        margin: 0;
                        padding: 40px !important; /* Add padding for printer margins */
                        border: none;
                        box-shadow: none;
                        border-radius: 0;
                        max-width: none !important;
                        z-index: 9999;
                        
                        /* CRITICAL: Ensures colors/backgrounds print */
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    
                    /* Set paper size to Landscape */
                    @page { 
                        size: landscape; 
                        margin: 0; 
                    }
                }
            `}</style>
        </div>
    );
};


// --- MAIN PAGE COMPONENT ---
const Certifications = () => {
    const { user } = useAuth();
    const [earnedCertificates, setEarnedCertificates] = useState([]);
    const [modalData, setModalData] = useState(null);

    useEffect(() => {
        const enrolledIds = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');

        const qualifiedCourses = enrolledIds.map(id => {
            const course = getCourseById(id);
            if(!course) return null;

            const completedLessons = JSON.parse(localStorage.getItem(`progress_${id}`) || '[]');
            const totalModules = course.modules ? course.modules.length : 0;

            // Progress logic (PDF course ID 6 manual override)
            const progress = totalModules > 0
                ? Math.round((completedLessons.length / totalModules) * 100)
                : (id === 6 ? 100 : 0);

            // Only show if >= 80%
            if (progress >= 80) {
                return {
                    ...course,
                    issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                    grade: `${progress}%`
                };
            }
            return null;
        }).filter(Boolean);

        setEarnedCertificates(qualifiedCourses);
    }, []);

    const openCertificate = (cert, autoPrint = false) => {
        setModalData({ cert, autoPrint });
    };

    return (
        <>
            <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 flex">
                <Sidebar />

                <main className="ml-64 w-[calc(100%-16rem)] p-8">
                    <div className="mb-8">
                        <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">My Certifications</h1>
                        <p className="text-slate-500 dark:text-slate-300">View and download your earned credentials (80% completion required).</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
                            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                                <Award size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-300">Total Earned</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{earnedCertificates.length}</h3>
                            </div>
                        </div>
                    </div>

                    {earnedCertificates.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {earnedCertificates.map((cert) => (
                                <div key={cert.id} className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 md:flex-row">
                                    <div className="relative min-h-[200px] cursor-pointer overflow-hidden bg-slate-100 dark:bg-slate-800 md:min-h-full md:w-1/3" onClick={() => openCertificate(cert, false)}>
                                        <img src={cert.thumbnail || cert.image} alt="Course" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90"/>
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Eye className="text-white w-8 h-8 drop-shadow-lg" />
                                        </div>
                                    </div>

                                    <div className="p-6 md:w-2/3 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-bold leading-tight text-slate-900 dark:text-white">{cert.title}</h3>
                                            <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                                        </div>
                                        <p className="text-sm text-gray-500 mb-4">Instructor: {cert.instructor}</p>
                                        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Calendar size={14} />
                                                <span>Issued: {cert.issueDate}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => openCertificate(cert, false)} className="px-3 py-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium">View</button>
                                                <button onClick={() => openCertificate(cert, true)} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"><Download size={16} /> Download</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-slate-200 bg-white py-20 text-center dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800"><Lock className="text-slate-400" size={32} /></div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No certificates yet</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mb-6">Complete at least 80% of a course to unlock your professional certificate.</p>
                            <Link to="/dashboard/learner"><button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">Go to Dashboard</button></Link>
                        </div>
                    )}
                </main>
            </div>

            {modalData && (
                <CertificateModal
                    cert={modalData.cert}
                    studentName={user?.name || "Student Name"}
                    autoPrint={modalData.autoPrint}
                    onClose={() => setModalData(null)}
                />
            )}
        </>
    );
};

export default Certifications;
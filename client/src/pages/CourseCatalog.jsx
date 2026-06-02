import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import Button from '../components/common/Button.jsx';
import { getAllCourses, getCourseById } from '../utils/courseStore.js';
import { Search, Filter, PlayCircle, Video, BookOpen, CheckCircle } from 'lucide-react';

const CourseCatalog = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    // State to track which courses the user has enrolled in
    const [enrolledIds, setEnrolledIds] = useState([]);
    const [courses, setCourses] = useState([]);

    // 1. Load enrolled courses from LocalStorage on mount
    useEffect(() => {
        const storedEnrollments = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
        setEnrolledIds(storedEnrollments);
        setCourses(getAllCourses());
    }, []);

    // 2. Handle Enrollment Logic
    const handleEnroll = (courseId) => {
        // Add to local storage
        const updatedEnrollments = [...enrolledIds, courseId];
        localStorage.setItem('enrolledCourses', JSON.stringify(updatedEnrollments));
        setEnrolledIds(updatedEnrollments);

        const currentUser = JSON.parse(localStorage.getItem('skillhub_user') || 'null');
        const enrollmentRecords = JSON.parse(localStorage.getItem('skillhub_enrollment_records') || '[]');
        const course = getCourseById(courseId);

        if (currentUser && course) {
            const alreadyTracked = enrollmentRecords.some(
                (record) => record.courseId === courseId && record.userEmail === currentUser.email,
            );

            if (!alreadyTracked) {
                enrollmentRecords.unshift({
                    id: `${courseId}-${currentUser.email}`,
                    userName: currentUser.name,
                    userEmail: currentUser.email,
                    courseId,
                    courseTitle: course.title,
                    enrolledAt: new Date().toISOString(),
                });
                localStorage.setItem('skillhub_enrollment_records', JSON.stringify(enrollmentRecords));
            }
        }

        // Redirect to the correct page
        if (courseId === 6) {
            navigate('/course/read/computer-basics');
        } else {
            navigate(`/course/${courseId}`);
        }
    };

    const categories = ['All', 'Web Development', 'Design', 'CS'];

    const filteredCourses = courses.filter(course => {
        const matchesCategory = filter === 'All' || course.category === filter;
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Course Catalog</h1>
                        <p className="mt-2 text-slate-500 dark:text-slate-300">Explore {courses.length} courses available for you.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-64 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-8 flex flex-wrap gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                filter === cat
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map(course => {
                            const isEnrolled = enrolledIds.includes(course.id);

                            return (
                                <div key={course.id} className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
                                    <div className="relative aspect-video">
                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />

                                        {/* Badges */}
                                        {isEnrolled && (
                                            <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                                                <CheckCircle size={12} /> ENROLLED
                                            </div>
                                        )}

                                        {course.type === 'live' && (
                                            <div className="absolute top-3 right-3 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                                                <Video size={12} /> LIVE SESSION
                                            </div>
                                        )}
                                        {course.type === 'self-paced' && (
                                            <div className="absolute top-3 right-3 bg-blue-600/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 backdrop-blur-sm">
                                                <PlayCircle size={12} /> SELF PACED
                                            </div>
                                        )}
                                        {course.type === 'reading' && (
                                            <div className="absolute top-3 right-3 bg-indigo-600/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 backdrop-blur-sm">
                                                <BookOpen size={12} /> READING
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wide">{course.category}</div>
                                        <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white line-clamp-2">{course.title}</h3>
                                        <p className="mb-4 flex-1 text-sm text-slate-500 dark:text-slate-300 line-clamp-2">{course.description}</p>

                                        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                                                {course.price === 0 ? 'Free' : `$${course.price}`}
                                            </span>

                                            {/* ENROLL vs CONTINUE Button Logic */}
                                            {isEnrolled ? (
                                                <Link to={course.id === 6 ? "/course/read/computer-basics" : `/course/${course.id}`}>
                                                    <Button variant="outline" size="sm" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                                                        Continue Learning
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Button
                                                    onClick={() => handleEnroll(course.id)}
                                                    size="sm"
                                                    className="bg-blue-600 text-white hover:bg-blue-700"
                                                >
                                                    Enroll Now
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                <Filter className="text-slate-400" size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No courses found</h3>
                            <button onClick={() => {setFilter('All'); setSearchTerm('');}} className="mt-4 text-blue-600 hover:underline dark:text-blue-400">
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseCatalog;
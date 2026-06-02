import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import { Plus, DollarSign, Users, BookOpen, Edit, Trash2 } from 'lucide-react';

const formatMoney = (value) => `$${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const getStoredCourses = () => {
    try {
        return JSON.parse(localStorage.getItem('skillhub_admin_courses') || '[]');
    } catch {
        return [];
    }
};

const getEnrollmentCount = (courseId) => {
    try {
        const enrollments = JSON.parse(localStorage.getItem('skillhub_enrollment_records') || '[]');
        return enrollments.filter((record) => Number(record.courseId) === Number(courseId)).length;
    } catch {
        return 0;
    }
};

const InstructorDashboard = () => {
    const courses = getStoredCourses();
    const revenueStats = [
        { label: 'Total Earnings', value: formatMoney(courses.reduce((sum, course) => sum + Number(course.price || 0), 0)), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Total Students', value: new Set(courses.flatMap((course) => JSON.parse(localStorage.getItem('skillhub_enrollment_records') || '[]').filter((record) => Number(record.courseId) === Number(course.id)).map((record) => record.userEmail))).size, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Active Courses', value: courses.filter((course) => course.status !== 'Draft').length, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-100' },
    ];

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 lg:flex-row">
            <Sidebar />

            <main className="flex-1 p-4 sm:p-6 lg:ml-64 lg:p-8">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Instructor Studio</h1>
                        <p className="text-slate-500">Manage your content and earnings.</p>
                    </div>
                    <Link to="/dashboard/instructor/create-course">
                        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-all">
                            <Plus size={20} /> Create New Course
                        </button>
                    </Link>
                </header>

                {/* Revenue Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {revenueStats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
                                <div className="flex justify-between items-start">
                                    <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} inline-flex`}>
                                        <Icon size={20} />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
                                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Course Management Table */}
                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
                    <div className="border-b border-slate-100 p-6 dark:border-slate-800">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">My Courses</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-slate-50 text-sm uppercase tracking-wider text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                                <th className="px-6 py-4 font-semibold">Title</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Enrolled</th>
                                <th className="px-6 py-4 font-semibold">Rating</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {courses.length > 0 ? (
                                courses.map((course) => (
                                    <tr key={course.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900 dark:text-white">{course.title}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                            course.status === 'Published'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {course.status}
                                        </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{getEnrollmentCount(course.id)}</td>
                                        <td className="px-6 py-4 flex items-center gap-1 text-slate-600 dark:text-slate-300">
                                            {course.rating || '-'} <span className="text-yellow-400 text-lg">★</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Edit size={18} />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <BookOpen size={32} className="text-slate-300"/>
                                            <p>No courses found. Create your first course to get started!</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default InstructorDashboard;
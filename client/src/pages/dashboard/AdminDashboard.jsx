import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar.jsx';
import ThemeToggle from '../../components/common/ThemeToggle.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../api/axios';
import { getAllCourses, saveAllCourses } from '../../utils/courseStore.js';
import {
    Bell,
    BarChart3,
    BookOpen,
    CheckCircle2,
    Edit,
    Eye,
    ImagePlus,
    Layers3,
    ListChecks,
    Plus,
    Save,
    Search,
    Trash2,
    Users,
    Video,
    FileText,
    Upload,
} from 'lucide-react';

const emptyCourseForm = {
    id: null,
    title: '',
    category: 'Web Development',
    description: '',
    instructor: '',
    price: 0,
    type: 'self-paced',
    status: 'Draft',
    thumbnail: '',
    videoUrl: '',
};

const emptyLessonForm = {
    title: '',
    duration: '',
    videoUrl: '',
};

const emptyNotificationForm = {
    title: '',
    message: '',
    target: 'All students',
};

const emptyResourceForm = {
    title: '',
    description: '',
    courseId: 'all',
    file: null,
    fileName: '',
    fileData: '',
    fileSize: '',
};

const ADMIN_NOTIFICATIONS_KEY = 'skillhub_admin_notifications';
const ENROLLMENT_RECORDS_KEY = 'skillhub_enrollment_records';
const REGISTERED_USERS_KEY = 'skillhub_registered_users';
const API_BASE_URL = api.defaults.baseURL || 'http://localhost:5000/api';

const formatDate = (value) => new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
});

const AdminDashboard = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [activeCourseId, setActiveCourseId] = useState(null);
    const [courseForm, setCourseForm] = useState(emptyCourseForm);
    const [lessonForm, setLessonForm] = useState(emptyLessonForm);
    const [notificationForm, setNotificationForm] = useState(emptyNotificationForm);
    const [enrollmentRecords, setEnrollmentRecords] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [registeredUsers, setRegisteredUsers] = useState([]);
    const [resources, setResources] = useState([]);
    const [resourceForm, setResourceForm] = useState(emptyResourceForm);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const storedCourses = getAllCourses();
                setCourses(storedCourses);
                setActiveCourseId(storedCourses[0]?.id ?? null);

                setNotifications(JSON.parse(localStorage.getItem(ADMIN_NOTIFICATIONS_KEY) || '[]'));
                setEnrollmentRecords(JSON.parse(localStorage.getItem(ENROLLMENT_RECORDS_KEY) || '[]'));
                setRegisteredUsers(JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]'));

                const { data } = await api.get('/resources');
                setResources(data);
            } catch {
                setNotifications([]);
                setEnrollmentRecords([]);
                setRegisteredUsers([]);
                setResources([]);
            }
        };

        loadDashboardData();
    }, []);

    const selectedCourse = useMemo(() => {
        return courses.find((course) => Number(course.id) === Number(activeCourseId)) || courses[0] || null;
    }, [courses, activeCourseId]);

    useEffect(() => {
        if (selectedCourse) {
            setCourseForm({
                id: selectedCourse.id,
                title: selectedCourse.title || '',
                category: selectedCourse.category || 'Web Development',
                description: selectedCourse.description || '',
                instructor: selectedCourse.instructor || '',
                price: selectedCourse.price ?? 0,
                type: selectedCourse.type || 'self-paced',
                status: selectedCourse.status || 'Draft',
                thumbnail: selectedCourse.thumbnail || '',
                videoUrl: selectedCourse.videoUrl || selectedCourse.trailer || '',
            });

            setLessonForm({
                title: '',
                duration: '',
                videoUrl: '',
            });
        }
    }, [selectedCourse]);

    const filteredCourses = courses.filter((course) => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) return true;

        return [course.title, course.category, course.instructor, course.description].some((field) =>
            String(field || '').toLowerCase().includes(query),
        );
    });

    const analytics = useMemo(() => {
        const totalLessons = courses.reduce((count, course) => count + (course.modules?.length || 0), 0);
        const publishedCount = courses.filter((course) => course.status !== 'Draft').length;
        const totalEnrollments = enrollmentRecords.length;
        const totalRegisteredUsers = registeredUsers.length;
        const totalResources = resources.length;

        return [
            { label: 'Courses', value: courses.length, icon: BookOpen, color: 'bg-blue-600' },
            { label: 'Published', value: publishedCount, icon: CheckCircle2, color: 'bg-emerald-500' },
            { label: 'Enrollments', value: totalEnrollments, icon: Users, color: 'bg-amber-500' },
            { label: 'Lessons', value: totalLessons, icon: ListChecks, color: 'bg-violet-500' },
            { label: 'Registered Users', value: totalRegisteredUsers, icon: Users, color: 'bg-cyan-500' },
            { label: 'PDF Resources', value: totalResources, icon: FileText, color: 'bg-rose-500' },
        ];
    }, [courses, enrollmentRecords, registeredUsers, resources]);

    const persistCourses = (nextCourses) => {
        setCourses(nextCourses);
        saveAllCourses(nextCourses);
    };

    const resetCourseForm = () => {
        setCourseForm(emptyCourseForm);
        setActiveCourseId(null);
    };

    const handleCourseEdit = (course) => {
        setActiveCourseId(course.id);
    };

    const handleCourseSave = (event) => {
        event.preventDefault();

        const nextCourses = [...courses];
        const moduleList = selectedCourse?.modules ? [...selectedCourse.modules] : [];
        const payload = {
            ...courseForm,
            id: courseForm.id ?? Date.now(),
            price: Number(courseForm.price) || 0,
            modules: moduleList,
        };

        const existingIndex = nextCourses.findIndex((course) => Number(course.id) === Number(payload.id));
        if (existingIndex >= 0) {
            nextCourses[existingIndex] = payload;
        } else {
            nextCourses.unshift(payload);
        }

        persistCourses(nextCourses);
        setActiveCourseId(payload.id);
    };

    const handleCourseDelete = (courseId) => {
        const nextCourses = courses.filter((course) => Number(course.id) !== Number(courseId));
        persistCourses(nextCourses);

        if (Number(activeCourseId) === Number(courseId)) {
            setActiveCourseId(nextCourses[0]?.id ?? null);
        }
    };

    const handleThumbnailUpload = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setCourseForm((current) => ({ ...current, thumbnail: String(reader.result || '') }));
        };
        reader.readAsDataURL(file);
    };

    const handleVideoUpload = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        setCourseForm((current) => ({ ...current, videoUrl: previewUrl }));
    };

    const handleLessonSave = (event) => {
        event.preventDefault();
        if (!selectedCourse) return;

        const nextCourses = courses.map((course) => {
            if (Number(course.id) !== Number(selectedCourse.id)) {
                return course;
            }

            const nextLessons = [
                ...(course.modules || []),
                {
                    id: Date.now(),
                    title: lessonForm.title,
                    duration: lessonForm.duration,
                    videoUrl: lessonForm.videoUrl,
                },
            ];

            return { ...course, modules: nextLessons };
        });

        persistCourses(nextCourses);
        setLessonForm(emptyLessonForm);
    };

    const handleLessonRemove = (lessonId) => {
        if (!selectedCourse) return;

        const nextCourses = courses.map((course) => {
            if (Number(course.id) !== Number(selectedCourse.id)) {
                return course;
            }

            return {
                ...course,
                modules: (course.modules || []).filter((lesson) => Number(lesson.id) !== Number(lessonId)),
            };
        });

        persistCourses(nextCourses);
    };

    const handleResourceFileUpload = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            return;
        }

        setResourceForm((current) => ({
            ...current,
            file,
            fileName: file.name,
            fileSize: `${Math.max(1, Math.round(file.size / 1024))} KB`,
        }));
    };

    const handleResourceSave = async (event) => {
        event.preventDefault();
        if (!resourceForm.title || !resourceForm.file) return;

        const formData = new FormData();
        formData.append('title', resourceForm.title);
        formData.append('description', resourceForm.description);
        formData.append('courseId', resourceForm.courseId);
        formData.append('file', resourceForm.file);

        const { data } = await api.post('/resources', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        setResources((current) => [data, ...current]);
        setResourceForm(emptyResourceForm);
    };

    const handleResourceDelete = async (resourceId) => {
        await api.delete(`/resources/${resourceId}`);
        setResources((current) => current.filter((resource) => resource.id !== resourceId));
    };

    const handleNotificationSend = (event) => {
        event.preventDefault();

        const nextNotifications = [
            {
                id: Date.now(),
                ...notificationForm,
                read: false,
                createdAt: new Date().toISOString(),
            },
            ...notifications,
        ];

        setNotifications(nextNotifications);
        localStorage.setItem(ADMIN_NOTIFICATIONS_KEY, JSON.stringify(nextNotifications));
        setNotificationForm(emptyNotificationForm);
    };

    const markNotificationRead = (notificationId) => {
        const nextNotifications = notifications.map((notification) => (
            notification.id === notificationId ? { ...notification, read: true } : notification
        ));

        setNotifications(nextNotifications);
        localStorage.setItem(ADMIN_NOTIFICATIONS_KEY, JSON.stringify(nextNotifications));
    };

    const unreadNotifications = notifications.filter((notification) => !notification.read).length;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 flex flex-col lg:flex-row">
            <Sidebar />

            <main className="min-w-0 flex-1 p-4 sm:p-6 xl:p-8 lg:ml-64">
                <section id="overview" className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                            Admin Studio
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Manage courses, lessons, and student activity
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Signed in as {user?.name || 'Admin'}.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Button variant="primary" onClick={resetCourseForm} className="gap-2">
                            <Plus size={18} /> New Course
                        </Button>
                    </div>
                </section>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {analytics.map((card) => {
                        const Icon = card.icon;
                        return (
                            <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
                                <div className="flex items-center justify-between">
                                    <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${card.color} text-white`}>
                                        <Icon size={20} />
                                    </div>
                                    <span className="text-xs font-medium text-slate-400">Live</span>
                                </div>
                                <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{card.value}</h2>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.9fr]">
                    <div className="space-y-6">
                        <section id="users" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
                            <div className="mb-4 flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Registered Users</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">People who created accounts on the site.</p>
                                </div>
                                <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300">
                                    {registeredUsers.length}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                                {registeredUsers.length > 0 ? (
                                    registeredUsers.map((registeredUser) => (
                                        <div key={registeredUser.email} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-white">{registeredUser.name}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{registeredUser.email}</p>
                                                </div>
                                                <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                                                    {registeredUser.role || 'learner'}
                                                </span>
                                            </div>
                                            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                                                Joined {registeredUser.createdAt ? formatDate(registeredUser.createdAt) : 'recently'}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400 lg:col-span-2">
                                        No users have registered yet.
                                    </div>
                                )}
                            </div>
                        </section>

                        <section id="courses" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
                            <div className="mb-5 flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Course Editor</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Add new courses, edit details, and manage media uploads.</p>
                                </div>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                                    {courseForm.id ? 'Editing course' : 'New course'}
                                </span>
                            </div>

                            <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleCourseSave}>
                                <Input label="Course Title" value={courseForm.title} onChange={(e) => setCourseForm((current) => ({ ...current, title: e.target.value }))} />
                                <Input label="Instructor" value={courseForm.instructor} onChange={(e) => setCourseForm((current) => ({ ...current, instructor: e.target.value }))} />

                                <div>
                                    <label className="theme-label mb-1">Category</label>
                                    <select className="theme-input" value={courseForm.category} onChange={(e) => setCourseForm((current) => ({ ...current, category: e.target.value }))}>
                                        <option>Web Development</option>
                                        <option>Design</option>
                                        <option>CS</option>
                                        <option>Business</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="theme-label mb-1">Course Type</label>
                                    <select className="theme-input" value={courseForm.type} onChange={(e) => setCourseForm((current) => ({ ...current, type: e.target.value }))}>
                                        <option value="self-paced">Self-paced</option>
                                        <option value="live">Live</option>
                                        <option value="reading">Reading</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="theme-label mb-1">Price</label>
                                    <input type="number" min="0" className="theme-input" value={courseForm.price} onChange={(e) => setCourseForm((current) => ({ ...current, price: e.target.value }))} />
                                </div>

                                <div>
                                    <label className="theme-label mb-1">Status</label>
                                    <select className="theme-input" value={courseForm.status} onChange={(e) => setCourseForm((current) => ({ ...current, status: e.target.value }))}>
                                        <option>Draft</option>
                                        <option>Published</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="theme-label mb-1">Description</label>
                                    <textarea
                                        rows={4}
                                        className="theme-input"
                                        value={courseForm.description}
                                        onChange={(e) => setCourseForm((current) => ({ ...current, description: e.target.value }))}
                                    />
                                </div>

                                <div className="md:col-span-2 grid grid-cols-1 gap-4 lg:grid-cols-2">
                                    <div className="rounded-2xl border border-dashed border-slate-300 p-4 dark:border-slate-700">
                                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                            <ImagePlus size={18} /> Upload Thumbnail
                                        </div>
                                        <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700 dark:text-slate-400" />
                                        {courseForm.thumbnail && (
                                            <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                                                <img src={courseForm.thumbnail} alt="Thumbnail preview" className="h-40 w-full object-cover" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="rounded-2xl border border-dashed border-slate-300 p-4 dark:border-slate-700">
                                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                            <Video size={18} /> Upload Trailer Video
                                        </div>
                                        <input type="file" accept="video/*" onChange={handleVideoUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-white hover:file:bg-slate-700 dark:text-slate-400" />
                                        <Input className="mt-4" label="Video URL or Preview Link" value={courseForm.videoUrl} onChange={(e) => setCourseForm((current) => ({ ...current, videoUrl: e.target.value }))} />
                                    </div>
                                </div>

                                <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
                                    <Button type="submit" variant="primary" className="gap-2">
                                        <Save size={18} /> {courseForm.id ? 'Update Course' : 'Save Course'}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={resetCourseForm}>
                                        Clear Form
                                    </Button>
                                </div>
                            </form>
                        </section>

                        <section id="lessons" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
                            <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Course Library</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Edit or remove existing courses.</p>
                                </div>
                                <div className="relative w-full md:w-72">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search courses..."
                                        className="theme-input pl-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                {filteredCourses.map((course) => (
                                    <article 
                                        key={course.id} 
                                        className={`group overflow-hidden rounded-2xl border transition-all ${
                                            Number(activeCourseId) === Number(course.id) 
                                                ? 'border-blue-500 bg-blue-50/30 ring-2 ring-blue-500/20 dark:border-blue-500 dark:bg-blue-950/20' 
                                                : 'border-slate-200 bg-slate-50/60 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700'
                                        } p-4 shadow-xs`}
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            {/* Left: Horizontal Thumbnail & Main Info */}
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1 min-w-0">
                                                <div className="relative h-28 w-full sm:w-44 md:w-48 flex-shrink-0 overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800">
                                                    <img 
                                                        src={course.thumbnail} 
                                                        alt={course.title} 
                                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                                                    />
                                                    <span className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm ${
                                                        course.status === 'Published' ? 'bg-emerald-600/90' : 'bg-amber-600/90'
                                                    }`}>
                                                        {course.status}
                                                    </span>
                                                </div>

                                                <div className="flex-1 min-w-0 space-y-2">
                                                    <div>
                                                        <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg leading-snug">
                                                            {course.title}
                                                        </h3>
                                                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                                            <span className="font-medium text-slate-700 dark:text-slate-300">{course.category}</span>
                                                            <span className="mx-1.5">•</span>
                                                            <span>{course.modules?.length || 0} lessons</span>
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                                                        <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-semibold text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                                                            {course.price === 0 || course.price === '0' ? 'Free' : `$${course.price}`}
                                                        </span>
                                                        <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 capitalize dark:border-slate-800 dark:bg-slate-900">
                                                            {course.type}
                                                        </span>
                                                        <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 dark:border-slate-800 dark:bg-slate-900">
                                                            {course.instructor}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: Actions */}
                                            <div className="flex sm:flex-col lg:flex-row items-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-200/80 dark:border-slate-800 flex-shrink-0">
                                                <button 
                                                    type="button" 
                                                    onClick={() => setActiveCourseId(course.id)} 
                                                    className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                                                        Number(activeCourseId) === Number(course.id)
                                                            ? 'bg-blue-600 text-white shadow-sm'
                                                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/60'
                                                    }`}
                                                >
                                                    <Eye size={15} />
                                                    <span>Manage lessons</span>
                                                </button>
                                                <div className="flex items-center gap-1">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleCourseEdit(course)} 
                                                        className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 transition-colors"
                                                        title="Edit Course"
                                                    >
                                                        <Edit size={15} />
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleCourseDelete(course.id)} 
                                                        className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-red-950/40 transition-colors"
                                                        title="Delete Course"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>

                        <section id="resources" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
                            <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">PDF Resources</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Upload PDF files for later reference.</p>
                                </div>
                                <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                                    {resources.length} files
                                </span>
                            </div>

                            <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleResourceSave}>
                                <div>
                                    <label className="theme-label mb-1">Resource Title</label>
                                    <input
                                        className="theme-input"
                                        value={resourceForm.title}
                                        onChange={(e) => setResourceForm((current) => ({ ...current, title: e.target.value }))}
                                        placeholder="Advanced React handbook"
                                    />
                                </div>
                                <div>
                                    <label className="theme-label mb-1">Attach to Course</label>
                                    <select
                                        className="theme-input"
                                        value={resourceForm.courseId}
                                        onChange={(e) => setResourceForm((current) => ({ ...current, courseId: e.target.value }))}
                                    >
                                        <option value="all">All courses</option>
                                        {courses.map((course) => (
                                            <option key={course.id} value={course.id}>{course.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="theme-label mb-1">Description</label>
                                    <textarea
                                        rows={3}
                                        className="theme-input"
                                        value={resourceForm.description}
                                        onChange={(e) => setResourceForm((current) => ({ ...current, description: e.target.value }))}
                                        placeholder="Short description for the PDF"
                                    />
                                </div>
                                <div className="md:col-span-2 rounded-2xl border border-dashed border-slate-300 p-4 dark:border-slate-700">
                                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                        <Upload size={18} /> Upload PDF
                                    </div>
                                    <input type="file" accept="application/pdf" onChange={handleResourceFileUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-rose-600 file:px-4 file:py-2 file:text-white hover:file:bg-rose-700 dark:text-slate-400" />
                                    {resourceForm.fileName && (
                                        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                                            Selected: {resourceForm.fileName} {resourceForm.fileSize ? `(${resourceForm.fileSize})` : ''}
                                        </p>
                                    )}
                                </div>
                                <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
                                    <Button type="submit" variant="primary" className="gap-2">
                                        <FileText size={18} /> Save PDF Resource
                                    </Button>
                                </div>
                            </form>

                            <div className="mt-6 space-y-3">
                                {resources.length > 0 ? (
                                    resources.map((resource) => (
                                        <div key={resource.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-white">{resource.title}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        {resource.fileName} {resource.fileSize ? `• ${Math.max(1, Math.round(resource.fileSize / 1024))} KB` : ''}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <a href={`${API_BASE_URL}${resource.downloadUrl}`} download={resource.fileName} className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300 dark:hover:bg-rose-950">
                                                        Download
                                                    </a>
                                                    <button type="button" onClick={() => handleResourceDelete(resource.id)} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800">
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                            {resource.description && (
                                                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{resource.description}</p>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                                        No PDF resources uploaded yet.
                                    </div>
                                )}
                            </div>
                        </section>

                        <section id="enrollments" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
                            <div className="mb-4 flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Manage Lessons</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {selectedCourse ? `Selected course: ${selectedCourse.title}` : 'Choose a course to manage its lessons.'}
                                    </p>
                                </div>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                                    {selectedCourse?.modules?.length || 0} lessons
                                </span>
                            </div>

                            {selectedCourse ? (
                                <div className="space-y-6">
                                    {/* Flat Horizontal Add Lesson Form */}
                                    <form className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-950/50" onSubmit={handleLessonSave}>
                                        <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                                            <Plus size={18} className="text-blue-600" /> Add New Lesson to &ldquo;{selectedCourse.title}&rdquo;
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.5fr_auto] gap-3 items-end">
                                            <Input label="Lesson Title" placeholder="e.g. Introduction" value={lessonForm.title} onChange={(e) => setLessonForm((current) => ({ ...current, title: e.target.value }))} />
                                            <Input label="Duration" placeholder="e.g. 10:20" value={lessonForm.duration} onChange={(e) => setLessonForm((current) => ({ ...current, duration: e.target.value }))} />
                                            <Input label="Video URL" placeholder="https://..." value={lessonForm.videoUrl} onChange={(e) => setLessonForm((current) => ({ ...current, videoUrl: e.target.value }))} />
                                            <Button type="submit" variant="primary" className="h-[44px] px-5 gap-1.5 whitespace-nowrap justify-center">
                                                <Save size={16} /> Save Lesson
                                            </Button>
                                        </div>
                                    </form>

                                    {/* Flat Horizontal Current Lesson List */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-slate-900 dark:text-white text-base">Current Lesson List</h3>
                                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                {(selectedCourse.modules || []).length} lessons total
                                            </span>
                                        </div>

                                        {(selectedCourse.modules || []).length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {selectedCourse.modules.map((lesson, index) => (
                                                    <div 
                                                        key={lesson.id} 
                                                        className="flex items-center justify-between rounded-xl border border-slate-200/90 bg-white p-3 shadow-xs hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-slate-700 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                                                            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-600 dark:bg-blue-950/60 dark:text-blue-300">
                                                                {index + 1}
                                                            </span>
                                                            <div className="min-w-0 flex-1">
                                                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate" title={lesson.title}>
                                                                    {lesson.title}
                                                                </p>
                                                                <span className="inline-block text-[11px] font-medium text-slate-400">
                                                                    {lesson.duration || '00:00'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 flex-shrink-0">
                                                            {lesson.videoUrl && (
                                                                <a 
                                                                    href={lesson.videoUrl} 
                                                                    target="_blank" 
                                                                    rel="noreferrer" 
                                                                    className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-800 transition-colors"
                                                                    title="Watch Video"
                                                                >
                                                                    <Video size={16} />
                                                                </a>
                                                            )}
                                                            <button 
                                                                type="button" 
                                                                onClick={() => handleLessonRemove(lesson.id)} 
                                                                className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 transition-colors"
                                                                title="Remove Lesson"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                                                This course has no lessons yet. Use the form above to add the first lesson!
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-500 dark:border-slate-800 dark:text-slate-400">
                                    Select a course to manage its lessons.
                                </div>
                            )}
                        </section>
                    </div>

                    <div className="space-y-6">
                        <section id="notifications" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Student Enrollments</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Live record of enrollments captured from the catalog.</p>
                                </div>
                                <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                                    {enrollmentRecords.length}
                                </div>
                            </div>

                            <div className="space-y-3">
                                {enrollmentRecords.length > 0 ? (
                                    enrollmentRecords.slice(0, 8).map((record) => (
                                        <div key={record.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-white">{record.userName}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{record.userEmail}</p>
                                                </div>
                                                <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                                                    {formatDate(record.enrolledAt)}
                                                </span>
                                            </div>
                                            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{record.courseTitle}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                                        No enrollment records yet.
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Notifications</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Send course updates and reminders.</p>
                                </div>
                                <div className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                                    <Bell size={14} /> {unreadNotifications} unread
                                </div>
                            </div>

                            <form className="space-y-3" onSubmit={handleNotificationSend}>
                                <Input label="Notification Title" value={notificationForm.title} onChange={(e) => setNotificationForm((current) => ({ ...current, title: e.target.value }))} />
                                <div>
                                    <label className="theme-label mb-1">Target</label>
                                    <select className="theme-input" value={notificationForm.target} onChange={(e) => setNotificationForm((current) => ({ ...current, target: e.target.value }))}>
                                        <option>All students</option>
                                        {courses.map((course) => (
                                            <option key={course.id}>{course.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="theme-label mb-1">Message</label>
                                    <textarea rows={4} className="theme-input" value={notificationForm.message} onChange={(e) => setNotificationForm((current) => ({ ...current, message: e.target.value }))} />
                                </div>
                                <Button type="submit" variant="primary" className="w-full gap-2">
                                    <Bell size={18} /> Send Notification
                                </Button>
                            </form>

                            <div className="mt-5 space-y-3">
                                {notifications.length > 0 ? (
                                    notifications.slice(0, 5).map((notification) => (
                                        <button key={notification.id} type="button" onClick={() => markNotificationRead(notification.id)} className={`w-full rounded-2xl border p-4 text-left transition-colors ${notification.read ? 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950' : 'border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/40'}`}>
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-white">{notification.title}</p>
                                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">To: {notification.target}</p>
                                                </div>
                                                <span className="text-[11px] text-slate-400">{formatDate(notification.createdAt)}</span>
                                            </div>
                                            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{notification.message}</p>
                                        </button>
                                    ))
                                ) : (
                                    <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                                        No notifications sent yet.
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
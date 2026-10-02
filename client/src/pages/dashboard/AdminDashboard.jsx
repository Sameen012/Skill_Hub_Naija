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
    Globe,
    Layers,
    Tag,
    User,
    Code,
    Play,
    PlayCircle,
    ChevronRight,
    Clock,
    GraduationCap,
    UploadCloud,
    Download,
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

                {/* --- FULL-WIDTH SECTIONS: Course Library, Current Lesson List, and PDF Resources --- */}
                <div className="mt-8 space-y-8">
                    {/* 1. Course Library Section (Matching Image 1) */}
                    <section id="lessons" className="rounded-3xl border border-blue-900/30 bg-[#0b1220]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
                        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Course Library</h2>
                                <p className="text-sm text-slate-400 mt-0.5">Edit or remove existing courses.</p>
                            </div>
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search courses..."
                                    className="w-full rounded-2xl border border-slate-800 bg-slate-900/70 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredCourses.map((course) => (
                                <article 
                                    key={course.id} 
                                    className={`group relative overflow-hidden rounded-3xl border transition-all duration-300 ${
                                        Number(activeCourseId) === Number(course.id) 
                                            ? 'border-blue-500 ring-2 ring-blue-500/40 shadow-xl shadow-blue-500/10' 
                                            : 'border-slate-800/80 hover:border-slate-700 shadow-xl'
                                    } bg-slate-950/80 p-5 flex flex-col justify-between`}
                                >
                                    {/* Thumbnail with PUBLISHED badge */}
                                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-900">
                                        <img 
                                            src={course.thumbnail} 
                                            alt={course.title} 
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                        />
                                        <span className={`absolute left-3.5 top-3.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-md ${
                                            course.status === 'Published' || !course.status || course.status === 'PUBLISHED'
                                                ? 'bg-emerald-500 shadow-emerald-500/30'
                                                : 'bg-amber-500 shadow-amber-500/30'
                                        }`}>
                                            {course.status || 'PUBLISHED'}
                                        </span>
                                    </div>

                                    {/* Centered Title & Metadata with icons */}
                                    <div className="mt-5 text-center flex-1">
                                        <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                                            {course.title}
                                        </h3>
                                        <div className="mt-2.5 flex items-center justify-center gap-2 text-sm text-slate-400">
                                            <span className="flex items-center gap-1.5 text-slate-300">
                                                <Globe size={16} className="text-blue-400" />
                                                {course.category}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1.5 text-slate-300">
                                                <Layers size={16} className="text-blue-400" />
                                                {course.modules?.length || 0} lessons
                                            </span>
                                        </div>
                                    </div>

                                    {/* Button Row matching Image 1 */}
                                    <div className="mt-6 flex items-center gap-3 w-full">
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                setActiveCourseId(course.id);
                                                const element = document.getElementById('enrollments');
                                                if (element) element.scrollIntoView({ behavior: 'smooth' });
                                            }} 
                                            className="flex-1 flex items-center justify-between px-5 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-sky-400 transition-all active:scale-[0.98]"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-blue-600">
                                                    <Play size={11} className="fill-current ml-0.5" />
                                                </div>
                                                <span>Manage lessons</span>
                                            </div>
                                            <ChevronRight size={18} />
                                        </button>

                                        <button 
                                            type="button" 
                                            onClick={() => handleCourseEdit(course)} 
                                            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-800/40 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                                            title="Edit Course"
                                        >
                                            <Edit size={18} />
                                        </button>

                                        <button 
                                            type="button" 
                                            onClick={() => handleCourseDelete(course.id)} 
                                            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-800/40 text-slate-300 hover:bg-red-950/40 hover:border-red-800/60 hover:text-red-400 transition-colors"
                                            title="Delete Course"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    {/* Bottom Tags matching Image 1 */}
                                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 pt-1">
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/60 bg-slate-900/80 px-3.5 py-1.5 text-xs font-medium text-slate-300">
                                            <Tag size={12} className="text-blue-400" />
                                            {course.price === 0 || course.price === '0' ? 'Free' : `$${course.price}`}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/60 bg-slate-900/80 px-3.5 py-1.5 text-xs font-medium capitalize text-slate-300">
                                            <User size={12} className="text-blue-400" />
                                            {course.type}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/60 bg-slate-900/80 px-3.5 py-1.5 text-xs font-medium text-slate-300 max-w-[220px] truncate" title={course.instructor}>
                                            <Code size={12} className="text-blue-400" />
                                            {course.instructor}
                                        </span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    {/* 2. Current Lesson List Section (Matching Image 2) */}
                    <section id="enrollments" className="rounded-3xl border border-blue-900/30 bg-[#0b1220]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
                        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-start gap-3.5">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-md">
                                    <BookOpen size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Current Lesson List</h2>
                                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                                        Follow the lessons in order and build your {selectedCourse ? selectedCourse.title : 'course'} skills step by step.
                                    </p>
                                </div>
                            </div>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-900/60 bg-blue-950/40 px-4 py-1.5 text-xs font-medium text-blue-300 self-start sm:self-auto shadow-sm">
                                <GraduationCap size={15} className="text-blue-400" />
                                {selectedCourse?.modules?.length || 0} lessons total
                            </span>
                        </div>

                        {selectedCourse ? (
                            <div className="space-y-6">
                                {/* Add Lesson Form */}
                                <form className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:p-5" onSubmit={handleLessonSave}>
                                    <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-200 text-sm">
                                        <Plus size={16} className="text-blue-400" /> Add New Lesson to &ldquo;{selectedCourse.title}&rdquo;
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-[1.5fr_1fr_1.5fr_auto] gap-3 items-end">
                                        <Input label="Lesson Title" placeholder="e.g. Introduction to React" value={lessonForm.title} onChange={(e) => setLessonForm((current) => ({ ...current, title: e.target.value }))} />
                                        <Input label="Duration" placeholder="e.g. 10:20" value={lessonForm.duration} onChange={(e) => setLessonForm((current) => ({ ...current, duration: e.target.value }))} />
                                        <Input label="Video URL" placeholder="https://..." value={lessonForm.videoUrl} onChange={(e) => setLessonForm((current) => ({ ...current, videoUrl: e.target.value }))} />
                                        <Button type="submit" variant="primary" className="h-[44px] px-5 gap-1.5 whitespace-nowrap justify-center">
                                            <Save size={16} /> Save Lesson
                                        </Button>
                                    </div>
                                </form>

                                {/* 3-column Lesson Grid matching Image 2 */}
                                {(selectedCourse.modules || []).length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                                        {selectedCourse.modules.map((lesson, index) => {
                                            const isFirst = index === 0;
                                            return (
                                                <div 
                                                    key={lesson.id}
                                                    className={`group flex items-center justify-between gap-3 rounded-2xl p-3.5 transition-all ${
                                                        isFirst
                                                            ? 'border border-blue-500 bg-blue-950/20 ring-2 ring-blue-500/40 shadow-lg shadow-blue-500/20'
                                                            : 'border border-slate-800/80 bg-slate-950/60 hover:border-slate-700'
                                                    }`}
                                                >
                                                    {/* Blue Number Badge */}
                                                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/25">
                                                        {index + 1}
                                                    </div>

                                                    {/* Title & Duration */}
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-semibold text-white truncate" title={lesson.title}>
                                                            {lesson.title}
                                                        </p>
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                                                            <Clock size={12} className="text-slate-500" />
                                                            <span>{lesson.duration || '05:00'}</span>
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                                        {lesson.videoUrl && (
                                                            <a 
                                                                href={lesson.videoUrl} 
                                                                target="_blank" 
                                                                rel="noreferrer" 
                                                                className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800/70 text-slate-300 hover:bg-blue-600 hover:text-white transition-colors"
                                                                title="Watch Video"
                                                            >
                                                                <Play size={12} className="fill-current ml-0.5" />
                                                            </a>
                                                        )}
                                                        <button 
                                                            type="button" 
                                                            onClick={() => handleLessonRemove(lesson.id)} 
                                                            className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800/70 text-slate-400 hover:bg-red-600/80 hover:text-white transition-colors"
                                                            title="Delete Lesson"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="rounded-2xl border border-dashed border-slate-800 p-10 text-center text-sm text-slate-500">
                                        This course has no lessons yet. Use the form above to add the first lesson!
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-500">
                                Select a course from the Course Library above to manage its lessons.
                            </div>
                        )}
                    </section>

                    {/* 3. PDF Resources Section (Matching Image 3) */}
                    <section id="resources" className="rounded-3xl border border-blue-900/30 bg-[#0b1220]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
                        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr] gap-6 items-start">
                            {/* Left: Upload Form */}
                            <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-6 shadow-xl space-y-5">
                                <div className="flex items-start gap-3.5">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white tracking-tight">PDF Resources</h2>
                                        <p className="text-xs text-slate-400 mt-0.5">Upload PDF files for later reference.</p>
                                    </div>
                                </div>

                                <form onSubmit={handleResourceSave} className="space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                                            <Tag size={13} className="text-blue-400" /> Resource Title
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Advanced React Handbook"
                                            value={resourceForm.title}
                                            onChange={(e) => setResourceForm((current) => ({ ...current, title: e.target.value }))}
                                            className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                                            <GraduationCap size={13} className="text-blue-400" /> Attach to Course
                                        </label>
                                        <select
                                            value={resourceForm.courseId}
                                            onChange={(e) => setResourceForm((current) => ({ ...current, courseId: e.target.value }))}
                                            className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-3.5 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                                        >
                                            <option value="all">Select a course</option>
                                            {courses.map((course) => (
                                                <option key={course.id} value={course.id}>{course.title}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                                            <FileText size={13} className="text-blue-400" /> Description
                                        </label>
                                        <textarea
                                            rows={3}
                                            placeholder="Short description for the PDF..."
                                            value={resourceForm.description}
                                            onChange={(e) => setResourceForm((current) => ({ ...current, description: e.target.value }))}
                                            className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                                        />
                                    </div>

                                    <div className="rounded-2xl border-2 border-dashed border-blue-900/50 bg-blue-950/10 p-5 text-center transition-colors hover:border-blue-700/60">
                                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 mb-2">
                                            <UploadCloud size={22} />
                                        </div>
                                        <h4 className="text-sm font-semibold text-white">Upload PDF</h4>
                                        <p className="text-xs text-slate-400 mt-0.5 mb-3">Drag & drop your file here or click to browse</p>
                                        
                                        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/30 hover:bg-blue-500 transition-all">
                                            <Upload size={14} />
                                            <span>Choose File</span>
                                            <input
                                                type="file"
                                                accept="application/pdf"
                                                onChange={handleResourceFileUpload}
                                                className="hidden"
                                            />
                                        </label>
                                        <p className="mt-2 text-xs text-slate-400 truncate">
                                            {resourceForm.fileName || 'No file chosen'}
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!resourceForm.title || !resourceForm.file}
                                        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-sky-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.99]"
                                    >
                                        <Save size={16} />
                                        <span>Save PDF Resource</span>
                                    </button>
                                </form>
                            </div>

                            {/* Right: Uploaded Resources matching Image 3 */}
                            <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-6 shadow-xl flex flex-col min-h-[460px]">
                                <div className="mb-6 flex items-center justify-between">
                                    <div className="flex items-start gap-3.5">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                                            <FileText size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-white tracking-tight">Uploaded Resources</h2>
                                            <p className="text-xs text-slate-400 mt-0.5">Your uploaded PDF files are listed below.</p>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-900/60 bg-blue-950/40 px-3.5 py-1.5 text-xs font-medium text-blue-300">
                                        <FileText size={12} className="text-blue-400" />
                                        {resources.length} files
                                    </span>
                                </div>

                                {resources.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {resources.map((resource) => {
                                            const attachedCourse = courses.find((c) => Number(c.id) === Number(resource.courseId || resource.course_id));
                                            const courseName = attachedCourse ? attachedCourse.title : (resource.courseId === 'all' || !resource.courseId ? 'General' : resource.category || 'Course Resource');
                                            return (
                                                <div 
                                                    key={resource.id}
                                                    className="group relative flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 transition-all hover:border-blue-900/60 hover:bg-slate-900/90 shadow-md"
                                                >
                                                    <div>
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="flex items-start gap-3 min-w-0 flex-1">
                                                                {/* Red PDF Icon Badge */}
                                                                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-md shadow-rose-600/25">
                                                                    <div className="text-center leading-none">
                                                                        <FileText size={16} className="mx-auto" />
                                                                        <span className="text-[9px] font-black tracking-tighter">PDF</span>
                                                                    </div>
                                                                </div>

                                                                <div className="min-w-0 flex-1">
                                                                    <h4 className="text-sm font-bold text-white leading-snug truncate" title={resource.title}>
                                                                        {resource.title}
                                                                    </h4>
                                                                    <p className="text-xs text-blue-400 flex items-center gap-1 mt-1 truncate">
                                                                        <GraduationCap size={12} className="flex-shrink-0" />
                                                                        <span className="truncate">{courseName}</span>
                                                                    </p>
                                                                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1.5">
                                                                        <span>{resource.fileSize || `${Math.max(1, Math.round((resource.file_size || 0) / 1024))} KB`}</span>
                                                                        <span>•</span>
                                                                        <span>{resource.createdAt ? formatDate(resource.createdAt) : (resource.created_at ? formatDate(resource.created_at) : 'Today')}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <ChevronRight size={16} className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
                                                        </div>

                                                        {resource.description && (
                                                            <p className="mt-2.5 text-xs text-slate-400 line-clamp-2">
                                                                {resource.description}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center justify-end gap-1.5 mt-3 pt-2.5 border-t border-slate-800/80">
                                                        <a
                                                            href={`${API_BASE_URL}${resource.downloadUrl || `/resources/${resource.id}/download`}`}
                                                            download={resource.fileName || resource.file_name}
                                                            className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800/60 text-slate-400 hover:bg-blue-600 hover:text-white transition-colors"
                                                            title="Download PDF"
                                                        >
                                                            <Download size={14} />
                                                        </a>
                                                        <a
                                                            href={`${API_BASE_URL}${resource.downloadUrl || `/resources/${resource.id}/download`}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800/60 text-slate-400 hover:bg-blue-600 hover:text-white transition-colors"
                                                            title="View PDF"
                                                        >
                                                            <Eye size={14} />
                                                        </a>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleResourceDelete(resource.id)}
                                                            className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800/60 text-slate-400 hover:bg-red-600/80 hover:text-white transition-colors"
                                                            title="Delete Resource"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-800/80 p-10 text-center">
                                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/50 text-slate-500">
                                            <FileText size={26} />
                                        </div>
                                        <h4 className="text-sm font-semibold text-white">No PDF resources uploaded yet</h4>
                                        <p className="text-xs text-slate-400 mt-1 max-w-xs">
                                            Upload your documents using the form on the left. They will appear here formatted as PDF cards.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
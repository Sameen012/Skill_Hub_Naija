import { COURSES } from '../data/courseData.js';

const COURSE_STORAGE_KEY = 'skillhub_admin_courses';

const cloneLesson = (lesson) => ({
    id: lesson.id,
    title: lesson.title,
    duration: lesson.duration,
    videoUrl: lesson.videoUrl,
});

const normalizeCourse = (course) => ({
    ...course,
    modules: Array.isArray(course.modules)
        ? course.modules.map(cloneLesson)
        : Array.isArray(course.lessons)
            ? course.lessons.map(cloneLesson)
            : [],
    status: course.status || 'Published',
});

const getStorage = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    return window.localStorage;
};

export const getAllCourses = () => {
    const storage = getStorage();

    if (!storage) {
        return COURSES.map(normalizeCourse);
    }

    try {
        const raw = storage.getItem(COURSE_STORAGE_KEY);
        if (!raw) {
            return COURSES.map(normalizeCourse);
        }

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            return COURSES.map(normalizeCourse);
        }

        return parsed.map(normalizeCourse);
    } catch {
        return COURSES.map(normalizeCourse);
    }
};

export const getCourseById = (courseId) => {
    return getAllCourses().find((course) => Number(course.id) === Number(courseId));
};

export const saveAllCourses = (courses) => {
    const storage = getStorage();

    if (!storage) {
        return;
    }

    const normalized = courses.map(normalizeCourse);
    storage.setItem(COURSE_STORAGE_KEY, JSON.stringify(normalized));
};

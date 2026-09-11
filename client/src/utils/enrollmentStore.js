import { getCourseById } from './courseStore.js';

export const getCurrentUser = () => {
    try {
        const raw = localStorage.getItem('skillhub_user');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

const getEnrollmentKey = (user) => {
    const active = user || getCurrentUser();
    if (!active || !active.email) return null;
    return `skillhub_enrolled_${active.email.toLowerCase()}`;
};

const getProgressKey = (courseId, user) => {
    const active = user || getCurrentUser();
    if (!active || !active.email) return null;
    return `skillhub_progress_${active.email.toLowerCase()}_${courseId}`;
};

export const getEnrolledCourseIds = (user) => {
    const key = getEnrollmentKey(user);
    if (!key) return [];
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

export const isCourseEnrolled = (courseId, user) => {
    const list = getEnrolledCourseIds(user);
    return list.some((id) => Number(id) === Number(courseId));
};

export const enrollInCourse = (courseId, user) => {
    const active = user || getCurrentUser();
    if (!active || !active.email) return false;

    const numId = Number(courseId);
    const key = getEnrollmentKey(active);
    const existing = getEnrolledCourseIds(active);

    if (!existing.some((id) => Number(id) === numId)) {
        const updated = [...existing, numId];
        localStorage.setItem(key, JSON.stringify(updated));

        // Track in admin enrollment records
        try {
            const records = JSON.parse(localStorage.getItem('skillhub_enrollment_records') || '[]');
            const course = getCourseById(numId);
            if (course) {
                const alreadyTracked = records.some(
                    (r) => Number(r.courseId) === numId && r.userEmail === active.email
                );
                if (!alreadyTracked) {
                    records.unshift({
                        id: `${numId}-${active.email}`,
                        userName: active.name,
                        userEmail: active.email,
                        courseId: numId,
                        courseTitle: course.title,
                        enrolledAt: new Date().toISOString(),
                    });
                    localStorage.setItem('skillhub_enrollment_records', JSON.stringify(records));
                }
            }
        } catch (e) {
            console.error('Error updating enrollment records:', e);
        }
    }
    return true;
};

export const unenrollFromCourse = (courseId, user) => {
    const active = user || getCurrentUser();
    if (!active || !active.email) return false;

    const numId = Number(courseId);
    const key = getEnrollmentKey(active);
    const existing = getEnrolledCourseIds(active);

    const updated = existing.filter((id) => Number(id) !== numId);
    localStorage.setItem(key, JSON.stringify(updated));
    return true;
};

export const getCourseProgress = (courseId, user) => {
    const key = getProgressKey(courseId, user);
    if (!key) return [];
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

export const saveCourseProgress = (courseId, completedLessons, user) => {
    const key = getProgressKey(courseId, user);
    if (!key) return;
    try {
        localStorage.setItem(key, JSON.stringify(completedLessons));
    } catch (e) {
        console.error('Error saving course progress:', e);
    }
};

export const clearLegacyGlobalEnrollments = () => {
    try {
        localStorage.removeItem('enrolledCourses');
    } catch (e) {}
};

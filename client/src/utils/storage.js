const STORAGE_PREFIX = 'skillhub';
const USER_KEY = 'skillhub_user';

const getStorage = () => {
    if (typeof window === 'undefined') {
        return null;
    }
    return window.localStorage;
};

export const getCurrentUser = () => {
    const storage = getStorage();
    if (!storage) return null;
    try {
        const raw = storage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

export const getCurrentUserEmail = () => {
    const user = getCurrentUser();
    return user?.email || 'guest';
};

export const getEnrollmentStorageKey = (email = getCurrentUserEmail()) => `${STORAGE_PREFIX}_enrolledCourses_${email}`;
export const getProgressStorageKey = (courseId, email = getCurrentUserEmail()) => `${STORAGE_PREFIX}_progress_${email}_${courseId}`;

export const getStoredEnrollments = (email = getCurrentUserEmail()) => {
    const storage = getStorage();
    if (!storage) return [];
    try {
        return JSON.parse(storage.getItem(getEnrollmentStorageKey(email)) || '[]');
    } catch {
        return [];
    }
};

export const setStoredEnrollments = (ids, email = getCurrentUserEmail()) => {
    const storage = getStorage();
    if (!storage) return;
    storage.setItem(getEnrollmentStorageKey(email), JSON.stringify(ids));
};

export const getStoredProgress = (courseId, email = getCurrentUserEmail()) => {
    const storage = getStorage();
    if (!storage) return [];
    try {
        return JSON.parse(storage.getItem(getProgressStorageKey(courseId, email)) || '[]');
    } catch {
        return [];
    }
};

export const setStoredProgress = (courseId, completedLessons, email = getCurrentUserEmail()) => {
    const storage = getStorage();
    if (!storage) return;
    storage.setItem(getProgressStorageKey(courseId, email), JSON.stringify(completedLessons));
};

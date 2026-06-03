import api from './axios';

export const fetchMyEnrollments = async () => {
    const { data } = await api.get('/enrollments/me');
    return data;
};

export const createEnrollment = async (courseId) => {
    const { data } = await api.post('/enrollments', { courseId });
    return data;
};

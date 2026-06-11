import React, { Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

// Lazy load all pages for code splitting (faster initial load)
const Login = React.lazy(() => import('../pages/auth/Login'));
const Register = React.lazy(() => import('../pages/auth/Register'));
const ResetPassword = React.lazy(() => import('../pages/auth/ResetPassword'));
const ForgotPassword = React.lazy(() => import('../pages/auth/ForgotPassword'));
const Home = React.lazy(() => import('../pages/Home'));

// Dashboard & Protected Pages
const LearnerDashboard = React.lazy(() => import("../pages/dashboard/LearnerDashboard"));
const InstructorDashboard = React.lazy(() => import("../pages/dashboard/InstructorDashboard"));
const AdminDashboard = React.lazy(() => import("../pages/dashboard/AdminDashboard"));
const CourseCatalog = React.lazy(() => import('../pages/CourseCatalog'));
const CoursePlayer = React.lazy(() => import('../pages/CoursePlayer'));
const Settings = React.lazy(() => import('../pages/dashboard/Settings'));
const Certifications = React.lazy(() => import('../pages/Certifications'));
const ComputerBasicsViewer = React.lazy(() => import('../pages/ComputerBasicsViewer'));

// Public Pages
const Contact = React.lazy(() => import("../pages/public/Contact"));
const About = React.lazy(() => import("../pages/public/About"));
const Resources = React.lazy(() => import("../pages/public/Resources"));

// Protected Route Wrapper
const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    if (loading) return <Loader />;
    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

// Suspense Fallback Component
const PageLoader = () => <Loader />;

const AppRoutes = () => {
    const { user } = useAuth();

    return (
        <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<Suspense fallback={<PageLoader />}><Home /></Suspense>} />
            <Route path="/login" element={<Suspense fallback={<PageLoader />}><Login /></Suspense>} />
            <Route path="/register" element={<Suspense fallback={<PageLoader />}><Register /></Suspense>} />
            <Route path="/contact" element={<Suspense fallback={<PageLoader />}><Contact /></Suspense>} />
            <Route path="/about" element={<Suspense fallback={<PageLoader />}><About /></Suspense>} />
            <Route path="/resources" element={<Suspense fallback={<PageLoader />}><Resources /></Suspense>} />
            <Route path="/reset-password/:token" element={<Suspense fallback={<PageLoader />}><ResetPassword /></Suspense>} />
            <Route path="/forgot-password" element={<Suspense fallback={<PageLoader />}><ForgotPassword /></Suspense>} />
            <Route path="/catalog" element={<Suspense fallback={<PageLoader />}><CourseCatalog /></Suspense>} />

            {/* --- Protected Routes --- */}
            <Route element={<ProtectedRoute />}>
                
                {/* Main Dashboard Redirect */}
                <Route
                    path="/dashboard"
                    element={
                        user?.role === 'admin'
                            ? <Navigate to="/dashboard/admin" replace />
                            : user?.role === 'instructor'
                            ? <Navigate to="/dashboard/instructor" replace />
                            : <Suspense fallback={<PageLoader />}><LearnerDashboard /></Suspense>
                    }
                />

                {/* Dashboard Pages */}
                <Route path="/dashboard/learner" element={<Suspense fallback={<PageLoader />}><LearnerDashboard /></Suspense>} />
                <Route path="/dashboard/instructor" element={<Suspense fallback={<PageLoader />}><InstructorDashboard /></Suspense>} />
                <Route path="/dashboard/admin" element={<Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>} />
                
                {/* FIX 1: Changed from "/dashboard/settings" to "/settings" to match Sidebar */}
                <Route path="/settings" element={<Suspense fallback={<PageLoader />}><Settings /></Suspense>} />

                {/* FIX 2: Changed from "/certificates" to "/certifications" to match Sidebar */}
                <Route path="/certifications" element={<Suspense fallback={<PageLoader />}><Certifications /></Suspense>} />

                {/* Course Routes */}
                <Route path="/course/read/computer-basics" element={<Suspense fallback={<PageLoader />}><ComputerBasicsViewer /></Suspense>} />
                <Route path="/course/:id" element={<Suspense fallback={<PageLoader />}><CoursePlayer /></Suspense>} />
            </Route>

            {/* Catch all - Redirect to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
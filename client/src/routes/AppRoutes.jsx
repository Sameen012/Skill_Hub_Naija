import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Import Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ResetPassword from '../pages/auth/ResetPassword';
import ForgotPassword from '../pages/auth/ForgotPassword';
import Home from '../pages/Home';

// Dashboard & Protected Pages
import LearnerDashboard from "../pages/dashboard/LearnerDashboard";
import InstructorDashboard from "../pages/dashboard/InstructorDashboard";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import CourseCatalog from '../pages/CourseCatalog';
import CoursePlayer from '../pages/CoursePlayer';
import Settings from '../pages/dashboard/Settings';
import Certifications from '../pages/Certifications'; // Ensure this matches your file location
import ComputerBasicsViewer from '../pages/ComputerBasicsViewer';

// Public Pages
import Contact from "../pages/public/Contact";
import About from "../pages/public/About";
import Resources from "../pages/public/Resources";

// Protected Route Wrapper
const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
    const { user } = useAuth();

    return (
        <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/catalog" element={<CourseCatalog />} />

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
                            : <LearnerDashboard />
                    }
                />

                {/* Dashboard Pages */}
                <Route path="/dashboard/learner" element={<LearnerDashboard />} />
                <Route path="/dashboard/instructor" element={<InstructorDashboard />} />
                <Route path="/dashboard/admin" element={<AdminDashboard />} />
                
                {/* FIX 1: Changed from "/dashboard/settings" to "/settings" to match Sidebar */}
                <Route path="/settings" element={<Settings />} />

                {/* FIX 2: Changed from "/certificates" to "/certifications" to match Sidebar */}
                <Route path="/certifications" element={<Certifications />} />

                {/* Course Routes */}
                <Route path="/course/read/computer-basics" element={<ComputerBasicsViewer />} />
                <Route path="/course/:id" element={<CoursePlayer />} />
            </Route>

            {/* Catch all - Redirect to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
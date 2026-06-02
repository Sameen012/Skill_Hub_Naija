import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for persisted user on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('skillhub_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        try {
            const { data } = await api.post('/auth/login', { email, password });

            const loggedInUser = {
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.role,
                avatar: data.avatar || null,
                token: data.token,
            };

            setUser(loggedInUser);
            localStorage.setItem('skillhub_user', JSON.stringify(loggedInUser));
            localStorage.setItem('skillhub_token', loggedInUser.token);

            return loggedInUser;
        } catch (error) {
            throw new Error(error.response?.data?.error || error.message || 'Failed to sign in');
        }
    };

    const register = async (name, email, password, confirmPassword) => {
        if (!name || !email || !password || !confirmPassword) {
            throw new Error('All fields are required');
        }

        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }

        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        try {
            const { data } = await api.post('/auth/register', { name, email, password });

            const registeredUser = {
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.role,
                avatar: data.avatar || null,
                token: data.token,
            };

            setUser(registeredUser);
            localStorage.setItem('skillhub_user', JSON.stringify(registeredUser));
            localStorage.setItem('skillhub_token', registeredUser.token);

            return registeredUser;
        } catch (error) {
            throw new Error(error.response?.data?.error || error.message || 'Failed to create account');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('skillhub_user');
        localStorage.removeItem('skillhub_token');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
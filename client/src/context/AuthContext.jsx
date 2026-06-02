import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const seedDefaultUsers = () => {
        const storedUsers = JSON.parse(localStorage.getItem('skillhub_registered_users') || '[]');
        const defaultUsers = [
            {
                id: 'admin-seed',
                name: 'Admin User',
                email: 'admin@test.com',
                password: 'admin123',
                role: 'admin',
                createdAt: new Date().toISOString(),
            },
            {
                id: 'instructor-seed',
                name: 'Instructor User',
                email: 'instructor@test.com',
                password: 'instructor123',
                role: 'instructor',
                createdAt: new Date().toISOString(),
            },
        ];

        let updatedUsers = [...storedUsers];
        defaultUsers.forEach((defaultUser) => {
            if (!updatedUsers.some((user) => user.email === defaultUser.email)) {
                updatedUsers.push(defaultUser);
            }
        });

        localStorage.setItem('skillhub_registered_users', JSON.stringify(updatedUsers));
    };

    // Check for persisted user on mount
    useEffect(() => {
        seedDefaultUsers();

        const storedUser = localStorage.getItem('skillhub_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // SIMULATION LOGIC - Replace with real API call later
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Validation: Email and password required
                if (!email || !password) {
                    reject('Email and password are required');
                    return;
                }

                // Validation: Check password format (at least 6 characters)
                if (password.length < 6) {
                    reject('Password must be at least 6 characters long');
                    return;
                }

                // Validation: Verify user exists (mock registered users)
                const registeredUsers = JSON.parse(localStorage.getItem('skillhub_registered_users') || '[]');
                const userExists = registeredUsers.find(u => u.email === email);

                if (!userExists) {
                    reject('User not found. Please register first or check your email.');
                    return;
                }

                // Validation: Verify password matches stored password
                if (userExists.password !== password) {
                    reject('Invalid password. Please try again.');
                    return;
                }

                let role = userExists.role || 'learner';
                if (email === 'instructor@test.com') role = 'instructor';
                if (email === 'admin@test.com') role = 'admin';

                const mockUser = {
                    id: Date.now(),
                    name: userExists.name,
                    email,
                    role,
                    token: 'mock-jwt-token-' + Date.now(), // Simulation
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
                };

                setUser(mockUser);
                localStorage.setItem('skillhub_user', JSON.stringify(mockUser));
                localStorage.setItem('skillhub_token', mockUser.token);
                resolve(mockUser);
            }, 800);
        });
    };

    const register = async (name, email, password, confirmPassword) => {
        // SIMULATION LOGIC
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Validation: All fields required
                if (!name || !email || !password || !confirmPassword) {
                    reject('All fields are required');
                    return;
                }

                // Validation: Password strength (minimum 6 characters)
                if (password.length < 6) {
                    reject('Password must be at least 6 characters long');
                    return;
                }

                // Validation: Password and confirm password match
                if (password !== confirmPassword) {
                    reject('Passwords do not match');
                    return;
                }

                // Validation: Email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    reject('Please enter a valid email address');
                    return;
                }

                // Validation: Check if user already exists
                const registeredUsers = JSON.parse(localStorage.getItem('skillhub_registered_users') || '[]');
                if (registeredUsers.find(u => u.email === email)) {
                    reject('Email already registered. Please login or use a different email.');
                    return;
                }

                // Register new user - Store in localStorage
                const newUser = {
                    id: Date.now(),
                    name,
                    email,
                    password, // In production, this should be hashed
                    role: 'learner',
                    createdAt: new Date().toISOString()
                };

                registeredUsers.push(newUser);
                localStorage.setItem('skillhub_registered_users', JSON.stringify(registeredUsers));

                const mockUser = {
                    id: newUser.id,
                    name,
                    email,
                    role: 'learner',
                    token: 'mock-jwt-token-' + Date.now(),
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
                };

                setUser(mockUser);
                localStorage.setItem('skillhub_user', JSON.stringify(mockUser));
                localStorage.setItem('skillhub_token', mockUser.token);
                resolve(mockUser);
            }, 800);
        });
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
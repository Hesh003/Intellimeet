import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app we would load a token from AsyncStorage
        // AsyncStorage.getItem('token').then(token => ...)
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        if (res.data.success) {
            setUser(res.data.user);
            // We would also set the strict auth header for future requests and save token here
            api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
            return true;
        }
        return false;
    };

    // Quick bypass for testing UI components without server constraints
    const adminLogin = () => {
        setUser({
            _id: 'admin_123',
            name: 'System Admin',
            email: 'admin@university.edu',
            role: 'Admin'
        });
        return true;
    };

    const logout = () => {
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
        // AsyncStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, adminLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

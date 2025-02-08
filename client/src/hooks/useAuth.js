// useAuth.js
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import authService from '../services/authService';

const useAuth = () => {
    const { user, setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async() => {
            try {
                if (authService.isAuthenticated()) {
                    const userData = await authService.getUser();
                    setUser(userData);
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
                authService.logout();
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [setUser]);

    const login = async(credentials) => {
        try {
            const userData = await authService.login(credentials);
            setUser(userData);

            // Role-based navigation
            switch (userData.role) {
                case 'villager':
                    navigate('/dashboard/villager');
                    break;
                case 'panchayat-official':
                    navigate('/dashboard/panchayat');
                    break;
                case 'admin':
                    navigate('/dashboard/admin');
                    break;
                default:
                    navigate('/dashboard');
            }

            return userData;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        navigate('/login');
    };

    const register = async(userData) => {
        try {
            const response = await authService.register(userData);
            navigate('/login');
            return response;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const updateUser = (data) => {
        setUser(current => ({
            ...current,
            ...data
        }));
    };

    return {
        user,
        login,
        logout,
        register,
        updateUser,
        loading,
        isAuthenticated: authService.isAuthenticated
    };
};

export default useAuth;
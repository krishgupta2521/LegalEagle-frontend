import { createContext, useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing login on app startup
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('authToken');
            }
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        // Store user data appropriately based on the login source
        const userToStore = {
            id: userData.userId,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            source: userData.source || 'user'
        };
        
        // Add lawyerId if it exists
        if (userData.lawyerId) {
            userToStore.lawyerId = userData.lawyerId;
        }
        
        localStorage.setItem('authToken', userData.token);
        localStorage.setItem('user', JSON.stringify(userToStore));
        setUser(userToStore);
    };

    const logout = async () => {
        try {
            // Attempt to call logout API if needed
            // await fetch('/api/auth/logout', { ... });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const RequireAuth = ({ children, requiredRole }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    if (!user) {
        return <Navigate to="/login" />;
    }
    
    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/" />;
    }
    
    return children;
};

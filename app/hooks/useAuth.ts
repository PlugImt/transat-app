import {useState} from 'react';
import {storage} from "@/app/services/storage/asyncStorage";


export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<null | any>(null);

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            // Here you would normally make an API call to your backend
            // For this example, we'll simulate an API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Simulate successful login
            const userData = {email, id: '1', name: 'User'};
            await storage.set('user', userData);
            setUser(userData);
        } catch (error) {
            console.error(error);
            throw new Error('Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            await storage.remove('user');
            setUser(null);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            // Here you would normally make an API call to your backend
            // For this example, we'll simulate an API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Simulate successful registration
            const userData = {email, id: '1', name: 'User'};
            await storage.set('user', userData);
            setUser(userData);
        } catch (error) {
            console.error(error);
            throw new Error('Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        user,
        setUser,
        isLoading,
        login,
        logout,
        register
    };
};

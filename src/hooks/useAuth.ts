import { storage } from '@/services/storage/asyncStorage';
import { useState } from 'react';
import axios from 'axios';


export const useAuth = () => {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const [user, setUser] = useState<null | any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            const response = await axios.post('https://transat.destimt.fr/api/auth/login', { email, password });

            if (response.status === 200) {
                const { token } = response.data;
                await storage.set('token', token);
                return { success: true };
            }

        } catch (error) {
            // @ts-ignore
            const errorMessage = error.response?.data?.error || 'Login failed';
            console.error('Login failed:', errorMessage);

            // @ts-ignore
            if (error.response?.status === 401 && errorMessage === 'Validate your account first') {
                return { needsVerification: true, email };
            }

            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const saveToken = async (token: string) => {
        await storage.set('token', token);

        // // Fetch user data
        // const userResponse = await axios.get('https://transat.destimt.fr/api/auth/me', {
        //     headers: {
        //         Authorization: `Bearer ${token}`,
        //     },
        // });
        // if (userResponse.status === 200) {
        //     const user = userResponse.data;
        //     await storage.set('user', user);
        //
        //     setUser(user);
        // }

        return { success: true };
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            await storage.remove('token');
            await storage.remove('user');
            setUser(null);
        } catch (error) {
            // @ts-ignore
            console.error('Logout failed:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            // Here you would normally make an API call to your backend
            // For this example, we'll simulate an API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Simulate successful registration
            const userData = { email, id: '1', name: 'User' };
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
        register,
        saveToken,
    };
};

export default useAuth;

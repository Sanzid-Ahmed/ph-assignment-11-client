import axios from 'axios';
import { useEffect } from 'react';
import useAuth from './useAuth';
import { useNavigate } from 'react-router-dom';

const axiosSecure = axios.create({
    baseURL: 'http://localhost:5000/api/v1', 
    withCredentials: true, 
});

const useAxiosSecure = () => {
    const { logOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        
        axiosSecure.interceptors.request.use((config) => {
           
            return config;
        }, (error) => {
            return Promise.reject(error);
        });

        axiosSecure.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                const status = error.response?.status;
                
                if (status === 401 || status === 403) {
                    console.error(`Authentication error detected: Status ${status}. Logging out.`);
                    await logOut();
                    navigate('/login');
                }
                return Promise.reject(error);
            }
        );
        
        const requestInterceptorId = axiosSecure.interceptors.request.use(config => config); // Get ID
        const responseInterceptorId = axiosSecure.interceptors.response.use(res => res, err => Promise.reject(err)); // Get ID
        
        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptorId);
            axiosSecure.interceptors.response.eject(responseInterceptorId);
        };
        
    }, [logOut, navigate]);

    return axiosSecure;
};

export default useAxiosSecure;
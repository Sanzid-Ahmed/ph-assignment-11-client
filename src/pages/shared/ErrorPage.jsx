import React from 'react';
import { Link, useRouteError } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ErrorPage = () => {
    const error = useRouteError();
    console.error(error);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-6"
        >
            <FaExclamationTriangle className="text-9xl text-error mb-6" />
            <h1 className="text-6xl font-extrabold text-gray-800 mb-4">
                Oops!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
                Sorry, an unexpected error has occurred. The page you are looking for might not exist.
            </p>
            
            <p className="text-lg text-error mb-8 italic">
                {error.statusText || error.message}
            </p>
            
            <Link to="/" className="btn btn-primary btn-lg flex items-center gap-2">
                <FaHome /> Go to Homepage
            </Link>
        </motion.div>
    );
};

export default ErrorPage;
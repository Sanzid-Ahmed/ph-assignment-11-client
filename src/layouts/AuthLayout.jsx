import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

const AuthLayout = () => {
    return (
        <div className="min-h-screen relative flex flex-col bg-base-100 overflow-hidden">
            {/* 1. Fixed Navbar */}
            <div className="fixed top-0 left-0 w-full z-50">
                <Navbar />
            </div>


            {/* 2. Modern Background Layering */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Large Soft Glows (Using Primary Olive and Accent Amber) */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[5%] right-[-5%] w-[400px] h-[400px] bg-accent/15 blur-[100px] rounded-full" />
                
                {/* Modern "Mesh" Grid Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
                
                {/* Subtle Geometric Texture (Modern office/abstract look) */}
                <div 
                    className="absolute inset-0 opacity-[0.07] bg-cover bg-center mix-blend-overlay grayscale"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80')` }}
                />
            </div>

            {/* 3. Main Content Wrapper */}
            <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-[1400px] mx-auto flex flex-col items-center">
                    {/* The content from Outlet (Login/Register cards) will float here */}
                    <div className="w-full flex justify-center transform transition-all duration-500 mt-15">
                        <Outlet />
                    </div>
                </div>
            </main>

            {/* 4. Minimalist Footer Label */}
            <div className="relative z-10 pb-6 text-center">
                <p className="text-[10px] uppercase tracking-[0.5em] font-bold text-base-content/30">
                    AssetVerse Secure Portal &copy; 2026
                </p>
            </div>
        </div>
    );
};

export default AuthLayout;
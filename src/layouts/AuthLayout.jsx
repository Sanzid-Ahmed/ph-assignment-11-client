import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className='w-10/12 mx-auto grid min-h-[100vh] justify-center items-center'>
                <div>
                  <h1 className='text-center text-5xl mb-5 text-primary'><Link to="/">AssetVerse</Link></h1>
                  <Outlet></Outlet>
                </div>
        </div>
    );
};

export default AuthLayout;
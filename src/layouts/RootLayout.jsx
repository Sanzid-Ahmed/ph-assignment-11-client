import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';


const RootLayout = () => {
    return (
        <div className='w-10/12 mx-auto'>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;
import React from 'react';
import { Outlet } from 'react-router';


const RootLayout = () => {
    return (
        <div className='w-10/12 mx-auto'>
            {/* <NavBar></NavBar> */}
            <Outlet></Outlet>
            {/* <Footer></Footer> */}
        </div>
    );
};

export default RootLayout;
import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
    return (
        <div>
            {/* <div className='flex'>
                <div className='bg-primary'>
                    <h1>A</h1>
                </div>
            </div> */}
            <Link to="/" className="flex items-center group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold transition-transform group-hover:rotate-12">
              A
            </div>
            <span className="text-3xl text-accent font-black tracking-tighter hidden sm:block">
              Asset<span className="text-primary">Verse</span>
            </span>
          </Link>
        </div>
    );
};

export default Logo;
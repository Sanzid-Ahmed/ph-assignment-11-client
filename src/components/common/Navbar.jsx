import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import { 
    FaSignOutAlt, FaSignInAlt, FaUserCircle, 
    FaBars, FaTimes, FaHome, FaUsers, FaUserShield 
} from 'react-icons/fa';

const Navbar = () => {
    const { user, logOut, loading } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const dashboardLink = user ? (user.role === 'hr' ? '/hr-dashboard' : '/employee-dashboard') : '';

    const navLinks = (
        <>
            <li>
                <NavLink 
                    to="/" 
                    className={({ isActive }) => isActive ? 'text-primary font-bold' : 'hover:text-primary'}
                    onClick={() => setIsMenuOpen(false)}
                >
                    <FaHome className="inline mr-1" /> Home
                </NavLink>
            </li>
            {user && (
                <li>
                    <NavLink 
                        to={dashboardLink} 
                        className={({ isActive }) => isActive ? 'text-primary font-bold' : 'hover:text-primary'}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        {user.role === 'hr' ? <FaUserShield className="inline mr-1" /> : <FaUsers className="inline mr-1" />}
                        Dashboard
                    </NavLink>
                </li>
            )}
            {!user && (
                <>
                    <li>
                        <NavLink to="/join-employee" className={({ isActive }) => isActive ? 'text-primary font-bold' : 'hover:text-primary'} onClick={() => setIsMenuOpen(false)}>Join as Employee</NavLink>
                    </li>
                    <li>
                        <NavLink to="/join-hr" className={({ isActive }) => isActive ? 'text-primary font-bold' : 'hover:text-primary'} onClick={() => setIsMenuOpen(false)}>Join as HR</NavLink>
                    </li>
                </>
            )}
        </>
    );

    const handleLogout = () => {
        logOut()
            .then(() => toast.success("Successfully logged out."))
            .catch(error => {
                console.error("Logout Error:", error);
                toast.error("Logout failed.");
            });
    };

    return (
        <nav className="bg-base-100 shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between px-4 py-3">
                
                {/* Logo */}
                <Link to="/" className="flex items-center text-xl font-extrabold text-primary">
                    <FaUserShield className="text-3xl mr-2" /> AssetVerse
                </Link>

                {/* Desktop Menu */}
                <ul className="hidden lg:flex space-x-4 font-semibold text-base">
                    {navLinks}
                </ul>

                {/* Right Side: Auth / Profile */}
                <div className="flex items-center space-x-2">
                    {loading ? (
                        <span className="loading loading-spinner loading-md"></span>
                    ) : user ? (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} className="btn btn-ghost btn-circle avatar tooltip tooltip-bottom" data-tip={user.displayName || user.email}>
                                <div className="w-10 rounded-full">
                                    {user.photoURL ? (
                                        <img alt="User Avatar" src={user.photoURL} />
                                    ) : (
                                        <FaUserCircle className="w-10 h-10 text-gray-400" />
                                    )}
                                </div>
                            </div>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box shadow mt-3 w-52 p-2">
                                <li>
                                    <Link to={`${dashboardLink}/profile`} className="justify-between">
                                        Profile <span className="badge badge-primary">{user.role.toUpperCase()}</span>
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={handleLogout}><FaSignOutAlt className="mr-1" /> Logout</button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary text-white flex items-center">
                            <FaSignInAlt className="mr-1" /> Login
                        </Link>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button className="btn btn-ghost lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <ul className="lg:hidden bg-base-100 w-full text-center font-semibold space-y-2 py-4 shadow-md">
                    {navLinks}
                </ul>
            )}
        </nav>
    );
};

export default Navbar;

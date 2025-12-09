import { Link } from "react-router-dom";
import { FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content mt-16 border-t">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-10">

        
        <div>
          <Link to="/" className="text-2xl font-bold">
            <span className="text-primary">Asset</span>Verse
          </Link>
          <p className="mt-3 text-sm leading-6">
            A smarter way to manage company assets, employees, and B2B HR workflows.
            Streamline operations with efficiency and precision.
          </p>

          
          <div className="flex items-center gap-4 mt-4 text-xl">
            <a href="#" className="hover:text-primary transition">
              <FaFacebook color="blue"/>
            </a>
            <a href="#" className="hover:text-primary transition">
              <FaLinkedin color="lightBlue"/>
            </a>
            <a href="#" className="hover:text-primary transition">
              <RiTwitterXFill color="black"/>
            </a>
            <a href="#" className="hover:text-primary transition">
              <FaInstagram color="red"/>
            </a>
          </div>
        </div>

        
        <div>
          <h3 className="footer-title">Quick Links</h3>
          <ul className="space-y-2 mt-3 text-sm">
            <li><Link className="hover:text-primary" to="/">Home</Link></li>
            <li><Link className="hover:text-primary" to="/join-employee">Join as Employee</Link></li>
            <li><Link className="hover:text-primary" to="/join-hr">Join as HR Manager</Link></li>
            <li><Link className="hover:text-primary" to="/login">Login</Link></li>
          </ul>
        </div>

        
        <div>
          <h3 className="footer-title">Features</h3>
          <ul className="space-y-2 mt-3 text-sm">
            <li>Asset Tracking</li>
            <li>Employee Management</li>
            <li>Package Upgrades</li>
            <li>Request Handling</li>
            <li>Multi-Company Support</li>
          </ul>
        </div>

        
        <div>
          <h3 className="footer-title">Contact</h3>
          <ul className="space-y-2 mt-3 text-sm">
            <li>Email: support@assetverse.com</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Address: Corporate Street, Business City</li>
          </ul>
        </div>
      </div>

      
      <div className="border-t py-5 text-center text-sm bg-base-200">
        © {new Date().getFullYear()} <span className="font-semibold">AssetVerse</span>.  
        All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

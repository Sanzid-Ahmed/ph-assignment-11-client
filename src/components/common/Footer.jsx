import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import Logo from "./Logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="pt-16 pb-8 text-base-content bg-neutral/30">
      <div className="w-10/12 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Logo></Logo>
            </div>
            <p className="text-sm leading-relaxed opacity-70">
              The ultimate B2B platform for seamless asset tracking and team accountability. Empowering HR managers to grow without the paperwork.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="https://www.linkedin.com/in/sanzid-ahmed/" target="_new" className="hover:text-primary transition-colors text-xl"><FaLinkedin /></a>
              <a href="https://www.linkedin.com/in/sanzid-ahmed/" target="_new" className="hover:text-primary transition-colors text-xl"><FaTwitter /></a>
              <a href="https://www.facebook.com/sanzid.ahmed.111" target="_new" className="hover:text-primary transition-colors text-xl"><FaFacebook /></a>
              <a href="https://github.com/Sanzid-Ahmed" target="_new" className="hover:text-primary transition-colors text-xl"><FaGithub /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-6 uppercase text-xs tracking-widest">Platform</h4>
            <ul className="space-y-4 text-sm font-medium opacity-80">
              <li><Link to="/" className="hover:text-primary transition-all">Home</Link></li>
              <li><Link to="/join-hr" className="hover:text-primary transition-all">For HR Managers</Link></li>
              <li><Link to="/join-employee" className="hover:text-primary transition-all">For Employees</Link></li>
              <li><a href="#packages" className="hover:text-primary transition-all">Pricing Plans</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold mb-6 uppercase text-xs tracking-widest">Company</h4>
            <ul className="space-y-4 text-sm font-medium opacity-80">
              <li><Link to="/about-us" className="hover:text-primary transition-all">About Us</Link></li>
              <li><a href="#" className="hover:text-primary transition-all">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-all">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-all">Contact Support</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold  mb-6 uppercase text-xs tracking-widest">Contact</h4>
            <ul className="space-y-4 text-sm opacity-80">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-primary" />
                <span>123 Business Ave, Suite 500<br />Silicon Valley, CA 94025</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-primary" />
                <span>+1 (555) 000-ASSET</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-primary" />
                <span>support@assetverse.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <hr />
          <p className="text-center pt-10">© {currentYear} AssetVerse Management System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
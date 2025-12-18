import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-base-300 pt-16 pb-8 text-base-content">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
                A
              </div>
              <span className="text-2xl font-black tracking-tight text-neutral">
                Asset<span className="text-primary">Verse</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed opacity-70">
              The ultimate B2B platform for seamless asset tracking and team accountability. Empowering HR managers to grow without the paperwork.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="hover:text-primary transition-colors text-xl"><FaLinkedin /></a>
              <a href="#" className="hover:text-primary transition-colors text-xl"><FaTwitter /></a>
              <a href="#" className="hover:text-primary transition-colors text-xl"><FaFacebook /></a>
              <a href="#" className="hover:text-primary transition-colors text-xl"><FaGithub /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-neutral mb-6 uppercase text-xs tracking-widest">Platform</h4>
            <ul className="space-y-4 text-sm font-medium opacity-80">
              <li><Link to="/" className="hover:text-primary transition-all">Home</Link></li>
              <li><Link to="/join-hr" className="hover:text-primary transition-all">For HR Managers</Link></li>
              <li><Link to="/join-employee" className="hover:text-primary transition-all">For Employees</Link></li>
              <li><a href="#packages" className="hover:text-primary transition-all">Pricing Plans</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-neutral mb-6 uppercase text-xs tracking-widest">Company</h4>
            <ul className="space-y-4 text-sm font-medium opacity-80">
              <li><a href="#" className="hover:text-primary transition-all">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-all">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-all">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-all">Contact Support</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-neutral mb-6 uppercase text-xs tracking-widest">Contact</h4>
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
        <div className="border-t border-base-content/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold opacity-60">
          <p>© {currentYear} AssetVerse Management System. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:underline">Cookie Settings</a>
            <a href="#" className="hover:underline">Security</a>
            <a href="#" className="hover:underline">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
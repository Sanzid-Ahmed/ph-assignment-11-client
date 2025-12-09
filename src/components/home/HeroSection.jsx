import React from "react";
import { Link } from "react-router-dom";
import { FaUser, FaUserTie } from "react-icons/fa";
import { motion } from "framer-motion";
console.log(motion);


const HeroSection = ({ itemVariants }) => {
  return (
    <motion.section
      className="hero min-h-[60vh] bg-base-200 rounded-xl mb-16 shadow-xl"
      variants={itemVariants}
    >
      <div className="hero-content flex-col lg:flex-row-reverse p-12 gap-10">
        <div className="lg:w-1/2 rounded-xl overflow-hidden shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1551836022-4c4c79ecde51"
            alt="Corporate teamwork"
            className="rounded-xl w-full h-full object-cover"
          />
        </div>
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold text-primary mb-4 leading-tight">
            AssetVerse: <span className="text-secondary">Track. Manage. Grow.</span>
          </h1>
          <p className="py-6 text-lg text-gray-700">
            A complete digital platform to efficiently manage your company’s
            physical assets and employee accountability—without paperwork.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to="/join-hr" className="btn btn-primary btn-lg shadow-lg">
              Join as HR Manager <FaUserTie className="ml-2" />
            </Link>
            <Link
              to="/join-employee"
              className="btn btn-outline btn-primary btn-lg shadow-lg"
            >
              Join as Employee <FaUser className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
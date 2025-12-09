import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
console.log(motion);


const PackagesSection = ({ packages, loading, itemVariants }) => {
  return (
    <motion.section id="packages" className="py-16 text-center" variants={itemVariants}>
      <h2 className="text-4xl font-bold mb-4 text-gray-800">Choose Your Plan</h2>
      <p className="text-lg mb-12 text-gray-600">Scale your team's asset management as you grow.</p>

      {loading ? (
        <div className="flex justify-center">
          <span className="loading loading-dots loading-lg text-primary"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}
              className={`card shadow-xl p-8 transition-transform duration-300 ${
                pkg.name === "Standard" ? "bg-primary text-white scale-105" : "bg-white text-gray-800"
              }`}
            >
              <h3 className={`text-3xl font-bold mb-2 ${pkg.name === "Standard" ? "text-white" : "text-primary"}`}>
                {pkg.name}
              </h3>
              <p className="text-xl mb-4">Up to {pkg.employeeLimit} Employees</p>
              <div className="text-5xl font-extrabold mb-6">
                ${pkg.price}
                <span className={`text-lg font-normal ml-2 ${pkg.name === "Standard" ? "text-white/80" : "text-gray-500"}`}>
                  /month
                </span>
              </div>
              <ul className="text-left space-y-3 mb-8">
                {pkg.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center">
                    <FaCheckCircle className={`mr-3 ${pkg.name === "Standard" ? "text-white" : "text-green-500"}`} />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                to="/join-hr"
                className={`btn btn-block ${pkg.name === "Standard" ? "btn-secondary text-primary" : "btn-primary"}`}
              >
                Get Started
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
};

export default PackagesSection;
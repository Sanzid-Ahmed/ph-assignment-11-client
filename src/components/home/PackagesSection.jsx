import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaRocket } from "react-icons/fa";
import { motion } from "framer-motion";
console.log(motion)

const PackagesSection = ({ packages, loading, itemVariants }) => {
  return (
    <motion.section 
      id="packages" 
      className="py-20 bg-base-100" 
      variants={itemVariants}
    >
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div variants={itemVariants}>
            <span className="badge badge-outline badge-primary font-bold mb-4 px-4 py-3">Pricing Plans</span>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Scale Your Team Without <br />
              <span className="text-primary">Breaking the Bank</span>
            </h2>
            <p className="text-gray-500 text-lg">
              Transparent pricing designed to grow with your company inventory and workforce.
            </p>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
            <p className="text-gray-400 animate-pulse">Fetching latest plans...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {packages.map((pkg, index) => {
              const isStandard = pkg.name === "Standard";
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className={`relative card h-full p-1 transition-all duration-300 ${
                    isStandard 
                    ? "bg-gradient-to-b from-primary to-neutral text-white shadow-2xl scale-105 z-10 rounded-3xl" 
                    : "bg-base-100 border border-base-200 shadow-xl rounded-3xl"
                  }`}
                >
                  {isStandard && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                      <span className="badge badge-secondary font-bold px-6 py-4 shadow-lg flex gap-2">
                        <FaRocket /> MOST POPULAR
                      </span>
                    </div>
                  )}

                  <div className="card-body p-8 flex flex-col">
                    <div className="mb-6">
                      <h3 className={`text-2xl font-black uppercase tracking-wider mb-2 ${isStandard ? "text-white" : "text-primary"}`}>
                        {pkg.name}
                      </h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-extrabold">${pkg.price}</span>
                        <span className={`text-sm font-medium`}>
                          /setup
                        </span>
                      </div>
                      <p className={`mt-4 text-sm font-semibold p-2 rounded-lg text-center ${isStandard ? "bg-white/20" : "bg-neutral/80"}`}>
                        Up to {pkg.employeeLimit} Employees
                      </p>
                    </div>

                    <div className="divider opacity-20"></div>

                    <ul className="flex-grow space-y-4 mb-8">
                      {pkg.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-3 text-sm">
                          <FaCheckCircle className={`mt-1 flex-shrink-0 ${isStandard ? "text-white" : "text-primary"}`} />
                          <span >{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      to="/dashboard/upgrade"
                      className={`btn btn-lg w-full border-none rounded-2xl transition-all duration-300 ${
                        isStandard 
                        ? "bg-white text-primary hover:bg-base-200" 
                        : "btn-primary shadow-lg shadow-primary/20"
                      }`}
                    >
                      Get Started
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default PackagesSection;
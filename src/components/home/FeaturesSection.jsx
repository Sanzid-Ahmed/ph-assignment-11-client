// src/components/HomePage/FeaturesSection.jsx

import React from "react";
import { FaBoxes, FaUsers, FaChartLine, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
console.log(motion);


const features = [
  { icon: FaBoxes, title: "Prevent Asset Loss", text: "Ensure every laptop, monitor, and keyboard is always accounted for." },
  { icon: FaUsers, title: "Boost Accountability", text: "Track who holds which asset with full clarity and transparency." },
  { icon: FaChartLine, title: "Streamline HR Workflow", text: "Automated requests, approvals, and affiliation processes." },
];

const coreFeatures = [
    { icon: FaBoxes, title: "Inventory Management", text: "Track all items in real-time." },
    { icon: FaUsers, title: "Auto-Affiliation", text: "Employees become affiliated on first approval." },
    { icon: FaChartLine, title: "Usage Analytics", text: "Visual dashboards with Recharts." },
    { icon: FaStar, title: "Stripe Payments", text: "Easy plan upgrades." },
];

const FeaturesSection = ({ itemVariants }) => {
  return (
    <>
      <motion.section className="py-16 text-center" variants={itemVariants}>
        <h2 className="text-4xl font-bold mb-12 text-gray-800">Why Choose AssetVerse?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div key={index} className="card shadow-lg p-6 bg-white" variants={itemVariants}>
              <feature.icon className="text-5xl text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <hr className="my-16 border-t-2 border-gray-200" />

      
      <motion.section id="features" className="py-16 text-center" variants={itemVariants}>
        <h2 className="text-4xl font-bold mb-12 text-gray-800">Core Features</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {coreFeatures.map((feature, index) => (
            <motion.div key={index} className="flex flex-col items-center p-4 bg-base-100 rounded-lg shadow-sm" variants={itemVariants}>
              <feature.icon className="text-4xl text-secondary mb-3" />
              <h4 className="font-semibold mb-1">{feature.title}</h4>
              <p className="text-xs text-gray-500">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </>
  );
};

export default FeaturesSection;
import React from "react";
import { motion } from "framer-motion";
console.log(motion);


const TestimonialsWorkflowSection = ({ itemVariants }) => {
  return (
    <>
      {/* Testimonials & Stats */}
      <motion.section className="py-16 text-center bg-base-100 rounded-lg shadow-inner" variants={itemVariants}>
        <h2 className="text-4xl font-bold mb-12 text-gray-800">Trusted by Professionals</h2>
        <div className="flex justify-around mb-12">
          <div className="p-4">
            <p className="text-5xl font-extrabold text-primary">100+</p>
            <p className="text-lg text-gray-600">Companies Trust Us</p>
          </div>
          <div className="p-4">
            <p className="text-5xl font-extrabold text-primary">50K+</p>
            <p className="text-lg text-gray-600">Assets Managed</p>
          </div>
        </div>
        <div className="max-w-3xl mx-auto p-4">
          <blockquote className="text-lg italic text-gray-700 mb-4">
            "AssetVerse transformed our HR department. Tracking and managing
            assets is now effortless—and completely automated."
          </blockquote>
          <p className="font-semibold text-lg text-primary">
            — Jane Doe, HR Director at TechCorp
          </p>
        </div>
      </motion.section>

      <hr className="my-16 border-t-2 border-gray-200" />

      {/* 3-Step Workflow */}
      <motion.section className="py-16 text-center" variants={itemVariants}>
        <h2 className="text-4xl font-bold mb-12 text-gray-800">How It Works in 3 Simple Steps</h2>
        <ul className="steps steps-vertical lg:steps-horizontal">
          <li data-content="1" className="step step-primary">
            <div className="text-lg font-semibold">HR Registers</div>
            <p className="text-sm text-gray-500 max-w-xs pt-1">Setup your company, inventory, and employee limits.</p>
          </li>
          <li data-content="2" className="step step-primary">
            <div className="text-lg font-semibold">Employee Requests</div>
            <p className="text-sm text-gray-500 max-w-xs pt-1">Employees request assets; they become affiliated on first approval.</p>
          </li>
          <li data-content="3" className="step step-primary">
            <div className="text-lg font-semibold">Track & Scale</div>
            <p className="text-sm text-gray-500 max-w-xs pt-1">Monitor asset usage, manage your team, and upgrade anytime.</p>
          </li>
        </ul>
      </motion.section>
    </>
  );
};

export default TestimonialsWorkflowSection;
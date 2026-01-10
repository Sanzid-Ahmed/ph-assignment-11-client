import React from 'react';
import { motion } from 'framer-motion';
console.log(motion)
import { FcSettings, FcKey, FcIdea } from 'react-icons/fc';

const Security = () => {
  return (
    <section className="py-24 bg-base-200">
      <div className="container mx-auto px-6 text-center">
        {/* Section Title */}
        <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-base-content">
          Enterprise-Grade Security
        </h2>

        {/* Security Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <FcSettings size={60} />,
              title: 'Secure Authentication',
              desc: 'JWT-based authentication with high-level encryption.',
            },
            {
              icon: <FcKey size={60} />,
              title: 'Role-Based Access',
              desc: 'Strict permissions for HR, Employees, and Admins.',
            },
            {
              icon: <FcIdea size={60} />,
              title: 'Scalable Architecture',
              desc: 'Built on modern stacks to grow with your company.',
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10, scale: 1.03 }}
              className="bg-base-100 text-base-content p-8 rounded-3xl shadow-xl border border-base-300 transition-all hover:shadow-2xl flex flex-col items-center"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-primary">{item.title}</h3>
              <p className="text-sm text-base-content/70 text-center">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Security;

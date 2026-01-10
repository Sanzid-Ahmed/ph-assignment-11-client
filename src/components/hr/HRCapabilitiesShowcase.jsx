import React from "react";
import { motion } from "framer-motion";
console.log(motion)

const HR_TASKS = [
  {
    id: 1,
    title: "Asset Management",
    desc: "Real-time tracking of hardware and inventory.",
    icon: "💻",
    color: "bg-base-200", // Use theme's card background
  },
  {
    id: 2,
    title: "Add New Assets",
    desc: "Instant onboarding of company equipment.",
    icon: "➕",
    color: "bg-accent/20", // Accent highlight
  },
  {
    id: 3,
    title: "Employee Management",
    desc: "Centralized database for all staff records.",
    icon: "👥",
    color: "bg-secondary/20", // Secondary subtle tone
  },
  {
    id: 4,
    title: "Team Management",
    desc: "Structure departments and hierarchies.",
    icon: "🏢",
    color: "bg-primary/20", // Primary subtle tone
  },
];

const HRCapabilitiesShowcase = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="py-12 px-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h2 className="text-4xl font-bold text-primary mb-2">HR Capabilities</h2>
        <p className="text-base-content/70">
          Manage your workforce and company assets efficiently with our tools.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {HR_TASKS.map((task) => (
          <motion.div
            key={task.id}
            variants={itemVariants}
            whileHover={{
              scale: 1.03,
              boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
            }}
            className={`flex items-center p-6 ${task.color} rounded-2xl border border-base-300 shadow-sm cursor-default transition-all`}
          >
            <div
              className={`w-14 h-14 ${task.color} rounded-xl flex items-center justify-center text-2xl mr-4`}
            >
              {task.icon}
            </div>
            <div>
              <h3 className="font-bold text-primary text-lg">{task.title}</h3>
              <p className="text-base-content/70 text-sm">{task.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default HRCapabilitiesShowcase;

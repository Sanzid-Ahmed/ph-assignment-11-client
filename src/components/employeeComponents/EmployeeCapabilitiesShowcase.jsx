import React from "react";
import { motion } from "framer-motion";
console.log(motion)


const EMPLOYEE_TASKS = [
  {
    id: 1,
    title: "Multi-Company Affiliation",
    desc: "Switch seamlessly between companies using one employee profile.",
    icon: "🏢",
    color: "bg-base-200/70", // theme card background
  },
  {
    id: 2,
    title: "Asset Requests",
    desc: "Request returnable or non-returnable assets from HR.",
    icon: "💼",
    color: "bg-accent/20", // accent highlight
  },
  {
    id: 3,
    title: "Team Connectivity",
    desc: "View teammates across companies and stay connected.",
    icon: "🤝",
    color: "bg-secondary/20", // secondary subtle tone
  },
  {
    id: 4,
    title: "Social Pulse",
    desc: "Track birthdays and work anniversaries effortlessly.",
    icon: "🎉",
    color: "bg-primary/20", // primary subtle tone
  },
];

const EmployeeCapabilitiesShowcase = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
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
    <div className="py-10 px-4 max-w-4xl mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {EMPLOYEE_TASKS.map((task) => (
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

export default EmployeeCapabilitiesShowcase;

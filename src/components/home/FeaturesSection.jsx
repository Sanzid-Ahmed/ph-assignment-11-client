import React from "react";
import { FaBoxes, FaUsers, FaChartLine, FaStar, FaShieldAlt, FaSyncAlt } from "react-icons/fa";
import { motion } from "framer-motion";
console.log(motion)

const features = [
  { 
    icon: FaBoxes, 
    title: "Asset Inventory", 
    text: "Real-time tracking of laptops, keyboards, and office furniture.",
    color: "text-blue-600"
  },
  { 
    icon: FaUsers, 
    title: "Team Management", 
    text: "Effortlessly manage employee affiliations and equipment access.",
    color: "text-purple-600"
  },
  { 
    icon: FaChartLine, 
    title: "Data Insights", 
    text: "Visual analytics to understand asset distribution and needs.",
    color: "text-green-600"
  },
  { 
    icon: FaStar, 
    title: "Easy Upgrades", 
    text: "Scale your employee limit instantly with secure Stripe payments.",
    color: "text-orange-600"
  },
  { 
    icon: FaShieldAlt, 
    title: "Loss Prevention", 
    text: "Full accountability for returnable and non-returnable items.",
    color: "text-red-600"
  },
  { 
    icon: FaSyncAlt, 
    title: "Quick Requests", 
    text: "Streamlined workflow for asset requests and HR approvals.",
    color: "text-cyan-600"
  },
];

const FeaturesSection = ({ itemVariants }) => {
  return (
    <section id="features" className="py-16 bg-base-200/50">
      <div className="container mx-auto px-6">
        
        {/* Compact Header */}
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <span className="badge badge-primary badge-outline font-semibold mb-3">Core Capabilities</span>
          <h2 className="text-3xl md:text-4xl font-bold text-neutral">
            Streamline Your Corporate Workflow
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
        </motion.div>

        {/* High-Density Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="group p-6 bg-base-100 rounded-2xl shadow-sm hover:shadow-md transition-all border border-base-300"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-base-200 group-hover:bg-primary/10 transition-colors`}>
                  <feature.icon className={`text-2xl ${feature.color} group-hover:text-primary transition-colors`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {feature.text}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
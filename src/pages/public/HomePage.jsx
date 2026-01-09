import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
console.log(motion);
import HeroSection from "../../components/home/HeroSection";
import FeaturesSection from "../../components/home/FeaturesSection";
import PackagesSection from "../../components/home/PackagesSection";
import TestimonialsWorkflowSection from "../../components/home/TestimonialsWorkflowSection";
import AssetLifecycle from "../../components/home/AssetLifecycle";

const mockPackages = [
  {
    name: "Basic",
    employeeLimit: 5,
    price: 5,
    features: ["Asset Tracking", "Employee Management", "Basic Support"],
  },
  {
    name: "Standard",
    employeeLimit: 10,
    price: 8,
    features: ["All Basic features", "Advanced Analytics", "Priority Support"],
  },
  {
    name: "Premium",
    employeeLimit: 20,
    price: 15,
    features: ["All Standard features", "Custom Branding", "24/7 Support"],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

const HomePage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPackages(mockPackages);
      setLoading(false);
    }, 200);
  }, []);

  return (
    <motion.div
      className="min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {" "}
      <div className="py-8">
        <div className="my-5">
          <HeroSection itemVariants={itemVariants} />
        </div>
        <div className="my-20">
          <FeaturesSection itemVariants={itemVariants} />
        </div>
        <div className="my-20">
          <PackagesSection
          packages={packages}
          loading={loading}
          itemVariants={itemVariants}
        />
        </div>
        <div className="my-20">
          <TestimonialsWorkflowSection itemVariants={itemVariants} />
        </div>
        <div className="my-20">
          <AssetLifecycle />
        </div>
      </div>
    </motion.div>
  );
};

export default HomePage;

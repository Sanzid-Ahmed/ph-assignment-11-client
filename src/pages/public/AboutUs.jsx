import React from "react";
import { motion } from "framer-motion";
console.log(motion)
import {
  FaUsers,
  FaLightbulb,
  FaShieldAlt,
  FaRocket,
} from "react-icons/fa";

import heroImg from "../../assets/nik-7I4u37HwA08-unsplash.jpg";
import HRSection from "../../components/aboutUs/HRSection";
import EmployeeSection from "../../components/aboutUs/EmployeeSection";
import CompanyStory from "../../components/aboutUs/CompanyStory";
import CareersCTA from "../../components/aboutUs/CareersCTA";


const values = [
  {
    icon: FaShieldAlt,
    title: "Security by Design",
    desc: "Enterprise-grade security, encryption, and access control are built into every layer of AssetVerse.",
  },
  {
    icon: FaLightbulb,
    title: "Purposeful Innovation",
    desc: "We don’t ship features for vanity. Every update solves a real operational problem.",
  },
  {
    icon: FaUsers,
    title: "Human-Centered Systems",
    desc: "HR tools should empower people, not slow them down. Simplicity drives adoption.",
  },
  {
    icon: FaRocket,
    title: "Growth Enablement",
    desc: "We remove operational friction so teams can scale faster with confidence.",
  },
];

const AboutUs = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="bg-base-100 min-h-screen">

      {/* HERO */}
      <section className="relative py-28 overflow-hidden bg-neutral text-neutral-content">
        <div className="absolute inset-0 opacity-20">
          <img
            src={heroImg}
            alt="Modern workspace"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 w-10/12 mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-black mb-6"
          >
            Redefining <br />
            <span className="text-primary">Workplace Asset Management</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl mx-auto text-lg text-neutral-content/80"
          >
            AssetVerse bridges the gap between people, hardware, and operations.
            One platform for HR teams and employees to manage assets transparently,
            securely, and at scale.
          </motion.p>
        </div>
      </section>

      {/* WHO IT’S FOR */}
      <HRSection />
      <EmployeeSection />

      {/* STORY + STATS */}
      <CompanyStory />

      {/* VALUES */}
      <section className="py-24 backdrop-blur-sm">
        <div className="w-10/12 mx-auto text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black mb-16 text-base-content">
              Values That Guide Everything We Build
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-base-100 p-8 rounded-3xl
                  border border-base-300
                  hover:shadow-xl transition-all"
                >
                  <div className="w-14 h-14 bg-primary/15 text-primary
                  rounded-2xl flex items-center justify-center
                  text-2xl mx-auto mb-6">
                    <value.icon />
                  </div>

                  <h3 className="font-bold text-xl mb-3 text-base-content">
                    {value.title}
                  </h3>

                  <p className="text-sm text-base-content/70 leading-relaxed">
                    {value.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <CareersCTA />
    </div>
  );
};

export default AboutUs;

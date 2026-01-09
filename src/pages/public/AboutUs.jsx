import React from "react";
import { motion } from "framer-motion";
console.log(motion)
import { FaUsers, FaLightbulb, FaShieldAlt, FaRocket } from "react-icons/fa";
import heroImg from "../../assets/nik-7I4u37HwA08-unsplash.jpg"; // Reusing your hero image for consistency
import HRSection from "../../components/aboutUs/HRSection";
import EmployeeSection from "../../components/aboutUs/EmployeeSection";

const stats = [
  { label: "Assets Managed", value: "50K+" },
  { label: "Active Companies", value: "500+" },
  { label: "Uptime Guarantee", value: "99.9%" },
  { label: "Support Response", value: "< 2hr" },
];

const values = [
  {
    icon: FaShieldAlt,
    title: "Security First",
    desc: "We treat your asset data with the highest level of encryption and compliance standards.",
  },
  {
    icon: FaLightbulb,
    title: "Continuous Innovation",
    desc: "We’re constantly evolving our platform to meet the needs of modern, scaling teams.",
  },
  {
    icon: FaUsers,
    title: "User-Centric Design",
    desc: "Powerful tools don't have to be complicated. We build for the people using them daily.",
  },
  {
    icon: FaRocket,
    title: "Enabling Growth",
    desc: "Our mission is to remove administrative hurdles so you can focus on scaling.",
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="bg-base-100 min-h-screen">
      {/* 1. Header Section */}
      <section className="relative py-24 overflow-hidden bg-neutral text-white">
        <div className="absolute inset-0 opacity-20">
          <img src={heroImg} alt="Office" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-6xl font-black mb-6"
          >
            We're Redefining <br />
            <span className="text-primary">Asset Management</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto text-lg text-gray-300"
          >
            At Freemarket, we believe hardware management shouldn't be a headache. 
            We build the bridge between physical assets and digital efficiency.
          </motion.p>
        </div>
      </section>

        <div>
            <HRSection />
        </div>
        <div>
            <EmployeeSection />
        </div>
        



      {/* 2. Mission & Story Section */}
      <section className="py-20 w-10/12 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-bold uppercase tracking-widest text-sm">Our Story</span>
            <h2 className="text-4xl font-black mt-4 mb-6">Born from a need for <br/> better transparency.</h2>
            <p className="text-gray-500 mb-4 leading-relaxed">
              Freemarket started in 2023 when our founders noticed that mid-sized companies were still using spreadsheets to track millions of dollars in hardware. 
            </p>
            <p className="text-gray-500 leading-relaxed">
              We set out to create a "Single Source of Truth." Today, we help hundreds of HR managers and IT leads regain control of their inventory, reducing loss by 30% and saving countless hours of manual auditing.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className="p-8 bg-neutral/5 rounded-3xl border border-base-200 text-center"
              >
                <h3 className="text-3xl font-black text-primary mb-1">{stat.value}</h3>
                <p className="text-sm font-bold text-gray-500 uppercase">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Core Values Section */}
      <section className="py-20 bg-neutral/30 backdrop-blur-sm">
        <div className="w-10/12 mx-auto text-center">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black mb-16">The Values that Drive Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className="bg-base-100 p-8 rounded-3xl shadow-sm border border-base-200 hover:shadow-xl transition-shadow"
                >
                  <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6">
                    <value.icon />
                  </div>
                  <h3 className="font-bold text-xl mb-3">{value.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. Team / Join Us Section */}
      <section className="py-24 w-10/12 mx-auto">
        <div className="bg-primary rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center justify-between overflow-hidden relative">
          {/* Decorative Circle */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          
          <div className="relative z-10 md:w-2/3">
            <h2 className="text-4xl font-black mb-4">Want to help us shape the future of work?</h2>
            <p className="text-white/80 text-lg mb-8 md:mb-0">
              We are always looking for passionate people to join our remote-first team. 
              Explore our open positions in engineering, design, and success.
            </p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn bg-white text-primary border-none hover:bg-base-200 px-10 rounded-2xl btn-lg font-bold relative z-10"
          >
            View Careers
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
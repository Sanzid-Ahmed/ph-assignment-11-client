import React from "react";
import { motion } from "framer-motion";
console.log(motion)

const CompanyStory = () => {
  const stats = [
    { label: "Assets Under Management", value: "50K+" },
    { label: "Global Enterprises", value: "500+" },
    { label: "Recovery Rate", value: "98%" },
    { label: "Uptime Guarantee", value: "99.9%" },
  ];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 -z-10 w-72 h-72 bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-secondary/5 blur-[120px] rounded-full" />

      <div className="w-11/12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* LEFT: STORY CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Our Mission
            </div>

            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mt-4 mb-8 text-base-content leading-[1.1]">
              Fixing the <span className="text-primary italic">chaos</span> of <br /> 
              disconnected growth.
            </h2>

            <div className="space-y-6 text-lg text-base-content/70 leading-relaxed">
              <p>
                In the rush to scale, most companies lose track of what matters: 
                the physical foundation of their business. AssetVerse was born in the gap 
                between messy spreadsheets and overpriced legacy software.
              </p>
              <p>
                We believe that knowing exactly where your hardware is—and who has it—shouldn't 
                be a full-time job. We've built a "single source of truth" that bridges 
                the gap between HR, IT, and Finance.
              </p>
            </div>

            <button className="btn btn-primary btn-lg mt-10 rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
              Learn about our values
            </button>
          </motion.div>

          {/* RIGHT: STATS BENTO GRID */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className={`p-8 rounded-[2rem] border border-base-content/5 flex flex-col justify-center
                  ${index === 1 || index === 2 ? 'bg-base-200' : 'bg-base-100 shadow-sm'}
                `}
              >
                <h3 className="text-4xl font-black text-primary tracking-tighter mb-2">
                  {stat.value}
                </h3>
                <p className="text-sm font-semibold text-base-content/50 uppercase leading-snug">
                  {stat.label}
                </p>
              </motion.div>
            ))}
            
            {/* Added a subtle brand statement card */}
            <motion.div 
              variants={itemVariants}
              className="col-span-2 p-6 bg-primary text-primary-content rounded-[2rem] flex items-center justify-between"
            >
              <p className="font-medium">Trusted by teams worldwide</p>
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-primary bg-base-300" />
                ))}
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default CompanyStory;
import React from "react";
import { motion } from "framer-motion";
console.log(motion)
import { Link } from "react-router-dom";

const CareersCTA = () => {
  return (
    <section className="py-32 w-11/12 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative bg-[#0A0A0B] rounded-[3.5rem] p-8 md:p-20 text-white overflow-hidden border border-white/5 shadow-2xl"
      >
        {/* BIG TECH BACKGROUND BLUR EFFECTS */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full -mr-48 -mt-48 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full -ml-32 -mb-32 blur-[100px] pointer-events-none" />
        
        {/* SUBTLE GRID OVERLAY */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,white,transparent)] bg-[grid-white_40px]" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          
          <div className="max-w-2xl text-center lg:text-left">
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-widest uppercase text-white/60">
              Engineering the Standard
            </div>
            
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              Help us build the <br className="hidden md:block" /> invisible infrastructure.
            </h2>
            
            <p className="text-white/50 text-lg md:text-xl leading-relaxed max-w-xl">
              AssetVerse is where world-class engineers and designers solve the 
              complex logistics of physical ownership. We’re building tools that 
              don’t just track assets—they redefine how companies scale.
            </p>

            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
              <div className="flex items-center gap-2 text-sm text-white/40">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                Remote-first
              </div>
              <div className="flex items-center gap-2 text-sm text-white/40 font-mono">
                $ node --version 20.x
              </div>
            </div>
          </div>

          <Link to="/features" className="relative group">
            {/* GLOW EFFECT BEHIND BUTTON */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="relative btn h-auto py-5 px-12 bg-neutral  hover:bg-amber-500/50 border-none rounded-2xl font-bold text-lg shadow-xl flex flex-col items-center"
            >
              <span>Explore Roles</span>
              <span className="text-[10px] uppercase tracking-widest opacity-50 font-medium">Join the Ship</span>
            </motion.button>
          </Link>
          
        </div>
      </motion.div>
    </section>
  );
};

export default CareersCTA;
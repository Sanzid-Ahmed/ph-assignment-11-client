import React from "react";
import { motion } from "framer-motion";
console.log(motion)
import { FaQuoteLeft, FaBuilding, FaLaptopMedical, FaArrowRight } from "react-icons/fa";

const TestimonialsWorkflowSection = ({ itemVariants }) => {
  return (
    <div className="space-y-20 py-10">
      {/* Testimonials & Stats Section */}
      <motion.section 
        className="relative py-16 bg-neutral text-neutral-content rounded-[3rem] overflow-hidden shadow-2xl" 
        variants={itemVariants}
      >
        {/* Abstract Background Shape */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-20 -mt-20 blur-2xl"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-lg p-8 rounded-3xl border border-white/10 text-center">
                <FaBuilding className="text-primary text-3xl mx-auto mb-4" />
                <p className="text-4xl md:text-5xl font-black text-white">100+</p>
                <p className="text-sm uppercase tracking-widest opacity-70 mt-2">Companies</p>
              </div>
              <div className="bg-white/5 backdrop-blur-lg p-8 rounded-3xl border border-white/10 text-center mt-8">
                <FaLaptopMedical className="text-secondary text-3xl mx-auto mb-4" />
                <p className="text-4xl md:text-5xl font-black text-white">50K+</p>
                <p className="text-sm uppercase tracking-widest opacity-70 mt-2">Assets Tracked</p>
              </div>
            </div>

            {/* Testimonial Card */}
            <div className="text-left space-y-6">
              <FaQuoteLeft className="text-5xl text-primary opacity-50" />
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                "AssetVerse transformed our HR department from manual chaos to automated precision."
              </h2>
              <div className="flex items-center gap-4">
                <div className="avatar">
                  <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100" alt="Jane Doe" />
                  </div>
                </div>
                <div>
                  <p className="font-bold text-xl text-white">Jane Doe</p>
                  <p className="text-primary text-sm font-medium">HR Director at TechCorp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 3-Step Workflow Section */}
      <motion.section className="py-10" variants={itemVariants}>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-neutral mb-4">Your Path to Efficiency</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Get started in minutes with our streamlined onboarding process.</p>
        </div>

        <div className="flex justify-center px-4">
          <ul className="steps steps-vertical lg:steps-horizontal w-full max-w-5xl">
            <li data-content="✓" className="step step-primary group">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left px-4">
                <div className="mb-2 p-3 bg-base-200 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all">
                   <FaBuilding className="text-xl" />
                </div>
                <h3 className="font-bold text-lg text-neutral">HR Onboarding</h3>
                <p className="text-sm text-gray-500 max-w-[200px]">Register your company and define your asset inventory.</p>
              </div>
            </li>
            
            <li data-content="✓" className="step step-primary group">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left px-4">
                <div className="mb-2 p-3 bg-base-200 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all">
                   <FaUsers className="text-xl" />
                </div>
                <h3 className="font-bold text-lg text-neutral">Request & Join</h3>
                <p className="text-sm text-gray-500 max-w-[200px]">Employees request assets and auto-affiliate on approval.</p>
              </div>
            </li>

            <li data-content="★" className="step step-primary group">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left px-4">
                <div className="mb-2 p-3 bg-base-200 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all">
                   <FaChartLine className="text-xl" />
                </div>
                <h3 className="font-bold text-lg text-neutral">Analyze & Scale</h3>
                <p className="text-sm text-gray-500 max-w-[200px]">Track usage in real-time and upgrade your plan as you grow.</p>
              </div>
            </li>
          </ul>
        </div>
      </motion.section>
    </div>
  );
};

const FaUsers = ({className}) => <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>;
const FaChartLine = ({className}) => <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.09-4-4L2 15.66l1.5 1.5z"/></svg>;

export default TestimonialsWorkflowSection;
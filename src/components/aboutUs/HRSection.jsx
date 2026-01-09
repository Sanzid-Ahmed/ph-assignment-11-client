import React from "react";
import { motion } from "framer-motion";
import { 
  FaUserTie, 
  FaUsersCog, 
  FaBoxOpen, 
  FaFileContract, 
  FaArrowRight,
  FaLaptop 
} from "react-icons/fa";

const hrFeatures = [
  {
    icon: FaUsersCog,
    title: "Manage Employees",
    text: "Add, affiliate, or offboard team members across multiple departments.",
    color: "text-primary",
  },
  {
    icon: FaBoxOpen,
    title: "Asset Control",
    text: "Track returnable hardware and distribute non-returnable company swag.",
    color: "text-blue-500",
  },
  {
    icon: FaFileContract,
    title: "Approval Workflow",
    text: "Review employee requests and finalize digital handovers instantly.",
    color: "text-emerald-500",
  },
  {
    icon: FaUserTie,
    title: "Strategic Oversight",
    text: "Generate reports on inventory health and team distribution.",
    color: "text-amber-500",
  },
];

const HRSection = ({ itemVariants }) => {
  return (
    <section className="w-10/12 mx-auto py-24">
      <div className="flex flex-col lg:flex-row gap-16 items-center">
        
        {/* LEFT SIDE: DESCRIPTION & CTA */}
        <div className="w-full lg:w-5/12 order-2 lg:order-1">
          <motion.div variants={itemVariants} className="mb-10">
            <span className="text-primary font-bold tracking-widest uppercase text-xs">
              Management Suite
            </span>
            <h2 className="text-4xl font-extrabold mt-2 mb-4">
              Master Your <span className="text-primary">Workforce</span> <br /> 
              & Infrastructure.
            </h2>
            <p className="text-lg text-gray-500 mb-8">
              As an HR Manager, you are the architect of the workspace. Manage assets, verify employees, and ensure everyone has the tools to succeed.
            </p>

            {/* JOIN AS HR BUTTON */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-primary text-white font-black rounded-2xl flex items-center gap-3 shadow-[0_10px_30px_rgba(96,108,56,0.3)] hover:shadow-primary/50 transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
              <FaUserTie className="text-xl" />
              <span>JOIN AS HR MANAGER</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          <div className="space-y-4">
            {hrFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ x: 10 }}
                className="flex items-start p-4 bg-neutral/30 rounded-2xl border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all"
              >
                <div className={`p-3 rounded-xl bg-base-100 shadow-sm mr-4 ${feature.color}`}>
                  <feature.icon className="text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-base-content">{feature.title}</h3>
                  <p className="text-sm opacity-70 leading-relaxed">{feature.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: THE "CONNECTION MAP" COMPONENT */}
        <div className="w-full lg:w-7/12 order-1 lg:order-2 relative h-[550px] my-auto bg-neutral/20 rounded-[3rem] overflow-hidden border border-neutral-content/10 shadow-inner">
          
          {/* Central HR Manager Node */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
            <motion.div 
              animate={{ boxShadow: ["0 0 0px rgba(96,108,56,0)", "0 0 40px rgba(96,108,56,0.4)", "0 0 0px rgba(96,108,56,0)"] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-24 h-24 bg-primary rounded-3xl flex flex-col items-center justify-center text-white border-4 border-white shadow-2xl"
            >
              <FaUserTie className="text-3xl" />
              <span className="text-[10px] font-black mt-1 uppercase">Manager Hub</span>
            </motion.div>
          </div>

          {/* Employee Nodes & Connection Lines */}
          {[
            { pos: "top-10 left-20", name: "Alex", asset: "MacBook Pro", delay: 0 },
            { pos: "top-20 right-20", name: "Jordan", asset: "Office Desk", delay: 0.5 },
            { pos: "bottom-20 left-24", name: "Sarah", asset: "Keychron K2", delay: 1 },
            { pos: "bottom-10 right-24", name: "Mike", asset: "Company Hoody", delay: 1.5 },
          ].map((emp, i) => (
            <React.Fragment key={i}>
              <svg className="absolute inset-0 w-full h-full z-10">
                <motion.line
                  x1="50%" y1="50%"
                  x2={emp.pos.includes('left') ? '25%' : '75%'}
                  y2={emp.pos.includes('top') ? '20%' : '80%'}
                  stroke="#606c38"
                  strokeWidth="2"
                  strokeDasharray="10, 5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.3 }}
                  transition={{ duration: 2, delay: emp.delay, repeat: Infinity }}
                />
              </svg>

              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5, scale: 1.05 }}
                className={`absolute ${emp.pos} z-20 bg-white p-3 rounded-2xl shadow-lg border border-neutral-content/20 flex items-center gap-3 cursor-default`}
              >
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                  <FaLaptop className="text-sm" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">{emp.name}</p>
                  <p className="text-xs font-black text-base-content">{emp.asset}</p>
                </div>
              </motion.div>
            </React.Fragment>
          ))}

          {/* Floating UI Elements */}
          <div className="absolute top-6 right-6 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-md border border-white z-40">
            <p className="text-[9px] font-black text-primary uppercase mb-2">Pending Requests</p>
            <div className="flex -space-x-2">
               {[1,2,3].map(i => (
                 <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white text-[8px] flex items-center justify-center font-bold">RQ</div>
               ))}
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-base-100/80 backdrop-blur-md px-6 py-2 rounded-full border border-primary/20 flex items-center gap-4 z-40">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-gray-600 uppercase">System Synchronized</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HRSection;
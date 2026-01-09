import React from "react";
import { motion } from "framer-motion";
import { 
  FaBuilding, 
  FaBirthdayCake, 
  FaUsers, 
  FaExchangeAlt,
  FaHandHoldingHeart,
  FaBoxOpen,
  FaArrowRight,
  FaUserCircle
} from "react-icons/fa";

const employeeWorkflow = [
  {
    icon: FaExchangeAlt,
    title: "Multi-Company Affiliation",
    text: "Seamlessly switch between different companies you work for from a single profile.",
    color: "text-blue-500",
  },
  {
    icon: FaBoxOpen,
    title: "Asset Requests",
    text: "Request returnable (laptops) or non-returnable (swag/pens) assets from any HR manager.",
    color: "text-purple-500",
  },
  {
    icon: FaUsers,
    title: "Team Connectivity",
    text: "See your teammates across different companies and stay synced with your squad.",
    color: "text-orange-500",
  },
  {
    icon: FaBirthdayCake,
    title: "Social Pulse",
    text: "Never miss a celebration. See upcoming birthdays and work anniversaries.",
    color: "text-rose-500",
  },
];

const EmployeeSection = ({ itemVariants }) => {
  return (
    <section className="w-10/12 mx-auto py-24">
      <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">
        
        {/* LEFT SIDE: DESCRIPTION & CTA */}
        <div className="w-full lg:w-5/12">
          <motion.div variants={itemVariants} className="mb-10">
            <span className="text-primary font-bold tracking-widest uppercase text-xs">
              Universal Employee Identity
            </span>
            <h2 className="text-4xl font-extrabold mt-2 mb-4">
              One Profile. <br />
              <span className="text-primary">Infinite Affiliations.</span>
            </h2>
            <p className="text-lg text-gray-500 mb-8">
              Assetverse follows you through your career. Link with multiple companies, manage all your assets in one place, and stay connected with your team’s culture.
            </p>

            {/* JOIN AS EMPLOYEE BUTTON */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-primary text-white font-black rounded-2xl flex items-center gap-3 shadow-[0_10px_30px_rgba(96,108,56,0.3)] hover:shadow-primary/50 transition-all overflow-hidden"
            >
              {/* Glossy Slide Effect */}
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
              <FaUserCircle className="text-xl" />
              <span>JOIN AS EMPLOYEE</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          <div className="space-y-4">
            {employeeWorkflow.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ x: -10 }}
                className="flex items-center p-4 bg-neutral/5 rounded-2xl border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all"
              >
                <div className={`p-3 rounded-xl bg-white shadow-sm mr-4 ${feature.color}`}>
                  <feature.icon className="text-xl" />
                </div>
                <div>
                  <h3 className="font-bold">{feature.title}</h3>
                  <p className="text-sm opacity-70">{feature.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: THE MULTI-TENANT DASHBOARD MOCKUP */}
        <div className="w-full lg:w-7/12 relative">
          <div className="bg-neutral rounded-[3rem] p-8 shadow-2xl border border-white/10 relative overflow-hidden text-white">
            
            {/* 1. Multi-Company Switcher Bar */}
            <div className="flex gap-3 mb-8 bg-black/20 p-2 rounded-2xl w-fit">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-bold border border-white/20">T</div>
              <div className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center font-bold opacity-50 hover:opacity-100 cursor-pointer transition">A</div>
              <div className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center font-bold opacity-50 hover:opacity-100 cursor-pointer transition">S</div>
              <div className="w-10 h-10 rounded-xl border-2 border-dashed border-gray-500 flex items-center justify-center text-xs text-gray-400">+</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 2. Birthday/Social Card */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/10"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-rose-500/20 text-rose-400 rounded-lg">
                    <FaBirthdayCake />
                  </div>
                  <h5 className="font-bold text-sm text-white">Upcoming Birthday</h5>
                </div>
                <div className="flex items-center gap-4">
                  <img src="https://i.pravatar.cc/150?u=teammate" className="w-12 h-12 rounded-full border-2 border-rose-500" alt="Avatar" />
                  <div>
                    <p className="font-bold text-sm text-white">Jason Bourne</p>
                    <p className="text-[10px] text-rose-400 uppercase font-black">Tomorrow 🎂</p>
                  </div>
                </div>
              </motion.div>

              {/* 3. Team Meet Card */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/10"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                    <FaUsers />
                  </div>
                  <h5 className="font-bold text-sm text-white">Team Alpha</h5>
                </div>
                <div className="flex -space-x-3 overflow-hidden">
                  {[1, 2, 3, 4].map((i) => (
                    <img key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-neutral" src={`https://i.pravatar.cc/150?u=${i}`} alt="" />
                  ))}
                  <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-[10px] text-white">+12</div>
                </div>
                <p className="text-[10px] mt-3 text-gray-400">8 Members Online Now</p>
              </motion.div>

              {/* 4. Asset Request Card (Full Width) */}
              <div className="md:col-span-2 bg-primary/20 p-5 rounded-3xl border border-primary/30 flex items-center justify-between">
                <div className="flex items-center gap-4 text-white">
                  <FaHandHoldingHeart className="text-2xl text-primary" />
                  <div>
                    <p className="font-bold text-sm">Need a new peripheral?</p>
                    <p className="text-xs opacity-70">Request returnable/non-returnable items</p>
                  </div>
                </div>
                <button className="btn btn-sm btn-primary rounded-xl text-[10px] font-black">REQUEST</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmployeeSection;
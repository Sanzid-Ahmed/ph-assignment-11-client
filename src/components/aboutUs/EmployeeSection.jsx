import React from "react";
import { motion } from "framer-motion";
console.log(motion)
import {
  FaBuilding,
  FaBirthdayCake,
  FaUsers,
  FaExchangeAlt,
  FaHandHoldingHeart,
  FaBoxOpen,
  FaArrowRight,
  FaUserCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const employeeWorkflow = [
  {
    icon: FaExchangeAlt,
    title: "Multi-Company Affiliation",
    text: "Seamlessly switch between different companies you work for from a single profile.",
    color: "text-primary",
  },
  {
    icon: FaBoxOpen,
    title: "Asset Requests",
    text: "Request returnable (laptops) or non-returnable (swag/pens) assets from any HR manager.",
    color: "text-secondary",
  },
  {
    icon: FaUsers,
    title: "Team Connectivity",
    text: "See your teammates across different companies and stay synced with your squad.",
    color: "text-accent",
  },
  {
    icon: FaBirthdayCake,
    title: "Social Pulse",
    text: "Never miss a celebration. See upcoming birthdays and work anniversaries.",
    color: "text-primary",
  },
];

const EmployeeSection = ({ itemVariants }) => {
  return (
    <section className="w-10/12 mx-auto py-24">
      <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">

        {/* LEFT SIDE */}
        <div className="w-full lg:w-5/12">
          <motion.div variants={itemVariants} className="mb-10">
            <span className="text-primary font-bold tracking-widest uppercase text-xs">
              Universal Employee Identity
            </span>

            <h2 className="text-4xl font-extrabold mt-2 mb-4 text-base-content">
              One Profile. <br />
              <span className="text-primary">Infinite Affiliations.</span>
            </h2>

            <p className="text-lg text-base-content/70 mb-8">
              Assetverse follows you through your career. Link with multiple companies,
              manage all your assets in one place, and stay connected with your team’s culture.
            </p>

            <Link to="/register-employee">
            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-primary text-primary-content
              font-black rounded-2xl flex items-center gap-3
              shadow-[0_10px_30px_rgba(0,0,0,0.25)]
              hover:shadow-primary/40 transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%]
              group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />

              <FaUserCircle className="text-xl" />
              <span>JOIN AS EMPLOYEE</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
            </Link>
          </motion.div>

          {/* FEATURES */}
          <div className="space-y-4">
            {employeeWorkflow.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ x: -10 }}
                className="flex items-center p-4 bg-base-200 rounded-2xl
                border border-base-300/50
                hover:border-primary/30
                hover:bg-base-100
                hover:shadow-xl transition-all"
              >
                <div
                  className={`p-3 rounded-xl bg-base-100 shadow-sm mr-4 ${feature.color}`}
                >
                  <feature.icon className="text-xl" />
                </div>

                <div>
                  <h3 className="font-bold text-base-content">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-base-content/70">
                    {feature.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE DASHBOARD */}
        <div className="w-full lg:w-7/12 relative">
          <div
            className="bg-base-200 rounded-[3rem] p-8
            shadow-2xl border border-base-300
            relative overflow-hidden"
          >

            {/* COMPANY SWITCHER */}
            <div className="flex gap-3 mb-8 bg-base-300/40 p-2 rounded-2xl w-fit">
              <div className="w-10 h-10 rounded-xl bg-primary text-primary-content
              flex items-center justify-center font-bold border border-base-300">
                T
              </div>

              {["A", "S"].map((c) => (
                <div
                  key={c}
                  className="w-10 h-10 rounded-xl bg-base-100
                  flex items-center justify-center font-bold
                  opacity-50 hover:opacity-100 cursor-pointer
                  transition border border-base-300"
                >
                  {c}
                </div>
              ))}

              <div
                className="w-10 h-10 rounded-xl border-2 border-dashed
                border-base-300 flex items-center justify-center
                text-xs text-base-content/50"
              >
                +
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* BIRTHDAY CARD */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-base-100/80 backdrop-blur-md p-5
                rounded-3xl border border-base-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-accent/20 text-accent rounded-lg">
                    <FaBirthdayCake />
                  </div>
                  <h5 className="font-bold text-sm text-base-content">
                    Upcoming Birthday
                  </h5>
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src="https://i.pravatar.cc/150?u=teammate"
                    className="w-12 h-12 rounded-full border-2 border-accent"
                    alt="Avatar"
                  />
                  <div>
                    <p className="font-bold text-sm text-base-content">
                      Jason Bourne
                    </p>
                    <p className="text-[10px] text-accent uppercase font-black">
                      Tomorrow 🎂
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* TEAM CARD */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-base-100/80 backdrop-blur-md p-5
                rounded-3xl border border-base-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/20 text-primary rounded-lg">
                    <FaUsers />
                  </div>
                  <h5 className="font-bold text-sm text-base-content">
                    Team Alpha
                  </h5>
                </div>

                <div className="flex -space-x-3 overflow-hidden">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      className="inline-block h-8 w-8 rounded-full
                      ring-2 ring-base-300"
                      src={`https://i.pravatar.cc/150?u=${i}`}
                      alt=""
                    />
                  ))}
                  <div
                    className="h-8 w-8 rounded-full bg-base-300
                    flex items-center justify-center text-[10px]
                    text-base-content"
                  >
                    +12
                  </div>
                </div>

                <p className="text-[10px] mt-3 text-base-content/60">
                  8 Members Online Now
                </p>
              </motion.div>

              {/* ASSET REQUEST */}
              <div
                className="md:col-span-2 bg-primary/15 p-5 rounded-3xl
                border border-primary/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-4 text-base-content">
                  <FaHandHoldingHeart className="text-2xl text-primary" />
                  <div>
                    <p className="font-bold text-sm">
                      Need a new peripheral?
                    </p>
                    <p className="text-xs opacity-70">
                      Request returnable/non-returnable items
                    </p>
                  </div>
                </div>

                <button className="btn btn-sm btn-primary rounded-xl text-[10px] font-black">
                  REQUEST
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default EmployeeSection;

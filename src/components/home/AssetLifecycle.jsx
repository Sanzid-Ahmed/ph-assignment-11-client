import React from "react";
import { motion } from "framer-motion";
console.log(motion)
import { FaShoppingCart, FaUserCheck, FaTools, FaHistory, FaRecycle } from "react-icons/fa";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const steps = [
  {
    title: "Procurement",
    desc: "Scan and log new hardware instantly with QR integration.",
    icon: FaShoppingCart,
    color: "bg-primary",
  },
  {
    title: "Assignment",
    desc: "Assign assets to team members with digital hand-over receipts.",
    icon: FaUserCheck,
    color: "bg-secondary",
  },
  {
    title: "Maintenance",
    desc: "Track health and schedule repairs before downtime occurs.",
    icon: FaTools,
    color: "bg-primary",
  },
  {
    title: "Auditing",
    desc: "Generate 100% accurate compliance reports in one click.",
    icon: FaHistory,
    color: "bg-secondary",
  },
  {
    title: "Retirement",
    desc: "Securely decommission and wipe data from end-of-life assets.",
    icon: FaRecycle,
    color: "bg-primary",
  },
];

const AssetLifecycle = () => {
    const { user } = useAuth();

  return (
    <section className="py-24 w-10/12 mx-auto backdrop-blur-xl bg-neutral/30 relative rounded-2xl overflow-hidden">
      <div className="container mx-auto px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl font-black text-base-content mb-4">
            The <span className="text-primary">360°</span> Asset Journey
          </h2>
          <p className="max-w-xl mx-auto">
            From the moment it enters your office to the day it’s retired, Assetverse manages every heartbeat of your hardware.
          </p>
        </motion.div>

        <div className="relative flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-4">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-neutral/20 -translate-y-12"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative z-10 w-full lg:w-1/5 group"
            >
              {/* Icon Circle */}
              <div className={`w-20 h-20 mx-auto rounded-full ${step.color} flex items-center justify-center text-white text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300 ring-8 ring-base-100`}>
                <step.icon />
              </div>

              {/* Text Content */}
              <div className="mt-6">
                <h3 className="text-xl font-bold text-base-content mb-2">{step.title}</h3>
                <div className="w-8 h-1 bg-primary mx-auto mb-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <p className="text-sm px-4 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Step Number Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-base-100 text-primary border border-primary text-[10px] font-black px-2 py-1 rounded-md shadow-sm">
                STEP 0{index + 1}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Bottom CTA for the Workflow */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 p-8 bg-base-100 rounded-3xl border border-base-300 shadow-xl max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="text-left">
            <h4 className="font-bold text-lg text-base-content">Ready to automate this cycle?</h4>
            <p className="text-sm">Join 500+ companies managing assets intelligently.</p>
          </div>
          {user?(
            <Link
            to="/dashboard/hr-alytics"
            className="px-8 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition"
          >
            Dashboard
          </Link>
          )
          :(<Link to="/register-hr" className="btn btn-primary px-8 rounded-full shadow-lg hover:shadow-primary/30">
            Start Free Trial
          </Link>)}
        </motion.div>
      </div>
    </section>
  );
};

export default AssetLifecycle;
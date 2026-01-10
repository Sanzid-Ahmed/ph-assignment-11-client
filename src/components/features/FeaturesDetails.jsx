import React from "react";
import { Link } from "react-router-dom";
import { FcNeutralTrading, FcOk } from "react-icons/fc";
import { motion } from "framer-motion";
console.log(motion)

const FeaturesDetails = () => {
  const features = [
    "Unlimited Employees",
    "Custom API & Webhooks",
    "Detailed Audit Logs",
    "Priority 24/7 Support",
    "White-label Options",
    "Bulk Exports & Reports",
  ].map((title) => ({ title, icon: <FcOk /> }));

  return (
    <section className="py-24 px-6 relative bg-base-100 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="container mx-auto max-w-5xl bg-base-100 rounded-[3rem] p-10 md:p-16 text-center shadow-xl border border-base-300 relative"
      >
        {/* Premium Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/40 text-accent text-xs font-bold uppercase tracking-widest mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          Premium Tier
        </div>

        {/* Icon */}
        <div className="w-24 h-24 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <FcNeutralTrading className="text-6xl" />
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-base-content">
          Unlock Your <span className="text-accent">Enterprise Potential</span>
        </h2>

        {/* Description */}
        <p className="text-lg md:text-xl mb-12 text-base-content/70 max-w-2xl mx-auto leading-relaxed">
          Step up from basic tracking. Our Premium tier empowers your team with unlimited employee slots, advanced analytics, and automated workflows — everything you need to run a modern, productive company.
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
          {features.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 bg-base-200 p-4 rounded-2xl border border-base-300 text-left hover:bg-base-100 hover:border-accent transition-all shadow-sm"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-semibold text-base-content">
                {item.title}
              </span>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <Link
            to="/about-us"
            className="bg-accent text-base-100 px-12 py-4 rounded-2xl font-bold shadow-lg hover:bg-accent/90 transition-all hover:scale-105 active:scale-95"
          >
            Explore Premium Plans
          </Link>
          <p className="text-sm text-base-content/50 font-medium italic mt-2 md:mt-0">
            * 14-day trial — no credit card required
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default FeaturesDetails;

import React from "react";
import { motion } from "framer-motion";
console.log(motion)
import HRCapabilitiesShowcase from "./HRCapabilitiesShowcase";

const HRHero = () => {
  return (
    <section className="grid justify-center items-center relative overflow-hidden bg-base-100 py-20 lg:py-32">
      {/* Background Glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-accent/20 blur-3xl -z-10"></div>
      <div className="absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-primary/20 blur-3xl -z-10"></div>

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-accent">
            Register as an HR <br />
            <span className="text-primary">
              Manage Assets & Employees Smartly
            </span>
          </h1>

          <p className="text-base-content/70 text-lg md:text-xl max-w-2xl">
            Take full control of your company's resources with AssetVerse. Add assets, track employee activities, and generate insightful reports — all from one powerful dashboard.
          </p>

          {/* HR Capabilities */}
          <HRCapabilitiesShowcase />
        </motion.div>
      </div>
    </section>
  );
};

export default HRHero;

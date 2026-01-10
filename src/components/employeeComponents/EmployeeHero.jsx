import React from "react";
import { motion } from "framer-motion";
console.log(motion)
import EmployeeCapabilitiesShowcase from "./EmployeeCapabilitiesShowcase";

const EmployeeHero = () => {
  return (
    <section className="grid justify-center items-center relative overflow-hidden bg-base-100 py-20 h-full">
      <div className="container mx-auto px-6">
        <div className="grid gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-accent">
              Register as an Employee <br />
              <span className="text-primary">
                Stay Connected & Manage Assets
              </span>
            </h1>

            <p className="mt-4 text-base-content/70 max-w-xl">
              One profile. Multiple companies. Seamless collaboration with HR
              and teammates.
            </p>

            <EmployeeCapabilitiesShowcase />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EmployeeHero;

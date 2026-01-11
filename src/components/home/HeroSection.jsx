import { Link } from "react-router-dom";
import { motion } from "framer-motion";
console.log(motion)
import heroImg from "../../assets/nik-7I4u37HwA08-unsplash.jpg";

const HeroSection = () => {
  return (
    <div>
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <img
        src={heroImg}
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/90"></div>

      {/* Content */}
<div className="relative z-10 w-10/12 mx-auto max-w-6xl text-center text-white px-4">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight"
        >
          Manage Assets & Employees
          <span className="block text-primary mt-2">
            Smarter with Freemarket
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-6 text-sm sm:text-lg lg:text-xl text-gray-200"
        >
          An all-in-one platform to track assets, manage employees,
          assign responsibilities, and scale your business efficiently.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/about-us"
            className="px-8 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition"
          >
            Explore Features
          </Link>

          <Link
            to="/register-hr"
            className="px-8 py-3 rounded-lg border border-white/40 text-white font-semibold hover:bg-white/10 transition"
          >
            Get Started
          </Link>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex justify-center gap-6 text-sm text-gray-300"
        >
          <span>✔ Secure</span>
          <span>✔ Scalable</span>
          <span>✔ Team-friendly</span>
        </motion.div>
      </div>

    </section>
    </div>
  );
};

export default HeroSection;

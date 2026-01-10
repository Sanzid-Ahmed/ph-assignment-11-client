import React from "react";
import { motion } from "framer-motion";
console.log(motion)
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  FcManager,
  FcPortraitMode,
  FcPositiveDynamic,
  FcSettings,
  FcParallelTasks,
  FcLineChart,
  FcNeutralTrading,
  FcOk,
  FcBriefcase,
  FcKey,
  FcIdea,
  FcElectronics,
} from "react-icons/fc";
import FeaturesDetails from "../../components/features/FeaturesDetails";
import Security from "../../components/features/Security";
import EmployeeFetures from "../../components/features/EmployeeFetures";
import HRFeatures from "../../components/features/HRFeatures";

// --- DATA FOR CHARTS ---
// Colors updated to match your Olive/Amber theme
const ASSET_USAGE_DATA = [
  { name: "In Use", value: 450 },
  { name: "Available", value: 300 },
  { name: "Maintenance", value: 100 },
];
const THEME_COLORS = ["#506f2f", "#f5c242", "#3b5323"]; // Primary, Accent, Secondary

const DEPT_ASSET_DATA = [
  { name: "Eng", assets: 120 },
  { name: "Mkt", assets: 45 },
  { name: "Sales", assets: 30 },
  { name: "HR", assets: 15 },
  { name: "Fin", assets: 25 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const Features = () => {
  return (
    <div className="bg-base-100 min-h-screen text-base-content overflow-x-hidden transition-colors duration-300">
      {/* 1. HERO SECTION */}
      <section className="relative py-20 lg:py-32 px-6 flex flex-col items-center text-center bg-gradient-to-b from-primary/10 to-transparent">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="badge badge-primary badge-outline mb-4 p-4 uppercase tracking-widest font-bold border-2">
            Eco-Friendly Asset Tracking
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-primary">
            Powerful Features for <br />
            <span className="text-accent">Smart Asset Management</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-base-content/80 mb-10">
            AssetVerse bridges the gap between HR administration and employee
            productivity. Track, manage, and optimize your company’s resources
            with our deep-olive precision engine.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register-hr"
              className="btn btn-primary btn-lg shadow-xl px-8 hover:scale-105 transition-transform"
            >
              Join as HR Manager
            </Link>
            <Link
              to="/register-employee"
              className="btn btn-outline btn-secondary border-2 btn-lg hover:scale-105 transition-transform"
            >
              Join as Employee
            </Link>
          </div>
        </motion.div>
      </section>

      <div className="w-10/12 mx-auto">
        {/* 2. HR FEATURES SECTION */}
        <section className="py-20 bg-base-200 relative overflow-hidden">
              {/* Accent Glow */}
              <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl -z-10" />
        
              <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
        
                  {/* HR Features List */}
                  <motion.div
                    className="w-full lg:w-1/2"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                  >
                    {/* Section Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-primary/20 rounded-2xl flex items-center justify-center shadow-md">
                        <FcManager className="text-4xl" />
                      </div>
                      <h2 className="text-4xl font-bold text-primary">
                        HR Management Suite
                      </h2>
                    </div>
        
                    {/* Section Description */}
                    <p className="text-lg text-base-content/70 mb-8 max-w-lg">
                      Take full command of your inventory with our moss-green inspired dashboard designed for accuracy.
                    </p>
        
                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { icon: <FcElectronics />, title: "Asset Management", desc: "Monitor lifecycle from procurement to disposal." },
                        { icon: <FcParallelTasks />, title: "Add/Remove Assets", desc: "Instant bulk uploads or individual onboarding." },
                        { icon: <FcBriefcase />, title: "Team Management", desc: "Structure departments and hierarchies." },
                        { icon: <FcPositiveDynamic />, title: "Request Approval", desc: "Approve employee requests in one click." },
                        { icon: <FcLineChart />, title: "Reports & Analytics", desc: "Export data-driven insights for budget planning." },
                        { icon: <FcOk />, title: "Return Tracking", desc: "Automate retrieval for offboarding staff." },
                      ].map((feature, idx) => (
                        <motion.div
                          key={idx}
                          variants={itemVariants}
                          whileHover={{ scale: 1.03 }}
                          className="flex gap-4 p-5 bg-base-100 rounded-2xl shadow-lg border border-base-300 hover:border-primary/50 hover:bg-base-100 transition-all"
                        >
                          <div className="text-2xl mt-1">{feature.icon}</div>
                          <div>
                            <h4 className="font-bold text-primary">{feature.title}</h4>
                            <p className="text-sm text-base-content/70">{feature.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
        
                  {/* Pie Chart */}
                  <motion.div
                    className="w-full lg:w-1/2 h-[450px] bg-base-100 rounded-[2.5rem] shadow-2xl p-10 border border-base-300 flex flex-col items-center justify-center"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-xl font-bold mb-6 text-primary">
                      Global Asset Distribution
                    </h3>
        
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ASSET_USAGE_DATA}
                          innerRadius={80}
                          outerRadius={130}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          {ASSET_USAGE_DATA.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={THEME_COLORS[index % THEME_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: "15px",
                            border: "none",
                            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
        
                    {/* Legend */}
                    <div className="flex flex-wrap justify-center gap-4 mt-6">
                      {ASSET_USAGE_DATA.map((entry, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
                        >
                          <span
                            className="w-4 h-4 rounded-md"
                            style={{ backgroundColor: THEME_COLORS[i] }}
                          />
                          <span className="text-base-content/80">{entry.name}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
        
                </div>
              </div>
            </section>

        {/* 3. EMPLOYEE FEATURES SECTION */}
        <EmployeeFetures />

        {/* 4. PLATFORM & SECURITY SECTION */}
        <Security />

        {/* 5. PREMIUM PACKAGE TEASER */}
        <FeaturesDetails />
      </div>
    </div>
  );
};

export default Features;

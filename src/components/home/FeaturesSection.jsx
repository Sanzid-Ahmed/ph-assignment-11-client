import React from "react";
import {
  FaBoxes,
  FaUsers,
  FaChartLine,
  FaStar,
  FaShieldAlt,
  FaSyncAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
console.log(motion)
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
} from "recharts";

// Sample data for the Assetverse Graph
const assetData = [
  { name: "Laptops", count: 120, value: 45000 },
  { name: "Monitors", count: 80, value: 25000 },
  { name: "Keyboards", count: 150, value: 5000 },
  { name: "Desks", count: 60, value: 30000 },
  { name: "Chairs", count: 75, value: 15000 },
];

const features = [
  {
    icon: FaBoxes,
    title: "Asset Inventory",
    text: "Real-time tracking of office hardware.",
    color: "text-blue-600",
  },
  {
    icon: FaUsers,
    title: "Team Management",
    text: "Effortlessly manage equipment access.",
    color: "text-purple-600",
  },
  {
    icon: FaChartLine,
    title: "Data Insights",
    text: "Visual analytics for distribution.",
    color: "text-green-600",
  },
  {
    icon: FaStar,
    title: "Easy Upgrades",
    text: "Scale limits with Stripe payments.",
    color: "text-orange-600",
  },
];

const FeaturesSection = ({ itemVariants }) => {
  return (
    <section
      id="features"
      className="w-10/12 mx-auto rounded-3xl overflow-hidden"
    >
      <div className="container mx-auto px-8 lg:px-0">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* LEFT SIDE: FEATURE LIST */}
          <div className="w-full lg:w-5/12">
            <motion.div variants={itemVariants} className="mb-10">
              <span className="text-primary font-bold tracking-widest uppercase text-xs">
                Analytics Engine
              </span>
              <h2 className="text-4xl font-extrabold mt-2 mb-4">
                Master Your <span className="text-primary">Assetverse</span>
              </h2>
              <p className="text-lg">
                Control your inventory and team workflows from a single,
                high-fidelity dashboard.
              </p>
            </motion.div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ x: 10 }}
                  className="flex items-center p-4 bg-neutral/50 rounded-2xl border border-transparent hover:border-blue-200 hover:bg-neutral hover:shadow-lg transition-all"
                >
                  <div
                    className={`p-3 rounded-xl bg-neutral/50 shadow-sm mr-4 ${feature.color}`}
                  >
                    <feature.icon className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold ">{feature.title}</h3>
                    <p className="text-sm">{feature.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: THE GRAPH */}
          <div className="w-full lg:w-7/12 p-8 rounded-3xl  shadow-inner relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h4 className="font-bold text-xl text-left">
                    Asset Valuation Report
                  </h4>
                  <p className="text-sm text-left">
                    Real-time asset distribution and cost
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-primary font-mono">
                    $120,000
                  </span>
                  <p className="text-[10px] font-bold uppercase tracking-tighter">
                    Total Inventory Value
                  </p>
                </div>
              </div>

              {/* Chart Container */}
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={assetData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      {/* Using your Primary (#606c38) and Base-200 (#c9be8d) */}
                      <linearGradient
                        id="barGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#606c38"
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="95%"
                          stopColor="#c9be8d"
                          stopOpacity={0.3}
                        />
                      </linearGradient>
                    </defs>

                    {/* Grid lines using your Neutral color at low opacity */}
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#dad7cd"
                      opacity={0.5}
                    />

                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#606c38", fontSize: 12, fontWeight: 600 }} // Using your Secondary color
                      dy={10}
                    />

                    <YAxis hide />

                    <Tooltip
                      cursor={{ fill: "#fefae0", opacity: 0.5 }} // Using your Dark Theme Base-200 for hover zone
                      contentStyle={{
                        backgroundColor: "#606c38", // Primary
                        color: "#fefae0", // Text color
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.2)",
                      }}
                      itemStyle={{ color: "#fefae0" }}
                    />

                    <Bar
                      dataKey="count"
                      fill="url(#barGradient)"
                      /* The "ActiveBar" is what defines the hover state of the bar itself */
                      activeBar={{
                        fill: "#283618", // Changes to Secondary color on hover
                        stroke: "#606c38",
                        strokeWidth: 1,
                      }}
                      radius={[6, 6, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

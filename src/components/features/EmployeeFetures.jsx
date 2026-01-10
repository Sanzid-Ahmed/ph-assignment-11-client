import React from 'react';
import { motion } from 'framer-motion';
console.log(motion)
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { FcPortraitMode } from 'react-icons/fc';

// --- Internal Data ---
const DEPT_ASSET_DATA = [
  { name: 'Engineering', assets: 120 },
  { name: 'Marketing', assets: 45 },
  { name: 'Sales', assets: 30 },
  { name: 'HR', assets: 15 },
  { name: 'Finance', assets: 25 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 }
};

const EmployeeFeatures = () => {
  return (
    <section className="py-24 bg-base-100 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
          
          {/* Left Side: Data Visualization */}
          <motion.div 
            className="w-full lg:w-1/2 h-[500px] bg-base-200/50 rounded-[3rem] shadow-inner p-8 md:p-12 border border-base-300 relative group"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Soft decorative glow */}
            <div className="absolute inset-0 bg-accent/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10 h-full flex flex-col">
              <div className="mb-6">
                <h3 className="text-2xl font-black text-secondary uppercase tracking-tight">Resource Distribution</h3>
                <p className="text-sm text-base-content/60">Real-time view of assets across all departments</p>
              </div>

              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DEPT_ASSET_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d1d5db" opacity={0.5} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#3b5323', fontWeight: '700', fontSize: 12}} 
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f5c242', opacity: 0.1}} 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  {/* Using your specific Accent color #f5c242 */}
                  <Bar dataKey="assets" fill="#f5c242" radius={[10, 10, 0, 0]} barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Right Side: Feature List */}
          <motion.div 
            className="w-full lg:w-1/2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-secondary rounded-2xl shadow-lg shadow-secondary/20">
                  <FcPortraitMode className="text-4xl" />
              </div>
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-secondary leading-tight">
                  Empowered <br />
                  <span className="text-primary italic">Staff Portal</span>
                </h2>
              </div>
            </div>

            <p className="text-lg text-base-content/70 mb-10 max-w-lg leading-relaxed">
              Experience a hassle-free way to manage your work equipment. Submit requests, track approvals, and stay connected with your team’s pulse.
            </p>

            <div className="grid gap-4">
              {[
                { title: "Personal Asset Vault", desc: "Instantly view specs and return dates for your assigned gear.", icon: "💻", color: "hover:bg-primary/10" },
                { title: "One-Click Requests", desc: "Request new peripherals or upgrades from the available inventory.", icon: "📥", color: "hover:bg-accent/10" },
                { title: "Status Dashboard", desc: "Visual timeline tracking for your pending asset requests.", icon: "⏳", color: "hover:bg-secondary/10" },
                { title: "Team Social Pulse", desc: "Never miss a birthday or anniversary with automated alerts.", icon: "🔔", color: "hover:bg-primary/10" }
              ].map((item, idx) => (
                <motion.div 
                  key={idx} 
                  variants={itemVariants} 
                  whileHover={{ x: 15 }}
                  className={`flex items-start gap-5 p-6 bg-base-200 rounded-[2rem] border border-transparent transition-all cursor-default ${item.color} hover:border-base-300 hover:shadow-md`}
                >
                  <div className="text-4xl bg-base-100 p-3 rounded-2xl shadow-sm">{item.icon}</div>
                  <div>
                    <h4 className="font-bold text-xl text-secondary mb-1">{item.title}</h4>
                    <p className="text-sm text-base-content/60 leading-snug">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EmployeeFeatures;
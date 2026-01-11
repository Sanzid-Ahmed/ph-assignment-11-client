import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, AreaChart, Area
} from "recharts";
import { 
  FaBoxes, FaUndoAlt, FaChartLine, FaHistory, 
  FaArrowUp, FaDownload, FaPlus, FaFilter, FaExclamationTriangle 
} from "react-icons/fa";
import { motion } from "framer-motion";
console.log(motion)
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const HRAnalytics = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) { fetchAssets(); }
  }, [user?.email]);

  const fetchAssets = async () => {
    try {
      const res = await axiosSecure.get(`/assets/hr/${user.email}`);
      setAssets(res.data || []);
    } catch (error) {
      console.error("Failed to load assets", error);
    } finally {
      setLoading(false);
    }
  };

  const totalQuantity = assets.reduce((sum, a) => sum + a.productQuantity, 0);
  const totalAvailable = assets.reduce((sum, a) => sum + a.availableQuantity, 0);
  const totalAssigned = totalQuantity - totalAvailable;
  const utilizationRate = Math.round((totalAssigned / totalQuantity) * 100) || 0;

  const pieData = [
    { name: "Returnable", value: assets.filter(a => a.productType === "Returnable").reduce((sum, a) => sum + a.productQuantity, 0) },
    { name: "Non-returnable", value: assets.filter(a => a.productType === "Non-returnable").reduce((sum, a) => sum + a.productQuantity, 0) }
  ];

  const barData = assets
    .map(asset => ({
      name: asset.productName,
      usage: asset.productQuantity ? Math.round(((asset.productQuantity - asset.availableQuantity) / asset.productQuantity) * 100) : 0
    }))
    .sort((a, b) => b.usage - a.usage)
    .slice(0, 5);

  const THEME_COLORS = {
    primary: "#506f2f",
    secondary: "#3b5323",
    accent: "#f5c242",
    danger: "#f43f5e"
  };

  if (loading) return (
    <div className="flex h-96 justify-center items-center">
      <span className="loading loading-ring loading-lg text-primary"></span>
    </div>
  );

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-8 pb-20">
      
      {/* --- SECTION 1: SMART HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-base-300 pb-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold mb-2 uppercase tracking-widest text-xs">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            System Intelligence
          </div>
          <h2 className="text-4xl font-black text-base-content">Asset Command Center</h2>
          <p className="text-base-content/60 mt-1">Global inventory health and hardware distribution metrics.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button className="btn btn-outline border-base-300 gap-2"><FaDownload /> Export PDF</button>
          <Link to="/dashboard/add-asset" className="btn btn-primary gap-2 shadow-lg shadow-primary/20"><FaPlus /> Add New Asset</Link>
        </div>
      </div>

      {/* --- SECTION 2: HIGH-LEVEL KPIS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Inventory", val: totalQuantity, icon: <FaBoxes />, color: "primary", trend: "+12%" },
          { label: "Utilization", val: `${utilizationRate}%`, icon: <FaChartLine />, color: "secondary", trend: "+5.4%" },
          { label: "Available Stock", val: totalAvailable, icon: <FaUndoAlt />, color: "accent", trend: "Steady" },
          { label: "Low Stock Alerts", val: assets.filter(a => a.availableQuantity < 5).length, icon: <FaExclamationTriangle />, color: "danger", trend: "-2" }
        ].map((kpi, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            key={i} className="bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm group hover:border-primary transition-all"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-white bg-${kpi.color === 'danger' ? 'error' : kpi.color}`}>
              {kpi.icon}
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm font-bold opacity-60 uppercase">{kpi.label}</p>
                <h4 className="text-3xl font-black mt-1">{kpi.val}</h4>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg bg-base-200 ${kpi.trend.includes('+') ? 'text-success' : ''}`}>
                {kpi.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- SECTION 3: ANALYTICS GRID --- */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Composition Card */}
        <div className="xl:col-span-4 bg-base-100 p-8 rounded-[2.5rem] border border-base-300 shadow-xl relative overflow-hidden">
            <h3 className="font-black text-xl mb-8 flex items-center justify-between">
              Classification 
              <span className="text-xs bg-base-200 px-3 py-1 rounded-full text-gray-400">By Type</span>
            </h3>
            <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={85} outerRadius={110} paddingAngle={10}>
                            <Cell fill={THEME_COLORS.primary} />
                            <Cell fill={THEME_COLORS.accent} />
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" iconType="rect" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Demand Card */}
        <div className="xl:col-span-8 bg-base-100 p-8 rounded-[2.5rem] border border-base-300 shadow-xl">
            <div className="flex justify-between items-center mb-8">
                <h3 className="font-black text-xl">Demand Spectrum</h3>
                <div className="flex gap-2">
                    <button className="btn btn-xs btn-ghost text-primary">Monthly</button>
                    <button className="btn btn-xs btn-primary">Yearly</button>
                </div>
            </div>
            <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ left: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                        <YAxis hide />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '15px'}} />
                        <Bar dataKey="usage" fill={THEME_COLORS.primary} radius={[10, 10, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

      </div>

      {/* --- SECTION 4: INVENTORY HEALTH TABLE (New Content) --- */}
      <div className="bg-base-100 rounded-[2.5rem] border border-base-300 overflow-hidden">
        <div className="p-8 border-b border-base-300 flex justify-between items-center bg-base-200/30">
            <h3 className="font-black text-xl tracking-tight">Low Stock Surveillance</h3>
            <FaFilter className="text-gray-400 cursor-pointer" />
        </div>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-base-200/50">
              <tr className="text-gray-500 uppercase text-[10px] tracking-widest">
                <th className="py-5">Product Name</th>
                <th>Status</th>
                <th>Available</th>
                <th>Utilization</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.slice(0, 5).map((asset, i) => (
                <tr key={i} className="hover:bg-base-200/40 transition-colors border-b border-base-200">
                  <td className="font-bold py-4">{asset.productName}</td>
                  <td>
                    <span className={`badge border-none py-3 px-4 font-bold text-xs ${asset.availableQuantity > 0 ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'}`}>
                      {asset.availableQuantity > 0 ? 'Active' : 'Stock Out'}
                    </span>
                  </td>
                  <td className="font-mono">{asset.availableQuantity} units</td>
                  <td>
                    <progress className="progress progress-primary w-24 h-1.5" value={Math.round(((asset.productQuantity - asset.availableQuantity) / asset.productQuantity) * 100)} max="100"></progress>
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-xs text-primary underline">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HRAnalytics;








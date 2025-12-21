import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";
import { FaBoxes, FaUndoAlt, FaChartLine, FaHistory } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

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

  // --- STATS CALCULATION ---
  const totalQuantity = assets.reduce((sum, a) => sum + a.productQuantity, 0);
  const totalAvailable = assets.reduce((sum, a) => sum + a.availableQuantity, 0);
  const totalAssigned = totalQuantity - totalAvailable;

  // --- PIE CHART DATA ---
  const pieData = [
    { name: "Returnable", value: assets.filter(a => a.productType === "Returnable").reduce((sum, a) => sum + a.productQuantity, 0) },
    { name: "Non-returnable", value: assets.filter(a => a.productType === "Non-returnable").reduce((sum, a) => sum + a.productQuantity, 0) }
  ];

  // --- BAR CHART DATA ---
  const barData = assets
    .map(asset => ({
      name: asset.productName,
      usage: asset.productQuantity ? Math.round(((asset.productQuantity - asset.availableQuantity) / asset.productQuantity) * 100) : 0
    }))
    .sort((a, b) => b.usage - a.usage)
    .slice(0, 5);

  const PIE_COLORS = ["#6366f1", "#f43f5e"]; // Indigo and Rose

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <span className="loading loading-dots loading-lg text-primary"></span>
    </div>
  );

  return (
    <div className="p-2 space-y-10 animate-fade-in">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-neutral">Inventory Insights</h2>
          <p className="text-gray-500">Real-time overview of your company assets and assignment rates.</p>
        </div>
        <div className="badge badge-primary badge-outline p-4 gap-2">
          <FaHistory /> Updated Just Now
        </div>
      </div>

      {/* 2. Top Stats Cards (DaisyUI Stats) */}
      <div className="stats stats-vertical lg:stats-horizontal shadow-sm border w-full bg-base-100">
        <div className="stat">
          <div className="stat-figure text-primary text-3xl"><FaBoxes /></div>
          <div className="stat-title">Total Stock</div>
          <div className="stat-value text-primary">{totalQuantity}</div>
          <div className="stat-desc">Items in inventory</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-secondary text-3xl"><FaChartLine /></div>
          <div className="stat-title">Assigned Items</div>
          <div className="stat-value text-secondary">{totalAssigned}</div>
          <div className="stat-desc">{Math.round((totalAssigned / totalQuantity) * 100) || 0}% utilization rate</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-accent text-3xl"><FaUndoAlt /></div>
          <div className="stat-title">Available Now</div>
          <div className="stat-value text-accent">{totalAvailable}</div>
          <div className="stat-desc">Ready for request</div>
        </div>
      </div>

      {/* 3. Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        
        {/* PIE CHART - Taking 2 columns */}
        <div className="xl:col-span-2 bg-base-100 p-8 rounded-2xl shadow-sm border relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2">Asset Composition</h3>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={8}>
                            {pieData.map((_, index) => <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} strokeWidth={0} />)}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                        <Legend verticalAlign="bottom" iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* BAR CHART - Taking 3 columns */}
        <div className="xl:col-span-3 bg-base-100 p-8 rounded-2xl shadow-sm border relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-secondary"></div>
            <h3 className="font-bold text-xl mb-6">High-Demand Items (Top 5)</h3>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} layout="vertical" margin={{ left: 20, right: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{ fill: '#f8fafc' }} formatter={(v) => [`${v}% Used`]} />
                        <Bar dataKey="usage" fill="#6366f1" radius={[0, 10, 10, 0]} barSize={25} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

      </div>
    </div>
  );
};

export default HRAnalytics;
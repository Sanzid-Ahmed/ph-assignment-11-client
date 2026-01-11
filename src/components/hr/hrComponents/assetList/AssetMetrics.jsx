import React from "react";

const AssetMetrics = ({ stats }) => {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-primary/10 p-6 rounded-2xl border border-primary/20">
        <p className="text-xs uppercase opacity-60">Total Assets</p>
        <h3 className="text-3xl font-bold">{stats.total}</h3>
      </div>

      <div className="bg-accent/10 p-6 rounded-2xl border border-accent/20">
        <p className="text-xs uppercase opacity-60">Low Stock</p>
        <h3 className="text-3xl font-bold">{stats.lowStock}</h3>
      </div>

      <div className="bg-base-200 p-6 rounded-2xl border border-base-300">
        <p className="text-xs uppercase opacity-60">Returnable</p>
        <h3 className="text-3xl font-bold">{stats.returnable}</h3>
      </div>
    </div>
  );
};

export default AssetMetrics;

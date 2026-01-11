import React from "react";
import { motion, AnimatePresence } from "framer-motion";
console.log(motion)
import { Link } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaUserPlus } from "react-icons/fa";

const AssetTable = ({ paginatedAssets, loading, setEditingAsset, handleDelete }) => {
  return (
    <div className="max-w-7xl mx-auto bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table w-full">
          {/* Table Header with theme-based colors */}
          <thead className="bg-base-200 text-base-content">
            <tr className="uppercase text-xs tracking-wider border-b border-base-300">
              <th className="py-4">Asset</th>
              <th>Type</th>
              <th>Usage Status</th>
              <th>Stock (Avail/Total)</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-24">
                  <span className="loading loading-dots loading-lg text-primary"></span>
                  <p className="mt-2 text-sm opacity-50">Fetching inventory...</p>
                </td>
              </tr>
            ) : (
              <AnimatePresence>
                {paginatedAssets.map((asset, index) => {
                  const usagePercent = Math.round((1 - asset.availableQuantity / asset.productQuantity) * 100);
                  
                  return (
                    <motion.tr 
                      key={asset._id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-base-200/50 transition-colors border-b border-base-300 last:border-0"
                    >
                      {/* Asset Name */}
                      <td className="font-semibold text-primary">{asset.productName}</td>
                      
                      {/* Product Type Badge */}
                      <td>
                        <span className="badge badge-ghost border-base-300 px-3 py-3">
                          {asset.productType}
                        </span>
                      </td>

                      {/* Usage Percentage with dynamic coloring */}
                      <td>
                        <div className="flex items-center gap-3">
                          <progress 
                            className={`progress w-20 ${usagePercent > 80 ? 'progress-error' : 'progress-primary'}`} 
                            value={usagePercent} 
                            max="100"
                          ></progress>
                          <span className="text-sm font-medium">{usagePercent}%</span>
                        </div>
                      </td>

                      {/* Availability Count */}
                      <td className="font-mono text-sm">
                        <span className={asset.availableQuantity === 0 ? "text-error font-bold" : "text-base-content"}>
                          {asset.availableQuantity}
                        </span>
                        <span className="opacity-40"> / {asset.productQuantity}</span>
                      </td>

                      {/* Action Buttons */}
                      <td className="text-center">
                        <div className="flex justify-center gap-1">
                          <div className="tooltip" data-tip="Assign Asset">
                            <Link 
                              to={`/dashboard/assign-asset/${asset._id}`} 
                              className="btn btn-square btn-ghost btn-sm text-primary hover:bg-primary hover:text-white"
                            >
                              <FaUserPlus size={16} />
                            </Link>
                          </div>

                          <div className="tooltip" data-tip="Edit details">
                            <button
                              onClick={() => setEditingAsset(asset)}
                              className="btn btn-square btn-ghost btn-sm text-secondary hover:bg-secondary hover:text-white"
                            >
                              <FaEdit size={16} />
                            </button>
                          </div>

                          <div className="tooltip tooltip-error" data-tip="Delete Asset">
                            <button
                              onClick={() => handleDelete(asset._id)}
                              className="btn btn-square btn-ghost btn-sm text-error hover:bg-error hover:text-white"
                            >
                              <FaTrashAlt size={16} />
                            </button>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            )}
          </tbody>
        </table>
        
        {/* Empty State */}
        {!loading && paginatedAssets.length === 0 && (
          <div className="p-20 text-center">
            <p className="text-base-300 text-lg">No assets found in the inventory.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetTable;
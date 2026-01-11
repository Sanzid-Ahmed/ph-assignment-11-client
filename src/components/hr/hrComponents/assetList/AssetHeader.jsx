import React from "react";
import { Link } from "react-router-dom";
import { FaFileExport, FaBoxOpen } from "react-icons/fa";

const AssetHeader = () => {
  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-6">
      <div>
        <h2 className="text-4xl font-black text-base-content tracking-tight">
          ASSET.<span className="text-primary">CORE</span>
        </h2>
        <div className="flex items-center gap-2 mt-2">
          <span className="badge badge-primary badge-outline font-bold px-4">
            HR ADMIN VIEW
          </span>
          <span className="text-sm opacity-50">/inventory</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="btn btn-outline gap-2">
          <FaFileExport /> Export CSV
        </button>
        <Link
          to="/dashboard/add-asset"
          className="btn btn-primary gap-2 text-white"
        >
          <FaBoxOpen /> Add Asset
        </Link>
      </div>
    </div>
  );
};

export default AssetHeader;

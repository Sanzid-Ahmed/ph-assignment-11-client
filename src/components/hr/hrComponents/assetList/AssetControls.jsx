import React from "react";
import { FaSearch, FaSortAmountDown } from "react-icons/fa";

const AssetControls = ({ search, setSearch, filter, setFilter, sort, setSort }) => {
  return (
    <div className="max-w-7xl mx-auto bg-base-200 p-4 rounded-2xl flex flex-wrap gap-4">
      <div className="relative flex-1 min-w-[250px]">
        <input
          type="text"
          placeholder="Search asset..."
          className="input w-full pl-12 bg-base-100"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" />
      </div>

      <select
        className="select select-bordered bg-base-100"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="">All Types</option>
        <option value="Returnable">Returnable</option>
        <option value="Non-returnable">Non-returnable</option>
      </select>

      <button
        className={`btn ${sort ? "btn-primary" : "btn-outline"}`}
        onClick={() => setSort(!sort)}
      >
        <FaSortAmountDown /> Sort
      </button>
    </div>
  );
};

export default AssetControls;

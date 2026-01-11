import React from "react";

const Pagination = ({ totalPages, currentPage, setCurrentPage, paginatedAssets, loading }) => {
  if (loading || totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-10 border-t border-base-300 bg-base-200/20">
      <span className="text-sm font-bold opacity-50 italic">
        Showing {paginatedAssets.length} items this session
      </span>
      <div className="join shadow-xl rounded-2xl overflow-hidden border border-primary/20">
        <button className="join-item btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>PREV</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
          <button
            key={num}
            className={`join-item btn ${currentPage === num ? "btn-primary text-white" : "bg-base-100"}`}
            onClick={() => setCurrentPage(num)}
          >
            {num}
          </button>
        ))}
        <button className="join-item btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>NEXT</button>
      </div>
    </div>
  );
};

export default Pagination;

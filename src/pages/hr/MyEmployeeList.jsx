import React, { useState, useMemo } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import { FiTrash2, FiTrendingUp, FiUser, FiSearch, FiUsers } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import useUserData from "../../hooks/useUserData";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const MyEmployeeList = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { userData } = useUserData();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data: employees = [], isLoading, refetch } = useQuery({
    queryKey: ["employees", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/employees/${user.email}`);
      return res.data || [];
    },
  });

  const handleRemove = async (employeeEmail) => {
    Swal.fire({
      title: "Remove Employee?",
      text: "They will lose access to the company dashboard.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f5c242", // amber accent
      confirmButtonText: "Yes, remove them",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/employees/${employeeEmail}`);
          toast.success("Employee removed successfully");
          refetch();
        } catch (error) {
          toast.error("Failed to remove employee", error);
        }
      }
    });
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter(
      (emp) =>
        (emp.employeeName ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.employeeEmail ?? "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [employees, searchQuery]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const employeeCount = employees.length;
  const hasAccess = employeeCount < (userData?.packageLimit || 0);

  return (
    <div className="p-4 md:p-8 bg-base-100 min-h-screen">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-secondary">My Employees</h2>
            <p className="text-neutral flex items-center gap-2 mt-1">
              <FiUsers className="text-primary" /> {employeeCount} / {userData?.packageLimit || 0} Slots Filled
            </p>
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <input
                type="text"
                placeholder="Search name or email..."
                className="input input-bordered w-full pl-10 bg-base-100 border-base-300 focus:border-primary focus:ring-primary"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" />
            </div>

            <select 
              className="select select-bordered bg-base-100 border-base-300 focus:border-primary focus:ring-primary"
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            >
              <option value="5">5 / page</option>
              <option value="10">10 / page</option>
              <option value="20">20 / page</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-base-200 rounded-2xl shadow-md border border-base-300 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-neutral text-secondary uppercase text-[12px] font-bold tracking-wider">
                <tr>
                  <th className="py-4 px-6">Employee</th>
                  <th>Role</th>
                  <th>Member Since</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-300">
                {isLoading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-20">
                      <span className="loading loading-spinner loading-lg text-primary"></span>
                    </td>
                  </tr>
                ) : paginatedEmployees.length > 0 ? (
                  paginatedEmployees.map((emp) => (
                    <tr key={emp.employeeEmail} className="hover:bg-base-300/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="bg-base-100 text-secondary rounded-full w-10">
                              {emp.profileImage ? (
                                <img src={emp.profileImage} alt={emp.employeeName} className="rounded-full w-10 h-10" />
                              ) : (
                                <span className="text-xs font-bold">{emp.employeeName?.[0]}</span>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="font-bold text-secondary">{emp.employeeName}</div>
                            <div className="text-sm text-neutral">{emp.employeeEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-ghost font-medium text-secondary px-3 py-2">Employee</span>
                      </td>
                      <td className="text-neutral text-sm">
                        {new Date(emp.assignedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td>
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleRemove(emp.employeeEmail)}
                            className="btn btn-ghost btn-sm text-accent hover:bg-accent/10 rounded-lg gap-2"
                          >
                            <FiTrash2 /> Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-20 text-neutral/50 font-medium">
                      No employees found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="p-4 border-t border-base-300 flex flex-col md:flex-row items-center justify-between gap-4 bg-base-200/50">
              <span className="text-sm text-neutral">
                Showing {paginatedEmployees.length} of {filteredEmployees.length} employees
              </span>
              <div className="join border border-base-300 shadow-sm">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="join-item btn btn-sm bg-base-100 hover:bg-base-300"
                >
                  Prev
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`join-item btn btn-sm ${currentPage === i + 1 ? 'btn-primary text-white' : 'bg-base-100 hover:bg-base-300 border-base-300'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="join-item btn btn-sm bg-base-100 hover:bg-base-300"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Package Limit Warning */}
        {!hasAccess && (
          <div className="mt-12 flex justify-center">
            <div className="card w-full max-w-xl bg-base-200 shadow-xl border border-base-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <FiUsers size={120} />
              </div>
              <div className="card-body items-center text-center py-10">
                <div className="bg-accent/20 p-4 rounded-full mb-4">
                  <FiTrendingUp className="size-10 text-accent" />
                </div>
                <h2 className="card-title text-2xl font-black text-secondary">Team Full!</h2>
                <p className="text-neutral max-w-sm">
                  You've hit your limit of <span className="font-bold text-secondary">{userData.packageLimit}</span> employees. 
                  Upgrade your package to continue growing your organization.
                </p>
                <div className="card-actions mt-8 w-full flex flex-col gap-3">
                  <Link to="/dashboard/upgrade" className="btn btn-primary w-full shadow-lg shadow-primary/30">
                    Upgrade Subscription
                  </Link>
                  <Link to="/dashboard/home" className="btn btn-ghost w-full btn-sm text-neutral">
                    Maybe Later
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyEmployeeList;

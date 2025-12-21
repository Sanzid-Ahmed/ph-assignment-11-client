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
      confirmButtonColor: "#ef4444",
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
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800">My Employees</h2>
            <p className="text-slate-500 flex items-center gap-2 mt-1">
              <FiUsers className="text-primary" /> {employeeCount} / {userData?.packageLimit || 0} Slots Filled
            </p>
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <input
                type="text"
                placeholder="Search name or email..."
                className="input input-bordered w-full pl-10 bg-white"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            <select 
              className="select select-bordered bg-white"
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            >
              <option value="5">5 / page</option>
              <option value="10">10 / page</option>
              <option value="20">20 / page</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="py-4 px-6">Employee</th>
                  <th>Role</th>
                  <th>Member Since</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr><td colSpan="4" className="text-center py-20"><span className="loading loading-spinner loading-lg text-primary"></span></td></tr>
                ) : paginatedEmployees.length > 0 ? (
                  paginatedEmployees.map((emp) => (
                    <tr key={emp.employeeEmail} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="bg-slate-200 text-slate-600 rounded-full w-10">
                              <span className="text-xs"><img src={emp.profileImage} alt="" /></span>
                            </div>
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">{emp.employeeName}</div>
                            <div className="text-sm text-slate-500">{emp.employeeEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-ghost font-medium text-slate-600 px-3 py-3">Employee</span>
                      </td>
                      <td className="text-slate-500 text-sm">
                        {new Date(emp.assignedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td>
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleRemove(emp.employeeEmail)}
                            className="btn btn-ghost btn-sm text-rose-500 hover:bg-rose-50 rounded-lg gap-2"
                          >
                            <FiTrash2 /> Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-20 text-slate-400 font-medium">
                      No employees found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {!isLoading && totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-white">
              <span className="text-sm text-slate-500">
                Showing {paginatedEmployees.length} of {filteredEmployees.length} employees
              </span>
              <div className="join border border-slate-200 shadow-sm">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="join-item btn btn-sm bg-white hover:bg-slate-50"
                >
                  Prev
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`join-item btn btn-sm ${currentPage === i + 1 ? 'btn-primary text-white' : 'bg-white hover:bg-slate-50 border-slate-200'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="join-item btn btn-sm bg-white hover:bg-slate-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {!hasAccess && (
          <div className="mt-12 flex justify-center">
            <div className="card w-full max-w-xl bg-white shadow-xl border border-slate-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <FiUsers size={120} />
              </div>
              <div className="card-body items-center text-center py-10">
                <div className="bg-amber-100 p-4 rounded-full mb-4">
                  <FiTrendingUp className="size-10 text-amber-600" />
                </div>
                <h2 className="card-title text-2xl font-black text-slate-800">Team Full!</h2>
                <p className="text-slate-500 max-w-sm">
                  You've hit your limit of <span className="font-bold text-slate-800">{userData.packageLimit}</span> employees. 
                  Upgrade your package to continue growing your organization.
                </p>
                <div className="card-actions mt-8 w-full">
                  <Link to="/dashboard/upgrade" className="btn btn-primary w-full shadow-lg shadow-primary/30">
                    Upgrade Subscription
                  </Link>
                  <Link to="/dashboard/home" className="btn btn-ghost w-full btn-sm mt-2 text-slate-400">
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
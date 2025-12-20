import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import { FiTrash2, FiTrendingUp, FiUser } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import useUserData from "../../hooks/useUserData";
import { Link } from "react-router-dom";

const MyEmployeeList = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { userData } = useUserData();


  // Fetch employees from backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axiosSecure.get(`/employees/${user?.email}`);
        console.log("Fetched employees:", response.data);
        setEmployees(response.data || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) fetchEmployees();
  }, [axiosSecure, user]);

  // Remove employee handler
  const handleRemove = async (employeeEmail) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this employee?");
    if (!confirmDelete) return;

    try {
      await axiosSecure.delete(`/employees/${employeeEmail}`);
      setEmployees((prev) => prev.filter((emp) => emp.employeeEmail !== employeeEmail));
      toast.success("Employee removed successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove employee");
    }
  };

  // Filter employees based on search query
  const filteredEmployees = employees.filter(
    (emp) =>
      (emp.employeeName ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.employeeEmail ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { data: allemployees = [] } = useQuery({
    queryKey: ["employees", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/employees/${user.email}`);
      return res.data || [];
    },
  });

  const employeeCount = allemployees.length;
  const hasAccess = employeeCount < (userData?.packageLimit || 0);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">My Employee List</h2>

      {/* Search input */}
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="input input-bordered w-full md:w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Employees table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-10">
                  Loading...
                </td>
              </tr>
            ) : filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp, index) => (
                <tr key={emp.employeeEmail}>
                  <td>{index + 1}</td>
                  <td className="flex items-center gap-2">
                    <FiUser className="text-gray-500" />
                    {emp.employeeName}
                  </td>
                  <td>{emp.employeeEmail}</td>
                  <td>{"employee"}</td>
                  <td>{new Date(emp.assignedAt).toLocaleDateString()}</td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => handleRemove(emp.employeeEmail)}
                      className="btn btn-sm btn-error gap-2 flex items-center"
                    >
                      <FiTrash2 />
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-10">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {!hasAccess && <div className="mt-10 w-full flex items-center justify-center p-4">
          <div className="card w-full max-w-md bg-base-100 shadow-2xl border-t-4 border-primary">
            <div className="card-body items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <FiTrendingUp className="size-12 text-primary" />
              </div>
              <h2 className="card-title text-2xl font-bold">Package Limit Reached!</h2>
              <p className="text-gray-500">
                You have reached your employee limit of <span className="font-bold text-black">{userData.packageLimit}</span>. 
                Upgrade your subscription to accept more requests and grow your team.
              </p>
              <div className="card-actions mt-6 w-full">
                <Link to="/dashboard/upgrade" className="btn btn-primary w-full shadow-lg">
                  <FiTrendingUp className="mr-2" /> Upgrade Package Now
                </Link>
                <Link to="/dashboard/home" className="btn btn-ghost w-full btn-sm mt-2">
                  Back to Overview
                </Link>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default MyEmployeeList;

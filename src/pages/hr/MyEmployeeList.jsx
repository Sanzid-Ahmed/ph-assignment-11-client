import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import { FiTrash2, FiUser } from "react-icons/fi";

const MyEmployeeList = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axiosSecure.get(`/employees?companyName=${user?.companyName}`);
        setEmployees(response.data || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    };

    if (user?.companyName) fetchEmployees();
  }, [axiosSecure, user]);

  const handleRemove = async (employeeEmail) => {
    const confirm = window.confirm("Are you sure you want to remove this employee?");
    if (!confirm) return;

    try {
      await axiosSecure.delete(`/employees/${employeeEmail}`);
      setEmployees((prev) => prev.filter((emp) => emp.email !== employeeEmail));
      toast.success("Employee removed successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove employee");
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">My Employee List</h2>

      {/* Search */}
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="input input-bordered w-full md:w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
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
                <tr key={emp.email}>
                  <td>{index + 1}</td>
                  <td className="flex items-center gap-2">
                    <FiUser className="text-gray-500" />
                    {emp.name}
                  </td>
                  <td>{emp.email}</td>
                  <td>{emp.role}</td>
                  <td>{new Date(emp.createdAt).toLocaleDateString()}</td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => handleRemove(emp.email)}
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
    </div>
  );
};

export default MyEmployeeList;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { toast } from "react-hot-toast";
import { FaUserCheck, FaArrowLeft } from "react-icons/fa";

const AssignAsset = () => {
  const { id } = useParams(); // Asset ID from URL
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [asset, setAsset] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch the specific asset details
        const assetRes = await axiosSecure.get(`/assets/single/${id}`);
        setAsset(assetRes.data);

        // 2. Fetch employees (using your logic)
        const response = await axiosSecure.get(`/employees/${user?.email}`);
        console.log("Fetched employees:", response.data);
        setEmployees(response.data || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email && id) fetchData();
  }, [id, user?.email, axiosSecure]);


  console.log(employees[0]);

  const handleAssign = async (e) => {
  e.preventDefault();
  
  // Find the selected employee object to get their name
  const employee = employees.find(emp => emp.email === selectedEmployee);
  
  if (!employee) return toast.error("Please select an employee");

  setAssigning(true);
  try {
    const assignmentData = {
      assetId: asset._id,
      employeeEmail: employee.email,
      employeeName: employee.name, // Added to match your DB schema
      hrEmail: user?.email,        // The person assigning
    };

    await axiosSecure.post("/assets/direct-assign", assignmentData);
    toast.success(`Assigned ${asset.productName} to ${employee.name}`);
    navigate("/dashboard/asset-list");
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Assignment failed");
  } finally {
    setAssigning(false);
  }
};

  if (loading) return <div className="text-center mt-20"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button 
        onClick={() => navigate(-1)} 
        className="btn btn-ghost mb-4 gap-2"
      >
        <FaArrowLeft /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-8 bg-base-100 p-8 rounded-xl shadow-lg border border-base-200">
        
        {/* Left: Asset Info */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-neutral">Assign Asset</h2>
          <div className="card bg-base-200 p-4">
            <img 
              src={asset?.productImage} 
              alt={asset?.productName} 
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-bold">{asset?.productName}</h3>
            <p className="text-gray-600">Type: {asset?.productType}</p>
            <p className="text-sm font-semibold">
              Available Quantity: <span className="text-primary">{asset?.availableQuantity}</span>
            </p>
          </div>
        </div>

        {/* Right: Selection Form */}
        <form onSubmit={handleAssign} className="flex flex-col justify-center gap-6">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-bold">Select Employee</span>
            </label>
            <select 
              className="select select-bordered w-full"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              required
            >
              <option value="">Choose an employee...</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp.email}>
                  {emp.employeeEmail} ({emp.employeeName})
                </option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            disabled={assigning || asset?.availableQuantity < 1}
            className="btn btn-primary w-full gap-2"
          >
            {assigning ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <>
                <FaUserCheck /> Assign Now
              </>
            )}
          </button>
          
          {asset?.availableQuantity < 1 && (
            <p className="text-error text-center text-sm">This item is out of stock.</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AssignAsset;
import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const packages = [
  { name: "Basic", employeeLimit: 5, price: 5 },
  { name: "Standard", employeeLimit: 10, price: 8 },
  { name: "Premium", employeeLimit: 20, price: 15 },
];

const UpgradePackage = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const handlePayment = async () => {
    if (!selectedPackage) return;

    const res = await axiosSecure.post("/create-package-checkout-session", {
      packageName: selectedPackage.name,
      price: selectedPackage.price,
      employeeLimit: selectedPackage.employeeLimit,
      email: user?.email,
    });

    window.location.assign(res.data.url);
  };

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      <h2 className="text-4xl font-extrabold text-secondary text-center mb-12">
        Upgrade Subscription
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages.map((pkg) => (
          <div 
            key={pkg.name} 
            className={`card rounded-2xl p-6 shadow-lg border-2 transition-transform duration-300 hover:scale-105 ${
              selectedPackage?.name === pkg.name 
                ? "border-primary bg-base-200" 
                : "border-base-300 bg-base-100"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-secondary">{pkg.name}</h3>
              {selectedPackage?.name === pkg.name && (
                <FaCheckCircle className="text-accent w-6 h-6" />
              )}
            </div>
            <p className="text-4xl font-extrabold text-primary mb-2">${pkg.price}</p>
            <p className="text-neutral mb-6">Limit: {pkg.employeeLimit} Employees</p>
            <button 
              onClick={() => setSelectedPackage(pkg)} 
              className={`btn w-full py-2 text-lg font-bold ${
                selectedPackage?.name === pkg.name 
                  ? "btn-primary text-white shadow-lg shadow-primary/30" 
                  : "btn-outline btn-secondary"
              }`}
            >
              {selectedPackage?.name === pkg.name ? "Selected" : "Select"}
            </button>
          </div>
        ))}
      </div>

      {selectedPackage && (
        <div className="text-center mt-12">
          <button 
            onClick={handlePayment} 
            className="btn btn-primary btn-lg px-10 py-3 shadow-lg shadow-primary/30 text-xl font-bold"
          >
            Pay ${selectedPackage.price} Now
          </button>
        </div>
      )}
    </div>
  );
};

export default UpgradePackage;

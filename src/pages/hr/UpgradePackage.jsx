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

    console.log(selectedPackage.name ," + ", selectedPackage.price, " ", selectedPackage.employeeLimit)
      const res = await axiosSecure.post("/create-package-checkout-session", {
        packageName: selectedPackage.name,
        price: selectedPackage.price,
        employeeLimit: selectedPackage.employeeLimit,
        email: user?.email,
      });

      window.location.assign(res.data.url);
  };

  return (
    <div className="p-6">
      <h2 className="text-4xl font-bold text-center mb-10">Upgrade Subscription</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages.map((pkg) => (
          <div 
            key={pkg.name} 
            className={`card shadow-xl border-2 p-5 ${selectedPackage?.name === pkg.name ? "border-primary" : "border-base-300"}`}
          >
            <h3 className="text-2xl font-bold">{pkg.name}</h3>
            <p className="text-4xl font-bold">${pkg.price}</p>
            <p>Limit: {pkg.employeeLimit} Employees</p>
            <button 
              onClick={() => setSelectedPackage(pkg)} 
              className={`btn mt-6 ${selectedPackage?.name === pkg.name ? "btn-primary" : "btn-outline"}`}
            >
              Select
            </button>
          </div>
        ))}
      </div>
      {selectedPackage && (
        <div className="text-center mt-10">
          <button onClick={handlePayment} className="btn btn-primary btn-lg">
            Pay ${selectedPackage.price} Now
          </button>
        </div>
      )}
    </div>
  );
};

export default UpgradePackage;
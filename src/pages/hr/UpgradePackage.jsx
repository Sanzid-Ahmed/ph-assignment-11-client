import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
// import CheckoutForm from "./CheckoutForm"; // We will create this next
import { FaCheckCircle } from "react-icons/fa";

// Load your Stripe public key from .env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const packages = [
  { name: "Basic", employeeLimit: 5, price: 5, features: ["Asset Tracking", "Employee Management", "Basic Support"] },
  { name: "Standard", employeeLimit: 10, price: 8, features: ["All Basic features", "Advanced Analytics", "Priority Support"] },
  { name: "Premium", employeeLimit: 20, price: 15, features: ["All Standard features", "Custom Branding", "24/7 Support"] },
];

const UpgradePackage = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-neutral">Upgrade Your Subscription</h2>
        <p className="text-gray-500 mt-2">Increase your employee limit and unlock premium features.</p>
      </div>

      {/* Package Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {packages.map((pkg) => (
          <div 
            key={pkg.name} 
            className={`card bg-base-100 shadow-xl border-2 transition-all ${
              selectedPackage?.name === pkg.name ? "border-primary scale-105" : "border-transparent"
            }`}
          >
            <div className="card-body">
              <h3 className="card-title text-2xl justify-center text-primary">{pkg.name}</h3>
              <div className="text-center my-4">
                <span className="text-4xl font-bold">${pkg.price}</span>
                <span className="text-gray-500"> /one-time</span>
              </div>
              <p className="text-center font-semibold text-neutral">Up to {pkg.employeeLimit} Employees</p>
              
              <div className="divider"></div>
              
              <ul className="space-y-3 mb-6">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <FaCheckCircle className="text-success" /> {feature}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => setSelectedPackage(pkg)}
                className={`btn ${selectedPackage?.name === pkg.name ? "btn-primary" : "btn-outline btn-primary"}`}
              >
                {selectedPackage?.name === pkg.name ? "Selected" : "Choose Plan"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Stripe Payment Section */}
      {selectedPackage && (
        <div className="max-w-md mx-auto card bg-base-200 shadow-inner p-8 border border-base-300 animate-fade-in">
          <h3 className="text-xl font-bold mb-4 text-center">Complete Payment for {selectedPackage.name}</h3>
          <p className="text-center text-sm mb-6 text-gray-600">
            Total Amount: <span className="font-bold text-neutral">${selectedPackage.price}.00</span>
          </p>
          
          <Elements stripe={stripePromise}>
            <CheckoutForm selectedPackage={selectedPackage} />
          </Elements>
        </div>
      )}
    </div>
  );
};

export default UpgradePackage;
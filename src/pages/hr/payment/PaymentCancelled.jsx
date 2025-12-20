import React from "react";
import { Link } from "react-router-dom";

const PaymentCancelled = () => {
  return (
    <div className="text-center p-10">
      <h2 className="text-3xl text-error">Payment Cancelled</h2>
      <Link to="/upgrade">
        <button className="btn btn-primary mt-6">Try Again</button>
      </Link>
    </div>
  );
};

export default PaymentCancelled;

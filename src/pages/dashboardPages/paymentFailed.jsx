import React from "react";
import { useNavigate } from "react-router-dom";
import {  CircleX } from "lucide-react";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center mt-20  px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        {/* Success Icon */}
        <CircleX  className="w-20 h-20 text-red-500 mx-auto mb-4" />

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Failed!
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
         Oops! Your payment could not be processed. ❌ <br />
  Please try again or use a different payment method.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full cursor-pointer py-3 bg-hollywood-600 hover:bg-hollywood-700 text-white font-medium rounded-xl transition"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PaymentFailed
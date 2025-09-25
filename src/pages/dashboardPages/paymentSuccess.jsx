import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { createOrder } from "../../hooks/useOrder";
import { useEffect } from "react";
import { Loader } from "@mantine/core";

const PaymentSuccess = () => {
  const navigate = useNavigate();
 const { isPending, mutateAsync } = createOrder();
   const location = useLocation();

  // Get the query string
  const queryParams = new URLSearchParams(location.search);
  const dataParam = queryParams.get("data");

  // Parse it back to an object
//   let paymentData = null;
//   try {
//     paymentData = dataParam ? JSON.parse(decodeURIComponent(dataParam)) : null;
//   } catch (err) {
//     console.error("Error parsing payment data:", err);
//   }
// console.log(paymentData);

// useEffect(()=>{
// if (paymentData){
//     mutateAsync(paymentData)
// }
// },[])

  return (
    <div className="flex items-center justify-center mt-20  px-4">
        {isPending ? 
        <div>
            <Loader/>
        </div> : 
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        {/* Success Icon */}
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Thank you for your payment. Your transaction has been completed
          successfully. 🎉
        </p>

        {/* CTA Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full cursor-pointer py-3 bg-hollywood-600 hover:bg-hollywood-700 text-white font-medium rounded-xl transition"
        >
          Go to Dashboard
        </button>
      </div>
        }
    </div>
  );
};

export default PaymentSuccess;

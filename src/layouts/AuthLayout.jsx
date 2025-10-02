import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Banner from "../components/auth/banner";
// import { useAuthContext } from "../contexts/AuthContext";

const AuthLayout = () => {
  const navigate = useNavigate();

//   const { isAuthenticated, isLoading } = useAuthContext();
  // console.log(isAuthenticated);
  
//   useEffect(() => {
//     // Only redirect if we're sure the user is authenticated (not loading)
//     if (isAuthenticated && !isLoading) {
//       navigate("/dashboard");
//     }
//   }, [isAuthenticated, isLoading, navigate]);
  return (
  <div className="flex h-screen justify-center items-center bg-gradient-to-b from-hollywood-700 to-white">
 
  <div className="bg-white rounded-lg shadow-2xl mx-2 md:mx-0 md:w-[60%] w-full">
    <Outlet />
  </div>
</div>

  );
};

export default AuthLayout;
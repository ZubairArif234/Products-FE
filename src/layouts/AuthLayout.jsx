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
  <div className=" grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
  <div className="hidden lg:block xl:col-span-2">
    <Banner />
  </div>
  <div>
    <Outlet />
  </div>
</div>

  );
};

export default AuthLayout;
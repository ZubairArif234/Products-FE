import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../services/hooks";

const AuthRoute = ({ Component }) => {
  const isAuthenticated = useAuth();
  console.log(isAuthenticated);
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  } else {
    return <Component />;
  }
};
export default AuthRoute;
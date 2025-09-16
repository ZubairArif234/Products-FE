import React from "react";
import { Navigate } from "react-router-dom";
import { userGetRole, useAuth } from "../services/hooks";

const AdminRoute = ({ Component }) => {
  const isAuthenticated = useAuth();
  const role = userGetRole();
  console.log(isAuthenticated, role);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  } else {
    // if (role === "admin") {
      return <Component />;
    // } else {
    //   return <Navigate to="/not-found" />;
    // }
  }
};

export default AdminRoute;
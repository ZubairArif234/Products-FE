import React from "react";
import { Navigate } from "react-router-dom";
import { userGetRole, useAuth } from "../services/hooks";

const UserRoute = ({ Component }) => {
  const isAuthenticated = useAuth();
  const role = userGetRole();
  console.log(isAuthenticated, role);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  } else {
    if (role === "user") {
      return <Component />;
    } else {
      return <Navigate to="/not-found" />;
    }
  }
};

export default UserRoute;
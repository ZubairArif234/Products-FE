import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/landingPages/home";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Login from "../pages/authPages/Login";
import SignupForm from "../components/auth/signupForm";
import EmailVerification from "../components/auth/emailVerification";
import ForgotPassword from "../components/auth/forgotPassword";
import VerifyForgotEmail from "../components/auth/verifyForgotEmail";
import ResetPassword from "../components/auth/resetPassword";
import Products from "../pages/dashboardPages/products";
import AdminRoute from "./AdminRoute";
import AuthRoute from "./AuthRoute";
import Checkout from "../pages/dashboardPages/checkout";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<AuthLayout />}>
        <Route path="/" element={<AuthRoute Component={Login} />} />
        <Route path="/signup" element={<AuthRoute Component={SignupForm} />} />
         <Route
          path="/email-verification/:email"
          element={<AuthRoute Component={EmailVerification} />}
        />
        <Route path="/forgot-password" element={<AuthRoute Component={ForgotPassword} />} />
        <Route path="/verify-email/:email" element={<AuthRoute Component={VerifyForgotEmail} />} />
        <Route path="/reset-password/:email/:otp" element={<AuthRoute Component={ResetPassword} />} />
       </Route>
        <Route path="/dashboard" element={<DashboardLayout />}>

        <Route path="/dashboard" element={<AdminRoute Component={Products} />} />
        <Route path="/dashboard/checkout" element={<AdminRoute Component={Checkout} />} />
       </Route>
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;

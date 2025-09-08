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

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<AuthLayout />}>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignupForm />} />
         <Route
          path="/email-verification/:email"
          element={<EmailVerification />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email/:email" element={<VerifyForgotEmail />} />
        <Route path="/reset-password/:email/:otp" element={<ResetPassword />} />
       </Route>
        <Route path="/dashboard" element={<DashboardLayout />}>

        <Route path="/dashboard/products" element={<Products />} />
       </Route>
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;

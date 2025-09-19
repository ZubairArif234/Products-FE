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
import ProductManagement from "../pages/adminPages/ProductManagement";
import Orders from "../pages/dashboardPages/order";
import OrdersManagement from "../pages/adminPages/orderManagement";
import WarehouseManagements from "../pages/adminPages/warehouseManagements";
import WarehouseDetails from "../pages/adminPages/warehouseDetails";
import ShippingOrders from "../pages/dashboardPages/shipping";
import ProfileSettings from "../pages/dashboardPages/profileSetting";
import CustomerManagement from "../pages/adminPages/customerManagemet";
import CustomerDetails from "../pages/adminPages/customerDetails";

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
{/* user dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>

        <Route path="/dashboard" element={<AdminRoute Component={Products} />} />
        <Route path="/dashboard/checkout" element={<AdminRoute Component={Checkout} />} />
        <Route path="/dashboard/order" element={<AdminRoute Component={Orders} />} />
        <Route path="/dashboard/shipping" element={<AdminRoute Component={ShippingOrders} />} />
        <Route path="/dashboard/setting" element={<AdminRoute Component={ProfileSettings} />} />
       </Route>
{/* admin dashboard */}
        <Route path="/admin" element={<DashboardLayout />}>

        <Route path="/admin" element={<AdminRoute Component={ProductManagement} />} />
        <Route path="/admin/orders" element={<AdminRoute Component={OrdersManagement} />} />
        <Route path="/admin/warehouse" element={<AdminRoute Component={WarehouseManagements} />} />
        <Route path="/admin/warehouse-details" element={<AdminRoute Component={WarehouseDetails
        } />} />
        <Route path="/admin/customer" element={<AdminRoute Component={CustomerManagement} />} />
        <Route path="/admin/customer-details" element={<AdminRoute Component={CustomerDetails} />} />
        </Route>
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;

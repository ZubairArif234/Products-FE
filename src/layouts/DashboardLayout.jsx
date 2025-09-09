import React, { useEffect, useMemo } from "react";
import Sidebar from "../components/layout/sidebar";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import Navbar from "../components/layout/navbar";
import Footer from "../components/layout/footer";
import { useDisclosure } from "@mantine/hooks";
import { useGetUserProfile } from "../hooks/useGetUserProfile";
// import { useColorScheme } from "../contexts/ColorSchemeContext";
import { cn } from "../utils/cn";
// import Loader from "../components/common/Loader";
import { useAuthContext } from "../contexts/AuthContext";
// import BarLoader from "react-spinners/BarLoader";
const DashboardLayout = () => {
  const { pathname } = useLocation();
  const [opened, { toggle }] = useDisclosure();
  
  // Use the centralized authentication context
  const { isAuthenticated, isLoading: authLoading } = useAuthContext();
  
  // If not authenticated, redirect to login immediately
  // if (!isAuthenticated) {
  //   // Clear any remaining data to ensure clean logout
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("ownerToken");
  //   localStorage.removeItem("user");
  //   return <Navigate to="/" replace />;
  // }
  
  const { isPending, isError, error } = useGetUserProfile();
  
  // Only redirect to login for actual authentication errors (401, 403)
  // Don't redirect for network errors or server errors
  // if (isError && error?.response && (error.response.status === 401 || error.response.status === 403)) {
  //   // Clear invalid tokens
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("ownerToken");
  //   localStorage.removeItem("user");
  //   window.dispatchEvent(new Event('authChange'));
  //   return <Navigate to="/" replace />;
  // }
  
  // If there's a network error but we have cached user data, continue with cached data
  const cachedUser = localStorage.getItem("user");
  if (isError && !error?.response && cachedUser) {
    console.log("Using cached user data due to network error");
  }
  
  // Safely use ColorScheme context with fallback
//   let colorScheme = 'light';
//   try {
//     const context = useColorScheme();
//     colorScheme = context.colorScheme;
//   } catch (error) {
//     // Context not available, use system preference
//     colorScheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
//   }

  // Close sidebar when route changes (on mobile)
  useEffect(() => {
    if (opened) {
      toggle();
    }
  }, [pathname]);
  const isDark = false

  return (
    <>
      {/* {authLoading || isPending ? (
        <div className={cn(
          "min-h-screen flex items-center justify-center",
          isDark ? "bg-[#1d1e30]" : "bg-slate-100"
        )}>
            loading
         
        </div>
      ) : ( */}
        <div className="grid grid-cols-1 xl:grid-cols-5 relative duration-700 h-screen ">
          <Sidebar opened={opened} toggle={toggle} />
          <div
            className={cn(
              "xl:col-span-4 bg-slate-100 duration-700",
              isDark ? "bg-[#1d1e30]" : "bg-slate-100"
            )}
          >
            <Navbar opened={opened} toggle={toggle} />
            <div className="lg:min-h-[76vh] lg:max-h-[76vh] overflow-auto mx-3  ">
              <Outlet />
            </div>
            {/* <Footer /> */}
          </div>
          {/* <AiChatBox /> */}
        </div>
    {/* //   )} */}
    </>
  );
};

export default DashboardLayout;
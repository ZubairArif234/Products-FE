import React from "react";
// import authBanner from "/assets/authBanner.png";
import DashboardLogo from "../../assets/logo.png"
const Banner = () => {
  return (
  <div className="relative h-screen w-full">
  {/* Background image */}
  <img
    src="https://plus.unsplash.com/premium_photo-1683141052679-942eb9e77760?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    className="h-screen w-full object-cover"
    alt="background"
  />

  {/* Orange overlay */}
  <div className="absolute inset-0 bg-hollywood-700 opacity-50"></div>

  {/* Content on top */}
  <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold">
   <div className="bg-white p-4 rounded-lg">

    <img
                     src={DashboardLogo}
                     alt="Default Dashboard Logo"
                     className="aspect-auto"
                     width={250}
                     />
                     </div>
  </div>
</div>

  );
};

export default Banner;
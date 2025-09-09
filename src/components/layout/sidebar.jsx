import React, { useEffect, useState } from "react";
// import DashboardLogo from "/assets/dashboard-logo.png";
import { Accordion, Burger, Divider } from "@mantine/core";
import { Link, useLocation } from "react-router-dom";
// import { useGetAllWebsiteSettings } from "../../hooks/useWebsite";
// import { useGetUserProfile } from "../../hooks/useGetUserProfile";
// import { MonthlyExpenseIcon, ZeroBasedBudgetIcon } from "../../customIcons";

const menu = [
  {
    id: 0,
    label: "Main Menu",
    type: "label",
    role: "admin",
  },
  
  
  {
    id: 15, 
    label: "Dashboard",
    link: "/dashboard",
    type: "route",
    role: "admin",
  },
  {
    id: 16,
    label: "Brands",
    link: "/dashboard/brands",
    type: "route",
    role: "admin",
  },
  {
    id: 17,
    label: "Products",
    link: "/dashboard/products",
    type: "route",
    role: "admin",
  },
  
];

const Sidebar = ({ opened, toggle }) => {
  // Use fresh user data from API instead of localStorage only
//   const { data: userProfile } = useGetUserProfile();
  // const user =  JSON.parse(localStorage?.getItem("user"));
  
  
  // Normalize subscription type to handle yearly/monthly variations
  // Convert "pro", "pro-yearly", "pro_yearly", "enterprise", "enterprise-yearly", "enterprise_yearly", "lifetime" etc. to base type

  

  const [logoUrl, setLogoUrl] = useState(null);

  // Fetch website settings to get logo URL
//   const { websiteSettings, isLoading } = useGetAllWebsiteSettings();

//   useEffect(() => {
//     if (websiteSettings && websiteSettings.logo) {
//       setLogoUrl(websiteSettings.logo);
//     }
//   }, [websiteSettings]);

  const { pathname } = useLocation();
  return (
    <div
      className={
        !opened
          ? "w-xs lg:w-80 md:h-full xl:w-full h-screen absolute z-10 xl:static -translate-x-[21rem] xl:translate-x-0 duration-700 shadow-xl "
          : "w-xs lg:w-80 xl:w-full h-screen absolute z-50 xl:static duration-700 "
      }
    >
      <div className="relative bg-[url(/public/assets/sidebar.png)] bg-cover bg-left bg-full h-full w-full">
        <Burger
          className="absolute xl:hidden right-3 top-3"
          color="#fff"
          opened={opened}
          onClick={toggle}
          aria-label="Toggle navigation"
        />
        <div className="flex items-center justify-center py-8">
          <Link to={"/dashboard"}>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Dashboard Logo"
                width={220}
                className="object-contain"
              />
            ) : (
            //   <img
            //     src={DashboardLogo}
            //     alt="Default Dashboard Logo"
            //     width={220}
            //   />
            <p>logo</p>
            )}
          </Link>
        </div>
        <Divider color="#FFFFFF1F" />
       <div>
       {menu.map((item, i) => (
  item?.type === "route" ? (
    <Link
      key={i}
      to={item?.link}
      className={
        pathname === item?.link
          ? "my-1 flex gap-4 px-4 items-center font-medium text-white p-3 bg-purple-400 border-l-6 border-l-[#572C84]"
          : "flex gap-4 px-4 items-center text-black hover:text-white p-3 hover:bg-purple-400 border-l-6 border-transparent hover:border-l-[#572C84]"
      }
    >
      <span>{item?.icon}</span>
      {item?.label}
    </Link>
  ) : item?.type === "label" ? (
    <p
      key={i}
      className="text-purple-800 px-14 mt-4 mb-2 text-sm"
    >
      {item?.label}
    </p>
  ) : null
))}

       </div>
      </div>
    </div>
  );
};

export default Sidebar;
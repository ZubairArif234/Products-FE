import {
  Avatar,
  Burger,
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";
import React, { useState, useEffect } from "react";
// import { FaBell, FaMoon, FaSun } from "react-icons/fa";
// import { IoEye, IoEyeOffSharp, IoWallet } from "react-icons/io5";
import ProfileMenu from "./profileMenu";
import { Link, useLocation } from "react-router-dom";
// import { useGetMyWallet } from "../../hooks/useWallet";
// PLAID INTEGRATION TEMPORARILY DISABLED
// import { useGetMyAccounts } from "../../hooks/usePlaid";
import { cn } from "../../utils/cn";
// import { useColorScheme } from "../../contexts/ColorSchemeContext";
import DashboardLogo from "../../assets/logo.png"
import { userGetRole } from "../../services/hooks";
export const Wallet = () => {
  const { wallet } = useGetMyWallet();
  // PLAID INTEGRATION TEMPORARILY DISABLED
  // const { accounts } = useGetMyAccounts();
  const [accountSum, setAccountSum] = useState(0);
//   const { colorScheme } = useColorScheme();

  // PLAID INTEGRATION TEMPORARILY DISABLED
  // useEffect(() => {
  //   if (accounts?.length > 0) {
  //     const totalSum = accounts?.reduce((acc, item) => {
  //       const accountSum = item?.accounts?.reduce((subAcc, single) => {
  //         return subAcc + (single?.balances?.current ?? 0);
  //       }, 0);
  //       return acc + accountSum;
  //     }, 0);

  //     setAccountSum(totalSum);
  //   }
  // }, [accounts]);

  const [isShown, setIsShown] = useState(false);
  const isDark = false

  const handleSwitchShownState = () => {
    setIsShown(!isShown);
  };
  return (
    <div
      className={cn(
        "items-center hidden gap-3 px-6 py-3 border md:flex bg-slate-100 rounded-xl border-slate-300",
        isDark ? "bg-[#1d1e30]" : "bg-slate-100"
      )}
    >
      <IoWallet size={24} color="#21BED7" />
      <p className="text-xl font-semibold min-w-[130px]">
        {isShown
          ? `$ ${Math.round((wallet?.amount || 0) + (accountSum || 0)).toLocaleString()}`
          : "*******"}
      </p>
      {isShown ? (
        <IoEyeOffSharp
          size={20}
          color="#7184B4"
          cursor="pointer"
          onClick={handleSwitchShownState}
        />
      ) : (
        <IoEye
          size={20}
          color="#7184B4"
          cursor="pointer"
          onClick={handleSwitchShownState}
        />
      )}
    </div>
  );
};

const Navbar = ({ opened, toggle }) => {
  const location = useLocation();
  const role = userGetRole()
  // const { setColorScheme, colorScheme } = useMantineColorScheme();
  // const computedColorScheme = useComputedColorScheme("light");

  const menu = [
  
  
  {
    id: 15, 
    label: "Master Catalouge",
    link: "/dashboard",
    type: "route",
    role: "user",
  },
  {
    id: 16,
    label: "Purchase Order & Invoice",
    link: "/dashboard/order",
    type: "route",
    role: "user",
  },
  {
    id: 17,
    label: "Shipping Hub",
    link: "/dashboard/shipping",
    type: "route",
    role: "user",
  },
  {
    id: 18,
    label: "Product Management",
    link: "/admin",
    type: "route",
    role: "admin",
  },
  {
    id: 18,
    label: "Order Management",
    link: "/admin/orders",
    type: "route",
    role: "admin",
  },
  {
    id: 19,
    label: "Warehouse Management",
    link: "/admin/warehouse",
    type: "route",
    role: "admin",
  },
  
];

  let routeName;
  const currentPath = location.pathname;

  if (currentPath === "/dashboard/manage-monthly-expenses" || currentPath.startsWith("/dashboard/add-expense") || currentPath.startsWith("/dashboard/edit-expense")) {
    routeName = "Monthly Expenses";
  } else {
    if (location.pathname?.split("/")[3]?.split("-")?.length === 3) {
      var routeNameArr = location.pathname?.split("/")[3]?.split("-");
    } else if (location.pathname?.split("/")[3]?.split("-")?.length === 2) {
      var routeNameArr = location.pathname?.split("/")[3]?.split("-");
    } else if (location.pathname?.split("/")[2]) {
      var routeNameArr = location.pathname?.split("/")[2]?.split("-");
    } else {
      var routeNameArr = location.pathname?.split("/")[1]?.split("-");
    }
    routeName = routeNameArr?.length > 2
      ? routeNameArr[0] + " " + routeNameArr[1] + " " + routeNameArr[2]
      : routeNameArr?.length > 1
      ? routeNameArr[0] + " " + routeNameArr[1]
      : routeNameArr;
  }

//   const { toggleColorScheme, colorScheme } = useColorScheme();

  const isDark = false
  return (
    <div
      className={cn(
        "h-[12vh] grid grid-cols-4 gap-4 items-center p-2 mx-20 mb-3 bg-white rounded-lg")}
    >
      {/* <div className="flex items-center gap-2">
        <Burger
          className="block xl:hidden"
          opened={opened}
          onClick={toggle}
          aria-label="Toggle Sidebar"
        />
        <div>
          <p className="text-2xl font-medium capitalize">
            {routeName}
          </p>
          <p className="hidden text-sm lg:block ">
            Welcome to website name 
          </p>
        </div>
      </div> */}
      <div>
          <img
                 src={DashboardLogo}
                 alt="Default Dashboard Logo"
                 className="aspect-auto"
                 width={150}
               />
      </div>

      <div className="flex gap-4 justify-center col-span-2">
       {
  menu?.map((item, i) => {
    const isActive = currentPath === item?.link;
if (role == item?.role){

  return (
    <div key={i} className="group cursor-pointer relative">
      <Link
      to={item?.link}
        className={cn(
          "font-medium",
          isActive
            ? "text-hollywood-700"
            : "text-slate-400 group-hover:text-hollywood-700"
        )}
      >
        {item?.label}
      </Link>
      <div
        className={cn(
          "underlined h-1 w-10 absolute rounded-full",
          isActive
            ? "bg-hollywood-600"
            : "bg-transparent group-hover:bg-hollywood-500"
        )}
      />
    </div>
  );
}
  })
}

      </div>
      
      <div className="flex justify-end items-center gap-4">
        {/* <ActionIcon
          variant="outline"
          onClick={toggleColorScheme}
          aria-label="Toggle color scheme"
        >
          {colorScheme === "light" ? <FaMoon size={18} /> : <FaSun size={18} />}
        </ActionIcon> */}
       
        <ProfileMenu />
      </div>
    </div>
  );
};


export default Navbar;
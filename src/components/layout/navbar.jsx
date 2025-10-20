import {
  Avatar,
  Burger,
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  Menu,
  Modal,
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
import { MenuIcon, HelpCircle, InfoIcon, Play } from "lucide-react";
import { useDisclosure } from "@mantine/hooks";
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
  const prepServiceText =[
    {
      id:1,
bold:"If you selected prep",
text:"for your Purchase Order, please upload FNSKU labels after paying your invoice."

    },
    {
      id:2,
bold:"Wait,",
text:"Please allow 10-40 bussiness days for our warehouse to pick,prep, & pack your order. Once packed, the warehouse will post dimensions & you will be notified via email once dimensions are added to the portal."

    },
    {
      id:3,
bold:"You will use the dimensions",
text:"to create a shipment & generate shipment labels via Seller Central You will then upload those labels & the warehouse will dispatch your shipment."

    },
  ]

  const noPrepText = [
    {
      id:1,
bold:"If you did not select prep",
text:"no action is required after paying your invoice."

    },
    {
      id:2,
bold:"Wait,",
text:"Please allow 10-14 business days for our warehouse to pick your order & post dimensions. You will be notified via email once dimensions are added to the portal."

    },
     {
      id:3,
bold:"You will use the dimensions",
text:"to generate shipment labels to you/your warehouse , via your preferred carrier (UPS Fedex, USPS etc). You will then upload those labels & the warehouse will dispatch your shipment."

    },
  ]

  const shipmentText = [
    {
      id:1,
      status:"Upload FNSKU",
      bold:"Upload",
      text:"FNSKU labels for the warehouse to affix to your products."
    },
    {
      id:2,
      status:"Await Warehouse Dims",
      bold:"Now",
      text:"wait for the warehouse to provide dimensions for your products."
    },
    {
      id:3,
      status:"Upload Shipping Labels",
      bold:"Our",
      text:"warehouse has costed dimensions, please use the dimensions to create a shipment & upload labels to the portal."
    },
    {
      id:4,
      status:"Awaiting Pickup",
      bold:"We've",
      text:"received your shipping labels and your products will be picked up by the desihnated carrier."
    },
  ]
  const [openedHelp, { open, close }] = useDisclosure(false);
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
    label: "Products",
    link: "/admin",
    type: "route",
    role: "admin",
  },
  {
    id: 20,
    label: "History",
    link: "/admin/history",
    type: "route",
    role: "admin",
  },
  {
    id: 21,
    label: "Orders",
    link: "/admin/orders",
    type: "route",
    role: "admin",
  },
  {
    id: 19,
    label: "Warehouses",
    link: "/admin/warehouse",
    type: "route",
    role: "admin",
  },
  {
    id: 22,
    label: "Customers",
    link: "/admin/customer",
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
        "h-[12vh] grid grid-cols-2 md:grid-cols-4 gap-4 items-center p-2 md:mx-20 mx-2 mb-3 bg-white rounded-lg")}
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
        <Link to={role == "admin" ? "/admin" : "/"}>
          <img
                 src={DashboardLogo}
                 alt="Default Dashboard Logo"
                 className="aspect-auto"
                 width={150}
                 />
                 </Link>
      </div>

      <div className="md:flex gap-4 justify-center col-span-2 hidden">
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
            ? "text-hollywood-600"
            : "text-slate-400 group-hover:text-hollywood-600"
        )}
      >
        {item?.label}
      </Link>
      {/* <div
        className={cn(
          "underlined h-1 w-10 absolute rounded-full",
          isActive
            ? "bg-hollywood-600"
            : "bg-transparent group-hover:bg-hollywood-500"
        )}
      /> */}
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
{/* <HelpCircle size={20} onClick={open} className="text-slate-500 cursor-pointer"/> */}
<Modal size={"2xl"} opened={openedHelp} onClose={close} centered title="Shipping Hub Assistance">
      <div className="grid grid-cols-2 gap-4">
{/* prep service */}
        <div className="border-hollywood-700 border-1 rounded-lg p-4">
<p className="text-hollywood-800 text-xl text-center mb-4"><b className="me-2">
   Prep
  </b>
    Service</p>

<div>
{prepServiceText?.map((item)=>{
  return(
    <div key={item?.id} className="flex items-start gap-3">
      <p className="w-7 h-7 rounded-full flex justify-center items-center font-semibold border-2 border-hollywood-700 text-hollywood-700">{item?.id}</p>
      <p className="w-[80%]"><b className="me-1">{item?.bold}</b>{item?.text}</p>
    </div>

  )
})}

   
</div>
        </div>

{/* no prep */}
        <div className="border-hollywood-700 border-1 rounded-lg p-4">
<p className="text-hollywood-800 text-xl text-center mb-4"><b className="me-2">
   No
  </b>
    Prep</p>

<div>
  {noPrepText?.map((item)=>{
    return(

    <div key={item?.id} className="flex items-start gap-3">
     <p className="w-7 h-7 rounded-full flex justify-center items-center font-semibold border-2 border-hollywood-700 text-hollywood-700">{item?.id}</p>
      <p className="w-[80%]"><b className="me-1">{item?.bold}</b>{item?.text}</p>
    </div>
    )
  })}


  
</div>
        </div>

{/* shipment statuses */}
        <div className="border-hollywood-700 border-1 rounded-lg p-4">
<p className="text-hollywood-800 text-xl text-center mb-4"><b className="me-2">
   Shipment
  </b>
    Statuses</p>

<div>
  {shipmentText?.map((item)=>{
    return(

    <div key={item?.id} className="flex items-center gap-3 mb-2">
      <p className={cn(item?.id % 2 ? "bg-red-600" : "bg-gray-500","w-[50%] text-center text-white px-4 py-1 rounded-full")}>{item?.status}</p>
      <p className="w-[50%]"><b className="me-1">{item?.bold}</b>{item?.text}</p>
    </div>

    )
  })}

  
</div>
        </div>
    
    {/* Watch video */}
    <div>

    
        <div className="border-hollywood-700 border-1 rounded-lg p-4">
{/* <p className="text-hollywood-800 text-xl text0center"><b className="me-2">
   No
  </b>
    Prep</p> */}

<div className="flex flex-col gap-2">
<Play/>
  <p className="text-hollywood-700 font-bold">Creating A shipment For Amazon FBA & Uploading Labels to the Portal</p>
  <Link className="mt-4 font-bold">Click to Watch</Link>
</div>
</div>
        </div>
      </div>
      </Modal>

        <div className=" md:hidden">
        <Menu shadow="md" width={200} radius={10} position="bottom-end">
        <Menu.Target>
        <MenuIcon />
     </Menu.Target>

        <Menu.Dropdown>
          {
            menu?.map((item,i)=>{
              if (role == item?.role){

                return(
  
            <Link key={i} to={item?.link} >
              <Menu.Item >
                <span
                  className={cn(
                    "text-[#687CAD]",
                    isDark ? "text-slate-200" : "text-[#687CAD]"
                  )}
                >
                  {item?.label}
                </span>
              </Menu.Item>
            </Link>
                )
              }
            })
          }
       
          
        </Menu.Dropdown>
      </Menu>
        </div>
       
        <ProfileMenu />

      </div>
    </div>
  );
};


export default Navbar;
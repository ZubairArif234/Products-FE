import { Avatar, Button, Divider, Menu, Modal } from "@mantine/core";
import React, { useState } from "react";
// import { FaUser } from "react-icons/fa";
// import { MdMarkEmailRead } from "react-icons/md";
// import { RiLogoutCircleLine } from "react-icons/ri";
// import { MdCancel } from "react-icons/md";
// import defaultProfilePic from "../../../public/assets/profile.png";
import { Link, useNavigate } from "react-router-dom";
import { useGetUserProfile } from "../../hooks/useGetUserProfile";
import { cn } from "../../utils/cn";
// import { useColorScheme } from "../../contexts/ColorSchemeContext";
import { useAuthContext } from "../../contexts/AuthContext";

const ProfileMenu = () => {
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
//   const { toggleColorScheme, colorScheme } = useColorScheme();
  const { logout } = useAuthContext();

  const isDark = false;
  const { data: userProfileData, isLoading } = useGetUserProfile();
  // Get user data either from the hook response or from localStorage as fallback
  const userData =
    userProfileData?.data || JSON.parse(localStorage?.getItem("user")) || {};
  const role = userData?.role;
  // console.log(userData, userProfileData);

  // Use profile picture from API if available, otherwise use default
  const profilePic = userData?.profilePic || "";

  const handleLogout = () => {
    // Use centralized logout method
    logout();
    
    setLogoutModalOpen(false);
    // Redirect to login page
    navigate("/");
  };

  return (
    <div className="cursor-pointer">
      <Menu shadow="md" width={200} radius={10} position="bottom-end">
        <Menu.Target>
          <Avatar size={"lg"} src={profilePic} alt="no image here" />
        </Menu.Target>

        <Menu.Dropdown>
          <Link to={role === "admin" ? "/dashboard/profile-setting" : "/dashboard/setting"}>
            <Menu.Item >
              <span
                className={cn(
                  "text-[#687CAD]",
                  isDark ? "text-slate-200" : "text-[#687CAD]"
                )}
              >
                Profile Setting
              </span>
            </Menu.Item>
          </Link>
       
          <Divider my={10} />
          <div className="flex justify-center p-2 ">
            <Button
              size="sm"
              variant="danger"
              w={"100%"}
              radius={10}
            //   onClick={() => setLogoutModalOpen(true)}
              onClick={handleLogout}
              className="!bg-red-500"
            >
             Logout
            </Button>
          </div>
        </Menu.Dropdown>
      </Menu>

      {/* <Modal
        opened={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title=""
        centered
        radius="md"
        size="md"
        withCloseButton={false}
      >
        <div className="p-4">
          <p className="text-3xl font-semibold mb-3">Logout Confirmation</p>
          <p
            className={cn(
              "text-sm",
              isDark ? "text-slate-200" : "text-slate-500"
            )}
          >
            Are you sure you want to logout from your account? You will need to
            login again to access your account.
          </p>

          <div className="flex gap-3 mt-10">
            <Button
              w={"100%"}
              size="md"
              className="!bg-slate-200 !text-slate-500"
              onClick={() => setLogoutModalOpen(false)}
            >
              Cancel
            </Button>

            <Button
              w={"100%"}
              size="md"
              className="!bg-red-500"
              onClick={handleLogout}
            >
              Yes, Logout
            </Button>
          </div>
        </div>
      </Modal> */}
    </div>
  );
};

export default ProfileMenu;
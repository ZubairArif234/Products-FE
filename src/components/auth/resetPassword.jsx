import { Button, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useResetPassword } from "../../hooks/useResetPassword";
import { useUpdatePassword } from "../../hooks/useUpdatePassword";

// Basic check if a string looks like a JWT token (has the format xxx.yyy.zzz)
const isValidJWT = (token) => {
  if (!token) return false;
  const parts = token.split(".");
  return parts.length === 3;
};

const ResetPassword = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const navigate = useNavigate();
  const { email, otp } = useParams();

  // Use the custom hooks
  const { mutateAsync: resetPasswordMutate, isPending: resetPasswordLoading } =
    useResetPassword();
  const {
    mutateAsync: updatePasswordMutate,
    isPending: updatePasswordLoading,
  } = useUpdatePassword();

  useEffect(() => {
    const token = localStorage.getItem("token");
    // console.log("Token from localStorage:", token);

    setIsLoggedIn(!!token);
    setHasToken(!!token);

    if (token) {
      // Log token format information for debugging
      if (!isValidJWT(token)) {
        // console.log(
        //   "Note: Token does not have standard JWT format (header.payload.signature)"
        // );
        // console.log("Using token as-is to maintain backend compatibility");
      } else {
        // console.log("Token has standard JWT format");
      }
    } else {
      // console.log("No token found in localStorage");
    }
  }, []);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      currentPassword: (value) => {
        if (isLoggedIn && value.length < 8) {
          return "Current password must have at least 8 characters";
        }
        return null;
      },
      password: (value) =>
        value.length < 8 ? "Password must have at least 8 characters" : null,

      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords did not match" : null,
    },
  });

  const handleSubmit = async (values) => {
    try {
      if (isLoggedIn) {
        // console.log("Updating password for logged-in user");

        if (!hasToken) {
          setTimeout(() => {
            navigate("/login");
          }, 1500);
          return;
        }

        // Use the updatePassword hook instead of direct API call
        const response = await updatePasswordMutate({
          currentPassword: values.currentPassword,
          password: values.password,
        });
      } else {
        // console.log("Resetting password for non-logged-in user");
        // console.log("Email:", email, "OTP:", otp);

        // Use the resetPassword hook instead of direct API call
        const response = await resetPasswordMutate({
          email: email,
          otp: otp,
          password: values.password,
        });
      }

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {}
  };

  // Use the combined loading state from both hooks and local state
  const isSubmitting = resetPasswordLoading || updatePasswordLoading;

  return (
    <div className="px-2 md:px-20 py-10 flex flex-col justify-start h-screen">
      <div className="flex gap-4 items-center justify-center">
        {!isLoggedIn && (
          <>
            <p className="text-md text-slate-600">Don't have an account?</p>
            <Link to={"/signup"}>
              <Button
                variant="secondary"
                size="sm"
                radius="sm"
                className="font-medium !bg-hollywood-700"
              >
                Sign up
              </Button>
            </Link>
          </>
        )}
      </div>
      <div>
        <div className="mt-36">
          <p className="my-4 text-center text-2xl font-medium bg-gradient-to-r from-[#050505] to-[#767676] bg-clip-text text-transparent">
            {isLoggedIn ? "Update" : "Reset"} your{" "}
            <span className="bg-gradient-to-r from-[#6D62C3] to-[#9086E2] bg-clip-text text-transparent">
              Password
            </span>
          </p>
          <p className="font-extralight text-md text-slate-500 mx-6 text-center my-2">
            {isLoggedIn
              ? "Enter your current password and new password below"
              : "Enter your new password below"}
          </p>
          {!isLoggedIn && email && (
            <p className="text-center text-sm font-medium text-purple-700 mt-2">
              Email: {email}
            </p>
          )}
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={form.onSubmit(handleSubmit)}
        >
          {isLoggedIn && (
            <PasswordInput
              size="md"
              radius="md"
              placeholder="Current Password"
              {...form.getInputProps("currentPassword")}
            />
          )}
          <PasswordInput
            size="lg"
            radius="lg"
            placeholder="New Password"
            {...form.getInputProps("password")}
          />
          <PasswordInput
            size="md"
            radius="md"
            placeholder="Confirm New Password"
            {...form.getInputProps("confirmPassword")}
          />
          <Button
            type="submit"
            size="md"
            radius="md"
            w="100%"
            className="!font-medium !bg-hollywood-700"
            loading={isSubmitting}
          >
            {isLoggedIn ? "Update Password" : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
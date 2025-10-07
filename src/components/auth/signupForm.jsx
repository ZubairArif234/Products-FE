import {
  Button,
  Checkbox,
  Divider,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import React, { useState } from "react";
// import { AppleIcon, GoogleIcon } from "../../customIcons";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { useSignup } from "../../hooks/useSignup";
// import { useColorScheme } from "../../contexts/ColorSchemeContext";
import { cn } from "../../utils/cn";
import DashboardLogo from "../../assets/logo.png"

const SignupForm = () => {
  const navigate = useNavigate();
//   const { toggleColorScheme, colorScheme } = useColorScheme();

  const isDark = false;
  const { isPending, mutateAsync } = useSignup();

  const form = useForm({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },

    validate: {
      fullName: (value) =>
        value?.trim()?.length < 1 ? "Please enter your full name." : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 8 ? "Password must have at least 8 characters" : null,
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords did not match" : null,
      terms: (value) =>
        value ? null : "You must need to agree our terms & conditions.",
    },
  });

  const handleSubmit = async (values) => {
    if (!values.terms) {
      return;
    }

    try {
      await mutateAsync(values);
      navigate(`/email-verification/${values.email}`);
    } catch (err) {}
  };

  return (
    <div className="px-2 py-10 md:px-30 md:py-20 flex flex-col justify-between h-2/3 rounded-lg shadow-2xl ">
     {/* <div className="flex gap-4 items-center justify-center">
        <p
          className={cn(
            "text-md",
            isDark ? "text-slate-200" : "text-slate-600"
          )}
        >
          Already, have an account
        </p>
        <Link to={"/"}>
          <Button
            variant="secondary"
            size="sm"
            radius="sm"
            className="font-medium !bg-hollywood-700"
          >
            Sign in
          </Button>
        </Link>
      </div> */}
      <div>
        <div className="mb-10 flex justify-center">
           <img
                                     src={DashboardLogo}
                                     alt="Default Dashboard Logo"
                                     className="aspect-auto"
                                     width={200}
                                   />
          {/* <p className="my-4 text-center text-2xl ">
            <span
              className={cn(
                "font-medium bg-gradient-to-r from-[#050505] to-[#767676] bg-clip-text text-transparent",
                isDark
                  ? "from-[#9b9b9b] to-[#ffffff]"
                  : "from-[#050505] to-[#767676]"
              )}
            >
              Create your
            </span>
            <span className="mx-2 font-medium bg-gradient-to-r from-hollywood-800 to-hollywood-400 bg-clip-text text-transparent">
             Primewell
            </span>
            <span
              className={cn(
                "font-medium bg-gradient-to-r from-[#050505] to-[#767676] bg-clip-text text-transparent",
                isDark
                  ? "from-[#9b9b9b] to-[#ffffff]"
                  : "from-[#050505] to-[#767676]"
              )}
            >
              Account
            </span>
          </p> */}
          {/* <p className="font-extralight text-sm text-slate-500 mx-6 text-center ">
            Welcome to Primewell, please enter sign up details
          </p> */}
        </div>

        <form
          onSubmit={form.onSubmit(handleSubmit)}
          className="flex flex-col gap-4"
        >
           <label className="flex items-center justify-end gap-4">
            <p className=" hidden md:block">Full name</p>
          <TextInput
            size="sm"
            radius="sm"
             className="md:w-[80%] w-full"
            placeholder="Full Name"
            {...form.getInputProps("fullName")}
          />
          </label>
           <label className="flex items-center justify-end gap-4">
            <p className=" hidden md:block">Email</p>
          <TextInput
             size="sm"
            radius="sm"
             className="md:w-[80%] w-full"
            placeholder="Email Address"
            {...form.getInputProps("email")}
          />
          </label>
           <label className="flex items-center justify-end gap-4">
            <p className=" hidden md:block">Password</p>
          <PasswordInput
            size="sm"
            radius="sm"
             className="md:w-[80%] w-full"
            placeholder="Password"
            {...form.getInputProps("password")}
          />
          </label>
           <label className="flex items-center justify-end gap-4">
            <p className=" hidden md:block">Re-Password</p>
          <PasswordInput
           size="sm"
            radius="sm"
             className="md:w-[80%] w-full"
            placeholder="Confirm"
            {...form.getInputProps("confirmPassword")}
          />
          </label>
          <div className="flex flex-wrap justify-between items-center">

        
          <Checkbox
            color="#0391A5"
            label={
              <div>
                <p
                  className={cn(
                    "text-sm",
                    isDark ? "text-slate-200" : "text-slate-500"
                  )}
                >
                  I agree to the{" "}
                  <span className="text-purple-600 underline cursor-pointer">
                    Terms & Conditions
                  </span>{" "}
                  and{" "}
                  <span className="text-purple-600 underline cursor-pointer">
                    {" "}
                    Privacy Policy{" "}
                  </span>
                </p>
              </div>
            }
            {...form.getInputProps("terms")}
          />
          <p className="text-slate-700 text-sm">Already have an account? <Link to={"/"} className="text-hollywood-700 font-semibold">Login</Link></p>
     </div>
       <div className="mt-8 flex justify-center">

          <Button
            type="submit"
            size="md"
            radius="md"
            w="60%"
            className="!font-medium !bg-hollywood-700"
            // loading={isPending}
          >
            Sign up
          </Button>
          </div>
        </form>

        {/* <Divider my="lg" size="md" label="OR" labelPosition="center" />

        <div className="flex justify-center items-center gap-4">
          <Button variant="secondary" size="lg" radius="md" w="100%">
            <GoogleIcon /> <span className="ms-2 font-medium">Google</span>
          </Button>
          <Button variant="secondary" size="lg" radius="md" w="100%">
            <AppleIcon /> <span className="ms-2 font-medium">Apple</span>
          </Button>
        </div> */}
      </div>
    </div>
  );
};

export default SignupForm;
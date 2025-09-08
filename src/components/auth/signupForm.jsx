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
    <div className="px-2 md:px-20 py-10 flex flex-col justify-between h-screen">
      <div className="flex gap-4 items-center justify-center">
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
            className="font-medium !bg-purple-500"
          >
            Sign in
          </Button>
        </Link>
      </div>
      <div>
        <div className="mb-10">
          <p className="my-4 text-center text-2xl ">
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
            <span className="mx-2 font-medium bg-gradient-to-r from-[#6D62C3] to-[#9086E2] bg-clip-text text-transparent">
              Website name
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
          </p>
          <p className="font-extralight text-sm text-slate-500 mx-6 text-center ">
            Welcome to Imagitive, please enter sign up details
          </p>
        </div>

        <form
          onSubmit={form.onSubmit(handleSubmit)}
          className="flex flex-col gap-4"
        >
          <TextInput
            size="md"
            radius="md"
            placeholder="Full Name"
            {...form.getInputProps("fullName")}
          />
          <TextInput
            size="md"
            radius="md"
            placeholder="Email Address"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            size="md"
            radius="md"
            placeholder="Password"
            {...form.getInputProps("password")}
          />
          <PasswordInput
            size="md"
            radius="md"
            placeholder="Confirm"
            {...form.getInputProps("confirmPassword")}
          />
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
          {/* <p className="text-cyan-700 font-medium text-center">Forgot the password?</p> */}
          <Button
            type="submit"
            size="md"
            radius="md"
            w="100%"
            className="!font-medium !bg-purple-500"
            // loading={isPending}
          >
            Sign up
          </Button>
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
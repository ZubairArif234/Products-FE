import { Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForgotPassword } from "../../hooks/useForgotPassword";
// import { useColorScheme } from "../../contexts/ColorSchemeContext";
import { cn } from "../../utils/cn";

const ForgotPassword = () => {
  const navigate = useNavigate();
//   const { toggleColorScheme, colorScheme } = useColorScheme();

  const isDark = false
  const { isPending, mutateAsync } = useForgotPassword();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: { email: "" },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const handleSubmit = async (values) => {
    try {
      await mutateAsync({
        email: values.email,
      });

      navigate(`/verify-email/${values.email}`);
    } catch (err) {
      // console.error("Forgot password error:", err);
    }
  };

  return (
    <div className="px-2 md:px-20 py-10 flex flex-col justify-start h-screen">
      <div className="flex gap-4 items-center justify-center">
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
      </div>
      <div className="mt-36">
        <div className="mb-10">
          <p
            className={cn(
              "my-4 text-center text-2xl font-medium bg-gradient-to-r from-[#050505] to-[#767676] bg-clip-text text-transparent",
              isDark
                ? "from-[#9b9b9b] to-[#ffffff]"
                : "from-[#050505] to-[#767676]"
            )}
          >
            Forgot your{" "}
            <span className="bg-gradient-to-r from-[#6D62C3] to-[#9086E2] bg-clip-text text-transparent">
              Password
            </span>
          </p>
          <p className="font-extralight text-md text-slate-500 mx-6 text-center my-2">
            Welcome to Primewell, please enter your email address below to
            receive the OTP.
          </p>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={form.onSubmit(handleSubmit)}
        >
          <TextInput
            size="md"
            radius="md"
            placeholder="Email Address"
            {...form.getInputProps("email")}
          />

          <Button
            type="submit"
            size="md"
            radius="md"
            w="100%"
            className="!font-medium !bg-hollywood-700 "
            loading={isPending}
          >
            Send OTP
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

import { Button, PinInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useVerifyEmail } from "../../hooks/useVerifyEmail";

import DashboardLogo from "../../assets/logo.png"
const EmailVerification = () => {
  const navigate = useNavigate();
  const { email } = useParams();
  const { isPending, mutateAsync } = useVerifyEmail();

  const form = useForm({
    initialValues: { otp: "" },
    validate: {
      otp: (value) =>
        value.length < 6 ? "OTP must have at least 6 numbers" : null,
    },
  });

  const handleSubmit = async (values) => {
    try {
      await mutateAsync({
        email: email,
        otp: values.otp,
      });

      navigate(`/`);
    } catch (err) {
      // console.log("Email verification error:", err);
    }
  };

  return (
  <div className="px-2 py-10 md:px-30 md:py-20 flex flex-col justify-between h-2/3 rounded-lg shadow-2xl ">
      {/* <div className="flex gap-4 items-center justify-center">
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
      </div> */}
      <div className="">
        <div className="mb-10 flex justify-center flex-col items-center">
                   <img
                                  src={DashboardLogo}
                                  alt="Default Dashboard Logo"
                                  className="aspect-auto"
                                  width={200}
                                />
          {/* <p className="my-4 text-center text-2xl font-medium bg-gradient-to-r from-[#050505] to-[#767676] bg-clip-text text-transparent">
            Verify your{" "}
            <span className="bg-gradient-to-r from-[#6D62C3] to-[#9086E2] bg-clip-text text-transparent">
              Email
            </span>
          </p>
          <p className="font-extralight text-md text-slate-500 mx-6 text-center my-2">
            Welcome to Primewell, please enter OTP below to verify your account.
          </p> */}
          {email && (
            <p className="text-center text-sm font-medium text-hollywood-700 mt-2">
              OTP sent to: {email}
            </p>
          )}
        </div>

        <form
          onSubmit={form.onSubmit(handleSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex justify-center">
            <PinInput
              size="md"
              radius="md"
              variant="filled"
              placeholder=""
              length={6}
              {...form.getInputProps("otp")}
            />
          </div>
          <div className="flex text-slate-700 justify-start md:justify-end items-center text-sm">
                      <p>Don't have an account? <Link to={"/signup"} className="text-hollywood-700 font-semibold">Signup</Link></p>
          </div>
          <div className="flex justify-center">

          <Button
            type="submit"
            size="md"
            radius="md"
            w="60%"
            className="!font-medium !bg-hollywood-700"
            loading={isPending}
            >
            Verify Email
          </Button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default EmailVerification;

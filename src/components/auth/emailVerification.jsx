
import { Button, PinInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useVerifyEmail } from "../../hooks/useVerifyEmail";

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
    <div className="px-2 md:px-20 py-10 flex flex-col justify-start h-screen">
      <div className="flex gap-4 items-center justify-center">
        <p className="text-md text-slate-600">Don't have an account?</p>
        <Link to={"/signup"}>
          <Button
            variant="secondary"
            size="sm"
            radius="sm"
            className="font-medium !bg-purple-500"
          >
            Sign up
          </Button>
        </Link>
      </div>
      <div className="mt-36">
        <div className="mb-10">
          <p className="my-4 text-center text-2xl font-medium bg-gradient-to-r from-[#050505] to-[#767676] bg-clip-text text-transparent">
            Verify your{" "}
            <span className="bg-gradient-to-r from-[#6D62C3] to-[#9086E2] bg-clip-text text-transparent">
              Email
            </span>
          </p>
          <p className="font-extralight text-md text-slate-500 mx-6 text-center my-2">
            Welcome to Imagitive, please enter OTP below to verify your account.
          </p>
          {email && (
            <p className="text-center text-sm font-medium text-purple-700 mt-2">
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
          <Button
            type="submit"
            size="md"
            radius="md"
            w="100%"
            className="!font-medium !bg-purple-500"
            loading={isPending}
          >
            Verify Email
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerification;

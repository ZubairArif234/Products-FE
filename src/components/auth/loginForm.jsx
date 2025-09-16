import { Button, Divider, PasswordInput, TextInput } from "@mantine/core";
import React, { useEffect, useState } from "react";
// import { AppleIcon, GoogleIcon } from "../../customIcons";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { useLogin } from "../../hooks/useLogin";
// import { useColorScheme } from "../../contexts/ColorSchemeContext";
import { cn } from "../../utils/cn";

const LoginForm = () => {
  const [role, setRole] = useState("user");
//   const { toggleColorScheme, colorScheme } = useColorScheme();

//   const isDark = colorScheme === "dark";
  const navigate = useNavigate();
  const { isPending, mutateAsync } = useLogin();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 8 ? "Password must have at least 8 characters" : null,
    },
  });

  // useEffect(() => {
  //   localStorage.setItem("role", role);
  //   form.setValues({
  //     email: role === "admin" ? "admin@gmail.com" : "test4@gmail.com",
  //     password: "Password@123",
  //   });
  // }, [role]);

  const handleSubmit = async (values) => {
  

    try {
      const res = await mutateAsync(values);
      console.log(res);
      
      if (res?.data?.user?.role === "admin"){

          navigate(`/admin`);
        }else{
            navigate(`/dashboard`);

        }
      
    } catch (err) {
      // console.error("Login error:", err);
    }
  };

  return (
    <div className="px-2 md:px-20 py-10 flex flex-col justify-between h-screen ">
      <div className="flex gap-4 items-center justify-center">
        <p
          className={cn(
            "text-md",
            false ? "text-slate-200" : "text-slate-600"
          )}
        >
          Don't have an account?
        </p>
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
      
      <div>
        <div className="mb-10">
          <p className="my-4 text-center text-2xl font-medium ">
            <span
              className={cn(
                " bg-gradient-to-r from-[#050505] to-[#767676] bg-clip-text text-transparent",
                false
                  ? "from-[#9b9b9b] to-[#ffffff]"
                  : "from-[#050505] to-[#767676]"
              )}
            >
              Sign in to{" "}
            </span>
            <span
              className={cn(
                "bg-gradient-to-r from-purple-800 to-purple-400 bg-clip-text text-transparent"
              )}
            >
              website Name
            </span>
          </p>
          <p className="font-extralight text-sm text-slate-600 mx-6 text-center my-2">
            Welcome to Imagitive, please enter login details below to using the
            app.
          </p>
        </div>
        {/* <div className="flex justify-between items-center">
          <p>Select role :</p>
          <div className="flex gap-3">
            <p
              onClick={() => setRole("admin")}
              className={`cursor-pointer ${
                role === "admin" ? "font-medium" : " text-slate-400"
              }`}
            >
              Admin
            </p>
            <p
              onClick={() => setRole("user")}
              className={`cursor-pointer ${
                role === "user" ? "font-medium" : " text-slate-400"
              }`}
            >
              User
            </p>
          </div>
        </div> */}
        <form
          onSubmit={form.onSubmit(handleSubmit)}
          className="flex flex-col gap-4"
        >
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
          <Link
            to={"/forgot-password"}
            className="text-purple-500 font-medium text-center"
          >
            Forgot the password?
          </Link>

          <Button
            type="submit"
            size="md"
            radius="md"
            w="100%"
            className="!font-medium !bg-hollywood-700"
            loading={isPending}
          >
            Login
          </Button>
        </form>

        {/* <Divider my="lg" size="md" label="OR" labelPosition="center" /> */}

        {/* <div className="flex justify-center items-center gap-4">
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

export default LoginForm;
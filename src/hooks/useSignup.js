import { useMutation } from "@tanstack/react-query";
import custAxios from "../configs/axios.config";
import { toast } from "sonner";

// Basic check if a string looks like a JWT token (has the format xxx.yyy.zzz)
const isValidJWT = (token) => {
  if (!token) return false;
  const parts = token.split(".");
  return parts.length === 3;
};

export const useSignup = () => {
  return useMutation({
    mutationFn: async (values) => {
      const res = await custAxios.post("/auth/register", {
        name: values.fullName,
        email: values.email,
        password: values.password,
        provider: "local",
      });

      console.log("Signup API response:", res.data);

      // API response structure: {data: {token: '...', user: {...}}, success: true}
      if (res.data && res.data.data && res.data.data.token) {
        const token = res.data.data.token;

        // Log the received token for debugging
        console.log("Token received from server:", token);

        // Store token regardless of format to maintain compatibility with backend
        localStorage.setItem("token", token);
        console.log("Token stored in localStorage");

        // Optional validation warning for debugging only
        if (!isValidJWT(token)) {
          console.warn(
            "Note: Token does not have standard JWT format (header.payload.signature)"
          );
          console.log(
            "This might cause issues with JWT validation in some parts of the app"
          );
        }
      } else {
        console.log(
          "No token received from signup API - this may be expected depending on the flow"
        );
        console.log("Response structure:", JSON.stringify(res.data));
      }

      return res.data;
    },

    onError: (error) => {
      console.error("Registration error:", error);
      toast.error(error.response.data.message);
      throw error;
    },
  });
};
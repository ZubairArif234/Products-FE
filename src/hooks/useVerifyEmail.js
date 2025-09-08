import { useMutation } from "@tanstack/react-query";
import custAxios from "../configs/axios.config";
import { toast } from "sonner";

// Basic check if a string looks like a JWT token (has the format xxx.yyy.zzz)
const isValidJWT = (token) => {
  if (!token) return false;
  const parts = token.split(".");
  return parts.length === 3;
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: async (values) => {
      const res = await custAxios.post("/auth/verifyEmail", {
        email: values.email,
        otp: values.otp,
      });

      console.log("Email verification API response:", res.data);

      return res.data;
    },
    onSuccess: () => {
      toast.success("Email verified successfully");
    },
    onError: (error) => {
      console.error("Email verification error:", error);
      toast.error(error.response.data.message);
      throw error;
    },
  });
};
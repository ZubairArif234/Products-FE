import { useMutation } from "@tanstack/react-query";
import custAxios from "../configs/axios.config";
import { toast } from "sonner";
import { errorMessage, successMessage } from "../lib/toast";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (values) => {
      const res = await custAxios.post("/auth/login", values);
console.log(res.data);

      if (res.data && res.data.data && res.data.data.token) {
        const token = res.data.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(res.data.data.user));
        
        
      } else {
        console.log("Response structure:", JSON.stringify(res.data));
      }
      return res.data;
    },

    onError: (error) => {
      console.error("Login error:", error);
      // Check for email verification error
      errorMessage(error.response.data.message);
      throw error;
    },
  });
};
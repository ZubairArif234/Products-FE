import { useMutation } from "@tanstack/react-query";
import custAxios from "../configs/axios.config";
import { toast } from "sonner";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (values) => {
      const res = await custAxios.post("/auth/login", values);

      if (res.data && res.data.data && res.data.data.token) {
        const token = res.data.data.token;
        const ownerToken = res.data.data.ownerToken;

        localStorage.setItem("token", token);
        
        // Only set ownerToken if it exists and is not undefined
        if (ownerToken && ownerToken !== undefined) {
          localStorage.setItem("ownerToken", ownerToken);
        } else {
          localStorage.removeItem("ownerToken"); // Remove any existing ownerToken
        }
        
        localStorage.setItem("user", JSON.stringify(res.data.data.user));
        
        // Dispatch custom event to notify components about authentication change
        window.dispatchEvent(new Event('authChange'));
      } else {
        console.log("Response structure:", JSON.stringify(res.data));
      }

      return res.data;
    },

    onError: (error) => {
      console.error("Login error:", error);
      // Check for email verification error
      toast.error(error.response.data.message);
      throw error;
    },
  });
};
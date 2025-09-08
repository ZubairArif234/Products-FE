import { useMutation } from "@tanstack/react-query";
import custAxios from "../configs/axios.config";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (values) => {
      const res = await custAxios.post("/auth/forgotPassword", {
        email: values.email
      });
      
      return res.data;
    },
    
    onError: (error) => {
      console.error("Forgot password error:", error);
      throw error;
    }
  });
}; 
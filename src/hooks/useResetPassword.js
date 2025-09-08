import { useMutation } from "@tanstack/react-query";
import custAxios from "../configs/axios.config";

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (values) => {
      // For non-logged in users who want to reset password using OTP
      const res = await custAxios.put("/auth/resetPassword", {
        email: values.email,
        passwordResetToken: values.otp,
        password: values.password
      });
      
      console.log("Password reset API response:", res.data);
      
      return res.data;
    },
    
    onError: (error) => {
      console.error("Password reset error:", error);
      throw error;
    }
  });
}; 
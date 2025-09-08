import { useMutation } from "@tanstack/react-query";
import custAxios, { attachToken } from "../configs/axios.config";

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: async (values) => {
      // For logged-in users who want to update their password
      // Attach token for authorization
      attachToken();
      
      console.log("Authorization header:", custAxios.defaults.headers.common["Authorization"]);
      
      const res = await custAxios.put("/auth/updatePassword", {
        currentPassword: values.currentPassword,
        newPassword: values.password
      });
      
      console.log("Password update API response:", res.data);
      
      return res.data;
    },
    
    onError: (error) => {
      console.error("Password update error:", error);
      
      // Special handling for unauthorized error
      if (error.response && error.response.status === 401) {
        console.log("User is not authorized or token has expired");
      }
      
      // Special handling for incorrect current password
      if (error.response && error.response.data && 
          error.response.data.message === "Current password is incorrect") {
        console.log("Current password is incorrect");
      }
      
      throw error;
    }
  });
}; 
import { useQuery } from "@tanstack/react-query";
import custAxios, { attachToken } from "../configs/axios.config";

export const useGetUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      // Use the proper attachToken function to ensure correct format
      attachToken();
      
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await custAxios.get("/auth/me");

      // Get user data from response
      const userData = res?.data?.data?.user || res?.data;

      // Store complete user data including profilePic in localStorage
      localStorage.setItem("user", JSON.stringify(res.data.data.user));

      return {
        success: res.data.success,
        data: userData,
      };
    },
    staleTime: 1000 * 60 * 10, // Consider data fresh for 10 minutes
    cacheTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus to reduce API calls
    refetchOnMount: false, // Don't refetch on every mount, use cached data
    refetchOnReconnect: false, // Don't refetch on network reconnect
    retry: 1, // Retry once on failure
    enabled: !!localStorage.getItem("token"), // Only run if token exists
    // Add debounce to prevent rapid API calls
    refetchInterval: false, // Disable automatic refetching

    onError: (error) => {
      console.error("Profile fetch error:", error);

      // Only clear tokens for actual authentication errors (401, 403)
      // Don't clear tokens for network errors or server errors (500)
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log("Authentication error - clearing tokens and redirecting to login");
        localStorage.removeItem("token");
        localStorage.removeItem("ownerToken");
        localStorage.removeItem("user");
        // Dispatch event to notify other components about authentication change
        window.dispatchEvent(new Event('authChange'));
      }

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log("Server error message:", error.response.data.message);
      }

      throw error;
    },
  });
};
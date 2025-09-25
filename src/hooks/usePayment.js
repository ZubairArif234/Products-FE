import { useMutation, useQueryClient } from "@tanstack/react-query";
import custAxios, { attachToken } from "../configs/axios.config";


export const createPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (value) => {
      attachToken();
      const res = await custAxios.post(`/order`, value);
      return res?.data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        // successMessage("Order created successfully");
        // queryClient.invalidateQueries("orders");
      }
    },
    onError: (error) => {
      errorMessage(error?.response?.data?.message);
    },
  });
};
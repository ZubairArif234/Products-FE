import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import custAxios, { attachToken } from "../configs/axios.config";
import {successMessage,errorMessage} from "../lib/toast"

export const useOrders = (filters) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => {
      attachToken();
      const data = await custAxios.get("/order",{
        params: filters,
      });
console.log(data?.data , "order output") ;

      return data?.data;
    },
queryKey: ["orders"],
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: true,
  });
  return { orders: data, ...rest };
};

export const useMyOrders = (filters) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => {
      attachToken();
      const data = await custAxios.get("/order/mine",{
        params: filters,
      });

      return data?.data?.orders;
    },
queryKey: ["order", filters],
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: true,
  });
  return { orders: data, ...rest };
};


export const createOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (value) => {
      attachToken();
      const res = await custAxios.post(`/order`, value);
      return res?.data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        successMessage("Order created successfully");
        queryClient.invalidateQueries("orders");
      }
    },
    onError: (error) => {
      errorMessage(error?.response?.data?.message);
    },
  });
};

export const changeOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (value) => {
      attachToken();
      const res = await custAxios.put(`/order/changeStatus/${value?.id}`, value);
      return res?.data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        successMessage("Order status changed successfully");
        queryClient.invalidateQueries("orders");
      }
    },
    onError: (error) => {
      errorMessage(error?.response?.data?.message);
    },
  });
};
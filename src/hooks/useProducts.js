import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import custAxios, { attachToken, attachTokenWithFormAxios, formAxios } from "../configs/axios.config";
import { errorMessage, successMessage } from "../lib/toast";

export const useProducts = (filters) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => {
      attachToken();
      const data = await custAxios.get("/product",{
        params: filters,
      });

      return data?.data?.data;
    },
queryKey: ["products", filters],
    // staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: true,
  });
  return { products: data, ...rest };
};

// export const useAllProducts = () => {
//   const { data, ...rest } = useQuery({
//     queryFn: async () => {
//       attachToken();
//       const data = await custAxios.get("/product/download");

//       return data?.data?.data;
//     },
// queryKey: ["allProducts"],
//     staleTime: 10 * 60 * 1000,
//     refetchOnWindowFocus: false,
//     retry: true,
//   });
//   return { products: data, ...rest };
// };

export const useAllProducts = () => {
  return useMutation({
    mutationFn: async (filters) => {
      attachToken();
      const res = await custAxios.get("/product/download",{
        params:filters
      });
      return res?.data?.data;
    },
    onError: (error) => {
      errorMessage(error?.response?.data?.message || "Failed to fetch products");
    },
  });
};

export const createProductsByCSV = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (value) => {
      attachTokenWithFormAxios();
      const res = await formAxios.post(`/product/csv`, value);
      return res?.data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        successMessage("Products addedd successfully");
        queryClient.invalidateQueries("products");
      }
    },
    onError: (error) => {
      errorMessage(error?.response?.data?.message);
    },
  });
};

export const updateAllProducts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      attachTokenWithFormAxios();
      const res = await formAxios.get(`/product/update-product`);
      return res?.data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        successMessage("Products updated successfully");
        queryClient.invalidateQueries("products");
      }
    },
    onError: (error) => {
      errorMessage(error?.response?.data?.message);
    },
  });
};
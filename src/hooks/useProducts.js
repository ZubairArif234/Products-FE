import { useQuery } from "@tanstack/react-query";
import custAxios, { attachToken } from "../configs/axios.config";

export const useProducts = (filters) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => {
      attachToken();
      const data = await custAxios.get("/product",{
        params: filters,
      });

      return data?.data?.data?.products;
    },
queryKey: ["products", filters],
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: true,
  });
  return { products: data, ...rest };
};
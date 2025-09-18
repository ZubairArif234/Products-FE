import { useQuery } from "@tanstack/react-query";
import custAxios, { attachToken } from "../configs/axios.config";

export const useWarehouse = (filters) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => {
      attachToken();
      const data = await custAxios.get("/warehouse",{
        params: filters,
      });

      return data?.data?.data;
    },
queryKey: ["warehouse", filters],
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: true,
  });
  return { warehouse: data, ...rest };
};
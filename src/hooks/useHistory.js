import { useQuery } from "@tanstack/react-query";
import custAxios, { attachToken } from "../configs/axios.config";


export const useHistory = (filters) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => {
      attachToken();
      const data = await custAxios.get("/history",{
        params: filters,
      });

      return data?.data;
    },
queryKey: ["history", filters],
    // staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: true,
  });
  return { history: data, ...rest };
};
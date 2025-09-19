import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import custAxios, { attachToken } from "../configs/axios.config";
import {successMessage,errorMessage} from "../lib/toast"

export const useUsers = (filters) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => {
      attachToken();
      const data = await custAxios.get("/user",{
        params: filters,
      });
console.log(data?.data?.data , "user output") ;

      return data?.data?.data;
    },
queryKey: ["orders"],
    // staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: true,
  });
  return { user: data, ...rest };
};

export const useBanner = () => {
  const { data, ...rest } = useQuery({
    queryFn: async () => {
      attachToken();
      const data = await custAxios.get("/banner");

      return data?.data?.data;
    },

    queryKey: ["banner"],
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: true,
  });
  return { banners: data, ...rest };
};
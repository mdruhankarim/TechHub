import { getProducsts } from "@/api/product.api";
import { useQuery } from "@tanstack/react-query";

export function useProducts(filters = {}) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => getProducsts(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}

import { fetchStats } from "@/lib/api/stats";
import { useQuery } from "@tanstack/react-query";

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
    staleTime: 30 * 1000, 
  });
}
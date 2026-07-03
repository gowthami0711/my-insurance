import { fetchStats } from "@/lib/api/stats";
import { useQuery } from "@tanstack/react-query";

export function useStats() {
  return useQuery({ //
    queryKey: ["stats"], // unique identifier for the query
    queryFn: fetchStats, // function to fetch the stats
    staleTime: 30 * 1000, // time to consider the data stale
  });
}

// placeholderData: (prev) => prev, // return the previous data if the query is not stale
// enabled: !!session, // enable the query if the session is available
// onError: (error) => {
//   console.error("Error fetching stats:", error);
// },
// onSuccess: (data) => {
//   console.log("Stats fetched successfully:", data);
// },
// retry: false, // do not retry the query if it fails
// refetchOnWindowFocus: false, // do not refetch the query if the window is focused
// refetchOnMount: false, // do not refetch the query if the component is mounted
// refetchOnReconnect: false, // do not refetch the query if the connection is reconnected
// refetchInterval: false, // do not refetch the query at a regular interval
// refetchIntervalInBackground: false, // do not refetch the query in the background
// refetchIntervalInBackground: false, // do not refetch the query in the background
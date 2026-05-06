export type StatsResponse = {
    totalCustomers: number;
    members: number;
    activeNow: number;
    inactive: number;
  };
  
  export async function fetchStats(): Promise<StatsResponse> {
    const res = await fetch("/api/stats");
    if (!res.ok) throw new Error("Failed to fetch stats");
    return res.json();
  }
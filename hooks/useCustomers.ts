import { useQuery } from "@tanstack/react-query";
import { useCustomersStore } from "@/store/customers.store";
import { fetchCustomers } from "@/lib/api/customers";

export function useCustomers() {
  const { search, page, sortBy } = useCustomersStore();

  return useQuery({
    queryKey: ["customers", { search, page, sortBy }], 
    queryFn: () => fetchCustomers({ search, page, sortBy }),
    placeholderData: (prev) => prev, 
  });
}
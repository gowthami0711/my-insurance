import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCustomer, deleteCustomer, createCustomer } from "@/lib/api/customers";
import type { Customer } from "@/lib/api/customers";


export function useCreateCustomer() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (data: Omit<Customer, "id">) => createCustomer(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["customers"] });
        queryClient.invalidateQueries({ queryKey: ["stats"] });
      },
    });
  }

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Customer> }) =>
      updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}
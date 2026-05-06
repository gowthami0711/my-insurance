export type Customer = {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  country: string;
  status: "Active" | "Inactive";
};

export type CustomersResponse = {
  customers: Customer[];
  total: number;
  page: number;
  totalPages: number;
};

export async function fetchCustomers({  
  search,
  page,
  sortBy,
}: {
  search: string;
  page: number;
  sortBy: string;
}): Promise<CustomersResponse> {
  const params = new URLSearchParams({ search, page: String(page), sortBy });
  const res = await fetch(`/api/customers?${params}`);

  if (res.status === 429) {
    throw new Error("Too many requests. Please slow down.");
  }

  if (!res.ok) throw new Error("Failed to fetch customers");
  return res.json();
}

export async function createCustomer(
  data: Omit<Customer, "id">
): Promise<Customer> {
  const res = await fetch("/api/customers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create customer");
  return res.json();
}

export async function updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
  const res = await fetch(`/api/customers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update customer");
  return res.json();
}

export async function deleteCustomer(id: string): Promise<void> {
  const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete customer");
}

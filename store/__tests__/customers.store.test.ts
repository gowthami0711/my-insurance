import { useCustomersStore } from "@/store/customers.store";

describe("customers store", () => {
  beforeEach(() => {
    useCustomersStore.setState({
      search: "",
      page: 1,
      sortBy: "newest",
      selectedCustomerId: null,
      editingCustomer: null,
      deletingCustomer: null,
      isAddingCustomer: false,
    });
  });

  it("setSearch updates search and resets page", () => {
    useCustomersStore.setState({ page: 3 });
    useCustomersStore.getState().setSearch("john");
    const state = useCustomersStore.getState();
    expect(state.search).toBe("john");
    expect(state.page).toBe(1);
  });

  it("setSortBy updates sort and resets page", () => {
    useCustomersStore.setState({ page: 2 });
    useCustomersStore.getState().setSortBy("name");
    const state = useCustomersStore.getState();
    expect(state.sortBy).toBe("name");
    expect(state.page).toBe(1);
  });
});

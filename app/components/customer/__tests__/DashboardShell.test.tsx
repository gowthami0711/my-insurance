import { fireEvent, render, screen } from "@testing-library/react";

const useUIStoreMock = jest.fn();
const sidebarPropsSpy = jest.fn();
const headerPropsSpy = jest.fn();

jest.mock("@/store/ui-store", () => ({
  useUIStore: () => useUIStoreMock(),
}));

jest.mock("@/app/components/customer/Sidebar", () => ({
  Sidebar: (props: unknown) => {
    sidebarPropsSpy(props);
    return <div>Sidebar</div>;
  },
}));

jest.mock("@/app/components/customer/Header", () => ({
  Header: (props: unknown) => {
    headerPropsSpy(props);
    return <div>Header</div>;
  },
}));

import { DashboardShell } from "@/app/components/customer/DashboardShell";

describe("DashboardShell", () => {
  const toggleSidebar = jest.fn();
  const openMobileMenu = jest.fn();
  const closeMobileMenu = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useUIStoreMock.mockReturnValue({
      isSidebarCollapsed: false,
      isMobileMenuOpen: true,
      toggleSidebar,
      openMobileMenu,
      closeMobileMenu,
    });
  });

  it("renders child content and closes mobile backdrop", () => {
    render(
      <DashboardShell>
        <div>Body</div>
      </DashboardShell>
    );

    expect(screen.getByText("Body")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Close sidebar backdrop" }));
    expect(closeMobileMenu).toHaveBeenCalled();
  });
});

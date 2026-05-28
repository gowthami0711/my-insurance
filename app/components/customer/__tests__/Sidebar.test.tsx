import { fireEvent, render, screen } from "@testing-library/react";

const usePathnameMock = jest.fn();
const useSessionMock = jest.fn();
const signOutMock = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: () => usePathnameMock(),
}));

jest.mock("next-auth/react", () => ({
  useSession: () => useSessionMock(),
  signOut: () => signOutMock(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: { alt: string }) => <span>{props.alt || "image"}</span>,
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, onClick }: { children: React.ReactNode; href: string; onClick?: () => void }) => (
    <a href={href} onClick={onClick}>
      {children}
    </a>
  ),
}));

jest.mock("@/components/ui/icon", () => ({
  Icon: ({ name }: { name: string }) => <span>{name}</span>,
}));

import { Sidebar } from "@/app/components/customer/Sidebar";

describe("Sidebar", () => {
  const onToggleSidebar = jest.fn();
  const onCloseMobileMenu = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    usePathnameMock.mockReturnValue("/customers");
    useSessionMock.mockReturnValue({ data: { user: { name: "Jane", role: "admin" } } });
  });

  it("renders user info and signs out", () => {
    render(
      <Sidebar
        pathname="/customers"
        isSidebarCollapsed={false}
        isMobileMenuOpen
        onToggleSidebar={onToggleSidebar}
        onCloseMobileMenu={onCloseMobileMenu}
      />
    );

    expect(screen.getByText("Jane")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Sign out" }));
    expect(signOutMock).toHaveBeenCalled();
  });
});

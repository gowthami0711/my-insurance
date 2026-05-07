import { fireEvent, render, screen } from "@testing-library/react";

const useSessionMock = jest.fn();

jest.mock("next-auth/react", () => ({
  useSession: () => useSessionMock(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: { alt: string }) => <span>{props.alt}</span>,
}));

import { Header } from "@/app/components/customer/Header";

describe("Header", () => {
  const onOpenMobileMenu = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows greeting with session first name", () => {
    useSessionMock.mockReturnValue({ data: { user: { name: "Jane Doe" } } });
    render(<Header onOpenMobileMenu={onOpenMobileMenu} />);
    expect(screen.getByText("Hello Jane")).toBeInTheDocument();
  });

  it("opens mobile menu when hamburger is clicked", () => {
    useSessionMock.mockReturnValue({ data: null });
    render(<Header onOpenMobileMenu={onOpenMobileMenu} />);
    fireEvent.click(screen.getByRole("button", { name: "Open sidebar menu" }));
    expect(onOpenMobileMenu).toHaveBeenCalled();
  });
});

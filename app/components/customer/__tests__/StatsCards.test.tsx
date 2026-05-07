import { render, screen } from "@testing-library/react";

const useStatsMock = jest.fn();

jest.mock("@/hooks/useStats", () => ({
  useStats: () => useStatsMock(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: () => <span>icon</span>,
}));

import { StatsCards } from "@/app/components/customer/StatsCards";

describe("StatsCards", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders card titles and values from stats payload", () => {
    useStatsMock.mockReturnValue({
      data: { totalCustomers: 10, members: 7, activeNow: 5, inactive: 2 },
      isLoading: false,
    });

    render(<StatsCards />);
    expect(screen.getByText("Total Customers")).toBeInTheDocument();
    expect(screen.getByText("Members")).toBeInTheDocument();
    expect(screen.getByText("Active Now")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("shows loading placeholders when stats are loading", () => {
    useStatsMock.mockReturnValue({ data: undefined, isLoading: true });
    const { container } = render(<StatsCards />);
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });
});

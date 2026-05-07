import { render } from "@testing-library/react";

const imageMock = jest.fn(() => null);

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: unknown) => imageMock(props),
}));

import { Icon } from "@/components/ui/icon";

describe("Icon", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with default size and inactive class", () => {
    render(<Icon name="dashboard" />);

    expect(imageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        src: "/images/dashboard.svg",
        alt: "dashboard",
        width: 20,
        height: 20,
        className: "opacity-60 ",
      })
    );
  });

  it("applies active and custom class values", () => {
    render(<Icon name="customers" size={24} active className="extra" />);

    expect(imageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        src: "/images/customers.svg",
        width: 24,
        height: 24,
        className: "brightness-0 invert extra",
      })
    );
  });
});

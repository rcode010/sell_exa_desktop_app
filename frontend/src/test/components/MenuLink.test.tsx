import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import MenuLink from "../../components/layout/MenuLink";
import { ShoppingCart } from "lucide-react";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("MenuLink", () => {
  const mockItem = {
    icon: ShoppingCart,
    label: "Orders",
    path: "/orders",
    active: false,
  };

  it("renders menu link with label", () => {
    render(
      <BrowserRouter>
        <MenuLink item={mockItem} />
      </BrowserRouter>
    );

    expect(screen.getByText("Orders")).toBeInTheDocument();
  });

  it("applies active styling when active", () => {
    const activeItem = { ...mockItem, active: true };

    render(
      <BrowserRouter>
        <MenuLink item={activeItem} />
      </BrowserRouter>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-gray-100");
  });

  it("navigates to correct path when clicked", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <MenuLink item={mockItem} />
      </BrowserRouter>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/orders");
  });
});

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import SidebarLoader from "../../components/ui/SidebarLoader";
import { describe, it, expect } from "vitest";

describe("sidebar loader", () => {
  it("should render sidebar loading component", () => {
    render(<SidebarLoader />);

    expect(screen.getByText("Loading Sidebar")).toBeInTheDocument();
  });
});

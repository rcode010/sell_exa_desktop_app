import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProfilePage from "../../pages/ProfilePage";

describe("profile page", () => {
  // Check if the page renders with all expected elements
  it("renders profile page with expected elements", () => {
    render(<ProfilePage />);

    // Check headings
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(
      screen.getByText("Manage your account settings and preferences")
    ).toBeInTheDocument();
    expect(screen.getByText("Profile Information")).toBeInTheDocument();

    // Check form elements
    expect(screen.getByText("Change Avatar")).toBeInTheDocument();
    expect(screen.getByText("Update Profile")).toBeInTheDocument();
  });

  // Test 2: User can type in the full name input
  it("allows user to type in full name input", async () => {
    // Mock user interactions
    const user = userEvent.setup();
    render(<ProfilePage />);

    // Get the full name input and type a name
    const nameInput = screen.getByLabelText("Full Name") as HTMLInputElement;
    await user.type(nameInput, "John Doe");

    // Verify the input value
    expect(nameInput.value).toBe("John Doe");
  });

  // Test 3: user can type in the phone number input
  it("allows user to type in phone number input", async () => {
    const user = userEvent.setup();
    render(<ProfilePage />);

    const phoneInput = screen.getByLabelText(
      "Phone Number"
    ) as HTMLInputElement;
    await user.type(phoneInput, "07501234567");

    expect(phoneInput.value).toBe("07501234567");
  });

  // Test 4: Form submission triggers the handleSubmit function
  it("submits the form when 'Update Profile' button is clicked", async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, "log");
    render(<ProfilePage />);

    const submitButton = screen.getByText(
      "Update Profile"
    ) as HTMLButtonElement;

    await user.click(submitButton);

    expect(consoleSpy).toHaveBeenCalledWith("Profile updated");

    consoleSpy.mockRestore();
  });

  // Test 5: complete user interaction flow
  it("completes user interaction flow", async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, "log");

    render(<ProfilePage />);

    // Take the inputs
    const nameInput = screen.getByLabelText("Full Name") as HTMLInputElement;
    const phoneInput = screen.getByLabelText(
      "Phone Number"
    ) as HTMLInputElement;
    const submitButton = screen.getByText(
      "Update Profile"
    ) as HTMLButtonElement;

    // Simulate user typing
    await user.type(nameInput, "Jane Smith");
    await user.type(phoneInput, "07987654321");

    // Simulate form submission
    await user.click(submitButton);

    // Verify console log
    expect(consoleSpy).toHaveBeenCalledWith("Profile updated");

    consoleSpy.mockRestore();
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "../../pages/LoginPage";
import { useUserStore } from "../../stores/useUserStore";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../stores/useUserStore");

describe("LoginPage", () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useUserStore).mockReturnValue({
      login: mockLogin,
      loading: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  });

  it("renders login form with all elements", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByText("Sellexa")).toBeInTheDocument();
    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it("allows user to type in phone and password fields", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const phoneInput = screen.getByLabelText(
      "Phone Number"
    ) as HTMLInputElement;
    const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;

    await user.type(phoneInput, "07501234567");
    await user.type(passwordInput, "password123");

    expect(phoneInput.value).toBe("07501234567");
    expect(passwordInput.value).toBe("password123");
  });

  it("toggles password visibility when eye icon clicked", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;
    expect(passwordInput.type).toBe("password");

    // Click eye icon to show password
    const toggleButton = screen.getByRole("button", { name: "" });
    await user.click(toggleButton);

    expect(passwordInput.type).toBe("text");

    // Click again to hide
    await user.click(toggleButton);
    expect(passwordInput.type).toBe("password");
  });

  it("submits form with correct credentials", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValueOnce(true);

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const phoneInput = screen.getByLabelText("Phone Number");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(phoneInput, "07501234567");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("07501234567", "password123");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("does not navigate if login fails", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValueOnce(false);

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const phoneInput = screen.getByLabelText("Phone Number");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(phoneInput, "07501234567");
    await user.type(passwordInput, "wrongpassword");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it("disables inputs and button during loading", () => {
    vi.mocked(useUserStore).mockReturnValue({
      login: mockLogin,
      loading: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const phoneInput = screen.getByLabelText(
      "Phone Number"
    ) as HTMLInputElement;
    const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;
    const submitButton = screen.getByRole("button", {
      name: /signing in/i,
    }) as HTMLButtonElement;

    expect(phoneInput.disabled).toBe(true);
    expect(passwordInput.disabled).toBe(true);
    expect(submitButton.disabled).toBe(true);
  });
});

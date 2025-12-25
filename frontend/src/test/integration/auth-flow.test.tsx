/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import App from "../../App";
import { useUserStore } from "../../stores/useUserStore";

vi.mock("../../stores/useUserStore");

global.window = {
  secureToken: {
    save: vi.fn(),
    get: vi.fn(),
    clear: vi.fn(),
  },
} as any;

describe("Authentication Flow Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should complete full login flow", async () => {
    const user = userEvent.setup();
    const mockLogin = vi.fn().mockResolvedValue(true);

    // Initially not logged in
    vi.mocked(useUserStore).mockReturnValue({
      user: null,
      isHydrated: true,
      accessToken: null,
      checkingAuth: false,
      login: mockLogin,
      refreshAuth: vi.fn(),
      getProfile: vi.fn(),
    } as any);

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Should show login page
    await waitFor(() => {
      expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
    });

    // Fill in login form
    const phoneInput = screen.getByLabelText("Phone Number");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(phoneInput, "07501234567");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("07501234567", "password123");
    });
  });

  it("should refresh token on app start if refresh token exists", async () => {
    const mockRefreshAuth = vi.fn().mockResolvedValue(true);
    const mockGetProfile = vi.fn().mockResolvedValue(true);

    vi.mocked(window.secureToken.get).mockResolvedValueOnce("refresh-token");

    vi.mocked(useUserStore).mockReturnValue({
      user: null,
      isHydrated: true,
      accessToken: null,
      checkingAuth: false,
      refreshAuth: mockRefreshAuth,
      getProfile: mockGetProfile,
    } as any);

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockRefreshAuth).toHaveBeenCalled();
      expect(mockGetProfile).toHaveBeenCalled();
    });
  });

  it("should navigate to login if no tokens and no user", async () => {
    vi.mocked(window.secureToken.get).mockResolvedValueOnce(null);

    vi.mocked(useUserStore).mockReturnValue({
      user: null,
      isHydrated: true,
      accessToken: null,
      checkingAuth: false,
      refreshAuth: vi.fn(),
      getProfile: vi.fn(),
    } as any);

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
    });
  });
});

import { describe, it, expect, beforeEach, vi } from "vitest";
import { useUserStore } from "../../../stores/useUserStore";
import axiosInstance from "../../../lib/axios";

// Mock axios
vi.mock("../../../lib/axios");

// Mock secure token storage
global.window = {
  secureToken: {
    save: vi.fn(),
    get: vi.fn(),
    clear: vi.fn(),
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

describe("useUserStore", () => {
  beforeEach(() => {
    // Reset store to initial state
    useUserStore.setState({
      user: null,
      accessToken: null,
      loading: false,
      checkingAuth: false,
      isHydrated: true,
    });
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("should login successfully with valid credentials", async () => {
      const mockUser = {
        _id: "123",
        firstName: "John",
        lastName: "Doe",
        role: "admin",
        phoneNo: "07501234567",
        tokens: {
          accessToken: "access-token-123",
          refreshToken: "refresh-token-123",
        },
      };

      vi.mocked(axiosInstance.post).mockResolvedValueOnce({
        data: { data: mockUser },
      });

      const { login } = useUserStore.getState();
      const result = await login("07501234567", "password123");

      expect(result).toBe(true);
      expect(useUserStore.getState().user).toEqual(mockUser);
      expect(useUserStore.getState().accessToken).toBe("access-token-123");
      expect(window.secureToken.save).toHaveBeenCalledWith("refresh-token-123");
    });

    it("should fail login with invalid credentials", async () => {
      vi.mocked(axiosInstance.post).mockRejectedValueOnce({
        response: { data: { message: "Invalid credentials" } },
      });

      const { login } = useUserStore.getState();
      const result = await login("07501234567", "wrongpassword");

      expect(result).toBe(false);
      expect(useUserStore.getState().user).toBe(null);
    });

    it("should not login without phone or password", async () => {
      const { login } = useUserStore.getState();

      const result1 = await login("", "password");
      const result2 = await login("phone", "");

      expect(result1).toBe(false);
      expect(result2).toBe(false);
    });
  });

  describe("logout", () => {
    it("should logout successfully and clear tokens", async () => {
      // Set up logged-in state
      useUserStore.setState({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        user: { _id: "123", firstName: "John" } as any,
        accessToken: "token-123",
      });

      vi.mocked(window.secureToken.get).mockResolvedValueOnce("refresh-token");
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: {} });

      const { logout } = useUserStore.getState();
      await logout();

      expect(useUserStore.getState().user).toBe(null);
      expect(useUserStore.getState().accessToken).toBe(null);
      expect(window.secureToken.clear).toHaveBeenCalled();
    });
  });

  describe("refreshAuth", () => {
    it("should refresh access token successfully", async () => {
      vi.mocked(window.secureToken.get).mockResolvedValueOnce(
        "old-refresh-token"
      );
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({
        data: {
          data: {
            accessToken: "new-access-token",
            refreshToken: "new-refresh-token",
          },
        },
      });

      const { refreshAuth } = useUserStore.getState();
      const result = await refreshAuth();

      expect(result).toBe(true);
      expect(useUserStore.getState().accessToken).toBe("new-access-token");
      expect(window.secureToken.save).toHaveBeenCalledWith("new-refresh-token");
    });

    it("should fail refresh without refresh token", async () => {
      vi.mocked(window.secureToken.get).mockResolvedValueOnce(null);

      const { refreshAuth } = useUserStore.getState();
      const result = await refreshAuth();

      expect(result).toBe(false);
      expect(useUserStore.getState().accessToken).toBe(null);
    });
  });

  describe("getProfile", () => {
    it("should fetch user profile successfully", async () => {
      const mockProfile = {
        _id: "123",
        firstName: "John",
        lastName: "Doe",
        phoneNo: "07501234567",
        role: "admin",
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: { data: mockProfile },
      });

      const { getProfile } = useUserStore.getState();
      const result = await getProfile();

      expect(result).toBe(true);
      expect(useUserStore.getState().user).toEqual(mockProfile);
    });
  });
});

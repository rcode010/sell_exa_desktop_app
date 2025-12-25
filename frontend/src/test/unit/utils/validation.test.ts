import { describe, it, expect } from "vitest";

// Validation helpers (create these in src/utils/validation.ts)
export const validatePhone = (phone: string): boolean => {
  const iraqPhoneRegex = /^07[0-9]{9}$/;
  return iraqPhoneRegex.test(phone);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

describe("Validation Helpers", () => {
  describe("validatePhone", () => {
    it("should validate correct Iraq phone numbers", () => {
      expect(validatePhone("07501234567")).toBe(true);
      expect(validatePhone("07701234567")).toBe(true);
    });

    it("should reject invalid phone numbers", () => {
      expect(validatePhone("0750123456")).toBe(false); // Too short
      expect(validatePhone("075012345678")).toBe(false); // Too long
      expect(validatePhone("08501234567")).toBe(false); // Wrong prefix
      expect(validatePhone("abcdefghijk")).toBe(false); // Not numbers
    });
  });

  describe("validatePassword", () => {
    it("should validate passwords with 8+ characters", () => {
      expect(validatePassword("password123")).toBe(true);
      expect(validatePassword("12345678")).toBe(true);
    });

    it("should reject passwords under 8 characters", () => {
      expect(validatePassword("pass")).toBe(false);
      expect(validatePassword("1234567")).toBe(false);
    });
  });

  describe("validateEmail", () => {
    it("should validate correct email formats", () => {
      expect(validateEmail("user@example.com")).toBe(true);
      expect(validateEmail("test.user+tag@domain.co")).toBe(true);
    });

    it("should reject invalid email formats", () => {
      expect(validateEmail("invalid-email")).toBe(false);
      expect(validateEmail("@example.com")).toBe(false);
      expect(validateEmail("user@.com")).toBe(false);
    });
  });
});

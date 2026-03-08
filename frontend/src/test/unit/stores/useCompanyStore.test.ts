import { describe, it, expect, beforeEach, vi } from "vitest";
import { useCompanyStore } from "../../../stores/useCompanyStore";
import axios from "../../../lib/axios";
import toast from "react-hot-toast";

// Mock dependencies
vi.mock("../../../lib/axios");
vi.mock("react-hot-toast");

describe("useCompanyStore", () => {
  beforeEach(() => {
    // Reset store to initial state
    useCompanyStore.setState({
      companies: [],
      companiesCount: 0,
      loading: false,
    });
    vi.clearAllMocks();
  });

  describe("getCompanies", () => {
    it("should fetch companies successfully", async () => {
      const mockCompanies = [
        { _id: "1", name: "Toyota", models: [] },
        { _id: "2", name: "Honda", models: [] },
      ];

      vi.mocked(axios.get).mockResolvedValueOnce({
        data: { data: mockCompanies },
      });

      const { getCompanies } = useCompanyStore.getState();
      await getCompanies();

      expect(useCompanyStore.getState().companies).toEqual(mockCompanies);
      expect(useCompanyStore.getState().loading).toBe(false);
      expect(axios.get).toHaveBeenCalledWith("/api/company/");
    });

    it("should handle fetch companies error", async () => {
      vi.mocked(axios.get).mockRejectedValueOnce({
        message: "Network error",
        response: { data: { message: "Failed to fetch" } },
      });

      const { getCompanies } = useCompanyStore.getState();
      await getCompanies();

      expect(useCompanyStore.getState().companies).toEqual([]);
      expect(useCompanyStore.getState().loading).toBe(false);
      expect(toast.error).toHaveBeenCalledWith("Something went wrong");
    });

    it("should set loading to true while fetching", async () => {
      vi.mocked(axios.get).mockImplementation(
        () =>
          new Promise((resolve) => {
            // Check loading state during fetch
            expect(useCompanyStore.getState().loading).toBe(true);
            setTimeout(() => resolve({ data: { data: [] } }), 100);
          })
      );

      const { getCompanies } = useCompanyStore.getState();
      await getCompanies();
    });
  });

  describe("createCompany", () => {
    it("should create company successfully", async () => {
      const mockFormData = new FormData();
      mockFormData.append("name", "Tesla");

      const mockResponse = {
        data: {
          success: true,
          data: { _id: "3", name: "Tesla", models: [] },
        },
      };

      vi.mocked(axios.post).mockResolvedValueOnce(mockResponse);
      vi.mocked(axios.get).mockResolvedValueOnce({
        data: { data: [mockResponse.data.data] },
      });

      const { createCompany } = useCompanyStore.getState();
      const result = await createCompany(mockFormData);

      expect(result).toBe(true);
      expect(axios.post).toHaveBeenCalledWith("/api/company/", mockFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      expect(toast.success).toHaveBeenCalledWith(
        "Company created successfully!"
      );
    });

    it("should handle create company failure", async () => {
      const mockFormData = new FormData();

      vi.mocked(axios.post).mockRejectedValueOnce({
        message: "Creation failed",
        response: { data: { message: "Name already exists" } },
      });

      const { createCompany } = useCompanyStore.getState();
      const result = await createCompany(mockFormData);

      expect(result).toBe(false);
      expect(toast.error).toHaveBeenCalledWith("Name already exists");
    });

    it("should refresh companies after successful creation", async () => {
      const mockFormData = new FormData();
      const mockCompanies = [{ _id: "1", name: "BMW", models: [] }];

      vi.mocked(axios.post).mockResolvedValueOnce({
        data: { success: true, data: mockCompanies[0] },
      });
      vi.mocked(axios.get).mockResolvedValueOnce({
        data: { data: mockCompanies },
      });

      const { createCompany } = useCompanyStore.getState();
      await createCompany(mockFormData);

      expect(axios.get).toHaveBeenCalledWith("/api/company/");
      expect(useCompanyStore.getState().companies).toEqual(mockCompanies);
    });

    it("should optimistically update if refresh fails", async () => {
      const mockFormData = new FormData();
      const mockCompany = { _id: "1", name: "Ford", models: [], logoLink: null, products: 0, isHidden: false };

      useCompanyStore.setState({
        companies: [
          {
            _id: "1",
            name: "Old Name",
            models: [],
            logoLink: null,
            products: 0,
            isHidden: false,
          },
        ],
      });

      vi.mocked(axios.post).mockResolvedValueOnce({
        data: { success: true, data: mockCompany },
      });
      vi.mocked(axios.get).mockRejectedValueOnce(new Error("Refresh failed"));

      const { createCompany } = useCompanyStore.getState();
      await createCompany(mockFormData);

      const state = useCompanyStore.getState();
      expect(state.companies).toContainEqual(mockCompany);
    });
  });

  describe("updateCompany", () => {
    it("should update company successfully", async () => {
      const mockFormData = new FormData();
      mockFormData.append("name", "Updated Company");

      const mockUpdated = { _id: "1", name: "Updated Company", models: [], logoLink: null, products: 0, isHidden: false };

      vi.mocked(axios.patch).mockResolvedValueOnce({
        data: { success: true, data: mockUpdated },
      });
      vi.mocked(axios.get).mockResolvedValueOnce({
        data: { data: [mockUpdated] },
      });

      const { updateCompany } = useCompanyStore.getState();
      const result = await updateCompany(mockFormData, "1");

      expect(result).toBe(true);
      expect(axios.patch).toHaveBeenCalledWith("/api/company/1", mockFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      expect(toast.success).toHaveBeenCalledWith(
        "Company updated successfully!"
      );
    });

    it("should fail if company name is missing", async () => {
      const mockFormData = new FormData();
      // No name added

      const { updateCompany } = useCompanyStore.getState();
      const result = await updateCompany(mockFormData, "1");

      expect(result).toBe(false);
      expect(toast.error).toHaveBeenCalledWith("Company name is required");
      expect(axios.patch).not.toHaveBeenCalled();
    });

    it("should handle update company error", async () => {
      const mockFormData = new FormData();
      mockFormData.append("name", "Test");

      vi.mocked(axios.patch).mockRejectedValueOnce({
        message: "Update failed",
        response: { data: { message: "Invalid data" } },
      });

      const { updateCompany } = useCompanyStore.getState();
      const result = await updateCompany(mockFormData, "1");

      expect(result).toBe(false);
      expect(toast.error).toHaveBeenCalledWith("Invalid data");
    });

    it("should handle unsuccessful response", async () => {
      const mockFormData = new FormData();
      mockFormData.append("name", "Test");

      vi.mocked(axios.patch).mockResolvedValueOnce({
        data: { success: false },
      });

      const { updateCompany } = useCompanyStore.getState();
      const result = await updateCompany(mockFormData, "1");

      expect(result).toBe(false);
    });
  });

  describe("deleteCompany", () => {
    it("should delete company successfully", async () => {
      const companyId = "1";

      vi.mocked(axios.delete).mockResolvedValueOnce({
        data: { success: true, data: {} },
      });
      vi.mocked(axios.get).mockResolvedValueOnce({
        data: { data: [] },
      });

      const { deleteCompany } = useCompanyStore.getState();
      const result = await deleteCompany(companyId);

      expect(result).toBe(true);
      expect(axios.delete).toHaveBeenCalledWith(
        `/api/company/delete-company/${companyId}`
      );
      expect(toast.success).toHaveBeenCalledWith(
        "Company deleted successfully!"
      );
    });

    it("should handle delete company error", async () => {
      vi.mocked(axios.delete).mockRejectedValueOnce({
        message: "Delete failed",
        response: { data: { message: "Company not found" } },
      });

      const { deleteCompany } = useCompanyStore.getState();
      const result = await deleteCompany("1");

      expect(result).toBe(false);
      expect(toast.error).toHaveBeenCalledWith("Company not found");
    });

    it("should refresh companies after deletion", async () => {
      const remainingCompanies = [{ _id: "2", name: "Company 2", models: [] }];

      vi.mocked(axios.delete).mockResolvedValueOnce({
        data: { success: true, data: {} },
      });
      vi.mocked(axios.get).mockResolvedValueOnce({
        data: { data: remainingCompanies },
      });

      const { deleteCompany } = useCompanyStore.getState();
      await deleteCompany("1");

      expect(useCompanyStore.getState().companies).toEqual(remainingCompanies);
    });
  });

  describe("loading states", () => {
    it("should set loading to false after all operations", async () => {
      vi.mocked(axios.get).mockResolvedValueOnce({ data: { data: [] } });

      const { getCompanies } = useCompanyStore.getState();
      await getCompanies();

      expect(useCompanyStore.getState().loading).toBe(false);
    });

    it("should set loading to false even on error", async () => {
      vi.mocked(axios.get).mockRejectedValueOnce(new Error("Network error"));

      const { getCompanies } = useCompanyStore.getState();
      await getCompanies();

      expect(useCompanyStore.getState().loading).toBe(false);
    });
  });
});

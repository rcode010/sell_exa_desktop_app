import { describe, it, expect, beforeEach, vi } from "vitest";
import { useModelStore } from "../../../stores/useModelStore";
import axios from "../../../lib/axios";
import toast from "react-hot-toast";
import { useCompanyStore } from "../../../stores/useCompanyStore";

vi.mock("../../../lib/axios");
vi.mock("react-hot-toast");

describe("useModelStore", () => {
  beforeEach(() => {
    useModelStore.setState({
      models: [],
      modelsCount: 0,
      loading: false,
    });
    vi.clearAllMocks();
  });

  describe("getModels", () => {
    it("should fetch models successfully", async () => {
      const companyId = "company-123";
      const mockModels = [
        { _id: "1", name: "Camry", companyId },
        { _id: "2", name: "Corolla", companyId },
      ];

      vi.mocked(axios.get).mockResolvedValueOnce({
        data: { data: mockModels },
      });

      const { getModels } = useModelStore.getState();
      const result = await getModels(companyId);

      expect(result).toBe(true);
      expect(useModelStore.getState().models).toEqual(mockModels);
      expect(useModelStore.getState().modelsCount).toBe(2);
      expect(axios.get).toHaveBeenCalledWith(`/api/model/${companyId}/models`);
    });

    it("should handle fetch models error", async () => {
      vi.mocked(axios.get).mockRejectedValueOnce({
        message: "Network error",
        response: { data: { message: "Company not found" } },
      });

      const { getModels } = useModelStore.getState();
      const result = await getModels("invalid-id");

      expect(result).toBe(false);
      expect(toast.error).toHaveBeenCalledWith("Company not found");
      expect(useCompanyStore.getState().loading).toBe(false);
    });

    it("should use default error message when none provided", async () => {
      vi.mocked(axios.get).mockRejectedValueOnce({
        message: "Network error",
        response: { data: {} },
      });

      const { getModels } = useModelStore.getState();
      await getModels("company-123");

      expect(toast.error).toHaveBeenCalledWith("Failed to fetch models");
    });
  });

  describe("createModel", () => {
    it("should create model successfully", async () => {
      const companyId = "company-123";
      const modelName = "Accord";
      const mockModel = { _id: "1", name: "Accord", companyId };

      vi.mocked(axios.post).mockResolvedValueOnce({
        data: { message: "Model added successfully", data: mockModel },
      });

      const { createModel } = useModelStore.getState();
      const result = await createModel(companyId, modelName);

      expect(result).toBe(true);
      expect(axios.post).toHaveBeenCalledWith(
        `/api/model/${companyId}/models`,
        { modelName: "Accord" }
      );
      expect(useModelStore.getState().models).toContainEqual(mockModel);
      expect(axios.get).not.toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Model added successfully");
    });

    it("should trim model name before sending", async () => {
      const companyId = "company-123";
      const modelName = "  Civic  ";
      const mockModel = { _id: "2", name: "Civic", companyId };

      vi.mocked(axios.post).mockResolvedValueOnce({
        data: { message: "Success", data: mockModel },
      });

      const { createModel } = useModelStore.getState();
      await createModel(companyId, modelName);

      expect(axios.post).toHaveBeenCalledWith(
        `/api/model/${companyId}/models`,
        { modelName: "Civic" }
      );
    });

    it("should handle create model error", async () => {
      vi.mocked(axios.post).mockRejectedValueOnce({
        message: "Creation failed",
        response: { data: { message: "Model already exists" } },
      });

      const { createModel } = useModelStore.getState();
      const result = await createModel("company-123", "Duplicate");

      expect(result).toBe(false);
      expect(toast.error).toHaveBeenCalledWith("Model already exists");
    });

    it("should refresh models if server does not return new model data", async () => {
      const companyId = "company-123";
      const mockModels = [{ _id: "1", name: "New Model", companyId }];

      vi.mocked(axios.post).mockResolvedValueOnce({
        data: { message: "Success", data: null }, // trigger fallback
      });
      vi.mocked(axios.get).mockResolvedValueOnce({
        data: { data: mockModels },
      });

      const { createModel } = useModelStore.getState();
      await createModel(companyId, "New Model");

      expect(useModelStore.getState().models).toEqual(mockModels);
      expect(axios.get).toHaveBeenCalledWith(`/api/model/${companyId}/models`);
    });
  });

  describe("updateModel", () => {
    it("should update model successfully", async () => {
      const companyId = "company-123";
      const modelId = "model-456";
      const newName = "Updated Name";

      useModelStore.setState({
        models: [{ _id: modelId, name: "Old Name" }]
      });

      vi.mocked(axios.patch).mockResolvedValueOnce({
        data: { message: "Model updated successfully" },
      });

      const { updateModel } = useModelStore.getState();
      const result = await updateModel(companyId, modelId, newName);

      expect(result).toBe(true);
      expect(axios.patch).toHaveBeenCalledWith(
        `/api/model/${companyId}/models/${modelId}`,
        { newName: "Updated Name" }
      );
      expect(useModelStore.getState().models[0].name).toBe("Updated Name");
      expect(axios.get).not.toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Model updated successfully");
    });

    it("should trim new name before updating", async () => {
      vi.mocked(axios.patch).mockResolvedValueOnce({
        data: { message: "Success" },
      });

      useModelStore.setState({
        models: [{ _id: "model-456", name: "Old Name" }],
      });

      const { updateModel } = useModelStore.getState();
      await updateModel("company-123", "model-456", "  Trimmed  ");

      expect(axios.patch).toHaveBeenCalledWith(
        "/api/model/company-123/models/model-456",
        { newName: "Trimmed" }
      );
    });

    it("should handle update model error", async () => {
      vi.mocked(axios.patch).mockRejectedValueOnce({
        message: "Update failed",
        response: { data: { message: "Model not found" } },
      });

      const { updateModel } = useModelStore.getState();
      const result = await updateModel("company-123", "invalid", "New Name");

      expect(result).toBe(false);
      expect(toast.error).toHaveBeenCalledWith("Model not found");
    });
  });

  describe("deleteModel", () => {
    it("should delete model successfully", async () => {
      const companyId = "company-123";
      const modelId = "model-456";

      useModelStore.setState({
        models: [{ _id: modelId, name: "Model To Delete" }],
        modelsCount: 1
      });

      vi.mocked(axios.delete).mockResolvedValueOnce({
        data: { message: "Model deleted successfully" },
      });

      const { deleteModel } = useModelStore.getState();
      const result = await deleteModel(companyId, modelId);

      expect(result).toBe(true);
      expect(axios.delete).toHaveBeenCalledWith(
        `/api/model/${companyId}/models/${modelId}`
      );
      expect(useModelStore.getState().models).toEqual([]);
      expect(useModelStore.getState().modelsCount).toBe(0);
      expect(axios.get).not.toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Model deleted successfully");
    });

    it("should handle delete model error", async () => {
      vi.mocked(axios.delete).mockRejectedValueOnce({
        message: "Delete failed",
        response: { data: { message: "Cannot delete model in use" } },
      });

      const { deleteModel } = useModelStore.getState();
      const result = await deleteModel("company-123", "model-456");

      expect(result).toBe(false);
      expect(toast.error).toHaveBeenCalledWith("Cannot delete model in use");
    });

    it("should optimistically remove model after deletion", async () => {
      const companyId = "company-123";
      const remainingModels = [{ _id: "2", name: "Remaining" }];

      useModelStore.setState({
        models: [{ _id: "model-456", name: "Delete me" }, ...remainingModels],
        modelsCount: 2
      });

      vi.mocked(axios.delete).mockResolvedValueOnce({
        data: { message: "Success" },
      });

      const { deleteModel } = useModelStore.getState();
      await deleteModel(companyId, "model-456");

      expect(useModelStore.getState().models).toEqual(remainingModels);
      expect(useModelStore.getState().modelsCount).toBe(1);
      expect(axios.get).not.toHaveBeenCalled();
    });
  });

  describe("loading states", () => {
    it("should manage loading state during operations", async () => {
      vi.mocked(axios.get).mockImplementation(
        () =>
          new Promise((resolve) => {
            expect(useModelStore.getState().loading).toBe(true);
            setTimeout(() => resolve({ data: { data: [] } }), 50);
          })
      );

      const { getModels } = useModelStore.getState();
      await getModels("company-123");

      expect(useModelStore.getState().loading).toBe(false);
    });
  });
});

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useSellerStore } from "../../../stores/useSellerStore";
import axios from "../../../lib/axios";
import toast from "react-hot-toast";

// mock dependecies
vi.mock("../../../lib/axios");
vi.mock("react-hot-toast");

describe("useSellerStore", () => {
    beforeEach(() => {
        useSellerStore.setState({
            sellers: [],
            totalPages: 0,
            currentPage: 1,
            isOffline: false,
            lastUpdated: null,
            loading: false,
        });
        vi.clearAllMocks();
    });

    describe("getSellers", () => {
        it("should fetch sellers successfully", async () => {
            const mockSellers = [
                { _id: "1", name: "Seller 1", phone: "1234567890", address: "Address 1" },
                { _id: "2", name: "Seller 2", phone: "1234567891", address: "Address 2" },
            ];

            vi.mocked(axios.get).mockResolvedValueOnce({
                status: 200,
                data: { data: mockSellers, totalPages: 1 },
            });

            const { getAllSellers } = useSellerStore.getState();
            await getAllSellers();

            expect(useSellerStore.getState().sellers).toEqual(mockSellers);
            expect(useSellerStore.getState().loading).toBe(false);
            expect(axios.get).toHaveBeenCalledWith("/api/seller/all?page=1&limit=10");
        });

        it("should handle fetch sellers error", async () => {
            vi.mocked(axios.get).mockRejectedValueOnce({
                message: "Network error",
                response: { data: { message: "Failed to fetch" } },
            });

            const { getAllSellers } = useSellerStore.getState();
            await getAllSellers();

            expect(useSellerStore.getState().sellers).toEqual([]);
            expect(useSellerStore.getState().loading).toBe(false);
            expect(toast.error).toHaveBeenCalledWith("Failed to fetch");
        });
    });
    describe("createSeller", () => {
        it("should create seller successfully", async () => {
            const mockSeller = { _id: "3", storeName: "Store 3", isHidden: false };
            vi.mocked(axios.post).mockResolvedValueOnce({
                status: 201,
                data: { success: true, data: mockSeller }
            });
            const { createSeller } = useSellerStore.getState();
            const result = await createSeller({ storeName: "Store 3" });
            expect(result).toBe(true);
            expect(useSellerStore.getState().sellers[0]).toEqual(mockSeller);
            expect(toast.success).toHaveBeenCalledWith("Seller created successfully!");
        });

        it("should handle error", async () => {
            vi.mocked(axios.post).mockRejectedValueOnce({
                message: "Error",
                response: { data: { message: "Failed" } }
            });
            const { createSeller } = useSellerStore.getState();
            const result = await createSeller({});
            expect(result).toBe(false);
            expect(toast.error).toHaveBeenCalledWith("Failed");
        });
    });

    describe("updateSeller", () => {
        it("should update seller successfully", async () => {
            const mockUpdate = { phoneNo: "222", storeName: "Updated", location: { locationName: "New Loc", latitude: "123", longitude: "456" } };
            const updatedSeller = { _id: "1", ...mockUpdate, isHidden: false };
            useSellerStore.setState({
                sellers: [{ _id: "1", phoneNo: "111", storeName: "Old", location: { locationName: "Old Loc", latitude: "123", longitude: "456" }, isHidden: false } as any]
            });
            vi.mocked(axios.patch).mockResolvedValueOnce({
                status: 200,
                data: { data: updatedSeller }
            });
            const { updateSeller } = useSellerStore.getState();
            const result = await updateSeller("1", mockUpdate);
            expect(result).toBe(true);
            expect(axios.patch).toHaveBeenCalledWith(
                "/api/seller?sellerId=1",
                mockUpdate
            );
            expect(useSellerStore.getState().sellers[0]).toEqual(updatedSeller);
        });
    });

    describe("deleteSeller", () => {
        it("should delete seller successfully", async () => {
            useSellerStore.setState({
                sellers: [{ _id: "1", storeName: "Store 1", isHidden: false } as any]
            });
            vi.mocked(axios.delete).mockResolvedValueOnce({ status: 204 });
            const { deleteSeller } = useSellerStore.getState();
            const result = await deleteSeller("1");
            expect(result).toBe(true);
            expect(useSellerStore.getState().sellers).toEqual([]);
            expect(toast.success).toHaveBeenCalledWith("Seller deleted successfully!");
        });
    });

    describe("hideSeller", () => {
        it("should toggle seller visibility successfully", async () => {
            useSellerStore.setState({
                sellers: [{ _id: "1", isHidden: false } as any]
            });
            vi.mocked(axios.patch).mockResolvedValueOnce({
                status: 200,
                data: { message: "Hidden" }
            });
            const { hideSeller } = useSellerStore.getState();
            const result = await hideSeller("1");
            expect(result).toBe(true);
            expect(useSellerStore.getState().sellers[0].isHidden).toBe(true);
        });
    });
});

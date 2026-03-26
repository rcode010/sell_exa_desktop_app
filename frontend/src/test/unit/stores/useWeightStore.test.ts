import { describe, it, expect, beforeEach, vi } from "vitest";
import { useWeightStore } from "../../../stores/useWeightStore";
import axios from "../../../lib/axios";
import toast from "react-hot-toast";

vi.mock("../../../lib/axios");
vi.mock("react-hot-toast");

describe("useWeightStore", () => {
    beforeEach(() => {
        useWeightStore.setState({
            weights: [],
            loading: false,
            isOffline: false,
            lastUpdated: null,
        });
        vi.clearAllMocks();
    });

    describe("getWeights", () => {
        it("should fetch weights successfully", async () => {
            const mockWeights = [{ _id: "1", price: 10, range: 5 }];
            vi.mocked(axios.get).mockResolvedValueOnce({
                data: { success: true, data: mockWeights }
            });

            const { getWeights } = useWeightStore.getState();
            await getWeights();

            expect(useWeightStore.getState().weights).toEqual(mockWeights);
            expect(axios.get).toHaveBeenCalledWith("/api/weight/all");
        });

        it("should handle error by using fallback to offline mode if data exists", async () => {
            useWeightStore.setState({ weights: [{ _id: "1", price: 10, range: 5 } as any] });
            vi.mocked(axios.get).mockRejectedValueOnce(new Error("Net Error"));
            const { getWeights } = useWeightStore.getState();
            await getWeights();
            expect(useWeightStore.getState().isOffline).toBe(true);
            expect(toast.error).not.toHaveBeenCalled();
        });
    });

    describe("createWeight", () => {
        it("should create weight and fetch again", async () => {
            vi.mocked(axios.post).mockResolvedValueOnce({
                data: { success: true }
            });
            // mock the getWeights call that happens after creation
            vi.mocked(axios.get).mockResolvedValueOnce({
                data: { success: true, data: [{ _id: "1", price: 10, range: 5 }] }
            });

            const { createWeight } = useWeightStore.getState();
            const result = await createWeight({ price: 10, range: 5 });

            expect(result).toBe(true);
            expect(axios.get).toHaveBeenCalled(); // verified getWeights called
            expect(toast.success).toHaveBeenCalledWith("Delivery price created successfully");
        });
    });

    describe("updateWeight", () => {
        it("should update weight optimistically", async () => {
            useWeightStore.setState({
                weights: [{ _id: "1", price: 10, range: 5 } as any]
            });
            vi.mocked(axios.patch).mockResolvedValueOnce({
                data: { success: true }
            });

            const { updateWeight } = useWeightStore.getState();
            const result = await updateWeight("1", { price: 20 });
            expect(result).toBe(true);
            expect(useWeightStore.getState().weights[0].price).toBe(20);
            expect(toast.success).toHaveBeenCalledWith("Delivery price updated successfully");
        });
    });

    describe("deleteWeight", () => {
        it("should delete weight optimistically", async () => {
            useWeightStore.setState({
                weights: [{ _id: "1", price: 10, range: 5 } as any]
            });
            vi.mocked(axios.delete).mockResolvedValueOnce({
                data: { success: true }
            });

            const { deleteWeight } = useWeightStore.getState();
            const result = await deleteWeight("1");
            expect(result).toBe(true);
            expect(useWeightStore.getState().weights).toEqual([]);
            expect(toast.success).toHaveBeenCalledWith("Delivery price deleted successfully");
        });
    });
});

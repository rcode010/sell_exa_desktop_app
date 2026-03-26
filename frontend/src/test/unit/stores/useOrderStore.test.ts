import { describe, it, expect, beforeEach, vi } from "vitest";
import { useOrderStore } from "../../../stores/useOrderStore";
import axios from "../../../lib/axios";
import toast from "react-hot-toast";

vi.mock("../../../lib/axios");
vi.mock("react-hot-toast");

describe("useOrderStore", () => {
    beforeEach(() => {
        useOrderStore.setState({
            orders: [],
            totalPages: 1,
            currentPage: 1,
            loading: false,
            isOffline: false,
            lastUpdated: null,
        });
        vi.clearAllMocks();
    });

    describe("getOrders", () => {
        it("should fetch orders successfully and map them correctly", async () => {
            const rawApiData = [{
                _id: "order1",
                buyerId: { firstName: "John", lastName: "Doe" },
                products: [{
                    productId: {
                        _id: "prod1",
                        name: { english: "Prod Eng" },
                        price: 100,
                        sellerId: { storeName: "Super Store" }
                    },
                    quantity: 2
                }],
                createdAt: "2023-01-01",
                totalPrice: 200,
                status: "Pending"
            }];

            vi.mocked(axios.get).mockResolvedValueOnce({
                data: { data: rawApiData, totalPages: 1 }
            });

            const { getOrders } = useOrderStore.getState();
            await getOrders();

            const orders = useOrderStore.getState().orders;
            expect(orders.length).toBe(1);
            expect(orders[0]).toEqual({
                _id: "order1",
                buyer: "John Doe",
                seller: "Super Store",
                date: new Date("2023-01-01").toLocaleDateString(),
                products: [{
                    productId: "prod1",
                    name: "Prod Eng",
                    price: 100,
                    quantity: 2
                }],
                total: 200,
                status: "Pending"
            });
        });

        it("should handle offline fallback on error if data exists", async () => {
            useOrderStore.setState({ orders: [{ _id: "1" } as any] });
            vi.mocked(axios.get).mockRejectedValueOnce(new Error("Net Error"));

            const { getOrders } = useOrderStore.getState();
            await getOrders();

            expect(useOrderStore.getState().isOffline).toBe(true);
            expect(toast.error).not.toHaveBeenCalled();
        });
    });

    describe("changeOrderStatus", () => {
        it("should update order status optimistically", async () => {
            useOrderStore.setState({
                orders: [{ _id: "1", status: "Pending" } as any]
            });
            vi.mocked(axios.patch).mockResolvedValueOnce({});

            const { changeOrderStatus } = useOrderStore.getState();
            const result = await changeOrderStatus("1", "Processing");

            expect(result).toBe(true);
            expect(useOrderStore.getState().orders[0].status).toBe("Processing");
            expect(axios.patch).toHaveBeenCalledWith(
                "/api/order",
                { status: "Processing" },
                { params: { orderId: "1" } }
            );
            expect(toast.success).toHaveBeenCalledWith("Order status updated");
        });
    });

    describe("deleteOrder", () => {
        it("should delete order optimistically", async () => {
            useOrderStore.setState({
                orders: [{ _id: "1", status: "Pending" } as any]
            });
            vi.mocked(axios.delete).mockResolvedValueOnce({});

            const { deleteOrder } = useOrderStore.getState();
            const result = await deleteOrder("1");

            expect(result).toBe(true);
            expect(useOrderStore.getState().orders).toEqual([]);
            expect(axios.delete).toHaveBeenCalledWith("/api/order", { headers: { "order-id": "1" } });
            expect(toast.success).toHaveBeenCalledWith("Order deleted");
        });
    });
});

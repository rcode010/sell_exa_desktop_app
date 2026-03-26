import { describe, it, expect, beforeEach, vi } from "vitest";
import { useProductStore } from "../../../stores/useProductStore";
import axios from "../../../lib/axios";
import toast from "react-hot-toast";

vi.mock("../../../lib/axios");
vi.mock("react-hot-toast");

describe("useProductStore", () => {
    beforeEach(() => {
        useProductStore.setState({
            products: [],
            totalPages: 1,
            currentPage: 1,
            loading: false,
            isOffline: false,
            lastUpdated: null,
        });
        vi.clearAllMocks();
    });

    describe("getProducts", () => {
        it("should fetch products successfully", async () => {
            const mockProducts = [{ _id: "1", name: "Prod 1" }];
            vi.mocked(axios.get).mockResolvedValueOnce({
                status: 200,
                data: { data: mockProducts, totalPages: 2 }
            });

            const { getProducts } = useProductStore.getState();
            await getProducts(1, 10, "search");

            expect(useProductStore.getState().products).toEqual(mockProducts);
            expect(useProductStore.getState().totalPages).toBe(2);
            expect(axios.get).toHaveBeenCalledWith("/api/product/all?page=1&limit=10&searchInput=search");
        });

        it("should handle error by using fallback to offline mode if data exists", async () => {
            useProductStore.setState({ products: [{ _id: "1", name: "Prod 1" } as any] });
            vi.mocked(axios.get).mockRejectedValueOnce(new Error("Net Error"));
            const { getProducts } = useProductStore.getState();
            await getProducts();
            expect(useProductStore.getState().isOffline).toBe(true);
        });
    });

    describe("createProduct", () => {
        it("should create product optimistically", async () => {
            const newProduct = { _id: "new1", name: "New Prod" };
            vi.mocked(axios.post).mockResolvedValueOnce({
                status: 201,
                data: { data: newProduct }
            });

            const { createProduct } = useProductStore.getState();
            const formData = new FormData();
            const result = await createProduct({ formData, sellerId: "s1", companyId: "c1", modelId: "m1" });

            expect(result).toBe(true);
            expect(useProductStore.getState().products).toContainEqual(newProduct);
            expect(axios.post).toHaveBeenCalledWith(
                "/api/product/?sellerId=s1&companyId=c1&modelId=m1",
                formData,
                expect.any(Object)
            );
            expect(toast.success).toHaveBeenCalledWith("Product created successfully!");
        });
    });

    describe("updateProduct", () => {
        it("should update product optimistically", async () => {
            useProductStore.setState({ products: [{ _id: "1", price: 10, name: "Old Prod" } as any] });
            const updatedProduct = { _id: "1", price: 20, name: "Old Prod" };
            vi.mocked(axios.patch).mockResolvedValueOnce({ status: 200, data: { data: updatedProduct } });

            const { updateProduct } = useProductStore.getState();
            const result = await updateProduct("1", { price: 20 });
            expect(result).toBe(true);
            expect(axios.patch).toHaveBeenCalledWith("/api/product/?productId=1", { price: 20 });
            expect(useProductStore.getState().products[0].price).toBe(20);
            expect(toast.success).toHaveBeenCalledWith("Product updated successfully!");
        });
    });

    describe("deleteProduct", () => {
        it("should delete product optimistically", async () => {
            useProductStore.setState({ products: [{ _id: "1", name: "Prod" } as any] });
            vi.mocked(axios.delete).mockResolvedValueOnce({ status: 200, data: { success: true } });

            const { deleteProduct } = useProductStore.getState();
            const result = await deleteProduct("1");
            expect(result).toBe(true);
            expect(toast.success).toHaveBeenCalledWith("Product deleted successfully!");
            expect(useProductStore.getState().products).toEqual([]);
        });
    });

    describe("hideProduct", () => {
        it("should toggle product visibility optimistically", async () => {
            useProductStore.setState({ products: [{ _id: "1", isHidden: true } as any] });
            const toggledProduct = { _id: "1", isHidden: false };
            vi.mocked(axios.patch).mockResolvedValueOnce({ status: 200, data: { message: "Toggled", data: toggledProduct } });

            const { hideProduct } = useProductStore.getState();
            const result = await hideProduct("1");
            expect(result).toBe(true);
            expect(toast.success).toHaveBeenCalledWith("Toggled");
            expect(useProductStore.getState().products[0].isHidden).toBe(false);
        });
    });

    describe("getProductById", () => {
        it("should map product to ProductDetails successfully", async () => {
            const rawApiData = {
                name: { english: "Test Engine" },
                description: "Good engine",
                company: "Toyota",
                model: "Camry",
                seller: "Seller A",
                images: [{ imageLink: "img.jpg" }],
                price: 1500,
                weight: 100,
                quality: "New",
                city: "Erbil",
                createdAt: "2023",
                updatedAt: "2023"
            };

            vi.mocked(axios.get).mockResolvedValueOnce({
                status: 200,
                data: { data: rawApiData }
            });

            const { getProductById } = useProductStore.getState();
            const details = await getProductById("1");

            expect(details).toEqual({
                name: "Test Engine",
                description: "Good engine",
                company: "Toyota",
                model: "Camry",
                seller: "Seller A",
                imageLink: "img.jpg",
                price: 1500,
                weight: 100,
                quality: "New",
                city: "Erbil",
                createdAt: "2023",
                updatedAt: "2023"
            });
        });

        it("should return null on error", async () => {
            vi.mocked(axios.get).mockRejectedValueOnce(new Error("Error"));
            const { getProductById } = useProductStore.getState();
            const details = await getProductById("1");
            expect(details).toBeNull();
        });
    });
});

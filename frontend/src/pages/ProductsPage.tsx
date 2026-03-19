import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Eye, EyeOff, Package, RefreshCw } from "lucide-react";
import { Product } from "../types/product";
import AddProductModal from "../components/product/AddProductModal";
import EditProductModal from "../components/product/EditProductModal";
import HiddenProductsModal from "../components/product/HiddenProductsModal";
import { useProductStore } from "../stores/useProductStore";
import { useUserStore } from "../stores/useUserStore";
import Loader from "../components/ui/Loader";
import { useDebounce } from "../hooks/useDebounce";
import Pagination from "../components/ui/Pagination";

const ITEMS_PER_PAGE = 10;

const ProductsPage = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHiddenModalOpen, setIsHiddenModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const isHydrated: boolean = useUserStore((state) => state.isHydrated);
  const accessToken: string = useUserStore((state) => state.accessToken);

  const loading: boolean = useProductStore((state) => state.loading);
  const products: Product[] = useProductStore((state) => state.products);
  const totalPages: number = useProductStore((state) => state.totalPages);
  const isOffline: boolean = useProductStore((state) => state.isOffline);
  const getProducts = useProductStore((state) => state.getProducts);

  const debouncedSearch = useDebounce(search, 300);

  const filteredProducts: Product[] = useMemo(() => {
    if (!debouncedSearch) return products;

    const value = debouncedSearch.toLowerCase();
    return products.filter((product) => {
      return (
        product.name.english.toLowerCase().includes(value) ||
        product.quality.toLowerCase().includes(value)
      );
    });
  }, [products, debouncedSearch]);

  // Fetch products on mount or when page/search changes
  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setIsFetching(true);
      await getProducts(currentPage, ITEMS_PER_PAGE, debouncedSearch);
      if (mounted) setIsFetching(false);
    };

    if (isHydrated && accessToken) {
      fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, accessToken, currentPage, debouncedSearch]);

  const refresh = async () => {
    setIsFetching(true);
    await getProducts(currentPage, ITEMS_PER_PAGE, debouncedSearch);
    setIsFetching(false);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">View and manage products</p>
        </div>
        <div className="flex gap-3">
          <button
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setIsHiddenModalOpen(true)}
            disabled={isOffline}
            title={isOffline ? "Unavailable in offline mode" : "View hidden products"}
          >
            <EyeOff className="w-5 h-5" />
            <span className="hidden sm:inline">View Hidden Products</span>
          </button>
          <button
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setIsAddModalOpen(true)}
            disabled={isOffline}
            title={isOffline ? "Unavailable in offline mode" : "Add new product"}
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Total Products (Page)</p>
          <h3 className="text-3xl font-bold mt-2 text-gray-900">
            {products.length}
          </h3>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Table Header */}
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900">All Products</h2>
            {isFetching && (
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full animate-pulse">
                Loading...
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Refresh Button */}
            <button
              onClick={refresh}
              disabled={isFetching}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Refresh orders"
            >
              <RefreshCw
                className={`w-5 h-5 text-gray-600 ${isFetching ? "animate-spin" : ""
                  }`}
              />
            </button>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading && products.length === 0 ? (
            <div className="overflow-hidden">
              <Loader />
            </div>
          ) : (
            <table className={`w-full transition-opacity duration-200 ${isFetching ? "opacity-50 pointer-events-none" : ""}`}>
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quality
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {product.name.english}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {product.quality}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {product.price.toLocaleString()} IQD
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && products.length > 0 && (
          <div className={isFetching ? "opacity-50 pointer-events-none" : ""}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {isAddModalOpen && (
          <AddProductModal onClose={() => setIsAddModalOpen(false)} />
        )}

        {isEditModalOpen && selectedProduct && (
          <EditProductModal
            product={selectedProduct}
            onClose={() => setIsEditModalOpen(false)}
          />
        )}

        {isHiddenModalOpen && (
          <HiddenProductsModal onClose={() => setIsHiddenModalOpen(false)} />
        )}

        {!loading && !isFetching && filteredProducts.length === 0 && !search && (
          <div className="py-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No products to show.</p>
          </div>
        )}

        {!loading && !isFetching && filteredProducts.length === 0 && search && (
          <div className="py-12 text-center">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              No products found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;

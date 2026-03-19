import React, { useEffect, useMemo, useState } from "react";
import { Package, Search, RefreshCw } from "lucide-react";
import OrderDetailsModal from "../components/order/OrderDetailsModal";
import ManageDeliveryPricesModal from "../components/order/ManageDeliveryPricesModal";
import OrderInstance from "../components/order/OrderInstance";
import { Order } from "../types/order";
import { useOrderStore } from "../stores/useOrderStore.ts";
import Loader from "../components/ui/Loader.tsx";
import { useDebounce } from "../hooks/useDebounce";
import Pagination from "../components/ui/Pagination";

const ITEMS_PER_PAGE = 10;

const ORDER_TABLE_HEADERS: { label: string }[] = [
  { label: "Order #" },
  { label: "Buyer" },
  { label: "Seller" },
  { label: "Date" },
  { label: "Items" },
  { label: "Total" },
  { label: "Status" },
  { label: "Actions" },
];

const OrdersPage = () => {
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManagePricesOpen, setIsManagePricesOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const orders = useOrderStore((state) => state.orders);
  const loading = useOrderStore((state) => state.loading);
  const isOffline = useOrderStore((state) => state.isOffline);
  const getOrders = useOrderStore((state) => state.getOrders);
  const changeOrderStatus = useOrderStore((state) => state.changeOrderStatus);

  // Fetch orders on mount
  useEffect(() => {
    getOrders();
  }, [getOrders]);

  const debouncedSearch = useDebounce(search, 300);

  const filteredOrders: Order[] = useMemo(() => {
    const value = debouncedSearch.toLowerCase();

    return orders.filter((order) => {
      return (
        order._id.toLowerCase().includes(value) ||
        order.buyer.toLowerCase().includes(value) ||
        order.seller.toLowerCase().includes(value) ||
        order.status.toLowerCase().includes(value)
      );
    });
  }, [debouncedSearch, orders]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const refresh = async (): Promise<void> => {
    setIsRefreshing(true);
    await getOrders();
    setIsRefreshing(false);
  };

  const handleStatusUpdate = async (
    orderId: string,
    status: Order["status"],
  ): Promise<void> => {
    await changeOrderStatus(orderId, status);
    // Sync the selected order in the modal with the new status
    if (selectedOrder?._id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">Manage buyer orders</p>
        </div>
        <button
          onClick={() => setIsManagePricesOpen(true)}
          disabled={isOffline}
          title={isOffline ? "Unavailable in offline mode" : "Manage delivery prices"}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Package className="w-5 h-5" />
          Manage Weight Prices
        </button>
      </div>

      {/* Orders Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Table Header */}
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900">All Orders</h2>

          <div className="flex items-center gap-3">
            {/* Refresh Button */}
            <button
              onClick={refresh}
              disabled={isRefreshing || loading}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Refresh orders"
            >
              <RefreshCw
                className={`w-5 h-5 text-gray-600 ${isRefreshing || loading ? "animate-spin" : ""
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

        {/* Table Body */}
        <div className="overflow-x-auto">
          {loading || isRefreshing ? (
            <Loader />
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {ORDER_TABLE_HEADERS.map((header, index) => (
                    <th
                      key={index}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedOrders.map((order) => (
                  <OrderInstance
                    key={order._id}
                    order={order}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && !isRefreshing && filteredOrders.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        {/* No Orders */}
        {!loading && !isRefreshing && filteredOrders.length === 0 && !search && (
          <div className="py-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No Orders to Show.</p>
          </div>
        )}

        {/* Empty Search Result */}
        {!loading && !isRefreshing && filteredOrders.length === 0 && search && (
          <div className="py-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              No orders found matching your search.
            </p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {isModalOpen && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onStatusUpdate={handleStatusUpdate}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedOrder(null);
          }}
        />
      )}

      {/* Manage Weight Prices Modal */}
      {isManagePricesOpen && (
        <ManageDeliveryPricesModal
          onClose={() => setIsManagePricesOpen(false)}
        />
      )}
    </div>
  );
};

export default OrdersPage;

import React, { useMemo, useState } from "react";
import { Package, Search, RefreshCw } from "lucide-react";
import OrderDetailsModal from "../components/order/OrderDetailsModal";
import OrderInstance from "../components/order/OrderInstance";
import { Order } from "../types/order";
import { useOrderStore } from "../stores/useOrderStore.ts";
import Loader from "../components/ui/Loader.tsx";

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

const orders: Order[] = [
  {
    orderId: 1,
    buyer: "John Doe",
    seller: "AutoParts Inc",
    date: "11/15/2025",
    products: [
      {
        productId: 1,
        quantity: 4,
      },
      {
        productId: 2,
        quantity: 2,
      },
    ],
    total: 1250,
    status: "pending",
  },
  {
    orderId: 2,
    buyer: "Jane Smith",
    seller: "CarPro Supply",
    date: "11/16/2025",
    products: [
      {
        productId: 2,
        quantity: 2,
      },
    ],
    total: 875,
    status: "shipped",
  },
  {
    orderId: 3,
    buyer: "Bob Johnson",
    seller: "AutoParts Inc",
    date: "11/17/2025",
    products: [
      {
        productId: 3,
        quantity: 2,
      },
      {
        productId: 4,
        quantity: 1,
      },
      {
        productId: 5,
        quantity: 3,
      },
    ],
    total: 2100,
    status: "processing",
  },
];

const OrdersPage = () => {
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { loading } = useOrderStore() as { loading: boolean };

  const filteredOrders: Order[] = useMemo(() => {
    const value = search.toLowerCase();

    return orders.filter((order) => {
      return (
        order.orderId.toString().includes(value) ||
        order.buyer.toLowerCase().includes(value) ||
        order.seller.toLowerCase().includes(value) ||
        order.status.toLowerCase().includes(value)
      );
    });
  }, [search]);

  const refresh = (): void => {
    setIsRefreshing(true);
    setTimeout(() => {
      location.reload();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">Manage buyer orders</p>
        </div>
      </div>

      {/* Orders Table Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Table Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">All Orders</h2>

          <div className="flex items-center gap-3">
            {/* Refresh Button */}
            <button
              onClick={refresh}
              disabled={isRefreshing}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Refresh orders"
            >
              <RefreshCw
                className={`w-5 h-5 text-gray-600 ${
                  isRefreshing ? "animate-spin" : ""
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
          {loading ? (
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
                {filteredOrders.map((order, index) => (
                  <OrderInstance
                    key={index}
                    order={order}
                    onViewDetails={() => {
                      setSelectedOrder(order);
                      setIsModalOpen(true);
                    }}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* No Orders Message */}
        {filteredOrders.length === 0 && !search && (
          <div className="py-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No Orders to Show.</p>
          </div>
        )}

        {/* Empty Search Result Message */}
        {filteredOrders.length === 0 && search && (
          <div className="py-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              No orders found matching your search.
            </p>
          </div>
        )}
      </div>

      {/* Modal rendered as an overlay on top of the page | only when open*/}
      {isModalOpen && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default OrdersPage;

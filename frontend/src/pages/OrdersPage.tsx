import React, { useState, useMemo } from "react";
import { Eye, Search } from "lucide-react";
import OrderDetailsModal from "../components/OrderDetailsModal";
import { Order } from "../types/order";

// Mock data
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
    status: "delivered",
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
  {
    orderId: 4,
    buyer: "Alice Brown",
    seller: "PartsWorld",
    date: "11/17/2025",
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
    total: 450,
    status: "pending",
  },
  {
    orderId: 5,
    buyer: "Charlie Davis",
    seller: "CarPro Supply",
    date: "11/18/2025",
    products: [
      {
        productId: 1,
        quantity: 4,
      },
    ],
    total: 1680,
    status: "processing",
  },
  {
    orderId: 6,
    buyer: "Eva Wilson",
    seller: "AutoParts Inc",
    date: "11/18/2025",
    products: [
      {
        productId: 1,
        quantity: 2,
      },
      {
        productId: 2,
        quantity: 2,
      },
    ],
    total: 320,
    status: "cancelled",
  },
  {
    orderId: 7,
    buyer: "Frank Miller",
    seller: "PartsWorld",
    date: "11/19/2025",
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
    total: 1950,
    status: "delivered",
  },
  {
    orderId: 8,
    buyer: "Grace Lee",
    seller: "CarPro Supply",
    date: "11/19/2025",
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
    total: 780,
    status: "shipped",
  },
];

// Get styles for given status
const getStatusStyles = (status: Order["status"]) => {
  const styles = {
    delivered: "bg-green-100 text-green-700",
    shipped: "bg-purple-100 text-purple-700",
    processing: "bg-blue-100 text-blue-700",
    pending: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return styles[status];
};

const OrdersPage = () => {
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtering doesn't mutate the original data but derives a new one from it
  /**
   *
   * Memoization: The process of reusing previously computed results to avoid unnecessary re-computations. Similar to caching but for react components
   *
   * With useMemo we tell react to re-render the table of orders only when the 'search' variable changes (when user types something).
   *
   * @see https://react.dev/reference/react/useMemo
   */

  const filteredOrders = useMemo(() => {
    const value = search.toLowerCase(); // The searched value

    // If either orderId, buyer, seller, or status has the value searched, return the order
    return orders.filter((order) => {
      return (
        order.orderId.toString().includes(value) ||
        order.buyer.toLowerCase().includes(value) ||
        order.seller.toLowerCase().includes(value) ||
        order.status.toLowerCase().includes(value)
      );
    });
  }, [search]);

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

          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value.toLowerCase())}
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Buyer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const items = order.products.length;

                return (
                  <tr
                    key={order.orderId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.orderId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.buyer}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.seller}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{items}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${order.total.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusStyles(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsModalOpen(true);
                        }}
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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

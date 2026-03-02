import React, { useState } from "react";
import { X, User, Building2, Calendar, DollarSign } from "lucide-react";
import { Order, OrderStatus } from "../../types/order";

// Helper to get status badge styles
const getStatusStyles = (status: OrderStatus) => {
  const styles: Record<OrderStatus, string> = {
    Delivered: "bg-green-100 text-green-700 border-green-200",
    Shipped: "bg-purple-100 text-purple-700 border-purple-200",
    Processing: "bg-blue-100 text-blue-700 border-blue-200",
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Cancelled: "bg-red-100 text-red-700 border-red-200",
  };

  return styles[status];
};

const OrderDetailsModal = ({
  order,
  onStatusUpdate,
  onClose,
}: {
  order: Order;
  onStatusUpdate: (orderId: string, status: OrderStatus) => Promise<void>;
  onClose: () => void;
}) => {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(
    order.status,
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async () => {
    // Skip the API call if status hasn't changed
    if (currentStatus === order.status) {
      onClose();
      return;
    }

    setIsUpdating(true);
    await onStatusUpdate(order._id, currentStatus);
    setIsUpdating(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <p className="text-sm text-gray-500 mt-1">Order #{order._id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Order Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Buyer */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Buyer</p>
                <p className="text-base font-semibold text-gray-900">
                  {order.buyer}
                </p>
              </div>
            </div>

            {/* Seller */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Building2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Seller</p>
                <p className="text-base font-semibold text-gray-900">
                  {order.seller}
                </p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Order Date</p>
                <p className="text-base font-semibold text-gray-900">
                  {order.date}
                </p>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Total Amount
                </p>
                <p className="text-base font-semibold text-gray-900">
                  ${order.total.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Products
            </h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.products.map((product, index) => {
                    const subtotal = product.price * product.quantity;

                    return (
                      <tr key={index} className="bg-white">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          ${product.price.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {product.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          ${subtotal.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Status Update Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Update Order Status
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {(
                [
                  "Pending",
                  "Processing",
                  "Shipped",
                  "Delivered",
                  "Cancelled",
                ] as const
              ).map((status) => (
                <button
                  key={status}
                  onClick={() => setCurrentStatus(status)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all cursor-pointer ${currentStatus === status
                    ? getStatusStyles(status)
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleStatusUpdate}
            disabled={isUpdating}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;

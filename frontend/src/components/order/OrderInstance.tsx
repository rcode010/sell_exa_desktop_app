import React, { memo, useMemo } from "react";
import { Order, OrderStatus } from "../../types/order";
import { Eye } from "lucide-react";

// Helper | Get styles for given status
const getStatusStyles = (status: OrderStatus) => {
  const styles: Record<OrderStatus, string> = {
    Delivered: "bg-green-100 text-green-700",
    Shipped: "bg-purple-100 text-purple-700",
    Processing: "bg-blue-100 text-blue-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return styles[status];
};

const OrderInstance = memo(({
  order,
  onViewDetails,
}: {
  order: Order;
  onViewDetails: (order: Order) => void;
}) => {
  const itemCount: number = order.products.length;

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-mono font-medium text-gray-900">
          #{order._id.slice(-6).toUpperCase()}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{order.buyer}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{order.seller}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{order.date}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{itemCount}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {order.total.toLocaleString()} IQD
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusStyles(
            order.status,
          )}`}
        >
          {order.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          onClick={() => onViewDetails(order)}
        >
          <Eye className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
});

export default OrderInstance;

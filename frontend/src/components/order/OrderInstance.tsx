import React from "react";
import { Order } from "../../types/order";
import { Eye } from "lucide-react";

// Helper | Get styles for given status
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

const OrderInstance = ({
  order,
  onViewDetails,
}: {
  order: Order;
  onViewDetails: () => void;
}) => {
  const items: number = order.products.length;

  return (
    <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{order.orderId}</div>
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
          onClick={() => onViewDetails()}
        >
          <Eye className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
};

export default OrderInstance;

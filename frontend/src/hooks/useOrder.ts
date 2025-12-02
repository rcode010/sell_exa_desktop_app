import { useState, useMemo } from "react";
import { Order } from "../types/order";
import { useSearch } from "./useSearch";

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

export const useOrder = () => {
  const { search } = useSearch();
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

  const filteredOrders: Order[] = useMemo(() => {
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

  return {
    filteredOrders,
    selectedOrder,
    setSelectedOrder,
    isModalOpen,
    setIsModalOpen,
  };
};

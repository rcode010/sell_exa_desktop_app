import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Clock,
  User,
  Package,
  ShoppingCart,
  Building2,
  Trash2,
  Edit,
  Plus,
} from "lucide-react";

interface Log {
  id: string;
  adminName: string;
  action: string;
  actionType:
  | "order"
  | "product"
  | "company"
  | "seller"
  | "delete"
  | "edit"
  | "add";
  details: string;
  timestamp: Date;
}

// Mock logs data
const MOCK_LOGS: Log[] = [
  {
    id: "1",
    adminName: "Admin User",
    action: "Changed order status",
    actionType: "order",
    details: "Changed order #1234 from 'pending' to 'processing'",
    timestamp: new Date(Date.now() - 300000), // 5 min ago
  },
  {
    id: "2",
    adminName: "John Doe",
    action: "Added new product",
    actionType: "add",
    details: "Added product 'Brake Pads Set' to inventory",
    timestamp: new Date(Date.now() - 900000), // 15 min ago
  },
  {
    id: "3",
    adminName: "Admin User",
    action: "Deleted company",
    actionType: "delete",
    details: "Deleted company 'AutoParts Inc' and all associated data",
    timestamp: new Date(Date.now() - 1800000), // 30 min ago
  },
  {
    id: "4",
    adminName: "Sarah Smith",
    action: "Updated seller information",
    actionType: "edit",
    details: "Updated seller 'Michael Johnson' contact information",
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
  },
  {
    id: "5",
    adminName: "Admin User",
    action: "Changed order status",
    actionType: "order",
    details: "Changed order #5678 from 'processing' to 'shipped'",
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
  },
  {
    id: "6",
    adminName: "John Doe",
    action: "Added new company",
    actionType: "add",
    details: "Added company 'Speed Parts Co' to the system",
    timestamp: new Date(Date.now() - 10800000), // 3 hours ago
  },
  {
    id: "7",
    adminName: "Sarah Smith",
    action: "Deleted product",
    actionType: "delete",
    details: "Deleted product 'Old Oil Filter' from inventory",
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
  },
  {
    id: "8",
    adminName: "Admin User",
    action: "Updated product price",
    actionType: "edit",
    details: "Updated price for 'Engine Oil Filter' from 40,000 IQD to 45,000 IQD",
    timestamp: new Date(Date.now() - 172800000), // 2 days ago
  },
];

const LogsPage = () => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  // Format timestamp
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // Get action icon
  const getActionIcon = (type: Log["actionType"]) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case "order":
        return <ShoppingCart className={iconClass} />;
      case "product":
        return <Package className={iconClass} />;
      case "company":
        return <Building2 className={iconClass} />;
      case "seller":
        return <User className={iconClass} />;
      case "add":
        return <Plus className={iconClass} />;
      case "edit":
        return <Edit className={iconClass} />;
      case "delete":
        return <Trash2 className={iconClass} />;
      default:
        return <Clock className={iconClass} />;
    }
  };

  // Get action color
  const getActionColor = (type: Log["actionType"]) => {
    switch (type) {
      case "add":
        return "bg-green-100 text-green-700";
      case "edit":
        return "bg-blue-100 text-blue-700";
      case "delete":
        return "bg-red-100 text-red-700";
      case "order":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Filter logs
  const filteredLogs = useMemo(() => {
    let filtered = MOCK_LOGS;

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((log) => log.actionType === filterType);
    }

    // Filter by search
    if (search) {
      const value = search.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.adminName.toLowerCase().includes(value) ||
          log.action.toLowerCase().includes(value) ||
          log.details.toLowerCase().includes(value)
      );
    }

    return filtered;
  }, [search, filterType]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
          <p className="text-gray-500 mt-1">
            Track all admin actions and changes
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Total Logs</p>
          <h3 className="text-3xl font-bold mt-2 text-gray-900">
            {MOCK_LOGS.length}
          </h3>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Today</p>
          <h3 className="text-3xl font-bold mt-2 text-gray-900">
            {
              MOCK_LOGS.filter((log) => {
                const today = new Date();
                return log.timestamp.toDateString() === today.toDateString();
              }).length
            }
          </h3>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">This Week</p>
          <h3 className="text-3xl font-bold mt-2 text-gray-900">
            {
              MOCK_LOGS.filter((log) => {
                const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                return log.timestamp > weekAgo;
              }).length
            }
          </h3>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Active Admins</p>
          <h3 className="text-3xl font-bold mt-2 text-gray-900">
            {new Set(MOCK_LOGS.map((log) => log.adminName)).size}
          </h3>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Actions</option>
              <option value="order">Orders</option>
              <option value="add">Additions</option>
              <option value="edit">Updates</option>
              <option value="delete">Deletions</option>
            </select>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search logs..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
            />
          </div>
        </div>

        {/* Logs List */}
        <div className="divide-y divide-gray-200">
          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                No logs found matching your criteria
              </p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div
                    className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${getActionColor(
                      log.actionType
                    )}`}
                  >
                    {getActionIcon(log.actionType)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {log.action}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {log.details}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <User className="w-3 h-3" />
                            {log.adminName}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {formatTime(log.timestamp)}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getActionColor(
                          log.actionType
                        )}`}
                      >
                        {log.actionType}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LogsPage;

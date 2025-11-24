import React, { useState, useMemo } from "react";
import { Plus, Search, Eye, Mail, Phone } from "lucide-react";

// --- Global Mock Data ---
const STATS_DATA = {
  totalSellers: 6,
  activeSellers: 4,
  pendingApproval: 1,
};

const SELLERS_DATA = [
  {
    id: 1,
    name: "Michael Johnson",
    company: "AutoParts Inc",
    email: "michael@autoparts.com",
    phone: "(555) 123-4567",
    sales: "$125,000",
    status: "active",
    joined: "1/15/2024",
  },
  {
    id: 2,
    name: "Sarah Williams",
    company: "CarPro Supply",
    email: "sarah@carpro.com",
    phone: "(555) 234-5678",
    sales: "$98,000",
    status: "active",
    joined: "3/22/2024",
  },
  {
    id: 3,
    name: "David Chen",
    company: "PartsWorld",
    email: "david@partsworld.com",
    phone: "(555) 345-6789",
    sales: "$156,000",
    status: "active",
    joined: "11/10/2023",
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    company: "Quality Auto",
    email: "emily@qualityauto.com",
    phone: "(555) 456-7890",
    sales: "$45,000",
    status: "pending",
    joined: "11/1/2025",
  },
  {
    id: 5,
    name: "James Taylor",
    company: "Speed Parts Co",
    email: "james@speedparts.com",
    phone: "(555) 567-8901",
    sales: "$87,000",
    status: "active",
    joined: "6/18/2024",
  },
  {
    id: 6,
    name: "Lisa Anderson",
    company: "Premium Parts",
    email: "lisa@premiumparts.com",
    phone: "(555) 678-9012",
    sales: "$12,000",
    status: "inactive",
    joined: "9/5/2024",
  },
];

const SellersPage = () => {
  const [search, setSearch] = useState("");

  const filteredSellers = useMemo(() => {
    const value = search.toLowerCase();

    return SELLERS_DATA.filter((seller) => {
      return (
        seller.name.toLowerCase().includes(value) ||
        seller.company.toLowerCase().includes(value) ||
        seller.email.toLowerCase().includes(value) ||
        seller.phone.toLowerCase().includes(value) ||
        seller.sales.toLowerCase().includes(value) ||
        seller.status.toLowerCase().includes(value) ||
        seller.joined.toLowerCase().includes(value)
      );
    });
  }, [search]);

  // Helper to get status badge styles
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "inactive":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* --- Page Header --- */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sellers</h1>
          <p className="text-gray-500 mt-1">
            Manage seller accounts and performance
          </p>
        </div>
        <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
          <Plus size={20} />
          <span>Add Seller</span>
        </button>
      </div>

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Total Sellers</p>
          <h3 className="text-3xl font-semibold mt-2 text-gray-900">
            {STATS_DATA.totalSellers}
          </h3>
        </div>
        {/* Card 2 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Active Sellers</p>
          <h3 className="text-3xl font-semibold mt-2 text-gray-900">
            {STATS_DATA.activeSellers}
          </h3>
        </div>
        {/* Card 3 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Pending Approval</p>
          <h3 className="text-3xl font-semibold mt-2 text-gray-900">
            {STATS_DATA.pendingApproval}
          </h3>
        </div>
      </div>

      {/* --- Sellers Table Section --- */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Table Header & Search */}
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">All Sellers</h2>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value.toLowerCase())}
              placeholder="Search sellers..."
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-gray-500 text-xs uppercase font-medium border-b border-gray-100">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Total Sales</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSellers.map((seller) => (
                <tr
                  key={seller.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {seller.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {seller.company}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Mail className="w-3 h-3 text-gray-400" />
                        {seller.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Phone className="w-3 h-3 text-gray-400" />
                        {seller.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {seller.sales}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusStyles(
                        seller.status
                      )}`}
                    >
                      {seller.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {seller.joined}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellersPage;

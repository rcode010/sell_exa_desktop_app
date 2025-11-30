import React, { useState, useMemo } from "react";
import { Plus, Search, Eye, Phone, Users } from "lucide-react";
import { Seller } from "../types/seller";
import AddSellerModal from "../components/AddSellerModal";
import EditSellerModal from "../components/EditSellerModal";

// Mock data
const SELLERS_DATA: Seller[] = [
  {
    id: 1,
    name: "Michael Johnson",
    company: "AutoParts Inc",
    phone: "07501234567",
    sales: "$125,000",
    joined: "1/15/2024",
  },
  {
    id: 2,
    name: "Sarah Williams",
    company: "CarPro Supply",
    phone: "07501234567",
    sales: "$98,000",
    joined: "3/22/2024",
  },
  {
    id: 3,
    name: "David Chen",
    company: "PartsWorld",
    phone: "07501234567",
    sales: "$156,000",
    joined: "11/10/2023",
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    company: "Quality Auto",
    phone: "07501234567",
    sales: "$45,000",
    joined: "11/1/2025",
  },
  {
    id: 5,
    name: "James Taylor",
    company: "Speed Parts Co",
    phone: "07501234567",
    sales: "$87,000",
    joined: "6/18/2024",
  },
  {
    id: 6,
    name: "Lisa Anderson",
    company: "Premium Parts",
    phone: "07501234567",
    sales: "$12,000",
    joined: "9/5/2024",
  },
];

const SellersPage = () => {
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);

  const filteredSellers = useMemo(() => {
    const value = search.toLowerCase();

    return SELLERS_DATA.filter((seller) => {
      return (
        seller.name.toLowerCase().includes(value) ||
        seller.company.toLowerCase().includes(value) ||
        seller.phone.toLowerCase().includes(value) ||
        seller.sales.toLowerCase().includes(value) ||
        seller.joined.toLowerCase().includes(value)
      );
    });
  }, [search]);

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
        <button
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
          onClick={() => setIsAddModalOpen(true)}
        >
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
            {SELLERS_DATA.length}
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
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Total Sales</th>
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
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Phone className="w-3 h-3 text-gray-400" />
                        {seller.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {seller.sales}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {seller.joined}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                      onClick={() => {
                        setIsEditModalOpen(true);
                        setSelectedSeller(seller);
                      }}
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredSellers.length === 0 && (
          <div className="py-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              No sellers found matching your search.
            </p>
          </div>
        )}
      </div>

      {/* Show add seller modal when open */}
      {isAddModalOpen && (
        <AddSellerModal onClose={() => setIsAddModalOpen(false)} />
      )}

      {/* Show edit seller modal when open */}
      {isEditModalOpen && selectedSeller && (
        <EditSellerModal
          seller={selectedSeller}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default SellersPage;

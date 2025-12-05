import React, { useState } from "react";
import { Package, Plus, Search, Users } from "lucide-react";
import AddSellerModal from "../components/seller/AddSellerModal";
import EditSellerModal from "../components/seller/EditSellerModal";
import { useSellerStore } from "../stores/useSellerStore";
import Loader from "../components/ui/Loader";
import { useSeller } from "../hooks/useSeller";
import SellerInstance from "../components/seller/SellerInstance";
import StatsCard from "../components/ui/StatsCard";
import { Seller } from "../types/seller";

const SellersPage = () => {
  const { loading, sellers } = useSellerStore() as {
    loading: boolean;
    sellers: Seller[];
  };

  const [search, setSearch] = useState("");
  const {
    isAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    setIsAddModalOpen,
    filteredSellers,
    selectedSeller,
  } = useSeller();

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
        <StatsCard statsTitle="Total Sellers" statsValue={sellers.length} />
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
            {loading ? (
              <div className="overflow-hidden">
                <Loader />
              </div>
            ) : (
              <>
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-medium border-b border-gray-100">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSellers.map((seller, index) => (
                    <SellerInstance key={index} seller={seller} />
                  ))}
                </tbody>
              </>
            )}
          </table>
        </div>

        {/* No Orders Message */}
        {filteredSellers.length === 0 && !loading && !search && (
          <div className="py-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No Sellers to Show.</p>
          </div>
        )}

        {/* No sellers found message */}
        {filteredSellers.length === 0 && !loading && search && (
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

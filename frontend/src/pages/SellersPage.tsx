import React, { useEffect, useMemo, useState } from "react";
import { Package, Plus, RefreshCw, Search, Users } from "lucide-react";
import AddSellerModal from "../components/seller/AddSellerModal";
import EditSellerModal from "../components/seller/EditSellerModal";
import { useSellerStore } from "../stores/useSellerStore";
import { useUserStore } from "../stores/useUserStore";
import Loader from "../components/ui/Loader";
import SellerInstance from "../components/seller/SellerInstance";
import StatsCard from "../components/ui/StatsCard";
import { Seller } from "../types/seller";

const SellersPage = () => {
  const { isHydrated, accessToken } = useUserStore();

  const {
    loading,
    sellers,
    getAllSellers,
    createSeller,
    deleteSeller,
    updateSeller,
  } = useSellerStore() as {
    loading: boolean;
    sellers: Seller[];
    getAllSellers: () => Promise<void>;
    createSeller: (seller: Seller) => Promise<void>;
    deleteSeller: (id: string) => Promise<void>;
    updateSeller: (id: string, seller: Seller) => Promise<void>;
  };

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);

  const filteredSellers = useMemo(() => {
    if (!Array.isArray(sellers)) return [];
    const value = search.toLowerCase();

    return sellers.filter(
      (seller) =>
        seller.storeName?.toLowerCase().includes(value) ||
        seller.phoneNo?.toLowerCase().includes(value)
    );
  }, [search, sellers]);

  useEffect(() => {
    if (isHydrated && accessToken) {
      getAllSellers();
    }
  }, [isHydrated, accessToken, getAllSellers]);

  const refresh = async () => {
    setIsRefreshing(true);
    await getAllSellers();
    setIsRefreshing(false);
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sellers</h1>
          <p className="text-gray-500 mt-1">
            Manage seller accounts and performance
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <Plus size={20} />
          Add Seller
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          statsTitle="Total Sellers"
          statsValue={Array.isArray(sellers) ? sellers.length : 0}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">All Sellers</h2>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search sellers..."
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>

            {/* Refresh */}
            <button
              onClick={refresh}
              disabled={isRefreshing}
              title="Refresh sellers"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw
                className={`w-5 h-5 text-gray-600 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            {loading ? (
              <tbody>
                <tr>
                  <td colSpan={3}>
                    <Loader />
                  </td>
                </tr>
              </tbody>
            ) : (
              <>
                <thead className="bg-gray-50 border-b">
                  <tr className="text-xs uppercase text-gray-500">
                    <th className="px-6 py-4 text-left">Name</th>
                    <th className="px-6 py-4 text-left">Contact</th>
                    <th className="px-6 py-4 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {filteredSellers.map((seller) => (
                    <SellerInstance
                      key={seller._id}
                      seller={seller}
                      onViewDetails={() => {
                        setSelectedSeller(seller);
                        setIsEditModalOpen(true);
                      }}
                    />
                  ))}
                </tbody>
              </>
            )}
          </table>
        </div>

        {!loading && filteredSellers.length === 0 && !search && (
          <div className="py-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No sellers to show.</p>
          </div>
        )}

        {!loading && filteredSellers.length === 0 && search && (
          <div className="py-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              No sellers found matching your search.
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {isAddModalOpen && (
        <AddSellerModal
          createSeller={createSeller}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {isEditModalOpen && selectedSeller && (
        <EditSellerModal
          seller={selectedSeller}
          onClose={() => setIsEditModalOpen(false)}
          deleteSeller={async (id) => {
            await deleteSeller(id);
            await getAllSellers();
          }}
          updateSeller={async (id, seller) => {
            await updateSeller(id, seller);
            await getAllSellers();
          }}
        />
      )}
    </div>
  );
};

export default SellersPage;

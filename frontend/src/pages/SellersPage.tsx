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
  // Get global states and actions
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
    // Safety check: ensure sellers is an array
    if (!Array.isArray(sellers)) {
      console.warn("Sellers is not an array:", sellers);
      return [];
    }

    const value = search.toLowerCase();

    return sellers.filter((seller) => {
      return (
        seller.storeName?.toLowerCase().includes(value) ||
        seller.phoneNo?.toLowerCase().includes(value)
      );
    });
  }, [search, sellers]);

  useEffect(() => {
    // Only fetch sellers after store is hydrated and we have a token
    if (isHydrated && accessToken) {
      getAllSellers();
    } else {
      console.log("Store not hydrated or no access token");
    }
  }, [isHydrated, accessToken]);

  const refresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      location.reload();
    }, 500);
  };

  // Show loading state while waiting for hydration
  if (!isHydrated) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen font-sans flex items-center justify-center">
        <Loader />
      </div>
    );
  }

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
        <StatsCard
          statsTitle="Total Sellers"
          statsValue={Array.isArray(sellers) ? sellers.length : 0}
        />
      </div>

      {/* --- Sellers Table Section --- */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">All Sellers</h2>

          <div className="flex items-center gap-3">
            <button
              onClick={refresh}
              disabled={isRefreshing}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Refresh sellers"
            >
              <RefreshCw
                className={`w-5 h-5 text-gray-600 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
            </button>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search sellers..."
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {loading ? (
              <tbody>
                <tr>
                  <td colSpan={4}>
                    <Loader />
                  </td>
                </tr>
              </tbody>
            ) : (
              <>
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-medium border-b border-gray-100">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSellers.map((seller, index) => (
                    <SellerInstance
                      key={index}
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

        {filteredSellers.length === 0 && !loading && !search && (
          <div className="py-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No Sellers to Show.</p>
          </div>
        )}

        {filteredSellers.length === 0 && !loading && search && (
          <div className="py-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              No sellers found matching your search.
            </p>
          </div>
        )}
      </div>

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
          deleteSeller={async (id: string) => {
            await deleteSeller(id);
            await getAllSellers(); // Refresh the list after deletion
          }}
          updateSeller={async (id: string, seller: Seller) => {
            await updateSeller(id, seller);
            await getAllSellers(); // Refresh the list after update
          }}
        />
      )}
    </div>
  );
};

export default SellersPage;

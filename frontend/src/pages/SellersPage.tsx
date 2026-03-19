import React, { useEffect, useMemo, useState } from "react";
import { Package, Plus, RefreshCw, Search, Users, EyeOff } from "lucide-react";
import AddSellerModal from "../components/seller/AddSellerModal";
import EditSellerModal from "../components/seller/EditSellerModal";
import HiddenSellersModal from "../components/seller/HiddenSellersModal";
import { useSellerStore } from "../stores/useSellerStore";
import { useUserStore } from "../stores/useUserStore";
import Loader from "../components/ui/Loader";
import SellerInstance from "../components/seller/SellerInstance";
import StatsCard from "../components/ui/StatsCard";
import { Seller } from "../types/seller";
import { useDebounce } from "../hooks/useDebounce";
import Pagination from "../components/ui/Pagination";

const ITEMS_PER_PAGE = 10;

const SellersPage = () => {
  // Use individual selectors to prevent unnecessary re-renders
  const isHydrated = useUserStore((state) => state.isHydrated);
  const accessToken = useUserStore((state) => state.accessToken);

  const loading = useSellerStore((state) => state.loading);
  const sellers = useSellerStore((state) => state.sellers);
  const totalPages = useSellerStore((state) => state.totalPages);
  const isOffline = useSellerStore((state) => state.isOffline);
  const getAllSellers = useSellerStore((state) => state.getAllSellers);

  const [isFetching, setIsFetching] = useState(false);
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHiddenModalOpen, setIsHiddenModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  const filteredSellers = useMemo(() => {
    if (!debouncedSearch) return sellers;

    const value = debouncedSearch.toLowerCase();
    return sellers.filter(
      (seller) =>
        seller.storeName?.toLowerCase().includes(value) ||
        seller.phoneNo?.toLowerCase().includes(value)
    );
  }, [debouncedSearch, sellers]);

  // Fetch sellers when auth, page, or search changes
  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setIsFetching(true);
      await getAllSellers(currentPage, ITEMS_PER_PAGE, debouncedSearch);
      if (mounted) setIsFetching(false);
    };

    if (isHydrated && accessToken) {
      fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, accessToken, currentPage, debouncedSearch]);

  const refresh = async () => {
    setIsFetching(true);
    await getAllSellers(currentPage, ITEMS_PER_PAGE, debouncedSearch);
    setIsFetching(false);
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader />
      </div>
    );
  }

  const handleViewDetails = (seller: Seller) => {
    setSelectedSeller(seller);
    setIsEditModalOpen(true);
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

        <div className="flex gap-3">
          <button
            onClick={() => setIsHiddenModalOpen(true)}
            disabled={isOffline}
            title={isOffline ? "Unavailable in offline mode" : "View hidden sellers"}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <EyeOff size={20} />
            <span className="hidden sm:inline">View Hidden Sellers</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            disabled={isOffline}
            title={isOffline ? "Unavailable in offline mode" : "Add new seller"}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
            Add Seller
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          statsTitle="Total Sellers (Page)"
          statsValue={Array.isArray(sellers) ? sellers.length : 0}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Table Header */}
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">All Sellers</h2>

          <div className="flex items-center gap-3">
            {/* Refresh Button */}
            <button
              onClick={refresh}
              disabled={isFetching}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Refresh orders"
            >
              <RefreshCw
                className={`w-5 h-5 text-gray-600 ${isFetching ? "animate-spin" : ""
                  }`}
              />
            </button>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          {loading && sellers.length === 0 ? (
            <Loader />
          ) : (
            <table className={`w-full transition-opacity duration-200 ${isFetching ? "opacity-50 pointer-events-none" : ""}`}>
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-xs uppercase text-gray-500">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSellers.map((seller) => (
                  <SellerInstance
                    key={seller._id}
                    seller={seller}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && sellers.length > 0 && (
          <div className={isFetching ? "opacity-50 pointer-events-none" : ""}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {!loading && !isFetching && filteredSellers.length === 0 && !search && (
          <div className="py-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No sellers to show.</p>
          </div>
        )}

        {!loading && !isFetching && filteredSellers.length === 0 && search && (
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
        <AddSellerModal onClose={() => setIsAddModalOpen(false)} />
      )}

      {isEditModalOpen && selectedSeller && (
        <EditSellerModal
          seller={selectedSeller}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {isHiddenModalOpen && (
        <HiddenSellersModal onClose={() => setIsHiddenModalOpen(false)} />
      )}
    </div>
  );
};

export default SellersPage;

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Building2, RefreshCw } from "lucide-react";
import EditAdminsModal from "../components/admins/EditAdminsModal";
import Loader from "../components/ui/Loader";
import { useUserStore } from "../stores/useUserStore";
import { User } from "../types/user";
import AdminInstance from "../components/admins/AdminInstance";
import AddAdminsModal from "../components/admins/AddAdminsModal";
import { useDebounce } from "../hooks/useDebounce";

const AdminsPage = () => {
  const { admins, loading, getAllAdmins } = useUserStore() as {
    admins: User[];
    loading: boolean;
    getAllAdmins: () => void;
  };

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<User | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const filteredAdmins = useMemo(() => {
    if (!debouncedSearch) return admins;
    const value = debouncedSearch.toLowerCase();
    return admins.filter(
      (admin) =>
        admin.firstName.toLowerCase().includes(value) ||
        admin.lastName.toLowerCase().includes(value) ||
        admin.phoneNo.toLowerCase().includes(value) ||
        admin.role.toLowerCase().includes(value)
    );
  }, [debouncedSearch, admins]);

  useEffect(() => {
    getAllAdmins();
  }, [getAllAdmins]);

  const refresh = async (): Promise<void> => {
    setIsRefreshing(true);
    await getAllAdmins();

    setIsRefreshing(false);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admins</h1>
          <p className="text-gray-500 mt-1">Manage admins</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Add Admin
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Total Admins</p>
          <h3 className="text-3xl font-bold mt-2 text-gray-900">
            {admins?.length}
          </h3>
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Table Header */}
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900">All Admins</h2>

          <div className="flex items-center gap-3">
            {/* Refresh Button */}
            <button
              onClick={refresh}
              disabled={isRefreshing}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Refresh admins"
            >
              <RefreshCw
                className={`w-5 h-5 text-gray-600 ${isRefreshing ? "animate-spin" : ""
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
                placeholder="Search admins..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading || isRefreshing ? (
            <Loader />
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Admin First Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Admin Last Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Phone Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAdmins.map((admin) => (
                  <AdminInstance
                    key={admin._id}
                    admin={admin}
                    onViewDetails={() => {
                      setSelectedAdmin(admin);
                      setIsEditModalOpen(true);
                    }}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Empty State */}
        {!loading && !isRefreshing && filteredAdmins.length === 0 && (
          <div className="py-12 text-center">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              No Admins found matching your search.
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {isAddModalOpen && (
        <AddAdminsModal
          onClose={async () => {
            setIsAddModalOpen(false);
            await getAllAdmins();
          }}
        />
      )}

      {isEditModalOpen && selectedAdmin && (
        <EditAdminsModal
          admin={selectedAdmin}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminsPage;

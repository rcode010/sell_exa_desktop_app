import React, { useEffect } from "react";
import { Plus, Search, Building2 } from "lucide-react";
import { Company } from "../types/company";
import AddCompanyModal from "../components/company/AddCompanyModal";
import EditCompanyModal from "../components/company/EditCompanyModal";
import { useCompanyStore } from "../stores/useCompanyStore";
import Loader from "../components/ui/Loader";
import CompanyInstance from "../components/company/CompanyInstance";
import { useSearch } from "../hooks/useSearch";
import { useCompany } from "../hooks/useCompany";

const CompaniesPage = () => {
  const { companies, loading, getCompanies } = useCompanyStore() as {
    companies: Company[];
    loading: boolean;
    getCompanies: () => void;
  };

  const { search, setSearch } = useSearch();
  const {
    filteredCompanies,
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    selectedCompany,
  } = useCompany(companies);

  useEffect(() => {
    getCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-500 mt-1">Manage companies</p>
        </div>
        <button
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium cursor-pointer"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="w-5 h-5" />
          Add Company
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Total Companies</p>
          <h3 className="text-3xl font-bold mt-2 text-gray-900">
            {companies.length}
          </h3>
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Table Header */}
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900">All Companies</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="overflow-hidden">
              <Loader />
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Models
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCompanies.map((company, index) => (
                  <CompanyInstance key={index} company={company} />
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Empty State */}
        {!loading && filteredCompanies.length === 0 && (
          <div className="py-12 text-center">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              No companies found matching your search.
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {isAddModalOpen && (
        <AddCompanyModal onClose={() => setIsAddModalOpen(false)} />
      )}

      {isEditModalOpen && selectedCompany && (
        <EditCompanyModal
          company={selectedCompany}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CompaniesPage;

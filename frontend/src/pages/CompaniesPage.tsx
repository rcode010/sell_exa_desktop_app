import React, { useMemo, useState } from "react";
import { Plus, Search, Eye, Building2 } from "lucide-react";
import { Company } from "../types/company";
import AddCompanyModal from "../components/AddCompanyModal";
import EditCompanyModal from "../components/EditCompanyModal";

// Mock data matching the design
const COMPANIES_DATA: Company[] = [
  {
    id: 1,
    name: "AutoParts Inc",
    products: 145,
    revenue: 125000,
  },
  {
    id: 2,
    name: "CarPro Supply",
    products: 89,
    revenue: 98000,
  },
  {
    id: 3,
    name: "PartsWorld",
    products: 234,
    revenue: 156000,
  },
  {
    id: 4,
    name: "Quality Auto",
    products: 67,
    revenue: 45000,
  },
  {
    id: 5,
    name: "Speed Parts Co",
    products: 112,
    revenue: 87000,
  },
  {
    id: 6,
    name: "Premium Parts",
    products: 28,
    revenue: 12000,
  },
];

const CompaniesPage = () => {
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // Filter companies based on search
  const filteredCompanies = useMemo(() => {
    if (!search) return COMPANIES_DATA;

    const value = search.toLowerCase();
    return COMPANIES_DATA.filter((company) => {
      return company.name.toLowerCase().includes(value);
    });
  }, [search]);

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
            {COMPANIES_DATA.length}
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
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCompanies.map((company) => (
                <tr
                  key={company.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {company.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {company.products}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      ${company.revenue.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedCompany(company);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredCompanies.length === 0 && (
          <div className="py-12 text-center">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              No companies found matching your search.
            </p>
          </div>
        )}
      </div>

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

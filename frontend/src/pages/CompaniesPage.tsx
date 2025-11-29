import React, { useMemo, useState } from "react";
import { Plus, Search, Eye, Mail, Phone, Building2 } from "lucide-react";

interface Company {
  id: number;
  name: string;
  type: "manufacturer" | "distributor" | "retailer";
  email: string;
  phone: string;
  location: string;
  products: number;
  revenue: number;
  status: "active" | "inactive";
}

// Mock data matching the design
const COMPANIES_DATA: Company[] = [
  {
    id: 1,
    name: "AutoParts Inc",
    type: "distributor",
    email: "contact@autoparts.com",
    phone: "(555) 100-1000",
    location: "New York, NY",
    products: 145,
    revenue: 125000,
    status: "active",
  },
  {
    id: 2,
    name: "CarPro Supply",
    type: "manufacturer",
    email: "info@carpro.com",
    phone: "(555) 200-2000",
    location: "Los Angeles, CA",
    products: 89,
    revenue: 98000,
    status: "active",
  },
  {
    id: 3,
    name: "PartsWorld",
    type: "distributor",
    email: "sales@partsworld.com",
    phone: "(555) 300-3000",
    location: "Chicago, IL",
    products: 234,
    revenue: 156000,
    status: "active",
  },
  {
    id: 4,
    name: "Quality Auto",
    type: "retailer",
    email: "support@qualityauto.com",
    phone: "(555) 400-4000",
    location: "Houston, TX",
    products: 67,
    revenue: 45000,
    status: "active",
  },
  {
    id: 5,
    name: "Speed Parts Co",
    type: "manufacturer",
    email: "orders@speedparts.com",
    phone: "(555) 500-5000",
    location: "Phoenix, AZ",
    products: 112,
    revenue: 87000,
    status: "active",
  },
  {
    id: 6,
    name: "Premium Parts",
    type: "retailer",
    email: "hello@premiumparts.com",
    phone: "(555) 600-6000",
    location: "Philadelphia, PA",
    products: 28,
    revenue: 12000,
    status: "inactive",
  },
];

const getTypeStyles = (type: Company["type"]) => {
  const styles = {
    manufacturer: "bg-blue-100 text-blue-700",
    distributor: "bg-purple-100 text-purple-700",
    retailer: "bg-green-100 text-green-700",
  };
  return styles[type];
};

const getStatusStyles = (status: Company["status"]) => {
  const styles = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-500",
  };
  return styles[status];
};

const CompaniesPage = () => {
  const [search, setSearch] = useState("");

  // Calculate stats from data
  const stats = useMemo(() => {
    return {
      total: COMPANIES_DATA.length,
      manufacturers: COMPANIES_DATA.filter((c) => c.type === "manufacturer")
        .length,
      distributors: COMPANIES_DATA.filter((c) => c.type === "distributor")
        .length,
      retailers: COMPANIES_DATA.filter((c) => c.type === "retailer").length,
    };
  }, []);

  // Filter companies based on search
  const filteredCompanies = useMemo(() => {
    if (!search) return COMPANIES_DATA;

    const value = search.toLowerCase();
    return COMPANIES_DATA.filter((company) => {
      return (
        company.name.toLowerCase().includes(value) ||
        company.email.toLowerCase().includes(value) ||
        company.location.toLowerCase().includes(value) ||
        company.type.toLowerCase().includes(value)
      );
    });
  }, [search]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-500 mt-1">
            Manage business partners and suppliers
          </p>
        </div>
        <button className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
          <Plus className="w-5 h-5" />
          Add Company
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Total Companies</p>
          <h3 className="text-3xl font-bold mt-2 text-gray-900">
            {stats.total}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Manufacturers</p>
          <h3 className="text-3xl font-bold mt-2 text-gray-900">
            {stats.manufacturers}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Distributors</p>
          <h3 className="text-3xl font-bold mt-2 text-gray-900">
            {stats.distributors}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Retailers</p>
          <h3 className="text-3xl font-bold mt-2 text-gray-900">
            {stats.retailers}
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
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
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
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getTypeStyles(
                        company.type
                      )}`}
                    >
                      {company.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-3 h-3" />
                        <span>{company.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-3 h-3" />
                        <span>{company.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {company.location}
                    </span>
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
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusStyles(
                        company.status
                      )}`}
                    >
                      {company.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
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
    </div>
  );
};

export default CompaniesPage;

import React, { useMemo, useState } from "react";
import { Plus, Search, Eye, Package } from "lucide-react";
import { Product } from "../types/product";

// Mock data matching the design
const PRODUCTS_DATA: Product[] = [
  {
    id: 1,
    name: "Engine Oil Filter",
    category: "Engine Parts",
    price: 45,
    seller: "AutoParts Inc",
  },
  {
    id: 2,
    name: "Brake Pads Set",
    category: "Brakes",
    price: 89,
    seller: "CarPro Supply",
  },
  {
    id: 3,
    name: "Shock Absorber",
    category: "Suspension",
    price: 125,
    seller: "PartsWorld",
  },
  {
    id: 4,
    name: "Spark Plugs (Set of 4)",
    category: "Electrical",
    price: 32,
    seller: "AutoParts Inc",
  },
  {
    id: 5,
    name: "Air Filter",
    category: "Engine Parts",
    price: 28,
    seller: "CarPro Supply",
  },
  {
    id: 6,
    name: "Brake Rotor",
    category: "Brakes",
    price: 95,
    seller: "PartsWorld",
  },
  {
    id: 7,
    name: "Control Arm",
    category: "Suspension",
    price: 165,
    seller: "AutoParts Inc",
  },
  {
    id: 8,
    name: "Alternator",
    category: "Electrical",
    price: 285,
    seller: "CarPro Supply",
  },
];

const ProductsPage = () => {
  const [search, setSearch] = useState("");

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!search) return PRODUCTS_DATA;

    const value = search.toLowerCase();
    return PRODUCTS_DATA.filter((product) => {
      return (
        product.name.toLowerCase().includes(value) ||
        product.category.toLowerCase().includes(value) ||
        product.seller.toLowerCase().includes(value)
      );
    });
  }, [search]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">View and manage products</p>
        </div>
        <button className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Total Products</p>
          <h3 className="text-3xl font-bold mt-2 text-gray-900">
            {PRODUCTS_DATA.length}
          </h3>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Table Header */}
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900">All Products</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
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
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {product.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      ${product.price}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {product.seller}
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
        {filteredProducts.length === 0 && (
          <div className="py-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              No products found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;

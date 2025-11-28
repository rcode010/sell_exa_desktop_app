import React, { useMemo, useState } from "react";
import { Plus, Search, Eye, Package } from "lucide-react";

interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  seller: string;
  status: "in-stock" | "low-stock" | "out-of-stock";
}

// Mock data matching the design
const PRODUCTS_DATA: Product[] = [
  {
    id: 1,
    sku: "ENG-001",
    name: "Engine Oil Filter",
    category: "Engine Parts",
    price: 45,
    stock: 150,
    seller: "AutoParts Inc",
    status: "in-stock",
  },
  {
    id: 2,
    sku: "BRK-012",
    name: "Brake Pads Set",
    category: "Brakes",
    price: 89,
    stock: 45,
    seller: "CarPro Supply",
    status: "in-stock",
  },
  {
    id: 3,
    sku: "SUS-008",
    name: "Shock Absorber",
    category: "Suspension",
    price: 125,
    stock: 12,
    seller: "PartsWorld",
    status: "low-stock",
  },
  {
    id: 4,
    sku: "ELC-045",
    name: "Spark Plugs (Set of 4)",
    category: "Electrical",
    price: 32,
    stock: 0,
    seller: "AutoParts Inc",
    status: "out-of-stock",
  },
  {
    id: 5,
    sku: "ENG-022",
    name: "Air Filter",
    category: "Engine Parts",
    price: 28,
    stock: 200,
    seller: "CarPro Supply",
    status: "in-stock",
  },
  {
    id: 6,
    sku: "BRK-019",
    name: "Brake Rotor",
    category: "Brakes",
    price: 95,
    stock: 8,
    seller: "PartsWorld",
    status: "low-stock",
  },
  {
    id: 7,
    sku: "SUS-015",
    name: "Control Arm",
    category: "Suspension",
    price: 165,
    stock: 35,
    seller: "AutoParts Inc",
    status: "in-stock",
  },
  {
    id: 8,
    sku: "ELC-052",
    name: "Alternator",
    category: "Electrical",
    price: 285,
    stock: 18,
    seller: "CarPro Supply",
    status: "in-stock",
  },
];

const getStatusStyles = (status: Product["status"]) => {
  const styles = {
    "in-stock": "bg-green-100 text-green-700",
    "low-stock": "bg-yellow-100 text-yellow-700",
    "out-of-stock": "bg-red-100 text-red-700",
  };
  return styles[status];
};

const getStatusLabel = (status: Product["status"]) => {
  const labels = {
    "in-stock": "in-stock",
    "low-stock": "low-stock",
    "out-of-stock": "out-of-stock",
  };
  return labels[status];
};

const ProductsPage = () => {
  const [search, setSearch] = useState("");

  // Calculate stats from data
  const stats = useMemo(() => {
    return {
      total: PRODUCTS_DATA.length,
      inStock: PRODUCTS_DATA.filter((p) => p.status === "in-stock").length,
      lowStock: PRODUCTS_DATA.filter((p) => p.status === "low-stock").length,
      outOfStock: PRODUCTS_DATA.filter((p) => p.status === "out-of-stock")
        .length,
    };
  }, []);

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!search) return PRODUCTS_DATA;

    const value = search.toLowerCase();
    return PRODUCTS_DATA.filter((product) => {
      return (
        product.sku.toLowerCase().includes(value) ||
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
          <p className="text-gray-500 mt-1">Manage product inventory</p>
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
            {stats.total}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">In Stock</p>
          <h3 className="text-3xl font-bold mt-2 text-gray-900">
            {stats.inStock}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Low Stock</p>
          <h3 className="text-3xl font-bold mt-2 text-gray-900">
            {stats.lowStock}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Out of Stock</p>
          <h3 className="text-3xl font-bold mt-2 text-gray-900">
            {stats.outOfStock}
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
                  SKU
                </th>
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
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seller
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
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {product.sku}
                    </span>
                  </td>
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
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {product.seller}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusStyles(
                        product.status
                      )}`}
                    >
                      {getStatusLabel(product.status)}
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

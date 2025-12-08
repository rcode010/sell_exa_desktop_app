import React, { useEffect, useState } from "react";
import { Phone, User, X, MapPin, Package, Search } from "lucide-react";
import { Product } from "../../types/product";
import { Seller } from "../../types/seller";
import toast from "react-hot-toast";

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

const AddSellerModal = ({
  onClose,
  createSeller,
}: {
  onClose: () => void;
  createSeller: (seller: Seller) => void;
}) => {
  const [formData, setFormData] = useState<Seller>({
    name: "",
    phone: "",
    location: {
      locationName: "",
      latitude: 0,
      longitude: 0,
    },
    products: [],
  });

  const [searchProduct, setSearchProduct] = useState("");
  const [mapClicked, setMapClicked] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  // Filter products based on search
  const filteredProducts = PRODUCTS_DATA.filter((product: Product) =>
    product.name.toLowerCase().includes(searchProduct.toLowerCase())
  );

  const toggleProduct = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.includes(productId)
        ? prev.products.filter((id) => productId !== id)
        : [...prev.products, productId],
    }));
  };

  // Handle map click - simulate getting coordinates
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert click position to fake lat/lng (in production, use real Google Maps API)
    const latitude = 36.191 + (y / rect.height) * 0.1;
    const longitude = 44.009 + (x / rect.width) * 0.1;

    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        latitude: parseFloat(latitude.toFixed(6)),
        longitude: parseFloat(longitude.toFixed(6)),
      },
    }));
    setMapClicked(true);
  };

  useEffect(() => {
    fetch(
      "https://solution-squad-backend-development.onrender.com/api/products"
    )
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.phone) {
      alert("Please fill in all required fields");
      return;
    }

    if (!formData.location.locationName || formData.location.latitude === 0) {
      alert("Please set a location on the map and provide a location name");
      return;
    }

    if (formData.products.length === 0) {
      alert("Please select at least one product");
      return;
    }

    try {
      await createSeller(formData);
      onClose();
    } catch (error) {
      toast.error("Error occured while creating a Seller");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add New Seller</h2>
            <p className="text-sm text-gray-500 mt-1">
              Create a new seller account
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Basic Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter seller's full name"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="07501234567"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location
              </h3>

              {/* Location Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location Name *
                </label>
                <input
                  type="text"
                  value={formData.location.locationName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: {
                        ...formData.location,
                        locationName: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g., Downtown Store, Main Branch"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Map Area */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Click on map to set location *
                </label>
                <div
                  onClick={handleMapClick}
                  className="w-full h-64 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg cursor-crosshair hover:border-blue-400 transition-colors relative overflow-hidden"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")",
                  }}
                >
                  {!mapClicked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">
                          Click anywhere to set coordinates
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          (In production, this will use Google Maps)
                        </p>
                      </div>
                    </div>
                  )}
                  {mapClicked && (
                    <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md">
                      <MapPin className="w-4 h-4 text-red-500 inline mr-2" />
                      <span className="text-sm font-medium">Location Set</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Coordinates Display */}
              {mapClicked && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Latitude</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formData.location.latitude}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Longitude</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formData.location.longitude}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Products Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Products ({formData.products.length} selected)
              </h3>

              {/* Product Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Products List */}
              <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <label
                    key={product.id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      checked={formData.products.includes(
                        product.id.toString()
                      )}
                      onChange={() => toggleProduct(product.id.toString())}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-900">
                      {product.name}
                    </span>
                  </label>
                ))}
                {filteredProducts.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No products found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium cursor-pointer"
          >
            Add Seller
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSellerModal;

import React, { useState } from "react";
import { Phone, User, X, MapPin, Package, Search } from "lucide-react";
import { Product } from "../../types/product";
import { NewSeller } from "../../types/seller";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  Popup,
} from "react-leaflet";
import toast from "react-hot-toast";
import { LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSellerStore } from "../../stores/useSellerStore";

interface Position {
  lat: number;
  lng: number;
}

function LocationMarker({
  setFormData,
}: {
  setFormData: React.Dispatch<React.SetStateAction<NewSeller>>;
}) {
  const [position, setPosition] = useState<Position | null>(null);

  useMapEvents({
    click(e: LeafletMouseEvent) {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });

      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          latitude: Number.parseFloat(lat.toFixed(6)),
          longitude: Number.parseFloat(lng.toFixed(6)),
        },
      }));
    },
  });

  return position === null ? null : (
    <Marker position={[position.lat, position.lng]}>
      <Popup>
        Lat: {position.lat.toFixed(6)}
        <br />
        Lng: {position.lng.toFixed(6)}
      </Popup>
    </Marker>
  );
}

const PRODUCTS_DATA: Product[] = [
  {
    id: 1,
    name: "Premium All-Season Tire",
    description: "High-performance tire suitable for all weather conditions",
    companyId: 101,
    sellerId: "seller_001",
    model: "AS-2024-PRO",
    images: ["https://example.com/tire1.jpg", "https://example.com/tire2.jpg"],
    price: 145.99,
    category: "Tire",
    quality: "New",
  },
  {
    id: 2,
    name: "Ceramic Brake Pads Set",
    description: "Low-dust ceramic brake pads for smooth stopping power",
    companyId: 102,
    sellerId: "seller_002",
    model: "CBP-450X",
    images: ["https://example.com/brake-pads.jpg"],
    price: 89.5,
    category: "Brakes",
    quality: "New",
  },
  {
    id: 3,
    name: "Heavy Duty Shock Absorber",
    description: "Professional-grade shock absorber for enhanced stability",
    companyId: 103,
    sellerId: "seller_003",
    model: "HD-SA-2000",
    images: [
      "https://example.com/shock1.jpg",
      "https://example.com/shock2.jpg",
      "https://example.com/shock3.jpg",
    ],
    price: 125.75,
    category: "Suspension",
    quality: "New",
  },
  {
    id: 4,
    name: "Engine Oil Filter Kit",
    description: "Complete oil filter kit with gaskets and seals",
    companyId: 104,
    sellerId: "seller_001",
    model: "EOF-K50",
    images: ["https://example.com/oil-filter.jpg"],
    price: 24.99,
    category: "Engine Parts",
    quality: "New",
  },
  {
    id: 5,
    name: "LED Headlight Assembly",
    description: "Energy-efficient LED headlight with easy installation",
    companyId: 105,
    sellerId: "seller_004",
    model: "LED-HL-9000",
    images: [
      "https://example.com/headlight1.jpg",
      "https://example.com/headlight2.jpg",
    ],
    price: 189.0,
    category: "Accessories",
    quality: "New",
  },
];

const AddSellerModal = ({ onClose }: { onClose: () => void }) => {
  const createSeller = useSellerStore((state) => state.createSeller);

  const [searchProduct, setSearchProduct] = useState("");
  // const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<NewSeller>({
    storeName: "",
    phoneNo: "",
    location: {
      locationName: "",
      latitude: 0,
      longitude: 0,
    },
    products: [],
  });

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

  // useEffect(() => {
  //   fetch(
  //     "https://solution-squad-backend-development.onrender.com/api/products"
  //   )
  //     .then((response) => response.json())
  //     .then((data) => setProducts(data));
  // }, []);

  const handleSubmit = async () => {
    // Validation
    if (!formData.storeName || !formData.phoneNo) {
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
      const success = await createSeller(formData);
      if (success) {
        onClose();
      }
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
                    value={formData.storeName}
                    onChange={(e) =>
                      setFormData({ ...formData, storeName: e.target.value })
                    }
                    placeholder="Enter seller's full name"
                    className="w-full pl-10 pr-4 py-3 placeholder:text-gray-500 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    value={formData.phoneNo}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNo: e.target.value })
                    }
                    placeholder="07501234567"
                    className="w-full pl-10 placeholder:text-gray-400 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 placeholder:text-gray-400 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Map Area */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Click on map to set location *
                </label>
                <div
                  className="w-full h-64 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg cursor-crosshair hover:border-blue-400 transition-colors relative overflow-hidden"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")",
                  }}
                >
                  {
                    <MapContainer
                      center={[35.5558, 45.4333]}
                      zoom={13}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <LocationMarker setFormData={setFormData} />
                    </MapContainer>
                  }
                </div>
              </div>

              {/* Coordinates Display */}
              {
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
              }
            </div>

            {/* Products Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
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

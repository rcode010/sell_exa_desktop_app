import React, { useState } from "react";
import { Phone, User, X, MapPin } from "lucide-react";
import { Seller } from "../../types/seller";
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
  disabled,
}: {
  setFormData: React.Dispatch<React.SetStateAction<Partial<Seller>>>;
  disabled: boolean;
}) {
  const [position, setPosition] = useState<Position | null>(null);

  useMapEvents({
    click(e: LeafletMouseEvent) {
      if (disabled) return;

      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });

      setFormData((prev: Partial<Seller>) => ({
        ...prev,
        location: {
          locationName: prev.location?.locationName ?? "",
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

const AddSellerModal = ({ onClose }: { onClose: () => void }) => {
  const createSeller = useSellerStore((state) => state.createSeller);
  const loading = useSellerStore((state) => state.loading);

  // const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<Partial<Seller>>({
    storeName: "",
    phoneNo: "",
    location: {
      locationName: "",
      latitude: 0,
      longitude: 0,
    },
    products: [],
  });

  const handleSubmit = async () => {
    // Validation
    if (!formData.storeName || !formData.phoneNo) {
      alert("Please fill in all required fields");
      return;
    }

    if (!formData.location?.locationName || formData.location.latitude === 0) {
      alert("Please set a location on the map and provide a location name");
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
            disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
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
                  disabled={loading}
                  type="text"
                  value={formData.location?.locationName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: {
                        locationName: e.target.value,
                        latitude: formData.location?.latitude ?? 0,
                        longitude: formData.location?.longitude ?? 0,
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
                {/* Add loading overlay */}
                <div className="relative">
                  <div
                    className={`w-full h-64 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg transition-colors relative overflow-hidden ${
                      loading
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-crosshair hover:border-blue-400"
                    }`}
                  >
                    <MapContainer
                      center={[35.5558, 45.4333]}
                      zoom={13}
                      style={{ height: "100%", width: "100%" }}
                      dragging={!loading}
                      touchZoom={!loading}
                      doubleClickZoom={!loading}
                      scrollWheelZoom={!loading}
                      boxZoom={!loading}
                      keyboard={!loading}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <LocationMarker
                        setFormData={setFormData}
                        disabled={loading}
                      />
                    </MapContainer>
                  </div>

                  {/* Loading overlay */}
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                      <span className="text-white font-medium">
                        Map disabled during submission...
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Coordinates Display */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Latitude</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formData.location?.latitude}
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Longitude</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formData.location?.longitude}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            disabled={loading}
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={loading}
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

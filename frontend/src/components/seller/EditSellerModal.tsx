import React, { useState } from "react";
import { Seller } from "../../types/seller";
import { Loader, Phone, Trash2, User, X, Eye, EyeOff } from "lucide-react";
import { useSellerStore } from "../../stores/useSellerStore";

const IRAQI_PHONE_REGEX = /^07[0-9]{9}$/;

const EditSellerModal = ({
  seller,
  onClose,
}: {
  seller: Seller;
  onClose: () => void;
}) => {
  const updateSeller = useSellerStore((state) => state.updateSeller);
  const hideSeller = useSellerStore((state) => state.hideSeller);
  const loading = useSellerStore((state) => state.loading);

  const [phoneError, setPhoneError] = useState("");
  const [formData, setFormData] = useState<Seller>({
    _id: seller._id,
    storeName: seller.storeName,
    phoneNo: seller.phoneNo,
    city: seller.city,
    products: seller.products,
    location: seller.location,
  });

  const validatePhone = (value: string) => {
    if (!value) {
      setPhoneError("");
      return;
    }
    if (!IRAQI_PHONE_REGEX.test(value)) {
      setPhoneError("Please enter a valid Iraqi phone number (07XXXXXXXXX)");
    } else {
      setPhoneError("");
    }
  };

  const handleUpdate = async () => {
    if (!formData.storeName || !formData.phoneNo) {
      return alert("Fill in all required fields");
    }

    if (!IRAQI_PHONE_REGEX.test(formData.phoneNo)) {
      return alert("Please enter a valid Iraqi phone number (07XXXXXXXXX)");
    }

    const success = await updateSeller(seller._id, formData);

    if (success) {
      onClose();
    }
  };

  const handleHide = async (id: string) => {
    const isCurrentlyHidden = seller.isHidden;
    const action = isCurrentlyHidden ? "show" : "hide";
    const confirmed = window.confirm(
      `Are you sure you want to ${action} this seller?`
    );

    if (!confirmed) return;

    const success = await hideSeller(id);

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Seller</h2>
            <p className="text-sm text-gray-500 mt-1">
              Update seller information
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

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Edit Form */}
          <div className="space-y-5">
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
                  disabled={loading}
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
                  value={formData.phoneNo}
                  onChange={(e) => {
                    setFormData({ ...formData, phoneNo: e.target.value });
                    validatePhone(e.target.value);
                  }}
                  onBlur={(e) => validatePhone(e.target.value)}
                  placeholder="07501234567"
                  disabled={loading}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${phoneError
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-200 focus:ring-blue-500"
                    }`}
                  required
                />
                {phoneError && (
                  <p className="text-red-600 text-sm mt-1">{phoneError}</p>
                )}
              </div>
            </div>

            {/* Hide/Show Section */}
            <div className="pt-6 border-t border-gray-200">
              <div className={`${seller.isHidden ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-lg p-4`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 ${seller.isHidden ? 'bg-green-100' : 'bg-red-100'} rounded-lg`}>
                    {seller.isHidden ? (
                      <Eye className={`w-5 h-5 text-green-600`} />
                    ) : (
                      <EyeOff className={`w-5 h-5 text-red-600`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-sm font-semibold ${seller.isHidden ? 'text-green-900' : 'text-red-900'}`}>
                      {seller.isHidden ? "Show Seller" : "Hide Seller"}
                    </h4>
                    <p className={`text-sm ${seller.isHidden ? 'text-green-700' : 'text-red-700'} mt-1`}>
                      {seller.isHidden
                        ? "This will make the seller visible again."
                        : "This will hide the seller from view instead of deleting it."}
                    </p>
                    <button
                      onClick={() => handleHide(seller._id)}
                      disabled={loading}
                      className={`mt-3 px-4 py-2 ${seller.isHidden ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm cursor-pointer`}
                    >
                      {seller.isHidden ? "Show Seller" : "Hide Seller"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2 min-w-[140px] cursor-pointer"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSellerModal;

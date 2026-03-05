import React, { useState, useEffect } from "react";
import {
  X,
  Package,
  Tag,
  DollarSign,
  Building2,
  FileText,
  Users,
  Weight,
  Ruler,
} from "lucide-react";
import { useProductStore } from "../../stores/useProductStore";
import toast from "react-hot-toast";
import { useSellerStore } from "../../stores/useSellerStore.ts";
import { useCompanyStore } from "../../stores/useCompanyStore.ts";
import { useModelStore } from "../../stores/useModelStore.ts";

const qualityOptions = ["Very good", "Good", "Basic"];

const AddProductModal = ({ onClose }: { onClose: () => void }) => {
  const createProduct = useProductStore((state) => state.createProduct);
  const loading = useProductStore((state) => state.loading);

  const getAllSellers = useSellerStore((state) => state.getAllSellers);
  const sellers = useSellerStore((state) => state.sellers);
  const loadingSellers = useSellerStore((state) => state.loading);

  const getCompanies = useCompanyStore((state) => state.getCompanies);
  const companies = useCompanyStore((state) => state.companies);
  const loadingCompanies = useCompanyStore((state) => state.loading);

  const getModels = useModelStore((state) => state.getModels);
  const models = useModelStore((state) => state.models);
  const loadingModels = useModelStore((state) => state.loading);

  const [formData, setFormData] = useState({
    kurdishName: "",
    englishName: "",
    arabicName: "",
    kurdishDescription: "",
    englishDescription: "",
    arabicDescription: "",
    weight: "",
    dimensions: {
      width: "",
      height: "",
      length: "",
    },
    price: "",
    quality: "Good",
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [sellerId, setSellerId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [modelId, setModelId] = useState("");

  // Fetch sellers on mount
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        await getAllSellers();
      } catch (error) {
        console.error("Error fetching sellers:", error);
        toast.error("Failed to load sellers");
      }
    };

    fetchSellers();
  }, [getAllSellers]);

  // Fetch companies on mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        await getCompanies();
      } catch (error) {
        console.error("Error fetching companies:", error);
        toast.error("Failed to load companies");
      }
    };

    fetchCompanies();
  }, [getCompanies]);

  // Fetch models when company is selected
  useEffect(() => {
    const fetchModels = async () => {
      if (companyId) {
        try {
          await getModels(companyId);
          // Reset model selection when company changes
          setModelId("");
        } catch (error) {
          console.error("Error fetching models:", error);
          toast.error("Failed to load models");
        }
      }
    };

    fetchModels();
  }, [companyId, getModels]);

  const MAX_IMAGE_SIZE_MB = 5;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files || []);
    // Reset the input value so the same file can be re-selected after removal
    e.target.value = "";

    // Validate sizes
    const oversized = incoming.filter(
      (f) => f.size > MAX_IMAGE_SIZE_MB * 1024 * 1024
    );
    if (oversized.length > 0) {
      toast.error(
        `Each image must be under ${MAX_IMAGE_SIZE_MB} MB. ${oversized.map((f) => f.name).join(", ")} exceeded the limit.`
      );
      return;
    }

    // Merge with existing selection, cap at 3
    setImages((prev) => {
      const merged = [...prev, ...incoming].slice(0, 3);
      if (prev.length + incoming.length > 3) {
        toast.error("Only 3 images are allowed. Extra images were ignored.");
      }
      // Rebuild preview URLs for the merged set
      const previews = merged.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
      return merged;
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      const previews = updated.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
      return updated;
    });
  };

  const handleSubmit = async () => {
    // Validation
    if (
      !formData.englishName ||
      !formData.kurdishName ||
      !formData.arabicName
    ) {
      toast.error("Please fill in all name fields");
      return;
    }

    if (
      !formData.englishDescription ||
      !formData.kurdishDescription ||
      !formData.arabicDescription
    ) {
      toast.error("Please fill in all description fields");
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (images.length !== 3) {
      toast.error("Please upload exactly 3 images");
      return;
    }

    if (!sellerId) {
      toast.error("Please select a seller");
      return;
    }

    if (!companyId) {
      toast.error("Please select a company");
      return;
    }

    if (!modelId) {
      toast.error("Please select a model");
      return;
    }

    // Create FormData
    const data = new FormData();

    // Append images
    images.forEach((image) => {
      data.append("images", image);
    });

    // Append text fields
    data.append("kurdishName", formData.kurdishName);
    data.append("englishName", formData.englishName);
    data.append("arabicName", formData.arabicName);
    data.append("kurdishDescription", formData.kurdishDescription);
    data.append("englishDescription", formData.englishDescription);
    data.append("arabicDescription", formData.arabicDescription);
    data.append("price", formData.price);
    data.append("quality", formData.quality);

    const success = await createProduct({
      formData: data,
      sellerId,
      companyId,
      modelId,
    });

    if (success) {
      // Clean up preview URLs
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Add New Product
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Create a new product listing
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Product Names Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Product Names
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    English Name *
                  </label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.englishName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          englishName: e.target.value,
                        })
                      }
                      placeholder="Enter product name in English"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kurdish Name (کوردی) *
                  </label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.kurdishName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          kurdishName: e.target.value,
                        })
                      }
                      placeholder="ناوی بەرهەم بە کوردی بنووسە"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      dir="rtl"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arabic Name (عربي) *
                  </label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.arabicName}
                      onChange={(e) =>
                        setFormData({ ...formData, arabicName: e.target.value })
                      }
                      placeholder="أدخل اسم المنتج بالعربية"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      dir="rtl"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Product Descriptions Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Product Descriptions
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    English Description *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      value={formData.englishDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          englishDescription: e.target.value,
                        })
                      }
                      placeholder="Enter product description in English"
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kurdish Description (کوردی) *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      value={formData.kurdishDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          kurdishDescription: e.target.value,
                        })
                      }
                      placeholder="وەسفی بەرهەم بە کوردی بنووسە"
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      dir="rtl"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arabic Description (عربي) *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      value={formData.arabicDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          arabicDescription: e.target.value,
                        })
                      }
                      placeholder="أدخل وصف المنتج بالعربية"
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      dir="rtl"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quality *
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                  <select
                    value={formData.quality}
                    onChange={(e) =>
                      setFormData({ ...formData, quality: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                    required
                  >
                    {qualityOptions.map((quality) => (
                      <option key={quality} value={quality}>
                        {quality}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Weight Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (KG)
              </label>
              <div className="relative">
                <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Dimensions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dimensions (m)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.dimensions.width}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dimensions: {
                          ...formData.dimensions,
                          width: e.target.value,
                        },
                      })
                    }
                    placeholder="Width"
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.dimensions.height}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dimensions: {
                          ...formData.dimensions,
                          height: e.target.value,
                        },
                      })
                    }
                    placeholder="Height"
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.dimensions.length}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dimensions: {
                          ...formData.dimensions,
                          length: e.target.value,
                        },
                      })
                    }
                    placeholder="Length"
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Dropdowns Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seller *
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                  <select
                    value={sellerId}
                    onChange={(e) => setSellerId(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                    required
                    disabled={loadingSellers}
                  >
                    <option value="">
                      {loadingSellers ? "Loading..." : "Select seller"}
                    </option>
                    {sellers.map((seller) => (
                      <option key={seller._id} value={seller._id}>
                        {seller.storeName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                  <select
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                    required
                    disabled={loadingCompanies}
                  >
                    <option value="">
                      {loadingCompanies ? "Loading..." : "Select company"}
                    </option>
                    {companies.map((company) => (
                      <option key={company._id} value={company._id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model *
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                  <select
                    value={modelId}
                    onChange={(e) => setModelId(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                    disabled={!companyId || loadingModels}
                  >
                    <option value="">
                      {!companyId
                        ? "Select company first"
                        : loadingModels
                          ? "Loading..."
                          : "Select model"}
                    </option>
                    {models.map((model) => (
                      <option key={model._id} value={model._id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                </div>
                {!companyId && (
                  <p className="text-xs text-gray-500 mt-1">
                    Please select a company first
                  </p>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images * (Exactly 3 images required)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  required
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {images.length}/3 images selected
              </p>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                      />
                      <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              loading || loadingSellers || loadingCompanies || loadingModels
            }
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;

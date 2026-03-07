import React, { useState } from "react";
import {
  X,
  Package,
  Tag,
  Banknote,
  Trash2,
  Weight,
  FileText,
  MapPin,
  Image,
  Eye,
  EyeOff,
} from "lucide-react";
import { Product } from "../../types/product";
import { useProductStore } from "../../stores/useProductStore";
import toast from "react-hot-toast";

const qualityOptions = ["Very good", "Good", "Basic"] as const;

const EditProductModal = ({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) => {
  const updateProduct = useProductStore((state) => state.updateProduct);
  const hideProduct = useProductStore((state) => state.hideProduct);
  const loading = useProductStore((state) => state.loading);

  const [formData, setFormData] = useState({
    // Multilingual names
    englishName: product.name?.english ?? "",
    kurdishName: product.name?.kurdish ?? "",
    arabicName: product.name?.arabic ?? "",

    // Multilingual descriptions
    englishDescription: product.description?.english ?? "",
    kurdishDescription: product.description?.kurdish ?? "",
    arabicDescription: product.description?.arabic ?? "",

    // Core fields
    price: product.price?.toString() ?? "",
    weight: product.weight?.toString() ?? "",
    quality: product.quality ?? "Good",
    city: product.city ?? "",
  });

  const setField = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleUpdate = async () => {
    if (!formData.englishName || !formData.kurdishName || !formData.arabicName) {
      toast.error("Please fill in all name fields");
      return;
    }
    if (!formData.englishDescription || !formData.kurdishDescription || !formData.arabicDescription) {
      toast.error("Please fill in all description fields");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    const payload: Partial<Product> = {
      name: {
        english: formData.englishName,
        kurdish: formData.kurdishName,
        arabic: formData.arabicName,
      },
      description: {
        english: formData.englishDescription,
        kurdish: formData.kurdishDescription,
        arabic: formData.arabicDescription,
      },
      price: parseFloat(formData.price),
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      quality: formData.quality as Product["quality"],
      city: formData.city,
    };

    const success = await updateProduct(product._id, payload);
    if (success) onClose();
  };

  const handleHide = async () => {
    const isCurrentlyHidden = product.isHidden;
    const action = isCurrentlyHidden ? "show" : "hide";
    if (
      globalThis.confirm(`Are you sure you want to ${action} ${product.name.english}?`)
    ) {
      const success = await hideProduct(product._id);
      if (success) onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
            <p className="text-sm text-gray-500 mt-1">
              Update product information
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

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">

            {/* Existing Images (read-only preview) */}
            {product.images && product.images.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Image className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-700">
                    Current Images
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {product.images.map((img, i) => (
                    <div key={img.imageId ?? i} className="relative aspect-square">
                      <img
                        src={img.imageLink}
                        alt={`Product image ${i + 1}`}
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                      />
                      <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        {i + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Product Names */}
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
                      onChange={(e) => setField("englishName", e.target.value)}
                      placeholder="Enter product name in English"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      onChange={(e) => setField("kurdishName", e.target.value)}
                      placeholder="ناوی بەرهەم بە کوردی بنووسە"
                      dir="rtl"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      onChange={(e) => setField("arabicName", e.target.value)}
                      placeholder="أدخل اسم المنتج بالعربية"
                      dir="rtl"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Product Descriptions */}
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
                      onChange={(e) => setField("englishDescription", e.target.value)}
                      placeholder="Enter product description in English"
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                      onChange={(e) => setField("kurdishDescription", e.target.value)}
                      placeholder="وەسفی بەرهەم بە کوردی بنووسە"
                      rows={3}
                      dir="rtl"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                      onChange={(e) => setField("arabicDescription", e.target.value)}
                      placeholder="أدخل وصف المنتج بالعربية"
                      rows={3}
                      dir="rtl"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Price & Quality */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (IQD) *
                </label>
                <div className="relative">
                  <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setField("price", e.target.value)}
                    placeholder="0"
                    min="0"
                    step="1"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    onChange={(e) => setField("quality", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                  >
                    {qualityOptions.map((q) => (
                      <option key={q} value={q}>
                        {q}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Weight & City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (KG)
                </label>
                <div className="relative">
                  <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setField("weight", e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setField("city", e.target.value)}
                    placeholder="Enter city"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Hide/Show Zone */}
            <div className="pt-4 border-t border-gray-200">
              <div className={`${product.isHidden ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-lg p-4`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 ${product.isHidden ? 'bg-green-100' : 'bg-red-100'} rounded-lg`}>
                    {product.isHidden ? (
                      <Eye className="w-5 h-5 text-green-600" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-sm font-semibold ${product.isHidden ? 'text-green-900' : 'text-red-900'}`}>
                      {product.isHidden ? "Show Product" : "Hide Product"}
                    </h4>
                    <p className={`text-sm ${product.isHidden ? 'text-green-700' : 'text-red-700'} mt-1`}>
                      {product.isHidden
                        ? "This will make the product visible again."
                        : "This will hide the product from view instead of deleting it."}
                    </p>
                    <button
                      onClick={handleHide}
                      disabled={loading}
                      className={`mt-3 px-4 py-2 ${product.isHidden ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white rounded-lg transition-colors font-medium text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {product.isHidden ? "Show Product" : "Hide Product"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;

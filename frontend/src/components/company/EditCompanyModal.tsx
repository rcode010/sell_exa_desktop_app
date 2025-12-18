import React, { useState } from "react";
import { X, Building2, Package, Trash2, Upload } from "lucide-react";
import { Company } from "../../types/company";
import { useCompanyStore } from "../../stores/useCompanyStore";
import toast from "react-hot-toast";

const EditCompanyModal = ({
  company,
  onClose,
}: {
  company: Company;
  onClose: () => void;
}) => {
  // Preview image (URL or uploaded file)
  const [imagePreview, setImagePreview] = useState<string | null>(
    company.logoLink || null
  );
  // Form data
  const [formData, setFormData] = useState({
    name: company.name,
    logoFile: null as File | null,
  });

  const { updateCompany, deleteCompany } = useCompanyStore();

  // Handle logo upload
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      toast.error("Logo size must be less than 3MB");
      return;
    }

    setFormData({ ...formData, logoFile: file });

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  // Handle update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company._id) return;

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name.trim());

    if (formData.logoFile) {
      formDataToSend.append("logo", formData.logoFile);
    }
    const success = await updateCompany(formDataToSend, company._id as number);

    if (success) {
      onClose();
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (
      globalThis.confirm(`Are you sure you want to delete ${company.name}?`)
    ) {
      const success = await deleteCompany(company._id as number);

      if (success) {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Company</h2>
            <p className="text-sm text-gray-500 mt-1">
              Update company information
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Total Products
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {company.products}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleUpdate} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Logo
              </label>

              <input
                type="file"
                id="edit-company-logo"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />

              <label
                htmlFor="edit-company-logo"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Company logo preview"
                    className="h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 font-medium">
                      Click to upload logo
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG (Max 3MB)
                    </p>
                  </div>
                )}
              </label>

              {imagePreview && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, logoFile: null });
                    setImagePreview(null);
                  }}
                  className="mt-2 text-sm text-red-600 hover:underline"
                >
                  Remove logo
                </button>
              )}
            </div>

            {/* Delete */}
            <div className="pt-6 border-t border-gray-200">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 h-[50px] content-center bg-red-100 rounded-lg">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-red-900">
                      Delete Company
                    </h4>
                    <p className="text-sm text-red-700 mt-1">
                      This action cannot be undone.
                    </p>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Delete Company
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCompanyModal;

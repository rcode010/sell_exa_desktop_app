import React, { useState } from "react";
import { Company } from "../../types/company";
import { Loader, Building2, X, Eye, EyeOff, Upload } from "lucide-react";
import { useCompanyStore } from "../../stores/useCompanyStore";
import toast from "react-hot-toast";
import { FILE_UPLOAD } from "../../constants/config";

const EditCompanyModal = ({
  company,
  onClose,
}: {
  company: Company;
  onClose: () => void;
}) => {
  const updateCompany = useCompanyStore((state) => state.updateCompany);
  const hideCompany = useCompanyStore((state) => state.hideCompany);
  const loading = useCompanyStore((state) => state.loading);

  const [imagePreview, setImagePreview] = useState<string | null>(
    company.logoLink || null,
  );
  const [formData, setFormData] = useState({
    name: company.name,
    logoFile: null as File | null,
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > FILE_UPLOAD.MAX_FILE_SIZE_MB) {
      toast.error("Logo size must be less than 3MB");
      return;
    }

    if (!FILE_UPLOAD.ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error("Invalid file type");
      return;
    }

    setFormData({ ...formData, logoFile: file });

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    if (!formData.name.trim()) {
      return alert("Fill in all required fields");
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name.trim());

    if (formData.logoFile) {
      formDataToSend.append("logo", formData.logoFile);
    }

    const success = await updateCompany(formDataToSend, company._id);

    if (success) {
      onClose();
    }
  };

  const handleHide = async (id: string) => {
    const isCurrentlyHidden = company.isHidden;
    const action = isCurrentlyHidden ? "show" : "hide";
    const confirmed = window.confirm(
      `Are you sure you want to ${action} this company?`,
    );

    if (!confirmed) return;

    const success = await hideCompany(id);

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
            <h2 className="text-2xl font-bold text-gray-900">Edit Company</h2>
            <p className="text-sm text-gray-500 mt-1">
              Update company information
            </p>
          </div>
          <button
            disabled={loading}
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-5">
            {/* Name Field */}
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
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter company name"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Logo Field */}
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
                disabled={loading}
              />
              <label
                htmlFor="edit-company-logo"
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors ${
                  loading
                    ? "opacity-50 cursor-not-allowed pointer-events-none"
                    : ""
                }`}
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
                  disabled={loading}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, logoFile: null });
                    setImagePreview(null);
                  }}
                  className="mt-2 text-sm text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Remove logo
                </button>
              )}
            </div>

            {/* Hide/Show Section */}
            <div className="pt-6 border-t border-gray-200">
              <div
                className={`${company.isHidden ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"} border rounded-lg p-4`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 ${company.isHidden ? "bg-green-100" : "bg-red-100"} rounded-lg`}
                  >
                    {company.isHidden ? (
                      <Eye className="w-5 h-5 text-green-600" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4
                      className={`text-sm font-semibold ${company.isHidden ? "text-green-900" : "text-red-900"}`}
                    >
                      {company.isHidden ? "Show Company" : "Hide Company"}
                    </h4>
                    <p
                      className={`text-sm ${company.isHidden ? "text-green-700" : "text-red-700"} mt-1`}
                    >
                      {company.isHidden
                        ? "This will make the company visible again."
                        : "This will hide the company from view instead of deleting it."}
                    </p>
                    <button
                      onClick={() => handleHide(company._id)}
                      disabled={loading}
                      className={`mt-3 px-4 py-2 ${company.isHidden ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"} text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm cursor-pointer`}
                    >
                      {company.isHidden ? "Show Company" : "Hide Company"}
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
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all font-medium flex items-center justify-center gap-2 min-w-[140px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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

export default EditCompanyModal;

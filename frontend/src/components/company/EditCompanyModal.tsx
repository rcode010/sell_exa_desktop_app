import React, { useState, useEffect } from "react";
import {
  X,
  Building2,
  Package,
  Upload,
  Loader,
  Plus,
  Edit2,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import { Company } from "../../types/company";
import { useCompanyStore } from "../../stores/useCompanyStore";
import toast from "react-hot-toast";
import { FILE_UPLOAD } from "../../constants/config";
import { useModelStore } from "../../stores/useModelStore";
import HiddenModelsModal from "./Hiddenmodelsmodal";

const EditCompanyModal = ({
  company,
  onClose,
}: {
  company: Company;
  onClose: () => void;
}) => {
  // Tab state
  const [isCompanyDetailsVisible, setIsCompanyDetailsVisible] = useState(true);
  const [isHiddenModelsOpen, setIsHiddenModelsOpen] = useState(false);

  // Company details tab state
  const [imagePreview, setImagePreview] = useState<string | null>(
    company.logoLink || null,
  );
  const [formData, setFormData] = useState({
    name: company.name,
    logoFile: null as File | null,
  });

  // Models tab state
  const [newModelName, setNewModelName] = useState("");
  const [editingModelId, setEditingModelId] = useState<string | null>(null);
  const [editingModelName, setEditingModelName] = useState("");

  // Store actions and state
  const updateCompany = useCompanyStore((state) => state.updateCompany);
  const hideCompany = useCompanyStore((state) => state.hideCompany);
  const companyLoading = useCompanyStore((state) => state.loading);

  const models = useModelStore((state) => state.models);
  const modelsLoading = useModelStore((state) => state.loading);
  const getModels = useModelStore((state) => state.getModels);
  const createModel = useModelStore((state) => state.createModel);
  const updateModel = useModelStore((state) => state.updateModel);
  const deleteModel = useModelStore((state) => state.deleteModel);
  const hideModel = useModelStore((state) => state.hideModel);

  // Fetch models on mount
  useEffect(() => {
    if (company._id) {
      getModels(company._id);
    }
  }, [company._id, getModels]);

  // Handle logo upload
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

  // Handle company update
  const handleUpdateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company._id) return;

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

  // Handle hide/show company
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

  // Handle add model
  const handleAddModel = async () => {
    if (!newModelName.trim()) {
      toast.error("Model name is required");
      return;
    }

    const success = await createModel(company._id, newModelName);

    if (success) {
      setNewModelName("");
    }
  };

  // Handle edit model
  const handleEditModel = async (modelId: string) => {
    if (!editingModelName.trim()) {
      toast.error("Model name is required");
      return;
    }

    const success = await updateModel(company._id, modelId, editingModelName);

    if (success) {
      setEditingModelId(null);
      setEditingModelName("");
    }
  };

  // Handle delete model
  const handleDeleteModel = async (modelId: string, modelName: string) => {
    if (!globalThis.confirm(`Are you sure you want to delete ${modelName}?`)) {
      return;
    }

    await deleteModel(company._id, modelId);
  };

  // Handle hide model
  const handleHideModel = async (modelId: string, modelName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to hide ${modelName}?`,
    );
    if (!confirmed) return;

    await hideModel(company._id, modelId);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isCompanyDetailsVisible ? "Edit Company" : "Manage Models"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {isCompanyDetailsVisible
                  ? "Update company information"
                  : `Manage models for ${company.name}`}
              </p>
            </div>
            <button
              disabled={companyLoading || modelsLoading}
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Tab Buttons */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            <button
              disabled={companyLoading || modelsLoading}
              onClick={() => setIsCompanyDetailsVisible(true)}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                isCompanyDetailsVisible
                  ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              Company Details
            </button>
            <button
              disabled={companyLoading || modelsLoading}
              onClick={() => setIsCompanyDetailsVisible(false)}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                !isCompanyDetailsVisible
                  ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              Models ({models.length})
            </button>
          </div>

          {/* Body - Company Details */}
          {isCompanyDetailsVisible && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Total Models
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {models.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleUpdateCompany} className="space-y-5">
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
                      disabled={companyLoading}
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
                    disabled={companyLoading}
                  />

                  <label
                    htmlFor="edit-company-logo"
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors ${companyLoading ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
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
                      disabled={companyLoading}
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
                          type="button"
                          onClick={() => handleHide(company._id)}
                          disabled={companyLoading}
                          className={`mt-3 px-4 py-2 ${company.isHidden ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"} text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm cursor-pointer`}
                        >
                          {company.isHidden ? "Show Company" : "Hide Company"}
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
                    disabled={companyLoading}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={companyLoading}
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2 min-w-[140px] cursor-pointer"
                  >
                    {companyLoading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Body - Models Management */}
          {!isCompanyDetailsVisible && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Add New Model */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Add New Model
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newModelName}
                    onChange={(e) => setNewModelName(e.target.value)}
                    placeholder="Enter model name (e.g., Altima, C-Class)"
                    disabled={modelsLoading}
                    className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddModel();
                      }
                    }}
                  />
                  <button
                    onClick={handleAddModel}
                    disabled={modelsLoading || !newModelName.trim()}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2 cursor-pointer"
                  >
                    {modelsLoading ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    Add
                  </button>
                </div>
              </div>

              {/* Models List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Existing Models ({models.length})
                  </h3>
                  <button
                    onClick={() => setIsHiddenModelsOpen(true)}
                    disabled={modelsLoading}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition-colors text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <EyeOff className="w-4 h-4" />
                    Hidden Models
                  </button>
                </div>

                {modelsLoading && models.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                ) : models.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No models added yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {models.map((model) => (
                      <div
                        key={model._id}
                        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                      >
                        {editingModelId === model._id ? (
                          <div className="flex-1 flex items-center gap-2">
                            <input
                              type="text"
                              value={editingModelName}
                              onChange={(e) =>
                                setEditingModelName(e.target.value)
                              }
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                              autoFocus
                              disabled={modelsLoading}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleEditModel(model._id);
                                } else if (e.key === "Escape") {
                                  setEditingModelId(null);
                                  setEditingModelName("");
                                }
                              }}
                            />
                            <button
                              onClick={() => handleEditModel(model._id)}
                              disabled={modelsLoading}
                              className="px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {modelsLoading ? (
                                <Loader className="w-4 h-4 animate-spin" />
                              ) : (
                                "Save"
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setEditingModelId(null);
                                setEditingModelName("");
                              }}
                              disabled={modelsLoading}
                              className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="font-medium text-gray-900">
                              {model.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setEditingModelId(model._id);
                                  setEditingModelName(model.name);
                                }}
                                disabled={modelsLoading}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Edit model"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleHideModel(model._id, model.name)
                                }
                                disabled={modelsLoading}
                                className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Hide model"
                              >
                                <EyeOff className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteModel(model._id, model.name)
                                }
                                disabled={modelsLoading}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete model"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden Models Modal */}
      {isHiddenModelsOpen && (
        <HiddenModelsModal
          companyId={company._id}
          onClose={() => setIsHiddenModelsOpen(false)}
        />
      )}
    </>
  );
};

export default EditCompanyModal;

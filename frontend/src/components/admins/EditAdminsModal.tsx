import React, { useState } from "react";
import { X, Trash2, Loader, Key, User as UserIcon, Phone, ShieldCheck } from "lucide-react";
import { User } from "../../types/user";
import { useUserStore } from "../../stores/useUserStore";
import toast from "react-hot-toast";

const EditAdminsModal = ({
  admin,
  onClose,
}: {
  admin: User;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    firstName: admin.firstName || "",
    lastName: admin.lastName || "",
    phoneNo: admin.phoneNo || "",
    role: admin.role || "admin",
    password: "",
    confirmPassword: "",
  });

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const { updateAdmin, deleteAdmin, loading } = useUserStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const phoneRegex = /^07[0-9]{9}$/;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      return toast.error("First and last names are required");
    }

    if (!phoneRegex.test(formData.phoneNo)) {
      return toast.error("Invalid phone number format. Must be 07XXXXXXXXX (11 digits)");
    }

    if (showPasswordSection) {
      if (!formData.password) {
        return toast.error("Password is required if password section is open");
      }
      if (formData.password.length < 6) {
        return toast.error("Password must be at least 6 characters");
      }
      if (formData.password !== formData.confirmPassword) {
        return toast.error("Passwords do not match");
      }
    }

    const updatePayload: any = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      phoneNo: formData.phoneNo,
      role: formData.role,
    };

    if (showPasswordSection && formData.password) {
      updatePayload.password = formData.password;
    }

    const success = await updateAdmin(admin._id, updatePayload);

    if (success) {
      onClose();
    }
  };

  const handleDelete = async () => {
    if (
      globalThis.confirm(`Are you sure you want to delete ${admin.firstName} ${admin.lastName}?`)
    ) {
      setIsDeleting(true);
      const success = await deleteAdmin(admin._id);
      setIsDeleting(false);

      if (success) {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-left">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Admin</h2>
            <p className="text-sm text-gray-500 mt-1">
              Update information for {admin.firstName} {admin.lastName}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={loading || isDeleting}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <form onSubmit={handleUpdate} className="space-y-5">
            {/* Names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter first name"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Phone & Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">
                  Phone Number (11 digits: 07XXXXXXXXX) *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phoneNo}
                    onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="07XXXXXXXXX"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                  >
                    <option value="admin">Admin</option>
                    <option value="superAdmin">Super Admin</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Password Toggle */}
            <button
              type="button"
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
            >
              <Key className="w-4 h-4" />
              {showPasswordSection ? "Cancel Password Change" : "Change Password"}
            </button>

            {showPasswordSection && (
              <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 space-y-4 animate-in slide-in-from-top-2 duration-200">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    New Password (min 6 characters)
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new password"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Re-enter new password"
                  />
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center min-w-[140px] cursor-pointer disabled:opacity-50"
              >
                {loading ? <Loader className="w-5 h-5 animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </form>

          {/* Delete Zone */}
          <div className="pt-6 border-t border-gray-200">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-100 rounded-xl">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-red-900">
                    Delete Admin
                  </h4>
                  <p className="text-sm text-red-700 mt-1">
                    This action cannot be undone. This admin will lose all access to the system.
                  </p>
                  <button
                    type="button"
                    disabled={loading || isDeleting}
                    onClick={handleDelete}
                    className="mt-4 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isDeleting ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : "Delete Admin Account"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAdminsModal;

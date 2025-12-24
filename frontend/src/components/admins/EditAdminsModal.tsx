import React, { useState } from "react";
import { X, Trash2, Loader, Key } from "lucide-react";
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
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setisDeleting] = useState(false);

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const { deleteAdmin } = useUserStore();
  // Handle update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    // const success = await updateAdmin(formData.password, admin._id);

    // if (success) {
    //   onClose();
    // }
  };

  // Handle delete
  const handleDelete = async () => {
    if (
      globalThis.confirm(`Are you sure you want to delete ${admin.lastName}?`)
    ) {
      setisDeleting(true);
      const success = await deleteAdmin(admin._id);
      setisDeleting(false);

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
            <h2 className="text-2xl font-bold text-gray-900">Edit Admin</h2>
            <p className="text-sm text-gray-500 mt-1">
              Update admin information
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
          <div className="flex flex-col">
            <label
              htmlFor="fullName"
              className="text-sm font-medium text-gray-900 mb-2"
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={admin.firstName + " " + admin.lastName}
              readOnly
              placeholder="Yazen adnnan"
              className="w-full px-4  placeholder:text-gray-400 py-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <form onSubmit={handleUpdate} className="space-y-5">
            {/* Name */}
            <div className="flex flex-col">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-900 mb-2"
              >
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={admin.phoneNo}
                disabled={isSubmitting}
                readOnly
                placeholder="07xxxxxxxxx"
                className="px-4  placeholder:text-gray-400 py-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role *
            </label>
            <div className="relative">
              <input
                readOnly
                value={admin.role}
                disabled={isSubmitting}
                className="w-full pl-5 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></input>
            </div>
            <button
              type="button"
              onClick={() => setShowPasswordSection((p) => !p)}
              className="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Key className="w-4 h-4" />
              Change Password
            </button>
            {showPasswordSection && (
              <>
                <div className="bg-blue-100 rounded-lg  w-full max-w-2xl max-h-[90vh] p-7 overflow-hidden flex flex-col space-y-6">
                  <div className="flex flex-col">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-900 mb-2"
                    >
                      New password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={formData.password}
                      disabled={isSubmitting}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                      }}
                      placeholder="Enter new Password"
                      className="px-4  placeholder:text-gray-400 py-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="confirmationPassword"
                      className="text-sm font-medium text-gray-900 mb-2"
                    >
                      Confirmation Password
                    </label>
                    <input
                      id="confirmationPassword"
                      type="password"
                      value={formData.confirmPassword}
                      disabled={isSubmitting}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        });
                      }}
                      placeholder="Re-enter password"
                      className="px-4  placeholder:text-gray-400 py-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </>
            )}
            {/* Delete */}
            <div className="pt-6 border-t border-gray-200">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 h-[50px] content-center bg-red-100 rounded-lg">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-red-900">
                      Delete Admin
                    </h4>
                    <p className="text-sm text-red-700 mt-1">
                      This action cannot be undone.
                    </p>
                    <button
                      disabled={isSubmitting}
                      type="button"
                      onClick={handleDelete}
                      className="cursor-pointer mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      {isDeleting ? (
                        <Loader className="animate-spin" />
                      ) : (
                        "Delete Admin"
                      )}
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
                className="px-6 py-3 border cursor-pointer border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 cursor-pointer bg-black text-white rounded-lg hover:bg-gray-800"
              >
                {isSubmitting ? (
                  <Loader className="animate-spin" />
                ) : (
                  "Save changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAdminsModal;

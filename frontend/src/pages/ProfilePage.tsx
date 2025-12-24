import React from "react";
import { useEffect, useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { User } from "../types/user";
import { Key, Loader, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const user: User = useUserStore((state) => state.user);
  const loading = useUserStore((state) => state.loading);
  const getProfile = useUserStore((state) => state.getProfile);

  const { updateAdmin } = useUserStore();

  const isSuperAdmin = user.role === "superAdmin";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  // Updating profile
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.newPassword ||
      !formData.confirmPassword ||
      !formData.oldPassword
    ) {
      return toast.error("Fill in all required fields.");
    }

    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (formData.oldPassword === formData.newPassword) {
      return toast.error(
        "New password must be different from the current password."
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...dataToBeSent } = formData;

    setIsSubmitting(true);
    const success = await updateAdmin(dataToBeSent, user._id);
    setIsSubmitting(false);

    if (success) {
      toast.success("Password changed successfully");
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordSection(false);
      await getProfile();
    }
  };

  return (
    <div className="flex flex-col py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
      <p className="text-gray-500 mt-2 mb-8">
        {isSuperAdmin
          ? "Manage your account settings and preferences"
          : "Your personal information"}
      </p>

      <div className="border border-gray-200 rounded-lg p-8 bg-white w-[40%]">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Profile Information
        </h2>
        <p className="text-gray-500 mb-6">Update your personal information</p>

        <hr className="mb-6 border-gray-200" />

        <form onSubmit={handleUpdate} className="space-y-6">
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
              value={user.firstName + " " + user.lastName}
              readOnly
              className="px-4  placeholder:text-gray-400 py-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
              value={user.phoneNo}
              readOnly
              className="px-4 py-3 border placeholder:text-gray-400 border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {isSuperAdmin && (
            <button
              type="button"
              onClick={() => setShowPasswordSection((p) => !p)}
              className="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Key className="w-4 h-4" />
              Change Password
            </button>
          )}
          {showPasswordSection && isSuperAdmin && (
            <>
              <div className="bg-blue-100 rounded-lg  w-full max-w-2xl max-h-[90vh] p-7 overflow-hidden flex flex-col space-y-6">
                <div className="flex flex-col">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-900 mb-2"
                  >
                    Current password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showOldPassword ? "text" : "password"}
                      value={formData.oldPassword}
                      disabled={isSubmitting}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          oldPassword: e.target.value,
                        });
                      }}
                      placeholder="Enter current Password"
                      className="px-4  placeholder:text-gray-400 py-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showOldPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="newPassword"
                    className="text-sm font-medium text-gray-900 mb-2"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={formData.newPassword}
                      disabled={isSubmitting}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          newPassword: e.target.value,
                        });
                      }}
                      placeholder="enter new password"
                      className="px-4  placeholder:text-gray-400 py-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="confirmationPassword"
                    className="text-sm font-medium text-gray-900 mb-2"
                  >
                    Confirmation Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmationPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      disabled={isSubmitting}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        });
                      }}
                      placeholder="Re-enter password"
                      className="px-4  placeholder:text-gray-400 py-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
          {isSuperAdmin && (
            <button
              type="submit"
              disabled={!showPasswordSection}
              className="px-6 py-3 cursor-pointer bg-black text-white rounded-lg hover:bg-gray-800"
            >
              {isSubmitting ? (
                <Loader className="animate-spin" />
              ) : (
                "Update Profile"
              )}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;

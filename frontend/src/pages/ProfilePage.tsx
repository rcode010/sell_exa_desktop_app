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
  const changePassword = useUserStore((state) => state.changePassword);

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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.newPassword || !formData.confirmPassword || !formData.oldPassword) {
      return toast.error("Fill in all required fields.");
    }
    if (formData.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (formData.oldPassword === formData.newPassword) {
      return toast.error("New password must be different from the current password.");
    }

    setIsSubmitting(true);
    const success = await changePassword(formData.oldPassword, formData.newPassword);
    setIsSubmitting(false);

    if (success) {
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordSection(false);
      await getProfile();
    }
  };

  return (
    <div className="flex flex-col py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
      <p className="text-gray-500 mt-2 mb-8">
        Manage your account settings and preferences
      </p>

      <div className="border border-gray-200 rounded-lg p-8 bg-white w-[40%]">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Profile Information</h2>
        <p className="text-gray-500 mb-6">Update your personal information</p>
        <hr className="mb-6 border-gray-200" />

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900 mb-2">Full Name</span>
            <div className="px-4 py-3 border border-gray-200 rounded-md bg-gray-50 text-gray-900">
              {user.firstName} {user.lastName}
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900 mb-2">Phone Number</span>
            <div className="px-4 py-3 border border-gray-200 rounded-md bg-gray-50 text-gray-900">
              {user.phoneNo}
            </div>
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
            <div className="bg-blue-100 rounded-lg w-full max-w-2xl max-h-[90vh] p-7 overflow-hidden flex flex-col space-y-6">
              <div className="flex flex-col">
                <label htmlFor="password" className="text-sm font-medium text-gray-900 mb-2">
                  Current password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showOldPassword ? "text" : "password"}
                    value={formData.oldPassword}
                    disabled={isSubmitting}
                    onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                    placeholder="Enter current Password"
                    className="px-4 placeholder:text-gray-400 py-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col">
                <label htmlFor="newPassword" className="text-sm font-medium text-gray-900 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={formData.newPassword}
                    disabled={isSubmitting}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    placeholder="Enter new password"
                    className="px-4 placeholder:text-gray-400 py-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formData.newPassword && formData.newPassword.length < 6 && (
                  <p className="text-red-600 text-sm mt-2">Password must be at least 6 characters long</p>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="confirmationPassword" className="text-sm font-medium text-gray-900 mb-2">
                  Confirmation Password
                </label>
                <div className="relative">
                  <input
                    id="confirmationPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    disabled={isSubmitting}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Re-enter password"
                    className="px-4 placeholder:text-gray-400 py-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                  <p className="text-red-600 text-sm mt-2">Passwords do not match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !formData.newPassword ||
                  !formData.confirmPassword ||
                  formData.newPassword.length < 6 ||
                  formData.newPassword !== formData.confirmPassword
                }
                className="px-6 py-3 mt-4 cursor-pointer bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed self-start text-sm"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2 text-sm">
                    <Loader className="animate-spin w-4 h-4" /> Updating...
                  </div>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          )}
        </form>
      </div>

      <div className="border border-gray-200 rounded-lg p-8 bg-white w-[40%] mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Application</h2>
        <p className="text-gray-500 mb-6">Manage application updates and view version</p>
        <hr className="mb-6 border-gray-200" />
        <AppVersionSection />
      </div>
    </div>
  );
};

const AppVersionSection = () => {
  const [version, setVersion] = useState<string>("...");
  const [updateStatus, setUpdateStatus] = useState<{
    type: "idle" | "checking" | "available" | "not-available" | "downloaded" | "error";
    version?: string;
    message?: string;
  }>({ type: "idle" });

  useEffect(() => {
    window.app.getVersion().then(setVersion);

    const unsubscribe = window.app.onUpdateStatus((status) => {
      console.log("Update status received:", status);
      switch (status.type) {
        case "checking-for-update":
          setUpdateStatus({ type: "checking" });
          break;
        case "update-available":
          setUpdateStatus({ type: "available", version: status.version });
          toast.success(`Update available: v${status.version} — downloading...`);
          break;
        case "update-not-available":
          setUpdateStatus({ type: "not-available" });
          break;
        case "update-downloaded":
          setUpdateStatus({ type: "downloaded" });
          break;
        case "error":
          setUpdateStatus({ type: "error", message: status.message });
          toast.error(`Update error: ${status.message}`);
          break;
      }
    });

    return unsubscribe;
  }, []);

  const handleCheckForUpdates = () => {
    setUpdateStatus({ type: "checking" });
    window.app.checkForUpdates();
  };

  const handleRestartAndInstall = () => {
    window.ipcRenderer.invoke("restart-and-install");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">Current Version</p>
          <p className="text-sm text-gray-500">v{version}</p>
        </div>
        <button
          onClick={handleCheckForUpdates}
          disabled={updateStatus.type === "checking" || updateStatus.type === "downloaded"}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
        >
          {updateStatus.type === "checking" ? (
            <div className="flex items-center gap-2">
              <Loader className="animate-spin w-4 h-4" />
              Checking...
            </div>
          ) : (
            "Check for Updates"
          )}
        </button>
      </div>

      {updateStatus.type === "not-available" && (
        <p className="text-sm text-green-600 font-medium">
          ✓ You are on the latest version.
        </p>
      )}

      {updateStatus.type === "available" && (
        <div className="flex items-center gap-2">
          <Loader className="animate-spin w-4 h-4 text-blue-600" />
          <p className="text-sm text-blue-600 font-medium">
            Downloading v{updateStatus.version}...
          </p>
        </div>
      )}

      {updateStatus.type === "downloaded" && (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
          <div>
            <p className="text-sm font-medium text-green-800">Update ready to install</p>
            <p className="text-xs text-green-600 mt-0.5">The app will restart to apply the update</p>
          </div>
          <button
            onClick={handleRestartAndInstall}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
          >
            Restart & Install
          </button>
        </div>
      )}

      {updateStatus.type === "error" && (
        <p className="text-sm text-red-600 font-medium">
          ✗ Update failed: {updateStatus.message}
        </p>
      )}
    </div>
  );
};

export default ProfilePage;
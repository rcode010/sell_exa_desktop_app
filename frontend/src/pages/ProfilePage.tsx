import { useEffect, useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { User } from "../types/user";

const ProfilePage = () => {
  const { loading, user, getProfile } = useUserStore() as {
    loading: boolean;
    user: User;
    getProfile: () => void;
  };
  const isSuperAdmin = user.role === "superAdmin";
  const [FormData, setFormData] = useState({
    firstName: String,
    lastName: String,
    phoneNo: String,
  });
  useEffect(() => {
    getProfile();
  }, []);
  console.log(user);
  // Updating profile
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile updated");
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

        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Yazen adnnan"
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
              type="test"
              value={user.phoneNo}
              readOnly={!isSuperAdmin}
              placeholder="07xxxxxxxxx"
              className="px-4 py-3 border placeholder:text-gray-400 border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {isSuperAdmin ?
            <button type='submit' className='w-full py-3 cursor-pointer bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors font-medium'>Update Profile</button>
            :
            ''}
          
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;

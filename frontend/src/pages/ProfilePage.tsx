import { useEffect } from "react";
import { useUserStore } from "../stores/useUserStore";
import { User } from "../types/user";
import Loader from "../components/ui/Loader";

const ProfilePage = () => {
  
  
  
   const {user,loading,  getProfile } = useUserStore() as {
    user: User;
    loading:boolean;
    getProfile: () => void;
  };
  
  useEffect(() => {
    getProfile();
  }, []);
  
  if(loading){
    return <Loader/>
  }
  return (
    <div className="flex justify-start items-start p-8 min-h-screen ">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 text-start">Profile</h1>
        <p className="text-gray-500 mt-2 mb-8 text-start">
          Your personal information
        </p>

        <div className="border border-gray-200 rounded-lg p-8 bg-white">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Profile Information
          </h2>
          <p className="text-gray-500 mb-6">View your personal details</p>

          <hr className="mb-6 border-gray-200" />

          <div className="space-y-6">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-900 mb-2">
                Full Name
              </label>
              <p className="px-4 py-3 border border-gray-200 rounded-md bg-gray-50 text-gray-900">
                {user.firstName + " " + user.lastName}
              </p>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-900 mb-2">
                Phone Number
              </label>
              <p className="px-4 py-3 border border-gray-200 rounded-md bg-gray-50 text-gray-900">
                {user.phoneNo}
              </p>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-900 mb-2">
                Role
              </label>
              <p className="px-4 py-3 border border-gray-200 rounded-md bg-gray-50 text-gray-900 capitalize">
                {user.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
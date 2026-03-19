import React from "react";
import { Eye } from "lucide-react";
import { User } from "../../types/user";

const AdminInstance = ({
  admin,
  onViewDetails,
}: {
  admin: User;
  onViewDetails: (admin: User) => void;
}) => {
  return (
    <tr key={admin._id} className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">

          <span className="text-sm font-medium text-gray-900">
            {admin.firstName}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">
            {admin.lastName}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">
            {admin.phoneNo}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">
            {admin.role}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          onClick={() => onViewDetails(admin)}
        >
          <Eye className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
};

export default AdminInstance;

import React from "react";
import { Seller } from "../../types/seller";
import { Eye, Phone } from "lucide-react";

const SellerInstance = ({
  seller,
  onViewDetails,
}: {
  seller: Seller;
  onViewDetails: () => void;
}) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
        {seller.storeName}
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Phone className="w-3 h-3 text-gray-400" />
            {seller.phoneNo}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <button
          className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          onClick={onViewDetails}
        >
          <Eye size={18} />
        </button>
      </td>
    </tr>
  );
};

export default SellerInstance;

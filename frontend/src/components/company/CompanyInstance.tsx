import React, { memo } from "react";
import { Company } from "../../types/company";
import { Building2, Eye } from "lucide-react";

const CompanyInstance = memo(({
  company,
  onViewDetails,
}: {
  company: Company;
  onViewDetails: (company: Company) => void;
}) => {
  return (
    <tr key={company._id} className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            {company.logoLink ? (
              <img
                src={company.logoLink}
                alt={`${company.name} logo`}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <Building2 className="w-4 h-4 text-gray-600" />
            )}
          </div>
          <span className="text-sm font-medium text-gray-900">
            {company.name}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">
            {company.models?.length}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          onClick={() => onViewDetails(company)}
        >
          <Eye className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
});

export default CompanyInstance;

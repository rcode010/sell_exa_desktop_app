import React, { useEffect, useState } from "react";
import { X, Eye, Building2, RefreshCw } from "lucide-react";
import { Company } from "../../types/company";
import { useCompanyStore } from "../../stores/useCompanyStore";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";
import Loader from "../ui/Loader";

const HiddenCompaniesModal = ({ onClose }: { onClose: () => void }) => {
    const [hiddenCompanies, setHiddenCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(false);
    const [isToggling, setIsToggling] = useState(false);
    const hideCompany = useCompanyStore((state) => state.hideCompany);

    const fetchHiddenCompanies = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/api/company/hidden");
            if (response.data.success) {
                setHiddenCompanies(response.data.data);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to fetch hidden companies");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHiddenCompanies();
    }, []);

    const handleShowCompany = async (id: string, name: string) => {
        const confirmed = window.confirm(`Are you sure you want to show ${name}?`);
        if (!confirmed) return;

        setIsToggling(true);
        const success = await hideCompany(id);
        if (success) {
            setHiddenCompanies((prev) => prev.filter((c) => c._id !== id));
        }
        setIsToggling(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Eye className="w-6 h-6 text-gray-500" />
                            Hidden Companies
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Companies that have been removed from the main view
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={fetchHiddenCompanies}
                            disabled={loading || isToggling}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Refresh hidden companies"
                        >
                            <RefreshCw className={`w-5 h-5 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={onClose}
                            disabled={isToggling}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <X className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader />
                        </div>
                    ) : hiddenCompanies.length === 0 ? (
                        <div className="text-center py-12">
                            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No hidden companies found.</p>
                        </div>
                    ) : (
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Company Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {hiddenCompanies.map((company) => (
                                        <tr key={company._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {company.name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    disabled={loading || isToggling}
                                                    onClick={() => handleShowCompany(company._id, company.name)}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-md transition-colors text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Show Company
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HiddenCompaniesModal;
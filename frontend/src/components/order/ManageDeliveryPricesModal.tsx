import React, { useEffect, useState } from "react";
import { X, Loader, Plus, Edit2, Trash2, Map, Banknote } from "lucide-react";
import { useWeightStore } from "../../stores/useWeightStore";
import { Weight } from "../../types/weight";

const ManageDeliveryPricesModal = ({ onClose }: { onClose: () => void }) => {
    const {
        weights,
        loading,
        getWeights,
        createWeight,
        updateWeight,
        deleteWeight,
    } = useWeightStore();

    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form states for Add / Edit
    const [range, setRange] = useState("");
    const [price, setPrice] = useState("");

    useEffect(() => {
        getWeights();
    }, [getWeights]);

    const handleCreate = async () => {
        if (!range || !price) {
            alert("Please fill in both range and price");
            return;
        }
        const success = await createWeight({
            range: Number(range),
            price: Number(price),
        });
        if (success) {
            setIsAdding(false);
            setRange("");
            setPrice("");
        }
    };

    const startEdit = (weight: Weight) => {
        setEditingId(weight._id);
        setRange(weight.range.toString());
        setPrice(weight.price.toString());
    };

    const cancelEdit = () => {
        setEditingId(null);
        setRange("");
        setPrice("");
    };

    const handleUpdate = async (id: string) => {
        if (!range || !price) {
            alert("Please fill in both range and price");
            return;
        }
        const success = await updateWeight(id, {
            range: Number(range),
            price: Number(price),
        });
        if (success) {
            cancelEdit();
        }
    };

    const handleDelete = async (id: string, rangeValue: number) => {
        if (window.confirm(`Are you sure you want to delete the delivery setting for range ${rangeValue}KM?`)) {
            await deleteWeight(id);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            {/* Modal Container */}
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Delivery Prices</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage fixed prices based on distance ranges
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Modal Body - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Header Action */}
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Pricing List</h3>
                        {!isAdding && (
                            <button
                                disabled={loading}
                                onClick={() => setIsAdding(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus className="w-4 h-4" />
                                Add Range
                            </button>
                        )}
                    </div>

                    {/* Add New Section */}
                    {isAdding && (
                        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-700 mb-4">Add New Delivery Price</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Distance Range (Max KM) *
                                    </label>
                                    <div className="relative">
                                        <Map className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="number"
                                            value={range}
                                            onChange={(e) => setRange(e.target.value)}
                                            disabled={loading}
                                            placeholder="e.g., 20"
                                            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Price (IQD) *
                                    </label>
                                    <div className="relative">
                                        <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            disabled={loading}
                                            placeholder="e.g., 5000"
                                            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setIsAdding(false)}
                                    disabled={loading}
                                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreate}
                                    disabled={loading}
                                    className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader className="w-4 h-4 animate-spin" /> : "Save"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* List Section */}
                    <div className="bg-white border md:border-gray-200 rounded-xl overflow-hidden">
                        {weights.length === 0 && !loading && !isAdding ? (
                            <div className="p-8 text-center text-gray-500">
                                <Map className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                <p>No delivery price ranges defined yet.</p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200 hidden md:table-header-group">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Range (Max KM)
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Price (IQD)
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {weights.map((w) => (
                                        <tr key={w._id} className="block md:table-row hover:bg-gray-50 p-4 md:p-0">
                                            {editingId === w._id ? (
                                                <>
                                                    <td className="px-6 py-4 md:table-cell block">
                                                        <input
                                                            type="number"
                                                            value={range}
                                                            onChange={(e) => setRange(e.target.value)}
                                                            disabled={loading}
                                                            className="w-full md:w-32 px-2 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 md:table-cell block">
                                                        <input
                                                            type="number"
                                                            value={price}
                                                            onChange={(e) => setPrice(e.target.value)}
                                                            disabled={loading}
                                                            className="w-full md:w-32 px-2 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 text-right md:table-cell flex gap-2 justify-end mt-2 md:mt-0">
                                                        <button
                                                            onClick={cancelEdit}
                                                            disabled={loading}
                                                            className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdate(w._id)}
                                                            disabled={loading}
                                                            className="px-3 py-1.5 text-xs font-medium bg-black text-white rounded-md hover:bg-gray-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[60px]"
                                                        >
                                                            {loading ? <Loader className="w-3 h-3 animate-spin" /> : "Save"}
                                                        </button>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="px-6 py-4 whitespace-nowrap md:table-cell flex justify-between">
                                                        <span className="md:hidden text-gray-500 text-sm font-medium">Range:</span>
                                                        <span className="text-sm font-medium text-gray-900">Up to {w.range} KM</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap md:table-cell flex justify-between">
                                                        <span className="md:hidden text-gray-500 text-sm font-medium">Price:</span>
                                                        <span className="text-sm text-gray-600 font-medium">{w.price.toLocaleString()} IQD</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium md:table-cell block mt-2 md:mt-0">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => startEdit(w)}
                                                                disabled={loading || isAdding || editingId !== null}
                                                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                                title="Edit"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(w._id, w.range)}
                                                                disabled={loading || isAdding || editingId !== null}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageDeliveryPricesModal;

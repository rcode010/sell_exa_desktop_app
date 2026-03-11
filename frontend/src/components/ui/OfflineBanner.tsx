import React, { useEffect, useState, useCallback } from "react";
import { WifiOff, RefreshCw, X } from "lucide-react";
import { useOrderStore } from "../../stores/useOrderStore";
import { useSellerStore } from "../../stores/useSellerStore";
import { useCompanyStore } from "../../stores/useCompanyStore";
import { useProductStore } from "../../stores/useProductStore";
import { useUserStore } from "../../stores/useUserStore";
import { useWeightStore } from "../../stores/useWeightStore";
import { useModelStore } from "../../stores/useModelStore";

/** Returns a human-readable "X min ago" / "X hr ago" string */
function formatAgo(ts: number | null): string {
    if (!ts) return "unknown";
    const diffMs = Date.now() - ts;
    const diffMin = Math.floor(diffMs / 60_000);
    if (diffMin < 1) return "just now";
    if (diffMin < 60) return `${diffMin} min ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} hr ago`;
    const diffDays = Math.floor(diffHr / 24);
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

const OfflineBanner: React.FC = () => {
    const [dismissed, setDismissed] = useState(false);
    const [, forceRender] = useState(0); // tick to re-compute "X min ago"

    // Offline flags
    const ordersOffline = useOrderStore((s) => s.isOffline);
    const sellersOffline = useSellerStore((s) => s.isOffline);
    const companiesOffline = useCompanyStore((s) => s.isOffline);
    const productsOffline = useProductStore((s) => s.isOffline);
    const adminsOffline = useUserStore((s) => (s as any).adminsOffline as boolean);
    const weightsOffline = useWeightStore((s) => s.isOffline);
    const modelsOffline = useModelStore((s) => s.isOffline);

    // lastUpdated timestamps
    const ordersTs = useOrderStore((s) => s.lastUpdated);
    const sellersTs = useSellerStore((s) => s.lastUpdated);
    const companiesTs = useCompanyStore((s) => s.lastUpdated);
    const productsTs = useProductStore((s) => s.lastUpdated);
    const adminsTs = useUserStore((s) => (s as any).adminsLastUpdated as number | null);
    const weightsTs = useWeightStore((s) => s.lastUpdated);
    const modelsTs = useModelStore((s) => s.lastUpdated);

    // Fetch actions for retry
    const getOrders = useOrderStore((s) => s.getOrders);
    const getAllSellers = useSellerStore((s) => s.getAllSellers);
    const getCompanies = useCompanyStore((s) => s.getCompanies);
    const getProducts = useProductStore((s) => s.getProducts);
    const getAllAdmins = useUserStore((s) => s.getAllAdmins);
    const getWeights = useWeightStore((s) => s.getWeights);
    const getModels = useModelStore((s) => s.getModels);

    const isAnyOffline =
        ordersOffline ||
        sellersOffline ||
        companiesOffline ||
        productsOffline ||
        adminsOffline ||
        weightsOffline ||
        modelsOffline;

    // Pick the most recent successful update time
    const timestamps = [
        ordersTs,
        sellersTs,
        companiesTs,
        productsTs,
        adminsTs,
        weightsTs,
        modelsTs,
    ].filter((t): t is number => t !== null);
    const latestTs = timestamps.length > 0 ? Math.max(...timestamps) : null;

    // Re-dismiss when connectivity returns
    useEffect(() => {
        if (!isAnyOffline) setDismissed(false);
    }, [isAnyOffline]);

    // Refresh "X min ago" every minute
    useEffect(() => {
        if (!isAnyOffline) return;
        const id = setInterval(() => forceRender((n) => n + 1), 60_000);
        return () => clearInterval(id);
    }, [isAnyOffline]);

    const handleRetry = useCallback(async () => {
        // getModels requires a companyId, which we don't naturally have here easily
        // but typically models are fetched when a company is selected.
        // For the banner retry, we can try to retry the ones that don't need params.
        await Promise.allSettled([
            getOrders(),
            getAllSellers(),
            getCompanies(),
            getProducts(),
            getAllAdmins(),
            getWeights(),
        ]);
    }, [getOrders, getAllSellers, getCompanies, getProducts, getAllAdmins, getWeights]);

    if (!isAnyOffline || dismissed) return null;

    return (
        <div
            role="alert"
            className="flex items-center gap-3 px-5 py-3 bg-amber-50 border-b border-amber-200 text-amber-800 text-sm select-none"
            style={{ animation: "slideDown 0.25s ease-out" }}
        >
            {/* Icon */}
            <WifiOff className="w-4 h-4 shrink-0 text-amber-500" />

            {/* Message */}
            <span className="flex-1 font-medium">
                You&apos;re viewing offline data
                {latestTs && (
                    <span className="font-normal text-amber-700">
                        {" "}— last updated {formatAgo(latestTs)}
                    </span>
                )}
            </span>

            {/* Retry button */}
            <button
                onClick={handleRetry}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-100 hover:bg-amber-200 transition-colors text-amber-800 font-medium cursor-pointer"
                title="Try to reconnect"
            >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry
            </button>

            {/* Dismiss */}
            <button
                onClick={() => setDismissed(true)}
                className="p-1 hover:bg-amber-100 rounded transition-colors cursor-pointer text-amber-600"
                title="Dismiss"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default OfflineBanner;

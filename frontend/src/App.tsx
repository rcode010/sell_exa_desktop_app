import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore.ts";
import { User } from "./types/user.ts";

import Loader from "./components/ui/Loader.tsx";
import ErrorBoundary from "./components/errors/ErrorBoundary.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import MainLayout from "./components/layout/MainLayout.tsx";

const OrdersPage = lazy(() => import("./pages/OrdersPage.tsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage.tsx"));
const ProductsPage = lazy(() => import("./pages/ProductsPage.tsx"));
const SellersPage = lazy(() => import("./pages/SellersPage.tsx"));
const CompaniesPage = lazy(() => import("./pages/CompaniesPage.tsx"));
const AdminsPage = lazy(() => import("./pages/AdminsPage.tsx"));

const UpdateBanner = () => {
  const handleRestartAndInstall = () => {
    window.ipcRenderer.invoke("restart-and-install");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center justify-between gap-4 bg-green-700 text-white px-5 py-3 rounded-xl shadow-lg">
      <div>
        <p className="text-sm font-semibold">Update ready to install</p>
        <p className="text-xs text-green-200 mt-0.5">Restart the app to apply the latest update</p>
      </div>
      <button
        onClick={handleRestartAndInstall}
        className="px-4 py-2 text-sm font-medium bg-white text-green-700 rounded-lg hover:bg-green-50 transition-colors whitespace-nowrap"
      >
        Restart & Install
      </button>
    </div>
  );
};

const App = () => {
  const user: User | null = useUserStore((state) => state.user);
  const isHydrated = useUserStore((state) => state.isHydrated);
  const checkingAuth = useUserStore((state) => state.checkingAuth);
  const initAuth = useUserStore((state) => state.initAuth);

  const [updateDownloaded, setUpdateDownloaded] = useState(false);

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (isHydrated && !hasInitialized.current) {
      hasInitialized.current = true;
      initAuth();
    }
  }, [initAuth, isHydrated]);

  // Global update listener — always active regardless of current page
  useEffect(() => {
    const unsubscribe = window.app.onUpdateStatus((status) => {
      if (status.type === "update-downloaded") {
        setUpdateDownloaded(true);
      }
    });
    return unsubscribe;
  }, []);

  if (!isHydrated || checkingAuth) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center bg-gray-50">
        <Loader />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1F2937",
            color: "#fff",
          },
          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />

      {updateDownloaded && <UpdateBanner />}

      <Suspense fallback={<Loader />}>
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <LoginPage />}
          />

          <Route element={<ProtectedRoute />}>
            <Route
              element={
                <MainLayout>
                  <Outlet />
                </MainLayout>
              }
            >
              <Route path="/" element={<OrdersPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/sellers" element={<SellersPage />} />
              <Route path="/companies" element={<CompaniesPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              <Route element={<ProtectedRoute allowedRoles={["superAdmin"]} />}>
                <Route path="/admins" element={<AdminsPage />} />
              </Route>
            </Route>
          </Route>

          <Route
            path="*"
            element={<Navigate to={user ? "/" : "/login"} replace />}
          />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
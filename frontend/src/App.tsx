import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { lazy, Suspense, useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage.tsx";
import { useUserStore } from "./stores/useUserStore.ts";
import { User } from "./types/user.ts";

import SidebarLoader from "./components/ui/SidebarLoader.tsx";
import LogsPage from "./pages/LogsPage.tsx";
import Loader from "./components/ui/Loader.tsx";
import AdminsPage from "./pages/AdminsPage.tsx";
import ErrorBoundary from "./components/errors/ErrorBoundary.tsx";

// Lazy-loaded components
const SideBar = lazy(() => import("./components/layout/SideBar.tsx"));
const OrdersPage = lazy(() => import("./pages/OrdersPage.tsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage.tsx"));
const ProductsPage = lazy(() => import("./pages/ProductsPage.tsx"));
const SellersPage = lazy(() => import("./pages/SellersPage.tsx"));
const CompaniesPage = lazy(() => import("./pages/CompaniesPage.tsx"));

const App = () => {
  // Get states and actions from user store | the individual selectors help in preventing unnecessary re-renders
  const user: User = useUserStore((state) => state.user);
  const isHydrated = useUserStore((state) => state.isHydrated);
  const accessToken = useUserStore((state) => state.accessToken);
  const refreshAuth = useUserStore((state) => state.refreshAuth);
  const checkingAuth = useUserStore((state) => state.checkingAuth);
  const getProfile = useUserStore((state) => state.getProfile);

  useEffect(() => {
    const initAuth = async () => {
      if (!isHydrated) return;

      // Check if refresh token exists
      const refreshToken = await window.secureToken.get();

      if (refreshToken && !accessToken) {
        // We have refresh token but no access token refresh the access token
        const success = await refreshAuth();

        if (success) {
          await getProfile();
        }
      } else if (accessToken && !user) {
        // We have access token but no user profile, fetch the profile
        await getProfile();
      } else if (user && !refreshToken && !accessToken) {
        // No tokens but user exists, logout to clear inconsistent state
        await useUserStore.getState().logout();
      }
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated]);

  if (!isHydrated || checkingAuth) {
    // Show loading state while store is hydrating or when access token is being refreshed
    return (
      <div className="min-h-screen w-full flex justify-center items-center bg-gray-50">
        <Loader />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen w-full flex bg-gray-50">
        {/* Toaster Notifications */}
        <Toaster
          position="top-right"
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

        {/* Sidebar */}
        {user && (
          <div className="fixed left-0 top-0 h-full z-20">
            <Suspense fallback={<SidebarLoader />}>
              <SideBar />
            </Suspense>
          </div>
        )}

        {/* Main content */}
        <div
          className={`flex-1 min-h-screen transition-all duration-300 ${
            user ? "ml-80" : "ml-0"
          }`}
        >
          <Suspense fallback={<Loader />}>
            <Routes>
              {/* Public */}
              <Route
                path="/login"
                element={user ? <Navigate to="/" replace /> : <LoginPage />}
              />

              {/* Protected */}
              <Route
                path="/"
                element={
                  user ? <OrdersPage /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/products"
                element={
                  user ? <ProductsPage /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/sellers"
                element={
                  user ? <SellersPage /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/companies"
                element={
                  user ? <CompaniesPage /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/profile"
                element={
                  user ? <ProfilePage /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/logs"
                element={
                  user?.role === "superAdmin" ? (
                    <LogsPage />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/admins"
                element={
                  user?.role === "superAdmin" ? (
                    <AdminsPage />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              {/* Protected */}
              <Route
                path="/"
                element={
                  user ? <OrdersPage /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/products"
                element={
                  user ? <ProductsPage /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/sellers"
                element={
                  user ? <SellersPage /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/companies"
                element={
                  user ? <CompaniesPage /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/profile"
                element={
                  user ? <ProfilePage /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/logs"
                element={
                  user?.role === "superAdmin" ? (
                    <LogsPage />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/admins"
                element={
                  user?.role === "superAdmin" ? (
                    <AdminsPage />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              {/* Fallback */}
              <Route
                path="*"
                element={<Navigate to={user ? "/" : "/login"} replace />}
              />
            </Routes>
          </Suspense>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;

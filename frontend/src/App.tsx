import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore.ts";
import { User } from "./types/user.ts";

import Loader from "./components/ui/Loader.tsx";
import ErrorBoundary from "./components/errors/ErrorBoundary.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import MainLayout from "./components/layout/MainLayout.tsx";

// Laze loaded imports
const OrdersPage = lazy(() => import("./pages/OrdersPage.tsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage.tsx"));
const ProductsPage = lazy(() => import("./pages/ProductsPage.tsx"));
const SellersPage = lazy(() => import("./pages/SellersPage.tsx"));
const CompaniesPage = lazy(() => import("./pages/CompaniesPage.tsx"));
const AdminsPage = lazy(() => import("./pages/AdminsPage.tsx"));

const App = () => {
  // Get states and actions from user store | the individual selectors help in preventing unnecessary re-renders
  const user: User = useUserStore((state) => state.user);
  const isHydrated = useUserStore((state) => state.isHydrated);
  const checkingAuth = useUserStore((state) => state.checkingAuth);
  const initAuth = useUserStore((state) => state.initAuth);

  useEffect(() => {
    // Function to initialize authentication state at app startup
    if (isHydrated) {
      initAuth();
    }
  }, [initAuth, isHydrated]);

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
      {/* Toaster Notifications */}
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

      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <LoginPage />}
          />

          {/* 1. OUTER SHELL: The Authentication Checkpoint */}
          <Route element={<ProtectedRoute />}>
            {/* 2. INNER SHELL: The UI Layout 
                This route doesn't add to the URL path (no path="..."). 
                It just wraps everything inside it with the Sidebar. 
            */}
            <Route
              element={
                <MainLayout>
                  <Outlet />
                </MainLayout>
              }
            >
              {/* 3. THE CONTENT: These render INSIDE MainLayout's <Outlet /> */}
              <Route path="/" element={<OrdersPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/sellers" element={<SellersPage />} />
              <Route path="/companies" element={<CompaniesPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Role Based Route */}
              {/* 4. SPECIAL CASE: A Route inside a Route inside a Route! 
                  This is a "Double Protected" route. 
                  First passed Auth (Layer 1), then got Layout (Layer 2), now checks Role (Layer 4).
              */}
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

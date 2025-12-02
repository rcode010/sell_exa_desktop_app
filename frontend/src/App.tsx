import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { lazy, Suspense } from "react";
import LoginPage from "./pages/LoginPage.tsx";
// import { useUserStore } from "./stores/useUserStore.ts";
// import { User } from "./types/user.ts";

// Lazy-loaded pages
const SideBar = lazy(() => import("./components/SideBar.tsx"));
const OrdersPage = lazy(() => import("./pages/OrdersPage.tsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage.tsx"));
const ProductsPage = lazy(() => import("./pages/ProductsPage.tsx"));
const SellersPage = lazy(() => import("./pages/SellersPage.tsx"));
const CompaniesPage = lazy(() => import("./pages/CompaniesPage.tsx"));

const App = () => {
  // const { user } = useUserStore() as { user: User };
  const user = true;

  return (
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

      {/* Show the sidebar if the user is logged in */}
      {user && (
        <div className="fixed left-0 top-0 h-full z-20">
          {/* Suspense added for lazy-loaded component */}
          <Suspense fallback={<div>Loading sidebar...</div>}>
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
        {/* Suspense added for lazy-loaded pages */}
        <Suspense fallback={<div>Loading page...</div>}>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={user ? <OrdersPage /> : <Navigate to="/login" replace />}
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
              path="*"
              element={<Navigate to={user ? "/" : "/login"} replace />}
            />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

export default App;

/**
 *
 * Hooks
 *
 * useRef => Keeping the state safe from refreshing (timers)
 * useState => Storing state
 * useEffect => Performing side effects
 * useCallback => producing stable functions (functions with one identity)
 * useMemo => used to calculate the result of a heavy computation and reusing it later witout re-calculating it again
 *
 */

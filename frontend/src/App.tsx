import { Route, Routes, Navigate } from "react-router-dom";
import { useUserStore } from "./stores/useUserStore.ts";
import LoginPage from "./pages/LoginPage.tsx";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import SideBar from "./components/SideBar.tsx";
import SelfActionPage from "./pages/SelfActionPage.tsx";
import ProductsPage from "./pages/ProductsPage.tsx";
import SellersPage from "./pages/SellersPage.tsx";
import OrdersPage from "./pages/OrdersPage.tsx";
import CompaniesPage from "./pages/CompaniesPage.tsx";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const App = () => {
  const { user } = useUserStore() as { user: User };

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
          <SideBar />
        </div>
      )}

      {/* Main content */}
      <motion.div
        className={`flex-1 min-h-screen transition-all duration-300 ${
          user ? "ml-80" : "ml-0"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={user ? <OrdersPage /> : <LoginPage />} />
          <Route
            path="/self-actions"
            element={user ? <SelfActionPage /> : <LoginPage />}
          />
          <Route
            path="/products"
            element={user ? <ProductsPage /> : <LoginPage />}
          />
          <Route
            path="/sellers"
            element={user ? <SellersPage /> : <LoginPage />}
          />
          <Route
            path="/companies"
            element={user ? <CompaniesPage /> : <LoginPage />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </motion.div>
    </div>
  );
};

export default App;

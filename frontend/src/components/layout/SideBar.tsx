import React from "react";
import { ShoppingCart, Users, Building2, Package, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore.ts";
import MenuLink from "./MenuLink.tsx";
import { Link } from "react-router-dom";

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useUserStore() as { logout: () => void };

  const menuItems = [
    {
      icon: ShoppingCart,
      label: "Orders",
      path: "/",
      active: location.pathname === "/",
    },
    {
      icon: Users,
      label: "Sellers",
      path: "/sellers",
      active: location.pathname === "/sellers",
    },
    {
      icon: Building2,
      label: "Companies",
      path: "/companies",
      active: location.pathname === "/companies",
    },
    {
      icon: Package,
      label: "Products",
      path: "/products",
      active: location.pathname === "/products",
    },
  ];

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Sellexa</h1>
            <p className="text-sm text-gray-500">Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            return <MenuLink key={index} item={item} />;
          })}
        </ul>
      </nav>

      {/* User Profile Section | profile and notifications icon */}
      <div className="p-4 border-t border-gray-200">
        {/* Bell Icon and User Profile Row */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-700 font-semibold">AU</span>
            </div>

            <div>
              <Link to="/profile">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">Admin</p>
              </Link>
            </div>
          </div>
        </div>

        <button
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SideBar;

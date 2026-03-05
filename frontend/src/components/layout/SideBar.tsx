import React from "react";
import {
  ShoppingCart,
  Users,
  Building2,
  Package,
  LogOut,
  Logs,
  UserCog,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore.ts";
import MenuLink from "./MenuLink.tsx";
import { Link } from "react-router-dom";

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = useUserStore((state) => state.logout);
  const user = useUserStore((state) => state.user);

  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

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
    {
      icon: UserCog,
      label: "Admins",
      path: "/admins",
      active: location.pathname === "/admins",
      superAdminOnly: true,
    },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter((item) => {
    if (item.superAdminOnly) {
      return user?.role === "superAdmin";
    }
    return true;
  });

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = async (confirm: boolean) => {
    setShowLogoutConfirm(false);
    if (confirm) {
      const success = await logout();
      if (success) {
        navigate("/login");
      }
    }
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Log Out?
              </h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to log out? You will need to sign in again to access the management system.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleLogoutConfirm(true)}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  Yes, log out
                </button>
                <button
                  onClick={() => handleLogoutConfirm(false)}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  No, stay logged in
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
          {filteredMenuItems.map((item, index) => {
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
                <p className="text-xs text-gray-500">
                  {user?.role === "superAdmin" ? "Super Admin" : "Admin"}
                </p>
              </Link>
            </div>
          </div>
        </div>

        <button
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SideBar;

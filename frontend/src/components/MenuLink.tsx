import React from "react";
import { useNavigate } from "react-router-dom";

interface MenuLink {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  path: string;
  active: boolean;
}

const MenuLink = ({ item }: { item: MenuLink }) => {
  const navigate = useNavigate();
  const Icon = item.icon;

  return (
    <li>
      <button
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
          item.active
            ? "bg-gray-100 text-gray-900"
            : "text-gray-700 hover:bg-gray-50"
        }`}
        onClick={() => navigate(item.path)}
      >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{item.label}</span>
      </button>
    </li>
  );
};

export default MenuLink;

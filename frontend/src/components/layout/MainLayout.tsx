import React, { ReactNode } from "react";
import SideBar from "./SideBar.tsx";

interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="fixed left-0 top-0 h-full z-20 w-80">
        <SideBar />
      </div>
      {/* The margin is now contained where the sidebar logic lives */}
      <main className="flex-1 ml-80 transition-all duration-300">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;

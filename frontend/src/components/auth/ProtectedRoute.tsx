import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const user = useUserStore((state) => state.user);

  // If no user is found, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if the user has the required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  // Render the child routes
  return <Outlet />;
};

export default ProtectedRoute;

import React from "react";
import { Navigate } from "react-router-dom";
import { useSession } from "@/lib/hooks/useSession";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { getSession } = useSession();
  const session = getSession();

  if (!session) {
    return <Navigate to="/care-home-signin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

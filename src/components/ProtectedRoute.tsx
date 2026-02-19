import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Protects routes that require authentication.
 * Redirects to /login when not authenticated.
 */
export function ProtectedRoute() {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ returnTo: location.pathname }} replace />;
  }

  return <Outlet />;
}

import { Navigate, useLocation } from "react-router-dom";
import { useSupabaseAuthStore } from "../../store/supabaseAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const {
    isAuthenticated,
    isAuthenticating,
    isInitializing,
    userExists,
    userAddress,
  } = useSupabaseAuthStore();
  const location = useLocation();

  // Debug logging
  console.log("🔍 ProtectedRoute state:", {
    isAuthenticated,
    isAuthenticating,
    isInitializing,
    userExists,
    userAddress,
    path: location.pathname,
  });

  // Show loading while initializing JWT or checking authentication
  if (isInitializing || isAuthenticating) {
    console.log(
      "⏳ ProtectedRoute - Initializing or checking authentication..."
    );
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-400"></div>
          <p className="text-neutral-600 text-sm">
            {isInitializing ? "Initializing..." : "Checking authentication..."}
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated → redirect to home
  if (!isAuthenticated) {
    console.log("❌ ProtectedRoute - Not authenticated, redirecting to home");
    return <Navigate to="/" replace />;
  }

  // Authenticated but no user profile → redirect to setup
  if (!userExists) {
    console.log(
      "↩️ ProtectedRoute - User needs profile setup, redirecting to setup"
    );
    return <Navigate to="/setup" state={{ from: location.pathname }} replace />;
  }

  // Authenticated AND has profile → show protected content
  console.log(
    "✅ ProtectedRoute - User authenticated with profile, showing content"
  );
  return <>{children}</>;
};

export default ProtectedRoute;

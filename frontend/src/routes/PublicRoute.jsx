import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

const PublicRoute = ({ children }) => {
  const { user, isLoading } = useAuthStore();

  // Wait until auth check finishes
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Checking session...
      </div>
    );
  }

  // If user exists → block access to login/signup
  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;

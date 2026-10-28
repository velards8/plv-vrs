import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Frontend route guard for the MOCK login. Real access control must be enforced by the Laravel API.
export default function RequireRole({ roles, loginPath = "/login" }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to={loginPath} replace state={{ from: location }} />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  return <Outlet />;
}

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "../components/ui/Loader.jsx";

/**
 * Wrap routes that need a logged-in user:
 *   <Route element={<ProtectedRoute />}> ...routes... </Route>
 * Visitors who aren't signed in are sent to /login and returned afterwards.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="py-24"><Loader /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

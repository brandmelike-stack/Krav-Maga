import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (user === null)
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="overline animate-pulse" data-testid="auth-loading">Authenticating…</div>
      </div>
    );
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
}

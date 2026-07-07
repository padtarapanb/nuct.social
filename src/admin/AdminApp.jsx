import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import { isSupabaseConfigured } from "../lib/supabaseClient";
import Login from "./Login";
import Dashboard from "./Dashboard";

function Protected({ children }) {
  const { session, loading } = useAuth();

  if (!isSupabaseConfigured) return <Login />;
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        กำลังโหลด...
      </div>
    );
  }
  if (!session) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route
          path="*"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

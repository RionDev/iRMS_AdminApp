import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "@common/pages/LoginPage";
import { useAuthStore } from "@common/stores/authStore";
import { adminRoutes } from "./routes";

function AdminEntryRedirect() {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    return (
        <Navigate
            to={
                isAuthenticated
                    ? "/admin/users"
                    : "/login?redirect=/admin/users"
            }
            replace
        />
    );
}

export function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminEntryRedirect />} />
            <Route path="/admin/*" element={adminRoutes} />
            <Route path="*" element={<Navigate to="/admin/users" replace />} />
        </Routes>
    );
}

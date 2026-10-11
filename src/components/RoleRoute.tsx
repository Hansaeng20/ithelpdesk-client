import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/useAuth";
import type { UserRole } from "../services/authService";
import { LoadingState } from "./ui";

interface RoleRouteProps {
    allowedRoles: UserRole[];
}

const RoleRoute = ({
    allowedRoles,
}: RoleRouteProps) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen grid place-items-center"><LoadingState label="Checking access..." /></div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default RoleRoute;

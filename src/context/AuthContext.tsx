import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./auth-context";

import {
    getCurrentUser,
    loginUser,
    registerUser,
    type AuthUser,
    type RegisterData,
} from "../services/authService";

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({
    children,
}: AuthProviderProps) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(() => Boolean(localStorage.getItem("helpdesk_token")));

    useEffect(() => {
        const storedToken =
            localStorage.getItem("helpdesk_token");
        if (!storedToken) return;
        let active = true;
        getCurrentUser().then(currentUser => {
            if (!active) return;
            setToken(storedToken);
            setUser(currentUser);
            localStorage.setItem("helpdesk_user", JSON.stringify(currentUser));
        }).catch(() => {
            if (!active) return;
            localStorage.removeItem("helpdesk_token");
            localStorage.removeItem("helpdesk_user");
        }).finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, []);

    const login = async (
        email: string,
        password: string,
    ) => {
        const response = await loginUser({
            email,
            password,
        });

        localStorage.setItem(
            "helpdesk_token",
            response.token,
        );

        localStorage.setItem(
            "helpdesk_user",
            JSON.stringify(response.user),
        );

        setToken(response.token);
        setUser(response.user);
    };

    const register = async (data: RegisterData) => {
        const response = await registerUser(data);
        localStorage.setItem("helpdesk_token", response.token);
        localStorage.setItem("helpdesk_user", JSON.stringify(response.user));
        setToken(response.token);
        setUser(response.user);
    };

    const logout = () => {
        localStorage.removeItem("helpdesk_token");
        localStorage.removeItem("helpdesk_user");

        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

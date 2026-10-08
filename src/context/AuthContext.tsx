import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import {
    loginUser,
    type AuthUser,
} from "../services/authService";

interface AuthContextValue {
    user: AuthUser | null;
    token: string | null;
    loading: boolean;
    login: (
        email: string,
        password: string,
    ) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<
    AuthContextValue | undefined
>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({
    children,
}: AuthProviderProps) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken =
            localStorage.getItem("helpdesk_token");

        const storedUser =
            localStorage.getItem("helpdesk_user");

        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error(
                    "Unable to restore login session.",
                    error,
                );

                localStorage.removeItem("helpdesk_token");
                localStorage.removeItem("helpdesk_user");
            }
        }

        setLoading(false);
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
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider.",
        );
    }

    return context;
};
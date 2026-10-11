import api from "./api";

export type UserRole = "Employee" | "IT Support";

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    department?: {
        _id: string;
        name: string;
        code: string;
    };
}

interface LoginResponse {
    success: boolean;
    message: string;
    token: string;
    user: AuthUser;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    department: string;
}

interface CurrentUserResponse {
    success: boolean;
    user: {
        _id: string;
        name: string;
        email: string;
        role: UserRole;
        department?: AuthUser["department"];
    };
}

interface RegisterResponse {
    success: boolean;
    message: string;
    token: string;
    user: AuthUser;
}

export const loginUser = async (
    data: LoginData,
): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(
        "/auth/login",
        data,
    );

    return response.data;
};

export const registerUser = async (
    data: RegisterData,
): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>(
        "/auth/register",
        data,
    );

    return response.data;
};

export const getCurrentUser = async (): Promise<AuthUser> => {
    const response = await api.get<CurrentUserResponse>("/auth/me");
    const { _id, name, email, role, department } = response.data.user;
    return { id: _id, name, email, role, department };
};

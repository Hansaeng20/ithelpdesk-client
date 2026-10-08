import api from "./api";
import type { Department } from "../types";

interface DepartmentListResponse {
    success: boolean;
    count: number;
    departments: Department[];
}

interface DepartmentResponse {
    success: boolean;
    department: Department;
}

export const getDepartments =
    async (): Promise<DepartmentListResponse> => {
        const response =
            await api.get<DepartmentListResponse>("/departments");

        return response.data;
    };

export const getDepartment = async (
    id: string,
): Promise<DepartmentResponse> => {
    const response = await api.get<DepartmentResponse>(
        `/departments/${id}`,
    );

    return response.data;
};
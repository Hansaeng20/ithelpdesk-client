import { useEffect, useState } from "react";
import { getDepartments } from "../services/departmentService";
import type { Department } from "../types";

const DepartmentsPage = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDepartments = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getDepartments();

                setDepartments(response.departments);
            } catch (err) {
                console.error(err);
                setError(
                    "Unable to load departments. Please try again.",
                );
            } finally {
                setLoading(false);
            }
        };

        loadDepartments();
    }, []);

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
                <p className="text-sm font-medium text-blue-600">
                    Support Management
                </p>

                <h1 className="mt-1 text-3xl font-bold text-slate-900">
                    Departments
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    View the departments supported by the IT Helpdesk.
                </p>
            </div>

            {/* Loading */}
            {loading && (
                <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                    <p className="text-sm text-slate-500">
                        Loading departments...
                    </p>
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                    <p className="text-sm text-red-700">
                        {error}
                    </p>
                </div>
            )}

            {/* Empty */}
            {!loading &&
                !error &&
                departments.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                        <h2 className="text-base font-semibold text-slate-900">
                            No departments found
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            There are currently no departments available.
                        </p>
                    </div>
                )}

            {/* Departments */}
            {!loading &&
                !error &&
                departments.length > 0 && (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {departments.map((department) => (
                            <DepartmentCard
                                key={department._id}
                                department={department}
                            />
                        ))}
                    </div>
                )}
        </div>
    );
};

interface DepartmentCardProps {
    department: Department;
}

const DepartmentCard = ({
    department,
}: DepartmentCardProps) => {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">
                        {department.name}
                    </h2>

                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
                        {department.code}
                    </p>
                </div>

                <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${department.isActive
                        ? "bg-green-50 text-green-700"
                        : "bg-slate-100 text-slate-600"
                        }`}
                >
                    {department.isActive
                        ? "Active"
                        : "Inactive"}
                </span>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-500">
                {department.description ||
                    "No description available."}
            </p>
        </div>
    );
};

export default DepartmentsPage;
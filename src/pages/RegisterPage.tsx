import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
} from "react-router-dom";

import { registerUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { getDepartments } from "../services/departmentService";

import type { Department } from "../types";

const RegisterPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [department, setDepartment] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [departments, setDepartments] = useState<
        Department[]
    >([]);

    const [loadingDepartments, setLoadingDepartments] =
        useState(true);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDepartments = async () => {
            try {
                setLoadingDepartments(true);

                const response = await getDepartments();

                setDepartments(response.departments);
            } catch (err) {
                console.error(err);

                setError(
                    "Unable to load departments. Please try again.",
                );
            } finally {
                setLoadingDepartments(false);
            }
        };

        loadDepartments();
    }, []);

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        setError("");

        if (!department) {
            setError("Please select your department.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError(
                "Password must be at least 6 characters.",
            );
            return;
        }

        try {
            setLoading(true);

            const response = await registerUser({
                name,
                email,
                password,
                department,
            });

            await login(email, password);

            navigate("/dashboard", {
                replace: true,
            });

            console.log(response.message);
        } catch (err) {
            console.error(err);

            setError(
                "Unable to create your account. The email may already be registered.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="mb-8 text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-3"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
                            IT
                        </div>

                        <span className="text-xl font-bold text-white">
                            IT Helpdesk
                        </span>
                    </Link>

                    <h1 className="mt-8 text-3xl font-bold text-white">
                        Create your account
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">
                        Register as an employee to submit and
                        manage your IT support requests.
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-slate-800 bg-white p-6 shadow-xl sm:p-8"
                >
                    {error && (
                        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="space-y-5">

                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Full Name
                            </label>

                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                placeholder="Juan Dela Cruz"
                                className="input"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                placeholder="you@example.com"
                                className="input"
                                required
                            />
                        </div>

                        {/* Department */}
                        <div>
                            <label
                                htmlFor="department"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Department
                            </label>

                            <select
                                id="department"
                                value={department}
                                onChange={(event) =>
                                    setDepartment(event.target.value)
                                }
                                className="input"
                                disabled={loadingDepartments}
                                required
                            >
                                <option value="">
                                    {loadingDepartments
                                        ? "Loading departments..."
                                        : "Select your department"}
                                </option>

                                {departments.map((item) => (
                                    <option
                                        key={item._id}
                                        value={item._id}
                                    >
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                placeholder="At least 6 characters"
                                className="input"
                                minLength={6}
                                required
                            />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Confirm Password
                            </label>

                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(event) =>
                                    setConfirmPassword(
                                        event.target.value,
                                    )
                                }
                                placeholder="Re-enter your password"
                                className="input"
                                minLength={6}
                                required
                            />
                        </div>

                        {/* Account Type */}
                        <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                            <p className="text-xs font-semibold text-blue-700">
                                Account Type
                            </p>

                            <p className="mt-1 text-sm text-blue-800">
                                Employee
                            </p>

                            <p className="mt-1 text-xs text-blue-600">
                                IT Support accounts are created
                                internally.
                            </p>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={
                                loading ||
                                loadingDepartments ||
                                departments.length === 0
                            }
                            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Creating account..."
                                : "Create Account"}
                        </button>
                    </div>
                </form>

                {/* Login */}
                <div className="mt-5 text-center">
                    <p className="text-sm text-slate-400">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-blue-400 hover:text-blue-300"
                        >
                            Sign in
                        </Link>
                    </p>

                    <Link
                        to="/"
                        className="mt-4 inline-block text-sm text-slate-400 hover:text-white"
                    >
                        ← Back to landing page
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
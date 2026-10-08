import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const from =
        location.state?.from?.pathname || "/dashboard";

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        try {
            setLoading(true);
            setError("");

            await login(email, password);

            navigate(from, { replace: true });
        } catch (err) {
            console.error(err);

            setError(
                "Invalid email or password. Please try again.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
            <div className="w-full max-w-md">
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
                        Welcome back
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">
                        Sign in to access your helpdesk account.
                    </p>
                </div>

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
                                placeholder="••••••••"
                                className="input"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </div>
                </form>

                <div className="mt-5 text-center">
                    <p className="text-sm text-slate-400">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-semibold text-blue-400 hover:text-blue-300"
                        >
                            Register as Employee
                        </Link>
                    </p>

                    <Link
                        to="/"
                        className="mt-4 inline-block text-sm text-slate-400 transition hover:text-white"
                    >
                        ← Back to landing page
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthShell } from "../components/AuthShell";
import { ErrorState, Icon } from "../components/ui";
import { useAuth } from "../context/useAuth";

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || "/dashboard";

    const submit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try { setLoading(true); setError(""); await login(email.trim(), password); navigate(from, { replace: true }); }
        catch (err) { console.error(err); setError("We could not sign you in. Check your email and password, then try again."); }
        finally { setLoading(false); }
    };

    return <AuthShell title="Welcome back" description="Sign in to see your requests and keep work moving."><form onSubmit={submit} className="auth-form">{error && <ErrorState message={error} />}<div><label htmlFor="email" className="field-label">Work email</label><input id="email" className="input" type="email" placeholder="you@company.com" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required /></div><div><label htmlFor="password" className="field-label">Password</label><input id="password" className="input" type="password" placeholder="Enter your password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required /></div><button type="submit" disabled={loading} className="btn btn-primary w-full mt-1">{loading ? "Signing in..." : "Sign in"}<Icon name="arrowRight" size={16} /></button></form><div className="auth-footer">New to the helpdesk? <Link to="/register">Create an employee account</Link></div></AuthShell>;
};

export default LoginPage;

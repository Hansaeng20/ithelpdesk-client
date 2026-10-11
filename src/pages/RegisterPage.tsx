import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell } from "../components/AuthShell";
import { ErrorState, Icon } from "../components/ui";
import { useAuth } from "../context/useAuth";
import { getDepartments } from "../services/departmentService";
import type { Department } from "../types";

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loadingDepartments, setLoadingDepartments] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [department, setDepartment] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        getDepartments().then(response => { if (active) setDepartments(response.departments.filter(item => item.isActive)); }).catch(err => { console.error(err); if (active) setError("Departments could not be loaded. Please refresh and try again."); }).finally(() => { if (active) setLoadingDepartments(false); });
        return () => { active = false; };
    }, []);

    const submit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (password !== confirmPassword) { setError("Passwords do not match."); return; }
        if (password.length < 6) { setError("Password must have at least 6 characters."); return; }
        try { setLoading(true); setError(""); await register({ name: name.trim(), email: email.trim(), password, department }); navigate("/dashboard", { replace: true }); }
        catch (err) { console.error(err); setError("We could not create your account. The email may already be in use."); }
        finally { setLoading(false); }
    };

    return <AuthShell title="Create your account" description="Join as an employee to submit and follow IT requests."><form onSubmit={submit} className="auth-form">{error && <ErrorState message={error} />}<div><label className="field-label" htmlFor="name">Full name</label><input className="input" id="name" value={name} onChange={event => setName(event.target.value)} placeholder="Juan Dela Cruz" autoComplete="name" minLength={2} required /></div><div><label className="field-label" htmlFor="email">Work email</label><input className="input" id="email" type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@company.com" autoComplete="email" required /></div><div><label className="field-label" htmlFor="department">Department</label><select className="input" id="department" value={department} onChange={event => setDepartment(event.target.value)} disabled={loadingDepartments} required><option value="">{loadingDepartments ? "Loading departments..." : "Select your department"}</option>{departments.map(item => <option key={item._id} value={item._id}>{item.name}</option>)}</select></div><div className="grid gap-4 sm:grid-cols-2"><div><label className="field-label" htmlFor="password">Password</label><input className="input" id="password" type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="At least 6 characters" autoComplete="new-password" minLength={6} required /></div><div><label className="field-label" htmlFor="confirmPassword">Confirm password</label><input className="input" id="confirmPassword" type="password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} placeholder="Repeat password" autoComplete="new-password" minLength={6} required /></div></div><div className="notice"><Icon name="shield" size={17} /><span>Accounts created here have Employee access. IT Support accounts are provided internally.</span></div><button type="submit" className="btn btn-primary w-full" disabled={loading || loadingDepartments || departments.length === 0 || !department}>{loading ? "Creating account..." : "Create account"}<Icon name="arrowRight" size={16} /></button></form><div className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></div></AuthShell>;
};

export default RegisterPage;
